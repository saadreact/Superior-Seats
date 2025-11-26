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
  useTheme
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { AVAILABLE_MODELS, CUSTOMIZATION_OPTIONS } from '../config/assets';
import { COLOR_PALETTE } from '../config/colorPalette';
import { getPatternOptionsForModel } from '../utils/PatternLoader';
import { getColorsForFabric } from '../config/fabricColors';

function CustomizationPanel({
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
  onSeatTypeChange
}) {
  const theme = useTheme();

  // State for managing color palette visibility and patterns
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [patternThumbnails, setPatternThumbnails] = useState({});
  const [hoveredFabric, setHoveredFabric] = useState(null);
  const [hoveredPattern, setHoveredPattern] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Get text color based on background
  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const fabricTypeOptions = [
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

  // Get available colors based on fabric type
  const availableFabricColors = useMemo(() => {
    // Check if this fabric type has specific colors defined
    const specificColors = getColorsForFabric(fabricType);

    if (specificColors.length > 0) {
      // Use fabric-specific colors
      return specificColors;
    }

    // Fall back to general color palette for other fabric types
    return Object.values(COLOR_PALETTE).flat();
  }, [fabricType]);

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

        <Grid container spacing={1}>
          {fabricTypeOptions.map((option) => (
            <Grid item xs={2.4} key={option.id}>
              <Tooltip title={option.description} arrow placement="top">
                <ButtonBase
                  onClick={() => onFabricTypeChange(option.id)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 0.5,
                    border: 1,
                    borderColor: fabricType === option.id ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: fabricType === option.id ? 2 : 0,
                    '&:hover': {
                      borderColor: 'primary.light',
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  {/* Fabric Image */}
                  <Box sx={{
                    width: '100%',
                    height: 24,
                    backgroundImage: `url(${option.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 0.5,
                    border: 1,
                    borderColor: 'divider'
                  }} />

                  {/* Fabric Name */}
                  <Typography variant="caption" sx={{
                    fontSize: '0.65rem',
                    lineHeight: 1.1,
                    textAlign: 'center',
                    color: fabricType === option.id ? 'primary.main' : 'text.secondary',
                    fontWeight: fabricType === option.id ? 'bold' : 'regular'
                  }}>
                    {option.name}
                  </Typography>

                  {/* Selection Indicator */}
                  {fabricType === option.id && (
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
          ))}
        </Grid>
      </Box>

      {/* FABRIC COLOR SECTION */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Fabric Color
        </Typography>

        <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.paper' }}>
          <Grid container spacing={0.5} sx={{ maxHeight: 120, overflowY: 'auto' }}>
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
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
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
                <Grid item xs={1.7} key={pattern.id}>
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
                        transition: 'all 0.2s',
                        position: 'relative',
                        overflow: 'hidden'
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

      {/* STITCHING SECTION */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Stitching Color
        </Typography>

        <Paper variant="outlined" sx={{ p: 1, bgcolor: 'background.paper' }}>
          <Grid container spacing={0.5} sx={{ maxHeight: 120, overflowY: 'auto' }}>
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
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
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
                    fontSize: '0.8rem',
                    transition: 'all 0.2s'
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
