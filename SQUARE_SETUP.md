# Square Payment Integration Setup

## Environment Variables Required

Add these environment variables to your `.env.local` file:

### Frontend (Next.js Public Variables)
```env
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-your_application_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox
```

### Backend (Server-side Variables)
```env
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_WEBHOOK_SECRET=your_square_webhook_secret
```

## Square Account Setup

1. **Create a Square Developer Account**
   - Go to [Square Developer Dashboard](https://developer.squareup.com/)
   - Sign up or log in to your account

2. **Create an Application**
   - Create a new application in the Square Developer Dashboard
   - Note down your Application ID (format: `sandbox-sq0idb-xxxxxxxxxxxxxxxxxxxxxxxx`)

3. **Get Your Location ID**
   - In the Square Dashboard, go to Locations
   - Copy your Location ID

4. **Generate Access Token**
   - In your application settings, generate an access token
   - For sandbox: Use sandbox access token
   - For production: Use production access token

5. **Configure Webhooks (Optional)**
   - Set up webhooks to receive payment notifications
   - Use your domain: `https://yourdomain.com/api/webhooks/square`

## Testing

### Sandbox Testing
- Use Square's test card numbers for testing
- Test card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

### Production Deployment
- Change `SQUARE_ENVIRONMENT` to `production`
- Use production access tokens
- Update application settings for production domain

## Features Implemented

✅ **Square Web Payments SDK Integration**
- Credit card payments
- Apple Pay (when available)
- Google Pay (when available)
- Dynamic SDK loading
- Real payment ID integration

✅ **Backend API Integration**
- Real Square API calls
- Payment processing
- Payment status tracking
- Webhook support
- Signature verification

✅ **Enhanced Payment Features**
- Payment retry mechanism
- Status polling
- Order confirmation with payment details
- Error recovery

✅ **Security Features**
- PCI compliance through Square
- Secure tokenization
- No card data stored locally
- Webhook signature verification

## Troubleshooting

### InvalidApplicationIdError
If you see the error "The Payment 'applicationId' option is not in the correct format":

1. **Check Application ID Format**:
   - Sandbox: Must start with `sandbox-sq0idb-`
   - Production: Must start with `sq0idb-`
   - Example: `sandbox-sq0idb-xxxxxxxxxxxxxxxxxxxxxxxx`

2. **Verify Environment Variables**:
   ```bash
   # Check if variables are set correctly
   echo $NEXT_PUBLIC_SQUARE_APPLICATION_ID
   echo $NEXT_PUBLIC_SQUARE_LOCATION_ID
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## Usage

The payment integration is automatically available in your checkout flow. Users can:

1. **Credit Card**: Enter card details in the secure Square form
2. **Apple Pay**: Use Apple Pay if available on their device
3. **Google Pay**: Use Google Pay if available on their device

All payments are processed securely through Square's infrastructure.
