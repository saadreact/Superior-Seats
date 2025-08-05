'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';
import Cart from './Cart';
import AuthModal from './AuthModal';

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Redux state
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state: any) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Customize Your Seat', href: '/custom-seats' },
    { text: 'Shop Specials', href: '/ShopGallery' },
    // { text: 'Upholstery Services', href: '/upholstery' },
    // { text: 'Other Products', href: '/other-products' },
    { text: 'Gallery', href: '/gallery' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ];

  // Admin items moved to sidebar

  const handleAuthClick = () => {
    setAuthModalOpen(true);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    handleUserMenuClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                 <Image
           src="/superiorlogo/logored.png"
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
        <ListItem component="a" href="/admin" sx={{
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }}>
          <ListItemText 
            primary="Admin Panel" 
            primaryTypographyProps={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }} 
          />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        {isAuthenticated ? (
          <ListItem component="button" onClick={handleLogout} sx={{ 
            cursor: 'pointer',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}>
            <ListItemText 
              primary={`Logout (${user?.name})`}
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }} 
            />
          </ListItem>
        ) : (
          <ListItem component="button" onClick={handleAuthClick} sx={{ 
            cursor: 'pointer',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}>
            <ListItemText 
              primary="Login / Sign Up" 
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }} 
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
             <AppBar 
         position="fixed" 
         elevation={1}
         sx={{ 
           backgroundColor: 'white',
           color: '#DA291C', // Pantone 485C
           top: 0,
           left: 0,
           right: 0,
           zIndex: 1100,
           width: '100%',
         }}
       >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {/* Next.js Image Component */}
                         <Image
               src="/superiorlogo/logored.png"
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
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: '#DA291C' }}
              >
                <MenuIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleCartToggle}
                sx={{ color: '#DA291C', ml: 1 }}
              >
                <Badge badgeContent={state.totalItems} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              <IconButton
                color="inherit"
                onClick={handleCartToggle}
                sx={{ 
                  color: '#DA291C',
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(218, 41, 28, 0.1)',
                  }
                }}
              >
                <Badge badgeContent={state.totalItems} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
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
              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleUserMenuClick}
                    startIcon={<AccountCircleIcon />}
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
                    {user?.name}
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  onClick={handleAuthClick}
                  startIcon={<PersonIcon />}
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
                  Login
                </Button>
              )}
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

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header; 