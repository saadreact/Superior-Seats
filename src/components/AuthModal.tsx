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
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
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
import { loginUser, registerUser, clearError } from '@/store/authSlice';

// Zod validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  customer_type: z.enum(['retail', 'wholesale', 'dealer']),
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

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Redux state
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state: any) => state.auth);

  // Form states
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    customer_type: 'retail' as const,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Close modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
      setSuccess('Authentication successful!');
    }
  }, [isAuthenticated, onClose]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    dispatch(clearError());
    setSuccess('');
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
    setSignUpForm({
      ...signUpForm,
      [field]: event.target.value,
    });
    dispatch(clearError());
    setErrors({});
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

    await dispatch(loginUser({
      email: signInForm.email,
      password: signInForm.password,
    }));
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) return;

    await dispatch(registerUser({
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
      password_confirmation: signUpForm.confirmPassword,
      customer_type: signUpForm.customer_type,
    }));
  };

  const handleClose = () => {
    onClose();
    dispatch(clearError());
    setSuccess('');
    setErrors({});
    setSignInForm({ email: '', password: '' });
    setSignUpForm({ name: '', email: '', password: '', confirmPassword: '', customer_type: 'retail' });
    setTabValue(0);
  };

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
           Welcome to Superior Seats
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

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              m: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              m: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {success}
          </Alert>
        )}

        <Box sx={{ overflow: 'hidden' }}>
          <TabPanel value={tabValue} index={0}>
                                                   <Box sx={{ 
                p: { xs: 3, sm: 4, md: 1, lg: 0.5, xl: 1, xxl: 1},
                pb: { xs: 4, sm: 5, md: 3, lg: 2, xl: 3, xxl: 3},
                maxWidth: '400px',
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
                // placeholder="Enter your email"
                 value={signInForm.email}
                 onChange={handleSignInChange('email')}
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
                // placeholder="Enter your password"
                 value={signInForm.password}
                 onChange={handleSignInChange('password')}
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
                  onClick={handleSignIn}
                  disabled={loading}
                  size="medium"
                  sx={{
                    background: 'primary.main',
                    height: '35px',
                    px: 3,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(231, 43, 43, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                </Button>
              </Box>
            </Box>
          </TabPanel>

                     <TabPanel value={tabValue} index={1}>
                                                       <Box sx={{ 
                 py: { xs: 3, sm: 4, md: 5, lg: 0.1, xl: 0.8, xxl: 1},
                 pb: { xs: 4, sm: 5, md: 6, lg: 3, xl: 4, xxl: 5},
                 
                 maxWidth: '400px',
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
                     color: 'text.primary',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     width: '100%',
                    
                   }}
                 >
                   Create your account
                 </Typography>

                               <TextField
                  fullWidth
                  label="Full Name"
                  type="text"
                  value={signUpForm.name}
                  onChange={handleSignUpChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
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
                  label="Email"
                  type="email"
                  value={signUpForm.email}
                  onChange={handleSignUpChange('email')}
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

               <FormControl 
                 fullWidth 
                 size="small"
                 sx={{ 
                   mb: 2,
                   ...commonTextFieldStyles,
                 }}
               >
                 <InputLabel>Customer Type</InputLabel>
                 <Select
                   value={signUpForm.customer_type}
                   label="Customer Type"
                   onChange={handleSignUpChange('customer_type')}
                 >
                   <MenuItem value="retail">Retail</MenuItem>
                   <MenuItem value="wholesale">Wholesale</MenuItem>
                   <MenuItem value="dealer">Dealer</MenuItem>
                 </Select>
               </FormControl>

                               <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={signUpForm.password}
                  onChange={handleSignUpChange('password')}
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
                  sx={{
                    background: 'primary.main',
                    height: '35px',
                    px: 3,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(231, 43, 43, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
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
  );
};

export default AuthModal; 