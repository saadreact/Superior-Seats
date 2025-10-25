import React, { useState, useEffect, useRef } from 'react';
import { COLOR_PALETTE, COLOR_CATEGORIES } from './config/colorPalette';

const ColorPalettePicker = ({ 
  currentColor, 
  onColorChange, 
  isOpen, 
  onToggle,
  title = "Select Color",
  onOutsideClick, // New prop to handle when another palette opens
  openDirection = 'auto' // New prop to control opening direction
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [shouldOpenLeft, setShouldOpenLeft] = useState(false);
  const paletteRef = useRef(null);
  
  // Detect if palette should open to the left based on position
  useEffect(() => {
    if (isOpen && paletteRef.current && openDirection === 'auto') {
      const rect = paletteRef.current.getBoundingClientRect();
      const paletteWidth = 320;
      const viewportWidth = window.innerWidth;
      
      // If opening to the right would go beyond viewport, open to the left
      setShouldOpenLeft(rect.left + paletteWidth > viewportWidth);
    }
  }, [isOpen, openDirection]);

  // Handle outside clicks - only close when clicking outside ALL palettes
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on any color palette picker
      const clickedOnPalette = event.target.closest('[data-color-palette]');
      if (!clickedOnPalette && isOpen && paletteRef.current && !paletteRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);
  
  // Close this palette when another one opens
  useEffect(() => {
    if (onOutsideClick && isOpen) {
      onOutsideClick(() => {
        if (isOpen) {
          onToggle();
        }
      });
    }
  }, [isOpen, onOutsideClick, onToggle]);

  // Get colors to display based on active category
  const getDisplayColors = () => {
    if (activeCategory === 'all') {
      return Object.values(COLOR_PALETTE).flat();
    }
    return COLOR_PALETTE[activeCategory] || [];
  };

  const displayColors = getDisplayColors();

  // Get text color based on background
  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  if (!isOpen) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            height: '35px',
            backgroundColor: currentColor,
            border: '2px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getTextColor(currentColor),
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          🎨
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }} data-color-palette ref={paletteRef}>
      {/* Color Button */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          height: '35px',
          backgroundColor: currentColor,
          border: '2px solid #007bff',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: getTextColor(currentColor),
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        🎨
      </button>

      {/* Color Palette Dropdown */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '15%',
        transform: 'translate(-50%, -50%)',
        width: '320px',
        maxHeight: '400px',
        backgroundColor: '#ffffff',
        border: '2px solid #007bff',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        zIndex: 9999,
        padding: '12px',
        overflowY: 'auto'
      }}>
        {/* Title */}
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px',
          textAlign: 'center',
          borderBottom: '1px solid #eee',
          paddingBottom: '8px'
        }}>
          {title}
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          marginBottom: '12px'
        }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: activeCategory === 'all' ? '#007bff' : '#ffffff',
              color: activeCategory === 'all' ? '#ffffff' : '#333',
              cursor: 'pointer',
              fontWeight: activeCategory === 'all' ? 'bold' : 'normal'
            }}
          >
            All
          </button>
          {COLOR_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: activeCategory === category ? '#007bff' : '#ffffff',
                color: activeCategory === category ? '#ffffff' : '#333',
                cursor: 'pointer',
                fontWeight: activeCategory === category ? 'bold' : 'normal',
                textTransform: 'capitalize'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Color Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '4px',
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          {displayColors.map((color, index) => {
            const colorId = `${color.name}-${color.hex}`;
            const isSelected = currentColor === color.hex;
            
            return (
            <button
              key={colorId}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onColorChange(color.hex);
                onToggle();
              }}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: color.hex,
                border: isSelected ? '3px solid #007bff' : '2px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              title={color.name}
              onMouseEnter={(e) => {
                e.stopPropagation();
                e.target.style.boxShadow = '0 0 0 2px #007bff';
                e.target.style.zIndex = '10';
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                e.target.style.boxShadow = 'none';
                e.target.style.zIndex = '1';
              }}
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

        {/* Close Button */}
        <div style={{
          marginTop: '10px',
          textAlign: 'center',
          borderTop: '1px solid #eee',
          paddingTop: '8px'
        }}>
          <button
            onClick={onToggle}
            style={{
              padding: '6px 16px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              color: '#666',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPalettePicker;