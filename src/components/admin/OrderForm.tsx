'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Calculate as CalculateIcon,
  DirectionsCar as CarIcon,
  ShoppingCart as CartIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { FormField, SelectField, FormActions } from '@/components/common/FormComponents';
import { apiService } from '@/utils/api';

interface OrderFormProps {
  order?: any;
  isViewMode?: boolean;
  onSubmit: (order: any) => void;
  onCancel: () => void;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  customer_type: string;
  company_name?: string;
}

interface VehicleMake {
  id: number;
  name: string;
}

interface VehicleModel {
  id: number;
  name: string;
  make_id: number;
}

interface VehicleTrim {
  id: number;
  name: string;
  model_id: number;
}

interface VehicleConfiguration {
  id: number;
  name: string;
  description: string;
  vehicle_trim: {
    id: number;
    name: string;
    model: {
      id: number;
      name: string;
      make: {
        id: number;
        name: string;
      };
    };
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

interface Variation {
  id: number;
  name: string;
  price: number;
  stitch_pattern: string;
  material_type: string;
  color: string;
}

interface OrderItem {
  id?: number;
  product_id: number;
  variation_id: number;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total: number;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  isViewMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    user_id: '',
    vehicle_configuration_id: '',
    shipping_address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    billing_address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    notes: '',
    status: 'pending',
    payment_method: '',
    payment_status: 'pending',
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    items: [] as OrderItem[],
  });

