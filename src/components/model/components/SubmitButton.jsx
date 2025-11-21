import React, { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';

function SubmitButton({ onSubmit, disabled = false }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { isMobile } = useResponsive();

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* Submit Button */}
      <button
        onClick={handleClick}
        disabled={disabled}
        style={{
          position: 'fixed',
          bottom: isMobile ? '15px' : '30px',
          right: isMobile ? '15px' : '30px',
          padding: isMobile ? '10px 20px' : '15px 30px',
          backgroundColor: disabled ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: isMobile ? '13px' : '16px',
          fontWeight: 'bold',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = '#218838';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = '#28a745';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }
        }}
      >
        Submit Design
      </button>

      {/* Confirmation Popup */}
      {showConfirm && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={handleCancel}
          />
          
          {/* Confirmation Dialog */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              border: '2px solid #28a745',
              borderRadius: '12px',
              padding: isMobile ? '20px' : '30px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              zIndex: 10001,
              minWidth: isMobile ? '280px' : '350px',
              maxWidth: isMobile ? '90vw' : 'none',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: isMobile ? '16px' : '20px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Confirm Submission
            </h3>
            <p style={{
              margin: '0 0 25px 0',
              fontSize: isMobile ? '12px' : '14px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              Are you sure you want to submit this design? We will capture images from multiple angles.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SubmitButton;
