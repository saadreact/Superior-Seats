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
import { Customer, CustomerType } from '@/data/types';
import CustomerForm from '@/components/admin/CustomerForm';

// Mock data - replace with API calls
const mockCustomerTypes: CustomerType[] = [
  {
    id: '1',
    name: 'Retail Customer',
    description: 'Individual retail customers',
    discountPercentage: 0,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Wholesale Customer',
    description: 'Business customers with wholesale pricing',
    discountPercentage: 15,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

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

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>(mockCustomerTypes);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getCustomerTypeName = (customerTypeId: string) => {
    const customerType = customerTypes.find(ct => ct.id === customerTypeId);
    return customerType?.name || 'Unknown';
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      // Mock API call - replace with actual API
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      setAlert({ type: 'success', message: 'Customer deleted successfully' });
    }
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleFormSubmit = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedCustomer) {
      // Edit existing customer
      const updatedCustomer: Customer = {
        ...customer,
        id: selectedCustomer.id,
        createdAt: selectedCustomer.createdAt,
        updatedAt: new Date(),
      };
      setCustomers(prev => 
        prev.map(c => c.id === selectedCustomer.id ? updatedCustomer : c)
      );
      setAlert({ type: 'success', message: 'Customer updated successfully' });
    } else {
      // Add new customer
      const newCustomer: Customer = {
        ...customer,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCustomers(prev => [...prev, newCustomer]);
      setAlert({ type: 'success', message: 'Customer added successfully' });
    }
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <AdminLayout title="Customers">
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Customers
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Customer
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
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.company || '-'}</TableCell>
                  <TableCell>{getCustomerTypeName(customer.customerTypeId)}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.isActive ? 'Active' : 'Inactive'}
                      color={customer.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {customer.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 120 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(customer)}
                        title="View"
                        sx={{ color: 'primary.main' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(customer)}
                        title="Edit"
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(customer)}
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

        {/* Form Dialog */}
        <Dialog
          open={isFormOpen}
          onClose={handleFormCancel}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxHeight: '90vh',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: 'grey.50',
            fontWeight: 600,
          }}>
            {isViewMode ? 'View Customer' : selectedCustomer ? 'Edit Customer' : 'Add Customer'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, overflow: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
            <CustomerForm
              customer={selectedCustomer}
              customerTypes={customerTypes}
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
              Are you sure you want to delete "{customerToDelete?.firstName} {customerToDelete?.lastName}"? This action cannot be undone.
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

export default CustomersPage; 