// TODO: Uncomment when customize page is ready
// 'use client';

// import React from 'react';
// import LazyComponent from '@/components/common/LazyComponent';

// const CustomSeatsPage = () => {
//   return (
//     <LazyComponent
//       component={() => import('@/components/CustomizedSeat')}
//       loadingText="Loading Custom Seats..."
//     />
//   );
// };

// export default CustomSeatsPage;

// Temporary placeholder component
'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function CustomSeatsPage() {
  const router = useRouter();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 4,
      textAlign: 'center'
    }}>
      <Typography variant="h3" sx={{ mb: 2, color: 'primary.main' }}>
        Customize Feature Coming Soon!
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
        We&apos;re working on bringing you an amazing seat customization experience.
      </Typography>
      <Button 
        variant="contained" 
        size="large"
        onClick={() => router.push('/shop-now')}
        sx={{ px: 4, py: 1.5 }}
      >
        Browse Our Shop
      </Button>
    </Box>
  );
} 