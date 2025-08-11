# Square Payment Integration Guide

## Overview
This project has been set up with Square payment integration infrastructure. The current implementation includes:

1. **Square API Service** (`src/services/squareApi.ts`)
2. **Payment API Routes** (`src/app/api/payments/route.ts`)
3. **Updated PaymentMethod Component** (`src/components/checkout/PaymentMethod.tsx`)
4. **Environment Configuration** (`env.example`)

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Square Payment Configuration
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id_here
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here
SQUARE_ENVIRONMENT=sandbox

# Optional: Webhook URL for payment notifications
SQUARE_WEBHOOK_URL=https://your-domain.com/api/webhooks/square
```

### 2. Square Account Setup
1. Create a Square Developer account at [developer.squareup.com](https://developer.squareup.com)
2. Create a new application in the Square Developer Dashboard
3. Get your Application ID and Access Token
4. Create a location in your Square Dashboard
5. Note your Location ID

### 3. Current Implementation Status

#### ✅ Completed:
- Square API service with payment creation, retrieval, and listing
- API routes for payment processing
- Updated PaymentMethod component with proper TypeScript types
- Environment variable structure
- Error handling and loading states
- Responsive design maintained

#### 🔄 In Progress:
- **Frontend SDK Integration**: The React Square Web Payments SDK has compatibility issues with React 19
- **Card Input Fields**: Currently showing placeholder, needs actual Square card input integration

#### 📋 Next Steps for Full Integration:

1. **Install Compatible Square SDK**:
   ```bash
   # Option 1: Use Square's vanilla JavaScript SDK
   npm install @square/web-payments-sdk
   
   # Option 2: Use a compatible React wrapper
   npm install square-web-payments-sdk-react
   ```

2. **Update PaymentMethod Component**:
   Replace the placeholder card container with actual Square card input fields:

   ```typescript
   // Example integration (when SDK is compatible)
   import { Payments } from '@square/web-payments-sdk';
   
   const payments = Payments.load({
     applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
     locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
   });
   
   const card = await payments.card();
   await card.attach('#card-container');
   ```

3. **Test Payment Flow**:
   - Use Square's test card numbers for sandbox testing
   - Verify payment processing through Square Dashboard
   - Test error handling with invalid cards

## File Structure

```
src/
├── services/
│   └── squareApi.ts          # Square API service
├── app/
│   └── api/
│       └── payments/
│           └── route.ts      # Payment API routes
├── components/
│   └── checkout/
│       └── PaymentMethod.tsx # Updated payment component
└── data/
    └── checkoutData.ts       # Updated with billing address types
```

## API Endpoints

### POST /api/payments
Process a new payment with Square.

**Request Body:**
```json
{
  "sourceId": "string",
  "amount": 100.00,
  "currency": "USD",
  "buyerEmailAddress": "customer@example.com",
  "billingAddress": {
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "payment_id",
  "status": "COMPLETED"
}
```

### GET /api/payments?paymentId=xxx
Retrieve payment details by ID.

### GET /api/payments
List all payments (admin only).

## Testing

### Test Card Numbers (Sandbox)
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005
- **Discover**: 6011111111111117

### Test CVV
- Any 3-digit number (e.g., 123)

### Test Expiry Date
- Any future date (e.g., 12/25)

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Access Tokens**: Use different tokens for sandbox and production
3. **PCI Compliance**: Square handles PCI compliance for card data
4. **Webhooks**: Implement webhook verification for production
5. **Error Handling**: Don't expose sensitive error details to clients

## Production Checklist

- [ ] Switch to production Square environment
- [ ] Update environment variables with production credentials
- [ ] Implement webhook handling for payment notifications
- [ ] Add payment logging and monitoring
- [ ] Test with real payment methods
- [ ] Implement proper error handling and user feedback
- [ ] Add payment confirmation emails
- [ ] Set up Square Dashboard monitoring

## Troubleshooting

### Common Issues:

1. **"Square SDK not found"**: Ensure the correct SDK package is installed
2. **"Invalid Application ID"**: Verify your Square Application ID in environment variables
3. **"Location not found"**: Check your Square Location ID
4. **"Payment failed"**: Verify your Access Token has payment permissions

### Debug Mode:
Enable debug logging by setting:
```env
SQUARE_DEBUG=true
```

## Support

For Square-specific issues:
- [Square Developer Documentation](https://developer.squareup.com/docs)
- [Square Support](https://squareup.com/help)

For application-specific issues:
- Check the console for error messages
- Verify environment variables are set correctly
- Test with Square's sandbox environment first