  // Data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [vehicleTrims, setVehicleTrims] = useState<VehicleTrim[]>([]);
  const [vehicleConfigurations, setVehicleConfigurations] = useState<VehicleConfiguration[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filter states
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<number | null>(null);

  // UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch each API separately to better handle errors
        let customersResponse, makesResponse, productsResponse, variationsResponse;
        
        try {
          customersResponse = await apiService.getCustomers();
          console.log('Customers API success:', customersResponse);
        } catch (error) {
          console.error('Customers API failed:', error);
          customersResponse = { data: { data: [] } };
        }
        
        try {
          makesResponse = await apiService.getVehicleMakes();
          console.log('Makes API success:', makesResponse);
        } catch (error) {
          console.error('Makes API failed:', error);
          makesResponse = { data: { data: [] } };
        }
        
        try {
          productsResponse = await apiService.getProducts();
          console.log('Products API success:', productsResponse);
        } catch (error) {
          console.error('Products API failed:', error);
          productsResponse = [];
        }
        
        try {
          variationsResponse = await apiService.getVariations();
          console.log('Variations API success:', variationsResponse);
        } catch (error) {
          console.error('Variations API failed:', error);
          variationsResponse = [];
        }
        
        console.log('OrderForm API Responses:', {
          customers: customersResponse,
          makes: makesResponse,
          products: productsResponse,
          variations: variationsResponse
        });
        
        // Handle customers response
        const customersData = customersResponse.data?.data || customersResponse.data || [];
        console.log('Customers data:', customersData);
        setCustomers(customersData);
        
        // Handle makes response
        const makesData = makesResponse.data?.data || makesResponse.data || [];
        console.log('Makes data:', makesData);
        setVehicleMakes(makesData);
        
        // Handle products response
        const productsData = productsResponse || [];
        console.log('Products data:', productsData);
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Handle variations response
        const variationsData = variationsResponse || [];
        console.log('Variations data:', variationsData);
        setVariations(variationsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setAlert({ type: 'error', message: 'Failed to load form data' });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    if (selectedMake) {
      const fetchModels = async () => {
        try {
          const response = await apiService.getVehicleModels(selectedMake);
          setVehicleModels(response.data?.data || response.data || []);
          setSelectedModel(null);
          setSelectedTrim(null);
          setVehicleTrims([]);
          setVehicleConfigurations([]);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      };
      fetchModels();
    } else {
      setVehicleModels([]);
      setSelectedModel(null);
      setSelectedTrim(null);
      setVehicleTrims([]);
      setVehicleConfigurations([]);
    }
  }, [selectedMake]);

  // Fetch trims when model is selected
  useEffect(() => {
    if (selectedModel) {
      const fetchTrims = async () => {
        try {
          const response = await apiService.getVehicleTrims(selectedModel);
          setVehicleTrims(response.data?.data || response.data || []);
          setSelectedTrim(null);
          setVehicleConfigurations([]);
        } catch (error) {
          console.error('Error fetching trims:', error);
        }
      };
      fetchTrims();
    } else {
      setVehicleTrims([]);
      setSelectedTrim(null);
      setVehicleConfigurations([]);
    }
  }, [selectedModel]);

  // Fetch vehicle configurations when trim is selected
  useEffect(() => {
    if (selectedTrim) {
      const fetchConfigurations = async () => {
        try {
          const response = await apiService.getVehicleConfigurations({ trim_id: selectedTrim });
          setVehicleConfigurations(response.data?.data || response.data || response || []);
        } catch (error) {
          console.error('Error fetching configurations:', error);
        }
      };
      fetchConfigurations();
    } else {
      setVehicleConfigurations([]);
    }
  }, [selectedTrim]);

  // Filter products by selected vehicle configuration
  useEffect(() => {
    if (formData.vehicle_configuration_id) {
      const fetchProductsByVehicle = async () => {
        try {
          const response = await apiService.getProductsByVehicle(parseInt(formData.vehicle_configuration_id));
          setFilteredProducts(response || []);
        } catch (error) {
          console.error('Error fetching products by vehicle:', error);
          // Fallback to all products if specific filtering fails
          setFilteredProducts(products);
        }
      };
      fetchProductsByVehicle();
    } else {
      setFilteredProducts(products);
    }
  }, [formData.vehicle_configuration_id, products]);

  // Populate form data when editing
  useEffect(() => {
    if (order) {
      console.log('OrderForm received order data:', order);
      console.log('Available customers:', customers);
      console.log('Available variations:', variations);
      // Parse address data if it's a string (for backward compatibility)
      let shippingAddr, billingAddr;
      try {
        shippingAddr = typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address;
      } catch {
        shippingAddr = {
          street: order.shipping_address || '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        };
      }
      
      try {
        billingAddr = typeof order.billing_address === 'string' 
          ? JSON.parse(order.billing_address) 
          : order.billing_address;
      } catch {
        billingAddr = {
          street: order.billing_address || '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        };
      }

      // Find customer by email if user_id is not set
      let customerIdToUse = order.user_id || order.user?.id;
      const emailToMatch = order.customer_email || order.user?.email;
      if (!customerIdToUse && emailToMatch) {
        const matchingCustomer = customers.find(c => c.email === emailToMatch);
        customerIdToUse = matchingCustomer?.id;
        console.log('Searching for customer with email:', emailToMatch);
        console.log('Available customers:', customers.map(c => ({ id: c.id, email: c.email, name: c.name })));
        console.log('Found customer by email match:', matchingCustomer);
      }

              console.log('Setting user_id to:', customerIdToUse);
        
        setFormData({
          user_id: (customerIdToUse || '').toString(),
        vehicle_configuration_id: (order.vehicle_configuration_id || order.vehicle_configuration?.id || '').toString(),
        shipping_address: shippingAddr,
        billing_address: billingAddr,
        notes: order.notes || '',
        status: order.status || 'pending',
        payment_method: order.payment_method || '',
        payment_status: order.payment_status || 'pending',
        discount_amount: order.discount_amount || 0,
        tax_amount: order.tax_amount || 0,
        total_amount: order.total_amount || 0,
        items: order.items?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount || 0,
          total: (item.quantity * item.unit_price) - (item.discount_amount || 0),
        })) || [],
      });

      // Set vehicle filter states if editing
      if (order.vehicle_configuration) {
        const config = order.vehicle_configuration;
        if (config.vehicle_trim?.model?.make) {
          setSelectedMake(config.vehicle_trim.model.make.id);
          setSelectedModel(config.vehicle_trim.model.id);
          setSelectedTrim(config.vehicle_trim.id);
        }
      }
    }
  }, [order, customers]);

