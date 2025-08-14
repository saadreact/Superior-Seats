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
  Container,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  AdminPanelSettingsOutlined as AdminPanelSettingsIcon,
} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';
import Cart from './Cart';
import AuthModal from './AuthModal';

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { totalItems } = useSelector((state: RootState) => state.cart);
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
    { text: 'Gallery', href: '/gallery' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ];

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

  // Function to clear breadcrumb history when Home is clicked
  const handleHomeClick = () => {
    // Clear all breadcrumb-related localStorage
    localStorage.removeItem('breadcrumbHistory');
    localStorage.removeItem('breadcrumb');
    localStorage.removeItem('navigationHistory');
    // Set to empty and remove again to ensure it's completely cleared
    localStorage.setItem('breadcrumbHistory', '');
    localStorage.removeItem('breadcrumbHistory');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%' }}>
      <Box sx={{ 
        my: 2, 
        display: 'flex', 
        justifyContent: 'center',
        px: 2,
      }}>
        <Image
          src="/superiorlogo/logored.png"
          alt="Superior Seating LLC"
          width={isSmallMobile ? 180 : 200}
          height={isSmallMobile ? 54 : 60}
          style={{ objectFit: 'contain' }}
        />
      </Box>
             <List sx={{ flex: 1 }}>
         {menuItems.map((item) => (
           <Link key={item.text} href={item.href} style={{ textDecoration: 'none' }}>
             <ListItem 
               onClick={item.text === 'Home' ? handleHomeClick : undefined}
               sx={{
                 py: 1.5,
                 cursor: 'pointer',
                 '&:hover': {
                   backgroundColor: 'rgba(218, 41, 28, 0.05)',
                 }
               }}
             >
               <ListItemText 
                 primary={item.text}
                 primaryTypographyProps={{
                   fontSize: { xs: '0.9rem', sm: '1rem' },
                   fontWeight: 650,
                   color: '#DA291C'
                 }}
               />
             </ListItem>
           </Link>
         ))}
         <Divider sx={{ my: 1.5 }} />
         <Link href="/admin" style={{ textDecoration: 'none' }}>
           <ListItem 
             sx={{
               backgroundColor: 'transparent',
               py: 1.5,
               cursor: 'pointer',
               '&:hover': {
                 backgroundColor: 'rgba(218, 41, 28, 0.05)',
               }
             }}
           >
             <ListItemText 
               primary="Admin Panel" 
               primaryTypographyProps={{ 
                 fontWeight: 'bold',
                 color: 'primary.main',
                 fontSize: { xs: '0.9rem', sm: '1rem' }
               }} 
             />
           </ListItem>
         </Link>
        <Divider sx={{ my: 1.5 }} />
        {isAuthenticated ? (
          <ListItem 
            component="button" 
            onClick={handleLogout} 
            sx={{ 
              cursor: 'pointer',
              backgroundColor: 'transparent',
              py: 1.5,
              width: '100%',
              border: 'none',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: 'rgba(218, 41, 28, 0.05)',
              }
            }}
          >
            <ListItemText 
              primary={`Logout (${user?.name})`}
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }} 
            />
          </ListItem>
        ) : (
          <ListItem 
            component="button" 
            onClick={handleAuthClick} 
            sx={{ 
              cursor: 'pointer',
              backgroundColor: 'transparent',
              py: 1.5,
              width: '100%',
              border: 'none',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: 'rgba(218, 41, 28, 0.05)',
              }
            }}
          >
            <ListItemText 
              primary="Login / Sign Up" 
              primaryTypographyProps={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: { xs: '0.9rem', sm: '1rem' }
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
          color: '#DA291C',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          width: '100%',
          borderBottom: '1px solid rgba(218, 41, 28, 0.1)',
        }}
      >
        <Container maxWidth={false} disableGutters>
          <Toolbar 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 0,
              minHeight: { xs: '50px', sm: '50px', md: '50px', lg: '40px' },
              px: { xs: 1, sm: 2, md: 0 },
              py: { xs: 1, sm: 1.5, md: 0 },
              width: '100%'
            }}
          >
            {/* Left Section - Logo and Menu Items */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0,
              mx: 0,
              pl: 0,
              ml: 0
            }}>
              {/* Logo Section */}
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Box 
                  onClick={handleHomeClick}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    pl: 0,
                    ml: 3
                  }}
                >
                  <Image
                    src="/superiorlogo/logored.png"
                    alt="Superior Seating LLC"
                    width={65}
                    height={65}
                    style={{ 
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                    priority
                  />
                </Box>
              </Link>
             
              {/* Menu Items - Desktop & Tablet */}
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 0, 
                  alignItems: 'center',
                  flexWrap: 'nowrap',
                  mx: { md: -2, lg: -1 },
                  ml: { md: 2, lg: 3 }
                }}>
                  {menuItems.map((item) => (
                    <Link key={item.text} href={item.href} style={{ textDecoration: 'none' }}>
                      <Button
                        color="inherit"
                        onClick={item.text === 'Home' ? handleHomeClick : undefined}
                        sx={{
                          color: '#DA291C',
                          fontWeight: 600,
                          fontSize: { md: '0.8rem', lg: '0.875rem' },
                          px: { md: 1, lg: 1.5 },
                          py: { md: 1, lg: 1.25 },
                          whiteSpace: 'nowrap',
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: 'rgba(218, 41, 28, 0.1)',
                            color: '#DA291C',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {item.text}
                      </Button>
                    </Link>
                  ))}
                </Box>
              )}
            </Box>
            
            {/* Right Section - Icons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              gap: { xs: 1, sm: 1.5, md: 1, lg: 1.5 },
              pr: { xs: 1, sm: 1.5, md: 2, lg: 3 }
            }}>
              {isMobile ? (
                <>
                  <Tooltip title="Menu" arrow>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={handleDrawerToggle}
                      sx={{ 
                        color: '#DA291C',
                        p: { xs: 1, sm: 1.25 },
                        '&:hover': {
                          backgroundColor: 'rgba(218, 41, 28, 0.1)',
                        }
                      }}
                    >
                      <MenuIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Shopping Cart" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleCartToggle}
                      sx={{ 
                        color: '#DA291C',
                        p: { xs: 1, sm: 1.25 },
                        '&:hover': {
                          backgroundColor: 'rgba(218, 41, 28, 0.1)',
                        }
                      }}
                    >
                      <Badge 
                        badgeContent={totalItems} 
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            minWidth: { xs: '16px', sm: '18px' },
                            height: { xs: '16px', sm: '18px' },
                          }
                        }}
                      >
                        <ShoppingCartIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' } }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Shopping Cart" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleCartToggle}
                      sx={{ 
                        color: '#DA291C',
                        p: { md: 1, lg: 1.5 },
                        '&:hover': {
                          backgroundColor: 'rgba(218, 41, 28, 0.1)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Badge 
                        badgeContent={totalItems} 
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: { md: '0.7rem', lg: '0.75rem' },
                            minWidth: { md: '16px', lg: '18px' },
                            height: { md: '16px', lg: '18px' },
                          }
                        }}
                      >
                        <ShoppingCartIcon sx={{ fontSize: { md: '1.3rem', lg: '1.5rem' } }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Admin Panel" arrow>
                    <Link href="/admin" style={{ textDecoration: 'none' }}>
                      <IconButton
                        color="inherit"
                        sx={{
                          color: '#DA291C',
                          p: { md: 1, lg: 1.5 },
                          '&:hover': {
                            backgroundColor: 'rgba(218, 41, 28, 0.1)',
                            color: '#DA291C',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <AdminPanelSettingsIcon sx={{ fontSize: { md: '1.8rem', lg: '2rem' } }} />
                      </IconButton>
                    </Link>
                  </Tooltip>
                  {isAuthenticated ? (
                    <>
                      <Tooltip title={`${user?.name} (Click to logout)`} arrow>
                        <IconButton
                          color="inherit"
                          onClick={handleUserMenuClick}
                          sx={{
                            color: '#DA291C',
                            p: { md: 1, lg: 1.5 },
                            '&:hover': {
                              backgroundColor: 'rgba(218, 41, 28, 0.1)',
                              color: '#DA291C',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <AccountCircleIcon sx={{ fontSize: { md: '1.5rem', lg: '1.75rem' } }} />
                        </IconButton>
                      </Tooltip>
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
                        PaperProps={{
                          sx: {
                            mt: 1,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            borderRadius: 2,
                          }
                        }}
                      >
                        <MenuItem 
                          onClick={handleLogout}
                          sx={{
                            py: 1.5,
                            px: 2,
                            '&:hover': {
                              backgroundColor: 'rgba(218, 41, 28, 0.05)',
                            }
                          }}
                        >
                          <LogoutIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Tooltip title="Login / Sign Up" arrow>
                      <IconButton
                        color="inherit"
                        onClick={handleAuthClick}
                        sx={{
                          color: '#DA291C',
                          p: { md: 1, lg: 1.5 },
                          '&:hover': {
                            backgroundColor: 'rgba(218, 41, 28, 0.1)',
                            color: '#DA291C',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <PersonIcon sx={{ fontSize: { md: '1.5rem', lg: '1.75rem' } }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
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
            width: { xs: '280px', sm: '320px' },
            backgroundColor: 'white',
            color: '#DA291C',
            borderRight: '1px solid rgba(218, 41, 28, 0.1)',
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