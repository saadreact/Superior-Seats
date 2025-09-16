'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, CircularProgress, Alert, TableContainer, Paper, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, TablePagination, Stack, InputAdornment, Tooltip } from '@mui/material';
import { Visibility as ViewIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import { apiService } from '@/utils/api';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

interface OrderRow {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

export default function ShopOrdersGrid() {
  const { user } = useAppSelector((s: any) => s.auth);
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [orders, setOrders] = React.useState<OrderRow[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);

  const [filters, setFilters] = React.useState({
    search: '',
    status: '',
    payment_status: '',
  });

  const loadOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const customerId = user?.role?.id;
      const params: any = {
        page: page + 1,
        per_page: rowsPerPage,
        customer_id: customerId,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)),
      };
      const resp = await apiService.getOrders(params);
      const payload: any = resp || {};
      const rawList: any[] = Array.isArray(payload.data)
        ? payload.data
        : (Array.isArray(payload)
          ? payload
          : (Array.isArray(payload.data?.data)
            ? payload.data.data
            : (payload.orders || [])));

      const normalized: OrderRow[] = rawList.map((o: any) => ({
        id: o.id,
        order_number: o.order_number || `ORDER-${o.id}`,
        status: o.status || 'pending',
        payment_status: (o.payments && o.payments[0]?.status) || o.payment_status || 'pending',
        total_amount: parseFloat(o.total_amount || o.grand_total || 0),
        created_at: o.created_at,
      }));
      setOrders(normalized);
      const total = payload.total ?? payload.meta?.pagination?.total ?? payload.data?.total ?? rawList.length;
      setTotalCount(Number(total) || 0);
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user?.role?.id, page, rowsPerPage, filters]);

  React.useEffect(() => { loadOrders(); }, [loadOrders]);

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, md: 6 }, py: { xs: 2, sm: 3 }, pt: {md:10} }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>My Orders</Typography>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} mb={2}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr auto' }} gap={1} width="100%">
              <TextField
                size="small"
                placeholder="Search orders"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
              />
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: String(e.target.value) }))}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Payment</InputLabel>
                <Select label="Payment" value={filters.payment_status} onChange={(e) => setFilters((f) => ({ ...f, payment_status: String(e.target.value) }))}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" justifyContent="flex-end">
                <Tooltip title="Refresh">
                  <IconButton onClick={loadOrders}><RefreshIcon /></IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Placed</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id} hover>
                      <TableCell>{o.order_number}</TableCell>
                      <TableCell><Chip size="small" label={o.status.charAt(0).toUpperCase() + o.status.slice(1)} sx={{ textTransform: 'capitalize' }} /></TableCell>
                      <TableCell><Chip size="small" label={o.payment_status.charAt(0).toUpperCase() + o.payment_status.slice(1)} sx={{ textTransform: 'capitalize' }} /></TableCell>
                      <TableCell align="right">${o.total_amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => router.push(`/shop/orders/${o.id}`)}><ViewIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="flex-end">
                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={(_, p) => setPage(p)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </Box>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 