import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code') || '';
	const state = url.searchParams.get('state') || '';
	const error = url.searchParams.get('error') || '';
	const base = `${url.protocol}//${url.host}`;

	const redirect = new URL('/admin/payments', base);
	if (code) redirect.searchParams.set('code', code);
	if (state) redirect.searchParams.set('state', state);
	if (error) redirect.searchParams.set('error', error);
	redirect.searchParams.set('connected', '1');

	return NextResponse.redirect(redirect.toString(), { status: 302 });
} 