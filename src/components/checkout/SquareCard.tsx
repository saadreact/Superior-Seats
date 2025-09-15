"use client";

import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Script from 'next/script';

export interface SquareCardHandle {
	tokenize: () => Promise<{ token: string; details?: any }>;
}

interface SquareCardProps {
	amount: number;
}

const SquareCard = React.forwardRef<SquareCardHandle, SquareCardProps>(({ amount }, ref) => {
	const [isReady, setIsReady] = useState(false);
	const [sdkLoaded, setSdkLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const paymentsRef = useRef<any>(null);
	const cardRef = useRef<any>(null);

	// Unique container per mount to avoid duplicate ID collisions on rerenders
	const containerId = useMemo(() => `sq-card-container-${Math.random().toString(36).slice(2, 8)}`, []);

	const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID as string | undefined;
	const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string | undefined;
	const env = (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
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
			} catch (e: any) {
				console.error('Square init error', e);
				setError(e?.message || 'Failed to initialize card form. Ensure your domain is allowed in Square dashboard.');
			}
		};

		if (sdkLoaded) {
			// Poll for window.Square up to ~10s
			let attempts = 0;
			pollTimer = setInterval(() => {
				// @ts-ignore
				if ((window as any).Square) {
					clearInterval(pollTimer);
					clearTimeout(timeoutTimer);
					init();
				} else if (++attempts > 50) {
					clearInterval(pollTimer);
				}
			}, 200);

			// Fallback timeout error after 12s
			timeoutTimer = setTimeout(() => {
				if (!isReady) setError('Square SDK timed out loading. Check network and Allowed domains.');
			}, 12000);
		}

		return () => {
			clearInterval(pollTimer);
			clearTimeout(timeoutTimer);
			try {
				cardRef.current?.destroy?.();
			} catch { /* noop */ }
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sdkLoaded, appId, locationId]);

	return (
		<>
			<Script
				src={sdkSrc}
				strategy="afterInteractive"
				onLoad={() => setSdkLoaded(true)}
				onError={() => setError('Failed to load Square SDK script. Check network and Allowed domains.')}
			/>
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