import React, { useEffect, useState } from 'react';

function Toast({ message, duration = 2500, type = 'info', index = 0 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(40, 167, 69, 0.95)';
      case 'error':
        return 'rgba(220, 53, 69, 0.95)';
      case 'warning':
        return 'rgba(255, 193, 7, 0.95)';
      default:
        return 'rgba(0, 123, 255, 0.95)';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '15px',
        fontWeight: '500',
        backdropFilter: 'blur(10px)',
        animation: `slideDown 0.3s ease-out, ${isVisible ? '' : 'fadeOut 0.3s ease-out'}`,
        minWidth: '250px',
        maxWidth: '500px',
        pointerEvents: 'auto'
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{getIcon()}</span>
      <span>{message}</span>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;
