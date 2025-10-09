'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface BrandedLoaderProps {
  text?: string;
  minHeight?: string | number;
}

const BrandedLoader: React.FC<BrandedLoaderProps> = ({ text = 'Loading...', minHeight = '50vh' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight,
      }}
    >
      <Image
        src="/superiorlogo/logored.png"
        alt="Superior Seats"
        width={120}
        height={120}
        style={{ objectFit: 'contain' }}
        priority
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontWeight: 600, letterSpacing: '0.02em' }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default BrandedLoader;



