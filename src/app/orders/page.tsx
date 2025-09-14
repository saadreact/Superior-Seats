'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function OrdersRedirectPage() {
	const router = useRouter();
  const { user } = useAppSelector((s: any) => s.auth);
	useEffect(() => {
		const cid = user?.role?.id;
		if (cid) {
			router.replace(`/shop/orders?customer_id=${cid}`);
		} else {
			router.replace('/shop/orders');
		}
	}, [router]);
	return null;
} 