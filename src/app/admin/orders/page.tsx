'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  Stack,
  InputAdornment,
  Badge,
  Menu,
  Fade,
  ListItemIcon,
  ListItemText,
  TablePagination,
} from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  ShoppingCart as CartIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  MoreVert as MoreVertIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  shipping_address: string;
  billing_address: string;
  notes?: string;
  invoice_number?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    customer_type: string;
    company_name?: string;
  };
  vehicle_configuration?: {
    id: number;
    name: string;
    description: string;
    quantity: number;
  };
  items?: Array<{
    id: number;
    product_id: number;
    variation_id: number;
    quantity: number;
    unit_price: number;
    total: number;
    product: {
      name: string;
      category: string;
    };
    variation: {
      name: string;
      material_type: string;
    };
  }>;
}

interface OrderStatistics {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  today_orders: number;
  today_revenue: number;
}

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_status: '',
    date_from: '',
    date_to: '',
    sort_by: 'created_at',
    sort_order: 'desc' as 'asc' | 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch orders with current filters and pagination
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        per_page: rowsPerPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };

      const ordersResponse = await apiService.getOrders(params);
      
      console.log('Orders API Response:', ordersResponse);
      
      // Handle the correct response structure
      setOrders(ordersResponse.data || []);
      setTotalCount(ordersResponse.meta?.pagination?.total || 0);
      
      // Calculate statistics from the current page of orders data
      // Note: These stats are based on the current page only, not all orders
      const orders = ordersResponse.data || [];
      const today = new Date().toDateString();
      
      const calculatedStats = {
        total_orders: ordersResponse.meta?.pagination?.total || 0,
        total_revenue: orders.reduce((sum: number, order: any) => sum + (parseFloat(order.total_amount) || 0), 0),
        pending_orders: orders.filter((order: any) => order.status === 'pending').length,
        processing_orders: orders.filter((order: any) => order.status === 'processing').length,
        shipped_orders: orders.filter((order: any) => order.status === 'shipped').length,
        delivered_orders: orders.filter((order: any) => order.status === 'delivered').length,
        cancelled_orders: orders.filter((order: any) => order.status === 'cancelled').length,
        today_orders: orders.filter((order: any) => 
          new Date(order.created_at).toDateString() === today
        ).length,
        today_revenue: orders.filter((order: any) => 
          new Date(order.created_at).toDateString() === today
        ).reduce((sum: number, order: any) => sum + (parseFloat(order.total_amount) || 0), 0)
      };
      setStatistics(calculatedStats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setAlert({ type: 'error', message: 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      payment_status: '',
      date_from: '',
      date_to: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleView = (id: number) => {
    router.push(`/admin/orders/${id}`);
    handleMenuClose();
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/orders/${id}/edit`);
    handleMenuClose();
  };

  const handleCreate = () => {
    router.push('/admin/orders/create');
  };

  const confirmDelete = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;

    try {
      await apiService.deleteOrder(orderToDelete.id);
      setAlert({ type: 'success', message: 'Order deleted successfully' });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      setAlert({ type: 'error', message: 'Failed to delete order' });
    }

    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleExport = async () => {
    try {
      const filterParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const blob = await apiService.exportOrders({
        format: 'excel',
        ...filterParams,
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting orders:', error);
      setAlert({ type: 'error', message: 'Failed to export orders' });
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: '', label: 'All Payment Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'failed', label: 'Failed' },
  ];

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
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Orders Management
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              size="small"
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchOrders}
              size="small"
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              size="small"
            >
              New Order
            </Button>
          </Stack>
        </Box>

        {/* Statistics Cards */}
        {statistics && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2, 
            mb: 3 
          }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {statistics.total_orders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PaymentIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {formatCurrency(statistics.total_revenue)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScheduleIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {statistics.pending_orders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Orders
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CartIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {statistics.today_orders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today&apos;s Orders
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Filters */}
        <Fade in={showFilters}>
          <Card sx={{ mb: 3, display: showFilters ? 'block' : 'none' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Filters
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: '2fr 1fr 1fr 1fr 1fr auto' 
                },
                gap: 2 
              }}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Order number, customer name..."
                />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Status"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={filters.payment_status}
                    onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                    label="Payment Status"
                  >
                    {paymentStatusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="From Date"
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="To Date"
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  sx={{ height: '56px', minWidth: '120px' }}
                >
                  Clear
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Orders Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {order.order_number}
                        </Typography>
                        {order.invoice_number && (
                          <Typography variant="caption" color="text.secondary">
                            Invoice: {order.invoice_number}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {order.user?.name || 'Unknown Customer'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.user?.email || 'No email'}
                          </Typography>
                          {order.user?.company_name && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {order.user.company_name}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status || 'Unknown'}
                          color={getStatusColor(order.status) as any}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip
                            label={order.payment_status || 'Unknown'}
                            color={getPaymentStatusColor(order.payment_status) as any}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                          {order.payment_method && (
                            <Typography variant="caption" color="text.secondary">
                              {order.payment_method.replace('_', ' ')}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(order.total_amount || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`${order.items?.length || 0} items`}>
                          <Badge badgeContent={order.items?.length || 0} color="primary">
                            <CartIcon color="action" />
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(order.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, order.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Card>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => selectedOrderId && handleView(selectedOrderId)}>
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => selectedOrderId && handleEdit(selectedOrderId)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Order</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              const order = orders.find(o => o.id === selectedOrderId);
              if (order) confirmDelete(order);
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Order</ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Order</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete order{' '}
              <strong>{orderToDelete?.order_number}</strong>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default OrdersPage; 