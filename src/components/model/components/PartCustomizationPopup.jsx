import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  ButtonBase,
  Backdrop,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { COLOR_PALETTE } from '../config/colorPalette';
import { getPatternOptionsForModel } from '../utils/PatternLoader';
import { getColorsForFabric } from '../config/fabricColors';

function PartCustomizationPopup({
  partName,
  position,
  onClose,
  currentCustomization,
  onApply,
  modelId,
  seatType,
  fabricColor,
  globalPatternId,
  isTwoToneSelector = false,
  onApplyToAll,
  availableMaterials = null, // API materials
  fabricType = null, // Current fabric type
  customizeOptions = null // API customize options (stitch_patterns, etc.)
}) {
  const theme = useTheme();
  
  // Use the actual color - if customized, use that; otherwise use global fabricColor
  const getInitialColor = () => {
    if (currentCustomization?.fabricColor) {
      return currentCustomization.fabricColor;
    }
    // Use the global fabric color (the darkening is just a visual indicator in the 3D view)
    return fabricColor;
  };

  // Use the actual pattern - if customized, use that; otherwise use global pattern
  const getInitialPattern = () => {
    if (currentCustomization?.patternId) {
      return currentCustomization.patternId;
    }
    // Use the global pattern (uncustomized parts inherit the global pattern)
    return globalPatternId || 'default';
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState(getInitialColor());
  const [selectedPattern, setSelectedPattern] = useState(getInitialPattern());
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [failedImages, setFailedImages] = useState(new Set()); // Track which images failed to load
  const [hoveredColor, setHoveredColor] = useState(null);
  const [colorHoverPosition, setColorHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredPattern, setHoveredPattern] = useState(null);
  const [patternHoverPosition, setPatternHoverPosition] = useState({ x: 0, y: 0 });

  // Shared swatch sizing to match main customization panel
  const colorSwatchSize = {
    width: { xs: 34, sm: 32, md: 30 },
    height: { xs: 34, sm: 32, md: 30 },
    minWidth: { xs: 34, sm: 32, md: 30 },
    minHeight: { xs: 34, sm: 32, md: 30 }
  };

  // Get available colors based on fabric type (same logic as CustomizationPanel)
  const availableFabricColors = useMemo(() => {
    // 1. Try to find colors from API data first
    if (availableMaterials && availableMaterials.length > 0 && fabricType) {
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

  useEffect(() => {
    let patterns = [];
    
    // Priority 1: Use API stitch_patterns if available (filter to Model 1 only)
    if (customizeOptions?.stitch_patterns && customizeOptions.stitch_patterns.length > 0) {
      // Filter to only show Model 1 patterns (static_pattern_id starts with "1-")
      const model1Patterns = customizeOptions.stitch_patterns.filter(p => 
        p.static_pattern_id && p.static_pattern_id.startsWith('1-')
      );
      patterns = model1Patterns.map(pattern => {
        // Use static assets from public/assets/patterns/ based on static_pattern_id
        let imageUrl = null;
        if (pattern.static_pattern_id) {
          const [modelIdNum, patternNum] = pattern.static_pattern_id.split('-');
          if (patternNum === '1') {
            imageUrl = `/assets/patterns/${modelIdNum}/1-preview.jpg`;
          } else {
            const paddedPatternNum = patternNum.padStart(2, '0');
            imageUrl = `/assets/patterns/${modelIdNum}/${paddedPatternNum}-preview.jpg`;
          }
        }

        const patternIdFor3D = pattern.static_pattern_id || pattern.id.toString();

        return {
          id: patternIdFor3D,
          apiId: pattern.id.toString(),
          name: pattern.name,
          description: pattern.description || pattern.name,
          path: null,
          thumbnail: imageUrl,
          image: imageUrl,
          stitch_colors: pattern.stitch_colors || [],
          price: pattern.price,
          price_adjustment: pattern.price_adjustment || 0
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
        stitch_colors: [],
        price: null,
        price_adjustment: 0
      });
    } else {
      // Fallback: Use static patterns from PatternLoader
      const isTwoTone = seatType === 'two-tone';
      patterns = getPatternOptionsForModel(modelId, isTwoTone);
    }
    
    setAvailablePatterns(patterns);
  }, [modelId, seatType, customizeOptions]);

  // Apply immediately when color changes
  const handleColorChange = (color) => {
    setSelectedColor(color);
    onApply({
      fabricColor: color,
      patternId: selectedPattern
    });
  };

  // Apply immediately when pattern changes
  const handlePatternChange = (patternId) => {
    setSelectedPattern(patternId);
    onApply({
      fabricColor: selectedColor,
      patternId: patternId
    });
  };

  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  // Convert part name to display name
  const getDisplayName = (name) => {
    const nameMap = {
      'seat_bottom_upper': 'Seat Bottom Upper',
      'seat_bottom_lower': 'Seat Bottom Lower',
      'seat_bottom_lower_Left': 'Seat Bottom Lower Left',
      'seat_bottom_lower_Right': 'Seat Bottom Lower Right',
      'seat_back_upper': 'Seat Back Upper',
      'seat_back_lower': 'Seat Back Lower',
      'seat_back_lower_Left': 'Seat Back Lower Left',
      'seat_back_lower_Right': 'Seat Back Lower Right',
      'headset_front': 'Headrest Front',
      'headset_back': 'Headrest Back',
      'left_arm_upper': 'Left Arm Upper',
      'right_arm_upper': 'Right Arm Upper'
    };
    return nameMap[name] || name;
  };

  return (
    <>
      <Backdrop
        open={true}
        onClick={() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              onClose();
            });
          });
        }}
        sx={{ zIndex: 9999, bgcolor: 'rgba(0, 0, 0, 0.3)' }}
      />

      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '500px', md: '600px' },
          maxWidth: { xs: 'calc(100vw - 16px)', sm: '500px', md: '600px' },
          maxHeight: { xs: '95vh', sm: '90vh' },
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 10000,
          borderRadius: { xs: 2, md: 3 },
          p: { xs: 2, sm: 2.5, md: 3 }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {isTwoToneSelector ? 'Select Color & Pattern' : `Customize ${getDisplayName(partName)}`}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Color Selection - Use same colors as fabric colors */}
        <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 0.75, md: 1 },
              fontSize: { xs: '0.8rem', md: '0.875rem' }
            }}
          >
            Color:
          </Typography>
          <Grid container spacing={0.5} sx={{ maxHeight: { xs: 140, md: 150 }, overflowY: 'auto', overflowX: 'hidden' }}>
            {(availableFabricColors.length > 0 ? availableFabricColors : Object.values(COLOR_PALETTE).flat()).map((color) => {
              const colorHex = color.hex || color.hex_code;
              const colorName = color.name;
              const colorId = `${colorName}-${colorHex}`;
              const isSelected = selectedColor === colorHex;
              const colorImageUrl = color.image || null;
              const hasImage = !!colorImageUrl && !failedImages.has(colorId);

              return (
                <Grid item key={colorId}>
                  <ButtonBase
                    onClick={() => handleColorChange(colorHex)}
                    onMouseEnter={(e) => {
                      if (e && e.clientX !== undefined && e.clientY !== undefined) {
                        setHoveredColor(color);
                        setColorHoverPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (e && e.clientX !== undefined && e.clientY !== undefined) {
                        setColorHoverPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => setHoveredColor(null)}
                    sx={{
                      ...colorSwatchSize,
                      border: isSelected ? 2.5 : 1.5,
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      transition: 'all 0.2s',
                      overflow: 'hidden',
                      position: 'relative',
                      touchAction: 'manipulation',
                      '&:active': {
                        transform: 'scale(0.9)',
                      },
                      '&:hover': {
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                        transform: 'scale(1.15)',
                        zIndex: 1
                      }
                    }}
                  >
                    {hasImage ? (
                      <Box
                        component="img"
                        src={colorImageUrl}
                        alt={colorName}
                        onError={(e) => {
                          // Try .jpg extension if .png failed
                          if (colorImageUrl && colorImageUrl.endsWith('.png')) {
                            const jpgUrl = colorImageUrl.replace('.png', '.jpg');
                            const img = new Image();
                            img.onload = () => {
                              e.target.src = jpgUrl;
                              e.target.style.display = 'block';
                            };
                            img.onerror = () => {
                              setFailedImages(prev => new Set(prev).add(colorId));
                              e.target.style.display = 'none';
                            };
                            img.src = jpgUrl;
                          } else {
                            setFailedImages(prev => new Set(prev).add(colorId));
                            e.target.style.display = 'none';
                          }
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          display: 'block',
                          backgroundColor: 'transparent'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: colorHex || '#ffffff',
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
        </Box>

        {/* Pattern Selection */}
        <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 0.75, md: 1 },
              fontSize: { xs: '0.8rem', md: '0.875rem' }
            }}
          >
            Pattern:
          </Typography>
          <Grid container spacing={{ xs: 0.5, md: 1 }} sx={{ overflowX: 'hidden' }}>
            {availablePatterns.map((pattern) => {
              const isSelected = selectedPattern === pattern.id;
              const isDefault = pattern.id === 'default';

              return (
                <Grid item xs={6} sm={4} md={3} lg={2} key={pattern.id}>
                  <ButtonBase
                    onClick={() => handlePatternChange(pattern.id)}
                    onMouseEnter={(e) => {
                      if (e && e.clientX !== undefined && e.clientY !== undefined) {
                        setHoveredPattern(pattern);
                        setPatternHoverPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (e && e.clientX !== undefined && e.clientY !== undefined) {
                        setPatternHoverPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => setHoveredPattern(null)}
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
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: { xs: 'hidden', md: 'visible' },
                      touchAction: 'manipulation',
                      '&:active': {
                        transform: 'scale(0.95)',
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                        boxShadow: 1,
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
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
                        {pattern.thumbnail ? (
                          <img 
                            src={pattern.thumbnail} 
                            alt={pattern.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              backgroundColor: 'transparent'
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
        </Box>
        {/* Apply to All Parts Button - NEW FEATURE */}
        {isTwoToneSelector && (
          <Box sx={{ 
            mt: { xs: 1.5, md: 2 }, 
            pt: { xs: 1.5, md: 2 }, 
            borderTop: 1, 
            borderColor: 'divider' 
          }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowConfirmDialog(true)}
              sx={{
                borderStyle: 'dashed',
                borderWidth: 2,
                py: { xs: 1.25, md: 1.5 },
                fontSize: { xs: '0.875rem', md: '1rem' },
                '&:hover': {
                  borderStyle: 'solid',
                  bgcolor: 'action.hover',
                  borderWidth: 2
                }
              }}
            >
              Apply to All Parts
            </Button>
          </Box>
        )}
        {/* Custom Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          sx={{ zIndex: 10001 }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { 
              borderRadius: { xs: 2, md: 3 }, 
              p: { xs: 1.5, md: 2 },
              m: { xs: 2, md: 3 },
              maxWidth: { xs: 'calc(100% - 32px)', sm: 400 }
            }
          }}
        >

          <DialogTitle sx={{ pb: { xs: 0.5, md: 1 }, px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}>
            <Typography variant="h6" component="div" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Apply to All Parts?
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ px: { xs: 2, md: 3 }, pb: { xs: 1, md: 2 } }}>
            <DialogContentText sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, lineHeight: 1.6 }}>
              This will apply the selected color and pattern to all <strong>12 customizable parts</strong>.
              <br /><br />
              Any existing customizations will be overridden.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            px: { xs: 2, md: 3 }, 
            pb: { xs: 2, md: 2 },
            pt: { xs: 1, md: 1 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 1 },
            '& > *': {
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '100%', sm: 'auto' }
            }
          }}>
            <Button 
              onClick={() => setShowConfirmDialog(false)} 
              color="inherit"
              variant="outlined"
              fullWidth={false}
              sx={{ 
                order: { xs: 2, sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: '100%', sm: 100 }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowConfirmDialog(false);
                if (onApplyToAll) {
                  onApplyToAll(selectedColor, selectedPattern);
                }
                onClose();
              }} 
              color="primary" 
              variant="contained"
              autoFocus
              fullWidth={false}
              sx={{ 
                order: { xs: 1, sm: 2 },
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: '100%', sm: 120 }
              }}
            >
              Apply to All
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* Hover Preview Tooltips - Rendered outside Paper to avoid clipping */}
      {/* Color Hover Preview Tooltip */}
      {hoveredColor && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            left: `${Math.min(
              Math.max(colorHoverPosition.x + 20, 10),
              typeof window !== 'undefined' ? window.innerWidth - 270 : colorHoverPosition.x + 20
            )}px`,
            top: `${Math.min(
              Math.max(colorHoverPosition.y + 20, 10),
              typeof window !== 'undefined' ? window.innerHeight - 300 : colorHoverPosition.y + 20
            )}px`,
            p: { xs: 1.5, md: 2 },
            minWidth: { xs: 180, md: 200 },
            maxWidth: { xs: 220, md: 250 },
            zIndex: 10001,
            pointerEvents: 'none',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transform: 'translateZ(0)', // Force hardware acceleration
            willChange: 'transform' // Optimize for animations
          }}
        >
          {(() => {
            // Build hovered color image URL (same logic as color tiles)
            let hoveredColorImageUrl = null;
            const hoveredColorData = hoveredColor;
            
            if (hoveredColorData.image) {
              if (hoveredColorData.image.startsWith('http://') || hoveredColorData.image.startsWith('https://')) {
                hoveredColorImageUrl = hoveredColorData.image;
              } else if (hoveredColorData.image.startsWith('/')) {
                const apiBase = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
                hoveredColorImageUrl = `${apiBase}${hoveredColorData.image}`;
              } else {
                // Relative path from seeder (e.g., "colors/CarrollLeather_Lonestar.png")
                const apiBase = process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
                const imagePath = hoveredColorData.image.startsWith('storage/') 
                  ? `/${hoveredColorData.image}` 
                  : hoveredColorData.image.startsWith('/storage/')
                  ? hoveredColorData.image
                  : `/storage/${hoveredColorData.image}`;
                hoveredColorImageUrl = `${apiBase}${imagePath}`;
              }
            }
            
            // Get price - prioritize direct price, then price_tiers
            let price = 'N/A';
            if (hoveredColorData.price !== undefined && hoveredColorData.price !== null) {
              price = hoveredColorData.price;
            } else if (hoveredColorData.price_tiers && hoveredColorData.price_tiers.length > 0) {
              const priceTier = hoveredColorData.price_tiers[0];
              price = priceTier.price || priceTier.price_adjustment || 'N/A';
            }

            return (
              <>
                {hoveredColorImageUrl && !failedImages.has(`${hoveredColorData.name}-${hoveredColorData.hex || hoveredColorData.hex_code}`) ? (
                  <Box
                    component="img"
                    src={hoveredColorImageUrl}
                    alt={hoveredColorData.name}
                    onError={(e) => {
                      console.warn(`⚠️ Failed to load hover color image: ${hoveredColorImageUrl}`);
                      setFailedImages(prev => new Set(prev).add(`${hoveredColorData.name}-${hoveredColorData.hex || hoveredColorData.hex_code}`));
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
                      height: { xs: 120, md: 150 },
                      bgcolor: hoveredColorData.hex || hoveredColorData.hex_code || '#ffffff',
                      borderRadius: 1,
                      mb: { xs: 1, md: 1.5 },
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2" sx={{ 
                      color: getTextColor(hoveredColorData.hex || hoveredColorData.hex_code || '#000000'),
                      fontWeight: 500
                    }}>
                      {hoveredColorData.name}
                    </Typography>
                  </Box>
                ) : null}
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                  {hoveredColorData.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: hoveredColorData.hex || hoveredColorData.hex_code,
                      borderRadius: 0.5,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {(hoveredColorData.hex || hoveredColorData.hex_code || '').toUpperCase()}
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

      {/* Pattern Hover Preview Tooltip */}
      {hoveredPattern && hoveredPattern.id !== 'default' && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            left: `${Math.min(
              Math.max(patternHoverPosition.x + 20, 10),
              typeof window !== 'undefined' ? window.innerWidth - 270 : patternHoverPosition.x + 20
            )}px`,
            top: `${Math.min(
              Math.max(patternHoverPosition.y + 20, 10),
              typeof window !== 'undefined' ? window.innerHeight - 300 : patternHoverPosition.y + 20
            )}px`,
            p: { xs: 1.5, md: 2 },
            minWidth: { xs: 180, md: 200 },
            maxWidth: { xs: 220, md: 250 },
            zIndex: 10001,
            pointerEvents: 'none',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transform: 'translateZ(0)', // Force hardware acceleration
            willChange: 'transform' // Optimize for animations
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
    </>
  );
}


export default PartCustomizationPopup;
