'use client';

import React from 'react';
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

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  maxItems = 8,
  separator = <NavigateNextIcon fontSize="small" />,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const allItems = showHome
    ? [{ label: 'Home', href: '/', icon: <HomeIcon sx={{ fontSize: '1rem' }} /> }, ...items]
    : items;

  return (
    <Box
      sx={{
        py: { xs: 1, sm: 1.5, md: 3 },
        mb: { xs: 2, sm: 3, md: 0 },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
       
      }}
    >
      <Container maxWidth="lg">
        <MuiBreadcrumbs
          separator={separator}
          maxItems={isMobile ? 3 : maxItems}
          itemsBeforeCollapse={isMobile ? 1 : 2}
          itemsAfterCollapse={isMobile ? 1 : 1}
          sx={{
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
                  key={item.label}
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
                key={item.label}
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
