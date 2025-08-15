'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  ShoppingCart as CartIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';

interface OrderItem {
  id: number;
  product_id: number;
  variation_id: number;
  quantity?: number;
  unit_price?: number;
  discount_amount?: number;
  total?: number;
  product?: {
    name?: string;
    category?: string;
  };
  variation?: {
    name?: string;
    material_type?: string;
    color?: string;
  };
}

interface Order {
  id: number;
  order_number?: string;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  total_amount?: number;
  discount_amount?: number;
  tax_amount?: number;
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
  invoice_number?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name?: string;
    email?: string;
    customer_type?: string;
    company_name?: string;
  };
  vehicle_configuration?: {
    id: number;
    name: string;
    description?: string;
    vehicle_trim?: {
      name?: string;
      model?: {
        name?: string;
        make?: {
          name?: string;
        };
      };
    };
  };
  items?: OrderItem[];
}

const OrderViewPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  // Helper function to safely parse order ID
  const getOrderIdNum = () => {
    const num = parseInt(orderId);
    if (isNaN(num)) {
      throw new Error(`Invalid order ID: ${orderId}`);
    }
    return num;
  };
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        const response = await apiService.getOrder(getOrderIdNum());
        console.log('Order view API response:', response);
        const orderData = response.data || response;
        console.log('Order data to be displayed:', orderData);
        setOrder(orderData);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        console.error('Order ID that failed:', orderId);
        
        if (error.response?.status === 404) {
          setAlert({ type: 'error', message: `Order #${orderId} not found. It may not exist or you may not have permission to view it.` });
        } else {
          setAlert({ type: 'error', message: 'Failed to load order data' });
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleEdit = () => {
    router.push(`/admin/orders/${orderId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteOrder(getOrderIdNum());
      setAlert({ type: 'success', message: 'Order deleted successfully!' });
      setTimeout(() => {
        router.push('/admin/orders');
      }, 1500);
    } catch (error: any) {
      console.error('Error deleting order:', error);
      setAlert({ type: 'error', message: 'Failed to delete order' });
    }
    setDeleteDialogOpen(false);
  };

  const handleStatusUpdate = async () => {
    try {
      await apiService.updateOrderStatus(getOrderIdNum(), {
        status: newStatus,
        notes: statusNotes,
      });
      setAlert({ type: 'success', message: 'Order status updated successfully!' });
      // Refresh order data
      const response = await apiService.getOrder(getOrderIdNum());
      setOrder(response.data || response);
    } catch (error: any) {
      console.error('Error updating status:', error);
      setAlert({ type: 'error', message: 'Failed to update order status' });
    }
    setStatusUpdateDialogOpen(false);
    setNewStatus('');
    setStatusNotes('');
  };

  const handleDownloadInvoice = async () => {
    try {
      const blob = await apiService.downloadInvoice(getOrderIdNum());
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order?.order_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      setAlert({ type: 'error', message: 'Failed to download invoice' });
    }
  };

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'confirmed': return 'success';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string | undefined | null) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'partial': return 'info';
      case 'paid': return 'success';
      case 'refunded': return 'secondary';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddressFromObject = (address: any): string => {
    if (!address || typeof address === 'string') return address || '';
    
    const parts = [];
    
    // Name line
    const name = `${address.firstName || ''} ${address.lastName || ''}`.trim();
    if (name) parts.push(name);
    
    // Company line
    if (address.company) parts.push(address.company);
    
    // Street address
    if (address.street) parts.push(address.street);
    
    // City, State ZIP
    const cityStateLine = [
      address.city,
      address.state,
      address.postalCode
    ].filter(Boolean).join(', ');
    if (cityStateLine) parts.push(cityStateLine);
    
    // Country
    if (address.country && address.country !== 'US') parts.push(address.country);
    
    return parts.join('\n');
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          p: { xs: 2, md: 3 }
        }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!order && !loading) {
    return (
      <AdminLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Order #{orderId} not found or failed to load.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => router.push('/admin/orders')}
            sx={{ mt: 2 }}
          >
            Back to Orders
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  // At this point, order is guaranteed to exist
  const orderData = order!;

  return (
    <AdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2
        }}>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/admin/orders')}
              sx={{ mb: 1 }}
            >
              Back to Orders
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Order #{order?.order_number || 'Unknown'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created on {order?.created_at ? formatDate(order.created_at) : 'Unknown date'}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<UpdateIcon />}
              onClick={() => setStatusUpdateDialogOpen(true)}
              size="small"
            >
              Update Status
            </Button>
            {order?.invoice_number && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadInvoice}
                size="small"
              >
                Download Invoice
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              size="small"
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              size="small"
            >
              Delete
            </Button>
          </Stack>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: order?.vehicle_configuration ? '1fr 1fr 1fr' : '1fr 1fr' },
          gap: 3 
        }}>
          {/* Order Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon sx={{ mr: 1 }} />
                Order Summary
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip
                    label={order?.status || 'Unknown'}
                    color={getStatusColor(order?.status) as any}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Payment Status:</Typography>
                  <Chip
                    label={order?.payment_status || 'Unknown'}
                    color={getPaymentStatusColor(order?.payment_status) as any}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                {order?.payment_method && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Payment Method:</Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {order?.payment_method?.replace('_', ' ')}
                    </Typography>
                  </Box>
                )}
                {order?.invoice_number && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Invoice #:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {order?.invoice_number}
                    </Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight={600}>Total Amount:</Typography>
                  <Typography variant="body1" fontWeight={600} color="primary">
                    {formatCurrency(order?.total_amount || 0)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} />
                Customer Information
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" fontWeight={500}>
                  {order?.user?.name || 'Unknown Customer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order?.user?.email || 'No email'}
                </Typography>
                {order?.user?.company_name && (
                  <Typography variant="body2" color="text.secondary">
                    {order?.user?.company_name}
                  </Typography>
                )}
                <Chip
                  label={order?.user?.customer_type || 'Unknown'}
                  size="small"
                  variant="outlined"
                  sx={{ alignSelf: 'flex-start', textTransform: 'capitalize' }}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Vehicle Configuration */}
          {order?.vehicle_configuration && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CarIcon sx={{ mr: 1 }} />
                  Vehicle Configuration
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body1" fontWeight={500}>
                    {order?.vehicle_configuration?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order?.vehicle_configuration?.vehicle_trim?.model?.make?.name}{' '}
                    {order?.vehicle_configuration?.vehicle_trim?.model?.name}{' '}
                    {order?.vehicle_configuration?.vehicle_trim?.name}
                  </Typography>
                  {order?.vehicle_configuration?.description && (
                    <Typography variant="body2" color="text.secondary">
                      {order?.vehicle_configuration?.description}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Order Items */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CartIcon sx={{ mr: 1 }} />
              Order Items ({order?.items?.length || 0})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Variation</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(order?.items || []).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {item.product?.name || 'Unknown Product'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.product?.category || 'Unknown Category'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {item.variation?.name || 'Unknown Variation'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.variation?.material_type || 'Unknown'} • {item.variation?.color || 'Unknown'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{item.quantity || 0}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unit_price || 0)}</TableCell>
                      <TableCell align="right">
                        {(item.discount_amount || 0) > 0 ? formatCurrency(item.discount_amount || 0) : '-'}
                      </TableCell>
                                              <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {formatCurrency(item.total || 0)}
                        </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} />
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight={600}>
                        Subtotal:
                      </Typography>
                      {(order?.discount_amount || 0) > 0 && (
                        <Typography variant="body2" color="error">
                          Order Discount:
                        </Typography>
                      )}
                      {(order?.tax_amount || 0) > 0 && (
                        <Typography variant="body2">
                          Tax:
                        </Typography>
                      )}
                      <Typography variant="h6" fontWeight={600} color="primary">
                        Total:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight={600}>
                        {formatCurrency((order?.items || []).reduce((sum, item) => sum + (item.total || 0), 0))}
                      </Typography>
                      {(order?.discount_amount || 0) > 0 && (
                        <Typography variant="body2" color="error">
                          -{formatCurrency(order?.discount_amount || 0)}
                        </Typography>
                      )}
                      {(order?.tax_amount || 0) > 0 && (
                        <Typography variant="body2">
                          +{formatCurrency(order?.tax_amount || 0)}
                        </Typography>
                      )}
                      <Typography variant="h6" fontWeight={600} color="primary">
                        {formatCurrency(order?.total_amount || 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mt: 3
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShippingIcon sx={{ mr: 1 }} />
                Shipping Address
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {formatAddressFromObject(orderData.shipping_address) || 'No shipping address'}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1 }} />
                Billing Address
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {formatAddressFromObject(orderData.billing_address) || 'No billing address'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Notes */}
        {orderData.notes && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotesIcon sx={{ mr: 1 }} />
                Order Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {orderData.notes}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Status Update Dialog */}
        <Dialog open={statusUpdateDialogOpen} onClose={() => setStatusUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="New Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Notes (Optional)"
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} variant="contained" disabled={!newStatus}>
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete order{' '}
              <strong>#{orderData.order_number}</strong>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete Order
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default OrderViewPage; 