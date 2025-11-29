import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function InfoPopup({ onClose }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">Two-Tone Mode Guide</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Getting Started */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🎨 Getting Started
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary={<span>Enable <strong>Two Tone</strong> mode from the seat type selector</span>} />
            </ListItem>
            <ListItem>
              <ListItemText primary={<span>A popup will appear - select your desired <strong>color</strong> and <strong>pattern</strong></span>} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Click (left-click) on chair parts in the 3D view to cycle through customization states" />
            </ListItem>
          </List>
        </Box>

        {/* Customizing Individual Parts */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🎯 Customizing Individual Parts
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Click on any customizable part in the 3D view to cycle through customization states:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>Click 1:</strong> Apply color only (uses the selected two-tone color)</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>Click 2:</strong> Apply color + pattern (uses the selected two-tone color and pattern)</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>Click 3:</strong> Remove pattern (back to color only)</Typography>
            </Box>
            <Box>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>Click 4:</strong> Reset part (remove all customization, back to default)</Typography>
            </Box>
          </Paper>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            💡 Each part cycles independently. You can customize different parts with different colors and patterns by clicking them multiple times.
          </Typography>
        </Box>

        {/* Apply to All Feature */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🎨 Apply to All Feature
          </Typography>
          <Typography variant="body2">
            When the two-tone selector popup is open, you can use the <strong>Apply to All Parts</strong> button
            to quickly apply the same color and pattern to all customizable parts at once.
          </Typography>
        </Box>

        {/* Reset Model */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🔄 Reset Model
          </Typography>
          <Typography variant="body2">
            Click the <strong>Reset Model</strong> button (bottom-left corner) to clear all
            customizations and return to default settings. If you are in two-tone mode, the
            color/pattern popup will reappear automatically. 
          </Typography>
        </Box>

        {/* Tips */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            💡 Tips
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="You can customize up to 8 different parts (seat, backrest, headrest, arms)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Each part can have different colors and patterns" />
            </ListItem>
            <ListItem>
              <ListItemText primary="If you click a non-editable area, valid parts will glow yellow briefly" />
            </ListItem>
            <ListItem>
              <ListItemText primary='Switch between "Single Tone" and "Two Tone" modes to compare designs' />
            </ListItem>
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default InfoPopup;
