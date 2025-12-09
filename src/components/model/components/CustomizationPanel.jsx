import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  ButtonBase,
  Switch,
  FormControlLabel,
  Tooltip,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Backdrop,
  Fade,
  Tabs,
  Tab
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { AVAILABLE_MODELS, CUSTOMIZATION_OPTIONS } from '../config/assets';
import { COLOR_PALETTE } from '../config/colorPalette';
import { getPatternOptionsForModel } from '../utils/PatternLoader';
import { getColorsForFabric } from '../config/fabricColors';
import { SkeletonColorTile, SkeletonPatternTile, SkeletonFabricPreview } from './SkeletonLoaders';

function CustomizationPanel({
  availableMaterials, // API materials
  customizeOptions, // API customize options (stitch_patterns, seat_types, etc.)
  modelId,
  onModelIdChange,
  stitchColor, // Internal stitching (pattern stitching)
  onStitchColorChange,
  externalStitchColor, // External stitching (edges)
  onExternalStitchColorChange,
  pipingColor, // Piping color
  onPipingColorChange,
  fabricColor,
  onFabricColorChange,
  fabricType,
  onFabricTypeChange,
  meshCustomizations,
  onMeshCustomizationChange,
  patternId,
  onPatternChange,
  seatType,
  onSeatTypeChange,
  isModelUpdating = false, // Loading state from model
  onOpenTwoToneSelector
}) {
  const theme = useTheme();

  // State for managing color palette visibility and patterns
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [patternThumbnails, setPatternThumbnails] = useState({});
  const [hoveredFabric, setHoveredFabric] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [patternImagesLoaded, setPatternImagesLoaded] = useState({});
  const [hoveredColor, setHoveredColor] = useState(null);
  const [colorHoverPosition, setColorHoverPosition] = useState({ x: 0, y: 0 });
  const [failedImages, setFailedImages] = useState(new Set()); // Track which images failed to load
  const [hoveredPattern, setHoveredPattern] = useState(null);
  const [patternHoverPosition, setPatternHoverPosition] = useState({ x: 0, y: 0 });
  const [loadingImages, setLoadingImages] = useState(new Set()); // Track which images are currently loading
  const [loadedImages, setLoadedImages] = useState(new Set()); // Track which images have loaded successfully
  // Use isModelUpdating prop instead of local state for better synchronization
  const isApplyingChange = isModelUpdating;
  const [stitchingColorTab, setStitchingColorTab] = useState(0); // Tab state for stitching colors (0=Internal, 1=External, 2=Piping)
  // Default stitching section to collapsed to reduce scrolling
  const [showStitchingSection, setShowStitchingSection] = useState(false);

  // Shared color swatch sizing so Fabric + Stitching + Two-Tone popup look identical
  const colorSwatchSize = {
    width: { xs: 34, sm: 32, md: 30 },
    height: { xs: 34, sm: 32, md: 30 },
    minWidth: { xs: 34, sm: 32, md: 30 },
    minHeight: { xs: 34, sm: 32, md: 30 }
  };

  // Get text color based on background
  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  // Transform API materials into fabric type options
  const fabricTypeOptions = useMemo(() => {
    if (availableMaterials && availableMaterials.length > 0) {
      return availableMaterials.map(mat => {
        // Use static assets from public/assets/fabrics/ based on shader_id
        // Map shader_id to EXACT static file names in public/assets/fabrics/
        const shaderToFileMap = {
          'carroll-leather': 'CarrollLeather.png',
          'miami-corp-cloths': 'MiamiVinyl.png', // Uses MiamiVinyl.png (cloth-like EXPO series)
          'miami-vinyl': 'MiamiVinyl.png',
          'ultrafabrics': 'UltraLeather.png',
          'brisa-distressed': 'BrisaDistressed.png',
          'brisa': 'BrisaDistressed.png', // Alias for backwards compatibility
          'leather': 'PremiumLeather.png',
          'cloth': 'FabricCloth.png',
          'suede': 'SuedeMaterial.png',
          'vinyl': 'SyntheticVinyl.png',
          'mesh': 'BreathableMesh.png',
          'carbon': 'CarbonFiber.png'
        };
        
        // Use static asset path, not API image
        const staticFileName = shaderToFileMap[mat.shader_id] || 'PremiumLeather.png';
        const imageUrl = `/assets/fabrics/${staticFileName}`;
        
        return {
          id: mat.id.toString(), // Ensure ID is string
          name: mat.name, // Use name from API
          shader_id: mat.shader_id, // Keep shader_id for reference
          icon: mat.name.charAt(0).toUpperCase(), // Simple icon fallback
          description: mat.description || mat.name, // Use description from API
          image: imageUrl // Always use static asset
        };
      });
    }

    // Fallback to hardcoded options - EXACT file names from public/assets/fabrics/
    console.log('⚠️ Using fallback fabric types');
    return [
      // Main commercial fabric types with specific color palettes
      { id: 'carroll-leather', name: 'Carroll Leather', icon: 'CL', description: 'Authentic premium leather collections', image: '/assets/fabrics/CarrollLeather.png' },
      { id: 'miami-vinyl', name: 'Miami Vinyls', icon: 'MV', description: 'Premium marine-grade vinyl', image: '/assets/fabrics/MiamiVinyl.png' },
      { id: 'ultrafabrics', name: 'Ultrafabrics', icon: 'UL', description: 'High-performance synthetic leather', image: '/assets/fabrics/UltraLeather.png' },
      { id: 'brisa-distressed', name: 'Brisa Distressed', icon: 'BD', description: 'Weathered distressed leather look', image: '/assets/fabrics/BrisaDistressed.png' },
      // Generic fabric types
      { id: 'leather', name: 'Premium Leather', icon: 'L', description: 'Luxury leather with natural texture', image: '/assets/fabrics/PremiumLeather.png' },
      { id: 'cloth', name: 'Fabric Cloth', icon: 'F', description: 'Soft woven fabric material', image: '/assets/fabrics/FabricCloth.png' },
      { id: 'suede', name: 'Suede Material', icon: 'S', description: 'Soft brushed suede finish', image: '/assets/fabrics/SuedeMaterial.png' },
      { id: 'vinyl', name: 'Synthetic Vinyl', icon: 'V', description: 'Durable synthetic material', image: '/assets/fabrics/SyntheticVinyl.png' },
      { id: 'mesh', name: 'Breathable Mesh', icon: 'M', description: 'Ventilated mesh fabric', image: '/assets/fabrics/BreathableMesh.png' },
      { id: 'carbon', name: 'Carbon Fiber', icon: 'C', description: 'High-tech carbon fiber weave', image: '/assets/fabrics/CarbonFiber.png' },
    ];
  }, [availableMaterials]);

  // Get available colors based on fabric type - keep full color data for images and prices
  const availableFabricColors = useMemo(() => {
    // 1. Try to find colors from API data first
    if (availableMaterials && availableMaterials.length > 0) {
      const selectedMaterial = availableMaterials.find(m => m.id.toString() === fabricType);
      if (selectedMaterial && selectedMaterial.colors) {
        // Return full color data including image, price, price_tiers, etc.
        return selectedMaterial.colors.map(c => ({
          id: c.id,
          name: c.name,
          hex: c.hex_code,
          image: c.image, // Full URL from Laravel (Storage::url)
          price: c.price, // Direct price from API
          price_tiers: c.price_tiers || [],
          collection_name: c.collection_name
        }));
      }
    }

    // 2. Fallback to existing logic - convert to same format
    const specificColors = getColorsForFabric(fabricType);
    if (specificColors.length > 0) {
      return specificColors.map(c => ({
        id: null,
        name: c.name,
        hex: c.hex,
        image: null,
        price_tiers: [],
        collection_name: null
      }));
    }

    // Fall back to general color palette for other fabric types
    return Object.values(COLOR_PALETTE).flat().map(c => ({
      id: null,
      name: c.name,
      hex: c.hex,
      image: null,
      price_tiers: [],
      collection_name: null
    }));
  }, [fabricType, availableMaterials]);


  // Load available patterns from API or fallback to static
  useEffect(() => {
    let patterns = [];
    let thumbnails = {};

    // Priority 1: Use API stitch_patterns if available (filter to Model 1 only)
    if (customizeOptions?.stitch_patterns && customizeOptions.stitch_patterns.length > 0) {
      // Filter to only show Model 1 patterns (static_pattern_id starts with "1-")
      const model1Patterns = customizeOptions.stitch_patterns.filter(p => 
        p.static_pattern_id && p.static_pattern_id.startsWith('1-')
      );
      patterns = model1Patterns.map(pattern => {
        // Use static assets from public/assets/patterns/ based on static_pattern_id
        // static_pattern_id format: "1-2" maps to /assets/patterns/1/02-preview.jpg
        let imageUrl = null;
        if (pattern.static_pattern_id) {
          const [modelId, patternNum] = pattern.static_pattern_id.split('-');
          // Use preview image if available, otherwise use main pattern image
          // Pattern files use zero-padded format: 1.jpg, 02.jpg, 03.jpg, etc.
          if (patternNum === '1') {
            imageUrl = `/assets/patterns/${modelId}/1-preview.jpg`;
          } else {
            // Zero-pad pattern numbers 2-6: "2" -> "02", "3" -> "03", etc.
            const paddedPatternNum = patternNum.padStart(2, '0');
            imageUrl = `/assets/patterns/${modelId}/${paddedPatternNum}-preview.jpg`;
          }
        }

        // Use static_pattern_id for 3D rendering, fallback to API id if not set
        const patternIdFor3D = pattern.static_pattern_id || pattern.id.toString();

        return {
          id: patternIdFor3D, // Use static_pattern_id for 3D rendering
          apiId: pattern.id.toString(), // Keep API ID for reference
          name: pattern.name, // Use name from API
          description: pattern.description || pattern.name, // Use description from API
          path: null, // Will be constructed from static_pattern_id in Model3D
          thumbnail: imageUrl, // Use static asset for UI preview
          image: imageUrl, // Use static asset
          stitch_colors: pattern.stitch_colors || [],
          price: pattern.price, // Direct price from API
          price_adjustment: pattern.price_adjustment || 0 // Price adjustment from pivot
        };
      });

      // Add default "None" pattern at the beginning
      patterns.unshift({
        id: 'default',
        apiId: null,
        name: 'None',
        description: 'No pattern',
        path: null,
        thumbnail: null,
        image: null,
        stitch_colors: []
      });

      // Create thumbnails object
      patterns.forEach(pattern => {
        if (pattern.thumbnail) {
          thumbnails[pattern.id] = pattern.thumbnail;
        }
      });
    } else {
      // Fallback: Use static patterns from PatternLoader
      console.log('⚠️ Using fallback static patterns');
      patterns = getPatternOptionsForModel(modelId);
      patterns.forEach(pattern => {
        if (pattern.path) {
          thumbnails[pattern.id] = pattern.path;
        }
      });
    }

    setAvailablePatterns(patterns);
    setPatternThumbnails(thumbnails);

    // Reset pattern selection if current pattern doesn't exist
    const patternIdStr = patternId?.toString();
    const currentPatternExists = patterns.some(p => 
      p.id === patternId || 
      p.id.toString() === patternIdStr ||
      String(p.id) === String(patternId)
    );
    if (!currentPatternExists && patterns.length > 0) {
      onPatternChange(patterns[0].id);
    }
  }, [customizeOptions?.stitch_patterns, modelId, patternId, onPatternChange]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <>
    <Box sx={{
      width: '100%',
      height: '100%',
      p: { xs: 1.25, sm: 1.75, md: 1.75 },
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
    }}>
      <Typography 
        variant="h6" 
        align="center" 
        sx={{ 
          mb: { xs: 1.25, md: 1.75 }, 
          pb: { xs: 0.75, md: 1 }, 
          borderBottom: 1, 
          borderColor: 'divider',
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
          fontWeight: { xs: 600, md: 500 }
        }}
      >
        Seat Customization
      </Typography>

      {/* FABRIC TYPE SELECTION */}
      <Box sx={{ mb: { xs: 1.75, md: 2.25 } }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: { xs: 0.75, md: 1 }, 
            color: 'text.secondary', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 600
          }}
        >
          Fabric Type
        </Typography>

        {/* Material Type Dropdown */}
        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Select Material Type</InputLabel>
          <Select
            value={fabricType || ''}
            label="Select Material Type"
            onChange={(e) => onFabricTypeChange(e.target.value)}
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              '& .MuiSelect-select': {
                py: { xs: 1.25, md: 1.5 }
              }
            }}
          >
            <MenuItem value="" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              <em>None</em>
            </MenuItem>
            {fabricTypeOptions.map((option) => (
              <MenuItem key={option.id} value={option.id} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: { xs: 1.25, md: 1.75 } }} />
      
      {/* FABRIC COLOR SECTION */}
      <Box sx={{ mb: { xs: 1.75, md: 2.25 }, position: 'relative' }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: { xs: 0.75, md: 1 }, 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 600
          }}
        >
          Fabric Color
        </Typography>

        <Paper variant="outlined" sx={{ p: { xs: 0.75, md: 0.9 }, bgcolor: 'background.paper' }}>
          <Grid 
            container 
            spacing={{ xs: 0.5, md: 0.75 }} 
            sx={{ 
              maxHeight: { xs: 190, sm: 210, md: 180 }, 
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              pb: 0.5
            }}
          >
            {availableFabricColors.map((color) => {
              const colorId = `${color.name}-${color.hex}`;
              const isSelected = fabricColor === color.hex;
              
              // Image URL comes directly from API (Laravel Storage::url)
              // API returns full URL like: http://localhost:8000/storage/colors/CarrollLeather_Lonestar.png
              let colorImageUrl = color.image || null;
              
              // If no image from API, show hex color as fallback (but prefer API images)
              const hasImage = !!colorImageUrl;

              return (
                <Grid item key={`fabric-${colorId}`}>
                  <ButtonBase
                    onClick={() => {
                      onFabricColorChange(color.hex);
                    }}
                    disabled={isApplyingChange}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        setHoveredColor(color);
                        setColorHoverPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (!isMobile) {
                        setColorHoverPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isMobile) {
                        setHoveredColor(null);
                      }
                    }}
                    onTouchStart={(e) => {
                      // On mobile, show tooltip on long press or tap
                      if (isMobile) {
                        setHoveredColor(color);
                        const touch = e.touches[0];
                        setColorHoverPosition({ x: touch.clientX, y: touch.clientY });
                      }
                    }}
                    onTouchEnd={() => {
                      if (isMobile) {
                        setTimeout(() => setHoveredColor(null), 2000);
                      }
                    }}
                    sx={{
                      ...colorSwatchSize,
                      border: isSelected ? 2.5 : 1.5,
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.2s ease-in-out',
                      touchAction: 'manipulation', // Better touch handling
                      '&:active': {
                        transform: 'scale(0.9)',
                      },
                      '&:hover': {
                        boxShadow: isMobile ? (isSelected ? `0 0 0 2px ${theme.palette.primary.light}` : 'none') : `0 0 0 3px ${theme.palette.primary.light}`,
                        transform: isMobile ? 'none' : 'scale(1.1)',
                        zIndex: 1
                      }
                    }}
                  >
                    {/* Show skeleton while loading, image when loaded, or hex fallback */}
                    {hasImage && !failedImages.has(colorId) ? (
                      loadingImages.has(colorId) && !loadedImages.has(colorId) ? (
                        <SkeletonColorTile size={colorSwatchSize} />
                      ) : (
                        <Box
                          component="img"
                          src={colorImageUrl}
                          alt={color.name}
                          onLoad={() => {
                            setLoadedImages(prev => new Set(prev).add(colorId));
                            setLoadingImages(prev => {
                              const next = new Set(prev);
                              next.delete(colorId);
                              return next;
                            });
                          }}
                          onLoadStart={() => {
                            setLoadingImages(prev => new Set(prev).add(colorId));
                          }}
                          onError={(e) => {
                            // Try .jpg extension if .png failed (some files are .jpg like LONESTAR BLACK.jpg)
                            if (colorImageUrl && colorImageUrl.endsWith('.png')) {
                              const jpgUrl = colorImageUrl.replace('.png', '.jpg');
                              // Try loading .jpg version
                              const img = new Image();
                              img.onload = () => {
                                e.target.src = jpgUrl;
                                e.target.style.display = 'block';
                                setLoadedImages(prev => new Set(prev).add(colorId));
                                setLoadingImages(prev => {
                                  const next = new Set(prev);
                                  next.delete(colorId);
                                  return next;
                                });
                              };
                              img.onerror = () => {
                                console.warn(`⚠️ Failed to load color image (both .png and .jpg): ${colorImageUrl} for color ${color.name}`);
                                setFailedImages(prev => new Set(prev).add(colorId));
                                setLoadingImages(prev => {
                                  const next = new Set(prev);
                                  next.delete(colorId);
                                  return next;
                                });
                                e.target.style.display = 'none';
                              };
                              img.src = jpgUrl;
                            } else {
                              console.warn(`⚠️ Failed to load color image: ${colorImageUrl} for color ${color.name}`);
                              setFailedImages(prev => new Set(prev).add(colorId));
                              setLoadingImages(prev => {
                                const next = new Set(prev);
                                next.delete(colorId);
                                return next;
                              });
                              e.target.style.display = 'none';
                            }
                          }}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            backgroundColor: 'transparent',
                            display: 'block',
                            opacity: loadedImages.has(colorId) ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                        />
                      )
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: color.hex || '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                    )}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: { xs: 14, md: 12 },
                          height: { xs: 14, md: 12 },
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <CheckIcon sx={{ fontSize: { xs: 10, md: 8 } }} />
                      </Box>
                    )}
                  </ButtonBase>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* Hover Preview Tooltip - Hidden on mobile or shown on touch */}
        {hoveredColor && !isMobile && (
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              left: `${Math.min(colorHoverPosition.x + 20, typeof window !== 'undefined' ? window.innerWidth - 270 : colorHoverPosition.x + 20)}px`,
              top: `${Math.min(colorHoverPosition.y + 20, typeof window !== 'undefined' ? window.innerHeight - 300 : colorHoverPosition.y + 20)}px`,
              p: { xs: 1.5, md: 2 },
              minWidth: { xs: 180, md: 200 },
              maxWidth: { xs: 220, md: 250 },
              zIndex: 9999,
              pointerEvents: 'none',
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              display: { xs: 'none', md: 'block' }
            }}
          >
            {(() => {
              // Build hovered color image URL (same logic as color tiles)
              let hoveredColorImageUrl = null;
              if (hoveredColor.image) {
                if (hoveredColor.image.startsWith('http://') || hoveredColor.image.startsWith('https://')) {
                  hoveredColorImageUrl = hoveredColor.image;
                } else if (hoveredColor.image.startsWith('/')) {
                  const apiBase = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
                  hoveredColorImageUrl = `${apiBase}${hoveredColor.image}`;
                } else {
                  // Relative path from seeder (e.g., "colors/CarrollLeather_Lonestar.png")
                  const apiBase = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
                  const imagePath = hoveredColor.image.startsWith('storage/') 
                    ? `/${hoveredColor.image}` 
                    : hoveredColor.image.startsWith('/storage/')
                    ? hoveredColor.image
                    : `/storage/${hoveredColor.image}`;
                  hoveredColorImageUrl = `${apiBase}${imagePath}`;
                }
              }
              
              // Get price - prioritize direct price, then price_tiers
              let price = 'N/A';
              if (hoveredColor.price !== undefined && hoveredColor.price !== null) {
                price = hoveredColor.price;
              } else if (hoveredColor.price_tiers && hoveredColor.price_tiers.length > 0) {
                const priceTier = hoveredColor.price_tiers[0];
                price = priceTier.price || priceTier.price_adjustment || 'N/A';
              }

              return (
                <>
                  {hoveredColorImageUrl && !failedImages.has(`${hoveredColor.name}-${hoveredColor.hex}`) ? (
                    <Box
                      component="img"
                      src={hoveredColorImageUrl}
                      alt={hoveredColor.name}
                      onError={(e) => {
                        console.warn(`⚠️ Failed to load hover color image: ${hoveredColorImageUrl}`);
                        setFailedImages(prev => new Set(prev).add(`${hoveredColor.name}-${hoveredColor.hex}`));
                        e.target.style.display = 'none';
                      }}
                      sx={{
                        width: '100%',
                        height: { xs: 120, md: 150 },
                        objectFit: 'contain',
                        objectPosition: 'center',
                        backgroundColor: 'transparent',
                        borderRadius: 1,
                        mb: { xs: 1, md: 1.5 },
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'block'
                      }}
                    />
                  ) : hoveredColorImageUrl ? (
                    // Fallback to hex color if image failed
                    <Box
                      sx={{
                        width: '100%',
                        height: 150,
                        bgcolor: hoveredColor.hex || '#ffffff',
                        borderRadius: 1,
                        mb: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        color: getTextColor(hoveredColor.hex || '#000000'),
                        fontWeight: 500
                      }}>
                        {hoveredColor.name}
                      </Typography>
                    </Box>
                  ) : null}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                    {hoveredColor.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box
                      sx={{
                            width: 22,
                            height: 22,
                        bgcolor: hoveredColor.hex,
                        borderRadius: 0.5,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {hoveredColor.hex.toUpperCase()}
                    </Typography>
                  </Box>
                  {/* Show price if available */}
                  {price !== 'N/A' && price !== null && price !== undefined && (
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      Price: ${typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)}
                    </Typography>
                  )}
                </>
              );
            })()}
          </Paper>
        )}
      </Box>

      {/* PATTERN SELECTION SECTION - Only shown for Single Tone, directly under Fabric Color */}
      {seatType === 'single' && (
        <Box sx={{ mb: { xs: 1.75, md: 2.25 } }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: { xs: 0.75, md: 1 }, 
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 600
            }}
          >
            Pattern Selection
          </Typography>

          <Grid container spacing={{ xs: 0.5, md: 0.5 }}>
            {availablePatterns.map((pattern) => {
              const isSelected = patternId === pattern.id || 
                                 patternId?.toString() === pattern.id?.toString() ||
                                 String(patternId) === String(pattern.id);
              const isDefault = pattern.id === 'default';

              return (
                <Grid item xs={6} sm={4} md={3} lg={2} key={pattern.id}>
                  <ButtonBase
                      onClick={() => {
                        onPatternChange(pattern.id);
                      }}
                      disabled={isApplyingChange}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          setHoveredPattern(pattern);
                          setPatternHoverPosition({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseMove={(e) => {
                        if (!isMobile) {
                          setPatternHoverPosition({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseLeave={() => {
                        if (!isMobile) {
                          setHoveredPattern(null);
                        }
                      }}
                      onTouchStart={(e) => {
                        if (isMobile) {
                          setHoveredPattern(pattern);
                          const touch = e.touches[0];
                          setPatternHoverPosition({ x: touch.clientX, y: touch.clientY });
                        }
                      }}
                      onTouchEnd={() => {
                        if (isMobile) {
                          setTimeout(() => setHoveredPattern(null), 2000);
                        }
                      }}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: { xs: 0.4, sm: 0.35, md: 0.4 },
                        p: { xs: 0.75, sm: 0.6, md: 0.5 },
                        border: 'none',
                        borderRadius: 1,
                        bgcolor: 'transparent',
                        transition: 'all 0.2s ease-in-out',
                        position: 'relative',
                        overflow: { xs: 'hidden', md: 'visible' },
                        touchAction: 'manipulation',
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                        '&:hover': {
                          transform: isMobile ? 'none' : 'scale(1.02)',
                          bgcolor: isMobile ? 'transparent' : 'action.hover',
                          boxShadow: isMobile ? 0 : 1
                        }
                      }}
                    >
                      {/* Pattern Preview */}
                      {isDefault ? (
                        <Box sx={{
                          width: '100%',
                          height: { xs: 32, sm: 28, md: 26 },
                          background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)',
                          backgroundSize: '6px 6px',
                          backgroundPosition: '0 0, 3px 3px',
                          borderRadius: 0.5,
                          border: '1px solid',
                          borderColor: 'divider'
                        }} />
                      ) : (
                        <Box sx={{
                          width: '100%',
                          height: { xs: 32, sm: 28, md: 26 },
                          borderRadius: 0.5,
                          overflow: 'hidden',
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          {pattern.image || pattern.thumbnail ? (
                            (() => {
                              const patternImageId = `pattern-${pattern.id}`;
                              const isLoading = loadingImages.has(patternImageId) && !loadedImages.has(patternImageId);
                              return isLoading ? (
                                <SkeletonPatternTile size={{ xs: 32, sm: 28, md: 26 }} />
                              ) : (
                                <img
                                  src={pattern.image || pattern.thumbnail}
                                  alt={pattern.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    opacity: loadedImages.has(patternImageId) ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out'
                                  }}
                                  onLoad={() => {
                                    setLoadedImages(prev => new Set(prev).add(patternImageId));
                                    setLoadingImages(prev => {
                                      const next = new Set(prev);
                                      next.delete(patternImageId);
                                      return next;
                                    });
                                  }}
                                  onLoadStart={() => {
                                    setLoadingImages(prev => new Set(prev).add(`pattern-${pattern.id}`));
                                  }}
                                  onError={(e) => {
                                    console.error('Failed to load pattern image:', pattern.image || pattern.thumbnail);
                                    setLoadingImages(prev => {
                                      const next = new Set(prev);
                                      next.delete(patternImageId);
                                      return next;
                                    });
                                    e.target.style.display = 'none';
                                  }}
                                />
                              );
                            })()
                          ) : (
                            <Typography variant="caption" sx={{ fontSize: '0.5rem', color: 'text.disabled' }}>
                              No preview
                            </Typography>
                          )}
                        </Box>
                      )}

                      {/* Pattern Name - Display name from DB (can be set via admin UI) */}
                      <Typography variant="caption" sx={{
                        fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                        lineHeight: { xs: 1.3, md: 1.2 },
                        textAlign: 'center',
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        fontWeight: isSelected ? 600 : 400,
                        wordBreak: 'break-word',
                        px: { xs: 0.5, md: 0.25 },
                        mt: { xs: 0.25, md: 0.25 },
                        minHeight: { xs: '1.4em', md: '1.3em' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {pattern.name}
                      </Typography>

                      {/* Selection Indicator - Show as border highlight */}
                      {isSelected && (
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: 2,
                          borderColor: 'primary.main',
                          borderRadius: 1,
                          pointerEvents: 'none'
                        }} />
                      )}
                    </ButtonBase>
                </Grid>
              );
            })}
          </Grid>

          {/* Pattern Hover Preview Tooltip - Hidden on mobile */}
          {hoveredPattern && hoveredPattern.id !== 'default' && !isMobile && (
            <Paper
              elevation={8}
              sx={{
                position: 'fixed',
                left: `${Math.min(patternHoverPosition.x + 20, typeof window !== 'undefined' ? window.innerWidth - 270 : patternHoverPosition.x + 20)}px`,
                top: `${Math.min(patternHoverPosition.y + 20, typeof window !== 'undefined' ? window.innerHeight - 300 : patternHoverPosition.y + 20)}px`,
                p: { xs: 1.5, md: 2 },
                minWidth: { xs: 180, md: 200 },
                maxWidth: { xs: 220, md: 250 },
                zIndex: 9999,
                pointerEvents: 'none',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                display: { xs: 'none', md: 'block' }
              }}
            >
              {(() => {
                // Get price - prioritize direct price, then price_adjustment
                let price = 'N/A';
                if (hoveredPattern.price !== undefined && hoveredPattern.price !== null) {
                  price = hoveredPattern.price;
                } else if (hoveredPattern.price_adjustment !== undefined && hoveredPattern.price_adjustment !== null && hoveredPattern.price_adjustment !== 0) {
                  price = hoveredPattern.price_adjustment;
                }

                return (
                  <>
                    {/* Pattern Preview Image */}
                    {hoveredPattern.image || hoveredPattern.thumbnail ? (
                      <Box
                        component="img"
                        src={hoveredPattern.image || hoveredPattern.thumbnail}
                        alt={hoveredPattern.name}
                        onError={(e) => {
                          console.warn(`⚠️ Failed to load pattern hover image: ${hoveredPattern.image || hoveredPattern.thumbnail}`);
                          e.target.style.display = 'none';
                        }}
                        sx={{
                          width: '100%',
                          height: { xs: 120, md: 150 },
                          objectFit: 'contain',
                          objectPosition: 'center',
                          backgroundColor: 'transparent',
                          borderRadius: 1,
                          mb: { xs: 1, md: 1.5 },
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'block'
                        }}
                      />
                    ) : null}
                    
                    {/* Pattern Name */}
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                      {hoveredPattern.name}
                    </Typography>
                    
                    {/* Pattern Description */}
                    {hoveredPattern.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {hoveredPattern.description}
                      </Typography>
                    )}
                    
                    {/* Pattern Price */}
                    {price !== 'N/A' && price !== null && price !== undefined && (
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        Price: ${typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)}
                      </Typography>
                    )}
                  </>
                );
              })()}
            </Paper>
          )}
        </Box>
      )}

      {/* UNIFIED STITCHING & PIPING COLORS SECTION */}
      <Box sx={{ mb: { xs: 1.75, md: 2.25 } }}>
        <Box
          sx={{
            mb: { xs: 0.75, md: 1 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 600
            }}
          >
            Stitching & Piping Colors
          </Typography>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showStitchingSection}
                onChange={(e) => setShowStitchingSection(e.target.checked)}
                color="primary"
              />
            }
            label={showStitchingSection ? 'Hide' : 'Show'}
            sx={{
              m: 0,
              ml: 1,
              '& .MuiFormControlLabel-label': {
                fontSize: { xs: '0.75rem', md: '0.8rem' }
              }
            }}
          />
        </Box>
        
        {showStitchingSection && (
          <Paper variant="outlined" sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
            {/* Tabs for Internal, External, Piping */}
            <Tabs
              value={stitchingColorTab}
              onChange={(e, newValue) => setStitchingColorTab(newValue)}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                minHeight: { xs: 40, md: 44 },
                '& .MuiTab-root': {
                  minHeight: { xs: 40, md: 44 },
                  fontSize: { xs: '0.75rem', md: '0.813rem' },
                  textTransform: 'none',
                  fontWeight: 500
                }
              }}
            >
              <Tab label="Pattern Stitching" />
              <Tab label="Seat Stitching" />
              <Tab label="Piping" />
            </Tabs>

            {/* Color Picker Content */}
            <Box sx={{ p: { xs: 0.9, md: 1.25 } }}>
            {(() => {
              // Get available colors - use pattern colors for internal stitching, full palette for others
              let availableColors = [];
              
              if (stitchingColorTab === 0) {
                // Internal Stitching - use pattern colors if available
                if (patternId && patternId !== 'default' && String(patternId) !== 'default') {
                  const selectedPattern = availablePatterns.find(p => 
                    p.id === patternId || 
                    p.id?.toString() === patternId?.toString() ||
                    String(p.id) === String(patternId)
                  );
                  
                  if (selectedPattern?.stitch_colors && selectedPattern.stitch_colors.length > 0) {
                    availableColors = selectedPattern.stitch_colors.map(color => ({
                      id: color.id,
                      name: color.name,
                      hex: color.hex_code
                    }));
                  }
                }
                
                // Fallback to full palette if no pattern colors
                if (availableColors.length === 0) {
                  availableColors = Object.values(COLOR_PALETTE).flat().map(color => ({
                    id: color.name,
                    name: color.name,
                    hex: color.hex
                  }));
                }
              } else {
                // External Stitching and Piping - use full palette
                availableColors = Object.values(COLOR_PALETTE).flat().map(color => ({
                  id: color.name,
                  name: color.name,
                  hex: color.hex
                }));
              }

              // Get current selected color based on active tab
              const getCurrentColor = () => {
                if (stitchingColorTab === 0) return stitchColor;
                if (stitchingColorTab === 1) return externalStitchColor;
                return pipingColor;
              };

              // Get change handler based on active tab
              const handleColorChange = (hex) => {
                if (stitchingColorTab === 0) onStitchColorChange(hex);
                else if (stitchingColorTab === 1) onExternalStitchColorChange(hex);
                else onPipingColorChange(hex);
              };

              const currentColor = getCurrentColor();

              return (
                <>
                  {/* Description for current tab */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mb: 1.25, 
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', md: '0.813rem' },
                      display: 'block'
                    }}
                  >
                    {stitchingColorTab === 0 && 'Pattern stitching color'}
                    {stitchingColorTab === 1 && 'Edge stitching color'}
                    {stitchingColorTab === 2 && 'Piping trim color'}
                  </Typography>

                  {/* Color Grid */}
                  <Grid 
                    container 
                    spacing={{ xs: 0.5, md: 0.6 }} 
                    sx={{ 
                      // Limit to ~3 rows of swatches
                      maxHeight: { xs: 120, sm: 120, md: 120 }, 
                      overflowY: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      pb: 0.5
                    }}
                  >
                    {availableColors.map((color) => {
                      const colorId = `${color.name}-${color.hex}`;
                      const isSelected = currentColor === color.hex;

                      return (
                        <Grid item key={`color-${stitchingColorTab}-${colorId}`}>
                          <Tooltip title={color.name} arrow placement="top" disableHoverListener={isMobile}>
                            <ButtonBase
                              onClick={() => handleColorChange(color.hex)}
                              sx={{
                                ...colorSwatchSize,
                                bgcolor: color.hex,
                                border: isSelected ? 3 : 1.5,
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                transition: 'all 0.2s',
                                touchAction: 'manipulation',
                                boxShadow: isSelected ? `0 0 0 2px ${theme.palette.primary.light}` : 'none',
                                '&:active': {
                                  transform: 'scale(0.9)',
                                },
                                '&:hover': {
                                  boxShadow: isMobile ? (isSelected ? `0 0 0 2px ${theme.palette.primary.light}` : 'none') : `0 0 0 3px ${theme.palette.primary.light}`,
                                  transform: isMobile ? 'none' : 'scale(1.1)',
                                  zIndex: 1,
                                  borderColor: 'primary.main'
                                }
                              }}
                            >
                              {isSelected && (
                                <CheckIcon sx={{
                                  fontSize: { xs: 18, md: 20 },
                                  color: getTextColor(color.hex),
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} />
                              )}
                            </ButtonBase>
                          </Tooltip>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* Current Selection Display */}
                  {currentColor && (
                    <Box sx={{ 
                      mt: 1.5, 
                      pt: 1.5, 
                      borderTop: 1, 
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.813rem' } }}>
                        Selected:
                      </Typography>
                      <Box sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: currentColor,
                        display: 'inline-block'
                      }} />
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', md: '0.813rem' }, fontWeight: 500 }}>
                        {availableColors.find(c => c.hex === currentColor)?.name || currentColor}
                      </Typography>
                    </Box>
                  )}
                </>
              );
            })()}
            </Box>
          </Paper>
        )}
      </Box>

      <Divider sx={{ my: { xs: 1.5, md: 2 } }} />
      {/* TWO TONE TOGGLE */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: { xs: 0.75, md: 1 }, 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 600
          }}
        >
          Two Tone
        </Typography>

        <Paper variant="outlined" sx={{
          p: { xs: 1, md: 1.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: seatType === 'two-tone' ? 'action.selected' : 'background.paper',
          borderColor: seatType === 'two-tone' ? 'primary.main' : 'divider'
        }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              fontWeight={500}
              sx={{ fontSize: { xs: '0.813rem', md: '0.875rem' } }}
            >
              {seatType === 'two-tone' ? 'Two-Tone Mode Active' : 'Enable Two Tone Mode'}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {seatType === 'two-tone' ? 'Click on seat parts to customize' : 'Uniform color and pattern'}
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={seatType === 'two-tone'}
                onChange={(e) => {
                  if (e.target.checked) {
                    onSeatTypeChange('two-tone');
                  } else {
                    onSeatTypeChange('single');
                    Object.keys(meshCustomizations).forEach(key => {
                      onMeshCustomizationChange(key, {});
                    });
                  }
                }}
                color="primary"
              />
            }
            label=""
            sx={{ m: 0 }}
          />
        </Paper>
      </Box>
      {/* Two-Tone Color/Pattern Editor Button */}
      {seatType === 'two-tone' && (
        <Box sx={{ mb: { xs: 2, md: 3 }, mt: { xs: -0.5, md: -1 } }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              // Trigger the two-tone selector popup
              // You'll need to pass this handler from App.jsx
              if (onOpenTwoToneSelector) {
                onOpenTwoToneSelector();
              }
            }}
            sx={{
              borderStyle: 'dashed',
              py: { xs: 1.25, md: 1.5 },
              fontSize: { xs: '0.813rem', md: '0.875rem' },
              fontWeight: 500,
              touchAction: 'manipulation',
              '&:hover': {
                borderStyle: 'solid',
                bgcolor: 'action.hover'
              },
              '&:active': {
                transform: 'scale(0.98)',
              }
            }}
          >
            Edit Two-Tone Color & Pattern
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* MODEL SELECTION - DISABLED (Only using Model 1)
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Model Selection
        </Typography>

        <Grid container spacing={1}>
          {AVAILABLE_MODELS.map(model => (
            <Grid item xs={6} key={model.id}>
              <Tooltip title={model.description} arrow placement="top">
                <ButtonBase
                  onClick={() => onModelIdChange(model.id)}
                  sx={{
                    width: '100%',
                    p: 1,
                    border: modelId === model.id ? 2 : 1,
                    borderColor: modelId === model.id ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    bgcolor: modelId === model.id ? 'action.selected' : 'background.paper',
                    color: modelId === model.id ? 'primary.main' : 'text.primary',
                    fontWeight: modelId === model.id ? 'bold' : 'regular',
                    ffontSize: { xs: '0.75rem', sm: '0.8rem' },
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 1,
                      borderColor: 'primary.light'
                    }
                  }}
                >
                  {model.name}
                </ButtonBase>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
      */}
    </Box>
      {/* Loading Backdrop */}
      <Backdrop
        open={isApplyingChange}
        sx={{
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <Fade in={isApplyingChange}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress color="inherit" size={48} />
            <Typography variant="body2">Updating model...</Typography>
          </Box>
        </Fade>
      </Backdrop>
    </>
  );
}

export default CustomizationPanel;
