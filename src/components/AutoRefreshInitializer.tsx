'use client';

import { useEffect } from 'react';
import { apiService } from '@/utils/api';

export default function AutoRefreshInitializer() {
  useEffect(() => {
    // Initialize auto-refresh when the app loads
    apiService.initializeAutoRefresh();
  }, []);

  return null; // This component doesn't render anything
}
