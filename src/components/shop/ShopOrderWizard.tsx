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
import SquareCard, { SquareCardHandle } from '@/components/checkout/SquareCard';
import shopNowApis, { PriceTier as ShopPriceTier, User as ShopUser } from '@/services/ShopNowApis';

interface ProductOption { id: number; name: string; price?: any; sku?: string }
interface VariationOption { id: number; name: string; price?: number }
interface Address { street: string; city: string; state: string; postalCode: string; country: string }
interface CartItem { 
  itemId: string; 
  productId: number; 
  variationId?: number; 
  name: string; 
  quantity: number; 
  unitPrice: number; 
  total: number; 
  totalPrice: number; 
  variants?: VariantSelections; 
  customizationData?: any;
  is3DProduct?: boolean;
  unitPriceLocked?: boolean;
}

const steps = [
  'Select Products',
  'Billing & Shipping',
  'Notes & Shipping',
  'Payment',
  'Review & Submit',
];

const defaultAddress: Address = { street: '', city: '', state: '', postalCode: '', country: 'US' };

export default function ShopOrderWizard() {
  const router = useRouter();
  const { user } = useAppSelector((s: any) => s.auth);
  const reduxCart = useSelector((s: RootState) => s.cart.items) as ReduxCartItem[];
  const dispatch = useDispatch();
  const auth = useAppSelector((s: any) => s.auth);

  // Start at Select Products (skip Select Customer visually and logically)
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Derive errors inline to avoid flicker

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [variations, setVariations] = useState<VariationOption[]>([]);
  // Remote search
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<ProductOption[]>([]);
  // Track stock for validation even when product isn't present in local list
  const [productStocks, setProductStocks] = useState<Record<number, number | undefined>>({});

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
  const squareRef = useRef<SquareCardHandle | null>(null);
  const [cardToken, setCardToken] = useState<string | null>(null);

  // Price tier context (mimic /shop-now)
  const [priceTiers, setPriceTiers] = useState<ShopPriceTier[]>([]);
  const [userData, setUserData] = useState<ShopUser | null>(null);

  // Discount removed; tax is fixed at 7%

  const [successOpen, setSuccessOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const requests: Promise<any>[] = [
          apiService.getProducts({ per_page: 100 }),
          apiService.getVariations({ per_page: 200 }),
          shopNowApis.getPriceTiers(),
        ];
        if (auth?.isAuthenticated) {
          requests.push(shopNowApis.getCurrentUser());
        }
        const [productsRes, variationsRes, priceTiersRes, userRes] = await Promise.all(requests);
        const pData = productsRes?.data || productsRes || [];
        setProducts(Array.isArray(pData) ? pData : []);
        const vData = variationsRes?.data || variationsRes || [];
        setVariations(Array.isArray(vData) ? vData : []);
        // Price tiers
        const tiersPayload = priceTiersRes?.data ?? priceTiersRes ?? [];
        setPriceTiers(Array.isArray(tiersPayload) ? tiersPayload : []);
        // User data for tier selection
        if (auth?.isAuthenticated) {
          setUserData(userRes?.data || userRes || null);
        } else {
          setUserData(null);
        }

        // Prefill items from cart
        if (reduxCart && reduxCart.length > 0) {
          setCartItems(() => reduxCart.map((ci) => {
            const productId = Number(ci.id);
            const product = (Array.isArray(pData) ? pData : []).find((p: any) => Number(p.id) === productId);
            const basePrice = product ? (typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price || 0)) : parseFloat(String(ci.price).replace(/[$,]/g, '')) || 0;
            // Prefer discounted price saved in cart (ShopNow adds discounted price to cart as formatted string)
            const cartPriceNum = parseFloat(String(ci.price).replace(/[$,]/g, ''));
            const effectiveTier = product ? shopNowApis.getBestPriceTierForProduct(product as any, (auth?.isAuthenticated ? (userRes?.data || userRes || null) : null) as any) : null;
            const computedDisplay = effectiveTier?.finalPrice ?? shopNowApis.getDisplayPrice(basePrice, !!auth?.isAuthenticated, userRes?.data || userRes || null, Array.isArray(tiersPayload) ? tiersPayload : []);
            const unitPrice = !isNaN(cartPriceNum) && cartPriceNum > 0 ? cartPriceNum : (isNaN(Number(computedDisplay)) ? 0 : Number(computedDisplay));
            const quantity = Number(ci.quantity) || 1;
            
            // Parse customizationData from variants if present (for 3D products)
            let variants = (ci as any).variants || {};
            const customizationData = (ci as any).customizationData;
            
            // If customizationData exists in variants as JSON string, parse it
            if (variants.customizationData && typeof variants.customizationData === 'string') {
              try {
                const parsed = JSON.parse(variants.customizationData);
                // Merge parsed customizationData into variants
                variants = { ...variants, ...parsed, customizationData: variants.customizationData };
              } catch (e) {
                console.error('Failed to parse customizationData from variants:', e);
              }
            }
            
            // If we have separate customizationData object, merge it into variants
            if (customizationData) {
              variants = { 
                ...variants, 
                externalStitchColor: customizationData.externalStitchColor,
                pipingColor: customizationData.pipingColor,
                customizationData: JSON.stringify(customizationData)
              };
            }
            
            return {
              itemId: String(productId),
              productId,
              name: product?.name || ci.title || 'Item',
              quantity,
              unitPrice,
              total: quantity * unitPrice,
              totalPrice: quantity * unitPrice,
              variants: variants,
              customizationData: customizationData,
              is3DProduct: (ci as any).is3DProduct || false,
              unitPriceLocked: true,
            } as CartItem;
          }));
          // Immediately clear cart after importing items into the wizard
          try { dispatch(clearCart()); } catch {}
          // Fetch stock for cart-imported products to enable validation
          try {
            const ids = Array.from(new Set(reduxCart.map((c) => Number(c.id))));
            const details = await Promise.all(ids.map((id) => apiService.getProduct(id).catch(() => null)));
            const stockMap: Record<number, number | undefined> = {};
            details.forEach((d: any, i) => { if (d) stockMap[ids[i]] = Number(d?.stock ?? undefined); });
            setProductStocks((prev) => ({ ...prev, ...stockMap }));
          } catch {}
        }
      } catch (e: any) {
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reduxCart]);

  // Debounced remote product search (server-side filtering) per API docs
  useEffect(() => {
    let active = true;
    const q = searchInput.trim();
    
    // If no search input, show first 5 products by default
    if (q.length === 0) {
      setSearchResults(products.slice(0, 5));
      return;
    }
    
    // If search input is less than 2 characters, clear results
    if (q.length < 2) { 
      setSearchResults([]); 
      return; 
    }
    
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
  }, [searchInput, products]);

  // Prefill customer info using same logic as EditProfileModal.loadCustomerFromAPI
  useEffect(() => {
    const prefill = async () => {
      const customerId = user?.role?.id;
      if (!customerId) return;
      try {
        const response = await apiService.getCustomer(customerId);
        // Accept multiple shapes: {data:{data:{...}}} or {data:{...}} or {...}
        const customerRaw = (response as any)?.data ?? response;
        const customer = (customerRaw?.data && customerRaw?.data?.data)
          ? customerRaw.data.data
          : (customerRaw?.data || customerRaw);
        const name = customer.name || '';
        const firstNameFromName = name.split(' ')[0] || '';
        const lastNameFromName = name.split(' ').slice(1).join(' ') || '';
        setFirstName(customer.first_name || firstNameFromName || '');
        setLastName(customer.last_name || lastNameFromName || '');
        setEmail(customer.email || '');
        setPhone(customer.phone || '');
        // Helper to map state abbreviation to full name expected by UI
        const stateMap: Record<string, string> = {
          AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
        };
        const normalizeState = (s: any) => {
          if (!s) return '';
          const key = String(s).trim();
          const upper = key.toUpperCase();
          if (upper.length === 2 && stateMap[upper]) return stateMap[upper];
          // If already full name, return as-is
          return key;
        };
        const addresses = Array.isArray(customer.addresses) ? customer.addresses : [];
        const pickAddr = (type: 'shipping' | 'billing') => {
          const byType = addresses.filter((a: any) => String(a.type).toLowerCase() === type);
          const chosen = byType.find((a: any) => a.is_default) || byType[0] || null;
          if (chosen) {
            return {
              street: chosen.street || '',
              city: chosen.city || '',
              state: normalizeState(chosen.state || ''),
              postalCode: chosen.postal_code || '',
              country: chosen.country || 'US',
            } as Address;
          }
          return null;
        };
        const shippingDerived = pickAddr('shipping') || {
          street: customer.address || '',
          city: customer.city || '',
          state: normalizeState(customer.state || ''),
          postalCode: customer.postal_code || customer.zip || '',
          country: 'US',
        } as Address;
        const billingDerived = pickAddr('billing') || shippingDerived;
        setShippingAddress(shippingDerived);
        setBillingAddress(billingDerived);
      } catch (e) {
        // Silent fail; user can fill manually
      }
    };
    prefill();
  }, [user]);

  // No global qty error effect (prevents flicker)

  // Recompute cart prices when tiers/user/auth change
  useEffect(() => {
    setCartItems(prev => prev.map(it => {
      if (it.unitPriceLocked) {
        return it;
      }
      const p = products.find(p => p.id === it.productId) as any;
      const raw = p?.price ?? p?.unit_price ?? 0;
      const base = typeof raw === 'string' ? parseFloat(raw) : Number(raw || 0);
      const discounted = shopNowApis.getDisplayPrice(base, !!auth?.isAuthenticated, userData, priceTiers);
      const qty = Number(it.quantity) || 0;
      const unitPrice = isNaN(discounted) ? 0 : discounted;
      const lineTotal = Math.max(0, (qty * unitPrice));
      return { ...it, unitPrice, total: lineTotal, totalPrice: lineTotal };
    }));
  }, [priceTiers, userData, auth?.isAuthenticated, products]);

  const subTotal = useMemo(() => cartItems.reduce((s, i) => s + (i.quantity * i.unitPrice), 0), [cartItems]);
  const discount = 0;
  const shippingCost = 350;
  const tax = useMemo(() => (shippingAddress.state === 'Indiana' ? (subTotal * 0.07) : 0), [subTotal, shippingAddress.state]);
  const grandTotal = useMemo(() => Math.max(0, subTotal - discount + tax + shippingCost), [subTotal, discount, tax, shippingCost]);

  const getUnitPrice = (productId: number) => {
    const p = products.find(p => p.id === productId) as any;
    const priceRaw = p?.price ?? p?.unit_price ?? 0;
    const priceNum = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw || 0);
    return isNaN(priceNum) ? 0 : priceNum;
  };

  const basePriceFor = (productId: number) => getUnitPrice(productId);
  const getStockFor = (productId: number) => {
    const prod = products.find(p => p.id === productId) as any;
    const inList = Number(prod?.stock ?? NaN);
    if (Number.isFinite(inList)) return inList as number;
    const cached = productStocks[productId];
    return (typeof cached === 'number') ? cached : undefined;
  };

  const getProductById = (id: number): ProductOption | undefined => {
    return (searchResults.find(s => s.id === id) || products.find(p => p.id === id)) as any;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
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
                        const base = getUnitPrice(v.id);
                      const product = (getProductById(v.id) as any) || {};
                        const effectiveTier = shopNowApis.getBestPriceTierForProduct(product, userData as any);
                        const display = effectiveTier?.finalPrice ?? shopNowApis.getDisplayPrice(base, !!auth?.isAuthenticated, userData, priceTiers);
                        const unitPrice = isNaN(Number(display)) ? 0 : Number(display);
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
                    // Cache stock if present and clear input
                    const product = (getProductById(v.id) as any) || {};
                    if (typeof product?.stock !== 'undefined') {
                      setProductStocks(prevMap => ({ ...prevMap, [v.id]: Number(product.stock) }));
                    }
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
                        {cartItems.map((it, idx) => {
                          const qtyErr = (() => {
                            const s = getStockFor(it.productId);
                            return (typeof s === 'number' && s >= 0 && it.quantity > s) ? `Max available stock: ${s}` : null;
                          })();
                          return (
                          <TableRow key={idx} hover selected={!!qtyErr}>
                            <TableCell sx={{ minWidth: 240 }}>{it.name || products.find(p => p.id === it.productId)?.name}</TableCell>
                            <TableCell align="center">
                              <Button size="small" startIcon={<TuneIcon />} onClick={() => { setDrawerRowIndex(idx); setDrawerOpen(true); }}>Details</Button>
                            </TableCell>
                            <TableCell align="right">
                              {(() => {
                                const discounted = it.unitPrice;
                                const discountPct = shopNowApis.getWholesaleDiscount(priceTiers as any, userData as any);
                                const retailEst = discountPct > 0 ? (discounted / (1 - discountPct / 100)) : basePriceFor(it.productId);
                                const hasDiscount = discountPct > 0 && retailEst > discounted + 0.009;
                                return (
                                  <Box>
                                    <Typography variant="body2" component="div" sx={{ fontWeight: 600 }}>
                                      ${discounted.toFixed(2)}
                                    </Typography>
                                    {hasDiscount && (
                                      <Typography variant="caption" color="text.secondary" component="div">
                                        <s>${retailEst.toFixed(2)}</s>
                                      </Typography>
                                    )}
                                  </Box>
                                );
                              })()}
                            </TableCell>
                            <TableCell align="center" sx={{ width: 160 }}>
                              <TextField type="number" size="small" value={it.quantity} onChange={(e) => {
                                const qty = Math.max(1, Number(e.target.value) || 1);
                                const stockLookup = getStockFor(it.productId);
                                const finiteStock = (typeof stockLookup === 'number' && stockLookup > 0) ? stockLookup : Infinity;
                                const stockLimit = finiteStock;
                            // Do not auto-clamp; keep user entry, but track error separately
                            updateItem(idx, { quantity: qty });
                              }} inputProps={{ min: 1, style: { textAlign: 'center' } }} error={!!qtyErr} />
                              {qtyErr && (
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                  {qtyErr}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">${(it.quantity * it.unitPrice).toFixed(2)}</TableCell>
                            <TableCell align="center"><IconButton color="error" onClick={() => handleRemoveItem(idx)}><DeleteIcon /></IconButton></TableCell>
                          </TableRow>
                        );})}
                      </TableBody>
                    </Table>
                  </Box>
                ) : (
                  <Box textAlign="center" py={3} color="text.secondary">No items selected.</Box>
                )}
                {cartItems.some((ci) => { const s = getStockFor(ci.productId); return typeof s === 'number' && s >= 0 && ci.quantity > s; }) && (
                  <Box sx={{ color: 'error.main', mt: 1 }}>
                    Please correct quantities exceeding available stock before continuing.
                  </Box>
                )}
                <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1}>
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
                  <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </Box>

                <Divider />
                <Typography variant="h6">Shipping Address</Typography>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <TextField fullWidth label="Street" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} required />
                  <TextField fullWidth label="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} required />
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select label="State" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: String(e.target.value) })}>
                      {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField fullWidth label="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} required />
                  <TextField fullWidth label="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} required />
                </Box>

                <Divider />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Billing Address</Typography>
                  <Button size="small" variant="outlined" onClick={() => setBillingAddress({ ...shippingAddress })}>Copy from Shipping</Button>
                </Box>
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <TextField fullWidth label="Street" value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })} required />
                  <TextField fullWidth label="City" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} required />
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select label="State" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: String(e.target.value) })}>
                      {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField fullWidth label="Postal Code" value={billingAddress.postalCode} onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })} required />
                  <TextField fullWidth label="Country" value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} required />
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
                <TextField fullWidth multiline minRows={shippingAddress.state === 'Indiana' ? 6:4} label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} helperText={`${notes.length}/500`} inputProps={{ maxLength: 500 }} />
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>Shipping Method</InputLabel>
                    <Select label="Shipping Method" value={shippingMethod} onChange={(e) => setShippingMethod(String(e.target.value))}>
                      <MenuItem value="Standard">Standard (5-7 business days)</MenuItem>
                      <MenuItem value="Express">Express (2-3 business days)</MenuItem>
                      <MenuItem value="Overnight">Overnight (1 business day)</MenuItem>
                    </Select>
                  </FormControl>
                  <Box mt={2} width="100%">
                  {shippingAddress.state === 'Indiana' && (
                    <TextField type="number" fullWidth disabled label="Tax" value={shippingAddress.state === 'Indiana' ? 7 : 0}  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
									   )}
                    <Box sx={{ mt: 1 }}>
                      <TextField type="number" fullWidth disabled label="Shipping Cost" value={350} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                    </Box>
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
              <Box display="grid" gap={3}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Payment Information</Typography>
                <Alert severity="info">💳 Enter your card details to complete payment</Alert>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold' }}>Card Details</Typography>
                  <SquareCard
                    ref={squareRef}
                    amount={grandTotal}
                    onReady={() => setError(null)}
                    onError={(msg) => setError(msg)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardContent>
              <Box display="grid" gap={2}>
                <Typography variant="h6">Review Order</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Subtotal</Typography>
                  <Typography fontWeight={600}>${subTotal.toFixed(2)}</Typography>
                </Box>
                {shippingAddress.state === 'Indiana' && (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Tax (7%)</Typography>
                  <Typography fontWeight={600}>${tax.toFixed(2)}</Typography>
                </Box>
									   )}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Shipping Cost</Typography>
                  <Typography fontWeight={600}>${shippingCost.toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Grand Total</Typography>
                  <Typography variant="h6">${grandTotal.toFixed(2)}</Typography>
                </Box>
                {/* <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button variant="outlined" onClick={() => setActiveStep(0)}>Back</Button>
                  <Button variant="contained" onClick={submitOrder} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Order'}
                  </Button>
                </Box> */}
              </Box>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const canProceedFromStep = (stepIndex: number) => {
    if (stepIndex === 0) {
      const hasInvalidQty = cartItems.some((i) => {
        const stock = getStockFor(i.productId);
        return typeof stock === 'number' && stock >= 0 && i.quantity > stock;
      });
      if (hasInvalidQty) return false;
      return cartItems.length > 0 && cartItems.every(i => i.productId && i.quantity > 0 && i.unitPrice >= 0);
    }
    if (stepIndex === 1) {
      const shippingOk = !!shippingAddress.street && !!shippingAddress.city && !!shippingAddress.state && !!shippingAddress.postalCode && !!shippingAddress.country;
      const billingOk = !!billingAddress.street && !!billingAddress.city && !!billingAddress.state && !!billingAddress.postalCode && !!billingAddress.country;
      return !!firstName && !!lastName && !!email && !!phone && shippingOk && billingOk;
    }
    // Payment step does not block navigation; processing happens on submit
    return true;
  };


  const handleNext = async () => {
    if (!canProceedFromStep(activeStep)) {
      if (activeStep === 0) {
        setError('Some items exceed available stock. Please correct them to continue.');
      } else {
        setError('Please complete required fields to continue.');
      }
      return;
    }
    // If leaving the Payment step, tokenize and store the card token
    if (activeStep === 3) {
      try {
        if (!squareRef.current) {
          setError('Payment form not ready. Please wait a second and try again.');
          return;
        }
        const { token } = await squareRef.current.tokenize();
        setCardToken(token);
      } catch (e: any) {
        setError(e?.message || 'Card tokenization failed. Please check your card details and try again.');
        return;
      }
    }
    setError(null);
    setActiveStep(prev => prev + 1);
  };
  const handleBack = () => { setError(null); setActiveStep(prev => Math.max(0, prev - 1)); };

  const submitOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use stored token for card payment
      if (!cardToken) {
        setError('Card details are not ready. Please go back to Payment step and enter your card.');
        setLoading(false);
        return;
      }
      const usedCardToken = cardToken;

      const payload = {
        cartItems: cartItems.map(ci => {
          // Build variants object, including customization data for 3D products
          let variantsObj: any = {};
          if (ci.variants) {
            variantsObj = Object.fromEntries(
              Object.entries(ci.variants).map(([key, value]) => [key, value !== undefined && value !== null && value !== '' ? String(value) : ''])
            );
          }
          // Include customization data in variants for 3D products
          if (ci.is3DProduct && ci.customizationData) {
            variantsObj.customizationData = JSON.stringify(ci.customizationData);
          }
          
          return {
            itemId: String(ci.productId || ci.itemId || ''),
            productId: ci.productId,
            variationId: ci.variationId,
            name: ci.name || (products.find(p => p.id === ci.productId)?.name || 'Item'),
            quantity: ci.quantity,
            unitPrice: Number(ci.unitPrice) || 0,
            total: ci.total,
            totalPrice: ci.totalPrice,
            variants: variantsObj,
          };
        }),
        customerInfo: {
          firstName,
          lastName,
          email: email || user?.email || '',
          phone: phone || '',
          shippingAddress: { ...shippingAddress },
          billingAddress: { ...billingAddress },
        },
        paymentInfo: {
          method: 'card',
          amountPaid: grandTotal,
          currency: 'USD',
        },
        cartSummary: { subTotal, tax, discount: 0, grandTotal, shippingCost: 350 },
        notes: [notes, shippingMethod ? `(Ship: ${shippingMethod})` : ''].filter(Boolean).join(' '),
      };

      const response = await apiService.createOrder(payload as any);
      let orderId: number | null = null;
      if (response?.data?.order?.id) orderId = response?.data?.order?.id;
      else if (response?.id) orderId = response.id;
      else if (response?.data?.data?.id) orderId = response.data.data.id;

      // Charge payment using card (mirror view-order Pay button exactly using the just-created order data)
      if (orderId) {
        // Fetch fresh order to get server-computed totals and customer id
        let freshOrder: any = null;
        try {
          const fetched = await apiService.getOrder(orderId);
          freshOrder = (fetched as any).data || fetched;
        } catch {}

        const amountToCharge = Number(freshOrder?.total_amount ?? grandTotal);
        const customerId = freshOrder?.customer?.id ?? user?.role?.id ?? null;
        const orderNumber = freshOrder?.order_number ?? orderId;
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string | undefined;

        const chargeBody = {
          customer_id: customerId,
          order_id: orderId,
          payment_method: 'square',
          amount: amountToCharge,
          token: usedCardToken,
          location_id: locationId,
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
          throw new Error(result?.error || result?.message || 'Payment charge failed');
        }
      }

      setCreatedOrderId(orderId);
      setSuccessOpen(true);
      try {
        const evt = new CustomEvent('clear-cart');
        window.dispatchEvent(evt);
      } catch {}

    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setCartItems(prev => ([...prev, { itemId: '', productId: 0, name: '', quantity: 1, unitPrice: 0, total: 0, totalPrice: 0 }]));
  };
  const handleRemoveItem = (index: number) => setCartItems(prev => prev.filter((_, i) => i !== index));
  // Close drawer if the selected row is removed or out of bounds
  useEffect(() => {
    if (drawerRowIndex === null) return;
    if (drawerRowIndex < 0 || drawerRowIndex >= cartItems.length) {
      setDrawerRowIndex(null);
      setDrawerOpen(false);
      return;
    }
    if (!cartItems[drawerRowIndex]) {
      setDrawerRowIndex(null);
      setDrawerOpen(false);
    }
  }, [cartItems, drawerRowIndex]);
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
        productId={(drawerRowIndex !== null && cartItems[drawerRowIndex]) ? (cartItems[drawerRowIndex].productId || null) : null}
        basePrice={(drawerRowIndex !== null && cartItems[drawerRowIndex]) ? basePriceFor(cartItems[drawerRowIndex].productId) : 0}
        initialSelections={(drawerRowIndex !== null && cartItems[drawerRowIndex]) ? (cartItems[drawerRowIndex].variants || null) : null}
        initialDisplayPrice={(drawerRowIndex !== null && cartItems[drawerRowIndex]) ? cartItems[drawerRowIndex].unitPrice : undefined}
        onPreview={({ newUnitPrice }) => {
          if (drawerRowIndex === null) return;
          if (!cartItems[drawerRowIndex]) { setDrawerRowIndex(null); setDrawerOpen(false); return; }
          const row = drawerRowIndex;
          setCartItems(prev => prev.map((ci, i) => i !== row ? ci : { ...ci, unitPrice: newUnitPrice, total: (ci.quantity || 1) * newUnitPrice, totalPrice: (ci.quantity || 1) * newUnitPrice }));
        }}
        onApply={({ selections, newUnitPrice }) => {
          if (drawerRowIndex === null) return;
          if (!cartItems[drawerRowIndex]) { setDrawerRowIndex(null); setDrawerOpen(false); return; }
          const row = drawerRowIndex;
          setCartItems(prev => prev.map((ci, i) => i !== row ? ci : { ...ci, variants: selections, unitPrice: newUnitPrice, total: (ci.quantity || 1) * newUnitPrice, totalPrice: (ci.quantity || 1) * newUnitPrice, unitPriceLocked: true }));
          setDrawerOpen(false);
        }}
        customerTierId={(userData as any)?.role?.price_tier_id || (auth?.user?.role?.price_tier_id)}
      />
    </Box>
  );
} 