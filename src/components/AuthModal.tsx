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
import { loginUser, registerUser, clearError, logoutUser } from '@/store/authSlice';
import { apiService } from '@/utils/api';
// import TwoFactorAuthModal from './TwoFactorAuthModal';

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
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
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

  // Two-factor authentication state (commented out for now)
  // const [showTwoFactor, setShowTwoFactor] = useState(false);
  // const [pendingLoginEmail, setPendingLoginEmail] = useState('');

  // Redux state
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state: any) => state.auth);

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
    company_name: '',
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
        company_name: '',
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
      setSnackbar({
        open: true,
        message: result.payload as string || 'Login failed. Please try again.',
        severity: 'error',
      });
    } else if (loginUser.fulfilled.match(result)) {
      // Two-factor authentication is commented out for now
      // setPendingLoginEmail(signInForm.email);
      // setShowTwoFactor(true);
      setJustAuthenticated(true);
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
      company_name: signUpForm.company_name,
    }));

    // Check if registration failed
    if (registerUser.rejected.match(result)) {
      setSnackbar({
        open: true,
        message: result.payload as string || 'Registration failed. Please try again.',
        severity: 'error',
      });
    } else if (registerUser.fulfilled.match(result)) {
      setJustAuthenticated(true);
    }
  };

  const handleClose = () => {
    onClose();
    dispatch(clearError());
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
      company_name: '',
    });
    setTabValue(0);
    setJustAuthenticated(false);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    // Two-factor authentication is commented out for now
    // setShowTwoFactor(false);
    // setPendingLoginEmail('');
    // Reset country code to default
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleForgotPassword = async () => {
    console.log('handleForgotPassword called with email:', forgotPasswordEmail);
    
    if (!forgotPasswordEmail.trim()) {
      console.log('Email is empty');
      setSnackbar({
        open: true,
        message: 'Please enter your email address',
        severity: 'warning',
      });
      return;
    }

    if (!forgotPasswordEmail.includes('@')) {
      console.log('Email format is invalid');
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'warning',
      });
      return;
    }

    console.log('Starting forgot password API call...');
    setForgotPasswordLoading(true);
    try {
      console.log('Calling apiService.forgotPassword...');
      const result = await apiService.forgotPassword(forgotPasswordEmail);
      console.log('API call successful:', result);
      setSnackbar({
        open: true,
        message: 'Password reset email sent successfully! Please check your email and click the reset link to set a new password.',
        severity: 'success',
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error: any) {
      console.error('API call failed:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to send password reset email. Please try again.',
        severity: 'error',
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Two-factor authentication handlers (commented out for now)
  // const handleTwoFactorSuccess = () => {
  //   setShowTwoFactor(false);
  //   setJustAuthenticated(true);
  //   setSnackbar({
  //     open: true,
  //     message: 'Two-factor authentication successful! Login completed.',
  //     severity: 'success',
  //   });
  // };

  // const handleTwoFactorClose = () => {
  //   setShowTwoFactor(false);
  //   setPendingLoginEmail('');
  //   // If user closes 2FA modal without completing verification, log them out
  //   // since they haven't completed the full authentication process
  //   dispatch(logoutUser());
  // };

  // Common field styles - matching ContactPage exactly
  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: '35px',
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
      transform: 'translate(14px, 8px) scale(1)',
      '&.Mui-focused': {
        color: 'primary.main',
        transform: 'translate(14px, -9px) scale(0.75)',
      },
      '&.MuiFormLabel-filled': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
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
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: '#DA291C',
              fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1rem', lg: '1.3rem', xl: '1.4rem', xxl: '1.67rem' },
              textAlign: 'center',
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {tabValue === 0 ? 'Login' : 'Sign Up'}
          </Typography>
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

        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="authentication tabs"
              centered
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  textTransform: 'none',
                  py: { xs: 1.25, sm: 1.5, md: 1, lg: 1, xl: 1, xxl: 1},
                  minHeight: { xs: '44px', sm: '48px' },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: '#DA291C',
                },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>

          <Box sx={{ overflow: 'hidden' }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ 
                p: { xs: 3, sm: 4, md: 3, lg: 3, xl: 3, xxl: 3},
                pb: { xs: 4, sm: 5, md: 4, lg: 4, xl: 4, xxl: 4},
                maxWidth: '600px',
                mx: 'auto',
                width: '100%'
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    textAlign: 'center',
                    color: 'text.primary'
                  }}
                >
                  Sign in to your account
                </Typography>

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
                    mb: 2,
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

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
                    mb: 1,
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

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
                      console.log('Forgot password button clicked');
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>

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
                      py: { xs: 1, sm: 1.5, lg: 1, md: 1.2 },
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
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ 
                p: { xs: 3, sm: 4, md: 3, lg: 3, xl: 3, xxl: 3},
                pb: { xs: 4, sm: 5, md: 4, lg: 4, xl: 4, xxl: 4},
                maxWidth: '600px',
                mx: 'auto',
                width: '100%'
              }}>
                

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
                    mb: 2,
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
        mb: 2,
        ...commonTextFieldStyles,
        "& .MuiFormHelperText-root": {
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          marginLeft: 0
        },
        "& .MuiInputLabel-root": {
          color: "text.secondary",
          transform: "translate(60px, 8px) scale(1)",
          "&.Mui-focused": {
            color: "primary.main",
            transform: "translate(14px, -9px) scale(0.75)"
          },
          "&.MuiFormLabel-filled": {
            transform: "translate(14px, -9px) scale(0.75)"
          }
        },
        "& .MuiInputBase-input": {
          paddingLeft: "8px !important"
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
                    mb: 2,
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
                  label="Company Name"
                  type="text"
                  value={signUpForm.company_name}
                  onChange={handleSignUpChange('company_name')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSignUp();
                    }
                  }}
                  error={!!errors.company_name}
                  helperText={errors.company_name}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    mb: 2,
                    ...commonTextFieldStyles,
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      marginLeft: 0,
                    },
                  }}
                />

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
                    mb: 2,
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
                    mb: 3,
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
                      py: { xs: 1, sm: 1.5, lg: 1, md: 1.2 },
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
                px: 6,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                letterSpacing: 0.5,
                transition: 'all 0.3s ease',
                minWidth: 180,
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

      {/* Two-Factor Authentication Modal (commented out for now) */}
      {/* 
      <TwoFactorAuthModal
        open={showTwoFactor}
        onClose={handleTwoFactorClose}
        onSuccess={handleTwoFactorSuccess}
        email={pendingLoginEmail}
      />
      */}

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