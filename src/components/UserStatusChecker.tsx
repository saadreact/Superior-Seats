'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';
import api from '@/utils/axios';

const UserStatusChecker = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isInitialLoad = useRef(true);
  const lastPathname = useRef(pathname);

  useEffect(() => {
    // Skip the first load (initial page load)
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      lastPathname.current = pathname;
      return;
    }

    // Only check if pathname actually changed and user has a token
    if (pathname && pathname !== lastPathname.current && localStorage.getItem('auth_token')) {
      console.log('🔍 Route changed, checking user status...', { from: lastPathname.current, to: pathname });
      
      // Update the last pathname
      lastPathname.current = pathname;
      
      // Check user status when navigating between pages
      const checkUserStatus = async () => {
        try {
          const response = await api.get('/api/user');
          const data = response.data;
          
          // Check if user is active
          if (data.data && data.data.is_active === false) {
            console.log('🚨 User account is inactive, forcing logout');
            
            // Show alert with the message
            alert('Your account has been deactivated. Please contact system Administrator.');
            
            // Dispatch logout action
            await dispatch(logoutUser());
            
            // Redirect to home page
            setTimeout(() => {
              window.location.href = '/';
            }, 100);
          }
        } catch (error: any) {
          console.error('Error checking user status:', error);
          
          // Handle unauthorized - user might be inactive
          if (error.response?.status === 401) {
            const errorMessage = error.response?.data?.message || '';
            
            if (errorMessage.toLowerCase().includes('inactive') || 
                errorMessage.toLowerCase().includes('account deactivated') ||
                errorMessage.toLowerCase().includes('user is not active')) {
              console.log('🚨 User account is inactive (from 401 error), forcing logout');
              
              // Show alert with the message
              alert('Your account has been deactivated. Please contact system Administrator.');
              
              // Dispatch logout action
              await dispatch(logoutUser());
              
              // Redirect to home page
              setTimeout(() => {
                window.location.href = '/';
              }, 100);
            }
          }
        }
      };

      // Small delay to avoid checking immediately
      const timeoutId = setTimeout(checkUserStatus, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, dispatch]);

  // This component doesn't render anything
  return null;
};

export default UserStatusChecker;
