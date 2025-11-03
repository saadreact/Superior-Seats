import React, { useState, useEffect } from 'react';
import { AVAILABLE_MODELS, CUSTOMIZATION_OPTIONS } from './config/assets';
import { COLOR_PALETTE } from './config/colorPalette';
import ColorPalettePicker from './ColorPalettePicker';
import { getPatternOptionsForModel, patternLoader } from './utils/PatternLoader';

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
  seatType = 'single',
  onSeatTypeChange,
  // API-based props
  vehicleTrimData,
  vehicleTrimLoading,
  variations,
  selectedRecline,
  onReclineChange,
  selectedLumber,
  onLumberChange,
  selectedHeatingCooling,
  onHeatingCoolingChange,
  selectedSeatType,
  onSeatTypeChangeAPI,
  selectedItemType,
  onItemTypeChange,
  selectedSeatStyle,
  onSeatStyleChange,
  selectedMaterialType,
  onMaterialTypeChange,
  selectedIncludedArm,
  onIncludedArmChange
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
    // Original fabric types
    { id: 'leather', name: 'Premium Leather', icon: 'L', description: 'Luxury leather with natural texture', image: '/assets/fabrics/PremiumLeather.png' },
    { id: 'cloth', name: 'Fabric Cloth', icon: 'F', description: 'Soft woven fabric material', image: '/assets/fabrics/FabricCloth.png' },
    { id: 'suede', name: 'Suede Material', icon: 'S', description: 'Soft brushed suede finish', image: '/assets/fabrics/SuedeMaterial.png' },
    { id: 'vinyl', name: 'Synthetic Vinyl', icon: 'V', description: 'Durable synthetic material', image: '/assets/fabrics/SyntheticVinyl.png' },
    { id: 'mesh', name: 'Breathable Mesh', icon: 'M', description: 'Ventilated mesh fabric', image: '/assets/fabrics/BreathableMesh.png' },
    { id: 'carbon', name: 'Carbon Fiber', icon: 'C', description: 'High-tech carbon fiber weave', image: '/assets/fabrics/CarbonFiber.png' },
    // New commercial fabric types
    { id: 'miami-vinyl', name: 'Miami Vinyl\'s', icon: 'MV', description: 'Premium marine-grade vinyl', image: '/assets/fabrics/MiamiVinyl.png' },
    { id: 'ultraleather', name: 'Ultraleather', icon: 'UL', description: 'High-performance synthetic leather', image: '/assets/fabrics/UltraLeather.png' },
    { id: 'brisa-distressed', name: 'Brisa Distressed', icon: 'BD', description: 'Weathered distressed leather look', image: '/assets/fabrics/BrisaDistressed.png' },
    { id: 'carroll-leather', name: 'Carroll Leather', icon: 'CL', description: 'Authentic premium leather collections', image: '/assets/fabrics/CarrollLeather.png' },
  ];
  
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
    { name: 'seat_back_lover', displayName: 'Seat Back Lower' },
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
      padding: '20px',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: 'visible',
      fontFamily: 'Arial, sans-serif',
      borderRight: '2px solid #ccc',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px', 
        color: '#333',
        textAlign: 'center',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px'
      }}>
        Seat Customization
      </h2>
      
      
      
      {/* FABRIC TYPE SELECTION */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '16px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Fabric Type
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
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
                padding: '6px',
                border: fabricType === option.id ? '3px solid #007bff' : '2px solid #ddd',
                borderRadius: '8px',
                background: '#ffffff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                minHeight: '70px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: fabricType === option.id ? '0 2px 8px rgba(0, 123, 255, 0.3)' : 'none'
              }}
              title={option.description}
            >
              {/* Fabric Image */}
              <div style={{
                width: '100%',
                height: '40px',
                backgroundImage: `url(${option.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '4px',
                border: '1px solid #eee'
              }} />
              
              {/* Fabric Name */}
              <div style={{ 
                fontSize: '8px', 
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
                  top: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  fontSize: '11px',
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
      
      {/* TWO TONE TOGGLE */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '16px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Two Tone
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          background: seatType === 'two-tone' ? '#e7f3ff' : '#ffffff'
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '4px'
            }}>
              {seatType === 'two-tone' ? 'Two-Tone Mode Active' : 'Enable Two Tone Mode'}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.4'
            }}>
              {seatType === 'two-tone' ? 'Right-click on seat parts to customize' : 'Uniform color and pattern'}
            </div>
          </div>
          
          {/* iOS-style Toggle Switch */}
          <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '50px',
            height: '28px',
            cursor: 'pointer',
            flexShrink: 0
          }}>
            <input
              type="checkbox"
              checked={seatType === 'two-tone'}
              onChange={(e) => {
                if (!onSeatTypeChange) {
                  console.error('❌ onSeatTypeChange is not defined!');
                  return;
                }
                
                if (e.target.checked) {
                  onSeatTypeChange('two-tone');
                  // Reset pattern to default when switching to two-tone
                  if (patternId !== 'default') {
                    onPatternChange('default');
                  }
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
              borderRadius: '28px'
            }}>
              <span style={{
                position: 'absolute',
                content: '',
                height: '22px',
                width: '22px',
                left: seatType === 'two-tone' ? '25px' : '3px',
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
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '16px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
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
                  padding: '8px',
                  border: isSelected ? '3px solid #007bff' : '1px solid #ddd',
                  borderRadius: '6px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  minHeight: '60px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                title={pattern.name}
              >
                {/* Pattern Preview */}
                {isDefault ? (
                  <div style={{
                    width: '100%',
                    height: '50px',
                    background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    None
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '50px',
                    backgroundImage: pattern.thumbnail ? `url(${pattern.thumbnail})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '3px',
                    backgroundColor: '#f5f5f5'
                  }} />
                )}
                
                {/* Pattern Name */}
                <div style={{
                  fontSize: '9px',
                  color: isSelected ? '#007bff' : '#666',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  lineHeight: '1.2',
                  textAlign: 'center',
                  wordBreak: 'break-word'
                }}>
                  {pattern.name.replace(' Pattern', '').replace('Pattern ', '')}
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    fontSize: '10px',
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
      
      {/* FABRIC COLOR SECTION */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '16px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Fabric Color
        </h3>
        
        {/* Fabric Color Palette - Always Visible */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '12px'
          }}>
            {/* Color Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '4px',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {Object.values(COLOR_PALETTE).flat().map((color, index) => {
                const colorId = `${color.name}-${color.hex}`;
                const isSelected = fabricColor === color.hex;
                
                return (
                <button
                  key={`fabric-${colorId}`}
                  onClick={() => onFabricColorChange(color.hex)}
                  style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: color.hex,
                    border: isSelected ? '3px solid #007bff' : '1px solid #ddd',
                    borderRadius: '4px',
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
                      fontSize: '14px',
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

      {/* STITCHING SECTION */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '16px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Stitching Color
        </h3>
        
        {/* Stitch Color Palette - Always Visible */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '12px'
          }}>
            {/* Color Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '4px',
              maxHeight: '150px',
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
                    width: '35px',
                    height: '35px',
                    backgroundColor: color.hex,
                    border: isSelected ? '3px solid #007bff' : '1px solid #ddd',
                    borderRadius: '4px',
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
                      fontSize: '14px',
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

      {/* VEHICLE FITMENTS SECTION */}
      {vehicleTrimData && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '16px', 
            color: '#555'
          }}>
            Vehicle Fitments
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                Vehicle Make
              </label>
              <input
                type="text"
                value={vehicleTrimData.model?.make?.name || 'Unknown Make'}
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#f5f5f5',
                  color: '#333'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                Vehicle Model
              </label>
              <input
                type="text"
                value={vehicleTrimData.model?.name || 'Unknown Model'}
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#f5f5f5',
                  color: '#333'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                Vehicle Trim
              </label>
              <input
                type="text"
                value={vehicleTrimData.name || 'Unknown Trim'}
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#f5f5f5',
                  color: '#333'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* VARIATION SECTION */}
      {variations && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '16px', 
            color: '#555'
          }}>
            Variation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {variations.recline_types && variations.recline_types.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Recline
                </label>
                <select
                  value={selectedRecline || ''}
                  onChange={(e) => onReclineChange && onReclineChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Recline</option>
                  {variations.recline_types.map((recline) => (
                    <option key={recline.id} value={recline.id.toString()}>
                      {recline.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {variations.lumbar_types && variations.lumbar_types.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Lumbar
                </label>
                <select
                  value={selectedLumber || ''}
                  onChange={(e) => onLumberChange && onLumberChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Lumbar</option>
                  {variations.lumbar_types.map((lumber) => (
                    <option key={lumber.id} value={lumber.id.toString()}>
                      {lumber.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {variations.heat_options && variations.heat_options.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Heating and Cooling
                </label>
                <select
                  value={selectedHeatingCooling || ''}
                  onChange={(e) => onHeatingCoolingChange && onHeatingCoolingChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Heating/Cooling</option>
                  {variations.heat_options.map((heatingCooling) => (
                    <option key={heatingCooling.id} value={heatingCooling.id.toString()}>
                      {heatingCooling.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEAT SECTION */}
      {variations && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '16px', 
            color: '#555'
          }}>
            Seat
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {variations.seat_types && variations.seat_types.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Seat Type
                </label>
                <select
                  value={selectedSeatType || ''}
                  onChange={(e) => onSeatTypeChange && onSeatTypeChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Seat Type</option>
                  {variations.seat_types.map((seatType) => (
                    <option key={seatType.id} value={seatType.id.toString()}>
                      {seatType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {variations.item_types && variations.item_types.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Item Type
                </label>
                <select
                  value={selectedItemType || ''}
                  onChange={(e) => onItemTypeChange && onItemTypeChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Item Type</option>
                  {variations.item_types.map((itemType) => (
                    <option key={itemType.id} value={itemType.id.toString()}>
                      {itemType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {variations.seat_styles && variations.seat_styles.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Seat Style
                </label>
                <select
                  value={selectedSeatStyle || ''}
                  onChange={(e) => onSeatStyleChange && onSeatStyleChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Seat Style</option>
                  {variations.seat_styles.map((seatStyle) => (
                    <option key={seatStyle.id} value={seatStyle.id.toString()}>
                      {seatStyle.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {variations.material_types && variations.material_types.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Material Type
                </label>
                <select
                  value={selectedMaterialType || ''}
                  onChange={(e) => onMaterialTypeChange && onMaterialTypeChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Material Type</option>
                  {variations.material_types.map((materialType) => (
                    <option key={materialType.id} value={materialType.id.toString()}>
                      {materialType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {variations.arm_types && variations.arm_types.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                  Included Arm
                </label>
                <select
                  value={selectedIncludedArm || ''}
                  onChange={(e) => onIncludedArmChange && onIncludedArmChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    color: '#333'
                  }}
                >
                  <option value="" disabled>Select Included Arm</option>
                  {variations.arm_types.map((includedArm) => (
                    <option key={includedArm.id} value={includedArm.id.toString()}>
                      {includedArm.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INDIVIDUAL CONTROLS TOGGLE */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={onToggleIndividualControls}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #007bff',
            borderRadius: '6px',
            background: showIndividualControls ? '#007bff' : '#ffffff',
            color: showIndividualControls ? '#ffffff' : '#007bff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          {showIndividualControls ? 'Hide Individual Controls' : 'Show Individual Controls'}
        </button>
      </div>
      
      {/* INDIVIDUAL MESH CONTROLS */}
      {showIndividualControls && (
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

      {/* CURRENT SELECTION DISPLAY */}
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


      {/* MODEL SELECTION */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '16px', 
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Model Selection
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {AVAILABLE_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => onModelIdChange(model.id)}
              style={{
                padding: '12px 8px',
                border: modelId === model.id ? '2px solid #007bff' : '5px solid #ddd',
                borderRadius: '6px',
                background: modelId === model.id ? '#292f2fff' : '#292f2fff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                fontWeight: modelId === model.id ? 'bold' : 'normal'
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
          top: `${hoverPosition.y - 220}px`,
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
