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
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
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
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

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

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%' }}>
      <Box sx={{ 
        my: 2, 
        display: 'flex', 
        justifyContent: 'center',
        px: 2
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
        <Container maxWidth="xl" disableGutters>
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between',
              minHeight: { xs: '55px', sm: '38px', md: '40px' },
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 0.75, sm: 0 },
              ml: { xs: 1, sm: 2, md: 3 }
            }}
          >

            
                                       {/* Left Side - Logo and Menu Items - Updated */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexShrink: 0,
                width: 'fit-content'
              }}>
                               {/* Logo Section */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    flexShrink: 0,
                    width: 'fit-content',
                    ml: { xs: 1, sm: 2, md: 3 },
                    cursor: 'pointer'
                  }}>
                   <Image
                     src="/superiorlogo/logored.png"
                     alt="Superior Seating LLC"
                     width={isSmallMobile ? 130 : isMobile ? 165 : isTablet ? 200 : 240}
                     height={isSmallMobile ? 32 : isMobile ? 42 : isTablet ? 50 : 64}
                     style={{ objectFit: 'contain' }}
                     priority
                   />
                 </Box>
               </Link>
               
                               {/* Menu Items - Desktop & Tablet */}
                                 {!isMobile && (
                   <Box sx={{ 
                     display: 'flex', 
                     gap: { md: 1.5, lg: 2 }, 
                     alignItems: 'center',
                     flexWrap: 'nowrap',
                     ml: { md: 0, lg: 0 }
                   }}>
                   {menuItems.map((item) => (
                     <Link key={item.text} href={item.href} style={{ textDecoration: 'none' }}>
                       <Button
                         color="inherit"
                         sx={{
                           color: '#DA291C',
                           fontWeight: 600,
                           fontSize: { md: '0.8rem', lg: '0.875rem' },
                           px: { md: 1, lg: 1.5 },
                           py: { md: 0.75, lg: 1 },
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
            
            {/* Right Side Actions */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1, md: 1.5 },
              flexShrink: 0
            }}>
              {isMobile ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ 
                      color: '#DA291C',
                      p: { xs: 1, sm: 1.5 },
                      '&:hover': {
                        backgroundColor: 'rgba(218, 41, 28, 0.1)',
                      }
                    }}
                  >
                    <MenuIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={handleCartToggle}
                    sx={{ 
                      color: '#DA291C',
                      p: { xs: 1, sm: 1.5 },
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
                      <ShoppingCartIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
                    </Badge>
                  </IconButton>
                </>
              ) : (
                <>
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      mx: { md: 1, lg: 1.5 },
                      height: { md: '32px', lg: '36px' }
                    }} 
                  />
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
                          minWidth: { md: '18px', lg: '20px' },
                          height: { md: '18px', lg: '20px' },
                        }
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: { md: '1.5rem', lg: '1.75rem' } }} />
                    </Badge>
                  </IconButton>
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
                       <AccountCircleIcon sx={{ fontSize: { md: '1.2rem', lg: '1.4rem' } }} />
                     </IconButton>
                   </Link>
                  {isAuthenticated ? (
                    <>
                      <Button
                        color="inherit"
                        onClick={handleUserMenuClick}
                        startIcon={<AccountCircleIcon sx={{ fontSize: { md: '1.2rem', lg: '1.4rem' } }} />}
                        sx={{
                          color: '#DA291C',
                          fontWeight: 600,
                          fontSize: { md: '0.8rem', lg: '0.875rem' },
                          px: { md: 1.5, lg: 2 },
                          py: { md: 0.75, lg: 1 },
                          '&:hover': {
                            backgroundColor: 'rgba(218, 41, 28, 0.1)',
                            color: '#DA291C',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease',
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
                      <PersonIcon sx={{ fontSize: { md: '1.2rem', lg: '1.4rem' } }} />
                    </IconButton>
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