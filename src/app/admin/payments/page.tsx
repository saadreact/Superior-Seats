'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Schedule as ScheduledIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

// Mock payment data
const mockPayments = [
  {
    id: 'PAY-001',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    amount: 299.99,
    currency: 'USD',
    status: 'completed',
    method: 'Credit Card',
    date: '2024-01-15',
    orderId: 'ORD-001',
    transactionId: 'TXN-123456789',
  },
  {
    id: 'PAY-002',
    customer: 'Jane Smith',
    email: 'jane.smith@example.com',
    amount: 199.99,
    currency: 'USD',
    status: 'pending',
    method: 'PayPal',
    date: '2024-01-14',
    orderId: 'ORD-002',
    transactionId: 'TXN-123456790',
  },
  {
    id: 'PAY-003',
    customer: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    amount: 449.99,
    currency: 'USD',
    status: 'failed',
    method: 'Credit Card',
    date: '2024-01-13',
    orderId: 'ORD-003',
    transactionId: 'TXN-123456791',
  },
  {
    id: 'PAY-004',
    customer: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    amount: 159.99,
    currency: 'USD',
    status: 'completed',
    method: 'Bank Transfer',
    date: '2024-01-12',
    orderId: 'ORD-004',
    transactionId: 'TXN-123456792',
  },
  {
    id: 'PAY-005',
    customer: 'David Brown',
    email: 'david.brown@example.com',
    amount: 299.99,
    currency: 'USD',
    status: 'scheduled',
    method: 'Credit Card',
    date: '2024-01-20',
    orderId: 'ORD-005',
    transactionId: 'TXN-123456793',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    case 'scheduled':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <SuccessIcon />;
    case 'pending':
      return <PendingIcon />;
    case 'failed':
      return <ErrorIcon />;
    case 'scheduled':
      return <ScheduledIcon />;
    default:
      return <MoneyIcon />;
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const AdminPayments = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedPayment(null);
  };

  const filteredPayments = mockPayments.filter(payment =>
    payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPayments = filteredPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedPayments = mockPayments.filter(p => p.status === 'completed').length;
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const failedPayments = mockPayments.filter(p => p.status === 'failed').length;

  return (
    <AdminLayout title="Payments">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Payment Management 💳
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage all payment transactions, track revenue, and handle payment issues.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#4caf50', mr: 2 }}>
                    <MoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {formatCurrency(totalRevenue, 'USD')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#4caf50', mr: 2 }}>
                    <SuccessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {completedPayments}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#ff9800', mr: 2 }}>
                    <PendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {pendingPayments}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#f44336', mr: 2 }}>
                    <ErrorIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Failed
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {failedPayments}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              sx={{ minWidth: 120 }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ minWidth: 120 }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{ minWidth: 120 }}
            >
              Refresh
            </Button>
          </Box>
        </Paper>

        {/* Payments Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Payment ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPayments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {payment.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {payment.customer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(payment.amount, payment.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(payment.status)}
                        label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        color={getStatusColor(payment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.method}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(payment.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {payment.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewPayment(payment)}
                          sx={{ color: 'primary.main' }}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'success.main' }}
                        >
                          <ReceiptIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPayments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Payment Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Payment Details - {selectedPayment?.id}
          </DialogTitle>
          <DialogContent>
            {selectedPayment && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedPayment.customer}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedPayment.email}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Payment Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Amount:</strong> {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Method:</strong> {selectedPayment.method}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> 
                      <Chip
                        icon={getStatusIcon(selectedPayment.status)}
                        label={selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                        color={getStatusColor(selectedPayment.status) as any}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Transaction Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Transaction ID:</strong> {selectedPayment.transactionId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Order ID:</strong> {selectedPayment.orderId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {new Date(selectedPayment.date).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button variant="contained" startIcon={<ReceiptIcon />}>
              Download Receipt
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default AdminPayments;
