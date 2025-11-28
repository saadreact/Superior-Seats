import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';

function SubmitButton({ onSubmit, disabled = false }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Button
        variant="contained"
        color="success"
        onClick={handleClick}
        disabled={disabled}
        sx={{
          position: 'fixed',
          bottom: { xs: 15, md: 30 },
          right: { xs: 15, md: 30 },
          padding: { xs: '10px 20px', md: '15px 30px' },
          fontSize: { xs: '13px', md: '16px' },
          fontWeight: 'bold',
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 1000,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 6
          }
        }}
      >
        Submit Design
      </Button>

      <Dialog
        open={showConfirm}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Submission
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to submit this design? We will capture images from multiple angles.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="success" variant="contained" autoFocus>
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SubmitButton;
