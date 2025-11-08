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
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from '@/components/Header';
import HeroSectionCommon from './common/HeroSectionaCommon';
import Footer from './Footer';
import styles from './CustomizedSeat.module.css';
import { useSelectedItem, ProductVariations, VariationOption } from '@/contexts/SelectedItemContext';
import { CustomizedSeatApi, Product } from '@/services/CustomizedSeatApi';
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
interface CustomizeYourSeatProps {
  showHeader?: boolean;
  showHero?: boolean;
  showPricing?: boolean;
  showAbout?: boolean;
  showTestimonials?: boolean;
}

const CustomizedSeat: React.FC<CustomizeYourSeatProps> = ({
  showHeader = true,
  showHero = true,
  showPricing = false,
  showAbout = true,
  showTestimonials = true
}) => {
  const { selectedItem } = useSelectedItem();

  // State for product data fetched from API
  const [productData, setProductData] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  // Variation data state
  const [variations, setVariations] = useState<ProductVariations | null>(null);

  // Removed localStorage functionality - product ID is now only managed through context

  // Fetch product data when selectedItem ID changes
  useEffect(() => {
    // console.log('🔄 CustomizedSeat - useEffect triggered, selectedItem:', selectedItem);
    
    const fetchProductData = async () => {
      if (selectedItem && selectedItem.id) {
        try {
          setProductLoading(true);
          setProductError(null);
          console.log('🔄 CustomizedSeat - Fetching product data for ID:', selectedItem.id);
          
          const product = await CustomizedSeatApi.getProductById(selectedItem.id);
          setProductData(product);
          
          // Debug: Log the images data from API
          console.log('🖼️ CustomizedSeat - Product images from API:', {
            totalImages: product.product_images?.length || 0,
            product_images: product.product_images,
            primaryImage: product.primary_image,
            currentImageIndex: 0,
            fullProduct: product
          });
          
          
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
          console.log('✅ CustomizedSeat - Product data and variations loaded successfully');
        } catch (error) {
          console.error('❌ CustomizedSeat - Error fetching product data:', error);
          setProductError('Failed to load product details');
        } finally {
          setProductLoading(false);
        }
      } else {
        console.log('🔄 CustomizedSeat - No selected item ID available');
        setProductData(null);
        setVariations(null);
      }
    };

    fetchProductData();
  }, [selectedItem]);

  // Fetch vehicle trim data when product loads
  useEffect(() => {
    const fetchVehicleTrimData = async () => {
      if (productData && productData.vehicle_trim_id) {
        try {
          setVehicleTrimLoading(true);
          console.log('🚗 CustomizedSeat - Fetching vehicle trim data for ID:', productData.vehicle_trim_id);
          
          const trimData = await apiService.getVehicleTrimById(productData.vehicle_trim_id);
          setVehicleTrimData(trimData);
          
          // Set the selected values from the API response
          if (trimData) {
            setSelectedMake(trimData.model?.make?.id?.toString() || '');
            setSelectedModel(trimData.model?.id?.toString() || '');
            setSelectedTrim(trimData.id?.toString() || '');
            
            console.log('✅ CustomizedSeat - Vehicle trim data loaded:', {
              make: trimData.model?.make?.name,
              model: trimData.model?.name,
              trim: trimData.name
            });
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

  const renderVariations = () => {
    const dropdown = (
      label: string,
      value: string,
      onChange: (v: string) => void,
      options?: VariationOption[]
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

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
        {dropdown('Material Type', selectedMaterialType, setSelectedMaterialType, variations?.material_types)}
        {dropdown('Color', selectedColor, setSelectedColor, variations?.colors)}
        {dropdown('Seat Stitch Pattern', selectedStitching, setSelectedStitching, variations?.seat_stitch_patterns)}
        {dropdown('Recline Type', selectedRecline, setSelectedRecline, variations?.recline_types)}
        {dropdown('Lumbar Type', selectedLumber, setSelectedLumber, variations?.lumbar_types)}
        {dropdown('Heat/Cool Option', selectedHeatingCooling, setSelectedHeatingCooling, variations?.heat_options)}
        {dropdown('Seat Type', selectedSeatType, setSelectedSeatType, variations?.seat_types)}
        {dropdown('Item Type', selectedItemType, setSelectedItemType, variations?.item_types)}
        {dropdown('Seat Style', selectedSeatStyle, setSelectedSeatStyle, variations?.seat_styles)}
        {dropdown('Included Arm', selectedIncludedArm, setSelectedIncludedArm, variations?.arm_types)}
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
              <ModelViewer />
              {/* Force the internal fixed submit button to live inside this container */}
              <style jsx global>{`
                .modelScope .App {
                  width: 100% !important;
                  height: 100% !important;
                  overflow: hidden !important;
                }
                .modelScope .scene-container {
                  width: 100% !important;
                  height: 100% !important;
                  position: relative !important;
                }
                /* Constrain Submit Design */
                .modelScope button[style*='position: fixed'][style*='right: 30px'] {
                  position: absolute !important;
                  right: 20px !important;
                  bottom: 20px !important;
                }
              `}</style>
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
