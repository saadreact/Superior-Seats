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
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { AVAILABLE_MODELS, CUSTOMIZATION_OPTIONS } from '../config/assets';
import { COLOR_PALETTE } from '../config/colorPalette';
import { getPatternOptionsForModel } from '../utils/PatternLoader';
import { getColorsForFabric } from '../config/fabricColors';

function CustomizationPanel({
  availableMaterials, // NEW: API materials
  modelId,
  onModelIdChange,
  stitchColor,
  onStitchColorChange,
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
  onOpenTwoToneSelector
}) {
  const theme = useTheme();

  // State for managing color palette visibility and patterns
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [patternThumbnails, setPatternThumbnails] = useState({});
  const [hoveredFabric, setHoveredFabric] = useState(null);
  const [hoveredPattern, setHoveredPattern] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [patternImagesLoaded, setPatternImagesLoaded] = useState({});

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
      console.log('🎨 Using API materials for fabric types');
      return availableMaterials.map(mat => {
        // Build image URL from API
        let imageUrl = '/assets/fabrics/PremiumLeather.png'; // Default fallback
        if (mat.image) {
          imageUrl = mat.image.startsWith('http')
            ? mat.image
            : `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL}${mat.image}`;
        }
        
        return {
          id: mat.id.toString(), // Ensure ID is string
          name: mat.name,
          icon: mat.name.charAt(0).toUpperCase(), // Simple icon fallback
          description: mat.description || mat.name,
          image: imageUrl
        };
      });
    }

    // Fallback to hardcoded options
    console.log('⚠️ Using fallback fabric types');
    return [
      // Main commercial fabric types with specific color palettes
      { id: 'carroll-leather', name: 'Carroll Leather', icon: 'CL', description: 'Authentic premium leather collections', image: '/assets/fabrics/CarrollLeather.png' },
      { id: 'miami-vinyl', name: 'Miami Vinyl\'s', icon: 'MV', description: 'Premium marine-grade vinyl', image: '/assets/fabrics/MiamiVinyl.png' },
      { id: 'ultrafabrics', name: 'Ultrafabrics', icon: 'UL', description: 'High-performance synthetic leather', image: '/assets/fabrics/UltraLeather.png' },
      { id: 'brisa', name: 'Brisa Distressed', icon: 'BD', description: 'Weathered distressed leather look', image: '/assets/fabrics/BrisaDistressed.png' },
      // Original fabric types (no specific color restrictions)
      { id: 'leather', name: 'Premium Leather', icon: 'L', description: 'Luxury leather with natural texture', image: '/assets/fabrics/PremiumLeather.png' },
      { id: 'cloth', name: 'Fabric Cloth', icon: 'F', description: 'Soft woven fabric material', image: '/assets/fabrics/FabricCloth.png' },
      { id: 'suede', name: 'Suede Material', icon: 'S', description: 'Soft brushed suede finish', image: '/assets/fabrics/SuedeMaterial.png' },
      { id: 'vinyl', name: 'Synthetic Vinyl', icon: 'V', description: 'Durable synthetic material', image: '/assets/fabrics/SyntheticVinyl.png' },
      { id: 'mesh', name: 'Breathable Mesh', icon: 'M', description: 'Ventilated mesh fabric', image: '/assets/fabrics/BreathableMesh.png' },
      { id: 'carbon', name: 'Carbon Fiber', icon: 'C', description: 'High-tech carbon fiber weave', image: '/assets/fabrics/CarbonFiber.png' },
    ];
  }, [availableMaterials]);

  // Get available colors based on fabric type
  const availableFabricColors = useMemo(() => {
    // 1. Try to find colors from API data first
    if (availableMaterials && availableMaterials.length > 0) {
      const selectedMaterial = availableMaterials.find(m => m.id.toString() === fabricType);
      if (selectedMaterial && selectedMaterial.colors) {
        console.log(`🎨 Found ${selectedMaterial.colors.length} API colors for ${fabricType}`);
        return selectedMaterial.colors.map(c => ({
          name: c.name,
          hex: c.hex_code
        }));
      }
    }

    // 2. Fallback to existing logic
    // Check if this fabric type has specific colors defined
    const specificColors = getColorsForFabric(fabricType);

    if (specificColors.length > 0) {
      // Use fabric-specific colors
      return specificColors;
    }

    // Fall back to general color palette for other fabric types
    return Object.values(COLOR_PALETTE).flat();
  }, [fabricType, availableMaterials]);

  // Load available patterns based on current model
  useEffect(() => {
    const patterns = getPatternOptionsForModel(modelId);
    setAvailablePatterns(patterns);

    // Create thumbnail URLs for patterns (same as texture path for now)
    const thumbnails = {};
    patterns.forEach(pattern => {
      if (pattern.path) {
        thumbnails[pattern.id] = pattern.path;
      }
    });
    setPatternThumbnails(thumbnails);

    // Reset pattern selection when model changes to ensure compatibility
    const currentPatternExists = patterns.some(p => p.id === patternId);
    if (!currentPatternExists) {
      onPatternChange('default');
    }
  }, [modelId, patternId, onPatternChange]);

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      p: 2,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <Typography variant="h6" align="center" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
        Seat Customization
      </Typography>

      {/* FABRIC TYPE SELECTION */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
          Fabric Type
        </Typography>

        {/* Material Type Dropdown */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Select Material Type</InputLabel>
          <Select
            value={fabricType || ''}
            label="Select Material Type"
            onChange={(e) => onFabricTypeChange(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {fabricTypeOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selected Material Image Tile */}
        {fabricType && (() => {
          const selectedMaterial = availableMaterials?.find(m => m.id.toString() === fabricType);
          const selectedColor = availableFabricColors.find(c => c.hex === fabricColor);
          const selectedColorData = selectedMaterial?.colors?.find(c => c.hex_code === fabricColor);
          
          // Determine which image to show: color-specific image if available, otherwise base material image
          let displayImage = null;
          if (selectedColorData?.image) {
            // Use color-specific image from API
            displayImage = selectedColorData.image.startsWith('http') 
              ? selectedColorData.image 
              : `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL}${selectedColorData.image}`;
          } else if (selectedMaterial?.image) {
            // Use base material image from API
            displayImage = selectedMaterial.image.startsWith('http')
              ? selectedMaterial.image
              : `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL}${selectedMaterial.image}`;
          } else {
            // Fallback to fabricTypeOptions image
            const option = fabricTypeOptions.find(opt => opt.id === fabricType);
            displayImage = option?.image || '/assets/fabrics/PremiumLeather.png';
          }

          return (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                borderColor: 'primary.main',
                borderWidth: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {selectedMaterial?.name || fabricTypeOptions.find(opt => opt.id === fabricType)?.name}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 200,
                  height: 120,
                  backgroundImage: `url(${displayImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              />
              {selectedColor && (
                <Typography variant="caption" color="text.secondary">
                  Color: {selectedColor.name}
                </Typography>
              )}
            </Paper>
          );
        })()}
      </Box>

      <Divider sx={{ my: 2 }} />
      {/* FABRIC COLOR SECTION */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Fabric Color
        </Typography>

        <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.paper' }}>
          <Grid container spacing={{ xs: 1, sm: 0.5 }} sx={{ maxHeight: { xs: 200, md: 120 }, overflowY: 'auto' }}>
            {availableFabricColors.map((color) => {
              const colorId = `${color.name}-${color.hex}`;
              const isSelected = fabricColor === color.hex;

              return (
                <Grid item key={`fabric-${colorId}`}>
                  <Tooltip title={color.name} arrow placement="top">
                    <ButtonBase
                      onClick={() => onFabricColorChange(color.hex)}
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: color.hex,
                        border: isSelected ? 2 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderRadius: 0.5,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                          transform: 'scale(1.15)',
                          zIndex: 1
                        }
                      }}
                    >
                      {isSelected && (
                        <CheckIcon sx={{
                          fontSize: 16,
                          color: getTextColor(color.hex)
                        }} />
                      )}
                    </ButtonBase>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Box>

      <Divider sx={{ my: 2 }} />
      {/* TWO TONE TOGGLE */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Two Tone
        </Typography>

        <Paper variant="outlined" sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: seatType === 'two-tone' ? 'action.selected' : 'background.paper',
          borderColor: seatType === 'two-tone' ? 'primary.main' : 'divider'
        }}>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {seatType === 'two-tone' ? 'Two-Tone Mode Active' : 'Enable Two Tone Mode'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {seatType === 'two-tone' ? 'Right-click on seat parts to customize' : 'Uniform color and pattern'}
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
        <Box sx={{ mb: 3, mt: -1 }}>
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
              py: 1.5,
              '&:hover': {
                borderStyle: 'solid',
                bgcolor: 'action.hover'
              }
            }}
          >
            Edit Two-Tone Color & Pattern
          </Button>
        </Box>
      )}
      {/* PATTERN SELECTION SECTION - Only shown for Single Tone */}

      {seatType === 'single' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Pattern Selection
          </Typography>

          <Grid container spacing={0.5}>
            {availablePatterns.map((pattern) => {
              const isSelected = patternId === pattern.id;
              const isDefault = pattern.id === 'default';

              return (
                <Grid item xs={4} sm={3} md={2} lg={1.7} key={pattern.id}>
                  <Tooltip title={pattern.name} arrow placement="top">
                    <ButtonBase
                      onClick={() => onPatternChange(pattern.id)}
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        p: 0.5,
                        border: isSelected ? 2 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 2,
                          borderColor: 'primary.light'
                        }
                      }}
                    >
                      {/* Pattern Preview */}
                      {isDefault ? (
                        <Box sx={{
                          width: '100%',
                          height: 35,
                          background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)',
                          backgroundSize: '6px 6px',
                          backgroundPosition: '0 0, 3px 3px',
                          borderRadius: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem',
                          color: 'text.secondary'
                        }}>
                          None
                        </Box>
                      ) : (
                        <Box sx={{
                          width: '100%',
                          height: 35,
                          borderRadius: 0.5,
                          overflow: 'hidden',
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {pattern.thumbnail ? (
                            <img
                              src={pattern.thumbnail}
                              alt={pattern.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.error('Failed to load pattern thumbnail:', pattern.thumbnail);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Typography variant="caption" sx={{ fontSize: '0.5rem', color: 'text.disabled' }}>
                              No preview
                            </Typography>
                          )}
                        </Box>
                      )}

                      {/* Pattern Name */}
                      <Typography variant="caption" sx={{
                        fontSize: '0.6rem',
                        lineHeight: 1.1,
                        textAlign: 'center',
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        fontWeight: isSelected ? 'bold' : 'regular',
                        wordBreak: 'break-word'
                      }}>
                        {pattern.name.replace(' Pattern', '').replace('Pattern ', '')}
                      </Typography>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <Box sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckIcon sx={{ fontSize: 10 }} />
                        </Box>
                      )}
                    </ButtonBase>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />
      {/* STITCHING SECTION */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Stitching Color
        </Typography>

        <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.paper' }}>
          <Grid container spacing={0.5} sx={{ maxHeight: { xs: 200, md: 120 }, overflowY: 'auto' }}>
            {Object.values(COLOR_PALETTE).flat().map((color) => {
              const colorId = `${color.name}-${color.hex}`;
              const isSelected = stitchColor === color.hex;

              return (
                <Grid item key={`stitch-${colorId}`}>
                  <Tooltip title={color.name} arrow placement="top">
                    <ButtonBase
                      onClick={() => onStitchColorChange(color.hex)}
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: color.hex,
                        border: isSelected ? 2 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderRadius: 0.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                          transform: 'scale(1.15)',
                          zIndex: 1
                        }
                      }}
                    >
                      {isSelected && (
                        <CheckIcon sx={{
                          fontSize: 16,
                          color: getTextColor(color.hex)
                        }} />
                      )}
                    </ButtonBase>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Box>

      <Divider sx={{ my: 2 }} />
      {/* MODEL SELECTION */}
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
    </Box>
  );
}

export default CustomizationPanel;
