'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
  useHistory?: boolean;
}

// Page title mapping
const pageTitles: { [key: string]: string } = {
  '/': 'Home',
  '/about': 'About',
  '/contact': 'Contact',
  '/gallery': 'Gallery',
  '/shop': 'Shop',
  '/custom-seats': 'Customize Your Seat',
  '/ShopGallery': 'Shop Specials',
  '/customize-your-seat': 'Customize Your Seat',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/warranty': 'Warranty',
  '/return-policy': 'Return Policy',
  '/checkout': 'Checkout',
  '/admin': 'Admin Panel',
  '/admin/customers': 'Customers',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/categories': 'Categories',
  '/admin/variations': 'Variations',
  '/admin/customer-types': 'Customer Types',
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items = [],
  showHome = true,
  maxItems = 8,
  separator = <NavigateNextIcon fontSize="small" />,
  useHistory = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const [breadcrumbHistory, setBreadcrumbHistory] = useState<BreadcrumbItem[]>([]);

  // Clear localStorage immediately on mount if on home page
  useEffect(() => {
    if (pathname === '/' || pathname === '/home') {
      // Clear localStorage immediately when component mounts on home page
      localStorage.removeItem('breadcrumbHistory');
      localStorage.removeItem('breadcrumb');
      localStorage.removeItem('navigationHistory');
      // Set to empty and remove again
      localStorage.setItem('breadcrumbHistory', '');
      localStorage.removeItem('breadcrumbHistory');
      // Set state to home only
      setBreadcrumbHistory([{ label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> }]);
      
      // Additional timeout to ensure it's cleared after navigation
      setTimeout(() => {
        localStorage.removeItem('breadcrumbHistory');
        localStorage.removeItem('breadcrumb');
        localStorage.removeItem('navigationHistory');
      }, 100);
    }
  }, []); // Empty dependency array - runs only once on mount

  // Clear breadcrumb history
  const clearBreadcrumbHistory = () => {
    const homeItem = { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> };
    setBreadcrumbHistory([homeItem]);
    // Aggressively clear localStorage
    localStorage.removeItem('breadcrumbHistory');
    localStorage.removeItem('breadcrumb');
    localStorage.removeItem('navigationHistory');
    // Set to empty and remove again
    localStorage.setItem('breadcrumbHistory', '');
    localStorage.removeItem('breadcrumbHistory');
  };

  // Handle history on route change
  useEffect(() => {
    if (!useHistory || !pathname) return;

    // If on home page, clear everything and return early
    if (pathname === '/' || pathname === '/home') {
      clearBreadcrumbHistory();
      return;
    }

    // Resolve page title
    let currentPageTitle =
      pageTitles[pathname] ||
      pageTitles[pathname + '/'] ||
      pageTitles[pathname.replace(/\/$/, '')];

    if (!currentPageTitle) {
      const parts = pathname.split('/').filter(Boolean);
      currentPageTitle = parts.length > 0 ? parts[parts.length - 1] : 'Page';
      currentPageTitle = currentPageTitle
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    const currentItem: BreadcrumbItem = { label: currentPageTitle, href: pathname };
    const homeItem = { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> };

    // Load previous history - but not if we're on home page
    let prevHistory: BreadcrumbItem[] = [];
    if (pathname !== '/' && pathname !== '/home') {
      const saved = localStorage.getItem('breadcrumbHistory');
      if (saved) {
        try {
          prevHistory = JSON.parse(saved);
        } catch {
          prevHistory = [];
        }
      }
    }

    // Build new history
    let newHistory = [homeItem, ...prevHistory.filter((x) => x.href !== '/' && x.href !== pathname), currentItem];

    // Remove duplicates
    newHistory = newHistory.filter(
      (item, index, arr) => arr.findIndex((p) => p.href === item.href) === index
    );

    // Limit to maxItems
    if (newHistory.length > maxItems) {
      newHistory = newHistory.slice(-maxItems);
    }

    setBreadcrumbHistory(newHistory);

    // Save without icons
    localStorage.setItem(
      'breadcrumbHistory',
      JSON.stringify(newHistory.map(({ label, href }) => ({ label, href })))
    );
  }, [pathname, useHistory, maxItems]);

  // Additional effect to aggressively clear localStorage when on home page
  useEffect(() => {
    if (pathname === '/' || pathname === '/home') {
      // Force clear localStorage multiple times to ensure it's gone
      localStorage.removeItem('breadcrumbHistory');
      localStorage.removeItem('breadcrumb');
      localStorage.removeItem('navigationHistory');
      // Set to empty and remove again
      localStorage.setItem('breadcrumbHistory', '');
      localStorage.removeItem('breadcrumbHistory');
      // Clear the state as well
      setBreadcrumbHistory([{ label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> }]);
      
      // Additional timeout to ensure it's cleared after navigation
      setTimeout(() => {
        localStorage.removeItem('breadcrumbHistory');
        localStorage.removeItem('breadcrumb');
        localStorage.removeItem('navigationHistory');
      }, 100);
    }
  }, [pathname]);

  // Items to display
  const allItems =
    useHistory && breadcrumbHistory.length > 0
      ? breadcrumbHistory
      : showHome
      ? [{ label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> }, ...items]
      : items;

  return (
    <Box
      sx={{
        py: 0,
        mb: 0,
        mt: { xs: 0, sm: -0.5, md: -1, lg: -1.5 },
        backgroundColor: 'transparent',
        borderTop: '1px solid rgba(218, 41, 28, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <MuiBreadcrumbs
          separator={separator}
          maxItems={isMobile ? 3 : maxItems}
          itemsBeforeCollapse={isMobile ? 1 : 2}
          itemsAfterCollapse={isMobile ? 1 : 1}
          sx={{
            py: 1,
            '& .MuiBreadcrumbs-separator': {
              color: 'text.secondary',
              mx: { xs: 0.5, sm: 1 },
            },
          }}
        >
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            if (isLast || !item.href) {
              return (
                <Typography
                  key={`${item.label}-${index}`}
                  variant="body2"
                  sx={{
                    color: isLast ? 'primary.main' : 'text.secondary',
                    fontWeight: isLast ? 600 : 400,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    maxWidth: { xs: '120px', sm: '200px' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.icon && item.icon}
                  {item.label}
                </Typography>
              );
            }

            return (
              <Link
                key={`${item.label}-${index}`}
                component={NextLink}
                href={item.href}
                underline="hover"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  maxWidth: { xs: '120px', sm: '200px' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {item.icon && item.icon}
                {item.label}
              </Link>
            );
          })}
        </MuiBreadcrumbs>
      </Container>
    </Box>
  );
};

export default Breadcrumbs;
