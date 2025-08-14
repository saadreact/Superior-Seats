'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import OrderForm from '@/components/admin/OrderForm';
import { useRouter } from 'next/navigation';
import { Order } from '@/data/types';



// Mock order data
const mockOrder: Order = {
  id: '1',
  customerId: '1',
  orderNumber: 'ORD-001',
  orderDate: new Date('2024-01-15'),
  status: 'pending',
  items: [
    {
      id: '1',
      productId: '1',
      productName: 'Truck Seat - Standard',
      quantity: 2,
      unitPrice: 299.99,
      totalPrice: 599.98,
      specifications: 'Black leather',
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
  paymentStatus: 'pending',
  notes: 'Customer requested expedited shipping',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

interface EditOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditOrderPage = ({ params }: EditOrderPageProps) => {
  const router = useRouter();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const resolvedParams = React.use(params);

  React.useEffect(() => {
    // Simulate API call to fetch order
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 500);
  }, [resolvedParams.id]);

  const handleSubmit = (updatedOrder: any) => {
    // Handle order update
    console.log('Updating order:', updatedOrder);
    // Add API call here
    router.push('/admin/orders');
  };

  const handleCancel = () => {
    router.push('/admin/orders');
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Order">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Not Found">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error">
            Order not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/orders')}
            sx={{ mt: 2 }}
          >
            Back to Orders
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Order">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/orders')}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Order: {order.orderNumber}
        </Typography>
      </Box>
      
      <OrderForm
        order={order}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};



export default EditOrderPage; 