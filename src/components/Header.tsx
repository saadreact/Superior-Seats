'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ArrowForward } from '@mui/icons-material';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Shop', href: '/shop' },
    { text: 'Customize', href: '/custom-seats' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Superior Seats
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component="a" href={item.href}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForward />}
          href="/shop"
          sx={{
            backgroundColor: '#d32f2f',
            color: 'white',
            '&:hover': {
              backgroundColor: '#9a0007',
            },
          }}
        >
          Start Customizing
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side - Logo and Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Superior Seating LLC
            </Typography>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    href={item.href}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
          
          {/* Right side - Start Customizing Button */}
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              href="/shop"
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                px: 3,
                '&:hover': {
                  backgroundColor: '#9a0007',
                },
              }}
            >
              Start Customizing
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 