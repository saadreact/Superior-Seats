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
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { apiService } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [canEditSelected, setCanEditSelected] = useState<boolean>(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states - Updated to match customer list structure
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_status: '',
    customer_id: '',
    date_from: '',
    date_to: '',
    min_amount: '',
    max_amount: '',
    sort_by: 'created_at' as 'order_number' | 'created_at' | 'total_amount' | 'status',
    sort_order: 'desc' as 'asc' | 'desc',
  });

  const mapPaymentStatus = (status?: string) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (['authorized', 'captured', 'completed'].includes(s)) return 'paid';
    if (['pending', 'processing'].includes(s)) return 'pending';
    if (['refunded', 'partially_refunded'].includes(s)) return 'refunded';
    if (s === 'partial') return 'partial';
    if (['failed', 'declined'].includes(s)) return 'failed';
    return s;
  };

  // Sorting handler similar to customer list
  const handleSort = (column: 'order_number' | 'created_at' | 'total_amount' | 'status') => {
    const newOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({
      ...prev,
      sort_by: column,
      sort_order: newOrder,
    }));
    setPage(0);
    // Trigger fetch with new sort parameters
    setTimeout(() => {
      fetchOrders();
    }, 0);
  };

  // Search handler similar to customer list
  const handleSearch = () => {
    setPage(0);
    fetchOrders();
  };

  // Reset filters similar to customer list
  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      payment_status: '',
      customer_id: '',
      date_from: '',
      date_to: '',
      min_amount: '',
      max_amount: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    setPage(0);
  };

  // Fetch orders with current filters and pagination
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        per_page: rowsPerPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        ),
      } as any;

      // Convert sort parameters to match API expectations
      if (params.sort_by) {
        params.sort = params.sort_by;
        delete params.sort_by;
      }
      if (params.sort_order) {
        params.order = params.sort_order;
        delete params.sort_order;
      }

      const ordersResponse = await apiService.getOrders(params);
      const payload: any = ordersResponse || {};
      const rawList: any[] = Array.isArray(payload.data)
        ? payload.data
        : (Array.isArray(payload)
          ? payload
          : (Array.isArray(payload.data?.data)
            ? payload.data.data
            : (payload.orders || [])));
      const total = payload.total ?? payload.meta?.pagination?.total ?? payload.data?.total ?? rawList.length;

      const normalized: Order[] = rawList.map((o: any) => {
        const cust = o.customer || o.user || {};
        const nameCombined = `${cust.first_name || ''} ${cust.last_name || ''}`.trim();
        const displayName = nameCombined || cust.name || cust.email || 'Unknown Customer';
        const primaryPayment = Array.isArray(o.payments) && o.payments.length > 0 ? o.payments[0] : null;

        return {
          id: o.id,
          order_number: o.order_number,
          status: o.status,
          payment_status: mapPaymentStatus(primaryPayment?.status),
          payment_method: primaryPayment?.method || '',
          total_amount: parseFloat(o.total_amount || o.grand_total || 0),
          shipping_address: o.shipping_address || '',
          billing_address: o.billing_address || '',
          notes: o.notes || '',
          invoice_number: o.invoice_number || '',
          created_at: o.created_at,
          updated_at: o.updated_at,
          user: {
            id: cust.id,
            name: displayName,
            email: cust.email,
            customer_type: cust.customer_type,
            company_name: cust.company_name,
          },
          items: (o.order_items || []).map((it: any) => ({
            id: it.id,
            product_id: parseInt(it.item_id) || 0,
            variation_id: 0,
            quantity: it.quantity,
            unit_price: parseFloat(it.unit_price || 0),
            total: parseFloat(it.total_price || 0),
            product: {
              name: it.name || 'Product',
              category: '',
            },
            variation: {
              name: it.name || 'Variation',
              material_type: '',
            },
          })),
        } as Order;
      });

      setOrders(normalized);
      setTotalCount(Number(total) || 0);

      // Stats from current page
      const today = new Date().toDateString();
      const calculatedStats = {
        total_orders: Number(total) || normalized.length,
        total_revenue: normalized.reduce((sum: number, o: any) => sum + (parseFloat(o.total_amount) || 0), 0),
        pending_orders: normalized.filter((o: any) => o.status === 'pending').length,
        processing_orders: normalized.filter((o: any) => o.status === 'processing').length,
        shipped_orders: normalized.filter((o: any) => o.status === 'shipped').length,
        delivered_orders: normalized.filter((o: any) => o.status === 'delivered').length,
        cancelled_orders: normalized.filter((o: any) => o.status === 'cancelled').length,
        today_orders: normalized.filter((o: any) => new Date(o.created_at).toDateString() === today).length,
        today_revenue: normalized.filter((o: any) => new Date(o.created_at).toDateString() === today).reduce((sum: number, o: any) => sum + (parseFloat(o.total_amount) || 0), 0)
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
    // Initialize filters from URL params on first load
    const cid = searchParams?.get('customer_id') || '';
    if (cid) {
      setFilters((prev) => ({ ...prev, customer_id: cid }));
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      customer_id: '',
      date_from: '',
      date_to: '',
      min_amount: '',
      max_amount: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
    const o = orders.find(o => o.id === orderId);
    const isPaid = String(o?.payment_status || '').toLowerCase() === 'paid';
    setCanEditSelected(!isPaid);
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
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
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

  // SortableHeader component similar to customer list
  const SortableHeader = ({ 
    column, 
    children, 
    sortKey 
  }: { 
    column: 'order_number' | 'created_at' | 'total_amount' | 'status';
    children: React.ReactNode;
    sortKey: string;
  }) => {
    const isActive = filters.sort_by === sortKey;
    const isAsc = filters.sort_order === 'asc';
    
    return (
      <TableCell 
        sx={{ 
          fontWeight: 600, 
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          position: 'relative',
          padding: '16px',
          backgroundColor: 'grey.50',
        }}
        onClick={() => handleSort(column)}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          width: '100%'
        }}>
          {children}
          {isActive && (
            <Box sx={{ ml: 0.5 }}>
              {isAsc ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
            </Box>
          )}
        </Box>
      </TableCell>
    );
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
    <AdminLayout title="Orders">
      <Box>
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
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            {/* Search Bar positioned at top-left */}
            <TextField
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )}}
              sx={{ maxWidth: 400 }}
              size="small"
            />
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDialogOpen(true)}
              size="small"
            >
              Filters
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
              sx={{ 
                alignSelf: { xs: 'stretch', sm: 'auto' },
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>

        {/* Filters Dialog */}
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Filter Orders</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2 }}>
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
                placeholder="Order number, customer name or email"
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
            </Box>
            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
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
              <TextField
                fullWidth
                label="Min Amount"
                type="number"
                value={filters.min_amount}
                onChange={(e) => handleFilterChange('min_amount', e.target.value)}
              />
              <TextField
                fullWidth
                label="Max Amount"
                type="number"
                value={filters.max_amount}
                onChange={(e) => handleFilterChange('max_amount', e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetFilters} startIcon={<ClearIcon />}>Clear</Button>
            <Button onClick={() => setFilterDialogOpen(false)} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Paper sx={{ overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <SortableHeader column="order_number" sortKey="order_number">Order #</SortableHeader>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Customer</TableCell>
                        <SortableHeader column="status" sortKey="status">Status</SortableHeader>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Payment</TableCell>
                        <SortableHeader column="total_amount" sortKey="total_amount">Total</SortableHeader>
                        <SortableHeader column="created_at" sortKey="created_at">Date</SortableHeader>
                        <TableCell align="center" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
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
                                label={mapPaymentStatus(order.payment_status) || 'pending'}
                                color={getPaymentStatusColor(mapPaymentStatus(order.payment_status)) as any}
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
                            <Typography variant="body2">
                              {formatDate(order.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: 120 }}>
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleView(order.id)}
                                title="View"
                                sx={{ color: 'primary.main' }}
                              >
                                <ViewIcon />
                              </IconButton>
                              {String(order.payment_status || '').toLowerCase() !== 'paid' && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(order.id)}
                                  title="Edit"
                                  sx={{ color: 'primary.main' }}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => confirmDelete(order)}
                                title="Delete"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {orders.map((order) => (
                  <Paper key={order.id} sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {order.order_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {order.user?.name || 'Unknown Customer'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.user?.email || 'No email'}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.status || 'Unknown'}
                        color={getStatusColor(order.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr' }, gap: 1, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Payment</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip 
                            label={mapPaymentStatus(order.payment_status) || 'pending'} 
                            color={getPaymentStatusColor(mapPaymentStatus(order.payment_status)) as any} 
                            size="small" 
                            sx={{ textTransform: 'capitalize' }} 
                          />
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Total</Typography>
                        <Typography variant="body2" fontWeight={600}>{formatCurrency(order.total_amount || 0)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Items</Typography>
                        <Typography variant="body2">{order.items?.length || 0}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date</Typography>
                        <Typography variant="body2">{formatDate(order.created_at)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleView(order.id)} sx={{ color: 'primary.main' }}>
                        <ViewIcon />
                      </IconButton>
                      {String(order.payment_status || '').toLowerCase() !== 'paid' && (
                        <IconButton size="small" onClick={() => handleEdit(order.id)} sx={{ color: 'primary.main' }}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton size="small" onClick={() => confirmDelete(order)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPageZeroBased) => setPage(newPageZeroBased)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}

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
