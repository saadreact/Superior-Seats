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
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	InputAdornment,
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

interface OrderWizardEditProps {
	order: any;
}

const steps = [
	'Select Customer',
	'Select Products',
	'Billing & Shipping',
	'Notes and Shipping Methods',
	'Review & Submit',
];

const defaultAddress: Address = { street: '', city: '', state: '', postalCode: '', country: 'US' };

const OrderWizardEdit: React.FC<OrderWizardEditProps> = ({ order }) => {
	const router = useRouter();

	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Data sets
	const [customers, setCustomers] = useState<CustomerOption[]>([]);
	const [products, setProducts] = useState<ProductOption[]>([]);

	// Step 1: customer
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);

	// Step 2: items
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	
	// Drawer state - simplified
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerRowIndex, setDrawerRowIndex] = useState<number | null>(null);

const getUnitPrice = (productId: number) => {
  const p: any = products.find(p => p.id === productId);
  const raw = p?.price ?? (p as any)?.unit_price ?? 0;
  const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw || 0);
  return isNaN(n) ? 0 : n;
};

	const handleClose = () => {
		setDrawerOpen(false);
		setDrawerRowIndex(null);
	};

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
	const [tax, setTax] = useState<number>(0);

	// Success dialog
	const [successOpen, setSuccessOpen] = useState(false);

	// Load base data and prefill from order
	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const [customersRes, productsRes] = await Promise.all([
					apiService.getCustomers({ per_page: 100 }),
					apiService.getProducts({ per_page: 100 }),
				]);

				const cDataRaw = (customersRes && (customersRes.data?.data || customersRes.data || customersRes)) as any;
				const cArray = Array.isArray(cDataRaw?.data) ? cDataRaw.data : (Array.isArray(cDataRaw) ? cDataRaw : []);
				setCustomers(cArray);

				const pData = productsRes?.data || productsRes || [];
				setProducts(Array.isArray(pData) ? pData : []);

				// Prefill from order
				if (order) {
					const ord = (order as any)?.order || order;
					
					// Customer
					const custInfo = (ord as any)?.customerInfo || (ord as any)?.customer || null;
					const custEmail = custInfo?.email || (ord as any)?.user?.email || '';
					const matched = cArray.find((c: any) => c.email === custEmail);
					if (matched) setSelectedCustomer(matched);
					
					// Extract customer data from multiple sources
					const firstName = custInfo?.firstName || matched?.first_name || (ord as any)?.customer?.firstName || (order as any)?.user?.name?.split(' ')[0] || '';
					const lastName = custInfo?.lastName || matched?.last_name || (ord as any)?.customer?.lastName || ((order as any)?.user?.name || '').split(' ').slice(1).join(' ') || '';
					const email = custEmail || matched?.email || '';
					
					// Extract phone from multiple possible locations
					const phone = custInfo?.phone || 
								 (ord as any)?.customer?.phone || 
								 matched?.phone || 
								 (ord as any)?.addresses?.[0]?.phone || 
								 (ord as any)?.shippingAddress?.phone || 
								 (ord as any)?.billingAddress?.phone || 
								 (ord as any)?.shipping_address?.phone || 
								 (ord as any)?.billing_address?.phone || '';
					
					setFirstName(firstName);
					setLastName(lastName);
					setEmail(email);
					setPhone(phone);

					// Shipping method from order.shippingMethod or notes e.g. "... (Ship: Express)"
					const extractShip = (src: any): string | null => {
						if (!src) return null;
						const m = String(src).match(/\(Ship:\s*([^\)]+)\)/i);
						return m?.[1]?.trim() || null;
					};
					const prefShip = (order as any)?.shippingMethod || extractShip((order as any)?.notes);
					if (prefShip) setShippingMethod(prefShip);

					// Addresses - handle string or object
					const parseAddress = (addr: any): Address => {
						if (!addr) return { ...defaultAddress };
						if (typeof addr === 'string') return { street: addr, city: '', state: '', postalCode: '', country: 'US' };
						return {
							street: addr.street || '',
							city: addr.city || '',
							state: addr.state || '',
							postalCode: addr.postalCode || '',
							country: addr.country || 'US',
						};
					};
					const shippingAddr = (ord as any)?.customerInfo?.shippingAddress || (ord as any)?.shippingAddress || (ord as any)?.shipping_address;
					const billingAddr = (ord as any)?.customerInfo?.billingAddress || (ord as any)?.billingAddress || (ord as any)?.billing_address;
					setShippingAddress(parseAddress(shippingAddr));
					setBillingAddress(parseAddress(billingAddr));

					// Items -> cartItems (prefer new format cartItems/orderItems, fallback to legacy items)
					const cartItemsNew = Array.isArray((ord as any)?.cartItems) ? (ord as any).cartItems : [];
					const cartItemsFromNew: CartItem[] = cartItemsNew.map((ci: any) => {
						const qty = Number(ci.quantity) || 0;
						const price = Number(ci.unitPrice) || 0;
						const vi = (ci as any).variants || {};
						const line = Math.max(0, qty * price);
						return {
							itemId: String(ci.itemId || ci.productId),
							productId: Number(ci.productId),
							variationId: ci.variationId,
							name: ci.name || '',
							quantity: qty,
							unitPrice: price,
							discountAmount: 0,
							total: line,
							totalPrice: line,
							variants: vi, // Use variants directly from API without coercing
						};
					});

					const orderItemsNew = Array.isArray((ord as any)?.orderItems) ? (ord as any).orderItems : [];
					const cartItemsFromOrderItems: CartItem[] = orderItemsNew.map((it: any) => {
						const qty = Number(it.quantity) || 0;
						const price = Number(it.unitPrice) || 0;
						const disc = 0;
						const total = Math.max(0, (qty * price) - disc);
						const vi = (it as any).variants || {};
						return {
							itemId: String(it.itemId || it.productId || it.id),
							productId: Number(it.productId || (it.product && it.product.id)),
							variationId: it.variationId,
							name: it.name || (it.product && it.product.name) || '',
							quantity: qty,
							unitPrice: price,
							discountAmount: disc,
							total,
							totalPrice: total,
							variants: vi, // Use variants directly
						};
					});

					const legacyItems = Array.isArray((ord as any)?.items) ? (ord as any).items : [];
					const cartItemsFromLegacy: CartItem[] = legacyItems.map((it: any) => {
						const qty = Number(it.quantity) || 0;
						const price = Number(it.unit_price) || 0;
						const vi = (it as any).variants || {};
						const line = Math.max(0, qty * price);
						return {
							itemId: String(it.product_id),
							productId: it.product_id,
							variationId: it.variation_id,
							name: (it.product && it.product.name) || '',
							quantity: qty,
							unitPrice: price,
							discountAmount: 0,
							total: line,
							totalPrice: line,
							variants: vi, // Use variants directly
						};
					});

					const mapped: CartItem[] = cartItemsFromNew.length > 0 ? cartItemsFromNew : (cartItemsFromOrderItems.length > 0 ? cartItemsFromOrderItems : cartItemsFromLegacy);
					setCartItems(mapped);

					// Totals & notes
					setTax(Number((order as any)?.cartSummary?.tax ?? order.tax_amount) || 0);
					setNotes((order as any)?.notes || (order as any)?.order?.notes || '');
				}
			} catch (e: any) {
				console.error('Error loading edit wizard data', e);
				setError('Failed to load data');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [order]);

	// Derived totals
	const subTotal = useMemo(() => cartItems.reduce((s, i) => s + (i.quantity * i.unitPrice), 0), [cartItems]);
	const computedTax = useMemo(() => subTotal * 0.07, [subTotal]);
	const grandTotal = useMemo(() => Math.max(0, subTotal + computedTax), [subTotal, computedTax]);

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
		if (stepIndex === 1) return cartItems.length > 0 && cartItems.every(i => i.productId && i.quantity > 0);
		if (stepIndex === 2) return !!firstName && !!lastName && !!email && !!shippingAddress.street;
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

	const submitUpdate = async () => {
		try {
			setLoading(true);
			setError(null);

			// Build old-format payload for updateOrder (it will transform internally)
			const fallbackCustomer = selectedCustomer || ({} as any);
			const originalCustInfo = (order as any)?.customerInfo || (order as any)?.customer || {};
			const normalizedCustomerInfo = {
				firstName: firstName || originalCustInfo.firstName || (order as any)?.user?.name?.split(' ')[0] || fallbackCustomer.first_name || '',
				lastName: lastName || originalCustInfo.lastName || ((order as any)?.user?.name || '').split(' ').slice(1).join(' ') || fallbackCustomer.last_name || '',
				email: email || originalCustInfo.email || (order as any)?.user?.email || fallbackCustomer.email || '',
				phone: phone || originalCustInfo.phone || fallbackCustomer.phone || '',
				shippingAddress: { ...shippingAddress },
				billingAddress: { ...billingAddress },
			};

			const payload = {
				shipping_address: { ...shippingAddress },
				billing_address: { ...billingAddress },
				notes: [notes, shippingMethod ? `(Ship: ${shippingMethod})` : ''].filter(Boolean).join(' '),
				payment_method: 'cash',
				discount_amount: 0,
				tax_amount: computedTax,
				items: cartItems.map(ci => ({
					product_id: ci.productId,
					variation_id: ci.variationId,
					quantity: ci.quantity,
					unit_price: ci.unitPrice,
					variants: ci.variants ? Object.fromEntries(
						Object.entries(ci.variants).map(([key, value]) => [
							key, 
							value !== undefined && value !== null && value !== '' ? String(value) : ''
						])
					) : {},
				})),
				// Also include a modern cartItems array for services expecting the new shape
				cartItems: cartItems.map(ci => ({
					itemId: String(ci.productId || ci.itemId || ''),
					productId: ci.productId,
					variationId: ci.variationId,
					name: ci.name,
					quantity: ci.quantity,
					unitPrice: ci.unitPrice,
					total: ci.total,
					totalPrice: ci.totalPrice,
					variants: ci.variants ? Object.fromEntries(
						Object.entries(ci.variants).map(([key, value]) => [
							key, 
							value !== undefined && value !== null && value !== '' ? String(value) : ''
						])
					) : {},
				})),
				// And include denormalized customerInfo block for services expecting it at top level
				customerInfo: normalizedCustomerInfo,
			};

			await apiService.updateOrder(Number(order.id || order?.order_id || 0), payload as any);
			setSuccessOpen(true);
		} catch (e: any) {
			console.error('Order update failed', e);
			const msg = e?.response?.data?.message || 'Failed to update order. Please try again.';
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
											<TextField {...params} fullWidth label="Customer Account" placeholder="Search customers" />
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
													variationId: 0,
													name: v.name,
													quantity: existing?.quantity || 1,
													unitPrice: existing?.unitPrice || unitPrice,
													discountAmount: existing?.discountAmount || 0,
													total: (existing?.quantity || 1) * (existing?.unitPrice || unitPrice),
													totalPrice: (existing?.quantity || 1) * (existing?.unitPrice || unitPrice),
													variants: existing?.variants || {},
												});
											});
											return next;
										});
									}}
									renderInput={(params) => (
										<TextField {...params} fullWidth label="Products" placeholder="Search and select products" />
									)}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip
												{...getTagProps({ index })}
												key={option.id}
												label={`${option.name} - $${(Number(option.price) || 0).toFixed(2)}`}
												size="small"
											/>
										))
									}
									ListboxProps={{ style: { maxHeight: 320 } }}
									isOptionEqualToValue={(o, v) => o.id === v?.id}
									slotProps={{
										popper: { sx: { minWidth: { xs: '100%', sm: 520, md: 680 } } },
										paper: { sx: { width: '100%' } },
									}}
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
													<TableCell align="right">Line Total</TableCell>
													<TableCell align="center">Action</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{cartItems.map((it, idx) => (
													<TableRow key={idx} hover>
														<TableCell sx={{ minWidth: 240 }}>{it.name || products.find(p => p.id === it.productId)?.name}</TableCell>
														<TableCell align="center">
															<Button 
																size="small" 
																startIcon={<TuneIcon />} 
																onClick={() => {
																	setDrawerRowIndex(idx);
																	setDrawerOpen(true);
																}}
															>
																Details
															</Button>
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
									<Box textAlign="center" py={3} color="text.secondary">No items added yet.</Box>
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
									<Box mt={2} width="100%">
										<TextField type="number" fullWidth disabled label="Tax" value={7}  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
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
																	<Chip label={`Tax: $${computedTax.toFixed(2)} (7%)`} />
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
			<Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Edit Order</Typography>
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
					<Button variant="contained" color="primary" onClick={submitUpdate} disabled={loading}>Update Order</Button>
				)}
			</Box>
				{drawerOpen && drawerRowIndex !== null && cartItems[drawerRowIndex] && (
					<AdminVariantsDrawer
						key={drawerRowIndex}
						open={drawerOpen}
						onClose={handleClose}
						productId={cartItems[drawerRowIndex].productId}
						basePrice={getUnitPrice(cartItems[drawerRowIndex].productId)}
						initialSelections={cartItems[drawerRowIndex].variants}
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
							handleClose();
						}}
					/>
				)}

			<Dialog open={successOpen} onClose={() => router.push(`/admin/orders/${order.id}`)}>
				<DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<CheckCircleIcon color="success" /> Order Updated
				</DialogTitle>
				<DialogContent>
					<Typography sx={{ mb: 1 }}>Order updated successfully!</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => router.push(`/admin/orders/${order.id}`)}>OK</Button>
					<Button variant="contained" onClick={() => router.push(`/admin/orders/${order.id}`)}>View Order</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default OrderWizardEdit; 