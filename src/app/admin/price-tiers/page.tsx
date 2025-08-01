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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { PriceTier, CreatePriceTierRequest, UpdatePriceTierRequest } from '@/data/adminTypes';

const PriceTiersPage = () => {
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PriceTier | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Form state
  const [formData, setFormData] = useState<CreatePriceTierRequest>({
    name: '',
    description: '',
    discountPercentage: 0,
    minimumOrderAmount: 0,
  });
  const [isActive, setIsActive] = useState(true);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load price tiers
  const loadPriceTiers = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/admin/price-tiers');
      const data = await response.json();
      
      if (response.ok) {
        setPriceTiers(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to load price tiers');
      }
    } catch (error) {
      console.error('Error loading price tiers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load price tiers',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriceTiers();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const url = editingTier 
        ? `/api/admin/price-tiers/${editingTier.id}`
        : '/api/admin/price-tiers';
      
      const method = editingTier ? 'PUT' : 'POST';
      const body = editingTier 
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
          message: editingTier 
            ? 'Price tier updated successfully' 
            : 'Price tier created successfully',
          severity: 'success',
        });
        handleCloseDialog();
        loadPriceTiers();
      } else {
        throw new Error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving price tier:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save price tier',
        severity: 'error',
      });
    }
  };

  // Handle delete
  const handleDelete = async (tier: PriceTier) => {
    if (!confirm(`Are you sure you want to delete "${tier.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/price-tiers/${tier.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Price tier deleted successfully',
          severity: 'success',
        });
        loadPriceTiers();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete price tier');
      }
    } catch (error) {
      console.error('Error deleting price tier:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete price tier',
        severity: 'error',
      });
    }
  };

  // Handle edit
  const handleEdit = (tier: PriceTier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      description: tier.description,
      discountPercentage: tier.discountPercentage,
      minimumOrderAmount: tier.minimumOrderAmount || 0,
    });
    setIsActive(tier.isActive);
    setDialogOpen(true);
  };

  // Handle new tier
  const handleNewTier = () => {
    setEditingTier(null);
    setFormData({
      name: '',
      description: '',
      discountPercentage: 0,
      minimumOrderAmount: 0,
    });
    setIsActive(true);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTier(null);
    setFormData({
      name: '',
      description: '',
      discountPercentage: 0,
      minimumOrderAmount: 0,
    });
    setIsActive(true);
  };

  // Handle menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tier: PriceTier) => {
    setAnchorEl(event.currentTarget);
    setSelectedTier(tier);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTier(null);
  };

  // Demo data for testing
  const demoPriceTiers: PriceTier[] = [
    {
      id: '1',
      name: 'Wholesale',
      description: 'Wholesale pricing for bulk orders',
      discountPercentage: 25,
      minimumOrderAmount: 1000,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Retail',
      description: 'Standard retail pricing',
      discountPercentage: 0,
      minimumOrderAmount: 0,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '3',
      name: 'VIP Customer',
      description: 'Special pricing for VIP customers',
      discountPercentage: 15,
      minimumOrderAmount: 500,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ];

  // Use demo data if no API data
  const displayTiers = priceTiers.length > 0 ? priceTiers : demoPriceTiers;

  return (
    <AdminLayout title="Price Tiers">
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
              Price Tiers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage wholesale, retail, and custom pricing tiers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewTier}
            sx={{ 
              minWidth: isMobile ? '100%' : 140,
              alignSelf: isMobile ? 'stretch' : 'flex-start'
            }}
          >
            Add Tier
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
                <MoneyIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'primary.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {displayTiers.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tiers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PercentIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'success.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {displayTiers.filter(t => t.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Tiers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CartIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'warning.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {displayTiers.filter(t => t.minimumOrderAmount && t.minimumOrderAmount > 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    With Min. Order
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PercentIcon sx={{ 
                  fontSize: isMobile ? 32 : 40, 
                  color: 'info.main', 
                  mr: isMobile ? 1 : 2 
                }} />
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                    {Math.max(...displayTiers.map(t => t.discountPercentage))}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Discount
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Price Tiers Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : isMobile ? (
              // Mobile view - Card layout
              <Box sx={{ p: 2 }}>
                {displayTiers.map((tier) => (
                  <Card key={tier.id} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {tier.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, tier)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tier.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      <Chip
                        label={`${tier.discountPercentage}% discount`}
                        color={tier.discountPercentage > 0 ? 'success' : 'default'}
                        size="small"
                        variant={tier.discountPercentage > 0 ? 'filled' : 'outlined'}
                      />
                      <Chip
                        label={tier.isActive ? 'Active' : 'Inactive'}
                        color={tier.isActive ? 'success' : 'default'}
                        size="small"
                        icon={tier.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Min. Order: {tier.minimumOrderAmount && tier.minimumOrderAmount > 0 
                        ? `$${tier.minimumOrderAmount.toLocaleString()}` 
                        : 'No minimum'}
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
                      <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Min. Order</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayTiers.map((tier) => (
                      <TableRow key={tier.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {tier.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {tier.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${tier.discountPercentage}%`}
                            color={tier.discountPercentage > 0 ? 'success' : 'default'}
                            size="small"
                            variant={tier.discountPercentage > 0 ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell>
                          {tier.minimumOrderAmount && tier.minimumOrderAmount > 0 ? (
                            <Typography variant="body2">
                              ${tier.minimumOrderAmount.toLocaleString()}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No minimum
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tier.isActive ? 'Active' : 'Inactive'}
                            color={tier.isActive ? 'success' : 'default'}
                            size="small"
                            icon={tier.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, tier)}
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
            if (selectedTier) handleEdit(selectedTier);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedTier) handleDelete(selectedTier);
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
          maxWidth="sm"
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
            {editingTier ? 'Edit Price Tier' : 'Add New Price Tier'}
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ pt: isMobile ? 0 : 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={isMobile ? 2 : 3}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Discount Percentage"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                  margin="normal"
                  inputProps={{ min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: '%',
                  }}
                />
                <TextField
                  fullWidth
                  label="Minimum Order Amount"
                  type="number"
                  value={formData.minimumOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })}
                  margin="normal"
                  inputProps={{ min: 0 }}
                  InputProps={{
                    startAdornment: '$',
                  }}
                  helperText={isMobile ? undefined : "Leave as 0 for no minimum"}
                />
              </Box>
              {isMobile && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Leave minimum order as 0 for no minimum requirement
                </Typography>
              )}
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
              disabled={!formData.name.trim()}
              fullWidth={isMobile}
            >
              {editingTier ? 'Update' : 'Create'}
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

export default PriceTiersPage; 