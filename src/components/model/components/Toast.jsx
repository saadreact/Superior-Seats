import React, { useEffect, useState } from 'react';
import { Alert, Slide, Box, IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  // Handle animation complete to trigger actual removal
  const handleExited = () => {
    onClose();
  };

  return (
    <Collapse in={open} onExited={handleExited}>
      <Alert
        severity={type}
        variant="filled"
        elevation={6}
        sx={{
          width: '100%',
          mb: 1, // Margin bottom for spacing between stacked toasts
          minWidth: '300px'
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
}

export default Toast;
