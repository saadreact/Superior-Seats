'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  OutlinedInput,
  Checkbox,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { productApi, Product } from '@/services/productapi';
import { apiService } from '@/utils/api';
import { VariantsCalculation, CalculatedPriceTier } from '@/utils/VariantsCalculation';

interface ProductPage2Form {
  // First Half - Product Fields
  name: string;
  category: string;
  description: string;
  basePrice: number;
  stock: number;
  images: File[];
  showOnSpecialShop: boolean;
  
  // Vehicle Information Fields
  vehicleMake: string;
  vehicleModel: string;
  vehicleTrim: string;
  
  // Variations Enable/Disable
  enableVariations: boolean;
  
  // Second Half - Variation Fields
  seatType: string[];
  armType: string[];
  lumbarType: string[];
  reclineType: string[];
  heatOption: string[];
  materialType: string[];
  stitchPattern: string[];
  seatItemType: string[];
  seatStyle: string[];
  color: string[];
  
  
  // Price Tiers Fields
  enablePriceTiers: boolean;
  
  isActive: boolean;
  isCustomize3dProduct: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  stock: number;
  images: string[];
  seatType: string[];
  armType: string[];
  lumbarType: string[];
  reclineType: string[];
  heatOption: string[];
  materialType: string[];
  stitchPattern: string[];
  seatItemType: string[];
  color: string[];
  isActive: boolean;
  createdAt: string;
}

