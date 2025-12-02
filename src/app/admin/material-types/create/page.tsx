'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { materialTypesService } from '@/services/material-types';
import { apiService } from '@/utils/api';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

interface Color {
  id: number;
  name: string;
  hex_code: string;
  description?: string;
}

interface MaterialType {
  id: number;
  name: string;
  shader_id?: string;
  description?: string;
  image?: string;
  is_active: boolean;
}

interface PriceTier {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  discount_off_retail_price: string;
  minimum_order_amount?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helper functions for color validation and contrast
const isValidHexColor = (hex: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
};

const getContrastColor = (hexColor: string): string => {
  if (!isValidHexColor(hexColor)) {
    return '#000000';
  }
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const colorSteps = [
  'Basic Information',
  'Pricing & Price Tiers'
];

const CreateMaterialTypePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [loadingColors, setLoadingColors] = useState(true);
  const [colorsError, setColorsError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Colors pagination and search
  const [colorsPage, setColorsPage] = useState(0);
  const [colorsRowsPerPage, setColorsRowsPerPage] = useState(5);
  const [colorsTotalCount, setColorsTotalCount] = useState(0);
  const [colorsSearchTerm, setColorsSearchTerm] = useState('');
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSearchResettingPage = useRef(false);
  const isMounted = useRef(false);
  
  // Delete color dialog state
  const [isDeleteColorDialogOpen, setIsDeleteColorDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [deletingColor, setDeletingColor] = useState(false);

  // Color stepper dialog state
  const [isColorStepperOpen, setIsColorStepperOpen] = useState(false);
  const [activeColorStep, setActiveColorStep] = useState(0);
  const [isEditColorMode, setIsEditColorMode] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [materialTypesForColor, setMaterialTypesForColor] = useState<MaterialType[]>([]);
  const [selectedMaterialTypeForColor, setSelectedMaterialTypeForColor] = useState<number>(0);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [colorLoading, setColorLoading] = useState(false);
  const [colorError, setColorError] = useState<string | null>(null);
  const [colorSuccess, setColorSuccess] = useState<string | null>(null);
  const [colorImageFile, setColorImageFile] = useState<File | null>(null);
  const [colorImagePreview, setColorImagePreview] = useState<string>('');
  const [isColorDragging, setIsColorDragging] = useState(false);
  const [enablePriceTiers, setEnablePriceTiers] = useState(false);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);
  const [colorPriceInput, setColorPriceInput] = useState<string>('');
  const [overridePriceInputs, setOverridePriceInputs] = useState<Record<number, string>>({});
  const [colorFormData, setColorFormData] = useState({
    name: '',
    hex_code: '',
    description: '',
    image: '',
    price: 0,
    is_active: true,
  });
  
  const [formData, setFormData] = useState({
    name: '',
    image: null as File | null,
    cost: 0,
    price: 0,
    color_ids: [] as number[],
    vendor_name: '',
    vendor_email: '',
    vendor_website: ''
  });
  

  // Load colors with pagination
  const loadColors = useCallback(async () => {
    try {
      setLoadingColors(true);
      setColorsError(null);
      
      const params: Record<string, any> = {
        page: colorsPage + 1,
        per_page: colorsRowsPerPage
      };
      if (colorsSearchTerm.trim()) {
        params.search = colorsSearchTerm.trim();
      }
      
      const response = await apiService.getColors(params);
      
      if (response && response.data && Array.isArray(response.data)) {
        setColors(response.data);
        const total = response.meta?.total || 
                     response.meta?.pagination?.total || 
                     response.data.length;
        setColorsTotalCount(total);
      } else if (Array.isArray(response)) {
        setColors(response);
        setColorsTotalCount(response.length);
      } else {
        setColors([]);
        setColorsTotalCount(0);
      }
    } catch (err: any) {
      setColors([]);
      setColorsTotalCount(0);
      
      // Handle network errors more gracefully
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setColorsError('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else if (err.response?.status === 401) {
        setColorsError('Please log in to access colors');
      } else if (err.response?.status === 404) {
        setColorsError('Colors endpoint not found. Please contact support.');
      } else {
        setColorsError(err.response?.data?.message || err.message || 'Failed to load colors');
      }
      
      console.error('Error loading colors:', err);
    } finally {
      setLoadingColors(false);
    }
  }, [colorsPage, colorsRowsPerPage, colorsSearchTerm]);

  // Debounced search for colors
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      loadColors();
      return;
    }
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    
    isSearchResettingPage.current = true;
    setColorsPage(0);
    
    searchDebounceRef.current = setTimeout(async () => {
      try {
        setLoadingColors(true);
        setColorsError(null);
        
        const params: Record<string, any> = {
          page: 1,
          per_page: colorsRowsPerPage
        };
        
        if (colorsSearchTerm.trim()) {
          params.search = colorsSearchTerm.trim();
        }
        
        const response = await apiService.getColors(params);
        
        if (response && response.data && Array.isArray(response.data)) {
          setColors(response.data);
          const total = response.meta?.total || 
                       response.meta?.pagination?.total || 
                       response.data.length;
          setColorsTotalCount(total);
        } else if (Array.isArray(response)) {
          setColors(response);
          setColorsTotalCount(response.length);
        } else {
          setColors([]);
          setColorsTotalCount(0);
        }
      } catch (err: any) {
        setColors([]);
        setColorsTotalCount(0);
        setColorsError(err.message || 'Failed to load colors');
      } finally {
        setLoadingColors(false);
        searchDebounceRef.current = null;
        isSearchResettingPage.current = false;
      }
    }, 300);
    
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, [colorsSearchTerm, colorsRowsPerPage]);

