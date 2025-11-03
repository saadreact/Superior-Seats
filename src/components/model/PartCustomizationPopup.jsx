import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { COLOR_PALETTE } from './config/colorPalette';
import { getPatternOptionsForModel } from './utils/PatternLoader';

function PartCustomizationPopup({ 
  partName, 
  position, 
  onClose, 
  currentCustomization,
  onApply,
  modelId,
  seatType,
  fabricColor
}) {
  // Use the darkened color from the 3D model as initial color if not customized
  const getInitialColor = () => {
    if (currentCustomization?.fabricColor) {
      return currentCustomization.fabricColor;
    }
    // Calculate the darkened color (same as in Model3D.jsx)
    const color = new THREE.Color(fabricColor);
    color.multiplyScalar(0.8);
    return '#' + color.getHexString();
  };
  
  const [selectedColor, setSelectedColor] = useState(getInitialColor());
  const [selectedPattern, setSelectedPattern] = useState(currentCustomization?.patternId || 'default');
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
      'seat_back_upper': 'Seat Back Upper',
      'seat_back_lover': 'Seat Back Lower',
      'headset_front': 'Headrest Front',
      'headset_back': 'Headrest Back',
      'left_arm_upper': 'Left Arm Upper',
      'right_arm_upper': 'Right Arm Upper'
    };
    return nameMap[name] || name;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 9999
        }}
        onClick={onClose}
      />
      
      {/* Popup */}
      <div
        style={{
          position: 'fixed',
          left: 'calc(30% + 20px)', // Account for 30% customization panel width + 20px margin
          top: '80px', // Below the environment buttons
          backgroundColor: 'white',
          border: '2px solid #007bff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          zIndex: 10000,
          minWidth: '320px',
          maxWidth: '380px',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '2px solid #eee'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          color: '#333',
          fontWeight: 'bold'
        }}>
          Customize {getDisplayName(partName)}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#999',
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>

      {/* Color Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#555',
          marginBottom: '10px'
        }}>
          Color:
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '6px',
          maxHeight: '150px',
          overflowY: 'auto',
          padding: '5px'
        }}>
          {Object.values(COLOR_PALETTE).flat().map((color) => {
            const isSelected = selectedColor === color.hex;
            return (
              <button
                key={`${color.name}-${color.hex}`}
                onClick={() => handleColorChange(color.hex)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: color.hex,
                  border: isSelected ? '3px solid #007bff' : '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={color.name}
              >
                {isSelected && (
                  <span style={{
                    color: getTextColor(color.hex),
                    fontSize: '16px',
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

      {/* Pattern Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#555',
          marginBottom: '10px'
        }}>
          Pattern:
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          {availablePatterns.map((pattern) => {
            const isSelected = selectedPattern === pattern.id;
            const isDefault = pattern.id === 'default';
            
            return (
              <button
                key={pattern.id}
                onClick={() => handlePatternChange(pattern.id)}
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
                  position: 'relative'
                }}
                title={pattern.name}
              >
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
                    fontSize: '10px',
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

      </div>
    </>
  );
}

export default PartCustomizationPopup;
