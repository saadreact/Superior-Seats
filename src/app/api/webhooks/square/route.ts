import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Square webhook signature verification
function verifySquareWebhook(
  payload: string,
  signature: string,
  webhookSecret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const computedSignature = hmac.digest('base64');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-square-signature') || '';
    const webhookSecret = process.env.SQUARE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('SQUARE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    if (!verifySquareWebhook(payload, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(payload);
    const { type, data } = webhookData;

    console.log('Received Square webhook:', { type, data });

    // Handle different webhook types
    switch (type) {
      case 'payment.updated':
        await handlePaymentUpdate(data);
        break;
      case 'payment.created':
        await handlePaymentCreated(data);
        break;
      case 'refund.created':
        await handleRefundCreated(data);
        break;
      default:
        console.log('Unhandled webhook type:', type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentUpdate(data: any) {
  try {
    const { object } = data;
    const payment = object.payment;
    
    if (!payment) return;

    console.log('Payment updated:', {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amountMoney
    });

    // Update order status in your database
    // await updateOrderStatus(payment.id, payment.status);
    
    // Send notification to customer if payment completed
    if (payment.status === 'COMPLETED') {
      // await sendPaymentConfirmationEmail(payment);
    }
  } catch (error) {
    console.error('Error handling payment update:', error);
  }
}

async function handlePaymentCreated(data: any) {
  try {
    const { object } = data;
    const payment = object.payment;
    
    if (!payment) return;

    console.log('Payment created:', {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amountMoney
    });

    // Create order record in your database
    // await createOrder(payment);
  } catch (error) {
    console.error('Error handling payment created:', error);
  }
}

async function handleRefundCreated(data: any) {
  try {
    const { object } = data;
    const refund = object.refund;
    
    if (!refund) return;

    console.log('Refund created:', {
      refundId: refund.id,
      paymentId: refund.paymentId,
      amount: refund.amountMoney,
      status: refund.status
    });

    // Update order status to refunded
    // await updateOrderRefundStatus(refund.paymentId, refund);
  } catch (error) {
    console.error('Error handling refund created:', error);
  }
}
