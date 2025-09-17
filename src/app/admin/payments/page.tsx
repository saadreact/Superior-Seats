'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, Typography, Button, Avatar, Snackbar, Alert } from '@mui/material';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setConnected, clearSquare } from '@/store/squareSlice';

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
    // Treat either explicit success flag or square=success route as connected
    const squareStatus = params.get('square');
    if (squareStatus === 'success') {
      dispatch(setConnected({ connected: true }));
      setMsg('Square connected.');
      const clean = window.location.pathname;
      window.history.replaceState({}, '', clean);
      return;
    }
    const justConnected = params.get('connected');
    if (justConnected === '1') {
      dispatch(setConnected({ connected: true }));
      setMsg('Square connected.');
      const clean = window.location.pathname;
      window.history.replaceState({}, '', clean);
      return;
    }
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
    const url = 'https://app.squareupsandbox.com/oauth2/authorize?client_id=sandbox-sq0idb-5-Fq9kX2vcQTojh9kXpx8g&scope=MERCHANT_PROFILE_READ%20PAYMENTS_READ%20PAYMENTS_WRITE%20CUSTOMERS_READ%20CUSTOMERS_WRITE&redirect_uri=https%3A//superiorseats.ali-khalid.com/square/admin/callback&state=connect_square';
    window.location.href = url;
  };

  const disconnectSquare = () => {
    dispatch(clearSquare());
    setMsg('Disconnected from Square.');
  };

  return (
    <AdminLayout title="Payments">
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Card sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'black', width: 56, height: 56 }}>■</Avatar>
      <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Square</Typography>
                </Box>
              </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={connectSquare} disabled={connected}>{connected ? 'Connected' : 'Connect'}</Button>
            <Button variant="outlined" color="error" onClick={disconnectSquare} disabled={!connected}>Disconnect</Button>
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
