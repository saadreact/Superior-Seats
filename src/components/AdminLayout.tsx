'use client';

import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import AdminRouteGuard from './AdminRouteGuard';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const router = useRouter();
  
  // Redux state
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
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
    router.push('/');
  };

  return (
    <AdminRouteGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { 
              md: sidebarCollapsed 
                ? `calc(100% - ${collapsedDrawerWidth}px)` 
                : `calc(100% - ${drawerWidth}px)`
            },
            ml: { 
              md: sidebarCollapsed 
                ? `${collapsedDrawerWidth}px` 
                : `${drawerWidth}px`
            },
            transition: 'margin-left 0.2s ease-in-out, width 0.2s ease-in-out',
          }}
        >
          {/* Top App Bar */}
          <AppBar
            position="sticky"
            elevation={1}
            sx={{
              backgroundColor: 'white',
              color: 'text.primary',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
                    <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            
            {isAuthenticated && user ? (
              <>
                <Tooltip title={`${user.username || user.name || user.email} (Click to logout)`} arrow>
                  <IconButton
                    color="inherit"
                    onClick={handleUserMenuClick}
                    sx={{
                      color: '#DA291C',
                      p: { xs: 1, sm: 1.25, md: 1.5 },
                      '&:hover': {
                        backgroundColor: 'rgba(218, 41, 28, 0.1)',
                        color: '#DA291C',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' } }} />
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
                    Logout ({user?.username || user?.name || user?.email})
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton color="inherit">
                <AccountIcon />
              </IconButton>
            )}
          </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box sx={{ 
            p: { xs: 2, sm: 3 },
            minHeight: 'calc(100vh - 64px)',
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </AdminRouteGuard>
  );
};

export default AdminLayout; 