'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Superior Seating LLC
          </Typography>
          
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