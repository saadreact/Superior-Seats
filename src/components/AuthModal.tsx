'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, registerUser, clearError, logoutUser, verifyTwoFactor, clearTwoFactorState } from '@/store/authSlice';
import { apiService } from '@/utils/api';
import TwoFactorAuthModal from './TwoFactorAuthModal';

// Zod validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'Choose any city'),
  state: z.string().min(2, 'Select a State'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Track if authentication was just completed
  const [justAuthenticated, setJustAuthenticated] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Email verification state
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  // 2FA state
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // Redux state
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, requiresTwoFactor, twoFactorToken, pendingLoginEmail, emailVerificationRequired } = useAppSelector((state: any) => state.auth);

  // Form states
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  const [signUpForm, setSignUpForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
  });

  const [countryCode] = useState('+1'); // Fixed to US code only
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Close modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
      // Only show success message if we just completed a login/signup action
      if (justAuthenticated) {
        // Determine if it's a login or signup based on the current tab
        const message = tabValue === 0 ? 'Login successful!' : 'Registration successful!';
        setSnackbar({
          open: true,
          message,
          severity: 'success',
        });
        // Reset the flag after showing the message
        setJustAuthenticated(false);
      }
      // Clear signup form after successful registration
      setSignUpForm({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        phone: '', 
        password: '', 
        confirmPassword: '',
        address: '',
        city: '',
        state: '',
      });
    }
  }, [isAuthenticated, onClose, justAuthenticated, tabValue]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error',
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle automatic 2FA modal opening
  useEffect(() => {
    if ((requiresTwoFactor || emailVerificationRequired) && pendingLoginEmail) {
      setShowTwoFactor(true);
      // Automatically resend OTP when 2FA modal opens
      handleResendTwoFactorOtp();
    }
  }, [requiresTwoFactor, emailVerificationRequired, pendingLoginEmail]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    dispatch(clearError());
    setErrors({});
  };

  const handleSignInChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm({
      ...signInForm,
      [field]: event.target.value,
    });
    dispatch(clearError());
    setErrors({});
  };

  const handleSignUpChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
    let value = event.target.value;
    
    setSignUpForm({
      ...signUpForm,
      [field]: value,
    });
    dispatch(clearError());
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateSignIn = () => {
    try {
      signInSchema.parse(signInForm);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateSignUp = () => {
    try {
      signUpSchema.parse(signUpForm);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;

    const result = await dispatch(loginUser({
      email: signInForm.email,
      password: signInForm.password,
    }));

    // Check if login failed
    if (loginUser.rejected.match(result)) {
      // Extract error message properly - handle both string and object payloads
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof result.payload === 'string') {
        errorMessage = result.payload;
      } else if (result.payload && typeof result.payload === 'object') {
        const payload = result.payload as any;
        // Try to extract message from various possible locations in the response
        errorMessage = payload.errors?.message ||  // For nested errors.message
                      payload.message ||            // For direct message
                      payload.error ||              // For error field
                      'Login failed. Please try again.';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } else if (loginUser.fulfilled.match(result)) {
      // If 2FA is not required, set authenticated flag
      if (!result.payload.requiresTwoFactor) {
        setJustAuthenticated(true);
      }
      // If 2FA is required, the useEffect will handle opening the modal
    }
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) return;

    const result = await dispatch(registerUser({
      first_name: signUpForm.first_name,
      last_name: signUpForm.last_name,
      email: signUpForm.email,
      phone: `${countryCode}${signUpForm.phone}`,
      password: signUpForm.password,
      password_confirmation: signUpForm.confirmPassword,
      customer_type: 'retail',
      address: signUpForm.address,
      city: signUpForm.city,
      state: signUpForm.state,
    }));

    // Check if registration failed
    if (registerUser.rejected.match(result)) {
      // Extract error message properly - handle both string and object payloads
      let errorMessage = 'Registration failed. Please try again.';
      
      if (typeof result.payload === 'string') {
        errorMessage = result.payload;
      } else if (result.payload && typeof result.payload === 'object') {
        const payload = result.payload as any;
        // Try to extract message from various possible locations in the response
        errorMessage = payload.errors?.message ||  // For nested errors.message
                      payload.message ||            // For direct message
                      payload.error ||              // For error field
                      'Registration failed. Please try again.';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } else if (registerUser.fulfilled.match(result)) {
      // Show email verification modal instead of directly authenticating
      setPendingVerificationEmail(signUpForm.email);
      setShowEmailVerification(true);
    }
  };

  const handleClose = () => {
    onClose();
    dispatch(clearError());
    dispatch(clearTwoFactorState());
    setErrors({});
    setSignInForm({ email: '', password: '' });
    setSignUpForm({ 
      first_name: '', 
      last_name: '', 
      email: '', 
      phone: '', 
      password: '', 
      confirmPassword: '',
      address: '',
      city: '',
      state: '',
    });
    setTabValue(0);
    setJustAuthenticated(false);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setShowEmailVerification(false);
    setPendingVerificationEmail('');
    setShowTwoFactor(false);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter your email address',
        severity: 'warning',
      });
      return;
    }

    if (!forgotPasswordEmail.includes('@')) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'warning',
      });
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const result = await apiService.forgotPassword(forgotPasswordEmail);
      setSnackbar({
        open: true,
        message: 'Password reset email sent successfully! Please check your email and click the reset link to set a new password.',
        severity: 'success',
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to send password reset email. Please try again.',
        severity: 'error',
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Email verification handlers
  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    // Don't set justAuthenticated to true - user needs to login manually
    setSnackbar({
      open: true,
      message: 'Email verified successfully! Please sign in with your credentials.',
      severity: 'success',
    });
    // Switch to sign in tab after successful verification
    setTabValue(0);
  };

  const handleEmailVerificationClose = () => {
    setShowEmailVerification(false);
    setPendingVerificationEmail('');
    // Switch to sign in tab when user closes verification modal
    setTabValue(0);
    // Don't logout - user can still try to login manually
  };

  // 2FA handlers
  const handleTwoFactorSuccess = () => {
    setShowTwoFactor(false);
    setJustAuthenticated(true);
    dispatch(clearTwoFactorState());
  };

  const handleTwoFactorClose = () => {
    setShowTwoFactor(false);
    dispatch(clearTwoFactorState());
  };

  const handleResendTwoFactorOtp = async () => {
    if (pendingLoginEmail) {
      try {
        await apiService.requestEmailOtp(pendingLoginEmail);
        setSnackbar({
          open: true,
          message: 'New OTP sent to your email!',
          severity: 'success',
        });
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to resend OTP. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  // Common field styles - matching EditProfileModal field sizes
  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: '48px', // Increased from 35px to match EditProfileModal
      backgroundColor: 'rgba(255,255,255,0.8)',
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: 2,
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      transform: 'translate(14px, 12px) scale(1)', // Adjusted for larger height
      '&.Mui-focused': {
        color: 'primary.main',
        transform: 'translate(14px, -9px) scale(0.75)',
      },
      '&.MuiFormLabel-filled': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
    '& .MuiInputBase-input': {
      padding: '12px 14px', // Increased padding to match EditProfileModal
    },
  };

  return (
    <>
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
            maxHeight: isMobile ? '100vh' : { xs: '90vh', sm: '90vh', md: '100vh', lg: '98vh', xl: '65vh' },
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 0,
            height: '50px',
            px: { xs: 2, sm: 3 },
           // pt: { xs: 2, sm: 2.5, md: 2, lg: 2, xl: 2, xxl: 2},
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          }}
        >
          {/* Navigation Links */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            flex: 1,
            mt: { xs: 0, sm: 0, md: 0, lg: -1, xl: -1, xxl: -1},
         
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative'
          }}>
            <Typography
              variant="h6"
              component="div"
              onClick={() => setTabValue(0)}
              sx={{
                fontWeight: 600,
                mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
                color: tabValue === 0 ? '#DA291C' : 'text.secondary',
                fontSize: { xs: '1rem', sm: '1.125rem' },
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#DA291C',
                },
              }}
            >
              Login
            </Typography>
            <Typography
              variant="h6"
              component="div"
              onClick={() => setTabValue(1)}
              sx={{
                fontWeight: 600,
                mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
                color: tabValue === 1 ? '#DA291C' : 'text.secondary',
                fontSize: { xs: '1rem', sm: '1.125rem' },
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#DA291C',
                },
              }}
            >
              Sign Up
            </Typography>
            
            {/* Red indicator line */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '-1px', // Position it right below the divider
                left: tabValue === 0 ? '38%' : '59%', // Position at 38% for Login, 55% for Sign Up
                transform: 'translateX(-50%)', // Center the line on the text
                width: tabValue === 0 ? '52px' : '70px', // Different widths: 35px for Login, 50px for Sign Up
                height: '3px',
                backgroundColor: '#DA291C',
                borderRadius: '2px 2px 0 0',
                transition: 'all 0.3s ease',


              }}
            />
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5, xxl: 1.5},
              mr: { xs: 2, sm: 3, md: 4, lg: -1, xl: -1, xxl: -1},
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

        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>

          <Box sx={{ overflow: 'hidden' }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ 
                p: { xs: 3, sm: 4, md: 1, lg: 1, xl: 1, xxl: 1},
                pb: { xs: 4, sm: 5, md: 1, lg: 1, xl: 1, xxl: 1},
                py: { xs: 0, sm: 0, md: 0, lg: 2, xl: 2, xxl: 2},
                maxWidth: '600px',
                mx: 'auto',
                width: '100%'
              }}>
          

                <Box sx={{ mx: { xs: 2, sm: 3, md: 4, lg: 3, xl: 3 } }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={signInForm.email}
                    onChange={handleSignInChange('email')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSignIn();
                      }
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
                      ...commonTextFieldStyles,
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        marginLeft: 0,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mx: { xs: 2, sm: 3, md: 4, lg: 3, xl: 3 } }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={signInForm.password}
                    onChange={handleSignInChange('password')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSignIn();
                      }
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 1.5,
                      ...commonTextFieldStyles,
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        marginLeft: 0,
                      },
                    }}
                  />
                  
                  {/* Forgot Password Link - positioned right under password field */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        textDecoration: 'underline',
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      }}
                      onClick={() => {
                        setShowForgotPassword(true);
                      }}
                    >
                      Forgot Password?
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mx: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button
                      variant="contained"
                      onClick={handleSignIn}
                      disabled={loading}
                      size="medium"
                      disableRipple={false}
                      TouchRippleProps={{
                        center: true,
                        color: 'rgba(255, 255, 255, 0.3)',
                      }}
                      sx={{
                        px: { xs: 4, sm: 6 },
                        py: { xs: 1, sm: 1.5, lg: 1, md: 1.2 ,},
                        mb: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        letterSpacing: 0.5,
                        transition: 'all 0.3s ease',
                        minWidth: { xs: 160, sm: 180 },
                        width: { xs: '100%', sm: 'auto' },
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: 'none',
                        },
                        '& .MuiTouchRipple-root': {
                          borderRadius: 2,
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                    </Button>
                  </Box>
                </Box>

              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ 
                p: { xs: 3, sm: 4, md: 3, lg: 3, xl: 3, xxl: 3},
                pb: { xs: 4, sm: 5, md: 4, lg: 4, xl: 4, xxl: 4},
                py: { xs: 0, sm: 0, md: 0, lg: 0, xl: 2, xxl: 2},
                maxWidth: '600px',
                mx: 'auto',
                width: '100%',
                maxHeight: { xs: '70vh', sm: '70vh', md: '100vh', lg: '95vh', xl: '80vh' },
                minHeight: { xs: 'auto', sm: 'auto', md: '100vh', lg: '100vh', xl: '70vh' },
                overflowY: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto', xl: 'auto' },
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '3px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              }}>
                

                <Box sx={{ display: 'flex', gap: 2, mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 } }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    type="text"
                    value={signUpForm.first_name}
                    onChange={handleSignUpChange('first_name')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSignUp();
                      }
                    }}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      ...commonTextFieldStyles,
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        marginLeft: 0,
                    
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Last Name"
                    type="text"
                    value={signUpForm.last_name}
                    onChange={handleSignUpChange('last_name')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSignUp();
                      }
                    }}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      ...commonTextFieldStyles,
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        marginLeft: 0,
                      },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={signUpForm.email}
                  onChange={handleSignUpChange('email')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSignUp();
                    }
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

