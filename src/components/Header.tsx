'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as AdminPanelSettingsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';
import { isSuperAdmin } from '@/utils/auth';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Cart from './Cart';
import AuthModal from './AuthModal';
import EditProfileModal from './EditProfileModal';

const Header = () => {
  // Base URL for images from server
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_STATIC_IMAGES || 'https://api.superiorseatingllc.com/images';

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [shopNowMenuAnchor, setShopNowMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentPath, setCurrentPath] = useState('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Update current path when pathname changes
  useEffect(() => {
  
    setCurrentPath(pathname);
  }, [pathname]);
  
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

  // Check if user is super admin using utility function
  const userIsSuperAdmin = isSuperAdmin(user, isAuthenticated);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    { text: 'Fleet & Builder Solutions', href: '/fleet-builder-solutions' },
    { 
      text: 'Shop Now', 
      href: '/shop-now',
      subItems: [
        { text: 'Shop Now', href: '/shop-now' },
        { text: 'Customize Your Seat', href: '/customize-your-seat' }
      ]
    },
    { text: 'Gallery', href: '/gallery' },
    { text: 'Upholstery Services', href: '/upholstery' },
    { text: 'Custom Auto Builds', href: '/upfitting' },
  
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

  const handleEditProfile = () => {
   
    setEditProfileModalOpen(true);
    handleUserMenuClose();
  };

  const handleProfileUpdated = (updatedUser: any) => {
    setSnackbar({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success',
    });
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setSnackbar({
      open: true,
      message: 'Successfully logged out!',
      severity: 'success',
    });
    handleUserMenuClose();
  };

  const handleShopNowMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setShopNowMenuAnchor(event.currentTarget);
  };

  const handleShopNowMenuClose = () => {
    setShopNowMenuAnchor(null);
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

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%' }}>
      <Link href="/customize-your-seat" style={{ textDecoration: 'none', outline: 'none' }}>
        <Box 
          onClick={handleHomeClick}
          sx={{ 
            my: 2, 
            display: 'flex', 
            justifyContent: 'center',
            px: 2,
            cursor: 'pointer',
            outline: 'none',
            '&:focus': {
              outline: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
            }
          }}
        >
          <Image
            src={`${IMAGE_BASE_URL}/superiorlogo/logored.png`}
            alt="Superior Seating LLC"
            width={isSmallMobile ? 180 : 200}
            height={isSmallMobile ? 54 : 60}
            style={{ objectFit: 'contain', outline: 'none' }}
          />
        </Box>
      </Link>
             <List sx={{ flex: 1 }}>
         {menuItems.map((item) => (
           <React.Fragment key={item.text}>
             {item.subItems ? (
               // If item has subItems, render parent and children
               <>
                 <ListItem 
                   sx={{
                     py: 1.5,
                     cursor: 'default',
                     backgroundColor: 'rgba(218, 41, 28, 0.05)',
                   }}
                 >
                   <ListItemText 
                     primary={item.text}
                     primaryTypographyProps={{
                       fontSize: { xs: '0.9rem', sm: '1rem' },
                       fontWeight: 700,
                       color: 'rgba(0, 0, 0, )',
                     }}
                   />
                 </ListItem>
                 {item.subItems.map((subItem: any) => (
                   <Link key={subItem.text} href={subItem.href} style={{ textDecoration: 'none' }}>
                     <ListItem 
                       onClick={() => setMobileOpen(false)}
                       sx={{
                         py: 1.5,
                         pl: 4,
                         cursor: 'pointer',
                         '&:hover': {
                           backgroundColor: 'rgba(218, 41, 28, 0.05)',
                         }
                       }}
                     >
                       <ListItemText 
                         primary={subItem.text}
                         primaryTypographyProps={{
                           fontSize: { xs: '0.85rem', sm: '0.95rem' },
                           fontWeight: 500,
                           color: 'rgba(0, 0, 0, )',
                         }}
                       />
                     </ListItem>
                   </Link>
                 ))}
               </>
             ) : (
               // Regular menu item without subItems
               <Link href={item.href} style={{ textDecoration: 'none' }}>
                 <ListItem 
                   onClick={item.text === 'Home' ? handleHomeClick : () => setMobileOpen(false)}
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
                       color: 'rgba(0, 0, 0, )',
                     }}
                   />
                 </ListItem>
               </Link>
             )}
           </React.Fragment>
                 ))}
        <Divider sx={{ my: 1.5 }} />
        {userIsSuperAdmin && (
          <>
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
          </>
        )}
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
                                  primary={`Logout (${user?.username || user?.name || user?.email})`}
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
        <Box sx={{ width: '100%' }}>
          <Toolbar 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 0,
              minHeight: { xs: '56px', sm: '58px', md: '60px', lg: '62px', xl: '64px' },
              maxHeight: { xs: '56px', sm: '58px', md: '60px', lg: '62px', xl: '64px' },
              px: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
              py: { xs: 0.25, sm: 0.5, md: 0.5, lg: 0.5, xl: 0.5 },
              width: '100%'
            }}
          >
            {/* Left Section - Logo and Menu Items */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: { xs: 0, sm: 0.5, md: 1, lg: 1.5, xl: 2 },
              mx: 0,
              flex: 1,
              minWidth: 0, // Allow shrinking if needed
              overflow: 'hidden', // Prevent overflow
            }}>
              {/* Logo Section */}
              <Link href="/customize-your-seat" style={{ textDecoration: 'none', outline: 'none', flexShrink: 0 }}>
                <Box 
                  onClick={handleHomeClick}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: '45px', sm: '48px', md: '52px', lg: '55px', xl: '58px' },
                    height: { xs: '45px', sm: '48px', md: '52px', lg: '55px', xl: '58px' },
                    flexShrink: 0,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    }
                  }}
                >
                  <Image
                    src={`${IMAGE_BASE_URL}/superiorlogo/logored.png`}
                    alt="Superior Seating LLC"
                    width={70}
                    height={65}
                    style={{ 
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      outline: 'none'
                    }}
                    priority
                  />
                </Box>
              </Link>
             
              {/* Menu Items - Desktop & Tablet */}
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: { md: 0.5, lg: 0.75, xl: 1 }, 
                  alignItems: 'center',
                  flexWrap: 'nowrap',
                  ml: { md: 1, lg: 1.5, xl: 2 },
                  overflow: 'hidden',
                  flex: 1,
                  minWidth: 0,
                }}>
                  {menuItems.map((item) => {
                    const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
                    
                    // If item has subItems, render with dropdown
                    if (item.subItems) {
                      return (
                        <React.Fragment key={item.text}>
                          <Button
                            color="inherit"
                            onClick={handleShopNowMenuClick}
                            sx={{
                              color: 'black',
                              fontWeight: 500,
                              fontSize: { md: '0.95rem', lg: '1.05rem', xl: '1.1rem' },
                              px: { md: 0.75, lg: 1, xl: 1.25 },
                              py: { md: 0.5, lg: 0.6, xl: 0.7 },
                              whiteSpace: 'nowrap',
                              minWidth: 'auto',
                              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                color: 'black',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {item.text}
                          </Button>
                          <Menu
                            anchorEl={shopNowMenuAnchor}
                            open={Boolean(shopNowMenuAnchor)}
                            onClose={handleShopNowMenuClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            PaperProps={{
                              sx: {
                                mt: 0.5,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                borderRadius: 2,
                              }
                            }}
                          >
                            {item.subItems.map((subItem: any) => (
                              <MenuItem 
                                key={subItem.text}
                                onClick={() => {
                                  handleShopNowMenuClose();
                                  router.push(subItem.href);
                                }}
                                sx={{ 
                                  py: 1.5, 
                                  px: 2, 
                                  '&:hover': { 
                                    backgroundColor: 'rgba(218, 41, 28, 0.05)' 
                                  } 
                                }}
                              >
                                {subItem.text}
                              </MenuItem>
                            ))}
                          </Menu>
                        </React.Fragment>
                      );
                    }
                    
                    // Regular menu item without subItems
                    return (
                      <Link key={item.text} href={item.href} style={{ textDecoration: 'none' }}>
                        <Button
                          color="inherit"
                          onClick={item.text === 'Home' ? handleHomeClick : undefined}
                          sx={{
                            color: 'black',
                            fontWeight: 500,
                            fontSize: { md: '0.95rem', lg: '1.05rem', xl: '1.1rem' },
                            px: { md: 0.75, lg: 1, xl: 1.25 },
                            py: { md: 0.5, lg: 0.6, xl: 0.7 },
                            whiteSpace: 'nowrap',
                            minWidth: 'auto',
                            backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.08)',
                              color: 'black',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {item.text}
                        </Button>
                      </Link>
                    );
                  })}
                </Box>
              )}
            </Box>
            
            {/* Right Section - Icons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              gap: { xs: 0.75, sm: 1, md: 1, lg: 1.25, xl: 1.5 },
              pr: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xl: 2.5 },
              flexShrink: 0
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
                        color: 'black',
                        p: { xs: 0.75, sm: 1 },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <MenuIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.75rem' } }} />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 0.5, sm: 0.75 }
                  }}>
                    <Image
                      src={`${IMAGE_BASE_URL}/Gallery/Flags/flag.png`}
                      alt="US Flag"
                      width={22}
                      height={22}
                      style={{ 
                        objectFit: 'contain',
                        borderRadius: '2px'
                      }}
                    />
                  </Box>
                  <Tooltip title="Shopping Cart" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleCartToggle}
                      sx={{ 
                        color: 'black',
                        p: { xs: 0.75, sm: 1 },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                                             <Badge 
                         badgeContent={totalItems} 
                         sx={{
                           '& .MuiBadge-badge': {
                             fontSize: { xs: '0.7rem', sm: '0.75rem' },
                             minWidth: { xs: '16px', sm: '18px' },
                             height: { xs: '16px', sm: '18px' },
                             backgroundColor: 'black',
                             color: 'white',
                           }
                         }}
                       >
                        <ShoppingCartIcon sx={{ fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.5rem' } }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { md: 0.5, lg: 0.75, xl: 0.85 }
                  }}>
                    <Image
                      src={`${IMAGE_BASE_URL}/Gallery/Flags/flag.png`}
                      alt="US Flag"
                      width={24}
                      height={24}
                      style={{ 
                        objectFit: 'contain',
                        borderRadius: '2px'
                      }}
                    />
                  </Box>
                  <Tooltip title="Shopping Cart" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleCartToggle}
                      sx={{ 
                        color: 'black',
                        p: { md: 0.5, lg: 0.65, xl: 0.75 },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                     <Badge 
                         badgeContent={totalItems} 
                         sx={{
                           '& .MuiBadge-badge': {
                             fontSize: { md: '0.7rem', lg: '0.75rem', xl: '0.75rem' },
                             minWidth: { md: '16px', lg: '18px', xl: '18px' },
                             height: { md: '16px', lg: '18px', xl: '18px' },
                             backgroundColor: 'black',
                             color: 'white',
                           }
                         }}
                       >
                        <ShoppingCartIcon sx={{ fontSize: { md: '1.5rem', lg: '1.65rem', xl: '1.75rem' } }} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  {userIsSuperAdmin && (
                    <Tooltip title="Admin Panel" arrow>
                      <Link href="/admin" style={{ textDecoration: 'none' }}>
                        <IconButton
                          color="inherit"
                          sx={{
                            color: 'black',
                            p: { md: 0.5, lg: 0.6, xl: 0.7 },
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.08)',
                              color: 'black',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <SupervisorAccountIcon sx={{ fontSize: { md: '1.6rem', lg: '1.75rem', xl: '1.9rem' } }} />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  )}
                  {isAuthenticated ? (
                    <>
                 <Tooltip title={`${user?.username || user?.name || user?.email || 'User'} (Click to logout)`} arrow>
                      <IconButton
                        color="inherit"
                        onClick={handleUserMenuClick}
                        sx={{
                          color: 'black',
                          p: { md: 0.5, lg: 0.6, xl: 0.7 },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            color: 'black',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <AccountCircleIcon sx={{ fontSize: { md: '1.5rem', lg: '1.65rem', xl: '1.75rem' } }} />
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
                        {(user && user.role && user.role.id) && [
                          <MenuItem 
                            key="my-orders"
                            onClick={() => {
                              handleUserMenuClose();
                              router.push('/shop/orders');
                            }}
                            sx={{ py: 1.5, px: 2, '&:hover': { backgroundColor: 'rgba(218, 41, 28, 0.05)' } }}
                          >
                            My Orders
                          </MenuItem>,
                          <MenuItem 
                            key="create-order"
                            onClick={() => {
                              handleUserMenuClose();
                              router.push('/shop/orders/create');
                            }}
                            sx={{ py: 1.5, px: 2, '&:hover': { backgroundColor: 'rgba(218, 41, 28, 0.05)' } }}
                          >
                            Create Order
                          </MenuItem>,
                          <Divider key="divider" sx={{ my: 0.5 }} />
                        ]}
                        {(user.id || user.customer_id) && (
                          <MenuItem 
                            onClick={handleEditProfile}
                            sx={{
                              py: 1.5,
                              px: 2,
                              '&:hover': {
                                backgroundColor: 'rgba(218, 41, 28, 0.05)',
                              }
                            }}
                          >
                            <EditIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
                            Edit Profile
                          </MenuItem>
                        )}
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
                          Logout ({user?.username || user?.name || user?.email || 'User'})
                        </MenuItem>
                      </Menu>
                    </>
                                     ) : (
                                          <Tooltip title="Login / Sign Up" arrow>
                      <IconButton
                        color="inherit"
                        onClick={handleAuthClick}
                        sx={{
                          color: 'black',
                          p: { md: 0.5, lg: 0.65, xl: 0.75 },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            color: 'black',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <PersonIcon sx={{ fontSize: { md: '1.5rem', lg: '1.65rem', xl: '1.75rem' } }} />
                      </IconButton>
                      </Tooltip>
                   )}
                </>
              )}
            </Box>
          </Toolbar>
        </Box>
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

      {isAuthenticated && user && user.role && (
        <EditProfileModal 
          open={editProfileModalOpen} 
          onClose={() => setEditProfileModalOpen(false)}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header; 