  // Load colors when pagination changes
  useEffect(() => {
    if (isSearchResettingPage.current) {
      isSearchResettingPage.current = false;
      return;
    }
    
    if (searchDebounceRef.current) {
      return;
    }
    
    loadColors();
  }, [colorsPage, loadColors]);

  // Refresh colors when page becomes visible (user returns from colors create/edit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadColors();
      }
    };

    const handleFocus = () => {
      loadColors();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadColors]);

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
    console.log('Image field type:', typeof formData.image);
    console.log('Image field value:', formData.image);
    if (formData.image) {
      console.log('Image is File:', formData.image instanceof File);
      console.log('Image constructor:', formData.image.constructor?.name);
    }
  }, [formData]);

  // Removed loadPriceTiers function as we're using simplified pricing

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      return newFormData;
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    console.log('Image file selected:', file);
    console.log('File type:', typeof file);
    console.log('File instanceof File:', file instanceof File);
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    
    setFormData(prev => ({ ...prev, image: file }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            // Convert blob to File
            const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
            processImageFile(file);
          }
          e.preventDefault();
          break;
        }
      }
    };

    // Add paste event listener when component mounts
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.image) {
      setError('Image is required');
      return;
    }

    // Additional validation to ensure image is a File object
    if (!(formData.image instanceof File)) {
      console.error('Image is not a File object:', formData.image);
      setError('Invalid image file. Please select a valid image.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create the data object that matches the backend schema
      const submissionData = {
        name: formData.name.trim(),
        image: formData.image,
        cost: formData.cost,
        price: formData.price,
        price_tier_ids: [],
        color_ids: formData.color_ids,
        vendor_name: formData.vendor_name.trim() || undefined,
        vendor_email: formData.vendor_email.trim() || undefined,
        vendor_website: formData.vendor_website.trim() || undefined
      };

      // Additional debugging for submission data
      console.log('=== SUBMISSION DEBUG ===');
      console.log('FormData.image type:', typeof formData.image);
      console.log('FormData.image value:', formData.image);
      console.log('FormData.image instanceof File:', formData.image instanceof File);
      console.log('SubmissionData.image type:', typeof submissionData.image);
      console.log('SubmissionData.image value:', submissionData.image);
      console.log('=== END SUBMISSION DEBUG ===');

      // Debug logging
      console.log('Form Data:', formData);
      console.log('Image File:', formData.image);
      console.log('Image File Name:', formData.image?.name);
      console.log('Image File Size:', formData.image?.size);
      console.log('Image File Type:', formData.image?.type);
      console.log('Image instanceof File:', formData.image instanceof File);
      console.log('Image constructor:', formData.image?.constructor?.name);
      console.log('Submission Data:', submissionData);

      // Create FormData manually to debug
      const debugFormData = new FormData();
      debugFormData.append('name', submissionData.name);
      if (submissionData.image) debugFormData.append('image', submissionData.image);
      debugFormData.append('cost', submissionData.cost.toString());
      debugFormData.append('price', submissionData.price.toString());

      // Log FormData contents
      console.log('Debug FormData entries:');
      for (let [key, value] of debugFormData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await materialTypesService.createMaterialType(submissionData);
      setSuccess('Material Type created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/material-types');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create material type');
      console.error('Error creating material type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/material-types');
  };

  // Color CRUD handlers
  // Load material types and price tiers for color form
  const loadMaterialTypesForColor = useCallback(async () => {
    try {
      const response = await apiService.getMaterialTypes({ is_active: true });
      setMaterialTypesForColor(response?.data || response || []);
    } catch (err: any) {
      console.error('Error loading material types:', err);
      setMaterialTypesForColor([]);
    }
  }, []);

  const loadPriceTiersForColor = useCallback(async () => {
    try {
      const response = await apiService.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err: any) {
      console.error('Error loading price tiers:', err);
      setPriceTiers([]);
    }
  }, []);

  // Load price tiers when stepper opens
  useEffect(() => {
    if (isColorStepperOpen) {
      loadPriceTiersForColor();
    }
  }, [isColorStepperOpen, loadPriceTiersForColor]);

  // Automatic price tier calculation
  useEffect(() => {
    if (enablePriceTiers && colorFormData.price > 0 && priceTiers.length > 0) {
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(
        colorFormData.price,
        priceTiers,
        priceOverrides
      );
      setCalculatedPriceTiers(newCalculatedTiers);

      // Initialize overridePriceInputs for all tiers
      const initialInputs: Record<number, string> = {};
      newCalculatedTiers.forEach(tier => {
        if (tier.is_overridden && tier.override_price !== undefined) {
          initialInputs[tier.id] = tier.override_price.toFixed(2);
        }
      });
      setOverridePriceInputs(prev => ({ ...prev, ...initialInputs }));
    }
  }, [colorFormData.price, enablePriceTiers, priceTiers, priceOverrides]);

  const handleColorAdd = () => {
    setColorFormData({ 
      name: '', 
      hex_code: '', 
      description: '',
      image: '',
      price: 0,
      is_active: true
    });
    setColorImageFile(null);
    setColorImagePreview('');
    setSelectedMaterialTypeForColor(0);
    setColorPriceInput('');
    setEnablePriceTiers(false);
    setPriceOverrides({});
    setCalculatedPriceTiers([]);
    setOverridePriceInputs({});
    setColorError(null);
    setColorSuccess(null);
    setActiveColorStep(0);
    setIsEditColorMode(false);
    setEditingColor(null);
    setIsColorStepperOpen(true);
  };

  const handleColorEdit = async (color: Color) => {
    try {
      setColorLoading(true);
      setColorError(null);
      // Load full color data for editing
      const fullColorData = await apiService.getColor(color.id);
      
      setColorFormData({
        name: fullColorData.name || '',
        hex_code: fullColorData.hex_code || '',
        description: fullColorData.description || '',
        image: fullColorData.image || '',
        price: fullColorData.price || 0,
        is_active: fullColorData.is_active !== undefined ? fullColorData.is_active : true
      });
      
      setColorPriceInput(fullColorData.price ? fullColorData.price.toString() : '');
      
      // Set image preview if image exists
      if (fullColorData.image) {
        setColorImagePreview(`${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}/${fullColorData.image}`);
      }
      
      // Handle price tiers using multiplier logic
      if (fullColorData.price_tiers && fullColorData.price_tiers.length > 0) {
        setEnablePriceTiers(true);
        const priceValue = typeof fullColorData.price === 'string' ? parseFloat(fullColorData.price) : (fullColorData.price || 0);
        const overriddenPrices: Record<string, number> = {};
        const initialInputs: Record<number, string> = {};
        
        fullColorData.price_tiers.forEach((tier: any) => {
          if (tier.pivot && tier.pivot.price_adjustment !== undefined) {
            const adjustmentValue = parseFloat(tier.pivot.price_adjustment);
            const multiplier = parseFloat(tier.discount_off_retail_price) || 1;
            const calculatedPrice = Math.round(priceValue * multiplier * 100) / 100;
            
            if (Math.abs(adjustmentValue - calculatedPrice) > 0.01) {
              overriddenPrices[tier.id.toString()] = adjustmentValue;
              initialInputs[tier.id] = adjustmentValue.toFixed(2);
            }
          }
        });
        
        setPriceOverrides(overriddenPrices);
        setOverridePriceInputs(initialInputs);
        const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(
          priceValue,
          fullColorData.price_tiers,
          overriddenPrices
        );
        setCalculatedPriceTiers(newCalculatedTiers);
      }
      
      setEditingColor(color);
      setIsEditColorMode(true);
      setActiveColorStep(0);
      setIsColorStepperOpen(true);
    } catch (err: any) {
      setColorError(err.message || 'Failed to load color data');
      console.error('Error loading color:', err);
    } finally {
      setColorLoading(false);
    }
  };

  const handleColorDelete = (color: Color) => {
    setColorToDelete(color);
    setIsDeleteColorDialogOpen(true);
  };


  const handleConfirmDeleteColor = async () => {
    if (colorToDelete) {
      try {
        setDeletingColor(true);
        await apiService.deleteColor(colorToDelete.id);
        setSuccess('Color deleted successfully!');
        
        // Remove from selected colors if it was selected
        setFormData(prev => ({
          ...prev,
          color_ids: prev.color_ids.filter(id => id !== colorToDelete.id)
        }));
        
        loadColors();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to delete color');
        console.error('Error deleting color:', err);
      } finally {
        setDeletingColor(false);
      }
    }
    setIsDeleteColorDialogOpen(false);
    setColorToDelete(null);
  };

  // Color form handlers
  const handleColorInputChange = (field: string, value: any) => {
    setColorFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'price') {
      setColorPriceInput(value > 0 ? value.toString() : '');
    }
  };

  const handleColorEnablePriceTiersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setEnablePriceTiers(checked);
    
    if (!checked) {
      setPriceOverrides({});
      setCalculatedPriceTiers([]);
      setOverridePriceInputs({});
    }
  };

  const handleColorPriceOverrideChange = (tierId: number, overridePrice: number) => {
    setPriceOverrides(prev => ({
      ...prev,
      [tierId.toString()]: overridePrice
    }));
  };

  const handleColorPriceOverrideInputChange = (tierId: number, value: string) => {
    setOverridePriceInputs(prev => ({
      ...prev,
      [tierId]: value
    }));
  };

  const handleColorPriceOverrideBlur = (tierId: number) => {
    const inputValue = overridePriceInputs[tierId];
    if (inputValue === undefined || inputValue === '') {
      // Clear override if input is empty
      setPriceOverrides(prev => {
        const newOverrides = { ...prev };
        delete newOverrides[tierId.toString()];
        return newOverrides;
      });
      setOverridePriceInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[tierId];
        return newInputs;
      });
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue) && numValue >= 0) {
        const roundedValue = Math.round(numValue * 100) / 100;
        handleColorPriceOverrideChange(tierId, roundedValue);
        setOverridePriceInputs(prev => ({
          ...prev,
          [tierId]: roundedValue.toFixed(2)
        }));
      } else {
        // Reset to calculated price if invalid
        const tier = calculatedPriceTiers.find(t => t.id === tierId);
        if (tier) {
          setOverridePriceInputs(prev => {
            const newInputs = { ...prev };
            delete newInputs[tierId];
            return newInputs;
          });
          setPriceOverrides(prev => {
            const newOverrides = { ...prev };
            delete newOverrides[tierId.toString()];
            return newOverrides;
          });
        }
      }
    }
  };

  const processColorImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setColorError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setColorError('Image size must be less than 5MB');
      return;
    }

    setColorImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setColorImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleColorImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processColorImageFile(file);
    }
  };

  const handleColorDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsColorDragging(true);
  };

  const handleColorDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsColorDragging(false);
  };

  const handleColorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleColorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsColorDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processColorImageFile(files[0]);
    }
  };

  const handleColorRemoveImage = () => {
    setColorImageFile(null);
    setColorImagePreview('');
    setColorFormData(prev => ({ ...prev, image: '' }));
  };

  const handleColorResetPriceTiers = () => {
    setPriceOverrides({});
    setOverridePriceInputs({});
  };

  const handleColorStepperClose = () => {
    setIsColorStepperOpen(false);
    setActiveColorStep(0);
    setEditingColor(null);
    setIsEditColorMode(false);
    setColorFormData({ 
      name: '', 
      hex_code: '', 
      description: '',
      image: '',
      price: 0,
      is_active: true
    });
    setColorImageFile(null);
    setColorImagePreview('');
    setSelectedMaterialTypeForColor(0);
    setColorPriceInput('');
    setEnablePriceTiers(false);
    setPriceOverrides({});
    setCalculatedPriceTiers([]);
    setOverridePriceInputs({});
    setColorError(null);
    setColorSuccess(null);
  };

  const handleColorStepperNext = () => {
    // Validation for each step
    if (activeColorStep === 0) {
      if (!colorFormData.name.trim()) {
        setColorError('Color name is required');
        return;
      }
      if (!colorFormData.hex_code.trim()) {
        setColorError('Hex code is required');
        return;
      }
      let hexCode = colorFormData.hex_code.trim();
      if (!hexCode.startsWith('#')) {
        hexCode = '#' + hexCode;
      }
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(hexCode)) {
        setColorError('Please enter a valid hex color code');
        return;
      }
      if (!colorFormData.description.trim()) {
        setColorError('Description is required');
        return;
      }
      setColorError(null);
    } else if (activeColorStep === 1) {
      if (colorFormData.price <= 0) {
        setColorError('Price must be greater than 0');
        return;
      }
      setColorError(null);
    }
    
    if (activeColorStep < colorSteps.length - 1) {
      setActiveColorStep(prev => prev + 1);
    }
  };

  const handleColorStepperBack = () => {
    if (activeColorStep > 0) {
      setActiveColorStep(prev => prev - 1);
    }
  };

  const handleColorFormSubmit = async () => {
    try {
      setColorLoading(true);
      setColorError(null);
      
      let hexCode = colorFormData.hex_code.trim();
      if (!hexCode.startsWith('#')) {
        hexCode = '#' + hexCode;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', colorFormData.name.trim());
      formDataToSend.append('hex_code', hexCode);
      formDataToSend.append('description', colorFormData.description.trim());
      formDataToSend.append('cost', '1');
      formDataToSend.append('price', colorFormData.price.toString());
      formDataToSend.append('is_active', colorFormData.is_active ? '1' : '0');
      
      if (colorImageFile) {
        formDataToSend.append('image', colorImageFile);
      } else if (isEditColorMode && editingColor && colorFormData.image) {
        formDataToSend.append('current_image', colorFormData.image);
      }
      
      if (enablePriceTiers && calculatedPriceTiers.length > 0) {
        calculatedPriceTiers.forEach(tier => {
          formDataToSend.append('price_tier_ids[]', tier.id.toString());
        });
        calculatedPriceTiers.forEach(tier => {
          formDataToSend.append(
            `price_adjustments[${tier.id}]`,
            VariantsCalculation.getFinalPrice(tier).toString()
          );
        });
      }
      
      const url = isEditColorMode && editingColor
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/${editingColor.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors`;
      
      const method = isEditColorMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditColorMode ? 'update' : 'create'} color`);
      }
      
      setColorSuccess(`Color ${isEditColorMode ? 'updated' : 'created'} successfully!`);
      handleColorStepperClose();
      loadColors();
      
      setTimeout(() => {
        setColorSuccess(null);
      }, 3000);
    } catch (err: any) {
      setColorError(err.message || `Failed to ${isEditColorMode ? 'update' : 'create'} color`);
      console.error(`Error ${isEditColorMode ? 'updating' : 'creating'} color:`, err);
    } finally {
      setColorLoading(false);
    }
  };

  const handleColorToggle = (colorId: number) => {
    setFormData(prev => {
      const isSelected = prev.color_ids.includes(colorId);
      return {
        ...prev,
        color_ids: isSelected
          ? prev.color_ids.filter(id => id !== colorId)
          : [...prev.color_ids, colorId]
      };
    });
  };

  const handleColorsSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorsSearchTerm(event.target.value);
  };

  const handleColorsChangePage = (event: unknown, newPage: number) => {
    setColorsPage(newPage);
  };

  return (
    <AdminLayout title="Create New Material Type">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
        </Box>

    

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Basic Information */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter material type name"
                  sx={{ 
                    mb: 3,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }
                  }}
                />
                </Box>

                {/* Vendor Information */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Vendor Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                  <TextField
                    label="Vendor Name"
                    value={formData.vendor_name}
                    onChange={(e) => handleInputChange('vendor_name', e.target.value)}
                    fullWidth
                    placeholder="Enter vendor name (optional)"
                    sx={{ 
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />

                  <TextField
                    label="Vendor Email"
                    type="email"
                    value={formData.vendor_email}
                    onChange={(e) => handleInputChange('vendor_email', e.target.value)}
                    fullWidth
                    placeholder="Enter vendor email (optional)"
                    sx={{ 
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />

                  <TextField
                    label="Vendor Website"
                    type="url"
                    value={formData.vendor_website}
                    onChange={(e) => handleInputChange('vendor_website', e.target.value)}
                    fullWidth
                    placeholder="Enter vendor website (optional)"
                    sx={{ 
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '1rem', sm: '0.875rem' }
                      }
                    }}
                  />
                </Box>
                </Box>

                {/* Image Upload Field */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: 'text.primary', 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}>
                    Image
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                
                <Box>
                  {/* Image Upload Area with Drag & Drop, Paste, and Browse */}
                  <Box
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    sx={{
                      border: 2,
                      borderColor: isDragging ? 'primary.main' : 'divider',
                      borderStyle: isDragging ? 'solid' : 'dashed',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      bgcolor: isDragging ? 'action.hover' : 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Drag & drop an image here, paste from clipboard (Ctrl+V), or click to browse
                    </Typography>
                    
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        sx={{ 
                          minHeight: { xs: 44, sm: 'auto' },
                          fontSize: { xs: '0.95rem', sm: '0.875rem' }
                        }}
                      >
                        {formData.image ? `Change Image: ${formData.image.name}` : 'Browse Files'}
                      </Button>
                    </label>
                  </Box>
                  
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
                        }}
                      />
                    </Box>
                  )}
                </Box>
                </Box>

                {/* Colors */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ 
                      color: 'text.primary', 
                      fontWeight: 700, 
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}>
                      Colors
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleColorAdd}
                      size="small"
                      sx={{
                        minHeight: { xs: 36, sm: 'auto' },
                        fontSize: { xs: '0.875rem', sm: '0.75rem' }
                      }}
                    >
                      Add Color
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  {/* Search Bar */}
                  <TextField
                    placeholder="Search colors..."
                    value={colorsSearchTerm}
                    onChange={handleColorsSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2, maxWidth: { xs: '100%', sm: 400 } }}
                    size="small"
                    fullWidth={isMobile}
                  />

                  {/* Colors Table */}
                  {loadingColors ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                      <CircularProgress />
                    </Box>
                  ) : colorsError ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {colorsError}
                    </Alert>
                  ) : colors.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {colorsSearchTerm ? 'No colors found. Try adjusting your search.' : 'No colors available. Click "Add Color" to create one.'}
                      </Typography>
                    </Paper>
                  ) : (
                    <>
                      <TableContainer component={Paper} sx={{ mb: 2 }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: 'grey.50' }}>
                              <TableCell padding="checkbox" sx={{ fontWeight: 600 }}>Select</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Color</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Hex Code</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {colors.map((color) => (
                              <TableRow key={color.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={formData.color_ids.includes(color.id)}
                                    onChange={() => handleColorToggle(color.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 1,
                                      backgroundColor: color.hex_code || '#ccc',
                                      border: 1,
                                      borderColor: 'divider',
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {color.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {color.hex_code}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                      maxWidth: 200,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {color.description || 'No description'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleColorEdit(color)}
                                      title="Edit"
                                      sx={{ color: 'primary.main' }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleColorDelete(color)}
                                      title="Delete"
                                      color="error"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Pagination */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mt: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Items per page:
                          </Typography>
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                              value={colorsRowsPerPage.toString()}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                setColorsRowsPerPage(value);
                                setColorsPage(0);
                              }}
                            >
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={15}>15</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          Showing {colorsPage * colorsRowsPerPage + 1} to {Math.min((colorsPage + 1) * colorsRowsPerPage, colorsTotalCount)} of {colorsTotalCount} colors
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={colorsPage === 0}
                            onClick={() => handleColorsChangePage({} as any, colorsPage - 1)}
                          >
                            Previous
                          </Button>
                          
                          <Typography variant="body2" sx={{ px: 2 }}>
                            Page {colorsPage + 1} of {Math.ceil(colorsTotalCount / colorsRowsPerPage) || 1}
                          </Typography>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={colorsPage >= Math.ceil(colorsTotalCount / colorsRowsPerPage) - 1}
                            onClick={() => handleColorsChangePage({} as any, colorsPage + 1)}
                          >
                            Next
                          </Button>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                    sx={{
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.95rem', sm: '0.875rem' },
                      order: { xs: 2, sm: 1 }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{
                      backgroundColor: 'primary.main',
                      minHeight: { xs: 44, sm: 'auto' },
                      fontSize: { xs: '0.95rem', sm: '0.875rem' },
                      order: { xs: 1, sm: 2 },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Material Type'}
                  </Button>
                </Box>
            </Box>
          </form>
        </Paper>

        {/* Color Stepper Dialog */}
        <Dialog
          open={isColorStepperOpen}
          onClose={handleColorStepperClose}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            sx: {
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {isEditColorMode ? 'Edit Color' : 'Add New Color'}
              </Typography>
              <IconButton onClick={handleColorStepperClose} size="small">
                ✕
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {colorError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setColorError(null)}>
                {colorError}
              </Alert>
            )}
            {colorSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {colorSuccess}
              </Alert>
            )}

            <Stepper activeStep={activeColorStep} sx={{ mb: 4, mt: 2 }}>
              {colorSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            <Box sx={{ minHeight: 400 }}>
              {activeColorStep === 0 && (
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, sm: 0 }
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Basic Information
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={colorFormData.is_active}
                          onChange={(e) => handleColorInputChange('is_active', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {colorFormData.is_active ? 'Active' : 'Inactive'}
                        </Typography>
                      }
                      labelPlacement="start"
                    />
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <TextField
                    label="Color Name"
                    value={colorFormData.name}
                    onChange={(e) => handleColorInputChange('name', e.target.value)}
                    required
                    fullWidth
                    placeholder="Enter color name"
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Hex Code"
                      value={colorFormData.hex_code.replace('#', '')}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith('#')) {
                          value = '#' + value;
                        }
                        handleColorInputChange('hex_code', value);
                      }}
                      required
                      fullWidth
                      placeholder="000000"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography variant="body2" color="text.secondary">#</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    {colorFormData.hex_code && (
                      <Box sx={{ 
                        mt: 2, 
                        p: 2, 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 1,
                        backgroundColor: 'background.paper'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              border: '2px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              backgroundColor: colorFormData.hex_code,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: getContrastColor(colorFormData.hex_code),
                                fontWeight: 600,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                              }}
                            >
                              {colorFormData.hex_code.replace('#', '').toUpperCase()}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Color Preview: {colorFormData.hex_code.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {isValidHexColor(colorFormData.hex_code) ? 'Valid color code' : 'Invalid color code'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <TextField
                    label="Description"
                    value={colorFormData.description}
                    onChange={(e) => handleColorInputChange('description', e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter description"
                    required
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Color Texture Image (Optional)
                    </Typography>
                    
                    <Box
                      onDragEnter={handleColorDragEnter}
                      onDragOver={handleColorDragOver}
                      onDragLeave={handleColorDragLeave}
                      onDrop={handleColorDrop}
                      sx={{
                        border: 2,
                        borderColor: isColorDragging ? 'primary.main' : 'divider',
                        borderStyle: isColorDragging ? 'solid' : 'dashed',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        bgcolor: isColorDragging ? 'action.hover' : 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        mb: 2,
                        cursor: 'pointer',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Drag & drop an image here or click to browse
                      </Typography>
                      <Button variant="outlined" component="label">
                        Browse Files
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleColorImageChange}
                        />
                      </Button>
                    </Box>

                    {colorImagePreview && (
                      <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                        <Box
                          component="img"
                          src={colorImagePreview}
                          alt="Preview"
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={handleColorRemoveImage}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'error.light' },
                          }}
                        >
                          ✕
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {activeColorStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Pricing & Price Tiers
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <TextField
                    label="In Store Price"
                    type="number"
                    value={colorPriceInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setColorPriceInput(value);
                      
                      if (value !== '' && value !== '-' && value !== '.' && !value.endsWith('.')) {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          handleColorInputChange('price', numValue);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value === '' || value === '-' || isNaN(parseFloat(value))) {
                        setColorPriceInput('');
                        handleColorInputChange('price', 0);
                      } else {
                        const numValue = parseFloat(value);
                        const finalValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
                        setColorPriceInput(finalValue.toString());
                        handleColorInputChange('price', finalValue);
                      }
                    }}
                    required
                    fullWidth
                    placeholder="Enter in Store price"
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ mb: 4 }}
                  />

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Price Tiers
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 3
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={enablePriceTiers}
                          onChange={handleColorEnablePriceTiersChange}
                          color="primary"
                        />
                      }
                      label="Enable Price Tiers"
                    />
                    {enablePriceTiers && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleColorResetPriceTiers}
                      >
                        Reset
                      </Button>
                    )}
                  </Box>

                  {enablePriceTiers && calculatedPriceTiers.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Calculated Price Tiers
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Based on base price: ${VariantsCalculation.formatPrice(colorFormData.price)}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 2 
                      }}>
                        {calculatedPriceTiers.map((tier) => (
                          <Paper key={tier.id} variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {tier.display_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  Multiplier: {parseFloat(tier.discount_off_retail_price) || 1} × Base Price
                                </Typography>
                                {tier.is_overridden && (
                                  <Typography variant="body2" color="text.secondary">
                                    Calculated: ${VariantsCalculation.formatPrice(tier.calculated_price)}
                                  </Typography>
                                )}
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <TextField
                                  label="Price"
                                  type="text"
                                  size="small"
                                  value={overridePriceInputs[tier.id] ?? (tier.is_overridden && tier.override_price !== undefined
                                    ? tier.override_price.toFixed(2)
                                    : tier.calculated_price !== undefined
                                    ? tier.calculated_price.toFixed(2)
                                    : '')}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setOverridePriceInputs(prev => ({
                                      ...prev,
                                      [tier.id]: value
                                    }));
                                  }}
                                  onBlur={(e) => {
                                    const value = e.target.value.trim();
                                    if (value === '' || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
                                      // Clear override if invalid
                                      setOverridePriceInputs(prev => {
                                        const newInputs = { ...prev };
                                        delete newInputs[tier.id];
                                        return newInputs;
                                      });
                                      handleColorPriceOverrideChange(tier.id, 0);
                                    } else {
                                      const numValue = parseFloat(value);
                                      const roundedValue = Math.round(numValue * 100) / 100;
                                      setOverridePriceInputs(prev => ({
                                        ...prev,
                                        [tier.id]: roundedValue.toFixed(2)
                                      }));
                                      handleColorPriceOverrideChange(tier.id, roundedValue);
                                    }
                                  }}
                                  inputProps={{ 
                                    inputMode: 'decimal',
                                    pattern: '[0-9]*\\.?[0-9]*'
                                  }}
                                  sx={{ mb: 1 }}
                                />
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" sx={{ 
                                    fontWeight: 600, 
                                    color: tier.is_overridden ? 'warning.main' : 'primary.main'
                                  }}>
                                    ${VariantsCalculation.formatPrice(VariantsCalculation.getFinalPrice(tier))}
                                  </Typography>
                                  {tier.is_overridden && (
                                    <Typography variant="caption" color="warning.main">
                                      Overridden
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={handleColorStepperClose} disabled={colorLoading}>
              Cancel
            </Button>
            <Box sx={{ flex: 1 }} />
            {activeColorStep > 0 && (
              <Button onClick={handleColorStepperBack} disabled={colorLoading}>
                Back
              </Button>
            )}
            {activeColorStep < colorSteps.length - 1 ? (
              <Button onClick={handleColorStepperNext} variant="contained" disabled={colorLoading}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleColorFormSubmit} 
                variant="contained" 
                disabled={colorLoading}
                startIcon={colorLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {colorLoading ? (isEditColorMode ? 'Updating...' : 'Creating...') : (isEditColorMode ? 'Update Color' : 'Create Color')}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Delete Color Confirmation Dialog */}
        <Dialog
          open={isDeleteColorDialogOpen}
          onClose={() => setIsDeleteColorDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{colorToDelete?.name}&quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteColorDialogOpen(false)} disabled={deletingColor}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeleteColor} color="error" variant="contained" disabled={deletingColor}>
              {deletingColor ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default CreateMaterialTypePage;
