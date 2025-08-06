'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';

interface Variation {
  id: number;
  name: string;
  category: string;
  armType: string;
  lumbar: string;
  reclineType: string;
  seatType: string;
  materialType: string;
  heatOption: string;
  seatItemType: string;
  color: string;
  isActive: boolean;
  createdAt: string;
}

// Mock data - replace with actual API calls
const mockVariations: Variation[] = [
  {
    id: 1,
    name: 'Premium Truck Seat',
    category: 'Truck Seats',
    armType: 'Fixed',
    lumbar: 'Adjustable',
    reclineType: 'Manual',
    seatType: 'Bucket',
    materialType: 'Leather',
    heatOption: 'Yes',
    seatItemType: 'Driver',
    color: 'Black',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Standard Car Seat',
    category: 'Car Seats',
    armType: 'Removable',
    lumbar: 'Fixed',
    reclineType: 'Power',
    seatType: 'Bench',
    materialType: 'Fabric',
    heatOption: 'No',
    seatItemType: 'Passenger',
    color: 'Gray',
    isActive: true,
    createdAt: '2024-01-10',
  },
];

const VariationsPage = () => {
  const router = useRouter();
  const [variations, setVariations] = useState<Variation[]>(mockVariations);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<Variation | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddVariation = () => {
    router.push('/admin/variations/create');
  };

  const handleEditVariation = (variation: Variation) => {
    router.push(`/admin/variations/${variation.id}/edit`);
  };

  const handleViewVariation = (variation: Variation) => {
    router.push(`/admin/variations/${variation.id}`);
  };

  const handleDeleteVariation = (variation: Variation) => {
    setVariationToDelete(variation);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (variationToDelete) {
      setVariations(variations.filter(v => v.id !== variationToDelete.id));
      setIsDeleteDialogOpen(false);
      setVariationToDelete(null);
    }
  };

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Seat Type</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variations.map((variation) => (
            <TableRow key={variation.id}>
              <TableCell>{variation.name}</TableCell>
              <TableCell>{variation.category}</TableCell>
              <TableCell>{variation.seatType}</TableCell>
              <TableCell>{variation.materialType}</TableCell>
              <TableCell>{variation.color}</TableCell>
              <TableCell>
                <Chip
                  label={variation.isActive ? 'Active' : 'Inactive'}
                  color={variation.isActive ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={() => handleViewVariation(variation)}
                  color="primary"
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEditVariation(variation)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteVariation(variation)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {variations.map((variation) => (
        <Card key={variation.id}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {variation.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Category: {variation.category}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Seat Type: {variation.seatType}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Material: {variation.materialType}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Color: {variation.color}
            </Typography>
            <Chip
              label={variation.isActive ? 'Active' : 'Inactive'}
              color={variation.isActive ? 'success' : 'default'}
              size="small"
              sx={{ mt: 1 }}
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={() => handleViewVariation(variation)}
            >
              View
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => handleEditVariation(variation)}
            >
              Edit
            </Button>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => handleDeleteVariation(variation)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  return (
    <AdminLayout title="Variations">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Variations
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddVariation}
            sx={{
              backgroundColor: '#DA291C',
              '&:hover': {
                backgroundColor: '#B71C1C',
              },
            }}
          >
            Add Variation
          </Button>
        </Box>

        {/* Content */}
        {variations.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No variations found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click &quot;Add Variation&quot; to create your first variation.
            </Typography>
          </Paper>
        ) : (
          <Box>
            {isMobile ? renderMobileView() : renderDesktopView()}
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{variationToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default VariationsPage; 