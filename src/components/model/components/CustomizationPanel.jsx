import React, { useState, useEffect, useMemo } from 'react';
import { AVAILABLE_MODELS, CUSTOMIZATION_OPTIONS } from '../config/assets';
import { COLOR_PALETTE } from '../config/colorPalette';
import ColorPalettePicker from './ColorPalettePicker';
import { getPatternOptionsForModel, patternLoader } from '../utils/PatternLoader';
import { getColorsForFabric, getCollectionsForFabric, getFabricDisplayName } from '../config/fabricColors';

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
  showIndividualControls = false,
  onToggleIndividualControls,
  onMeshHighlight,
  onMeshUnhighlight,
  patternId,
  onPatternChange,
  seatType,
  onSeatTypeChange
}) {
  // State for managing color palette visibility and patterns
  const [showFabricPalette, setShowFabricPalette] = useState(false);
  const [showStitchPalette, setShowStitchPalette] = useState(false);
  const [individualPalettes, setIndividualPalettes] = useState({});
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [patternThumbnails, setPatternThumbnails] = useState({});
  const [hoveredFabric, setHoveredFabric] = useState(null);
  const [hoveredPattern, setHoveredPattern] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  // Function to close other palettes when one opens
  const closeOtherPalettes = (currentPalette) => {
    if (currentPalette !== 'fabric') {
      setShowFabricPalette(false);
    }
    if (currentPalette !== 'stitch') {
      setShowStitchPalette(false);
    }
    if (currentPalette !== 'individual') {
      setIndividualPalettes({});
    }
  };
  
  // Enhanced toggle functions that close other palettes
  const toggleFabricPalette = () => {
    if (!showFabricPalette) {
      closeOtherPalettes('fabric');
    }
    setShowFabricPalette(!showFabricPalette);
  };
  
  const toggleStitchPalette = () => {
    if (!showStitchPalette) {
      closeOtherPalettes('stitch');
    }
    setShowStitchPalette(!showStitchPalette);
  };

  // Toggle individual palette visibility
  const toggleIndividualPalette = (meshName) => {
    const isCurrentlyOpen = individualPalettes[meshName];
    
    if (!isCurrentlyOpen) {
      closeOtherPalettes('individual');
      setIndividualPalettes({ [meshName]: true });
    } else {
      setIndividualPalettes(prev => ({
        ...prev,
        [meshName]: false
      }));
    }
  };
  
  // Get text color based on background
  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };
  
  // Use centralized options from assets.js
  const stitchPresets = CUSTOMIZATION_OPTIONS.stitching.colors.map(color => ({
    name: color.name,
    value: color.hex
  }));
  
  const fabricPresets = CUSTOMIZATION_OPTIONS.colors.primary.map(color => ({
    name: color.name,
    value: color.hex
  }));
  
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
  
  // Get collections for organized display (if available)
  const fabricCollections = useMemo(() => {
    return getCollectionsForFabric(fabricType);
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

  const meshParts = [
    { name: 'base', displayName: 'Base' },
    { name: 'seat_bottom', displayName: 'Seat Bottom' },
    { name: 'seat_bottom_upper', displayName: 'Seat Bottom Upper' },
    { name: 'seat_bottom_lower', displayName: 'Seat Bottom Lower' },
    { name: 'seat_back', displayName: 'Seat Back' },
    { name: 'seat_back_upper', displayName: 'Seat Back Upper' },
    { name: 'seat_back_lower', displayName: 'Seat Back Lower' },
    { name: 'headset_front', displayName: 'Headrest Front' },
    { name: 'headset_back', displayName: 'Headrest Back' },
    { name: 'left_arm_upper', displayName: 'Left Arm Upper' },
    { name: 'right_arm_upper', displayName: 'Right Arm Upper' },
    { name: 'left_arm_lover', displayName: 'Left Arm Lower' },
    { name: 'right_arm_lower', displayName: 'Right Arm Lower' },
    { name: 'bottom_cover', displayName: 'Bottom Cover' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#ffffff',
      padding: '12px',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: 'visible',
      fontFamily: 'Arial, sans-serif',
      borderRight: '2px solid #ccc',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '16px', 
        color: '#333',
        textAlign: 'center',
        borderBottom: '2px solid #eee',
        paddingBottom: '8px'
      }}>
        Seat Customization
      </h2>
      
      {/* FABRIC TYPE SELECTION */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          Fabric Type
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
          {fabricTypeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onFabricTypeChange(option.id)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoverPosition({ x: rect.left + rect.width / 2, y: rect.top });
                setHoveredFabric(option);
              }}
              onMouseLeave={() => setHoveredFabric(null)}
              style={{
                padding: '3px',
                border: fabricType === option.id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '4px',
                background: '#ffffff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                minHeight: '35px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: fabricType === option.id ? '0 2px 8px rgba(0, 123, 255, 0.3)' : 'none'
              }}
              title={option.description}
            >
              {/* Fabric Image */}
              <div style={{
                width: '100%',
                height: '20px',
                backgroundImage: `url(${option.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '2px',
                border: '1px solid #eee'
              }} />
              
              {/* Fabric Name */}
              <div style={{ 
                fontSize: '6px', 
                fontWeight: fabricType === option.id ? 'bold' : 'normal',
                color: fabricType === option.id ? '#007bff' : '#555',
                lineHeight: '1.1',
                textAlign: 'center'
              }}>
                {option.name}
              </div>
              
              {/* Selection Indicator */}
              {fabricType === option.id && (
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  fontSize: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* FABRIC COLOR SECTION */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          Fabric Color
        </h3>
        
        {/* Fabric Color Palette - Always Visible */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '8px'
          }}>
            {/* Color Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '3px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {availableFabricColors.map((color, index) => {
                const colorId = `${color.name}-${color.hex}`;
                const isSelected = fabricColor === color.hex;
                
                return (
                <button
                  key={`fabric-${colorId}`}
                  onClick={() => onFabricColorChange(color.hex)}
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: color.hex,
                    border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={color.name}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #007bff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isSelected && (
                    <span style={{
                      color: getTextColor(color.hex),
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                  )}
                </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
      
      {/* TWO TONE TOGGLE */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          Two Tone
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          background: seatType === 'two-tone' ? '#e7f3ff' : '#ffffff'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '2px'
            }}>
              {seatType === 'two-tone' ? 'Two-Tone Mode Active' : 'Enable Two Tone Mode'}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#666',
              lineHeight: '1.3'
            }}>
              {seatType === 'two-tone' ? 'Right-click on seat parts to customize' : 'Uniform color and pattern'}
            </div>
          </div>
          
          {/* iOS-style Toggle Switch */}
          <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '44px',
            height: '26px',
            cursor: 'pointer',
            flexShrink: 0
          }}>
            <input
              type="checkbox"
              checked={seatType === 'two-tone'}
              onChange={(e) => {
                if (e.target.checked) {
                  onSeatTypeChange('two-tone');
                } else {
                  onSeatTypeChange('single');
                  // Clear mesh customizations when switching to single tone
                  Object.keys(meshCustomizations).forEach(key => {
                    onMeshCustomizationChange(key, {});
                  });
                }
              }}
              style={{
                opacity: 0,
                width: 0,
                height: 0
              }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: seatType === 'two-tone' ? '#34C759' : '#ccc',
              transition: '0.3s',
              borderRadius: '26px'
            }}>
              <span style={{
                position: 'absolute',
                content: '',
                height: '20px',
                width: '20px',
                left: seatType === 'two-tone' ? '21px' : '3px',
                bottom: '3px',
                backgroundColor: 'white',
                transition: '0.3s',
                borderRadius: '50%',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
              }} />
            </span>
          </label>
        </div>
      </div>
      
      
      {/* PATTERN SELECTION SECTION - Only shown for Single Tone */}
      {seatType === 'single' && (
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          Pattern Selection
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '6px'
        }}>
          {availablePatterns.map((pattern, index) => {
            const isSelected = patternId === pattern.id;
            const isDefault = pattern.id === 'default';
            
            return (
              <button
                key={pattern.id}
                onClick={() => onPatternChange(pattern.id)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoverPosition({ x: rect.left + rect.width / 2, y: rect.top });
                  setHoveredPattern(pattern);
                }}
                onMouseLeave={() => setHoveredPattern(null)}
                style={{
                  padding: '4px',
                  border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '4px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  minHeight: '45px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                title={pattern.name}
              >
                {/* Pattern Preview */}
                {isDefault ? (
                  <div style={{
                    width: '100%',
                    height: '35px',
                    background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)',
                    backgroundSize: '6px 6px',
                    backgroundPosition: '0 0, 3px 3px',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: '#666'
                  }}>
                    None
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '35px',
                    backgroundImage: pattern.thumbnail ? `url(${pattern.thumbnail})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '2px',
                    backgroundColor: '#f5f5f5'
                  }} />
                )}
                
                {/* Pattern Name */}
                <div style={{
                  fontSize: '7px',
                  color: isSelected ? '#007bff' : '#666',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  lineHeight: '1.1',
                  textAlign: 'center',
                  wordBreak: 'break-word'
                }}>
                  {pattern.name.replace(' Pattern', '').replace('Pattern ', '')}
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    fontSize: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* STITCHING SECTION */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          Stitching Color
        </h3>
        
        {/* Stitch Color Palette - Always Visible */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '8px'
          }}>
            {/* Color Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '3px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {Object.values(COLOR_PALETTE).flat().map((color, index) => {
                const colorId = `${color.name}-${color.hex}`;
                const isSelected = stitchColor === color.hex;
                
                return (
                <button
                  key={`stitch-${colorId}`}
                  onClick={() => onStitchColorChange(color.hex)}
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: color.hex,
                    border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={color.name}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #007bff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isSelected && (
                    <span style={{
                      color: getTextColor(color.hex),
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                  )}
                </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* INFO MESSAGE FOR TWO-TONE MODE - Now shown inline in toggle */}
      
      {/* INDIVIDUAL MESH CONTROLS - Hidden, functionality moved to right-click */}
      {false && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '16px',
            color: '#555'
          }}>
            Individual Mesh Control
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {meshParts.map((part, index) => {
              const customization = meshCustomizations[part.name] || {};
              const isRightColumn = index % 2 === 1; // Determine if this is in the right column
              return (
                <div key={part.name} style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: '#fafafa'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#333' }}>
                    {part.displayName}
                  </h4>
                  
                  <div>
                    {/* Fabric Color Palette */}
                    <label style={{ fontSize: '10px', color: '#666', marginBottom: '4px', display: 'block' }}>
                      Color:
                    </label>
                    <div
                      onMouseEnter={() => onMeshHighlight && onMeshHighlight(part.name)}
                      onMouseLeave={() => onMeshUnhighlight && onMeshUnhighlight()}
                    >
                      <ColorPalettePicker
                        currentColor={customization.fabricColor || fabricColor}
                        onColorChange={(color) => onMeshCustomizationChange(part.name, {
                          ...customization,
                          fabricColor: color
                        })}
                        isOpen={individualPalettes[part.name]}
                        onToggle={() => toggleIndividualPalette(part.name)}
                        title={`${part.displayName} Color`}
                      />
                    </div>
                  </div>
                  
                  {/* Reset Button */}
                  <button
                    onClick={() => onMeshCustomizationChange(part.name, {})}
                    style={{
                      marginTop: '6px',
                      padding: '3px 6px',
                      border: '1px solid #dc3545',
                      borderRadius: '3px',
                      background: '#ffffff',
                      color: '#dc3545',
                      fontSize: '9px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Reset
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CURRENT SELECTION DISPLAY - Commented out to save space */}
      {false && (
      <div style={{ 
        padding: '12px', 
        background: '#f8f9fa', 
        borderRadius: '6px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
          <strong>Current Selection:</strong>
        </div>
        <div style={{ fontSize: '11px', color: '#888', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div>Model: {AVAILABLE_MODELS.find(m => m.id === modelId)?.name || `Model ${modelId}`}</div>
          <div>Type: {fabricTypeOptions.find(f => f.id === fabricType)?.name || 'Unknown'}</div>
          <div>Pattern: {availablePatterns.find(p => p.id === patternId)?.name || 'None'}</div>
          <div>Color: {fabricColor}</div>
          <div>Stitch: {stitchColor}</div>
          {showIndividualControls && (
            <div style={{ marginTop: '4px', fontSize: '10px' }}>
              Individual: {Object.keys(meshCustomizations).length} parts customized
            </div>
          )}
        </div>
      </div>
      )}


      {/* MODEL SELECTION */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          Model Selection
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {AVAILABLE_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => onModelIdChange(model.id)}
              style={{
                padding: '8px 6px',
                border: modelId === model.id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '4px',
                background: modelId === model.id ? '#e7f3ff' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                fontSize: '12px',
                fontWeight: modelId === model.id ? 'bold' : 'normal',
                color: modelId === model.id ? '#007bff' : '#333'
              }}
              title={model.description}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      
      {/* Fabric Type Hover Popup */}
      {hoveredFabric && (
        <div style={{
          position: 'fixed',
          left: `${hoverPosition.x}px`,
          top: `${hoverPosition.y + 30}px`,
          transform: 'translateX(-50%)',
          width: '200px',
          backgroundColor: 'white',
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '100%',
            height: '140px',
            backgroundImage: `url(${hoveredFabric.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '6px',
            marginBottom: '8px',
            border: '1px solid #ddd'
          }} />
          <div style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '4px',
            textAlign: 'center'
          }}>
            {hoveredFabric.name}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#666',
            textAlign: 'center',
            lineHeight: '1.3'
          }}>
            {hoveredFabric.description}
          </div>
        </div>
      )}
      
      {/* Pattern Hover Popup */}
      {hoveredPattern && hoveredPattern.id !== 'default' && (
        <div style={{
          position: 'fixed',
          left: `${hoverPosition.x}px`,
          top: `${hoverPosition.y - 180}px`,
          transform: 'translateX(-50%)',
          width: '160px',
          backgroundColor: 'white',
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '100%',
            height: '120px',
            backgroundImage: `url(${hoveredPattern.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '6px',
            marginBottom: '8px',
            border: '1px solid #ddd'
          }} />
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center'
          }}>
            {hoveredPattern.name}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomizationPanel;
