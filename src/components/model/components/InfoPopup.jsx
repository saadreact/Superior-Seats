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
              <ListItemText primary="Click on chair parts in the 3D view to apply customizations" />
            </ListItem>
          </List>
        </Box>

        {/* 4-State Click Cycle */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🔄 4-State Click Cycle
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Each part goes through 4 states when you click it repeatedly:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>1st Click:</strong> Apply custom color only (no pattern/stitching)</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>2nd Click:</strong> Add pattern and stitching</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>3rd Click:</strong> Remove pattern/stitching (keep custom color)</Typography>
            </Box>
            <Box>
              <Typography variant="body2"><strong style={{ color: '#2e7d32' }}>4th Click:</strong> Reset to base color from single-tone mode</Typography>
            </Box>
          </Paper>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            💡 After the 4th click, the cycle starts over from the 1st click state.
          </Typography>
        </Box>

        {/* Changing Colors & Patterns */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🎯 Changing Color & Pattern
          </Typography>
          <Typography variant="body2">
            Keep the color/pattern popup open while working. You can change the selected color
            or pattern at any time - the next part you click will use the newly selected options.
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
