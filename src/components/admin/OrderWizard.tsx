'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
	Box,
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
	Card,
	CardContent,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
	Autocomplete,
	Alert,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	InputAdornment,
	RadioGroup,
	FormControlLabel,
	Radio,
} from '@mui/material';
import {
	Add as AddIcon,
	Delete as DeleteIcon,
	CheckCircle as CheckCircleIcon,
	Tune as TuneIcon,
} from '@mui/icons-material';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/navigation';
import AdminVariantsDrawer, { VariantSelections } from './AdminVariantsDrawer';
import SquareCard, { SquareCardHandle } from '@/components/checkout/SquareCard';
import shopNowApis, { PriceTier as ShopPriceTier } from '@/services/ShopNowApis';
import { useAppSelector } from '@/store/hooks';

interface CustomerOption {
	id: number;
	first_name: string;
	last_name: string;
	name?: string | null;
	email: string;
	phone?: string;
	price_tier?: { id: number } | null;
	price_tier_id?: number | null;
}

interface ProductOption {
	id: number;
	name: string;
	price?: any;
	sku?: string;
	category?: string;
	price_tiers?: Array<any>;
	stock?: number;
}

interface VariationOption {
	id: number;
	name: string;
	price?: number;
}

interface CartItem {
	itemId: string;
	productId: number;
	variationId?: number;
	name: string;
	quantity: number;
	unitPrice: number;
	discountAmount?: number;
	total: number;
	totalPrice: number;
	variants?: VariantSelections;
	unitPriceLocked?: boolean;
}

interface Address {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

const steps = [
	'Select Customer',
	'Select Products',
	'Billing & Shipping',
	'Notes and Shipping Methods',
	'Payment',
	'Review & Submit',
];

const defaultAddress: Address = { street: '', city: '', state: '', postalCode: '', country: 'US' };

const OrderWizard: React.FC = () => {
	const router = useRouter();

	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const auth = useAppSelector((s: any) => s.auth);

	// Data sets
	const [customers, setCustomers] = useState<CustomerOption[]>([]);
	const [products, setProducts] = useState<ProductOption[]>([]);
	const [variations, setVariations] = useState<VariationOption[]>([]);
	// Remote search
	const [searchInput, setSearchInput] = useState('');
	const [searchResults, setSearchResults] = useState<ProductOption[]>([]);

	// Price tiers context
	const [priceTiers, setPriceTiers] = useState<ShopPriceTier[]>([]);

	// Step 1: customer
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);

