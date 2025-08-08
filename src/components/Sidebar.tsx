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
      text: 'Customer Types',
      icon: <PeopleIcon />,
      href: '/admin/customer-types',
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
    {
      text: 'Variations',
      icon: <SettingsIcon />,
      href: '/admin/variations',
    },
  ];

  const handleNavigation = (href: string) => {
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