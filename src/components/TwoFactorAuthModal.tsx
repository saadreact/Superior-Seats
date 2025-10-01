'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

interface TwoFactorAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email?: string;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ 
  open, 
  onClose, 
  onSuccess, 
  email 
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Static verification code for demo purposes
  const STATIC_CODE = '123456';

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCode(['', '', '', '', '', '']);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1]?.querySelector('input');
      nextInput?.focus();
    }

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1]?.querySelector('input');
      prevInput?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedCode = text.replace(/\D/g, '').slice(0, 6);
        if (pastedCode.length === 6) {
          const codeArray = pastedCode.split('');
          setCode(codeArray);
          const lastInput = inputRefs.current[5]?.querySelector('input');
          lastInput?.focus();
        }
      });
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Static verification - accept the static code or any 6-digit code for demo
      if (fullCode === STATIC_CODE || /^\d{6}$/.test(fullCode)) {
        onSuccess();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setCode(['', '', '', '', '', '']);
    setError(null);
    setLoading(false);
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate resend delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset code
      setCode(['', '', '', '', '', '']);
      
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? '100vh' : 'auto',
          maxWidth: isMobile ? '100%' : '450px',
          width: isMobile ? '100%' : '90%',
          maxHeight: isMobile ? '100vh' : '90vh',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'center' }}>
          <SecurityIcon sx={{ color: '#DA291C', fontSize: '1.5rem' }} />
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: '#DA291C',
              fontSize: { xs: '1.125rem', sm: '1.375rem' },
            }}
          >
            Two-Factor Authentication
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: 'grey.500',
            p: { xs: 0.75, sm: 1 },
            '&:hover': {
              color: 'grey.700',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'text.primary'
            }}
          >
            Enter Verification Code
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.6
            }}
          >
            We have sent a 6-digit verification code to your email address.
            {email && (
              <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>
                {' '}{email}
              </Box>
            )}
          </Typography>

          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Demo Mode:</strong> Please enter the verification code manually.
              <br />
              <strong>Demo Code:</strong> {STATIC_CODE}
            </Typography>
          </Alert>
        </Box>

        {/* Code Input Fields */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1, 
          mb: 3,
          flexWrap: 'wrap'
        }}>
          {code.map((digit, index) => (
            <TextField
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
                style: { 
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  padding: '12px 8px'
                }
              }}
              sx={{
                width: { xs: '45px', sm: '50px' },
                height: { xs: '45px', sm: '50px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: { xs: '45px', sm: '50px' },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputBase-input': {
                  padding: 0,
                },
              }}
              disabled={loading}
            />
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={loading || code.join('').length !== 6}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              letterSpacing: 0.5,
              minWidth: 200,
              backgroundColor: '#DA291C',
              '&:hover': {
                backgroundColor: '#B71C1C',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Verify Code'
            )}
          </Button>

          <Button
            variant="text"
            onClick={handleResendCode}
            disabled={loading}
            sx={{
              textTransform: 'none',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            Resend Code
          </Button>
        </Box>

        {/* Demo Instructions */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            <strong>Demo Instructions:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'left' }}>
            • Enter the 6-digit code manually
            <br />
            • Use any 6-digit number to verify
            <br />
            • Demo code: {STATIC_CODE}
          
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthModal;
