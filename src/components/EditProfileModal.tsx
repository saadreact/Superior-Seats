"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { apiService } from "@/utils/api";

// Zod validation schema - only editable fields
const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
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

  const handleInputChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear errors for the field
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleFieldChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear errors for the field
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validateForm = () => {
    try {
      profileSchema.parse(formData);
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
        phone: `${countryCode}${formData.phone}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        company_name: formData.company_name,
        customer_type: customerData?.customer_type || "retail",
        price_tier_id: customerData?.price_tier_id || 1,
        is_active:
          customerData?.is_active !== undefined ? customerData.is_active : true,
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

  // Common field styles - matching AuthModal exactly
  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      height: "35px",
      backgroundColor: "rgba(255,255,255,0.8)",
      "&:hover fieldset": {
        borderColor: "primary.main",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: 2,
      },
      "&.Mui-focused": {
        backgroundColor: "white",
      },
    },
    "& .MuiInputLabel-root": {
      color: "text.secondary",
      transform: "translate(14px, 8px) scale(1)",
      "&.Mui-focused": {
        color: "primary.main",
        transform: "translate(14px, -9px) scale(0.75)",
      },
      "&.MuiFormLabel-filled": {
        transform: "translate(14px, -9px) scale(0.75)",
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
            minHeight: isMobile ? "100vh" : "auto",
            maxWidth: isMobile ? "100%" : "450px",
            width: isMobile ? "100%" : "90%",
            maxHeight: isMobile ? "100vh" : "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
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
                p: { xs: 3, sm: 4, md: 1, lg: 0.5, xl: 1, xxl: 1 },
                pb: { xs: 4, sm: 5, md: 3, lg: 2, xl: 3, xxl: 3 },
                maxWidth: "400px",
                mx: "auto",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  textAlign: "center",
                  color: "text.primary",
                }}
              >
                Update your profile
              </Typography>

              <TextField
                fullWidth
                label="First Name"
                type="text"
                value={formData.first_name}
                onChange={handleFieldChange("first_name")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.first_name}
                helperText={errors.first_name}
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Last Name"
                type="text"
                value={formData.last_name}
                onChange={handleFieldChange("last_name")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.last_name}
                helperText={errors.last_name}
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow digits and basic formatting
                  const cleanValue = value.replace(/[^\d\s\-\(\)]/g, '');
                  setFormData((prev) => ({
                    ...prev,
                    phone: cleanValue,
                  }));
                  // Clear errors for the field
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                size="small"
                inputProps={{
                  inputMode: "tel",
                  maxLength: 20
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        pr: 1
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                          🇺🇸
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          +1
                        </Typography>
                        <Box sx={{ 
                          width: '1px', 
                          height: '20px', 
                          backgroundColor: 'rgba(0, 0, 0, 0.23)',
                          ml: 0.5
                        }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                  "& .MuiInputLabel-root": {
                    color: "text.secondary",
                    transform: "translate(60px, 8px) scale(1)",
                    "&.Mui-focused": {
                      color: "primary.main",
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "&.MuiFormLabel-filled": {
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    paddingLeft: "8px !important",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange("email")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Address"
                type="text"
                value={formData.address}
                onChange={handleFieldChange("address")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.address}
                helperText={errors.address}
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="City"
                type="text"
                value={formData.city}
                onChange={handleFieldChange("city")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.city}
                helperText={errors.city}
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="State"
                type="text"
                value={formData.state}
                onChange={handleFieldChange("state")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.state}
                helperText={errors.state}
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Company Name"
                type="text"
                value={formData.company_name}
                onChange={handleFieldChange("company_name")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!errors.company_name}
                helperText={errors.company_name}
                variant="outlined"
                size="small"
                sx={{
                  mb: 3,
                  ...commonTextFieldStyles,
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    marginLeft: 0,
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={saving}
                  size="medium"
                  disableRipple={false}
                  TouchRippleProps={{
                    center: true,
                    color: "rgba(255, 255, 255, 0.3)",
                  }}
                  sx={{
                    px: { xs: 4, sm: 6 },
                    py: { xs: 1, sm: 1.5, lg: 1, md: 1.2 },
                    borderRadius: 2,
                    textTransform: "none",
                    letterSpacing: 0.5,
                    transition: "all 0.3s ease",
                    minWidth: { xs: 160, sm: 180 },
                    width: { xs: "100%", sm: "auto" },
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                    "& .MuiTouchRipple-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  {saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
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
