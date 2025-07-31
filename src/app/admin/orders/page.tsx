'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { Order, OrderItem, Customer, Product } from '@/data/types';
import OrderForm from '@/components/admin/OrderForm';

// Mock data - replace with API calls
const mockCustomers: Customer[] = [
  {
    id: '1',
    customerTypeId: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'ABC Company',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    isActive: true,
    notes: 'Regular customer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    customerTypeId: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    company: 'XYZ Corporation',
    address: {
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    isActive: true,
    notes: 'Wholesale customer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Truck Seat - Standard',
    description: 'Standard truck seat with basic features',
    category: 'Seats',
    price: 299.99,
    isActive: true,
  },
  {
    id: '2',
    name: 'Truck Seat - Premium',
    description: 'Premium truck seat with advanced features',
    category: 'Seats',
    price: 499.99,
    isActive: true,
  },
  {
    id: '3',
    name: 'Seat Cover - Leather',
    description: 'High-quality leather seat cover',
    category: 'Accessories',
    price: 89.99,
    isActive: true,
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    orderNumber: 'ORD-001',
    orderDate: new Date('2024-01-15'),
    status: 'processing',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Truck Seat - Standard',
        quantity: 2,
        unitPrice: 299.99,
        totalPrice: 599.98,
        specifications: 'Black color, standard size',
      },
    ],
    subtotal: 599.98,
    tax: 59.99,
    shipping: 25.00,
    total: 684.97,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    notes: 'Customer requested expedited shipping',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    customerId: '2',
    orderNumber: 'ORD-002',
    orderDate: new Date('2024-01-20'),
    status: 'shipped',
    items: [
      {
        id: '2',
        productId: '2',
        productName: 'Truck Seat - Premium',
        quantity: 1,
        unitPrice: 499.99,
        totalPrice: 499.99,
        specifications: 'Gray color, premium features',
      },
      {
        id: '3',
        productId: '3',
        productName: 'Seat Cover - Leather',
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
        specifications: 'Black leather',
      },
    ],
    subtotal: 589.98,
    tax: 58.99,
    shipping: 0.00,
    total: 648.97,
    shippingAddress: {
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    billingAddress: {
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    paymentMethod: 'Invoice',
    paymentStatus: 'pending',
    notes: 'Wholesale order',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsViewMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      // Mock API call - replace with actual API
      setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
      setAlert({ type: 'success', message: 'Order deleted successfully' });
    }
    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleFormSubmit = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items'> & { items: Omit<OrderItem, 'id'>[] }) => {
    if (selectedOrder) {
      // Edit existing order
      const updatedOrder: Order = {
        ...order,
        items: order.items.map((item, index) => ({
          ...item,
          id: selectedOrder.items[index]?.id || Date.now().toString() + index,
        })),
        id: selectedOrder.id,
        createdAt: selectedOrder.createdAt,
        updatedAt: new Date(),
      };
      setOrders(prev => 
        prev.map(o => o.id === selectedOrder.id ? updatedOrder : o)
      );
      setAlert({ type: 'success', message: 'Order updated successfully' });
    } else {
      // Add new order
      const newOrder: Order = {
        ...order,
        items: order.items.map((item, index) => ({
          ...item,
          id: Date.now().toString() + index,
        })),
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setOrders(prev => [...prev, newOrder]);
      setAlert({ type: 'success', message: 'Order added successfully' });
    }
    setIsFormOpen(false);
    setSelectedOrder(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedOrder(null);
  };

  return (
    <AdminLayout title="Orders">
      <Box>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Orders
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Add Order
          </Button>
        </Box>

        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        {/* Desktop Table View */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer component={Paper} sx={{ 
            borderRadius: 2, 
            overflow: 'auto',
            maxWidth: '100%',
            '& .MuiTable-root': {
              minWidth: 650,
            },
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{getCustomerName(order.customerId)}</TableCell>
                    <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        color={getPaymentStatusColor(order.paymentStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(order)}
                          title="View"
                          sx={{ color: 'primary.main' }}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(order)}
                          title="Edit"
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(order)}
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
        </Box>

        {/* Mobile Card View */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {orders.map((order) => (
              <Paper key={order.id} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {getCustomerName(order.customerId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.orderDate.toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ${order.total.toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                  <Chip
                    label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    color={getPaymentStatusColor(order.paymentStatus) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleView(order)}
                    title="View"
                    sx={{ color: 'primary.main' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(order)}
                    title="Edit"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(order)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Form Dialog */}
        <Dialog
          open={isFormOpen}
          onClose={handleFormCancel}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxHeight: '90vh',
              overflow: 'hidden',
              margin: { xs: 2, sm: 'auto' },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' },
            },
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: 'grey.50',
            fontWeight: 600,
          }}>
            {isViewMode ? 'View Order' : selectedOrder ? 'Edit Order' : 'Add Order'}
          </DialogTitle>
          <DialogContent sx={{ 
            pt: 3, 
            overflow: 'auto', 
            maxHeight: 'calc(90vh - 140px)',
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 }
          }}>
            <OrderForm
              order={selectedOrder}
              customers={customers}
              products={products}
              isViewMode={isViewMode}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete order &quot;{orderToDelete?.orderNumber}&quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default OrdersPage; 