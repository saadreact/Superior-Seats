'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { isSuperAdmin } from '@/utils/auth';
import { Box, CircularProgress, Typography, Paper, Button } from '@mui/material';
import { AdminPanelSettings as AdminIcon, Home as HomeIcon } from '@mui/icons-material';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAppSelector((state: any) => state.auth);

  // Check if user is super admin using utility function
  const userIsSuperAdmin = isSuperAdmin(user, isAuthenticated);

  useEffect(() => {
    // If not loading and user is not authenticated or not super admin, redirect
    if (!loading && (!isAuthenticated || !userIsSuperAdmin)) {
      router.push('/');
    }
  }, [user, isAuthenticated, loading, userIsSuperAdmin, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <CircularProgress size={60} color="primary" sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Verifying access permissions...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Show access denied if user is not authenticated or not super admin
  if (!isAuthenticated || !userIsSuperAdmin) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          p: 3,
        }}
      >
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2, maxWidth: 500 }}>
          <AdminIcon 
            sx={{ 
              fontSize: 80, 
              color: 'error.main', 
              mb: 2,
              opacity: 0.7 
            }} 
          />
          <Typography variant="h4" color="error.main" gutterBottom fontWeight="bold">
            Access Denied
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Super Admin Access Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            {!isAuthenticated 
              ? "You must be logged in with super admin privileges to access the admin panel."
              : "Your account does not have the required super admin permissions to access this area."
            }
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => router.push('/')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Return Home
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            )}
          </Box>
          {isAuthenticated && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Logged in as: {user?.username || user?.name || user?.email}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    );
  }

  // Render children if user is super admin
  return <>{children}</>;
};

export default AdminRouteGuard; 