const EditProduct2Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state
  const [formData, setFormData] = useState<ProductPage2Form>({
    name: '',
    category: '',
    description: '',
    basePrice: 0,
    stock: 0,
    images: [],
    showOnSpecialShop: false,
    vehicleMake: '',
    vehicleModel: '',
    vehicleTrim: '',
    enableVariations: false,
    seatType: [],
    armType: [],
    lumbarType: [],
    reclineType: [],
    heatOption: [],
    materialType: [],
    stitchPattern: [],
    seatItemType: [],
    seatStyle: [],
    color: [],
    enablePriceTiers: false,
    isActive: true,
    isCustomize3dProduct: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [existingImages, setExistingImages] = useState<{id: number, url: string}[]>([]);
  
  // Price tiers states
  const [calculatedPriceTiers, setCalculatedPriceTiers] = useState<CalculatedPriceTier[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [priceTiers, setPriceTiers] = useState<any[]>([]);
  // Track raw input values for price override fields to allow free typing
  const [priceOverrideInputs, setPriceOverrideInputs] = useState<Record<string, string>>({});

  // Data state for dropdowns
  const [categories, setCategories] = useState<{ id: number; name: string; price: number }[]>([]);
  const [seatTypes, setSeatTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [armTypes, setArmTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [lumbarTypes, setLumbarTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [reclineTypes, setReclineTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [heatOptions, setHeatOptions] = useState<{ id: number; name: string; price: number }[]>([]);
  const [materialTypes, setMaterialTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [stitchPatterns, setStitchPatterns] = useState<{ id: number; name: string; price: number }[]>([]);
  const [seatItemTypes, setSeatItemTypes] = useState<{ id: number; name: string; price: number }[]>([]);
  const [seatStyles, setSeatStyles] = useState<{ id: number; name: string; price: number }[]>([]);
  const [colors, setColors] = useState<{ id: number; name: string; price: number }[]>([]);
  
  // Vehicle data state
  const [vehicleMakes, setVehicleMakes] = useState<{ id: number; name: string }[]>([]);
  const [vehicleModels, setVehicleModels] = useState<{ id: number; name: string; vehicle_make_id: number }[]>([]);
  const [vehicleTrims, setVehicleTrims] = useState<{ id: number; name: string; vehicle_model_id: number }[]>([]);
  
  // 3D Customization state
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [glbError, setGlbError] = useState<string>('');
  const [customizableMeshes, setCustomizableMeshes] = useState<string>('');
  const [currentGlbPath, setCurrentGlbPath] = useState<string>('');

  useEffect(() => {
    loadInitialData();
    loadPriceTiers();
  }, [id]);

  // Effect to calculate price tiers when priceTiers are loaded or dependencies change
  useEffect(() => {
    if (formData.enablePriceTiers && priceTiers.length > 0 && formData.basePrice > 0) {
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(formData.basePrice, priceTiers, priceOverrides);
      setCalculatedPriceTiers(newCalculatedTiers);
      
      // Initialize input values for new tiers if they don't exist
      setPriceOverrideInputs(prev => {
        const newInputs = { ...prev };
        newCalculatedTiers.forEach(tier => {
          const tierIdStr = tier.id.toString();
          if (!(tierIdStr in newInputs)) {
            // Set initial input value based on override or calculated price
            if (tier.is_overridden && tier.override_price !== undefined) {
              newInputs[tierIdStr] = tier.override_price.toFixed(2);
            } else {
              newInputs[tierIdStr] = tier.calculated_price.toFixed(2);
            }
          }
        });
        return newInputs;
      });
    }
  }, [priceTiers, formData.enablePriceTiers, formData.basePrice, priceOverrides]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      
    
      
      // Load all required data for dropdowns and the product using productApi with fallbacks
      const [
        categoriesRes,
        seatTypesRes,
        armTypesRes,
        lumbarTypesRes,
        reclineTypesRes,
        heatOptionsRes,
        materialTypesRes,
        stitchPatternsRes,
        seatItemTypesRes,
        seatStylesRes,
        colorsRes,
        vehicleMakesRes,
        productRes,
      ] = await Promise.all([
        productApi.getCategories(),
        productApi.getSeatTypes().catch(() => apiService.getSeatTypes()),
        productApi.getArmTypes().catch(() => apiService.getArmTypes()),
        productApi.getLumbarTypes(),
        productApi.getReclineTypes(),
        productApi.getHeatOptions(),
        productApi.getMaterialTypes(),
        productApi.getStitchPatterns(),
        productApi.getItemTypes().catch(() => apiService.getItemTypes()),
        productApi.getSeatStyles().catch(() => apiService.getSeatStyles()),
        productApi.getColors(),
        apiService.getVehicleMakes(),
        productApi.getProduct(parseInt(id)),
      ]);

      // Convert API responses to the expected format { id, name, price }
      const convertToFormFormat = (items: any[], hasPrice = true) => 
        Array.isArray(items) ? items.map(item => ({ 
          id: item.id || 0,
          name: item.name || item.title || item.label || 'Unknown', 
          price: hasPrice ? (item.price || item.cost || 0) : 0
        })) : [];
      
      // Ensure all responses are arrays and have the expected structure
      setCategories(convertToFormFormat(categoriesRes));
      setSeatTypes(convertToFormFormat(seatTypesRes));
      setArmTypes(convertToFormFormat(armTypesRes));
      setLumbarTypes(convertToFormFormat(lumbarTypesRes));
      setReclineTypes(convertToFormFormat(reclineTypesRes));
      setHeatOptions(convertToFormFormat(heatOptionsRes));
      setMaterialTypes(convertToFormFormat(materialTypesRes));
      setStitchPatterns(convertToFormFormat(stitchPatternsRes));
      setSeatItemTypes(convertToFormFormat(seatItemTypesRes));
      setSeatStyles(convertToFormFormat(seatStylesRes, false)); // Seat styles don't have price
      setColors(convertToFormFormat(colorsRes));
      
      // Set vehicle makes data
      const vehicleMakesData = Array.isArray(vehicleMakesRes?.data) ? vehicleMakesRes.data : 
                              Array.isArray(vehicleMakesRes) ? vehicleMakesRes : [];
      setVehicleMakes(vehicleMakesData.map((make: any) => ({
        id: make.id,
        name: make.name
      })));

      // Helper function to extract variation names from API response
      const extractVariationNames = (variations: any[], fieldName: string): string[] => {
        if (!variations || !Array.isArray(variations)) {
          console.log(`🔍 No variations array for ${fieldName}`);
          return [];
        }
        console.log(`🔍 Processing ${fieldName} from ${variations.length} variations:`, variations);
        const names = variations
          .map((v, index) => {
            console.log(`🔍 Variation ${index} for ${fieldName}:`, v);
            const value = v[fieldName] || v[`${fieldName}_name`] || v[`${fieldName}_type`] || v.name;
            console.log(`🔍 Extracted value for ${fieldName}:`, value);
            return value;
          })
          .filter(Boolean)
          .filter((name, index, arr) => arr.indexOf(name) === index);
        console.log(`🔍 Final extracted ${fieldName}:`, names);
        return names;
      };

      // Helper function to extract names from direct arrays (new API structure)
      const extractNamesFromArray = (items: any[]): string[] => {
        if (!items || !Array.isArray(items)) {
          return [];
        }
        return items.map(item => item.name).filter(Boolean);
      };

      // Helper function to check if a field should show "None" based on API response
      const shouldShowNone = (items: any[]): boolean => {
        if (!items || !Array.isArray(items) || items.length === 0) {
          return true; // Show "None" if no items
        }
        return false;
      };


      // Set form data from product
      if (productRes) {
       
        
        // Handle existing images - use product_images array from API response
        const existingImageData: {id: number, url: string}[] = [];
        const productWithImages = productRes as any;
        if (productWithImages.product_images && Array.isArray(productWithImages.product_images)) {
          console.log('🔍 Processing existing images from product_images:', productWithImages.product_images);
          // Sort by sort_order to maintain proper order
          const sortedImages = productWithImages.product_images.sort((a: any, b: any) => a.sort_order - b.sort_order);
          const mappedImages = sortedImages.map((img: any) => ({
            id: img.id,
            url: img.image_path || img.image_url || ''
          }));
          existingImageData.push(...mappedImages.filter((img: {id: number, url: string}) => img.url));
        }
        
        // Also check for primary_image as fallback
        if (productRes.primary_image?.image_path && !existingImageData.some(img => img.url === productRes.primary_image?.image_path)) {
          const primaryImage = productRes.primary_image;
          existingImageData.unshift({
            id: primaryImage.id || 0,
            url: primaryImage.image_path
          });
        }
        
      
        setExistingImages(existingImageData);

        // Load price tiers data from API response if available
        const priceTiersData = (productRes as any).price_tiers;
        const hasPriceTiers = priceTiersData && Array.isArray(priceTiersData) && priceTiersData.length > 0;
        
        let existingPriceTiers: CalculatedPriceTier[] = [];
        if (hasPriceTiers) {
          existingPriceTiers = priceTiersData.map((tier: any) => {
            // Handle both pivot.price_adjustment and direct price_adjustment
            const existingPrice = parseFloat(tier.pivot?.price_adjustment || tier.price_adjustment) || 0;
            const calculatedPrice = VariantsCalculation.calculatePriceAdjustment(
              parseFloat(productRes.price) || 0, 
              parseFloat(tier.discount_off_retail_price)
            ).calculatedPrice;
            
            // Check if this is an override
            const isOverridden = Math.abs(existingPrice - calculatedPrice) > 0.01;
            
            const basePrice = parseFloat(productRes.price) || 0;
            const multiplier = parseFloat(tier.discount_off_retail_price) || 1;
            const calculatedPriceFromMultiplier = Math.round((basePrice * multiplier) * 100) / 100;
            const discountAmount = Math.round((basePrice - calculatedPriceFromMultiplier) * 100) / 100;
            
            return {
              id: tier.id,
              name: tier.name,
              display_name: tier.display_name,
              discount_off_retail_price: tier.discount_off_retail_price,
              calculated_price: calculatedPriceFromMultiplier,
              discount_amount: discountAmount,
              created_at: tier.created_at,
              updated_at: tier.updated_at,
              customers_count: tier.customers_count || 0,
              pivot: tier.pivot || { price_adjustment: tier.price_adjustment },
              override_price: isOverridden ? Math.round(existingPrice * 100) / 100 : undefined,
              is_overridden: isOverridden
            };
          });
        }

        // Determine if variations are enabled based on existing data
        const hasVariations = productRes.vehicle_trim?.id || 
          (productWithImages.seat_types && productWithImages.seat_types.length > 0) ||
          (productWithImages.arm_types && productWithImages.arm_types.length > 0) ||
          (productWithImages.lumbar_types && productWithImages.lumbar_types.length > 0) ||
          (productWithImages.recline_types && productWithImages.recline_types.length > 0) ||
          (productWithImages.heat_options && productWithImages.heat_options.length > 0) ||
          (productWithImages.material_types && productWithImages.material_types.length > 0) ||
          (productWithImages.seat_stitch_patterns && productWithImages.seat_stitch_patterns.length > 0) ||
          (productWithImages.item_types && productWithImages.item_types.length > 0) ||
          (productWithImages.seat_styles && productWithImages.seat_styles.length > 0) ||
          (productWithImages.colors && productWithImages.colors.length > 0);

        setFormData({
          name: productRes.name || '',
          category: productRes.category?.name || '',
          description: productRes.description || '',
          basePrice: parseFloat(productRes.price) || 0,
          stock: productRes.stock || 0,
          images: [], // Start with empty array for new file uploads
          showOnSpecialShop: (productRes as any).show_on_special_shop ?? false,
          vehicleMake: '', // Will be set after loading vehicle data
          vehicleModel: '', // Will be set after loading vehicle data  
          vehicleTrim: productRes.vehicle_trim?.id?.toString() || '',
          enableVariations: hasVariations || false,
          // Use direct arrays from API response and add "None" if no items
          seatType: shouldShowNone(productWithImages.seat_types) ? ['None'] : extractNamesFromArray(productWithImages.seat_types || []),
          armType: shouldShowNone(productWithImages.arm_types) ? ['None'] : extractNamesFromArray(productWithImages.arm_types || []),
          lumbarType: shouldShowNone(productWithImages.lumbar_types) ? ['None'] : extractNamesFromArray(productWithImages.lumbar_types || []),
          reclineType: shouldShowNone(productWithImages.recline_types) ? ['None'] : extractNamesFromArray(productWithImages.recline_types || []),
          heatOption: shouldShowNone(productWithImages.heat_options) ? ['None'] : extractNamesFromArray(productWithImages.heat_options || []),
          materialType: shouldShowNone(productWithImages.material_types) ? ['None'] : extractNamesFromArray(productWithImages.material_types || []),
          stitchPattern: shouldShowNone(productWithImages.seat_stitch_patterns) ? ['None'] : extractNamesFromArray(productWithImages.seat_stitch_patterns || []),
          seatItemType: shouldShowNone(productWithImages.item_types) ? ['None'] : extractNamesFromArray(productWithImages.item_types || []),
          seatStyle: shouldShowNone(productWithImages.seat_styles) ? ['None'] : extractNamesFromArray(productWithImages.seat_styles || []),
          color: shouldShowNone(productWithImages.colors) ? ['None'] : extractNamesFromArray(productWithImages.colors || []),
          enablePriceTiers: hasPriceTiers, // Enable if price tiers exist
          isActive: productRes.is_active ?? true,
          isCustomize3dProduct: productRes.is_customize_3d_product ?? false,
        });
        
        // Load 3D customization data
        if (productRes.model_file_path) {
          setCurrentGlbPath(productRes.model_file_path);
          console.log('🔍 Loaded GLB file path:', productRes.model_file_path);
        }
        
        if (productRes.customizable_meshes && Array.isArray(productRes.customizable_meshes)) {
          setCustomizableMeshes(productRes.customizable_meshes.join(', '));
          console.log('🔍 Loaded customizable meshes:', productRes.customizable_meshes);
        }
        
        // Set calculated price tiers if they exist
        if (hasPriceTiers) {
          setCalculatedPriceTiers(existingPriceTiers);
        }
        
    
  
        
  
        
        // Load vehicle models and trims if vehicle data exists
        // Use the vehicle_trim data to get the full vehicle hierarchy
        if (productRes.vehicle_trim?.id) {
          console.log('🔍 Loading vehicle data from vehicle_trim:', productRes.vehicle_trim);
          try {
            // Get the full vehicle trim data with make and model information
            const trimResponse = await apiService.getVehicleTrimById(productRes.vehicle_trim.id);
            const trimData = trimResponse?.data || trimResponse;
            
            if (trimData?.model?.vehicle_make_id) {
        
              const modelsResponse = await apiService.getVehicleModels(trimData.model.vehicle_make_id);
              const modelsData = Array.isArray(modelsResponse?.data) ? modelsResponse.data : 
                                Array.isArray(modelsResponse) ? modelsResponse : [];
              setVehicleModels(modelsData.map((model: any) => ({
                id: model.id,
                name: model.name,
                vehicle_make_id: model.vehicle_make_id
              })));
              
              // Load vehicle trims for the model
            
              const trimsResponse = await apiService.getVehicleTrims(trimData.model.id);
              const trimsData = Array.isArray(trimsResponse?.data) ? trimsResponse.data : 
                               Array.isArray(trimsResponse) ? trimsResponse : [];
              setVehicleTrims(trimsData.map((trim: any) => ({
                id: trim.id,
                name: trim.name,
                vehicle_model_id: trim.vehicle_model_id
              })));
              
              // Update form data with the correct vehicle make and model IDs
              setFormData(prev => ({
                ...prev,
                vehicleMake: trimData.model.vehicle_make_id.toString(),
                vehicleModel: trimData.model.id.toString(),
              }));
            }
          } catch (error) {
            console.error('Error loading vehicle data:', error);
          }
        }
      }
    } catch (error: any) {
      console.error('Error loading initial data:', error);
      
      if (error.response?.status === 401 || error.message.includes('401') || error.message.includes('Unauthorized')) {
        setErrors({ submit: 'Authentication required. You will be redirected to the login page in 3 seconds.' });
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (error.response?.status === 403) {
        setErrors({ submit: 'Access denied. You do not have permission to edit products.' });
      } else if (error.response?.status === 404) {
        setErrors({ submit: 'Product not found. It may have been deleted.' });
      } else {
        setErrors({ submit: 'Failed to load product data. Please refresh the page.' });
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBackToList = () => {
    router.push('/admin/Products');
  };

  const handleChange = (field: keyof ProductPage2Form) => (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleMultiSelectChange = (field: keyof ProductPage2Form) => (
    event: any
  ) => {
    const value = event.target.value;
    
    // Regular handling for fields (store names)
    const selectedValues: string[] = typeof value === 'string' ? value.split(',') : value;
    
    // Check if "None" is being selected
    const isSelectingNone = selectedValues.includes('None');
    const wasNoneSelected = (formData[field] as string[]).includes('None');
    
    let finalValues: string[];
    
    if (isSelectingNone && !wasNoneSelected) {
      // If "None" is being selected and it wasn't selected before, clear all other selections
      finalValues = ['None'];
    } else if (isSelectingNone && wasNoneSelected) {
      // If "None" is being deselected, keep other selections
      finalValues = selectedValues.filter(val => val !== 'None');
    } else if (!isSelectingNone && wasNoneSelected) {
      // If selecting other options while "None" was selected, remove "None" and keep new selections
      finalValues = selectedValues.filter(val => val !== 'None');
    } else {
      // Normal selection without "None" involved
      finalValues = selectedValues;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: finalValues,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleNumberChange = (field: keyof ProductPage2Form) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSwitchChange = (field: keyof ProductPage2Form) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  // Vehicle change handlers
  const handleVehicleMakeChange = async (event: any) => {
    const makeId = event.target.value;
    setFormData(prev => ({
      ...prev,
      vehicleMake: makeId,
      vehicleModel: '', // Reset model when make changes
      vehicleTrim: '', // Reset trim when make changes
    }));
    
    // Load models for selected make
    if (makeId) {
      try {
        const modelsResponse = await apiService.getVehicleModels(Number(makeId));
        const modelsData = Array.isArray(modelsResponse?.data) ? modelsResponse.data : 
                          Array.isArray(modelsResponse) ? modelsResponse : [];
        setVehicleModels(modelsData.map((model: any) => ({
          id: model.id,
          name: model.name,
          vehicle_make_id: model.vehicle_make_id
        })));
        setVehicleTrims([]); // Clear trims when make changes
      } catch (error) {
        console.error('Error loading vehicle models:', error);
        setVehicleModels([]);
        setVehicleTrims([]);
      }
    } else {
      setVehicleModels([]);
      setVehicleTrims([]);
    }
  };

  const handleVehicleModelChange = async (event: any) => {
    const modelId = event.target.value;
    setFormData(prev => ({
      ...prev,
      vehicleModel: modelId,
      vehicleTrim: '', // Reset trim when model changes
    }));
    
    // Load trims for selected model
    if (modelId) {
      try {
        const trimsResponse = await apiService.getVehicleTrims(Number(modelId));
        const trimsData = Array.isArray(trimsResponse?.data) ? trimsResponse.data : 
                         Array.isArray(trimsResponse) ? trimsResponse : [];
        setVehicleTrims(trimsData.map((trim: any) => ({
          id: trim.id,
          name: trim.name,
          vehicle_model_id: trim.vehicle_model_id
        })));
      } catch (error) {
        console.error('Error loading vehicle trims:', error);
        setVehicleTrims([]);
      }
    } else {
      setVehicleTrims([]);
    }
  };

  const handleVehicleTrimChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      vehicleTrim: event.target.value,
    }));
  };

  // Variations toggle handler
  const handleVariationsToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setFormData(prev => ({
      ...prev,
      enableVariations: enabled,
      // Reset all variation fields when disabled
      ...(enabled ? {} : {
        seatType: [],
        armType: [],
        lumbarType: [],
        reclineType: [],
        heatOption: [],
        materialType: [],
        stitchPattern: [],
        seatItemType: [],
        seatStyle: [],
        color: [],
        vehicleMake: '',
        vehicleModel: '',
        vehicleTrim: '',
      })
    }));
  };

  // Price tiers handlers
  const handlePriceTiersToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setFormData(prev => ({
      ...prev,
      enablePriceTiers: enabled,
    }));
    
    if (enabled) {
      // Calculate price tiers when enabled
      if (formData.basePrice > 0) {
        const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(formData.basePrice, priceTiers, priceOverrides);
        setCalculatedPriceTiers(newCalculatedTiers);
        
        // Price tiers are now handled directly in handleSubmit
      }
    } else {
      // Clear price tiers when disabled
      // Price tiers are now handled directly in handleSubmit
      setCalculatedPriceTiers([]);
      setPriceOverrides({});
    }
  };

  const handlePriceOverrideInputChange = (tierId: number, inputValue: string) => {
    const tierIdStr = tierId.toString();
    // Update the raw input value to allow free typing
    setPriceOverrideInputs(prev => ({
      ...prev,
      [tierIdStr]: inputValue
    }));
  };

  const handlePriceOverrideBlur = (tierId: number) => {
    const tierIdStr = tierId.toString();
    const inputValue = priceOverrideInputs[tierIdStr] || '';
    
    // If empty or invalid, remove override and reset to calculated price
    if (inputValue === '' || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) {
      setPriceOverrides(prev => {
        const newOverrides: Record<string, number> = {};
        for (const key in prev) {
          if (key !== tierIdStr) {
            newOverrides[key] = prev[key];
          }
        }
        return newOverrides;
      });
      
      // Reset input to calculated price
      const tier = calculatedPriceTiers.find(t => t.id === tierId);
      if (tier) {
        setPriceOverrideInputs(prev => ({
          ...prev,
          [tierIdStr]: tier.calculated_price.toFixed(2)
        }));
      }
      return;
    }
    
    // Round to 2 decimal places and set override
    const roundedPrice = Math.round(parseFloat(inputValue) * 100) / 100;
    
    setPriceOverrides(prev => ({
      ...prev,
      [tierIdStr]: roundedPrice
    }));
    
    // Update input to show formatted value
    setPriceOverrideInputs(prev => ({
      ...prev,
      [tierIdStr]: roundedPrice.toFixed(2)
    }));
  };

  const handleResetPriceTiers = () => {
    if (formData.basePrice > 0) {
      // Clear all overrides
      setPriceOverrides({});
      
      // Recalculate price tiers without overrides
      const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(formData.basePrice, priceTiers, {});
      setCalculatedPriceTiers(newCalculatedTiers);
      
      // Price adjustments are now handled directly in handleSubmit
    }
  };

  const loadPriceTiers = async () => {
    try {
      const response = await productApi.getPriceTiers();
      setPriceTiers(response || []);
    } catch (err) {
      console.error('Error loading price tiers:', err);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
  
    
    // Validate files
    const validFiles = files.filter(file => {
      console.log('📁 Validating file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        isFile: file instanceof File
      });
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
      
        setErrors(prev => ({
          ...prev,
          images: 'Please select valid image files (JPEG, PNG, or GIF)',
        }));
        return false;
      }
      
      if (file.size > 2 * 1024 * 1024) {
      
        setErrors(prev => ({
          ...prev,
          images: 'Image size must be less than 2MB',
        }));
        return false;
      }
      
      console.log('✅ File is valid');
      return true;
    });
    
 
    
    setFormData(prev => {
      const newImages = [...prev.images, ...validFiles];
    
      return {
        ...prev,
        images: newImages,
      };
    });
    
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: '',
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index: number) => {
    // Simply remove from existing images list
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGlbFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtension = file.name.toLowerCase().endsWith('.glb');
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!validExtension) {
      setGlbError('Please select a valid GLB file (.glb)');
      setGlbFile(null);
      return;
    }

    if (file.size > maxSize) {
      setGlbError('GLB file size must be less than 20MB');
      setGlbFile(null);
      return;
    }

    setGlbFile(file);
    setGlbError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    // Only validate variations if they are enabled
    if (formData.enableVariations) {
      // Helper function to check if field has valid selection (either has options or "None")
      const hasValidSelection = (field: string[] | number[]) => field.length > 0;

      if (!hasValidSelection(formData.seatType)) {
        newErrors.seatType = 'Please select at least one seat type or "None"';
      }

      if (!hasValidSelection(formData.armType)) {
        newErrors.armType = 'Please select at least one arm type or "None"';
      }

      if (!hasValidSelection(formData.lumbarType)) {
        newErrors.lumbarType = 'Please select at least one lumbar type or "None"';
      }

      if (!hasValidSelection(formData.reclineType)) {
        newErrors.reclineType = 'Please select at least one recline type or "None"';
      }

      if (!hasValidSelection(formData.heatOption)) {
        newErrors.heatOption = 'Please select at least one heat option or "None"';
      }

      if (!hasValidSelection(formData.materialType)) {
        newErrors.materialType = 'Please select at least one material type or "None"';
      }

      if (!hasValidSelection(formData.stitchPattern)) {
        newErrors.stitchPattern = 'Please select at least one stitch pattern or "None"';
      }

      if (!hasValidSelection(formData.seatItemType)) {
        newErrors.seatItemType = 'Please select at least one seat item type or "None"';
      }

      if (!hasValidSelection(formData.seatStyle)) {
        newErrors.seatStyle = 'Please select at least one seat style or "None"';
      }

      if (!hasValidSelection(formData.color)) {
        newErrors.color = 'Please select at least one color or "None"';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Helper function to map variation names to IDs (excluding "None")
      const mapNamesToIds = (selectedNames: string[], availableOptions: { id: number; name: string; price: number }[]): number[] | undefined => {
        const ids = selectedNames
          .filter(name => name !== 'None') // Filter out "None" selections
          .map(name => {
            const option = availableOptions.find(opt => opt.name === name);
            return option?.id;
          })
          .filter((id): id is number => id !== undefined);
        
        return ids.length > 0 ? ids : undefined;
      };

      // Find selected category ID
      const selectedCategory = categories.find(cat => cat.name === formData.category);
      const categoryId = selectedCategory?.id;

      // Prepare customizable meshes array
      const meshesArray = customizableMeshes
        .split(',')
        .map(m => m.trim())
        .filter(m => m.length > 0);

      // Create product data object using simple File array (like create page)
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.basePrice,
        stock: formData.stock,
        is_active: formData.isActive,
        is_customize_3d_product: formData.isCustomize3dProduct,
        show_on_special_shop: formData.showOnSpecialShop,
        category_id: categoryId,
        images: formData.images, // Only send new images like create page
        
        // 3D customization fields
        model_file: formData.isCustomize3dProduct && glbFile ? glbFile : undefined,
        current_model_file_path: formData.isCustomize3dProduct && !glbFile && currentGlbPath ? currentGlbPath : undefined,
        customizable_meshes: formData.isCustomize3dProduct && meshesArray.length > 0 ? meshesArray : undefined,
        
        // Combine existing and new images into single image_data array (like backend expects)
        existing_images: existingImages.map(img => img.url), // Send existing image URLs for backend processing
        
        // Add image metadata for new images (like create page)
        image_data: formData.images.length > 0 ? formData.images.map((_, index) => ({
          alt_text: `Product image ${existingImages.length + index + 1}`, 
          caption: `Product image ${existingImages.length + index + 1}`,
          set_primary: existingImages.length === 0 && index === 0 // First new image is primary only if no existing images
        })) : undefined,
        
        // Vehicle information - only pass trim ID if variations are enabled
        vehicle_trim_id: formData.enableVariations && formData.vehicleTrim ? Number(formData.vehicleTrim) : undefined,
        
        // Map variation names to IDs - only if variations are enabled
        seat_type_ids: formData.enableVariations ? mapNamesToIds(formData.seatType, seatTypes) : undefined,
        arm_type_ids: formData.enableVariations ? mapNamesToIds(formData.armType, armTypes) : undefined,
        lumbar_type_ids: formData.enableVariations ? mapNamesToIds(formData.lumbarType, lumbarTypes) : undefined,
        recline_type_ids: formData.enableVariations ? mapNamesToIds(formData.reclineType, reclineTypes) : undefined,
        heat_option_ids: formData.enableVariations ? mapNamesToIds(formData.heatOption, heatOptions) : undefined,
        material_type_ids: formData.enableVariations ? mapNamesToIds(formData.materialType, materialTypes) : undefined,
        seat_stitch_pattern_ids: formData.enableVariations ? mapNamesToIds(formData.stitchPattern, stitchPatterns) : undefined,
        item_type_ids: formData.enableVariations ? mapNamesToIds(formData.seatItemType, seatItemTypes) : undefined,
        seat_style_ids: formData.enableVariations ? mapNamesToIds(formData.seatStyle, seatStyles) : undefined,
        color_ids: formData.enableVariations ? mapNamesToIds(formData.color, colors) : undefined,
        
        // Price tiers - new schema
        price_tiers: formData.enablePriceTiers && calculatedPriceTiers.length > 0 ? calculatedPriceTiers.map(tier => ({
          id: tier.id,
          price_adjustment: VariantsCalculation.getFinalPrice(tier),
          is_active: true
        })) : undefined,
      };

      // Debug: Log the data being sent
      console.log('🔄 Products-2 data being sent to new productApi:', {
        ...productData,
        images: productData.images?.map(file => `File(${file.name}, ${file.size} bytes)`),
        image_data: productData.image_data,
        existing_images: (productData as any).existing_images,
      });
 
      
   
      
      // Check each image individually
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((file, index) => {
      
        });
      } else {
        console.log('❌ No images in productData.images');
      }

        // Call the new productApi to update product
        await productApi.updateProduct(parseInt(id), productData);
        
        setSuccess('Product updated successfully!');
        
        
        setTimeout(() => {
          handleBackToList();
        }, 1500);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderMultiSelectField = (
    field: keyof ProductPage2Form,
    label: string,
    options: { id: number; name: string; price: number }[],
    required = true
  ) => {
    // Safety check to ensure options is an array
    const safeOptions = Array.isArray(options) ? options : [];
    
    // Fields that don't have prices
    const fieldsWithoutPrices = ['seatType', 'seatItemType', 'seatStyle'];
    const showPrice = !fieldsWithoutPrices.includes(field);
    
    // Debug logging for seat styles specifically
    if (field === 'seatStyle') {
      console.log(`Rendering ${label} field:`, {
        field,
        options,
        safeOptions,
        optionsLength: options?.length,
        safeOptionsLength: safeOptions.length
      });
    }
    
    return (
      <FormControl fullWidth required={required} error={!!errors[field]}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={formData[field] as string[]}
          onChange={handleMultiSelectChange(field)}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Box key={value} sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1, 
                  fontSize: '0.75rem' 
                }}>
                  {value}
                </Box>
              ))}
            </Box>
          )}
        >
          {/* None option */}
          <MenuItem key="none" value="None">
            <Checkbox checked={(formData[field] as string[]).indexOf('None') > -1} />
            <ListItemText 
              primary="None"
              sx={{ fontStyle: 'italic', color: 'text.secondary' }}
            />
          </MenuItem>
          
          {/* Regular options */}
          {safeOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              <Checkbox checked={(formData[field] as string[]).indexOf(option.name) > -1} />
              <ListItemText 
                primary={showPrice ? `${option.name} (+$${option.price || 0})` : option.name}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Product">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
              sx={{ color: 'text.secondary' }}
            >
              Back 
            </Button>
           
          </Box>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* 🟢 First Half - Product Fields */}
              <Box>
                {/* Header Row with Product Information and Switches */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 0 }
                }}>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    Product Information
                  </Typography>
                  
                  {/* Right Side - Status Switches in same row */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    '& .MuiFormControlLabel-root': {
                      margin: 0
                    }
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.showOnSpecialShop}
                          onChange={handleSwitchChange('showOnSpecialShop')}
                          color="primary"
                        />
                      }
                      label="Shop Special"
                      labelPlacement="start"
                      sx={{ 
                        gap: 1,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActive}
                          onChange={handleSwitchChange('isActive')}
                          color="error"
                        />
                      }
                      label="Active"
                      labelPlacement="start"
                      sx={{ 
                        gap: 1,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isCustomize3dProduct}
                          onChange={handleSwitchChange('isCustomize3dProduct')}
                          color="primary"
                        />
                      }
                      label="Enable 3D Customization"
                      labelPlacement="start"
                      sx={{ 
                        gap: 1,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* Product Name */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    placeholder="Enter product name"
                    error={!!errors.name}
                    helperText={errors.name}
                  />
               

                {/* Category */}
               
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={handleChange('category')}
                      label="Category"
                    >
                      {Array.isArray(categories) ? categories.map((category) => (
                        <MenuItem key={category.name} value={category.name}>
                          {category.name}
                        </MenuItem>
                      )) : []}
                    </Select>
                  </FormControl>
             
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    required
                    placeholder="Enter product description"
                    multiline
                     minRows={1}
                    maxRows={4}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Box>

                {/* Base Price and Stock */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="In Shop Price"
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, basePrice: value }));
                      
                      // Recalculate price tiers if enabled
                      if (formData.enablePriceTiers && calculatedPriceTiers.length > 0) {
                        const newCalculatedTiers = VariantsCalculation.calculatePriceTiers(value, priceTiers, priceOverrides);
                        setCalculatedPriceTiers(newCalculatedTiers);
                        
                        // Price adjustments are now handled directly in handleSubmit
                      }
                    }}
                    required
                    placeholder="Enter base price"
                    InputProps={{
                      startAdornment: '$',
                    }}
                    error={!!errors.basePrice}
                    helperText={errors.basePrice}
                  />

                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, stock: value }));
                    }}
                    required
                    placeholder="Enter stock quantity"
                    error={!!errors.stock}
                    helperText={errors.stock}
                  />
                </Box>

                {/* Product Images */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                    Product Images
                  </Typography>
                  
                  
                  {/* Existing Images Preview */}
                  {existingImages.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Existing Images:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(8, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(16, 1fr)' }, gap: 0, mb: 2 }}>
                        {existingImages.map((imageData, index) => (
                          <Box key={`existing-${imageData.id}`} sx={{ position: 'relative', width: 60, height: 60 }}>
                            <img
                              src={imageData.url.startsWith('http') ? imageData.url : `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${imageData.url}`}
                              alt={`Existing ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                aspectRatio: '1/1',
                                objectFit: 'cover',
                                borderRadius: 4,
                                border: '1px solid #e0e0e0',
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 8px;">Error</div>';
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                bgcolor: 'primary.main',
                                color: 'white',
                                px: 0.5,
                                py: 0.25,
                                borderRadius: 0.5,
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                zIndex: 5,
                              }}
                            >
                              {index === 0 ? 'PRIMARY' : 'EXISTING'}
                            </Box>
                            <IconButton
                              onClick={() => removeExistingImage(index)}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                width: 18,
                                height: 18,
                                minWidth: 18,
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease-in-out',
                                zIndex: 10,
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 12 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* New Images Preview */}
                  {formData.images.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                        New Images:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(8, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(16, 1fr)' }, gap: 0, mb: 2 }}>
                      {formData.images.map((image, index) => (
                        <Box key={index} sx={{ position: 'relative', width: 60, height: 60 }}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              aspectRatio: '1/1',
                              objectFit: 'cover',
                              borderRadius: 4,
                              border: '1px solid #e0e0e0',
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 8px;">Error</div>';
                            }}
                          />
                          <IconButton
                            onClick={() => removeImage(index)}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(0, 0, 0, 0.6)',
                              color: 'white',
                              width: 18,
                              height: 18,
                              minWidth: 18,
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.8)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out',
                              zIndex: 10,
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Box>
                      ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Upload Button */}
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 1 }}
                      >
                        Upload Images
                      </Button>
                    </label>
                    {errors.images && (
                      <Typography variant="caption" color="error" display="block">
                        {errors.images}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block">
                      Supported formats: JPEG, PNG, GIF (Max 2MB each)
                    </Typography>
                  </Box>
                </Box>
                
                {/* 3D Customization Fields - Show when 3D is enabled */}
                {formData.isCustomize3dProduct && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                      3D Model Configuration
                    </Typography>
                    <Box sx={{ p: 3, border: '2px dashed #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                      {/* GLB File Upload */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          3D Model File (GLB) *
                        </Typography>
                        <input
                          accept=".glb"
                          style={{ display: 'none' }}
                          id="glb-file-input"
                          type="file"
                          onChange={handleGlbFileChange}
                        />
                        <label htmlFor="glb-file-input">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            sx={{ mb: 1 }}
                          >
                            Upload GLB File
                          </Button>
                        </label>
                        
                        {/* Show current file if editing and no new file selected */}
                        {currentGlbPath && !glbFile && (
                          <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.primary">
                              Current file: {currentGlbPath.split('/').pop()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Upload a new file to replace it
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Show newly selected file */}
                        {glbFile && (
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Selected: {glbFile.name} ({(glbFile.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setGlbFile(null);
                                setGlbError('');
                              }}
                              sx={{ ml: 'auto' }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                        
                        {glbError && (
                          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {glbError}
                          </Typography>
                        )}
                        
                        {errors.glbFile && (
                          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.glbFile}
                          </Typography>
                        )}
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Upload a GLB 3D model file (max 20MB). This file will be used for customer 3D customization.
                        </Typography>
                      </Box>

                      {/* Customizable Meshes */}
                      {/* <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Customizable Mesh Names (Optional)
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={customizableMeshes}
                          onChange={(e) => setCustomizableMeshes(e.target.value)}
                          placeholder="seat_cushion, backrest, armrest_left, armrest_right"
                          helperText="Enter comma-separated mesh names from your 3D model that customers can customize. Leave empty to allow all meshes to be customizable."
                          sx={{ bgcolor: 'white' }}
                        />
                      </Box> */}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* 🔵 Second Half - Variation Fields */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 0 }
                }}>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    Seat Configuration & Materials
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.enableVariations}
                        onChange={handleVariationsToggle}
                        color="primary"
                      />
                    }
                    label="Enable Variations"
                    sx={{ 
                      gap: 1,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {formData.enableVariations && (
                  <>
                    {/* Seat Configuration Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                        Seat Configuration
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                        {renderMultiSelectField('seatType', 'Seat Type', seatTypes)}
                        {renderMultiSelectField('armType', 'Arm Type', armTypes)}
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                        {renderMultiSelectField('lumbarType', 'Lumbar Type', lumbarTypes)}
                        {renderMultiSelectField('reclineType', 'Recline Type', reclineTypes)}
                      </Box>
                    </Box>

                    {/* Materials & Features Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                        Materials & Features
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                        {renderMultiSelectField('materialType', 'Material Type', materialTypes)}
                        {renderMultiSelectField('heatOption', 'Heat Option', heatOptions)}
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                        {renderMultiSelectField('stitchPattern', 'Stitching Pattern', stitchPatterns)}
                        {renderMultiSelectField('seatItemType', 'Seat Item Type', seatItemTypes)}
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                        {renderMultiSelectField('seatStyle', 'Seat Style', seatStyles)}
                        {renderMultiSelectField('color', 'Color', colors)}
                      </Box>
                    </Box>

                    {/* 🚗 Vehicle Information Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}>
                        Vehicle Figments
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Vehicle Make</InputLabel>
                          <Select
                            value={formData.vehicleMake}
                            onChange={handleVehicleMakeChange}
                            label="Vehicle Make"
                          >
                            <MenuItem value="">
                              <em>Select Make</em>
                            </MenuItem>
                            {vehicleMakes.map((make) => (
                              <MenuItem key={make.id} value={make.id}>
                                {make.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <FormControl fullWidth disabled={!formData.vehicleMake}>
                          <InputLabel>Vehicle Model</InputLabel>
                          <Select
                            value={formData.vehicleModel}
                            onChange={handleVehicleModelChange}
                            label="Vehicle Model"
                          >
                            <MenuItem value="">
                              <em>Select Model</em>
                            </MenuItem>
                            {vehicleModels.map((model) => (
                              <MenuItem key={model.id} value={model.id}>
                                {model.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <FormControl fullWidth disabled={!formData.vehicleModel}>
                          <InputLabel>Vehicle Trim</InputLabel>
                          <Select
                            value={formData.vehicleTrim}
                            onChange={handleVehicleTrimChange}
                            label="Vehicle Trim"
                          >
                            <MenuItem value="">
                              <em>Select Trim</em>
                            </MenuItem>
                            {vehicleTrims.map((trim) => (
                              <MenuItem key={trim.id} value={trim.id}>
                                {trim.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>

              {/* 💰 Price Tiers Section */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 0 }
                }}>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    Price Tiers
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.enablePriceTiers}
                          onChange={handlePriceTiersToggle}
                          color="primary"
                        />
                      }
                      label="Enable Price Tiers"
                    />
                    {formData.enablePriceTiers && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleResetPriceTiers}
                        sx={{ ml: 1 }}
                      >
                        Reset
                      </Button>
                    )}
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {formData.enablePriceTiers && calculatedPriceTiers.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      Price Tiers
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Base price: ${VariantsCalculation.formatPrice(formData.basePrice)}
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
                                value={
                                  priceOverrideInputs[tier.id.toString()] !== undefined
                                    ? priceOverrideInputs[tier.id.toString()]
                                    : tier.is_overridden && tier.override_price !== undefined
                                    ? tier.override_price.toFixed(2)
                                    : tier.calculated_price !== undefined
                                    ? tier.calculated_price.toFixed(2)
                                    : ''
                                }
                                onChange={(e) => {
                                  handlePriceOverrideInputChange(tier.id, e.target.value);
                                }}
                                onBlur={() => {
                                  handlePriceOverrideBlur(tier.id);
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
                                  ${VariantsCalculation.formatPrice(tier.is_overridden ? tier.override_price : tier.calculated_price)}
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

              {/* Actions */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="outlined"
                  onClick={handleBackToList}
                  disabled={loading}
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
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default EditProduct2Page;