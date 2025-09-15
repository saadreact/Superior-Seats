import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { authorization_code, state } = body || {};
		if (!authorization_code) {
			return NextResponse.json({ success: false, message: 'authorization_code is required' }, { status: 400 });
		}
		// TODO: Exchange code for tokens on your backend and persist merchant/location
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json({ success: false, message: e?.message || 'Failed to connect' }, { status: 500 });
	}
} 