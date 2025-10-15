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
  Email as EmailIcon,
} from '@mui/icons-material';
import { apiService } from '@/utils/api';
import { useAppDispatch } from '@/store/hooks';
import { verifyTwoFactor } from '@/store/authSlice';

interface TwoFactorAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email?: string;
  mode?: 'two-factor' | 'email-verification';
  twoFactorToken?: string;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ 
  open, 
  onClose, 
  onSuccess, 
  email,
  mode = 'two-factor',
  twoFactorToken
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();

  // Static verification code for demo purposes
  const STATIC_CODE = '123456';

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCode(['', '', '', '', '', '']);
      setError(null);
      setSuccess(null);
      setLoading(false);
      setShakeAnimation(false);
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

    // Clear error and success when user starts typing
    if (error) {
      setError(null);
    }
    if (success) {
      setSuccess(null);
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
    setSuccess(null);

    try {
      if (mode === 'email-verification') {
        // Use email verification API
        await apiService.verifyEmailOtp(email || '', fullCode);
        setSuccess('Email verified successfully! You can now sign in.');
        // Call success callback after a short delay to show success message
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        // Two-factor authentication - use Redux action
        const result = await dispatch(verifyTwoFactor({
          email: email || '',
          otp: fullCode,
          twoFactorToken: twoFactorToken
        }));
        
        if (verifyTwoFactor.fulfilled.match(result)) {
          setSuccess('2FA verification successful! Logging you in...');
          // Call success callback after a short delay to show success message
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          const errorMessage = result.payload as string || 'Invalid verification code. Please try again.';
          setError(errorMessage);
          triggerShakeAnimation();
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      triggerShakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const triggerShakeAnimation = () => {
    setShakeAnimation(true);
    setTimeout(() => {
      setShakeAnimation(false);
    }, 500);
  };

  const handleClose = () => {
    onClose();
    setCode(['', '', '', '', '', '']);
    setError(null);
    setSuccess(null);
    setLoading(false);
    setShakeAnimation(false);
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (mode === 'email-verification') {
        // Use resend OTP API
        await apiService.requestEmailOtp(email || '');
        setSuccess('New OTP sent to your email!');
      } else {
        // Simulate resend delay for two-factor
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess('New code sent!');
      }
      
      // Reset code
      setCode(['', '', '', '', '', '']);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend code. Please try again.';
      setError(errorMessage);
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
          {mode === 'email-verification' ? (
            <EmailIcon sx={{ color: '#DA291C', fontSize: '1.5rem' }} />
          ) : (
            <SecurityIcon sx={{ color: '#DA291C', fontSize: '1.5rem' }} />
          )}
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: '#DA291C',
              fontSize: { xs: '1.125rem', sm: '1.375rem' },
            }}
          >
            {mode === 'email-verification' ? 'Email Verification' : 'Two-Factor Authentication'}
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
            {mode === 'email-verification' ? 'Enter Email Verification Code' : 'Enter Verification Code'}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.6
            }}
          >
            {mode === 'email-verification' 
              ? 'We have sent a 6-digit verification code to your email address to complete your registration.'
              : 'We have sent a 6-digit verification code to your email address.'
            }
            {email && (
              <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>
                {' '}{email}
              </Box>
            )}
          </Typography>

          {mode === 'two-factor' && (
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Demo Mode:</strong> Please enter the verification code manually.
                <br />
                <strong>Demo Code:</strong> {STATIC_CODE}
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Code Input Fields */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1, 
          mb: 3,
          flexWrap: 'wrap',
          animation: shakeAnimation ? 'shake 0.5s ease-in-out' : 'none',
          '@keyframes shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
          }
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

        {success && (
          <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
            {success}
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

        {/* Demo Instructions - Only show for two-factor mode */}
        {mode === 'two-factor' && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthModal;
