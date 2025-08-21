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
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

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
           pathname.startsWith('/admin/colors');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Admin Panel
          </Typography>
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
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.href)}
              selected={isActive(item.href)}
              sx={{
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                minHeight: collapsed ? 48 : 'auto',
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
                  minWidth: collapsed ? 40 : 40,
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
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}

        {/* Variations Section with Sub-items */}
        {!collapsed && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleVariationsToggle}
                selected={isVariationsActive()}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
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
                    minWidth: 40,
                    color: isVariationsActive() ? 'white' : 'inherit',
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Variations"
                  primaryTypographyProps={{
                    fontWeight: isVariationsActive() ? 600 : 400,
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
                        mx: 1,
                        ml: 4,
                        borderRadius: 1,
                        mb: 0.5,
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
                          minWidth: 40,
                          color: isActive(item.href) ? 'white' : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.href) ? 600 : 400,
                          fontSize: '0.9rem',
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
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                minHeight: 48,
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
                  minWidth: 40,
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
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
            Customer View
          </Typography>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/')}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText
                primary="Back to Website"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center">
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