import React, { useState, useEffect } from 'react';
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
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { COLOR_PALETTE } from '../config/colorPalette';
import { getPatternOptionsForModel } from '../utils/PatternLoader';

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
  onApplyToAll
}) {
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

  useEffect(() => {
    // Load two-tone patterns when in two-tone mode
    const isTwoTone = seatType === 'two-tone';
    const patterns = getPatternOptionsForModel(modelId, isTwoTone);
    setAvailablePatterns(patterns);
  }, [modelId, seatType]);

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
          width: { xs: '90%', sm: '500px', md: '600px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 10000,
          borderRadius: 3,
          p: 3
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

        {/* Color Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Color:
          </Typography>
          <Grid container spacing={0.5} sx={{ maxHeight: 150, overflowY: 'auto' }}>
            {Object.values(COLOR_PALETTE).flat().map((color) => {
              const isSelected = selectedColor === color.hex;
              return (
                <Grid item key={`${color.name}-${color.hex}`}>
                  <ButtonBase
                    onClick={() => handleColorChange(color.hex)}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: color.hex,
                      border: isSelected ? 3 : 1,
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      transition: 'all 0.2s'
                    }}
                    title={color.name}
                  >
                    {isSelected && (
                      <CheckIcon sx={{ color: getTextColor(color.hex), fontSize: 20 }} />
                    )}
                  </ButtonBase>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Pattern Selection */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Pattern:
          </Typography>
          <Grid container spacing={1}>
            {availablePatterns.map((pattern) => {
              const isSelected = selectedPattern === pattern.id;
              const isDefault = pattern.id === 'default';

              return (
                <Grid item xs={3} key={pattern.id}>
                  <ButtonBase
                    onClick={() => handlePatternChange(pattern.id)}
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      p: 0.5,
                      border: isSelected ? 3 : 1,
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    title={pattern.name}
                  >
                    {isDefault ? (
                      <Box sx={{
                        width: '100%',
                        height: 50,
                        background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)',
                        backgroundSize: '8px 8px',
                        backgroundPosition: '0 0, 4px 4px',
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
                        height: 50,
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

                    {isSelected && (
                      <Box sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 16,
                        height: 16,
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
                </Grid>
              );
            })}
          </Grid>
        </Box>
        {/* Apply to All Parts Button - NEW FEATURE */}
        {isTwoToneSelector && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowConfirmDialog(true)}
              sx={{
                borderStyle: 'dashed',
                borderWidth: 2,
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
          PaperProps={{
            sx: { 
              borderRadius: 3, 
              p: 2,
              maxWidth: 400
            }
          }}
        >

          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" component="div" fontWeight="bold">
              Apply to All Parts?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will apply the selected color and pattern to all <strong>12 customizable parts</strong>.
              <br /><br />
              Any existing customizations will be overridden.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setShowConfirmDialog(false)} 
              color="inherit"
              variant="outlined"
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
            >
              Apply to All
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}


export default PartCustomizationPopup;
