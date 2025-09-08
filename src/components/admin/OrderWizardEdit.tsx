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
} from '@mui/material';
import {
	Add as AddIcon,
	Delete as DeleteIcon,
	CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface CustomerOption {
	id: number;
	name: string;
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
	const [discount, setDiscount] = useState<number>(0);
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
					// Customer
					const matched = cArray.find((c: any) => c.email === order?.user?.email);
					if (matched) setSelectedCustomer(matched);
					setFirstName((order?.user?.name || '').split(' ')[0] || '');
					setLastName((order?.user?.name || '').split(' ').slice(1).join(' ') || '');
					setEmail(order?.user?.email || '');
					// Phone
					const inferredPhone = (order as any)?.user?.phone || (order as any)?.shipping_address?.phone || (order as any)?.billing_address?.phone;
					if (inferredPhone) setPhone(inferredPhone);

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
					setShippingAddress(parseAddress(order.shipping_address));
					setBillingAddress(parseAddress(order.billing_address));

					// Items -> cartItems
					const items = Array.isArray(order.items) ? order.items : [];
					const mapped: CartItem[] = items.map((it: any) => {
						const qty = Number(it.quantity) || 0;
						const price = Number(it.unit_price) || 0;
						const disc = Number(it.discount_amount) || 0;
						const total = Math.max(0, (qty * price) - disc);
						return {
							itemId: String(it.product_id),
							productId: it.product_id,
							variationId: it.variation_id,
							name: (it.product && it.product.name) || '',
							quantity: qty,
							unitPrice: price,
							discountAmount: disc,
							total,
							totalPrice: total,
						};
					});
					setCartItems(mapped);

					// Totals & notes
					setDiscount(Number(order.discount_amount) || 0);
					setTax(Number(order.tax_amount) || 0);
					setNotes(order.notes || '');
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
	const subTotal = useMemo(() => cartItems.reduce((s, i) => s + (i.quantity * i.unitPrice) - (i.discountAmount || 0), 0), [cartItems]);
	const grandTotal = useMemo(() => Math.max(0, subTotal - discount + tax), [subTotal, discount, tax]);

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
			const disc = Number(updated.discountAmount) || 0;
			const lineTotal = Math.max(0, (qty * price) - disc);
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
			const payload = {
				shipping_address: { ...shippingAddress },
				billing_address: { ...billingAddress },
				notes: [notes, shippingMethod ? `(Ship: ${shippingMethod})` : ''].filter(Boolean).join(' '),
				payment_method: 'cash',
				discount_amount: discount,
				tax_amount: tax,
				items: cartItems.map(ci => ({
					product_id: ci.productId,
					variation_id: ci.variationId,
					quantity: ci.quantity,
					unit_price: ci.unitPrice,
				})),
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
										getOptionLabel={(o) => `${o.name} (${o.email})`}
										value={selectedCustomer}
										onChange={(_, v) => setSelectedCustomer(v)}
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
							<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
								<Typography variant="h6">Products</Typography>
								<Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddItem} size="small">Add Item</Button>
							</Box>
							{cartItems.length === 0 ? (
								<Box textAlign="center" py={3} color="text.secondary">No items added yet.</Box>
							) : (
								<Box display="grid" gap={2}>
									{cartItems.map((it, idx) => (
										<Card key={idx} variant="outlined">
											<CardContent>
												<Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 120px 140px 160px auto', lg: '1fr 140px 160px 180px auto' }} gap={2} alignItems="center">
													<FormControl fullWidth>
														<InputLabel>Product</InputLabel>
														<Select
															label="Product"
															value={it.productId || ''}
															onChange={(e) => {
																const productId = Number(e.target.value);
																const name = products.find(p => p.id === productId)?.name || '';
																updateItem(idx, { productId, itemId: String(productId), name });
															}}
														>
															<MenuItem value=""><em>Select Product</em></MenuItem>
															{products.map(p => (
																<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
															))}
														</Select>
													</FormControl>
													<TextField fullWidth type="number" label="Quantity" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
													<TextField fullWidth type="number" label="Unit Price" value={it.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })} />
																									<Box display="flex" alignItems="center" justifyContent="space-between">
													<Chip label={`$${((it.quantity * it.unitPrice)).toFixed(2)}`} color="primary" />
														<IconButton color="error" onClick={() => handleRemoveItem(idx)}><DeleteIcon /></IconButton>
													</Box>
												</Box>
											</CardContent>
										</Card>
									))}
								</Box>
							)}
							<Divider sx={{ my: 2 }} />
							<Box display="flex" gap={2} flexWrap="wrap" alignItems="center" justifyContent="flex-end">
								<Chip label={`Items: ${cartItems.length}`} />
								<Chip label={`Subtotal: $${subTotal.toFixed(2)}`} color="primary" />
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
										<TextField type="number" label="Discount" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
										<TextField type="number" label="Tax" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
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
									<Typography>{selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.email})` : `${firstName} ${lastName}`}</Typography>
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
																	<Chip label={`Order Discount: $${discount.toFixed(2)}`} />
																	<Chip label={`Tax: $${tax.toFixed(2)}`} />
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