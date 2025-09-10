'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, Typography, Button, Avatar, Snackbar, Alert } from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setConnected } from '@/store/squareSlice';

const AdminPayments = () => {
  const dispatch = useDispatch();
  const square = useSelector((s: RootState) => (s as any).square);
  const [msg, setMsg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const connected = !!square?.connected;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (!code) return;
    // Optimistically mark connected so the button disables immediately
    dispatch(setConnected({ connected: true }));
    setMsg('Completing Square connection...');
    (async () => {
      try {
        const res = await fetch('/api/square/admin/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authorization_code: code, state }),
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          const errs = data?.errors ? Object.values(data.errors).flat().join(' | ') : data?.message || 'Square connect failed';
          setError(errs);
          return;
        }
        dispatch(setConnected({ connected: true, merchantId: data?.merchant_id || data?.merchantId, locationId: data?.location_id || data?.locationId }));
        setMsg('Square connected.');
        const clean = window.location.pathname;
        window.history.replaceState({}, '', clean);
      } catch (e: any) {
        setError(e?.message || 'Square connect failed');
      }
    })();
  }, [dispatch]);

  const connectSquare = async () => {
    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || process.env.REACT_APP_SQUARE_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SQUARE_REDIRECT_URI || process.env.REACT_APP_SQUARE_REDIRECT_URI || (typeof window !== 'undefined' ? `${window.location.origin}/api/square/admin/callback` : '');
    const scope = 'CUSTOMERS_READ,CUSTOMERS_WRITE,PAYMENTS_READ,PAYMENTS_WRITE';
    const state = Math.random().toString(36);
    const base = (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox').toLowerCase() === 'production'
      ? 'https://connect.squareup.com/oauth2/authorize'
      : 'https://connect.squareupsandbox.com/oauth2/authorize';
    const url = `${base}?client_id=${encodeURIComponent(String(appId || ''))}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;
    window.location.href = url;
  };

  return (
    <AdminLayout title="Payments">
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Card sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'black', width: 56, height: 56 }}>■</Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Square</Typography>
              <Typography variant="body2" color="text.secondary">OrderCircle Payments - Square</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={connectSquare} disabled={connected}>{connected ? 'Connected' : 'Connect'}</Button>
            <Link href="https://developer.squareup.com/docs/oauth-api/overview" target="_blank" rel="noopener noreferrer">
              <Button variant="outlined">Help</Button>
            </Link>
          </Box>
        </Card>
        <Snackbar open={!!msg || !!error} autoHideDuration={6000} onClose={() => { setMsg(''); setError(''); }}>
          <Alert severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>{error || msg}</Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default AdminPayments;
