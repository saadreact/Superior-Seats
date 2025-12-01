'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from '@/components/Header';
import HeroSectionCommon from './common/HeroSectionaCommon';
import Footer from './Footer';
import styles from './CustomizedSeat.module.css';
import { useSelectedItem, ProductVariations, VariationOption as ContextVariationOption } from '@/contexts/SelectedItemContext';
import type { VariationOption as ApiVariationOption } from '@/services/materialApi';
import { CustomizedSeatApi, Product } from '@/services/CustomizedSeatApi';
import { materialApi, Product3DConfig } from '@/services/materialApi';
import { apiService } from '@/utils/api';

const ModelViewer = dynamic(() => import('@/components/model/Main'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: '100%',
        minHeight: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <Typography variant="body1">Loading seat designer...</Typography>
    </Box>
  ),
});
// Union type for variation options coming from either legacy context or new API
type AnyVariationOption = ContextVariationOption | ApiVariationOption;

interface CustomizeYourSeatProps {
  showHeader?: boolean;
  showHero?: boolean;
  showPricing?: boolean;
  showAbout?: boolean;
  showTestimonials?: boolean;
  productId?: string; // NEW: Accept productId from URL parameter
}

const CustomizedSeat: React.FC<CustomizeYourSeatProps> = ({
  showHeader = true,
  showHero = true,
  showPricing = false,
  showAbout = true,
  showTestimonials = true,
  productId // NEW: Accept productId prop
}) => {
  const { selectedItem } = useSelectedItem();

  // NEW: State for 3D config from new API
  const [product3DConfig, setProduct3DConfig] = useState<Product3DConfig | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  // LEGACY: Keep old states for backward compatibility during transition
  const [productData, setProductData] = useState<Product | null>(null);
  const [variations, setVariations] = useState<ProductVariations | null>(null);

  // Removed localStorage functionality - product ID is now only managed through context

  // Fetch product data when productId prop or selectedItem changes
  useEffect(() => {
    const fetchProductData = async () => {
      // Priority 1: Use productId prop if provided (from URL)
      // Priority 2: Fall back to selectedItem from context
      const idToFetch = productId || selectedItem?.id;

      if (idToFetch) {
        try {
          setProductLoading(true);
          setProductError(null);

          // NEW: Fetch complete 3D configuration from new API
          const config = await materialApi.getProduct3DConfig(idToFetch);
          setProduct3DConfig(config);


          // LEGACY: Also fetch old format for backward compatibility
          const product = await CustomizedSeatApi.getProductById(Number(idToFetch));
          setProductData(product);



          // Use actual API variation data directly (cast to match context interface)
          const processedVariations = {
            vehicle_trim: product.vehicle_trim ? [{
              id: product.vehicle_trim.id,
              name: product.vehicle_trim.name,
              price: 0,
              is_active: product.vehicle_trim.is_active
            }] : [],
            colors: (product.colors || []) as any[],
            material_types: (product.material_types || []) as any[],
            heat_options: (product.heat_options || []) as any[],
            lumbar_types: (product.lumbar_types || []) as any[],
            recline_types: (product.recline_types || []) as any[],
            seat_stitch_patterns: (product.seat_stitch_patterns || []) as any[],
            arm_types: (product.arm_types || []) as any[],
            seat_types: (product.seat_types || []) as any[],
            seat_styles: (product.seat_styles || []) as any[],
            item_types: (product.item_types || []) as any[]
          };

          setVariations(processedVariations);
        } catch (error: any) {
          console.error('❌ CustomizedSeat - Error fetching 3D config:', error);
          setProductError(error.message || 'Failed to load 3D customization data');
        } finally {
          setProductLoading(false);
        }
      } else {
        setProduct3DConfig(null);
        setProductData(null);
        setVariations(null);
      }
    };

    fetchProductData();
  }, [productId, selectedItem]); // NEW: Now depends on both productId and selectedItem

  // Fetch vehicle trim data when product loads
  useEffect(() => {
    const fetchVehicleTrimData = async () => {
      if (productData && productData.vehicle_trim_id) {
        try {
          setVehicleTrimLoading(true);

          const trimData = await apiService.getVehicleTrimById(productData.vehicle_trim_id);
          setVehicleTrimData(trimData);

          // Set the selected values from the API response
          if (trimData) {
            setSelectedMake(trimData.model?.make?.id?.toString() || '');
            setSelectedModel(trimData.model?.id?.toString() || '');
            setSelectedTrim(trimData.id?.toString() || '');

          }
        } catch (error) {
          console.error('❌ CustomizedSeat - Error fetching vehicle trim data:', error);
        } finally {
          setVehicleTrimLoading(false);
        }
      } else {
        // Reset vehicle data when no product or no vehicle_trim_id
        setVehicleTrimData(null);
        setSelectedMake('');
        setSelectedModel('');
        setSelectedTrim('');
      }
    };

    fetchVehicleTrimData();
  }, [productData]);

  // State for vehicle information
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');

  // State for vehicle trim data from API
  const [vehicleTrimData, setVehicleTrimData] = useState<any>(null);
  const [vehicleTrimLoading, setVehicleTrimLoading] = useState(false);

  // Original-style dropdown selection state
  const [selectedRecline, setSelectedRecline] = useState<string>('');
  const [selectedLumber, setSelectedLumber] = useState<string>('');
  const [selectedHeatingCooling, setSelectedHeatingCooling] = useState<string>('');
  const [selectedSeatType, setSelectedSeatType] = useState<string>('');
  const [selectedItemType, setSelectedItemType] = useState<string>('');
  const [selectedSeatStyle, setSelectedSeatStyle] = useState<string>('');
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('');
  const [selectedIncludedArm, setSelectedIncludedArm] = useState<string>('');
  const [selectedTexture, setSelectedTexture] = useState<string>(''); // material_types mirror
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStitching, setSelectedStitching] = useState<string>('');

  // State to track 3D customization selections (will be updated via callback from ModelViewer)
  const [current3DSelections, setCurrent3DSelections] = useState<{
    materialType?: { id: string; name: string; price?: number };
    color?: { id: string; name: string; price?: number };
    pattern?: { id: string; name: string; price?: number };
    stitchColor?: { id: string; name: string; price?: number };
  }>({});

  const formatLabel = (label: string) =>
    label
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const renderProductDetails = () => {
    if (productLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      );
    }

    if (productError) {
      return <MuiAlert severity="error">{productError}</MuiAlert>;
    }

    if (!productData) {
      return (
        <Typography variant="body2" color="text.secondary">
          Select a product to see its details.
        </Typography>
      );
    }

    const exclusionPhrases = [
      'both adjustable arms',
      'heat cool',
      'perf inserts for cooling',
      'power lumbar',
      '6 motor back relaxer',
      'air switch and bracket',
      'adapter plate tbd',
    ];

    const descriptionSentences =
      typeof productData.description === 'string'
        ? productData.description
          .split(/[.\n]/)
          .map((sentence: string) => sentence.trim())
          .filter((s: string) => s.length > 0)
          .filter(
            (s: string) =>
              !exclusionPhrases.some((p) =>
                s.toLowerCase().includes(p)
              )
          )
        : [];

    const productSku = (productData as any)?.sku;

    return (
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {productData.name}
          </Typography>
          {productSku && (
            <Typography variant="body2" color="text.secondary">
              SKU: {productSku}
            </Typography>
          )}
          {productData.category?.name && (
            <Typography variant="body2" color="text.secondary">
              Category: {productData.category.name}
            </Typography>
          )}
        </Box>
        {productData.price && (
          <Typography variant="subtitle1">
            Base Price: {typeof productData.price === 'string' ? productData.price : `$${productData.price}`}
          </Typography>
        )}
        {descriptionSentences.length ? (
          <Stack spacing={0.75}>
            {descriptionSentences.map((sentence: string, index: number) => (
              <Typography key={`${sentence}-${index}`} variant="body2" color="text.secondary">
                • {sentence}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No description available.
          </Typography>
        )}
      </Stack>
    );
  };

  const renderVehicleTrim = () => {
    if (vehicleTrimLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      );
    }

    if (!vehicleTrimData) {
      return null;
    }

    return (
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={600}>
          {vehicleTrimData.name || 'Vehicle Trim'}
        </Typography>
        {vehicleTrimData?.model?.make?.name && (
          <Typography variant="body2" color="text.secondary">
            Make: {vehicleTrimData.model.make.name}
          </Typography>
        )}
        {vehicleTrimData?.model?.name && (
          <Typography variant="body2" color="text.secondary">
            Model: {vehicleTrimData.model.name}
          </Typography>
        )}
        {vehicleTrimData?.year && (
          <Typography variant="body2" color="text.secondary">
            Year: {vehicleTrimData.year}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Trim ID: {vehicleTrimData.id}
        </Typography>
      </Stack>
    );
  };

  // Calculate price breakdown
  const calculatePriceBreakdown = () => {
    const breakdown: Array<{ label: string; price: number; option?: AnyVariationOption }> = [];
    const basePrice = productData?.price ? parseFloat(String(productData.price)) : 0;

    // Get 3D customization prices from product3DConfig
    if (product3DConfig && current3DSelections) {
      // Material Type (from 3D customization)
      if (current3DSelections.materialType && current3DSelections.materialType.price) {
        breakdown.push({
          label: 'Material Type',
          price: current3DSelections.materialType.price,
          option: {
            id: 0,
            name: current3DSelections.materialType.name,
            price_adjustment: String(current3DSelections.materialType.price)
          } as AnyVariationOption
        });
      }

      // Color (from 3D customization)
      if (current3DSelections.color && current3DSelections.color.price) {
        breakdown.push({
          label: 'Color',
          price: current3DSelections.color.price,
          option: {
            id: 0,
            name: current3DSelections.color.name,
            price_adjustment: String(current3DSelections.color.price)
          } as AnyVariationOption
        });
      }

      // Pattern (from 3D customization)
      if (current3DSelections.pattern && current3DSelections.pattern.price) {
        breakdown.push({
          label: 'Stitch Pattern',
          price: current3DSelections.pattern.price,
          option: {
            id: 0,
            name: current3DSelections.pattern.name,
            price_adjustment: String(current3DSelections.pattern.price)
          } as AnyVariationOption
        });
      }

      // Stitch Color (from 3D customization) - Show even if price is 0
      if (current3DSelections.stitchColor) {
        breakdown.push({
          label: 'Stitch Color',
          price: current3DSelections.stitchColor.price || 0,
          option: {
            id: 0,
            name: current3DSelections.stitchColor.name,
            price_adjustment: String(current3DSelections.stitchColor.price || 0)
          } as AnyVariationOption
        });
      }
    }

    // Helper to safely read price from either price_adjustment (string) or price (number)
    const getOptionPrice = (option?: AnyVariationOption | undefined): number => {
      if (!option) return 0;
      const anyOpt: any = option as any;
      if (anyOpt.price_adjustment !== undefined && anyOpt.price_adjustment !== null) {
        const v = parseFloat(String(anyOpt.price_adjustment));
        if (!Number.isNaN(v)) return v;
      }
      if ((option as any).price !== undefined && (option as any).price !== null) {
        const v = parseFloat(String((option as any).price));
        if (!Number.isNaN(v)) return v;
      }
      return 0;
    };

    // Recline Type
    if (selectedRecline && variations?.recline_types) {
      const option = variations.recline_types.find((opt: AnyVariationOption) => String(opt.id) === selectedRecline);
      const optPrice = getOptionPrice(option);
      if (option && optPrice !== 0) {
        breakdown.push({
          label: 'Recline Type',
          price: optPrice,
          option
        });
      }
    }

    // Lumbar Type
    if (selectedLumber && variations?.lumbar_types) {
      const option = variations.lumbar_types.find((opt: AnyVariationOption) => String(opt.id) === selectedLumber);
      const optPrice = getOptionPrice(option);
      if (option && optPrice !== 0) {
        breakdown.push({
          label: 'Lumbar Type',
          price: optPrice,
          option
        });
      }
    }

    // Heat/Cool Option
    if (selectedHeatingCooling && variations?.heat_options) {
      const option = variations.heat_options.find((opt: AnyVariationOption) => String(opt.id) === selectedHeatingCooling);
      const optPrice = getOptionPrice(option);
      if (option && optPrice !== 0) {
        breakdown.push({
          label: 'Heat/Cool Option',
          price: optPrice,
          option
        });
      }
    }

    // Seat Type
    if (selectedSeatType && variations?.seat_types) {
      const option = variations.seat_types.find((opt: AnyVariationOption) => String(opt.id) === selectedSeatType);
      const optPrice = getOptionPrice(option);
      if (option && optPrice !== 0) {
        breakdown.push({
          label: 'Seat Type',
          price: optPrice,
          option
        });
      }
    }

    // Item Type
    if (selectedItemType && variations?.item_types) {
      const option = variations.item_types.find((opt: AnyVariationOption) => String(opt.id) === selectedItemType);
      const optPrice = getOptionPrice(option);
      if (option && optPrice !== 0) {
        breakdown.push({
          label: 'Item Type',
          price: optPrice,
          option
        });
      }
    }

    // Seat Style
    if (selectedSeatStyle && variations?.seat_styles) {
      const option = variations.seat_styles.find((opt: AnyVariationOption) => String(opt.id) === selectedSeatStyle);
      const optPrice = getOptionPrice(option);
      if (option && optPrice !== 0) {
        breakdown.push({
          label: 'Seat Style',
          price: optPrice,
          option
        });
      }
    }

    // Included Arm
    if (selectedIncludedArm && variations?.arm_types) {
      const option = variations.arm_types.find((opt: AnyVariationOption) => String(opt.id) === selectedIncludedArm);
      const optPrice = getOptionPrice(option);
      if (option && optPrice !== 0) {
        breakdown.push({
          label: 'Included Arm',
          price: optPrice,
          option
        });
      }
    }

    const total = basePrice + breakdown.reduce((sum, item) => sum + item.price, 0);

    return { basePrice, breakdown, total };
  };

  const renderVariations = () => {
    const dropdown = (
      label: string,
      value: string,
      onChange: (v: string) => void,
      options?: AnyVariationOption[]
    ) => (
      <Box>
        <FormControl fullWidth size="small" disabled={!options || options.length === 0}>
          <InputLabel>{label}</InputLabel>
          <Select label={label} value={value} onChange={(e) => onChange(String(e.target.value))}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {(options || []).map((opt) => (
              <MenuItem key={opt.id} value={String(opt.id)}>
                {opt.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );

    const priceData = calculatePriceBreakdown();

    return (
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Left Side - Dropdowns in 2 columns */}
        <Box sx={{ flex: { xs: '1', md: '1' }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {dropdown('Recline Type', selectedRecline, setSelectedRecline, variations?.recline_types)}
          {dropdown('Lumbar Type', selectedLumber, setSelectedLumber, variations?.lumbar_types)}
          {dropdown('Heat/Cool Option', selectedHeatingCooling, setSelectedHeatingCooling, variations?.heat_options)}
          {dropdown('Seat Type', selectedSeatType, setSelectedSeatType, variations?.seat_types)}
          {dropdown('Item Type', selectedItemType, setSelectedItemType, variations?.item_types)}
          {dropdown('Seat Style', selectedSeatStyle, setSelectedSeatStyle, variations?.seat_styles)}
          {dropdown('Included Arm', selectedIncludedArm, setSelectedIncludedArm, variations?.arm_types)}
        </Box>

        {/* Right Side - Price Breakdown */}
        <Box sx={{ flex: { xs: '1', md: '0 0 300px' }, minWidth: { xs: '100%', md: 300 } }}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
              Price Breakdown
            </Typography>
            
            <Stack spacing={1.5}>
              {/* Base Price */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Base Price
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ${priceData.basePrice.toFixed(2)}
                </Typography>
              </Box>

              {/* Customization Prices */}
              {priceData.breakdown.length > 0 && (
                <>
                  <Divider />
                  {priceData.breakdown.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.option?.name || item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={500} color={item.price >= 0 ? 'text.primary' : 'error.main'}>
                        {item.price >= 0 ? '+' : ''}${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}

              {/* Total */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  ${priceData.total.toFixed(2)}
                </Typography>
              </Box>
            </Stack>

            {/* Submit Design Button */}
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                onClick={() => {
                  // TODO: Add to cart functionality
                  // For now, just show an alert
                  alert('Add to cart functionality will be implemented next. Total: $' + priceData.total.toFixed(2));
                }}
                sx={{
                  py: 1.5,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    );
  };

  return (
    <Box className={styles.mainContainer} sx={{ mt: { xs: 8, md: 10 } }}>
      {showHeader && <Header />}
      {/* Keep hero minimal; spacing handled via mt above */}
      <Container maxWidth="xl" sx={{ mb: 2 }}>
      </Container>

      <Container maxWidth="xl" className={styles.configContainer} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: { xs: 520, md: 'calc(100vh - 160px)' },
                maxHeight: 'calc(100vh - 140px)',
                minHeight: 480,
                borderRadius: 2,
                bgcolor: '#fff',
              }}
              className="modelScope"
            >
              <ModelViewer 
                product3DConfig={product3DConfig}
                onCustomizationChange={(selections: any) => {
                  // Update 3D customization selections for price calculation
                  setCurrent3DSelections(selections);
                }}
                onSubmit={() => {}}
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Customize Options
                </Typography>
                {renderVariations()}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </Box>
  );
};

export default CustomizedSeat;
