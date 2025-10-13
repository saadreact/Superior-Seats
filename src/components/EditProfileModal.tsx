"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { apiService } from "@/utils/api";
import { 
  FormField, 
  SelectField, 
  PhoneField,
  FormActions
} from '@/components/common/FormComponents';
import { US_STATES } from '@/api/customers';

// Zod validation schema - only editable fields
const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "Select a State"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  // Address fields
  shipping_address: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_zip: z.string().optional(),
  billing_address: z.string().optional(),
  billing_city: z.string().optional(),
  billing_state: z.string().optional(),
  billing_zip: z.string().optional(),
});

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any; // Pass the full user object with role data
  onProfileUpdated?: (updatedCustomer: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  user,
  onProfileUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [countryCode] = useState("+1"); // Fixed to US code only

  // Store non-editable values from API response
  const [customerData, setCustomerData] = useState<{
    customer_type: string;
    price_tier_id: number;
    is_active: boolean;
  } | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Form state - only editable fields
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    company_name: "",
    // Shipping Address Fields
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    // Billing Address Fields
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Load customer profile data
  useEffect(() => {
    if (open && user && user.role) {
      loadCustomerFromAPI();
    }
  }, [open, user]);

  // Load customer data using the customer API
  const loadCustomerFromAPI = async () => {
    try {
      setLoading(true);
      console.log("🔍 Loading customer from API. User data:", user);
      console.log("🔍 User role data:", user.role);

      // First, we need to find the customer ID
      // The role object should have an ID field that represents the customer ID
      const customerId = user.role?.id;

      if (!customerId) {
        throw new Error(
          "Customer ID not found in user role. Please contact support."
        );
      }

      console.log("🔍 Found customer ID:", customerId);
      setCustomerId(customerId);

      // Now call the customer API to get the full customer data
      console.log("🔍 Calling customer API for ID:", customerId);
      const response = await apiService.getCustomer(customerId);
      console.log("🔍 Customer API response:", response);

      // Handle the API response structure
      const customer = response.data?.data || response.data || response;
      console.log("🔍 Extracted customer data:", customer);

      // Extract addresses from the addresses array and add them as direct properties
      if (customer.addresses && Array.isArray(customer.addresses)) {
        const shippingAddress = customer.addresses.find((addr: any) => addr.type === 'shipping');
        const billingAddress = customer.addresses.find((addr: any) => addr.type === 'billing');
        
        // Add address data as direct properties for the form
        customer.shipping_address = shippingAddress?.street || '';
        customer.shipping_city = shippingAddress?.city || '';
        customer.shipping_state = shippingAddress?.state || '';
        customer.shipping_zip = shippingAddress?.postal_code || '';
        
        customer.billing_address = billingAddress?.street || '';
        customer.billing_city = billingAddress?.city || '';
        customer.billing_state = billingAddress?.state || '';
        customer.billing_zip = billingAddress?.postal_code || '';
      }

      // Store non-editable values from API response
      setCustomerData({
        customer_type: customer.customer_type || "retail",
        price_tier_id: customer.price_tier_id || 1,
        is_active: customer.is_active !== undefined ? customer.is_active : true,
      });

      // Load the form data from the API response (only editable fields)
      const name = customer.name || "";
      const firstNameFromName = name.split(" ")[0] || "";
      const lastNameFromName = name.split(" ").slice(1).join(" ") || "";

      // Extract phone number from existing phone (assuming US format)
      const existingPhone = customer.phone || "";
      let phoneNumber = "";

      if (existingPhone.startsWith("US +1")) {
        // Remove +1 prefix for US numbers
        phoneNumber = existingPhone.substring(2);
      } else if (existingPhone.startsWith("+1")) {
        // Remove +1 prefix for US numbers
        phoneNumber = existingPhone.substring(2);
      } else if (existingPhone.startsWith("+")) {
        // For other country codes, just remove the + and first digit
        phoneNumber = existingPhone.substring(2);
      } else {
        phoneNumber = existingPhone;
      }

      const formDataToSet = {
        first_name: customer.first_name || firstNameFromName || "",
        last_name: customer.last_name || lastNameFromName || "",
        email: customer.email || "",
        phone: phoneNumber,
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        company_name: customer.company_name || "",
        // Shipping Address Fields
        shipping_address: customer.shipping_address || "",
        shipping_city: customer.shipping_city || "",
        shipping_state: customer.shipping_state || "",
        shipping_zip: customer.shipping_zip || "",
        // Billing Address Fields
        billing_address: customer.billing_address || "",
        billing_city: customer.billing_city || "",
        billing_state: customer.billing_state || "",
        billing_zip: customer.billing_zip || "",
      };

      console.log("🔍 Setting form data from API:", formDataToSet);
      console.log("🔍 Storing non-editable data:", {
        customer_type: customer.customer_type || "retail",
        price_tier_id: customer.price_tier_id || 1,
        is_active: customer.is_active !== undefined ? customer.is_active : true,
      });
      setFormData(formDataToSet);
    } catch (error: any) {
      console.error("❌ Error loading customer from API:", error);
      setSnackbar({
        open: true,
        message:
          error.message ||
          "Failed to load customer profile. Please contact support.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear client-side error when user starts typing
    if ((errors as any)[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      console.log("Submitting customer data:", formData);

      // Convert form data to match the customer API structure (same as curl example)
      // Use stored non-editable values from the GET API response
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: `+1${formData.phone}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        company_name: formData.company_name,
        customer_type: customerData?.customer_type || "retail",
        price_tier_id: customerData?.price_tier_id || 1,
        is_active:
          customerData?.is_active !== undefined ? customerData.is_active : true,
        // Shipping Address Object
        shipping_address: {
          street: formData.shipping_address || '',
          city: formData.shipping_city || '',
          state: formData.shipping_state || '',
          postal_code: formData.shipping_zip || '',
          country: 'US',
          phone: `+1${formData.phone}`,
          is_default: true
        },
        // Billing Address Object
        billing_address: {
          street: formData.billing_address || '',
          city: formData.billing_city || '',
          state: formData.billing_state || '',
          postal_code: formData.billing_zip || '',
          country: 'US',
          phone: `+1${formData.phone}`,
          is_default: true
        }
      };

      // Use the centralized API service
      if (!customerId) {
        throw new Error("Customer ID not found");
      }
      const updatedCustomer = await apiService.updateCustomer(
        customerId!,
        updateData
      );
      console.log("Customer updated successfully:", updatedCustomer);

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      // Call the callback to update parent component
      if (onProfileUpdated) {
        onProfileUpdated(updatedCustomer);
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Error updating customer profile:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update customer profile",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            minHeight: isMobile ? "100vh" : "auto",
            maxWidth: isMobile ? "100%" : "1200px",
            width: isMobile ? "100%" : "95%",
            maxHeight: isMobile ? "100vh" : "95vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 0,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 2.5 },
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="div"
            sx={{
              fontWeight: 600,
              color: "#DA291C",
              fontSize: {
                xs: "1.125rem",
                sm: "1.375rem",
                md: "1rem",
                lg: "1.3rem",
                xl: "1.4rem",
                xxl: "1.67rem",
              },
              textAlign: "center",
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Edit Profile
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "grey.500",
              p: { xs: 0.75, sm: 1 },
              "&:hover": {
                color: "grey.700",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                overflow: "auto",
                backgroundColor: "#fafafa",
                minHeight: "70vh",
                maxHeight: { 
                  xs: "none", 
                  sm: "none", 
                  md: "80vh", 
                  lg: "85vh", 
                  xl: "90vh" 
                },
                p: { xs: 2, sm: 3, md: 2, lg: 2, xl: 2 },
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#c1c1c1',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#a8a8a8',
                  },
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  p: { xs: 2, sm: 3, md: 4, lg: 2, xl: 2 },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  maxWidth: "100%",
                  mx: "auto",
                }}
              >
              {/* Basic Information */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                  Basic Information
                </Typography>
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="first_name"
                    label="First Name"
                    value={formData.first_name}
                    onChange={(value) => handleFieldChange('first_name', value)}
                    required
                    error={errors.first_name}
                  />

                  <FormField
                    name="last_name"
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(value) => handleFieldChange('last_name', value)}
                    required
                    error={errors.last_name}
                  />

                  <FormField
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(value) => handleFieldChange('email', value)}
                    type="email"
                    required
                    error={errors.email}
                  />

                  <PhoneField
                    name="phone"
                    value={formData.phone}
                    onChange={(value) => handleFieldChange('phone', value)}
                    required
                    error={errors.phone}
                  />
                </Grid>
              </Box>

              {/* Contact Information */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Contact Information
                </Typography>
                
                {/* Address Row */}
                <Box sx={{ mb: 1.5 }}>
                  <FormField
                    name="address"
                    label="Address"
                    value={formData.address}
                    onChange={(value) => handleFieldChange('address', value)}
                    required
                    error={errors.address}
                  />
                </Box>

                {/* City, State, Company Name Row */}
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={(value) => handleFieldChange('city', value)}
                    error={errors.city}
                  />

                  <SelectField
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={(value) => handleFieldChange('state', value)}
                    options={US_STATES.map(state => ({
                      value: state.value,
                      label: state.label
                    }))}
                    error={errors.state}
                  />

                  <FormField
                    name="company_name"
                    label="Company Name"
                    value={formData.company_name}
                    onChange={(value) => handleFieldChange('company_name', value)}
                    error={errors.company_name}
                  />
                </Grid>
              </Box>

              {/* Shipping Address */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Shipping Address
                </Typography>
                
                {/* Address Row */}
                <Box sx={{ mb: 1.5 }}>
                  <FormField
                    name="shipping_address"
                    label="Address"
                    value={formData.shipping_address}
                    onChange={(value) => handleFieldChange('shipping_address', value)}
                    error={errors.shipping_address}
                  />
                </Box>

                {/* City, State, ZIP Code Row */}
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="shipping_city"
                    label="City"
                    value={formData.shipping_city}
                    onChange={(value) => handleFieldChange('shipping_city', value)}
                    error={errors.shipping_city}
                  />

                  <SelectField
                    name="shipping_state"
                    label="State"
                    value={formData.shipping_state}
                    onChange={(value) => handleFieldChange('shipping_state', value)}
                    options={US_STATES.map(state => ({
                      value: state.value,
                      label: state.label
                    }))}
                    error={errors.shipping_state}
                  />

                  <FormField
                    name="shipping_zip"
                    label="ZIP Code"
                    value={formData.shipping_zip}
                    onChange={(value) => handleFieldChange('shipping_zip', value)}
                    error={errors.shipping_zip}
                  />
                </Grid>
              </Box>

              {/* Billing Address */}
              <Box sx={{ mb: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1 
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Billing Address
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        billing_address: prev.shipping_address,
                        billing_city: prev.shipping_city,
                        billing_state: prev.shipping_state,
                        billing_zip: prev.shipping_zip
                      }));
                    }}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      textTransform: 'none',
                      minWidth: { xs: 'auto', sm: '140px' },
                      height: { xs: 32, sm: 36 },
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    Copy from Shipping
                  </Button>
                </Box>
                {/* Address Row */}
                <Box sx={{ mb: 1.5 }}>
                  <FormField
                    name="billing_address"
                    label="Address"
                    value={formData.billing_address}
                    onChange={(value) => handleFieldChange('billing_address', value)}
                    error={errors.billing_address}
                  />
                </Box>

                {/* City, State, ZIP Code Row */}
                <Grid
                  display="grid"
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
                  gap={{ xs: 1, md: 1.5 }}
                >
                  <FormField
                    name="billing_city"
                    label="City"
                    value={formData.billing_city}
                    onChange={(value) => handleFieldChange('billing_city', value)}
                    error={errors.billing_city}
                  />

                  <SelectField
                    name="billing_state"
                    label="State"
                    value={formData.billing_state}
                    onChange={(value) => handleFieldChange('billing_state', value)}
                    options={US_STATES.map(state => ({
                      value: state.value,
                      label: state.label
                    }))}
                    error={errors.billing_state}
                  />

                  <FormField
                    name="billing_zip"
                    label="ZIP Code"
                    value={formData.billing_zip}
                    onChange={(value) => handleFieldChange('billing_zip', value)}
                    error={errors.billing_zip}
                  />
                </Grid>
              </Box>

                <FormActions
                  onSave={handleSubmit}
                  onCancel={handleClose}
                  loading={saving}
                  saveText="Update Profile"
                  cancelText="Cancel"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProfileModal;