import { NextRequest, NextResponse } from 'next/server';
import { squareApi, PaymentRequest } from '@/services/squareApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sourceId, 
      amount, 
      currency = 'USD', 
      buyerEmailAddress,
      billingAddress 
    } = body;

    // Validate required fields
    if (!sourceId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: sourceId and amount' },
        { status: 400 }
      );
    }

    // Generate unique idempotency key
    const idempotencyKey = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const paymentData: PaymentRequest = {
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      },
      locationId: process.env.SQUARE_LOCATION_ID!,
      buyerEmailAddress,
      billingAddress,
    };

    const result = await squareApi.createPayment(paymentData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentId: result.paymentId,
        status: result.status,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (paymentId) {
      const result = await squareApi.getPayment(paymentId);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          paymentId: result.paymentId,
          status: result.status,
        });
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
    }

    // List payments if no paymentId provided
    const result = await squareApi.listPayments();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        payments: result.payments,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