<TextField
      fullWidth
      label="Phone Number"
      type="tel"
      value={signUpForm.phone}
      onChange={(e) => {
        const value = e.target.value;
        // Only allow digits and basic formatting
        const cleanValue = value.replace(/[^\d\s\-\(\)]/g, "");
        setSignUpForm((prev) => ({
          ...prev,
          phone: cleanValue
        }));
        // Clear errors for the field
        setErrors((prev) => ({ ...prev, phone: "" }));
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleSignUp();
        }
      }}
      onFocus={() => setIsPhoneFocused(true)}
      onBlur={() => setIsPhoneFocused(false)}
      error={!!errors.phone}
      helperText={errors.phone}
      variant="outlined"
      size="small"
      inputProps={{
        inputMode: "tel",
        maxLength: 20
      }}
      InputLabelProps={{
        shrink: isPhoneFocused || Boolean(signUpForm.phone) // shrink only on focus or if value exists
      }}
      InputProps={{
        notched: isPhoneFocused || Boolean(signUpForm.phone), // notch only on focus or if value exists
        startAdornment: (
          <InputAdornment position="start">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                pr: 1
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                🇺🇸
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                +1
              </Typography>
              <Box
                sx={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "rgba(0, 0, 0, 0.23)",
                  ml: 0.5
                }}
              />
            </Box>
          </InputAdornment>
        )
      }}
      sx={{
        mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
        ...commonTextFieldStyles,
        "& .MuiFormHelperText-root": {
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          marginLeft: 0
        },
        "& .MuiInputLabel-root": {
          color: "text.secondary",
          transform: "translate(60px, 12px) scale(1)", // Adjusted for larger height
          "&.Mui-focused": {
            color: "primary.main",
            transform: "translate(14px, -9px) scale(0.75)"
          },
          "&.MuiFormLabel-filled": {
            transform: "translate(14px, -9px) scale(0.75)"
          }
        },
        "& .MuiInputBase-input": {
          paddingLeft: "8px !important",
          padding: "12px 14px 12px 8px" // Increased padding to match other fields
        }
      }}
    />


                <TextField
                  fullWidth
                  label="Address"
                  type="text"
                  value={signUpForm.address}
                  onChange={handleSignUpChange('address')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSignUp();
                    }
                  }}
                  error={!!errors.address}
                  helperText={errors.address}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, mb: { xs: 2, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 } }}>
                  <TextField
                    fullWidth
                    label="City"
                    type="text"
                    value={signUpForm.city}
                    onChange={handleSignUpChange('city')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSignUp();
                      }
                    }}
                    error={!!errors.city}
                    helperText={errors.city}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      ...commonTextFieldStyles,
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        marginLeft: 0,
                      },
                    }}
                  />

                  <TextField
                    select
                    fullWidth
                    label="State"
                    value={signUpForm.state}
                    onChange={handleSignUpChange('state')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSignUp();
                      }
                    }}
                    error={!!errors.state}
                    helperText={errors.state}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      ...commonTextFieldStyles,
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        marginLeft: 0,
                      },
                    }}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {US_STATES.map((state) => (
                      <MenuItem key={state.code} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={signUpForm.password}
                  onChange={handleSignUpChange('password')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSignUp();
                    }
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signUpForm.confirmPassword}
                  onChange={handleSignUpChange('confirmPassword')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSignUp();
                    }
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: { xs: 1.3, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.5 },
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Button
                    variant="contained"
                    onClick={handleSignUp}
                    disabled={loading}
                    size="medium"
                    disableRipple={false}
                    TouchRippleProps={{
                      center: true,
                      color: 'rgba(255, 255, 255, 0.3)',
                    }}
                    sx={{
                      px: { xs: 4, sm: 6 },
                      mt: { xs: 1, sm: 1.5, lg: 1, md: 1.2 , xl: 1, xxl: 1},
                      borderRadius: 2,
                      textTransform: 'none',
                      letterSpacing: 0.5,
                      transition: 'all 0.3s ease',
                      minWidth: { xs: 160, sm: 180 },
                      width: { xs: '100%', sm: 'auto' },
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      },
                      '& .MuiTouchRipple-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign Up'}
                  </Button>
                </Box>

              </Box>
            </TabPanel>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '400px',
            width: '90%',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
            px: 3,
            pt: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: '#DA291C',
              fontSize: '1.25rem',
              textAlign: 'center',
              flex: 1,
            }}
          >
            Reset Password
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setShowForgotPassword(false)}
            sx={{
              color: 'grey.500',
              p: 1,
              '&:hover': {
                color: 'grey.700',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Typography>

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleForgotPassword();
              }
            }}
            variant="outlined"
            size="small"
            sx={{ 
              mb: 3,
              ...commonTextFieldStyles,
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              variant="contained"
              onClick={handleForgotPassword}
              disabled={forgotPasswordLoading}
              size="medium"
              disableRipple={false}
              TouchRippleProps={{
                center: true,
                color: 'rgba(255, 255, 255, 0.3)',
              }}
              sx={{
                px: { xs: 4, sm: 6 },
                py: { xs: 1, sm: 1.5, lg: 1, md: 1.2 },
                mb: 3,
                borderRadius: 2,
                textTransform: 'none',
                letterSpacing: 0.5,
                transition: 'all 0.3s ease',
                minWidth: { xs: 160, sm: 180 },
                width: { xs: '100%', sm: 'auto' },
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
                '& .MuiTouchRipple-root': {
                  borderRadius: 2,
                },
              }}
            >
              {forgotPasswordLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      <TwoFactorAuthModal
        open={showEmailVerification}
        onClose={handleEmailVerificationClose}
        onSuccess={handleEmailVerificationSuccess}
        email={pendingVerificationEmail}
        mode="email-verification"
      />

      {/* 2FA Modal */}
        <TwoFactorAuthModal
          open={showTwoFactor}
          onClose={handleTwoFactorClose}
          onSuccess={handleTwoFactorSuccess}
          email={pendingLoginEmail}
          mode={emailVerificationRequired ? "email-verification" : "two-factor"}
          twoFactorToken={twoFactorToken}
        />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthModal;