import React from 'react';

function InfoPopup({ onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '4px 8px',
            lineHeight: 1
          }}
        >
          ×
        </button>

        {/* Content */}
        <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#333', fontSize: '24px' }}>
          Two-Tone Mode Guide
        </h2>

        <div style={{ color: '#555', lineHeight: '1.6' }}>
          {/* Getting Started */}
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#222', fontSize: '18px', marginBottom: '12px' }}>
              🎨 Getting Started
            </h3>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                A popup will appear - select your desired <strong>color</strong> and <strong>pattern</strong>
              </li>
              <li style={{ marginBottom: '8px' }}>
                Click on chair parts in the 3D view to apply customizations
              </li>
            </ol>
          </section>

          {/* 4-State Click Cycle */}
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#222', fontSize: '18px', marginBottom: '12px' }}>
              🔄 4-State Click Cycle
            </h3>
            <p style={{ marginBottom: '12px' }}>
              Each part goes through 4 states when you click it repeatedly:
            </p>
            <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#28a745' }}>1st Click:</strong> Apply custom color only (no pattern/stitching)
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#28a745' }}>2nd Click:</strong> Add pattern and stitching
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#28a745' }}>3rd Click:</strong> Remove pattern/stitching (keep custom color)
              </div>
              <div>
                <strong style={{ color: '#28a745' }}>4th Click:</strong> Reset to base color from single-tone mode
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              💡 After the 4th click, the cycle starts over from the 1st click state.
            </p>
          </section>

          {/* Changing Colors & Patterns */}
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#222', fontSize: '18px', marginBottom: '12px' }}>
              🎯 Changing Color & Pattern
            </h3>
            <p style={{ margin: 0 }}>
              Keep the color/pattern popup open while working. You can change the selected color 
              or pattern at any time - the next part you click will use the newly selected options.
            </p>
          </section>

          {/* Reset Model */}
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#222', fontSize: '18px', marginBottom: '12px' }}>
              🔄 Reset Model
            </h3>
            <p style={{ margin: 0 }}>
              Click the <strong>&quot;Reset Model&quot;</strong> button (bottom-left corner) to clear all 
              customizations and return to default settings. If you&apos;re in two-tone mode, the 
              color/pattern popup will reappear automatically.
            </p>
          </section>

          {/* Tips */}
          <section>
            <h3 style={{ color: '#222', fontSize: '18px', marginBottom: '12px' }}>
              💡 Tips
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                You can customize up to 8 different parts (seat, backrest, headrest, arms)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Each part can have different colors and patterns
              </li>
              <li style={{ marginBottom: '8px' }}>
                If you click a non-editable area, valid parts will glow yellow briefly
              </li>
              <li>
                Switch between &quot;Single Tone&quot; and &quot;Two Tone&quot; modes to compare designs
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default InfoPopup;