	// Step 2: items
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	// variants drawer state
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerRowIndex, setDrawerRowIndex] = useState<number | null>(null);

	// Step 3: addresses and contact
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [shippingAddress, setShippingAddress] = useState<Address>({ ...defaultAddress });
	const [billingAddress, setBillingAddress] = useState<Address>({ ...defaultAddress });

	// Step 4: notes and shipping method (now step index 4)
	const [notes, setNotes] = useState('');
	const [shippingMethod, setShippingMethod] = useState('Standard');

	// Step 5: Payment (now second last step)
	const [paymentOption, setPaymentOption] = useState<'cash' | 'card'>('cash');
	const squareRef = useRef<SquareCardHandle | null>(null);
	const [cardToken, setCardToken] = useState<string | null>(null);
	const [paymentReady, setPaymentReady] = useState(false);

	// Reset readiness when we land on the Payment step
	useEffect(() => {
		const paymentStepIndex = steps.findIndex((s) => s === 'Payment');
		if (activeStep === paymentStepIndex) {
			setPaymentReady(false);
			setCardToken(null);
		}
	}, [activeStep]);

	// Success dialog
	const [successOpen, setSuccessOpen] = useState(false);
	const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

	// Load base data
	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const [customersRes, productsRes, variationsRes, tiersRes] = await Promise.all([
					apiService.getCustomers({ per_page: 100 }),
					apiService.getProducts({ per_page: 100 }),
					apiService.getVariations({ per_page: 200 }),
					shopNowApis.getPriceTiers(),
				]);

				const cDataRaw = (customersRes && (customersRes.data?.data || customersRes.data || customersRes)) as any;
				const cArray = Array.isArray(cDataRaw?.data) ? cDataRaw.data : (Array.isArray(cDataRaw) ? cDataRaw : []);
				setCustomers(cArray);

				const pData = productsRes?.data || productsRes || [];
				setProducts(Array.isArray(pData) ? pData : []);

				const vData = variationsRes?.data || variationsRes || [];
				setVariations(Array.isArray(vData) ? vData : []);

				const tiersPayload = tiersRes?.data ?? tiersRes ?? [];
				setPriceTiers(Array.isArray(tiersPayload) ? tiersPayload : []);
			} catch (e: any) {
				console.error('Error loading wizard data', e);
				setError('Failed to load initial data');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	// Preferred unit price respecting customer's price tier (uses product pivot override if available)
	const getDiscountedPrice = (productId: number): number => {
		const p: any = products.find(p => p.id === productId);
		const raw = p?.price ?? p?.unit_price ?? 0;
		const base = typeof raw === 'string' ? parseFloat(raw) : Number(raw || 0);
		const customerTierId = selectedCustomer?.price_tier_id || (selectedCustomer?.price_tier as any)?.id || null;
		if (!customerTierId) return isNaN(base) ? 0 : base;

		// 1) If product comes with price_tiers and pivot price for this tier, use it
		const productTier = Array.isArray(p?.price_tiers)
			? p.price_tiers.find((t: any) => Number(t.id) === Number(customerTierId))
			: null;
		const pivotPrice = productTier?.pivot?.price_adjustment ? parseFloat(productTier.pivot.price_adjustment) : null;
		if (pivotPrice != null && !Number.isNaN(pivotPrice)) {
			return pivotPrice;
		}

		// 2) Otherwise, compute via global price tiers
		if (priceTiers.length > 0) {
			const fakeUser: any = { role: { price_tier_id: customerTierId } };
			return shopNowApis.getDisplayPrice(base, true, fakeUser, priceTiers);
		}
		return isNaN(base) ? 0 : base;
	};

	// Retail base price (no discount) for passing to variants drawer basePrice
	const getRetailPrice = (productId: number): number => {
		const p: any = products.find(p => p.id === productId);
		const raw = p?.price ?? p?.unit_price ?? 0;
		const base = typeof raw === 'string' ? parseFloat(raw) : Number(raw || 0);
		return isNaN(base) ? 0 : base;
	};

	// Recompute cart prices when selected customer or tiers change (unless locked)
	useEffect(() => {
		setCartItems(prev => prev.map(it => {
			if (it.unitPriceLocked) return it;
			const unitPrice = getDiscountedPrice(it.productId);
			const qty = Number(it.quantity) || 0;
			const lineTotal = Math.max(0, qty * unitPrice);
			return { ...it, unitPrice, total: lineTotal, totalPrice: lineTotal };
		}));
	}, [selectedCustomer, priceTiers, products]);

	// Debounced remote product search (server-side filtering) per API docs
	useEffect(() => {
		let active = true;
		const q = searchInput.trim();
		if (q.length < 2) { setSearchResults([]); return; }
		const t = setTimeout(async () => {
			try {
				const res = await apiService.getProducts({ search: q, per_page: 20 });
				const list = (res as any)?.data?.data || (res as any)?.data || res || [];
				if (!active) return;
				setSearchResults(Array.isArray(list) ? list : []);
			} catch {
				if (!active) return;
				setSearchResults([]);
			}
		}, 250);
		return () => { active = false; clearTimeout(t); };
	}, [searchInput]);

	const getProductById = (id: number): ProductOption | undefined => {
		return (searchResults.find(s => s.id === id) || products.find(p => p.id === id)) as any;
	};

	// Derived totals
	const subTotal = useMemo(() => cartItems.reduce((s, i) => s + (i.quantity * i.unitPrice), 0), [cartItems]);
	const discount = 0;
	const shippingCost = 350;
	const tax = useMemo(() => (shippingAddress.state === 'Indiana' ? (subTotal * 0.07) : 0), [subTotal, shippingAddress.state]);
	const grandTotal = useMemo(() => Math.max(0, subTotal - discount + tax + shippingCost), [subTotal, discount, tax, shippingCost]);

	const handleAddItem = () => {
		setCartItems(prev => ([
			...prev,
			{ itemId: '', productId: 0, name: '', quantity: 1, unitPrice: 0, total: 0, totalPrice: 0 }
		]));
	};

	const handleRemoveItem = (index: number) => {
		setCartItems(prev => prev.filter((_, i) => i !== index));
	};

	const updateItem = (index: number, updates: Partial<CartItem>) => {
		setCartItems(prev => prev.map((it, i) => {
			if (i !== index) return it;
			const updated: CartItem = { ...it, ...updates } as CartItem;
			const qty = Number(updated.quantity) || 0;
			const price = Number(updated.unitPrice) || 0;
			const lineTotal = Math.max(0, (qty * price));
			updated.total = lineTotal;
			updated.totalPrice = lineTotal;
			return updated;
		}));
	};

	const canProceedFromStep = (stepIndex: number): boolean => {
		if (stepIndex === 0) return !!selectedCustomer;
		if (stepIndex === 1) return cartItems.length > 0 && cartItems.every(i => i.productId && i.quantity > 0 && i.unitPrice >= 0);
		if (stepIndex === 2) return !!firstName && !!lastName && !!email && !!shippingAddress.street;
		// Payment step does not block navigation; processing happens on submit or on Next
		return true;
	};

	// Clear stored token if switching to cash
	useEffect(() => {
		if (paymentOption === 'cash') setCardToken(null);
	}, [paymentOption]);

	const handleNext = async () => {
		if (!canProceedFromStep(activeStep)) {
			setError('Please complete required fields to continue.');
			return;
		}
		// Determine current payment step index dynamically
		const paymentStepIndex = steps.findIndex((s) => s === 'Payment');
		// If leaving the Payment step, tokenize and store the card token
		if (activeStep === paymentStepIndex) {
			if (paymentOption === 'card') {
				if (!paymentReady) {
					setError('Payment form not ready. Please wait a second and try again.');
					return;
				}
				try {
					if (!squareRef.current) {
						setError('Payment form not ready. Please wait a second and try again.');
						return;
					}
					const { token } = await squareRef.current.tokenize();
					setCardToken(token);
				} catch (e: any) {
					setError(e?.message || 'Failed to tokenize card.');
					return;
				}
			}
		}
		setError(null);
		setActiveStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setError(null);
		setActiveStep((prev) => Math.max(0, prev - 1));
	};

	const submitOrder = async () => {
		try {
			setLoading(true);
			setError(null);

			// Use stored token if card payment was selected (same as shop flow)
			let usedCardToken: string | null = null;
			if (paymentOption === 'card') {
				if (!cardToken) {
					setError('Card details are not ready. Please go back to Payment step and enter the card.');
					setLoading(false);
					return;
				}
				usedCardToken = cardToken;
			}

			const payload = {
				cartItems: cartItems.map(ci => ({
					itemId: String(ci.productId || ci.itemId || ''),
					productId: ci.productId,
					variationId: ci.variationId,
					name: ci.name || (products.find(p => p.id === ci.productId)?.name || 'Item'),
					quantity: ci.quantity,
					unitPrice: Number(ci.unitPrice) || 0,
					total: ci.total,
					totalPrice: ci.totalPrice,
					variants: ci.variants ? Object.fromEntries(
						Object.entries(ci.variants).map(([key, value]) => [key, value !== undefined && value !== null && value !== '' ? String(value) : ''])
					) : {},
				})),
				customerInfo: {
					firstName,
					lastName,
					email: email || selectedCustomer?.email || '',
					phone: phone || selectedCustomer?.phone || '',
					shippingAddress: { ...shippingAddress },
					billingAddress: { ...billingAddress },
				},
				paymentInfo: { method: 'cash', amountPaid: grandTotal, currency: 'USD' },
				cartSummary: { subTotal, tax, discount: 0, grandTotal, shippingCost: 350 },
				notes: [notes, shippingMethod ? `(Ship: ${shippingMethod})` : ''].filter(Boolean).join(' '),
			};

			const response = await apiService.createOrder(payload as any);
			let orderId: number | null = null;
			if (response?.data?.order?.id) orderId = response?.data?.order?.id;
			else if (response?.id) orderId = response.id;
			else if (response?.data?.data?.id) orderId = response.data.data.id;

			// Charge payment for both card and cash (mirror shop flow exactly) but do NOT block navigation on failure
			if (orderId) {
				try {
					// Fetch fresh order to get server-computed totals and customer id
					let freshOrder: any = null;
					try {
						const fetched = await apiService.getOrder(orderId);
						freshOrder = (fetched as any).data || fetched;
					} catch {}

					const amountToCharge = Number(freshOrder?.total_amount ?? grandTotal);
					const customerId = freshOrder?.customer?.id ?? selectedCustomer?.id ?? null;
					const orderNumber = freshOrder?.order_number ?? orderId;
					const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string | undefined;

					const chargeBody = {
						customer_id: customerId,
						order_id: orderId,
						payment_method: paymentOption === 'card' ? 'square' : 'cash',
						amount: amountToCharge,
						...(paymentOption === 'card' && usedCardToken ? { token: usedCardToken } : {}),
						...(paymentOption === 'card' ? { location_id: locationId } : {}),
						notes: `Payment for order #${orderNumber}`,
					};

					const chargeResp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/charge`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
							...(auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
						},
						body: JSON.stringify(chargeBody),
					});
					const result = await chargeResp.json().catch(() => ({}));
					if (!chargeResp.ok || result?.success === false) {
						console.error('Payment charge failed', result);
					}
				} catch (err) {
					console.error('Payment charge error', err);
				}
			}

			setCreatedOrderId(orderId);
            setSuccessOpen(true);
		} catch (e: any) {
			console.error('Order creation failed', e);
			const msg = e?.response?.data?.message || e?.message || 'Failed to create order. Please try again.';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return (
					<Card>
						<CardContent>
							<Box display="grid" gridTemplateColumns="1fr" gap={2}>
								<Box>
									<Autocomplete<CustomerOption>
										sx={{ width: '100%' }}
										options={customers}
										getOptionLabel={(o) => `${o.first_name} ${o.last_name} (${o.email})`}
										value={selectedCustomer}
										onChange={(_, v) => {
											setSelectedCustomer(v);
											if (v) {
												setFirstName(v.first_name || '');
												setLastName(v.last_name || '');
												setEmail(v.email || '');
												setPhone(v.phone || '');
											}
										}}
										renderInput={(params) => (
											<TextField {...params} fullWidth label="Customer Account" placeholder="Search customers" sx={{ '& .MuiAutocomplete-input': { width: '100%' } }} />
										)}
										ListboxProps={{ style: { maxHeight: 320 } }}
										isOptionEqualToValue={(o, v) => o.id === v?.id}
										slotProps={{
											popper: { sx: { minWidth: { xs: '100%', sm: 520, md: 680 } } },
											paper: { sx: { width: '100%' } },
										}}
									/>
								</Box>
							</Box>
						</CardContent>
					</Card>
				);
			case 1:
				return (
					<Card>
						<CardContent>
							<Box display="grid" gridTemplateColumns="1fr" gap={2}>
								<Typography variant="h6">Choose Products</Typography>
								<Autocomplete
									multiple={false}
									filterOptions={(x) => x}
									options={searchResults}
									getOptionLabel={(o: any) => o.name}
									inputValue={searchInput}
									onInputChange={(_, v) => setSearchInput(v)}
									value={null}
									isOptionEqualToValue={(o, v) => o.id === (v as any)?.id}
									onChange={(_, v: any) => {
										if (!v) return;
										setCartItems(prev => {
											const existing = prev.find(ci => ci.productId === v.id);
											const unitPrice = getDiscountedPrice(v.id);
											const next: CartItem[] = [
												...prev,
												{
													itemId: String(v.id),
													productId: v.id,
													name: v.name,
													quantity: existing?.quantity || 1,
													unitPrice,
													total: (existing?.quantity || 1) * unitPrice,
													totalPrice: (existing?.quantity || 1) * unitPrice,
													variants: existing?.variants,
													unitPriceLocked: existing?.unitPriceLocked || false,
												},
											];
											return next;
										});
										setSearchInput('');
									}}
									renderInput={(params) => (<TextField {...params} placeholder="Search and select products" autoComplete="off" />)}
									renderTags={(value) => (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
											{cartItems.map((ci, idx) => (
												<Chip key={`${ci.productId}-${idx}`} label={(getProductById(ci.productId)?.name) || 'Item'} />
											))}
										</Box>
									)}
								/>

								{cartItems.length > 0 ? (
									<Box sx={{ overflowX: 'auto' }}>
										<Table size="small">
											<TableHead>
												<TableRow>
													<TableCell>Product</TableCell>
													<TableCell align="center">Variants</TableCell>
													<TableCell align="right">Unit Price</TableCell>
													<TableCell align="center">Quantity</TableCell>
													<TableCell align="right">Total</TableCell>
													<TableCell align="center">Action</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{cartItems.map((it, idx) => (
													<TableRow key={idx} hover>
														<TableCell sx={{ minWidth: 240 }}>{it.name || products.find(p => p.id === it.productId)?.name}</TableCell>
														<TableCell align="center">
															<Button size="small" startIcon={<TuneIcon />} onClick={() => { setDrawerRowIndex(idx); setDrawerOpen(true); }}>Details</Button>
														</TableCell>
														<TableCell align="right">${it.unitPrice.toFixed(2)}</TableCell>
														<TableCell align="center" sx={{ width: 120 }}>
															<TextField type="number" size="small" value={it.quantity} onChange={(e) => {
																const qty = Math.max(1, Number(e.target.value) || 1);
																updateItem(idx, { quantity: qty });
															}} inputProps={{ min: 1, style: { textAlign: 'center' } }} />
														</TableCell>
														<TableCell align="right">${(it.quantity * it.unitPrice).toFixed(2)}</TableCell>
														<TableCell align="center"><IconButton color="error" onClick={() => handleRemoveItem(idx)}><DeleteIcon /></IconButton></TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</Box>
								) : (
									<Box textAlign="center" py={3} color="text.secondary">No items selected.</Box>
								)}

								<Divider sx={{ my: 2 }} />
								<Box display="flex" gap={2} flexWrap="wrap" alignItems="center" justifyContent="flex-end">
									<Chip label={`Items: ${cartItems.length}`} />
									<Chip label={`Subtotal: $${subTotal.toFixed(2)}`} color="primary" />
								</Box>
							</Box>
						</CardContent>
					</Card>
				);
			case 2:
				return (
					<Card>
						<CardContent>
							<Box display="grid" gap={2}>
								<Typography variant="h6">Contact</Typography>
								<Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
									<TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
									<TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
									<TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
									<TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
								</Box>

								<Divider />
								<Typography variant="h6">Shipping Address</Typography>
								<Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
									<TextField fullWidth label="Street" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} required />
									<TextField fullWidth label="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
									<FormControl fullWidth>
										<InputLabel>State</InputLabel>
										<Select label="State" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: String(e.target.value) })}>
											{['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => (
												<MenuItem key={s} value={s}>{s}</MenuItem>
											))}
										</Select>
									</FormControl>
									<TextField fullWidth label="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} />
									<TextField fullWidth label="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} />
								</Box>

								<Divider />
								<Box display="flex" alignItems="center" justifyContent="space-between">
									<Typography variant="h6">Billing Address</Typography>
									<Button size="small" variant="outlined" onClick={() => setBillingAddress({ ...shippingAddress })}>Copy from Shipping</Button>
								</Box>
								<Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
									<TextField fullWidth label="Street" value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })} required />
									<TextField fullWidth label="City" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
									<FormControl fullWidth>
										<InputLabel>State</InputLabel>
										<Select label="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: String(e.target.value) })}>
											{['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => (
												<MenuItem key={s} value={s}>{s}</MenuItem>
											))}
										</Select>
									</FormControl>
									<TextField fullWidth label="Postal Code" value={billingAddress.postalCode} onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })} />
									<TextField fullWidth label="Country" value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} />
								</Box>
							</Box>
						</CardContent>
					</Card>
				);
			case 3:
				return (
					<Card>
						<CardContent>
							<Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr' }} gap={2}>
								<TextField fullWidth multiline minRows={shippingAddress.state === 'Indiana' ? 6:4} label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
								<Box>
									<FormControl fullWidth>
										<InputLabel>Shipping Method</InputLabel>
										<Select label="Shipping Method" value={shippingMethod} onChange={(e) => setShippingMethod(String(e.target.value))}>
											<MenuItem value="Standard">Standard</MenuItem>
											<MenuItem value="Express">Express</MenuItem>
											<MenuItem value="Overnight">Overnight</MenuItem>
										</Select>
									</FormControl>
									<Box mt={2} width="100%">
									   {shippingAddress.state === 'Indiana' && (
										   <TextField type="number" fullWidth disabled label="Tax" value={7} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
									   )}
									   <Box sx={{ mt: 1 }}>
										 <TextField type="number" fullWidth disabled label="Shipping Cost" value={shippingCost} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
									   </Box>
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>
				);
			case 4:
				return (
					<Card>
						<CardContent>
							<Typography variant="h6">Payment</Typography>
							<Box display="grid" gap={2}>
								<FormControl component="fieldset">
									<RadioGroup row value={paymentOption} onChange={(e) => setPaymentOption(e.target.value as any)}>
										<FormControlLabel value="card" control={<Radio />} label="Card" />
										<FormControlLabel value="cash" control={<Radio />} label="Cash" />
									</RadioGroup>
								</FormControl>
								{paymentOption === 'card' && (
									<Box>
										<SquareCard ref={squareRef} amount={grandTotal} onReady={() => setPaymentReady(true)} onError={(msg) => setError(msg)} />
									</Box>
								)}
							</Box>
						</CardContent>
					</Card>
				);
			case 5:
				return (
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>Review</Typography>
							<Box display="grid" gap={2}>
								<Box>
									<Typography variant="subtitle2">Customer</Typography>
									<Typography>{selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name} (${selectedCustomer.email})` : `${firstName} ${lastName}`}</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle2">Items</Typography>
									{cartItems.map((i, idx) => (
										<Box key={idx} display="flex" justifyContent="space-between">
											<Typography>{i.name || products.find(p => p.id === i.productId)?.name || 'Item'} x {i.quantity}</Typography>
											<Typography>${((i.quantity * i.unitPrice)).toFixed(2)}</Typography>
										</Box>
									))}
									<Divider sx={{ my: 1 }} />
									<Box display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
										<Chip label={`Subtotal: $${subTotal.toFixed(2)}`} />
										{shippingAddress.state === 'Indiana' && (
										<Chip label={`Tax: $${tax.toFixed(2)} (${shippingAddress.state === 'Indiana' ? '7%' : '0%'})`} />
									   )}
										<Chip label={`Shipping cost: $${shippingCost.toFixed(2)}`} />
										<Chip color="primary" label={`Grand Total: $${grandTotal.toFixed(2)}`} />
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>
				);
			default:
				return null;
		}
	};

	const paymentStepIndex = steps.findIndex((s) => s === 'Payment');
	const nextDisabled = loading || (activeStep === paymentStepIndex && paymentOption === 'card' && !paymentReady);

	return (
		<Box sx={{ p: { xs: 1, sm: 2 } }}>
			<Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Create New Order</Typography>
			{error && (
				<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
			)}
			<Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			{renderStepContent()}

			<Box display="flex" justifyContent="space-between" mt={2}>
				<Button disabled={activeStep === 0 || loading} onClick={handleBack} variant="outlined">Back</Button>
				{activeStep < steps.length - 1 ? (
					<Button variant="contained" onClick={handleNext} disabled={nextDisabled}>Next</Button>
				) : (
					<Button variant="contained" color="primary" onClick={submitOrder} disabled={loading}>Submit Order</Button>
				)}
			</Box>

			<Dialog open={successOpen} onClose={() => router.push('/admin/orders')}>
				<DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<CheckCircleIcon color="success" /> New Order Added
				</DialogTitle>
				<DialogContent>
					<Typography sx={{ mb: 1 }}>New order created successfully!</Typography>
					{createdOrderId && (
						<Typography sx={{ wordBreak: 'break-all' }}>Order #{createdOrderId}</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => router.push('/admin/orders')}>OK</Button>
					{createdOrderId && (
						<Button variant="contained" onClick={() => router.push(`/admin/orders/${createdOrderId}`)}>View Order</Button>
					)}
				</DialogActions>
			</Dialog>
			<AdminVariantsDrawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				productId={drawerRowIndex !== null ? cartItems[drawerRowIndex]?.productId || null : null}
				basePrice={drawerRowIndex !== null ? getRetailPrice(cartItems[drawerRowIndex]!.productId) : 0}
				initialSelections={drawerRowIndex !== null ? (cartItems[drawerRowIndex!]?.variants || null) : null}
				onPreview={({ newUnitPrice }) => {
					if (drawerRowIndex === null) return;
					const row = drawerRowIndex;
					setCartItems(prev => prev.map((ci, i) => i !== row ? ci : {
						...ci,
						unitPrice: newUnitPrice,
						total: (ci.quantity || 1) * newUnitPrice,
						totalPrice: (ci.quantity || 1) * newUnitPrice,
					}));
				}}
				onApply={({ selections, newUnitPrice }) => {
					if (drawerRowIndex === null) return;
					const row = drawerRowIndex;
					setCartItems(prev => prev.map((ci, i) => i !== row ? ci : {
						...ci,
						variants: selections,
						unitPrice: newUnitPrice,
						total: (ci.quantity || 1) * newUnitPrice,
						totalPrice: (ci.quantity || 1) * newUnitPrice,
					}));
					setDrawerOpen(false);
				}}
				// Pass selected customer's tier id for proper discounting in drawer
				customerTierId={selectedCustomer?.price_tier_id || (selectedCustomer?.price_tier as any)?.id || undefined}
			/>
		</Box>
	);
};

export default OrderWizard; 