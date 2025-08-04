'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
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
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Truck Seat - Standard',
    description: 'Standard truck seat with basic features and comfort',
    category: 'Seats',
    price: 299.99,
    stock: 15,
    isActive: true,
    image: '/Truckimages/01.jpg',
    specifications: {
      material: 'Leather',
      color: 'Black',
      weight: '25 lbs',
      dimensions: '24" x 20" x 8"'
    }
  },
  {
    id: '2',
    name: 'Truck Seat - Premium',
    description: 'Premium truck seat with advanced features and luxury comfort',
    category: 'Seats',
    price: 499.99,
    stock: 8,
    isActive: true,
    image: '/Truckimages/Bluetruck.jpg',
    specifications: {
      material: 'Premium Leather',
      color: 'Brown',
      weight: '28 lbs',
      dimensions: '24" x 20" x 8"'
    }
  },
  {
    id: '3',
    name: 'Seat Cover - Leather',
    description: 'High-quality leather seat cover for protection and style',
    category: 'Accessories',
    price: 89.99,
    stock: 25,
    isActive: true,
    image: '/Truckimages/blackTruck.jpg',
    specifications: {
      material: 'Genuine Leather',
      color: 'Black',
      weight: '2 lbs',
      dimensions: 'Universal Fit'
    }
  },
  {
    id: '4',
    name: 'Seat Cushion - Memory Foam',
    description: 'Memory foam seat cushion for enhanced comfort',
    category: 'Accessories',
    price: 45.99,
    stock: 30,
    isActive: true,
    image: '/Truckimages/white truck.jpg',
    specifications: {
      material: 'Memory Foam',
      color: 'Gray',
      weight: '1.5 lbs',
      dimensions: '18" x 16" x 2"'
    }
  },
  {
    id: '5',
    name: 'Truck Seat - Racing',
    description: 'Racing-style truck seat with sporty design',
    category: 'Seats',
    price: 399.99,
    stock: 12,
    isActive: true,
    image: '/Truckimages/whitePurpletruck.jpg',
    specifications: {
      material: 'Alcantara',
      color: 'Red/Black',
      weight: '26 lbs',
      dimensions: '24" x 20" x 8"'
    }
  },
  {
    id: '6',
    name: 'Seat Belt - Safety Plus',
    description: 'Enhanced safety seat belt with comfort padding',
    category: 'Safety',
    price: 75.99,
    stock: 20,
    isActive: true,
    image: '/Truckimages/Seatset.jpg',
    specifications: {
      material: 'Nylon Webbing',
      color: 'Black',
      weight: '1 lb',
      dimensions: 'Universal'
    }
  },
  {
    id: '7',
    name: 'Truck Seat - Ergonomic',
    description: 'Ergonomic truck seat designed for long-haul comfort',
    category: 'Seats',
    price: 599.99,
    stock: 6,
    isActive: true,
    image: '/Truckimages/seatimages.jpg',
    specifications: {
      material: 'Mesh Fabric',
      color: 'Blue',
      weight: '30 lbs',
      dimensions: '24" x 20" x 8"'
    }
  },
  {
    id: '8',
    name: 'Seat Organizer',
    description: 'Multi-compartment seat organizer for storage',
    category: 'Accessories',
    price: 29.99,
    stock: 40,
    isActive: true,
    image: '/Truckimages/bluetruckengine.jpg',
    specifications: {
      material: 'Canvas',
      color: 'Gray',
      weight: '0.5 lbs',
      dimensions: '12" x 8" x 4"'
    }
  },
];

const categories = ['Seats', 'Accessories', 'Safety', 'Maintenance'];

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAdd = () => {
    router.push('/admin/products/create');
  };

  const handleEdit = (product: any) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleView = (product: any) => {
    // For now, we'll use edit page in view mode
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleDelete = (product: any) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setAlert({ type: 'success', message: 'Product deleted successfully' });
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };



  return (
    <AdminLayout title="Products">
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
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Add Product
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

        {/* Products Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {products.map((product) => (
            <Box key={product.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      ${product.price}
                    </Typography>
                    <Chip
                      label={product.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stock}
                    </Typography>
                    <Chip
                      label={product.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={product.isActive ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleView(product)}
                    title="View"
                    sx={{ color: 'primary.main' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(product)}
                    title="Edit"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(product)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>



        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{productToDelete?.name}&quot;? This action cannot be undone.
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

export default ProductsPage; 