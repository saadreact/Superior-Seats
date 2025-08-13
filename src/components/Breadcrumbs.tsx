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
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();
  const [breadcrumbHistory, setBreadcrumbHistory] = useState<BreadcrumbItem[]>([]);

  // Load breadcrumb history from localStorage on component mount
  useEffect(() => {
    if (useHistory) {
      const savedHistory = localStorage.getItem('breadcrumbHistory');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          // Validate that the history starts with Home
          if (parsedHistory.length > 0 && parsedHistory[0].href === '/') {
            // Add icons to the loaded history
            const historyWithIcons = parsedHistory.map((item: BreadcrumbItem, index: number) => ({
              ...item,
              icon: item.href === '/' ? <HomeIcon sx={{ fontSize: '1rem' }} /> : undefined
            }));
            setBreadcrumbHistory(historyWithIcons);
          } else {
            // If history doesn't start with Home, reset it
            const homeItem = { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> };
            setBreadcrumbHistory([homeItem]);
            // Save without icon to avoid circular reference
            localStorage.setItem('breadcrumbHistory', JSON.stringify([{ label: 'Home', href: '/' }]));
          }
        } catch (error) {
          console.error('Error parsing breadcrumb history:', error);
          // Reset to Home if there's an error
          const homeItem = { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> };
          setBreadcrumbHistory([homeItem]);
          localStorage.setItem('breadcrumbHistory', JSON.stringify([{ label: 'Home', href: '/' }]));
        }
      } else {
        // No saved history, start with Home
        const homeItem = { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> };
        setBreadcrumbHistory([homeItem]);
        localStorage.setItem('breadcrumbHistory', JSON.stringify([{ label: 'Home', href: '/' }]));
      }
    }
  }, [useHistory]);

  // Update breadcrumb history when pathname changes
  useEffect(() => {
    if (useHistory && pathname) {
      const currentPageTitle = pageTitles[pathname] || pathname.split('/').pop() || 'Page';
      const currentItem: BreadcrumbItem = {
        label: currentPageTitle,
        href: pathname,
      };

      setBreadcrumbHistory(prevHistory => {
        // Always start with Home if we're not already there
        let newHistory = prevHistory;
        
        // If we're at home page, reset history
        if (pathname === '/') {
          newHistory = [{ label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> }];
        } else {
          // Check if this page is already in history (back navigation)
          const existingIndex = prevHistory.findIndex(item => item.href === pathname);
          
          if (existingIndex !== -1) {
            // User went back to a previous page - truncate history to that point
            newHistory = prevHistory.slice(0, existingIndex + 1);
          } else {
            // New page - add to history
            // Ensure Home is always first
            const homeItem = { label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> };
            
            // Remove any existing Home entry and add current page
            const historyWithoutHome = prevHistory.filter(item => item.href !== '/');
            newHistory = [homeItem, ...historyWithoutHome, currentItem];
          }
        }

        // Limit history to last 8 items (including Home)
        if (newHistory.length > 8) {
          newHistory = newHistory.slice(-8);
        }

        // Save to localStorage without icons to avoid circular reference
        const historyForStorage = newHistory.map(item => ({
          label: item.label,
          href: item.href
        }));
        localStorage.setItem('breadcrumbHistory', JSON.stringify(historyForStorage));
        
        return newHistory;
      });
    }
  }, [pathname, useHistory]);

  // Determine which items to show
  const allItems = useHistory && breadcrumbHistory.length > 0 
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
