import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Client, Environment } from 'square';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { amount, currency = 'USD', sourceId, orderId, billingAddress } = body || {};

		if (!sourceId) {
			return NextResponse.json({ success: false, error: 'Missing sourceId (card token)' }, { status: 400 });
		}
		if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
			return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
		}

		const accessToken = process.env.SQUARE_ACCESS_TOKEN;
		const environmentVar = process.env.SQUARE_ENVIRONMENT || 'sandbox';
		const locationId = process.env.SQUARE_LOCATION_ID;

		if (!accessToken || !locationId) {
			return NextResponse.json({ success: false, error: 'Square configuration missing on server' }, { status: 500 });
		}

		const client = new Client({
			accessToken,
			environment: environmentVar.toLowerCase() === 'production' ? Environment.Production : Environment.Sandbox,
		});

		const idempotencyKey = randomUUID();
		const amountMoney = {
			amount: Math.round(amount * 100),
			currency: currency || 'USD',
		} as const;

		const result = await client.paymentsApi.createPayment({
			sourceId,
			idempotencyKey,
			amountMoney,
			locationId,
			referenceId: orderId ? String(orderId) : undefined,
			billingAddress: billingAddress ? {
				addressLine1: billingAddress.address,
				addressLine2: billingAddress.address2,
				locality: billingAddress.city,
				administrativeDistrictLevel1: billingAddress.state,
				postalCode: billingAddress.zipCode,
				country: billingAddress.country,
			} : undefined,
		});

		const payment = result?.result?.payment;
		if (!payment) {
			return NextResponse.json({ success: false, error: 'Payment failed' }, { status: 500 });
		}

		return NextResponse.json({ success: true, paymentId: payment.id, status: payment.status });
	} catch (err: any) {
		const message = err?.errors?.[0]?.detail || err?.message || 'Payment error';
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
} 