'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
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
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Select,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Category as CategoryIcon,
  SubdirectoryArrowRight as SubdirectoryIcon,
  Image as ImageIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { ProductCategory, CreateProductCategoryRequest, UpdateProductCategoryRequest } from '@/data/adminTypes';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Form state
  const [formData, setFormData] = useState<CreateProductCategoryRequest>({
    name: '',
    description: '',
    slug: '',
    parentId: '',
    imageUrl: '',
    sortOrder: 0,
  });
  const [isActive, setIsActive] = useState(true);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load categories',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory 
        ? { ...formData, isActive }
        : { ...formData, isActive };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: editingCategory 
            ? 'Category updated successfully' 
            : 'Category created successfully',
          severity: 'success',
        });
        handleCloseDialog();
        loadCategories();
      } else {
        throw new Error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save category',
        severity: 'error',
      });
    }
  };

  // Handle delete
  const handleDelete = async (category: ProductCategory) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This will also delete all subcategories.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Category deleted successfully',
          severity: 'success',
        });
        loadCategories();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete category',
        severity: 'error',
      });
    }
  };

  // Handle edit
  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      parentId: category.parentId || '',
      imageUrl: category.imageUrl || '',
      sortOrder: category.sortOrder,
    });
    setIsActive(category.isActive);
    setDialogOpen(true);
  };

  // Handle new category
  const handleNewCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      slug: '',
      parentId: '',
      imageUrl: '',
      sortOrder: 0,
    });
    setIsActive(true);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      slug: '',
      parentId: '',
      imageUrl: '',
      sortOrder: 0,
    });
    setIsActive(true);
  };

  // Handle menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: ProductCategory) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle name change and auto-generate slug
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  // Get parent categories (excluding current category when editing)
  const getParentOptions = () => {
    return categories.filter(cat => 
      !editingCategory || cat.id !== editingCategory.id
    );
  };

  // Demo data for testing
  const demoCategories: ProductCategory[] = [
    {
      id: '1',
      name: 'Truck Seats',
      description: 'High-quality seats for trucks and commercial vehicles',
      slug: 'truck-seats',
      isActive: true,
      sortOrder: 1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      children: [
        {
          id: '2',
          name: 'Heavy Duty',
          description: 'Heavy duty truck seats for long-haul operations',
          slug: 'heavy-duty',
          parentId: '1',
          isActive: true,
          sortOrder: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '3',
          name: 'Medium Duty',
          description: 'Medium duty truck seats for local deliveries',
          slug: 'medium-duty',
          parentId: '1',
          isActive: true,
          sortOrder: 2,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ],
    },
    {
      id: '4',
      name: 'Accessories',
      description: 'Seat accessories and replacement parts',
      slug: 'accessories',
      isActive: true,
      sortOrder: 2,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '5',
      name: 'Custom Seats',
      description: 'Custom designed seats for special applications',
      slug: 'custom-seats',
      isActive: true,
      sortOrder: 3,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ];

  // Use demo data if no API data
  const displayCategories = categories.length > 0 ? categories : demoCategories;

  // Flatten categories for table display
  const flattenedCategories = displayCategories.reduce((acc: ProductCategory[], category) => {
    acc.push(category);
    if (category.children) {
      category.children.forEach(child => {
        acc.push({ ...child, name: `  ${child.name}` }); // Indent child names
      });
    }
    return acc;
  }, []);

  return (
    <AdminLayout title="Product Categories">
      <Box>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center', 
          mb: 3,
          gap: isMobile ? 2 : 0
        }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Product Categories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize your products with categories and subcategories
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewCategory}
            sx={{ 
              minWidth: isMobile ? '100%' : 140,
              alignSelf: isMobile ? 'stretch' : 'flex-start'
            }}
          >
            Add Category
          </Button>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: isMobile ? 2 : 3, 
          mb: 4 
        }}>
          <Card>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'primary.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {displayCategories.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Categories
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SubdirectoryIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'success.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {flattenedCategories.filter(c => c.parentId).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subcategories
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VisibilityIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'warning.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {flattenedCategories.filter(c => c.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Categories
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SortIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'info.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {Math.max(...flattenedCategories.map(c => c.sortOrder))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Sort Order
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Categories Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : isMobile ? (
              // Mobile view - Card layout
              <Box sx={{ p: 2 }}>
                {flattenedCategories.map((category) => (
                  <Card key={category.id} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        {category.parentId && (
                          <SubdirectoryIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        )}
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: category.parentId ? 'text.secondary' : 'text.primary'
                        }}>
                          {category.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, category)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {category.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      <Chip
                        label={category.slug}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`Sort: ${category.sortOrder}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={category.isActive ? 'Active' : 'Inactive'}
                        color={category.isActive ? 'success' : 'default'}
                        size="small"
                        icon={category.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Parent: {category.parentId 
                        ? displayCategories.find(c => c.id === category.parentId)?.name || 'Unknown'
                        : 'Root category'
                      }
                    </Typography>
                  </Card>
                ))}
              </Box>
            ) : (
              // Desktop view - Table layout
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Sort Order</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flattenedCategories.map((category) => (
                      <TableRow key={category.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {category.parentId && (
                              <SubdirectoryIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            )}
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                color: category.parentId ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {category.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {category.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.slug}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {category.parentId ? (
                            <Typography variant="body2" color="text.secondary">
                              {displayCategories.find(c => c.id === category.parentId)?.name || 'Unknown'}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Root
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.sortOrder}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.isActive ? 'Active' : 'Inactive'}
                            color={category.isActive ? 'success' : 'default'}
                            size="small"
                            icon={category.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, category)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 120 },
          }}
        >
          <MenuItem onClick={() => {
            if (selectedCategory) handleEdit(selectedCategory);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedCategory) handleDelete(selectedCategory);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 2,
              minHeight: isMobile ? '100vh' : 'auto',
            },
          }}
        >
          <DialogTitle sx={{ 
            pb: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontWeight: 600,
          }}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ pt: isMobile ? 0 : 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 2 }}>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    margin="normal"
                    required
                    sx={{ mb: isMobile ? 1 : 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    margin="normal"
                    required
                    helperText={isMobile ? undefined : "URL-friendly version of the name"}
                    sx={{ mb: isMobile ? 1 : 2 }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={isMobile ? 2 : 3}
                  sx={{ mb: isMobile ? 1 : 2 }}
                />
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 2 }}>
                  <FormControl fullWidth margin="normal" sx={{ mb: isMobile ? 1 : 2 }}>
                    <InputLabel>Parent Category</InputLabel>
                    <Select
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      label="Parent Category"
                    >
                      <MenuItem value="">
                        <em>No parent (Root category)</em>
                      </MenuItem>
                      {getParentOptions().map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Sort Order"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    margin="normal"
                    inputProps={{ min: 0 }}
                    helperText={isMobile ? undefined : "Lower numbers appear first"}
                    sx={{ mb: isMobile ? 1 : 2 }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  margin="normal"
                  placeholder="https://example.com/image.jpg"
                  InputProps={{
                    startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ mb: isMobile ? 1 : 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                  }
                  label="Active"
                  sx={{ mt: 1 }}
                />
              </Box>
              {isMobile && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Tips:</strong> The slug is automatically generated from the name. Lower sort order numbers appear first in listings.
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            p: isMobile ? 2 : 3,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}>
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              fullWidth={isMobile}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.name.trim() || !formData.slug.trim()}
              fullWidth={isMobile}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default CategoriesPage; 