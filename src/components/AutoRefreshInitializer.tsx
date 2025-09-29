'use client';

import { useEffect } from 'react';
import { apiService } from '@/utils/api';
import { tokenManager } from '@/utils/tokenManager';

export default function AutoRefreshInitializer() {
  useEffect(() => {
    // Initialize auto-refresh when the app loads
    apiService.initializeAutoRefresh();
    
    // TokenManager is automatically initialized when imported, but we can ensure it's ready
    console.log('AutoRefreshInitializer: TokenManager initialized');
  }, []);

  return null; // This component doesn't render anything
}
