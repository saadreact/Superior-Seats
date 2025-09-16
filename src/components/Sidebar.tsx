'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Toolbar,
  Collapse,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  ShoppingCart as OrderIcon,
  Menu as MenuIcon,
  Close as CloseIcon,

  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
  Inventory2 as Inventory2Icon,
  Chair as ChairIcon,
  BackHand as BackHandIcon,
  Replay as ReplayIcon,
  LocalFireDepartment as HeatIcon,
  Pattern as PatternIcon,
  ColorLens as ColorIcon,
  Style as StyleIcon,
  DirectionsCar as VehicleIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const drawerWidth = 280;
const mobileDrawerWidth = 280;
const collapsedDrawerWidth = 80; // New constant for collapsed drawer width

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, collapsed = false, onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();
  const [variationsExpanded, setVariationsExpanded] = useState(false);
  const [vehicleInfoExpanded, setVehicleInfoExpanded] = useState(false);
  


  const menuItems = [
  
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/admin',
    },
    {
      text: 'Customers',
      icon: <PeopleIcon />,
      href: '/admin/customers',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      href: '/admin/categories',
    },
    {
      text: 'Orders',
      icon: <OrderIcon />,
      href: '/admin/orders',
    },

  
    {
      text: 'Products',
      icon: <Inventory2Icon />,
      href: '/admin/products-2',
    },
    {
      text: 'Price Tiers',
      icon: <MoneyIcon />,
      href: '/admin/price-tiers',
    },
    {
      text: 'Payments',
      icon: <MoneyIcon />,
      href: '/admin/payments',
    },
  
  ];

  const variationSubItems = [
    {
      text: 'Arm Types',
      icon: <CategoryIcon />,
      href: '/admin/arm-types',
    },
    {
      text: 'Colors',
      icon: <ColorIcon />,
      href: '/admin/colors',
    },
    {
      text: 'Color Vendors',
      icon: <ColorIcon />,
      href: '/admin/color-vendors',
    },
    {
      text: 'Heat Options',
      icon: <HeatIcon />,
      href: '/admin/heat-options',
    },
    {
      text: 'Item Types',
      icon: <CategoryIcon />,
      href: '/admin/item-types',
    },
    {
      text: 'Lumbar Types',
      icon: <BackHandIcon />,
      href: '/admin/lumbar-types',
    },
    {
      text: 'Material Types',
      icon: <PaletteIcon />,
      href: '/admin/material-types',
    },
    {
      text: 'Recline Types',
      icon: <ReplayIcon />,
      href: '/admin/recline-types',
    },
    {
      text: 'Seat Stitch Patterns',
      icon: <PatternIcon />,
      href: '/admin/seat-stitch-patterns',
    },
    {
      text: 'Seat Styles',
      icon: <StyleIcon />,
      href: '/admin/seat-styles',
    },
    {
      text: 'Seat Types',
      icon: <ChairIcon />,
      href: '/admin/seat-types',
    },
  ];

  const vehicleInfoSubItems = [
    {
      text: 'Vehicle Makes',
      icon: <VehicleIcon />,
      href: '/admin/vehicle-makes',
    },
    {
      text: 'Vehicle Models',
      icon: <VehicleIcon />,
      href: '/admin/vehicle-models',
    },
    {
      text: 'Vehicle Trims',
      icon: <VehicleIcon />,
      href: '/admin/vehicle-trims',
    },
  ];

  const handleNavigation = (href: string) => {
    try {
      // If navigating to home page, clear breadcrumb history
      if (href === '/') {
        localStorage.removeItem('breadcrumbHistory');
        localStorage.removeItem('breadcrumb');
        localStorage.removeItem('navigationHistory');
        // Set to empty and remove again to ensure it's cleared
        localStorage.setItem('breadcrumbHistory', '');
        localStorage.removeItem('breadcrumbHistory');
      }
      
      router.push(href);
      
      if (isMobile) {
        onClose();
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    // For exact matching to prevent Products 2 from highlighting Products
    if (href === '/admin/products') {
      return pathname === '/admin/products' || pathname.startsWith('/admin/products/');
    }
    if (href === '/admin/products-2') {
      return pathname === '/admin/products-2' || pathname.startsWith('/admin/products-2/');
    }
    return pathname.startsWith(href);
  };

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  const handleVariationsToggle = () => {
    setVariationsExpanded(!variationsExpanded);
  };

  const handleVehicleInfoToggle = () => {
    setVehicleInfoExpanded(!vehicleInfoExpanded);
  };

  const isVariationsActive = () => {
    return pathname.startsWith('/admin/variations') || 
           pathname.startsWith('/admin/colors') ||
           pathname.startsWith('/admin/arm-types') ||
           pathname.startsWith('/admin/color-vendors') ||
           pathname.startsWith('/admin/feature-options') ||
           pathname.startsWith('/admin/heat-options') ||
           pathname.startsWith('/admin/item-types') ||
           pathname.startsWith('/admin/lumbar-types') ||
           pathname.startsWith('/admin/material-types') ||
           pathname.startsWith('/admin/seat-types') ||
           pathname.startsWith('/admin/seat-stitch-patterns') ||
           pathname.startsWith('/admin/seat-pricing') ||
           pathname.startsWith('/admin/recline-types') ||
           pathname.startsWith('/admin/seat-styles');
  };

  const isVehicleInfoActive = () => {
    return pathname.startsWith('/admin/vehicle-makes') ||
           pathname.startsWith('/admin/vehicle-models') ||
           pathname.startsWith('/admin/vehicle-trims');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 1.8,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/superiorlogo/logored.png"
              alt="Superior Seats Logo"
              width={180}
              height={60}
              style={{
                width: 'auto',
                height: '36px',
                objectFit: 'contain',
              }}
              priority
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Collapse/Close Buttons */}
          {!isMobile && (
            <IconButton onClick={toggleCollapse} size="small">
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
          {isMobile && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, pt: 0.5 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.href)}
                selected={isActive(item.href)}
                sx={{
                  mx: 0.5,
                  borderRadius: 1,
                  mb: 0.25,
                  minHeight: collapsed ? 40 : 36,
                  py: 0.75,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'white' },
                  },
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 36 : 36, color: isActive(item.href) ? 'white' : 'inherit' }}>
                  {collapsed ? (
                    <Tooltip title={item.text} placement="right">
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                    </Tooltip>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive(item.href) ? 600 : 400, fontSize: '0.875rem' }}
                  />
                )}
              </ListItemButton>
            </ListItem>

          </React.Fragment>
        ))}

        {/* Variations Section with Sub-items */}
        {!collapsed && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleVariationsToggle}
                selected={isVariationsActive()}
                sx={{
                  mx: 0.5,
                  borderRadius: 1,
                  mb: 0.25,
                  minHeight: 36,
                  py: 0.75,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isVariationsActive() ? 'white' : 'inherit',
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Variations"
                  primaryTypographyProps={{
                    fontWeight: isVariationsActive() ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
                {variationsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>
            
            <Collapse in={variationsExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {variationSubItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.href)}
                      selected={isActive(item.href)}
                      sx={{
                        mx: 0.5,
                        ml: 3,
                        borderRadius: 1,
                        mb: 0.25,
                        minHeight: 32,
                        py: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          color: isActive(item.href) ? 'white' : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.href) ? 600 : 400,
                          fontSize: '0.8rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Vehicle Information Section with Sub-items */}
        {!collapsed && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleVehicleInfoToggle}
                selected={isVehicleInfoActive()}
                sx={{
                  mx: 0.5,
                  borderRadius: 1,
                  mb: 0.25,
                  minHeight: 36,
                  py: 0.75,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isVehicleInfoActive() ? 'white' : 'inherit',
                  }}
                >
                  <VehicleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Vehicle Fitments"
                  primaryTypographyProps={{
                    fontWeight: isVehicleInfoActive() ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
                {vehicleInfoExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>
            
            <Collapse in={vehicleInfoExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {vehicleInfoSubItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.href)}
                      selected={isActive(item.href)}
                      sx={{
                        mx: 0.5,
                        ml: 3,
                        borderRadius: 1,
                        mb: 0.25,
                        minHeight: 32,
                        py: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          color: isActive(item.href) ? 'white' : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.href) ? 600 : 400,
                          fontSize: '0.8rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Collapsed Variations - Show as single item */}
        {collapsed && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/admin/variations')}
              selected={isVariationsActive()}
              sx={{
                mx: 0.5,
                borderRadius: 1,
                mb: 0.25,
                minHeight: 40,
                py: 0.75,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isVariationsActive() ? 'white' : 'inherit',
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        )}

        {/* Collapsed Vehicle Information - Show as single item */}
        {collapsed && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/admin/vehicle-makes')}
              selected={isVehicleInfoActive()}
              sx={{
                mx: 0.5,
                borderRadius: 1,
                mb: 0.25,
                minHeight: 40,
                py: 0.75,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isVehicleInfoActive() ? 'white' : 'inherit',
                }}
              >
                <VehicleIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        )}
      </List>



      {/* Footer */}
      <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" sx={{ fontSize: '0.7rem' }}>
          {collapsed ? 'SS' : 'Superior Seats Admin'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: mobileDrawerWidth,
              backgroundColor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: collapsed ? collapsedDrawerWidth : drawerWidth,
              backgroundColor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              transition: 'width 0.2s ease-in-out',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar; 