'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Category as CategoryIcon,
  ShoppingCart as OrderIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';
import { apiService } from '@/utils/api';

const MotionCard = motion.create(Card);

const AdminDashboard = () => {
  const router = useRouter();
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const adminModules = [
  
    {
      title: 'Categories',
      description: 'Manage product categories and classifications',
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
      href: '/admin/categories',
      color: '#1976d2',
    },
    {
      title: 'Customers',
      description: 'Add, edit, and manage customer information',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      href: '/admin/customers',
      color: '#9c27b0',
    },
    {
      title: 'Orders',
      description: 'Track and manage customer orders',
      icon: <OrderIcon sx={{ fontSize: 40 }} />,
      href: '/admin/orders',
      color: '#ff5722',
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getDashboardOverview();
        setOverview(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: overview?.total_revenue != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(String(overview.total_revenue))) : '-',
      icon: <MoneyIcon />,
      color: '#4caf50',
    },
    {
      title: 'Total Orders',
      value: overview?.total_orders != null ? String(overview.total_orders) : '-',
      icon: <OrderIcon />,
      color: '#ff9800',
    },
    {
      title: "Today's Orders",
      value: overview?.todays_orders != null ? String(overview.todays_orders) : '-',
      icon: <OrderIcon />,
      color: '#fb8c00',
    },
    {
      title: 'Total Customers',
      value: overview?.total_customers != null ? String(overview.total_customers) : '-',
      icon: <PeopleIcon />,
      color: '#2196f3',
    },
    // Removed Retail and Wholesale customer widgets per requirement
  ];

  return (
    <AdminLayout title="Dashboard">
      <Box>
        {/* Welcome Section */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500, }}>
            Welcome back! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here&apos;s what&apos;s happening with your business today.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {/* Stats Cards */}
        <Grid
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
          gap={{ xs: 2, sm: 3 }}
          sx={{ mb: 4 }}
        >
          {stats.map((stat, index) => (
            <MotionCard
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {loading ? '—' : stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }}
            gap={{ xs: 2, sm: 3 }}
          >
            {adminModules.map((module, index) => (
              <MotionCard
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                      color: module.color,
                    }}
                  >
                    {module.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {module.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => router.push(module.href)}
                    sx={{
                      backgroundColor: module.color,
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: module.color,
                        opacity: 0.9,
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {module.title}
                  </Button>
                </CardActions>
              </MotionCard>
            ))}
          </Grid>
        </Box>

      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard; 
