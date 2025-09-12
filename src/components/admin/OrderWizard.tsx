'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
	InputAdornment,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
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

interface CustomerOption {
	id: number;
	first_name: string;
	last_name: string;
	name?: string | null;
	email: string;
	phone?: string;
}

interface ProductOption {
	id: number;
	name: string;
	price?: any;
	sku?: string;
	category?: string;
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
	'Review & Submit',
];

const defaultAddress: Address = { street: '', city: '', state: '', postalCode: '', country: 'US' };

const OrderWizard: React.FC = () => {
	const router = useRouter();

	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Data sets
	const [customers, setCustomers] = useState<CustomerOption[]>([]);
	const [products, setProducts] = useState<ProductOption[]>([]);
	const [variations, setVariations] = useState<VariationOption[]>([]);

	// Step 1: customer
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);
	// location removed per requirements

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

	// Step 4: notes and shipping method
	const [notes, setNotes] = useState('');
	const [shippingMethod, setShippingMethod] = useState('Standard');

	// Summary
	const [discountPct, setDiscountPct] = useState<number>(0);
	const [taxPct, setTaxPct] = useState<number>(0);

	// Success dialog
	const [successOpen, setSuccessOpen] = useState(false);
	const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

	// Load base data
	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const [customersRes, productsRes, variationsRes] = await Promise.all([
					apiService.getCustomers({ per_page: 100 }),
					apiService.getProducts({ per_page: 100 }),
					apiService.getVariations({ per_page: 200 }),
				]);

				// Customers API returns { status, message, data: { data: [...] } }
													const cDataRaw = (customersRes && (customersRes.data?.data || customersRes.data || customersRes)) as any;
									const cArray = Array.isArray(cDataRaw?.data) ? cDataRaw.data : (Array.isArray(cDataRaw) ? cDataRaw : []);
									setCustomers(cArray);

				const pData = productsRes?.data || productsRes || [];
				setProducts(Array.isArray(pData) ? pData : []);

				const vData = variationsRes?.data || variationsRes || [];
				setVariations(Array.isArray(vData) ? vData : []);
			} catch (e: any) {
				console.error('Error loading wizard data', e);
				setError('Failed to load initial data');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	// Derived totals
	const subTotal = useMemo(() => cartItems.reduce((s, i) => s + (i.quantity * i.unitPrice), 0), [cartItems]);
	const discount = useMemo(() => (subTotal * (Number(discountPct) || 0)) / 100, [subTotal, discountPct]);
	const tax = useMemo(() => (subTotal * (Number(taxPct) || 0)) / 100, [subTotal, taxPct]);
	const grandTotal = useMemo(() => Math.max(0, subTotal - discount + tax), [subTotal, discount, tax]);

	const getUnitPrice = (productId: number) => {
		const p = products.find(p => p.id === productId) as any;
		const priceRaw = p?.price ?? p?.unit_price ?? 0;
		const priceNum = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw || 0);
		return isNaN(priceNum) ? 0 : priceNum;
	};

	const basePriceFor = (productId: number) => getUnitPrice(productId);

	const handleAddItem = () => {
		// legacy add single empty row (still allowed)
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
		if (stepIndex === 0) {
			return !!selectedCustomer;
		}
		if (stepIndex === 1) {
			return cartItems.length > 0 && cartItems.every(i => i.productId && i.quantity > 0 && i.unitPrice >= 0);
		}
		if (stepIndex === 2) {
			return !!firstName && !!lastName && !!email && !!shippingAddress.street;
		}
		return true;
	};

	const handleNext = () => {
		if (!canProceedFromStep(activeStep)) {
			setError('Please complete required fields to continue.');
			return;
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
					variants: ci.variants,
				})),
				customerInfo: {
					firstName,
					lastName,
					email: email || selectedCustomer?.email || '',
					phone: phone || selectedCustomer?.phone || '',
					shippingAddress: { ...shippingAddress },
					billingAddress: { ...billingAddress },
				},
				paymentInfo: {
					method: 'cash',
					amountPaid: grandTotal,
					currency: 'USD',
				},
				cartSummary: {
					subTotal,
					tax,
					discount,
					grandTotal,
				},
									notes: [notes, shippingMethod ? `(Ship: ${shippingMethod})` : '']
					.filter(Boolean)
					.join(' '),
			};

			const response = await apiService.createOrder(payload as any);
			let orderId: number | null = null;
			if (response?.data?.id) orderId = response.data.id;
			else if (response?.id) orderId = response.id;
			else if (response?.data?.data?.id) orderId = response.data.data.id;

			setCreatedOrderId(orderId);
			setSuccessOpen(true);
		} catch (e: any) {
			console.error('Order creation failed', e);
			const msg = e?.response?.data?.message || 'Failed to create order. Please try again.';
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
									multiple
									options={products}
									getOptionLabel={(o: any) => o.name}
									value={products.filter(p => cartItems.some(ci => ci.productId === p.id))}
									onChange={(_, values: any[]) => {
										setCartItems(prev => {
											const next: CartItem[] = [];
											values.forEach(v => {
												const existing = prev.find(ci => ci.productId === v.id);
												const unitPrice = getUnitPrice(v.id);
												next.push({
													itemId: String(v.id),
													productId: v.id,
													name: v.name,
													quantity: existing?.quantity || 1,
													unitPrice,
													total: (existing?.quantity || 1) * unitPrice,
													totalPrice: (existing?.quantity || 1) * unitPrice,
												});
											});
											return next;
										});
									}}
									renderInput={(params) => <TextField {...params} placeholder="You can choose Single/Multiple Products" />} />

								{cartItems.length > 0 ? (
									<Box sx={{ overflowX: 'auto' }}>
										<Table size="small">
											<TableHead>
												<TableRow>
													<TableCell>Product</TableCell>
													<TableCell align="center">Variants</TableCell>
													<TableCell align="right">Unit Price</TableCell>
													<TableCell align="center">Quantity</TableCell>
													<TableCell align="right">Line Total</TableCell>
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
															<TextField type="number" size="small" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} inputProps={{ min: 1, style: { textAlign: 'center' } }} />
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
																		<TextField fullWidth label="State" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
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
																		<TextField fullWidth label="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
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
																	<TextField fullWidth multiline minRows={4} label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
																	<Box>
																		<FormControl fullWidth>
																			<InputLabel>Shipping Method</InputLabel>
																			<Select label="Shipping Method" value={shippingMethod} onChange={(e) => setShippingMethod(String(e.target.value))}>
																				<MenuItem value="Standard">Standard</MenuItem>
																				<MenuItem value="Express">Express</MenuItem>
																				<MenuItem value="Overnight">Overnight</MenuItem>
																			</Select>
																		</FormControl>
																		<Box mt={2} display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
																			<TextField type="number" label="Discount" value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
																			<TextField type="number" label="Tax" value={taxPct} onChange={(e) => setTaxPct(Number(e.target.value))} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
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
											<Chip label={`Order Discount: $${discount.toFixed(2)} (${discountPct}%)`} />
											<Chip label={`Tax: $${tax.toFixed(2)} (${taxPct}%)`} />
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
					<Button variant="contained" onClick={handleNext} disabled={loading}>Next</Button>
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
						<Typography>Order #{createdOrderId} has been placed and is now awaiting approval.</Typography>
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
				basePrice={drawerRowIndex !== null ? basePriceFor(cartItems[drawerRowIndex]!.productId) : 0}
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
			/>
		</Box>
	);
};

export default OrderWizard; 