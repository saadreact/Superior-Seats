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
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Customize Your Seat', href: '/customize-your-seat' },
    { text: 'Shop Specials', href: '/specials' },
    { text: 'Upholstery Services', href: '/upholstery' },
    { text: 'Other Products', href: '/other-products' },
    { text: 'Gallery', href: '/gallery' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ];

  // Admin items moved to sidebar

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
        <Image
          src="/white-logo.png"
          alt="Superior Seating LLC"
          width={200}
          height={60}
          style={{ objectFit: 'contain' }}
        />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component="a" href={item.href}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem component="a" href="/admin">
          <ListItemText 
            primary="Admin Panel" 
            primaryTypographyProps={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }} 
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          backgroundColor: 'white',
          color: '#DA291C', // Pantone 485C
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {/* Next.js Image Component */}
            <Image
              src="/white-logo.png"
              alt="Superior Seating LLC"
              width={isMobile ? 150 : 200}
              height={isMobile ? 45 : 60}
              style={{ objectFit: 'contain' }}
              priority
            />
            
            {/* Fallback regular img tag - uncomment if Next.js Image doesn't work */}
            {/* 
            <img
              src="/white-logo.png"
              alt="Superior Seating LLC"
              style={{
                width: isMobile ? 150 : 200,
                height: isMobile ? 45 : 60,
                objectFit: 'contain'
              }}
            />
            */}
          </Box>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: '#DA291C' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  href={item.href}
                  sx={{
                    color: '#DA291C', // Pantone 485C
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(218, 41, 28, 0.1)',
                      color: '#DA291C',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Button
                color="inherit"
                href="/admin"
                sx={{
                  color: '#DA291C',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'rgba(218, 41, 28, 0.1)',
                    color: '#DA291C',
                  },
                }}
              >
                Admin
              </Button>
            </Box>
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
            backgroundColor: 'white',
            color: '#DA291C',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 