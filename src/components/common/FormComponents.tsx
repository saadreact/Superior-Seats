'use client';

import React from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface FormFieldProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  error?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 1,
  type = 'text',
  error,
  disabled = false,
  size = 'medium',
}) => (
  <TextField
    fullWidth
    name={name}
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    required={required}
    multiline={multiline}
    rows={rows}
    type={type}
    error={!!error}
    helperText={error}
    disabled={disabled}
    variant="outlined"
    size={size}
    sx={{ 
      mb: size === 'small' ? 0 : 2,
      width: '100%',
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
          borderWidth: 2,
        },
      },
      '& .MuiInputLabel-root': {
        fontWeight: 500,
        '&.Mui-focused': {
          color: 'primary.main',
        },
      },
      '& .MuiFormHelperText-root': {
        marginLeft: 0,
        marginTop: 0.5,
      },
    }}
  />
);

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  disabled = false,
  size = 'medium',
}) => (
  <FormControl fullWidth sx={{ mb: size === 'small' ? 0 : 2, width: '100%' }} error={!!error}>
    {label && <InputLabel sx={{ fontWeight: 500 }}>{label}</InputLabel>}
    <Select
      name={name}
      value={value}
      label={label || undefined}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      size={size}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          '&.Mui-focused': {
            color: 'primary.main',
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

interface SwitchFieldProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  disabled = false,
}) => (
  <FormControlLabel
    control={
      <Switch
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'primary.main',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'primary.main',
          },
        }}
      />
    }
    label={label}
    sx={{ 
      mb: 2,
      '& .MuiFormControlLabel-label': {
        fontWeight: 500,
        fontSize: '0.875rem',
      },
    }}
  />
);

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  loading?: boolean;
  saveText?: string;
  cancelText?: string;
  deleteText?: string;
  showDelete?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  onDelete,
  loading = false,
  saveText = 'Save',
  cancelText = 'Cancel',
  deleteText = 'Delete',
  showDelete = false,
}) => (
  <Box sx={{ 
    display: 'flex', 
    gap: 2, 
    justifyContent: 'flex-end', 
    mt: 3,
    pt: 2,
    borderTop: 1,
    borderColor: 'divider',
  }}>
    {showDelete && onDelete && (
      <Button
        variant="outlined"
        color="error"
        onClick={onDelete}
        disabled={loading}
        sx={{ borderRadius: 2 }}
      >
        {deleteText}
      </Button>
    )}
    <Button
      variant="outlined"
      onClick={onCancel}
      disabled={loading}
      sx={{ borderRadius: 2 }}
    >
      {cancelText}
    </Button>
    <LoadingButton
      variant="contained"
      onClick={onSave}
      loading={loading}
      sx={{ borderRadius: 2 }}
    >
      {saveText}
    </LoadingButton>
  </Box>
);

interface AddressFieldsProps {
  prefix: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({
  prefix,
  address,
  onChange,
  disabled = false,
}) => (
  <Grid container spacing={2}>
    <Grid xs={12}>
      <FormField
        name={`${prefix}Street`}
        label="Street Address"
        value={address.street}
        onChange={(value) => onChange('street', value)}
        required
        disabled={disabled}
      />
    </Grid>
    <Grid xs={12} sm={6}>
      <FormField
        name={`${prefix}City`}
        label="City"
        value={address.city}
        onChange={(value) => onChange('city', value)}
        required
        disabled={disabled}
      />
    </Grid>
    <Grid xs={12} sm={6}>
      <FormField
        name={`${prefix}State`}
        label="State/Province"
        value={address.state}
        onChange={(value) => onChange('state', value)}
        required
        disabled={disabled}
      />
    </Grid>
    <Grid xs={12} sm={6}>
      <FormField
        name={`${prefix}ZipCode`}
        label="ZIP/Postal Code"
        value={address.zipCode}
        onChange={(value) => onChange('zipCode', value)}
        required
        disabled={disabled}
      />
    </Grid>
    <Grid xs={12} sm={6}>
      <FormField
        name={`${prefix}Country`}
        label="Country"
        value={address.country}
        onChange={(value) => onChange('country', value)}
        required
        disabled={disabled}
      />
    </Grid>
  </Grid>
);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
}) => (
  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && <Box>{action}</Box>}
  </Box>
);

interface FormCardProps {
  title?: string;
  children: React.ReactNode;
}

export const FormCard: React.FC<FormCardProps> = ({ title, children }) => (
  <Card>
    <CardContent>
      {title && (
        <>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </>
      )}
      {children}
    </CardContent>
  </Card>
); 