'use client';

import React, { useState, useEffect } from 'react';
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
import { CustomerType } from '@/data/types';
import CustomerTypeForm from '@/components/admin/CustomerTypeForm';

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
  {
    id: '3',
    name: 'VIP Customer',
    description: 'Premium customers with special benefits',
    discountPercentage: 25,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const CustomerTypesPage = () => {
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>(mockCustomerTypes);
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerTypeToDelete, setCustomerTypeToDelete] = useState<CustomerType | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAdd = () => {
    setSelectedCustomerType(null);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleView = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setIsViewMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = (customerType: CustomerType) => {
    setCustomerTypeToDelete(customerType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerTypeToDelete) {
      // Mock API call - replace with actual API
      setCustomerTypes(prev => prev.filter(ct => ct.id !== customerTypeToDelete.id));
      setAlert({ type: 'success', message: 'Customer type deleted successfully' });
    }
    setIsDeleteDialogOpen(false);
    setCustomerTypeToDelete(null);
  };

  const handleFormSubmit = (customerType: Omit<CustomerType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedCustomerType) {
      // Edit existing customer type
      const updatedCustomerType: CustomerType = {
        ...customerType,
        id: selectedCustomerType.id,
        createdAt: selectedCustomerType.createdAt,
        updatedAt: new Date(),
      };
      setCustomerTypes(prev => 
        prev.map(ct => ct.id === selectedCustomerType.id ? updatedCustomerType : ct)
      );
      setAlert({ type: 'success', message: 'Customer type updated successfully' });
    } else {
      // Add new customer type
      const newCustomerType: CustomerType = {
        ...customerType,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCustomerTypes(prev => [...prev, newCustomerType]);
      setAlert({ type: 'success', message: 'Customer type added successfully' });
    }
    setIsFormOpen(false);
    setSelectedCustomerType(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedCustomerType(null);
  };

  return (
    <AdminLayout title="Customer Types">
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Customer Types
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Customer Type
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
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Discount %</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerTypes.map((customerType) => (
                <TableRow key={customerType.id}>
                  <TableCell>{customerType.name}</TableCell>
                  <TableCell>{customerType.description}</TableCell>
                  <TableCell>{customerType.discountPercentage}%</TableCell>
                  <TableCell>
                    <Chip
                      label={customerType.isActive ? 'Active' : 'Inactive'}
                      color={customerType.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {customerType.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 120 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(customerType)}
                        title="View"
                        sx={{ color: 'primary.main' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(customerType)}
                        title="Edit"
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(customerType)}
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
            {isViewMode ? 'View Customer Type' : selectedCustomerType ? 'Edit Customer Type' : 'Add Customer Type'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, overflow: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
            <CustomerTypeForm
              customerType={selectedCustomerType}
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
              Are you sure you want to delete "{customerTypeToDelete?.name}"? This action cannot be undone.
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

export default CustomerTypesPage; 