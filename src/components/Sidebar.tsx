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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  ShoppingCart as OrderIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Storefront as StorefrontIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
  Inventory2 as Inventory2Icon,
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

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/admin',
    },
    {
      text: 'Products',
      icon: <InventoryIcon />,
      href: '/admin/products',
    },
    {
      text: 'Products 2',
      icon: <Inventory2Icon />,
      href: '/admin/products-2',
    },
    {
      text: 'Price Tiers',
      icon: <MoneyIcon />,
      href: '/admin/price-tiers',
    },
    {
      text: 'Customers',
      icon: <PeopleIcon />,
      href: '/admin/customers',
    },
    {
      text: 'Orders',
      icon: <OrderIcon />,
      href: '/admin/orders',
    },
  ];

  const variationSubItems = [
    {
      text: 'Variations',
      icon: <SettingsIcon />,
      href: '/admin/variations',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      href: '/admin/categories',
    },
    {
      text: 'Colors',
      icon: <PaletteIcon />,
      href: '/admin/colors',
    },
    {
      text: 'Arm Types',
      icon: <CategoryIcon />,
      href: '/admin/arm-types',
    },
    {
      text: 'Color Vendors',
      icon: <CategoryIcon />,
      href: '/admin/color-vendors',
    },
    {
      text: 'Feature Options',
      icon: <CategoryIcon />,
      href: '/admin/feature-options',
    },
    {
      text: 'Heat Options',
      icon: <CategoryIcon />,
      href: '/admin/heat-options',
    },
    {
      text: 'Item Types',
      icon: <CategoryIcon />,
      href: '/admin/item-types',
    },
    {
      text: 'Lumbar Types',
      icon: <CategoryIcon />,
      href: '/admin/lumbar-types',
    },
    {
      text: 'Material Types',
      icon: <CategoryIcon />,
      href: '/admin/material-types',
    },
  ];

  const handleNavigation = (href: string) => {
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

  const isVariationsActive = () => {
    return pathname.startsWith('/admin/variations') || 
           pathname.startsWith('/admin/categories') || 
           pathname.startsWith('/admin/colors') ||
           pathname.startsWith('/admin/arm-types') ||
           pathname.startsWith('/admin/color-vendors') ||
           pathname.startsWith('/admin/feature-options') ||
           pathname.startsWith('/admin/heat-options') ||
           pathname.startsWith('/admin/item-types') ||
           pathname.startsWith('/admin/lumbar-types') ||
           pathname.startsWith('/admin/material-types');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 1.5,
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
                height: '48px',
                objectFit: 'contain',
              }}
              priority
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
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
                    minWidth: collapsed ? 36 : 36,
                    color: isActive(item.href) ? 'white' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.href) ? 600 : 400,
                      fontSize: '0.875rem',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
            {/* Add divider after Products 2 */}
            {item.text === 'Products 2' && !collapsed && (
              <Divider sx={{ my: 1, mx: 2 }} />
            )}
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
      </List>

      {/* Customer View Section */}
      {!collapsed && (
        <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
            Customer View
          </Typography>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/')}
              sx={{
                borderRadius: 1,
                minHeight: 36,
                py: 0.75,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText
                primary="Back to Website"
                primaryTypographyProps={{
                  fontSize: '0.8rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      )}

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