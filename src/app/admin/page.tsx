'use client';

import React from 'react';
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

const MotionCard = motion(Card);

const AdminDashboard = () => {
  const adminModules = [
    {
      title: 'Customer Types',
      description: 'Manage customer categories and discount levels',
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
      href: '/admin/customer-types',
      color: '#1976d2',
      count: 3,
    },
    {
      title: 'Customers',
      description: 'Add, edit, and manage customer information',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      href: '/admin/customers',
      color: '#388e3c',
      count: 2,
    },
    {
      title: 'Orders',
      description: 'Track and manage customer orders',
      icon: <OrderIcon sx={{ fontSize: 40 }} />,
      href: '/admin/orders',
      color: '#f57c00',
      count: 2,
    },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$1,334.94',
      change: '+12.5%',
      positive: true,
      icon: <MoneyIcon />,
      color: '#4caf50',
    },
    {
      title: 'Total Orders',
      value: '2',
      change: '+8.2%',
      positive: true,
      icon: <OrderIcon />,
      color: '#ff9800',
    },
    {
      title: 'Active Customers',
      value: '2',
      change: '+5.1%',
      positive: true,
      icon: <PeopleIcon />,
      color: '#2196f3',
    },
    {
      title: 'Inventory Items',
      value: '3',
      change: '-2.3%',
      positive: false,
      icon: <InventoryIcon />,
      color: '#9c27b0',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <Box>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome back! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here&apos;s what&apos;s happening with your business today.
          </Typography>
        </Box>

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
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
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
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    label={stat.change}
                    size="small"
                    color={stat.positive ? 'success' : 'error'}
                    variant="outlined"
                  />
                  <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                    vs last month
                  </Typography>
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
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
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
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
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
                    <Chip
                      label={`${module.count} items`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      variant="contained"
                      href={module.href}
                      sx={{
                        backgroundColor: module.color,
                        '&:hover': {
                          backgroundColor: module.color,
                          opacity: 0.9,
                        },
                      }}
                    >
                      Manage {module.title}
                    </Button>
                  </CardActions>
                </MotionCard>
            ))}
          </Grid>
        </Box>

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Recent Activity
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Orders this month</Typography>
              <Typography variant="body2" color="text.secondary">
                2 of 2
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Customer growth</Typography>
            <Typography variant="body2" color="text.secondary">
              100% complete
            </Typography>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard; 