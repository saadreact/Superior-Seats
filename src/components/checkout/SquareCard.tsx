"use client";

import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

export interface SquareCardHandle {
	tokenize: () => Promise<{ token: string; details?: any }>;
}

interface SquareCardProps {
	amount: number;
	applicationId?: string;
	locationId?: string;
	onReady?: () => void;
	onError?: (message: string) => void;
}

const SquareCard = React.forwardRef<SquareCardHandle, SquareCardProps>(({ amount, applicationId, locationId: locationIdProp, onReady, onError }, ref) => {
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const paymentsRef = useRef<any>(null);
	const cardRef = useRef<any>(null);

	// Unique container per mount to avoid duplicate ID collisions on rerenders
	const containerId = useMemo(() => `sq-card-container-${Math.random().toString(36).slice(2, 8)}`, []);

	const appId = applicationId || (process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID as string | undefined);
	const locationId = locationIdProp || (process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string | undefined);
	// Prefer explicit env var if valid; otherwise infer from appId prefix
	const explicitEnv = (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || '').toLowerCase();
	const inferredEnv = appId && appId.startsWith('sandbox-') ? 'sandbox' : 'production';
	const env = explicitEnv === 'sandbox' || explicitEnv === 'production' ? explicitEnv : inferredEnv;
	const sdkSrc = env === 'production'
		? 'https://web.squarecdn.com/v1/square.js'
		: 'https://sandbox.web.squarecdn.com/v1/square.js';

	useImperativeHandle(ref, () => ({
		async tokenize() {
			if (!cardRef.current) throw new Error('Card not ready');
			const result = await cardRef.current.tokenize();
			if (result.status === 'OK') return { token: result.token, details: result.details };
			throw new Error(result?.errors?.[0]?.message || 'Card tokenization failed');
		},
	}));

	useEffect(() => {
		let pollTimer: any;
		let timeoutTimer: any;

		const addPreconnect = () => {
			// @ts-ignore
			if ((window as any).__square_preconnected__) return;
			// @ts-ignore
			(window as any).__square_preconnected__ = true;
			const hosts = ['https://sandbox.web.squarecdn.com', 'https://web.squarecdn.com'];
			hosts.forEach((href) => {
				const link1 = document.createElement('link');
				link1.rel = 'preconnect';
				link1.href = href;
				link1.crossOrigin = '';
				document.head.appendChild(link1);
				const link2 = document.createElement('link');
				link2.rel = 'dns-prefetch';
				link2.href = href;
				document.head.appendChild(link2);
			});
		};

		const ensureScript = () => {
			// If SDK already on window, proceed
			// @ts-ignore
			if ((window as any).Square) return true;
			// Only inject script once globally
			// @ts-ignore
			if (!(window as any).__square_sdk_loading__) {
				// @ts-ignore
				(window as any).__square_sdk_loading__ = true;
				const s = document.createElement('script');
				s.src = sdkSrc;
				s.async = true;
				s.onload = () => {
					// @ts-ignore
					window.__square_sdk_loaded__ = true;
				};
				s.onerror = () => { const msg = 'Failed to load Square SDK script. Check network and Allowed Domains.'; setError(msg); try { onError?.(msg); } catch { /* noop */ } };
				document.head.appendChild(s);
			}
			return false;
		};

		const init = async () => {
			if (!appId || !locationId) {
				setError('Missing Square configuration. Please set NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID.');
				return;
			}
			// @ts-ignore
			const Square = (window as any).Square;
			if (!Square) return; // wait for script
			try {
				setError(null);
				paymentsRef.current = await Square.payments(appId, locationId);
				cardRef.current = await paymentsRef.current.card();
				await cardRef.current.attach(`#${containerId}`);
				setIsReady(true);
				try { onReady?.(); } catch { /* noop */ }
			} catch (e: any) {
				console.error('Square init error', e);
				const hint = env === 'sandbox'
					? 'Verify you are using SANDBOX appId/locationId and your current domain (including port) is allowed in Square Dashboard.'
					: 'Verify you are using PRODUCTION appId/locationId and the domain is allowed in Square Dashboard.';
				const msg = e?.message || `Failed to initialize card form. ${hint}`;
				setError(msg);
				try { onError?.(msg); } catch { /* noop */ }
			}
		};

		addPreconnect();
		// Try to use preloaded SDK first; otherwise inject
		const hasSdk = ensureScript();
		let attempts = 0;
		pollTimer = setInterval(() => {
			// @ts-ignore
			if ((window as any).Square) {
				clearInterval(pollTimer);
				clearTimeout(timeoutTimer);
				init();
			} else if (++attempts > 200) {
				clearInterval(pollTimer);
			}
		}, 100);

		// Fallback timeout error after 30s
		timeoutTimer = setTimeout(() => {
			if (!isReady) {
				const msg = 'Web Payments SDK was unable to be initialized in time. Check network, environment, and Allowed Domains.';
				setError(msg);
				try { onError?.(msg); } catch { /* noop */ }
			}
		}, 30000);

		return () => {
			clearInterval(pollTimer);
			clearTimeout(timeoutTimer);
			try {
				cardRef.current?.destroy?.();
			} catch { /* noop */ }
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appId, locationId, sdkSrc]);

	return (
		<>
			<div id={containerId} style={{ minHeight: 46, border: '1px solid #ccc', borderRadius: 8, padding: 12 }} />
			{!isReady && !error && (
				<p style={{ fontSize: 12, color: '#777', marginTop: 6 }}>Loading secure card form…</p>
			)}
			{error && (
				<p style={{ fontSize: 12, color: '#b00020', marginTop: 6 }}>{error}</p>
			)}
		</>
	);
});

SquareCard.displayName = 'SquareCard';

export default SquareCard; 