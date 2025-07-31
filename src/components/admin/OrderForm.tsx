'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Order, Customer, Product, OrderItem } from '@/data/types';
import { FormField, SelectField, FormActions } from '@/components/common/FormComponents';

interface OrderFormProps {
  order?: Order | null;
  customers: Customer[];
  products: Product[];
  isViewMode?: boolean;
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items'> & { items: Omit<OrderItem, 'id'>[] }) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  customers,
  products,
  isViewMode = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items'> & { items: Omit<OrderItem, 'id'>[] }>({
    customerId: '',
    orderNumber: '',
    orderDate: new Date(),
    status: 'pending',
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    paymentMethod: '',
    paymentStatus: 'pending',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        customerId: order.customerId,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        status: order.status,
        items: order.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          specifications: item.specifications || '',
        })),
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes || '',
      });
    }
  }, [order]);

  useEffect(() => {
    calculateTotals(formData.items);
  }, [formData.items]);

  const calculateTotals = (items: Omit<OrderItem, 'id'>[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      shipping,
      total,
    }));
  };

  const handleAddItem = () => {
    const newItem: Omit<OrderItem, 'id'> = {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      specifications: '',
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      const item = { ...newItems[index] };

      if (field === 'productId') {
        const product = products.find(p => p.id === value);
        if (product) {
          item.productId = value as string;
          item.productName = product.name;
          item.unitPrice = product.price;
          item.totalPrice = product.price * item.quantity;
        }
      } else if (field === 'quantity') {
        item.quantity = Number(value);
        item.totalPrice = item.unitPrice * item.quantity;
      } else if (field === 'unitPrice') {
        item.unitPrice = Number(value);
        item.totalPrice = item.unitPrice * item.quantity;
      } else {
        (item as any)[field] = value;
      }

      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    if (!formData.orderNumber) {
      newErrors.orderNumber = 'Order number is required';
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string | number | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (prefix: string, field: string, value: string) => {
    setFormData(prev => {
      const addressKey = `${prefix}Address` as 'shippingAddress' | 'billingAddress';
      const currentAddress = prev[addressKey];
      return {
        ...prev,
        [addressKey]: { ...currentAddress, [field]: value }
      };
    });
  };

  const customerOptions = customers.map(c => ({
    value: c.id,
    label: `${c.firstName} ${c.lastName}${c.company ? ` (${c.company})` : ''}`,
  }));

  const productOptions = products.map(p => ({
    value: p.id,
    label: `${p.name} - $${p.price}`,
  }));

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
  ];

  const paymentMethodOptions = [
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Invoice', label: 'Invoice' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cash', label: 'Cash' },
  ];

  return (
    <Box sx={{ pt: 2 }}>
      {/* Order Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Order Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={3}
          sx={{ width: '100%' }}
        >
          <SelectField
            name="customerId"
            label="Customer"
            value={formData.customerId}
            onChange={(value) => handleFieldChange('customerId', value)}
            options={customerOptions}
            required
            error={errors.customerId}
            disabled={isViewMode}
          />

          <FormField
            name="orderNumber"
            label="Order Number"
            value={formData.orderNumber}
            onChange={(value) => handleFieldChange('orderNumber', value)}
            required
            error={errors.orderNumber}
            disabled={isViewMode}
          />

          <FormField
            name="orderDate"
            label="Order Date"
            value={formData.orderDate.toISOString().split('T')[0]}
            onChange={(value) => handleFieldChange('orderDate', new Date(value))}
            type="date"
            required
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
        </Grid>
      </Box>

      {/* Order Items */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 2 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Order Items
          </Typography>
          {!isViewMode && (
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, alignSelf: { xs: 'stretch', sm: 'auto' } }}
            >
              Add Item
            </Button>
          )}
        </Box>
        <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
          sx={{ width: '100%' }}
        >
          {formData.items.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No items added yet. Click &quot;Add Item&quot; to start.
            </Typography>
          ) : (
            <>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'auto', maxWidth: '100%' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Unit Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Total</TableCell>
                      {!isViewMode && <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ padding: 1, verticalAlign: 'top' }}>
                          {!isViewMode ? (
                            <SelectField
                              name={`product-${index}`}
                              label=""
                              value={item.productId}
                              onChange={(value) => handleItemChange(index, 'productId', value)}
                              options={productOptions}
                              required
                              disabled={isViewMode}
                              size="small"
                            />
                          ) : (
                            item.productName
                          )}
                        </TableCell>
                        <TableCell sx={{ padding: 1, verticalAlign: 'top' }}>
                          {!isViewMode ? (
                            <FormField
                              name={`quantity-${index}`}
                              label=""
                              value={item.quantity}
                              onChange={(value) => handleItemChange(index, 'quantity', parseInt(value) || 0)}
                              type="number"
                              required
                              disabled={isViewMode}
                              size="small"
                            />
                          ) : (
                            item.quantity
                          )}
                        </TableCell>
                        <TableCell sx={{ padding: 1, verticalAlign: 'top' }}>
                          {!isViewMode ? (
                            <FormField
                              name={`unitPrice-${index}`}
                              label=""
                              value={item.unitPrice}
                              onChange={(value) => handleItemChange(index, 'unitPrice', parseFloat(value) || 0)}
                              type="number"
                              required
                              disabled={isViewMode}
                              size="small"
                            />
                          ) : (
                            `$${item.unitPrice.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell>
                          ${item.totalPrice.toFixed(2)}
                        </TableCell>
                        {!isViewMode && (
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(index)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {formData.items.map((item, index) => (
                  <Paper key={index} sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Product
                        </Typography>
                        {!isViewMode ? (
                          <SelectField
                            name={`product-${index}`}
                            label=""
                            value={item.productId}
                            onChange={(value) => handleItemChange(index, 'productId', value)}
                            options={productOptions}
                            required
                            disabled={isViewMode}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">
                            {item.productName}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ${item.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Quantity
                        </Typography>
                        {!isViewMode ? (
                          <FormField
                            name={`quantity-${index}`}
                            label=""
                            value={item.quantity}
                            onChange={(value) => handleItemChange(index, 'quantity', parseInt(value) || 0)}
                            type="number"
                            required
                            disabled={isViewMode}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2">
                            {item.quantity}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Unit Price
                        </Typography>
                        {!isViewMode ? (
                          <FormField
                            name={`unitPrice-${index}`}
                            label=""
                            value={item.unitPrice}
                            onChange={(value) => handleItemChange(index, 'unitPrice', parseFloat(value) || 0)}
                            type="number"
                            required
                            disabled={isViewMode}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2">
                            ${item.unitPrice.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {!isViewMode && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
            </>
          )}
        </Grid>
      </Box>

      {/* Order Totals */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Order Totals
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={3}
          sx={{ width: '100%' }}
        >
          <FormField
            name="subtotal"
            label="Subtotal"
            value={formData.subtotal.toFixed(2)}
            onChange={() => {}} // Read-only
            disabled={true}
          />

          <FormField
            name="tax"
            label="Tax"
            value={formData.tax.toFixed(2)}
            onChange={() => {}} // Read-only
            disabled={true}
          />

          <FormField
            name="shipping"
            label="Shipping"
            value={formData.shipping.toFixed(2)}
            onChange={() => {}} // Read-only
            disabled={true}
          />

          <FormField
            name="total"
            label="Total"
            value={formData.total.toFixed(2)}
            onChange={() => {}} // Read-only
            disabled={true}
          />
        </Grid>
      </Box>

      {/* Payment Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Payment Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={3}
          sx={{ width: '100%' }}
        >
          <SelectField
            name="paymentMethod"
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(value) => handleFieldChange('paymentMethod', value)}
            options={paymentMethodOptions}
            required
            error={errors.paymentMethod}
            disabled={isViewMode}
          />

          <SelectField
            name="paymentStatus"
            label="Payment Status"
            value={formData.paymentStatus}
            onChange={(value) => handleFieldChange('paymentStatus', value)}
            options={paymentStatusOptions}
            required
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {/* Notes */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Additional Information
        </Typography>
        <Grid
          display="grid"
          gridTemplateColumns="1fr"
          gap={3}
          sx={{ width: '100%' }}
        >
          <FormField
            name="notes"
            label="Notes (Optional)"
            value={formData.notes || ''}
            onChange={(value) => handleFieldChange('notes', value)}
            multiline
            rows={3}
            disabled={isViewMode}
          />
        </Grid>
      </Box>

      {!isViewMode && (
        <FormActions
          onSave={handleSubmit}
          onCancel={onCancel}
          loading={loading}
          saveText={order ? 'Update' : 'Create'}
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