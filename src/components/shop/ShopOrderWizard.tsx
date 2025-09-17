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
  Autocomplete,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  InputAdornment,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Tune as TuneIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { CartItem as ReduxCartItem } from '@/store/cartSlice';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/navigation';
import AdminVariantsDrawer, { VariantSelections } from '@/components/admin/AdminVariantsDrawer';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/cartSlice';

interface ProductOption { id: number; name: string; price?: any; sku?: string }
interface VariationOption { id: number; name: string; price?: number }
interface Address { street: string; city: string; state: string; postalCode: string; country: string }
interface CartItem { itemId: string; productId: number; variationId?: number; name: string; quantity: number; unitPrice: number; total: number; totalPrice: number; variants?: VariantSelections }

const steps = [
  'Select Products',
  'Billing & Shipping',
  'Notes and Shipping Methods',
  'Review & Submit',
];

const defaultAddress: Address = { street: '', city: '', state: '', postalCode: '', country: 'US' };

export default function ShopOrderWizard() {
  const router = useRouter();
  const { user } = useAppSelector((s: any) => s.auth);
  const reduxCart = useSelector((s: RootState) => s.cart.items) as ReduxCartItem[];
  const dispatch = useDispatch();

  // Start at Select Products (skip Select Customer visually and logically)
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [variations, setVariations] = useState<VariationOption[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRowIndex, setDrawerRowIndex] = useState<number | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState<Address>({ ...defaultAddress });
  const [billingAddress, setBillingAddress] = useState<Address>({ ...defaultAddress });

  const [notes, setNotes] = useState('');
  const [shippingMethod, setShippingMethod] = useState('Standard');

  // Discount removed; tax is fixed at 7%

  const [successOpen, setSuccessOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsRes, variationsRes] = await Promise.all([
          apiService.getProducts({ per_page: 100 }),
          apiService.getVariations({ per_page: 200 }),
        ]);
        const pData = productsRes?.data || productsRes || [];
        setProducts(Array.isArray(pData) ? pData : []);
        const vData = variationsRes?.data || variationsRes || [];
        setVariations(Array.isArray(vData) ? vData : []);

        // Prefill items from cart
        if (reduxCart && reduxCart.length > 0) {
          setCartItems(() => reduxCart.map((ci) => {
            const productId = Number(ci.id);
            const product = (Array.isArray(pData) ? pData : []).find((p: any) => Number(p.id) === productId);
            const unitPrice = product ? (typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price || 0)) : parseFloat(String(ci.price).replace(/[$,]/g, '')) || 0;
            const quantity = Number(ci.quantity) || 1;
            return {
              itemId: String(productId),
              productId,
              name: product?.name || ci.title || 'Item',
              quantity,
              unitPrice,
              total: quantity * unitPrice,
              totalPrice: quantity * unitPrice,
              // If cart item already tracks variants, preserve them
              variants: (ci as any).variants || undefined,
            } as CartItem;
          }));
          // Immediately clear cart after importing items into the wizard
          try { dispatch(clearCart()); } catch {}
        }
      } catch (e: any) {
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reduxCart]);

  // Prefill customer info using same logic as EditProfileModal.loadCustomerFromAPI
  useEffect(() => {
    const prefill = async () => {
      const customerId = user?.role?.id;
      if (!customerId) return;
      try {
        const response = await apiService.getCustomer(customerId);
        const customer = response.data?.data || response.data || response;
        const name = customer.name || '';
        const firstNameFromName = name.split(' ')[0] || '';
        const lastNameFromName = name.split(' ').slice(1).join(' ') || '';
        setFirstName(customer.first_name || firstNameFromName || '');
        setLastName(customer.last_name || lastNameFromName || '');
        setEmail(customer.email || '');
        setPhone(customer.phone || '');
        setShippingAddress({
          street: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          postalCode: customer.postal_code || customer.zip || '',
          country: 'US',
        });
        setBillingAddress(prev => ({ ...prev }));
      } catch (e) {
        // Silent fail; user can fill manually
      }
    };
    prefill();
  }, [user]);

  const subTotal = useMemo(() => cartItems.reduce((s, i) => s + (i.quantity * i.unitPrice), 0), [cartItems]);
  const discount = 0;
  const tax = useMemo(() => (subTotal * 0.07), [subTotal]);
  const grandTotal = useMemo(() => Math.max(0, subTotal - discount + tax), [subTotal, discount, tax]);

  const getUnitPrice = (productId: number) => {
    const p = products.find(p => p.id === productId) as any;
    const priceRaw = p?.price ?? p?.unit_price ?? 0;
    const priceNum = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw || 0);
    return isNaN(priceNum) ? 0 : priceNum;
  };

  const handleAddItem = () => {
    setCartItems(prev => ([...prev, { itemId: '', productId: 0, name: '', quantity: 1, unitPrice: 0, total: 0, totalPrice: 0 }]));
  };
  const handleRemoveItem = (index: number) => setCartItems(prev => prev.filter((_, i) => i !== index));
  const updateItem = (index: number, updates: Partial<CartItem>) => {
    setCartItems(prev => prev.map((it, i) => {
      if (i !== index) return it;
      const updated = { ...it, ...updates } as CartItem;
      const qty = Number(updated.quantity) || 0;
      const price = Number(updated.unitPrice) || 0;
      const lineTotal = Math.max(0, (qty * price));
      updated.total = lineTotal;
      updated.totalPrice = lineTotal;
      return updated;
    }));
  };

  const canProceedFromStep = (stepIndex: number) => {
    if (stepIndex === 0) return cartItems.length > 0 && cartItems.every(i => i.productId && i.quantity > 0 && i.unitPrice >= 0);
    if (stepIndex === 1) return !!firstName && !!lastName && !!email && !!shippingAddress.street;
    return true;
  };

  const handleNext = () => {
    if (!canProceedFromStep(activeStep)) {
      setError('Please complete required fields to continue.');
      return;
    }
    setError(null);
    setActiveStep(prev => prev + 1);
  };
  const handleBack = () => { setError(null); setActiveStep(prev => Math.max(0, prev - 1)); };

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
          variants: ci.variants ? Object.fromEntries(
            Object.entries(ci.variants).map(([key, value]) => [key, value !== undefined && value !== null && value !== '' ? String(value) : ''])
          ) : {},
        })),
        customerInfo: {
          firstName,
          lastName,
          email: email || user?.email || '',
          phone: phone || '',
          shippingAddress: { ...shippingAddress },
          billingAddress: { ...billingAddress },
        },
        paymentInfo: {
          method: 'cash',
          amountPaid: grandTotal,
          currency: 'USD',
        },
        cartSummary: { subTotal, tax, discount: 0, grandTotal },
        notes: [notes, shippingMethod ? `(Ship: ${shippingMethod})` : ''].filter(Boolean).join(' '),
      };
      const response = await apiService.createOrder(payload as any);
      let orderId: number | null = null;
      if (response?.data?.id) orderId = response.data.id;
      else if (response?.id) orderId = response.id;
      else if (response?.data?.data?.id) orderId = response.data.data.id;
      setCreatedOrderId(orderId);
      setSuccessOpen(true);
      try {
        // Clear Redux cart if present to avoid duplicate ordering
        const evt = new CustomEvent('clear-cart');
        window.dispatchEvent(evt);
      } catch {}

    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const basePriceFor = (productId: number) => getUnitPrice(productId);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
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
                          variants: existing?.variants,
                        });
                      });
                      return next;
                    });
                  }}
                  renderInput={(params) => (<TextField {...params} placeholder="You can choose Single/Multiple Products" />)}
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Chip color="primary" label={`SubTotal: $${subTotal.toFixed(2)}`} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      case 1:
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
      case 2:
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
      case 3:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Review</Typography>
              <Box display="grid" gap={2}>
                <Box>
                  <Typography variant="subtitle2">Customer</Typography>
                  <Typography>{`${firstName} ${lastName}`.trim() || 'Customer' }{email ? ` (${email})` : ''}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Items</Typography>
                  {cartItems.map((i, idx) => (
                    <Box key={idx} display="flex" justifyContent="space-between">
                      <Typography>{i.name || products.find(p => p.id === i.productId)?.name || 'Item'} x {i.quantity}</Typography>
                      <Typography>${((i.quantity * i.unitPrice)).toFixed(2)}</Typography>
                    </Box>
                  ))}
                  <Box display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap" mt={1}>
                    <Chip label={`Subtotal: $${subTotal.toFixed(2)}`} />
                    <Chip label={`Tax: $${tax.toFixed(2)} (7%)`} />
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
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, md: 6 } }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Create New Order</Typography>
      {error && (<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>)}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
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

      <Dialog open={successOpen} onClose={() => router.push(`/shop/orders${user?.role?.id ? `?customer_id=${user.role.id}` : ''}`)}>
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
          <Button onClick={() => router.push(`/shop/orders`)}>OK</Button>
          {createdOrderId && (
            <Button variant="contained" onClick={() => router.push(`/shop/orders/${createdOrderId}`)}>View Order</Button>
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
          setCartItems(prev => prev.map((ci, i) => i !== row ? ci : { ...ci, unitPrice: newUnitPrice, total: (ci.quantity || 1) * newUnitPrice, totalPrice: (ci.quantity || 1) * newUnitPrice }));
        }}
        onApply={({ selections, newUnitPrice }) => {
          if (drawerRowIndex === null) return;
          const row = drawerRowIndex;
          setCartItems(prev => prev.map((ci, i) => i !== row ? ci : { ...ci, variants: selections, unitPrice: newUnitPrice, total: (ci.quantity || 1) * newUnitPrice, totalPrice: (ci.quantity || 1) * newUnitPrice }));
          setDrawerOpen(false);
        }}
      />
    </Box>
  );
} 