  // Calculate totals whenever items change
  const calculateTotals = useCallback(() => {
    const subtotal = formData.items.reduce((sum, item) => 
      sum + (item.quantity * item.unit_price) - item.discount_amount, 0
    );
    const total = subtotal - formData.discount_amount + formData.tax_amount;
    
    setFormData(prev => ({
      ...prev,
      total_amount: total
    }));
  }, [formData.items, formData.discount_amount, formData.tax_amount]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Customer is required';
    }
    if (!formData.shipping_address.street) {
      newErrors.shipping_address = 'Shipping address street is required';
    }
    if (!formData.billing_address.street) {
      newErrors.billing_address = 'Billing address street is required';
    }
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      formData.items.forEach((item, index) => {
        if (!item.product_id) {
          newErrors[`items.${index}.product_id`] = 'Product is required';
        }
        if (!item.variation_id) {
          newErrors[`items.${index}.variation_id`] = 'Variation is required';
        }
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
        }
        if (!item.unit_price || item.unit_price <= 0) {
          newErrors[`items.${index}.unit_price`] = 'Unit price must be greater than 0';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Find selected customer to get their details
      const selectedCustomer = customers.find(c => c.id === parseInt(formData.user_id));
      
      // Validate required data
      if (!selectedCustomer) {
        setAlert({ type: 'error', message: 'Please select a customer' });
        return;
      }
      
      if (formData.items.length === 0) {
        setAlert({ type: 'error', message: 'Please add at least one item to the order' });
        return;
      }
      
      if (!formData.shipping_address.street.trim()) {
        setAlert({ type: 'error', message: 'Please enter a shipping address' });
        return;
      }
      
      if (!formData.billing_address.street.trim()) {
        setAlert({ type: 'error', message: 'Please enter a billing address' });
        return;
      }

      // Transform data to match backend expectations
      const submitData = {
        cartItems: formData.items.map(item => {
          // Find the product and variation names for the item
          const product = products.find(p => p.id === Number(item.product_id));
          const variation = variations.find(v => v.id === Number(item.variation_id));
          
          console.log(`Item ${item.product_id}: product found =`, product?.name, ', variation found =', variation?.name);
          
          return {
            itemId: String(item.product_id), // Backend expects string
            productId: Number(item.product_id),
            variationId: Number(item.variation_id),
            name: product?.name || 'Unknown Product',
            variationName: variation?.name || 'Unknown Variation',
            quantity: Number(item.quantity),
            unitPrice: Number(item.unit_price),
            discountAmount: Number(item.discount_amount || 0),
            total: Number(item.total),
            totalPrice: Number(item.total) // Backend expects totalPrice
          };
        }),
        customerInfo: {
          firstName: selectedCustomer.name?.split(' ')[0] || 'Customer',
          lastName: selectedCustomer.name?.split(' ').slice(1).join(' ') || 'Name',
          email: selectedCustomer.email || 'customer@example.com',
          phone: selectedCustomer.phone || '000-000-0000',
          shippingAddress: {
            street: formData.shipping_address.street || 'Unknown Street',
            city: formData.shipping_address.city || 'Unknown City',
            state: formData.shipping_address.state || 'Unknown State',
            postalCode: formData.shipping_address.postalCode || '00000',
            country: formData.shipping_address.country || 'US'
          },
          billingAddress: {
            street: formData.billing_address.street || 'Unknown Street',
            city: formData.billing_address.city || 'Unknown City', 
            state: formData.billing_address.state || 'Unknown State',
            postalCode: formData.billing_address.postalCode || '00000',
            country: formData.billing_address.country || 'US'
          }
         },
        paymentInfo: {
          method: formData.payment_method || 'cash',
          amountPaid: Number(formData.total_amount) || 0,
          currency: 'USD'
        },
        cartSummary: {
          subTotal: Number((formData.total_amount || 0) - (formData.tax_amount || 0) + (formData.discount_amount || 0)),
          tax: Number(formData.tax_amount) || 0,
          discount: Number(formData.discount_amount) || 0,
          grandTotal: Number(formData.total_amount) || 0
        },
        notes: formData.notes || '',
        vehicleConfigurationId: formData.vehicle_configuration_id ? parseInt(formData.vehicle_configuration_id) : undefined
      };
      
      console.log('Transformed order data:', submitData);
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting order:', error);
      setAlert({ type: 'error', message: 'Failed to submit order' });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        product_id: 0,
        variation_id: 0,
        quantity: 1,
        unit_price: 0,
        discount_amount: 0,
        total: 0,
      }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: typeof value === 'string' ? parseFloat(value) || 0 : value };
          // Calculate item total
          updatedItem.total = (updatedItem.quantity * updatedItem.unit_price) - updatedItem.discount_amount;
          return updatedItem;
        }
        return item;
      })
    }));
  };

  // Auto-fill unit price when variation is selected
  const handleVariationChange = (index: number, variationId: string) => {
    const variation = variations.find(v => v.id === parseInt(variationId));
    updateItem(index, 'variation_id', variationId);
    if (variation) {
      updateItem(index, 'unit_price', variation.price);
    }
  };

  const customerOptions = customers.map(c => ({
    value: c.id.toString(),
    label: `${c.name} (${c.email})${c.company_name ? ` - ${c.company_name}` : ''}`,
  }));

  const vehicleConfigurationOptions = vehicleConfigurations.map(vc => ({
    value: vc.id.toString(),
    label: `${vc.name} - ${vc.vehicle_trim?.model?.make?.name || ''} ${vc.vehicle_trim?.model?.name || ''} ${vc.vehicle_trim?.name || ''}`,
  }));

  const productOptions = filteredProducts.map(p => ({
    value: p.id.toString(),
    label: `${p.name} - $${p.price}`,
  }));
  
  console.log('filteredProducts for options:', filteredProducts);
  console.log('productOptions generated:', productOptions);

  const variationOptions = variations.map(v => ({
    value: v.id.toString(),
    label: `${v.name} - $${v.price}`,
  }));
  
  console.log('variations for options:', variations);
  console.log('variationOptions generated:', variationOptions);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'failed', label: 'Failed' },
  ];

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'financing', label: 'Financing' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2 }}>
      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 2 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {/* Customer Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CartIcon sx={{ mr: 1 }} />
            Customer Information
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
            gap: 2 
          }}>
            <SelectField
              name="user_id"
              label="Customer"
              value={formData.user_id}
              onChange={(value) => handleFieldChange('user_id', value)}
              options={customerOptions}
              required
              error={errors.user_id}
              disabled={isViewMode}
            />
            <SelectField
              name="status"
              label="Order Status"
              value={formData.status}
              onChange={(value) => handleFieldChange('status', value)}
              options={statusOptions}
              required
              disabled={isViewMode}
            />
            <SelectField
              name="payment_status"
              label="Payment Status"
              value={formData.payment_status}
              onChange={(value) => handleFieldChange('payment_status', value)}
              options={paymentStatusOptions}
              required
              disabled={isViewMode}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Vehicle Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CarIcon sx={{ mr: 1 }} />
            Vehicle Configuration
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2 
          }}>
            <FormControl fullWidth disabled={isViewMode}>
              <InputLabel>Make</InputLabel>
              <Select
                value={selectedMake || ''}
                onChange={(e) => setSelectedMake(e.target.value ? Number(e.target.value) : null)}
                label="Make"
              >
                <MenuItem value="">
                  <em>Select Make</em>
                </MenuItem>
                {vehicleMakes.map((make) => (
                  <MenuItem key={make.id} value={make.id}>
                    {make.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!selectedMake || isViewMode}>
              <InputLabel>Model</InputLabel>
              <Select
                value={selectedModel || ''}
                onChange={(e) => setSelectedModel(e.target.value ? Number(e.target.value) : null)}
                label="Model"
              >
                <MenuItem value="">
                  <em>Select Model</em>
                </MenuItem>
                {vehicleModels.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!selectedModel || isViewMode}>
              <InputLabel>Trim</InputLabel>
              <Select
                value={selectedTrim || ''}
                onChange={(e) => setSelectedTrim(e.target.value ? Number(e.target.value) : null)}
                label="Trim"
              >
                <MenuItem value="">
                  <em>Select Trim</em>
                </MenuItem>
                {vehicleTrims.map((trim) => (
                  <MenuItem key={trim.id} value={trim.id}>
                    {trim.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <SelectField
              name="vehicle_configuration_id"
              label="Configuration"
              value={formData.vehicle_configuration_id}
              onChange={(value) => handleFieldChange('vehicle_configuration_id', value)}
              options={vehicleConfigurationOptions}
              disabled={!selectedTrim || isViewMode}
              error={errors.vehicle_configuration_id}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <CartIcon sx={{ mr: 1 }} />
              Order Items
            </Typography>
            {!isViewMode && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addItem}
                size="small"
              >
                Add Item
              </Button>
            )}
          </Box>

          {formData.items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography>No items added. Click &ldquo;Add Item&rdquo; to start.</Typography>
              {productOptions.length === 0 && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Warning: No products available. Check API connection.
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {formData.items.map((item, index) => (
                <Paper key={index} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Item {index + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={`Total: $${item.total.toFixed(2)}`} 
                        color="primary" 
                        size="small" 
                      />
                      {!isViewMode && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeItem(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                      xs: '1fr', 
                      sm: 'repeat(2, 1fr)', 
                      md: '2fr 2fr 1fr 1fr 1fr 1fr' 
                    },
                    gap: 2,
                    alignItems: 'start'
                  }}>
                    <SelectField
                      name={`product-${index}`}
                      label="Product"
                      value={item.product_id ? item.product_id.toString() : ''}
                      onChange={(value) => updateItem(index, 'product_id', value)}
                      options={[
                        { value: '', label: 'Select Product' },
                        ...productOptions
                      ]}
                      required
                      error={errors[`items.${index}.product_id`]}
                      disabled={isViewMode}
                    />
                    <SelectField
                      name={`variation-${index}`}
                      label="Variation"
                      value={item.variation_id ? item.variation_id.toString() : ''}
                      onChange={(value) => handleVariationChange(index, value)}
                      options={[
                        { value: '', label: 'Select Variation' },
                        ...variationOptions
                      ]}
                      error={errors[`items.${index}.variation_id`]}
                      disabled={isViewMode}
                    />
                    <FormField
                      name={`quantity-${index}`}
                      label="Quantity"
                      value={item.quantity}
                      onChange={(value) => updateItem(index, 'quantity', value)}
                      type="number"
                      required
                      error={errors[`items.${index}.quantity`]}
                      disabled={isViewMode}
                    />
                    <FormField
                      name={`unit_price-${index}`}
                      label="Unit Price"
                      value={item.unit_price}
                      onChange={(value) => updateItem(index, 'unit_price', value)}
                      type="number"
                      required
                      error={errors[`items.${index}.unit_price`]}
                      disabled={isViewMode}
                    />
                    <FormField
                      name={`discount_amount-${index}`}
                      label="Discount Amount"
                      value={item.discount_amount}
                      onChange={(value) => updateItem(index, 'discount_amount', value)}
                      type="number"
                      disabled={isViewMode}
                    />
                    <TextField
                      label="Item Total"
                      value={`$${item.total.toFixed(2)}`}
                      disabled
                      fullWidth
                      variant="outlined"
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {errors.items && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.items}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ mr: 1 }} />
            Address Information
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3 
          }}>
            {/* Shipping Address */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Shipping Address</Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <FormField
                  name="shipping_street"
                  label="Street Address"
                  value={formData.shipping_address.street}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    shipping_address: { ...prev.shipping_address, street: value }
                  }))}
                  required
                  error={errors.shipping_address}
                  disabled={isViewMode}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormField
                    name="shipping_city"
                    label="City"
                    value={formData.shipping_address.city}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      shipping_address: { ...prev.shipping_address, city: value }
                    }))}
                    disabled={isViewMode}
                  />
                  <FormField
                    name="shipping_state"
                    label="State"
                    value={formData.shipping_address.state}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      shipping_address: { ...prev.shipping_address, state: value }
                    }))}
                    disabled={isViewMode}
                  />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormField
                    name="shipping_postalCode"
                    label="Postal Code"
                    value={formData.shipping_address.postalCode}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      shipping_address: { ...prev.shipping_address, postalCode: value }
                    }))}
                    disabled={isViewMode}
                  />
                  <FormField
                    name="shipping_country"
                    label="Country"
                    value={formData.shipping_address.country}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      shipping_address: { ...prev.shipping_address, country: value }
                    }))}
                    disabled={isViewMode}
                  />
                </Box>
              </Box>
            </Box>

            {/* Billing Address */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6">Billing Address</Typography>
                {!isViewMode && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      billing_address: { ...prev.shipping_address }
                    }))}
                  >
                    Copy from Shipping
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <FormField
                  name="billing_street"
                  label="Street Address"
                  value={formData.billing_address.street}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    billing_address: { ...prev.billing_address, street: value }
                  }))}
                  required
                  error={errors.billing_address}
                  disabled={isViewMode}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormField
                    name="billing_city"
                    label="City"
                    value={formData.billing_address.city}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      billing_address: { ...prev.billing_address, city: value }
                    }))}
                    disabled={isViewMode}
                  />
                  <FormField
                    name="billing_state"
                    label="State"
                    value={formData.billing_address.state}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      billing_address: { ...prev.billing_address, state: value }
                    }))}
                    disabled={isViewMode}
                  />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormField
                    name="billing_postalCode"
                    label="Postal Code"
                    value={formData.billing_address.postalCode}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      billing_address: { ...prev.billing_address, postalCode: value }
                    }))}
                    disabled={isViewMode}
                  />
                  <FormField
                    name="billing_country"
                    label="Country"
                    value={formData.billing_address.country}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      billing_address: { ...prev.billing_address, country: value }
                    }))}
                    disabled={isViewMode}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Payment & Totals */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalculateIcon sx={{ mr: 1 }} />
            Payment & Totals
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: '2fr auto auto 2fr' },
            gap: 2 
          }}>
            <SelectField
              name="payment_method"
              label="Payment Method"
              value={formData.payment_method}
              onChange={(value) => handleFieldChange('payment_method', value)}
              options={paymentMethodOptions}
              disabled={isViewMode}
            />
            <FormField
              name="discount_amount"
              label="Discount Amount"
              value={formData.discount_amount}
              onChange={(value) => handleFieldChange('discount_amount', parseFloat(value) || 0)}
              type="number"
              disabled={isViewMode}
            />
            <FormField
              name="tax_amount"
              label="Tax Amount"
              value={formData.tax_amount}
              onChange={(value) => handleFieldChange('tax_amount', parseFloat(value) || 0)}
              type="number"
              disabled={isViewMode}
            />
            <TextField
              label="Total Amount"
              value={`$${formData.total_amount.toFixed(2)}`}
              disabled
              fullWidth
              variant="outlined"
              sx={{ 
                '& .MuiInputBase-input': { 
                  fontWeight: 'bold', 
                  fontSize: '1.1rem',
                  color: 'primary.main'
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotesIcon sx={{ mr: 1 }} />
            Additional Information
          </Typography>
          <FormField
            name="notes"
            label="Notes (Optional)"
            value={formData.notes || ''}
            onChange={(value) => handleFieldChange('notes', value)}
            multiline
            rows={3}
            disabled={isViewMode}
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      {!isViewMode && (
        <FormActions
          onSave={handleSubmit}
          onCancel={onCancel}
          loading={loading}
          saveText={order ? 'Update Order' : 'Create Order'}
        />
      )}

      {isViewMode && (
        <FormActions
          onSave={() => {}} // No-op for view mode
          onCancel={onCancel}
          saveText="Close"
          showDelete={false}
        />
      )}
    </Box>
  );
};

export default OrderForm; 