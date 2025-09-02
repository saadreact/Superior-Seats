# Square API Integration Setup Guide

## Overview
This guide explains how to properly configure Square Connect for your Superior Seats application.

## Environment Files Organization

Your project now has properly organized environment files:

### 📁 **env.local** (Current Development)
- Contains all current development variables
- Includes Square API sandbox configuration
- Has production overrides (commented out)

### 📁 **env.development** (Development Template)
- Template for development environment
- Contains sandbox Square API configuration
- Use for team development setup

### 📁 **env.production** (Production Template)
- Template for production environment
- Contains production Square API configuration
- Use when deploying to production

### 📁 **env.main** & **env.example** (Legacy)
- These files have been consolidated into the above templates
- All variables have been moved to appropriate environment files

## Environment Variables

### Current Development (env.local)
```bash
# ============================================================================
# SQUARE API CONFIGURATION
# ============================================================================

# Backend (Server-side) Variables
SQUARE_CONNECT_URL=https://connect.squareupsandbox.com/
SQUARE_APPLICATION_ID=sandbox-sq0idb-5-Fq9kX2vcQTojh9kXpx8g
SQUARE_APPLICATION_SECRET=EAAAl95rDbByuc-B12igXOdIlXk4Ph0Y8F81RkJsSSkSzuPVU0qmRhWfqteUmUaP
SQUARE_ENVIROMENT=sandbox
SQUARE_LOCATION_ID=LKAK5DG45H6SE

# Frontend (Client-side) Variables
NEXT_PUBLIC_SQUARE_CONNECT_URL=https://connect.squareupsandbox.com/
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-5-Fq9kX2vcQTojh9kXpx8g
NEXT_PUBLIC_SQUARE_ENVIROMENT=sandbox
NEXT_PUBLIC_SQUARE_LOCATION_ID=LKAK5DG45H6SE

# Square Connect Credentials
SQUARE_CONNECT_EMAIL=ali.khalid@acme-one.com
SQUARE_CONNECT_PASSWORD=y~j^2>+5H7@=t,06

# ============================================================================
# API CONFIGURATION
# ============================================================================
NEXT_PUBLIC_API_BASE_URL=https://superiorseats.ali-khalid.com/api

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================
DATABASE_URL=your_database_url_here

# ============================================================================
# NEXT.JS & AUTHENTICATION CONFIGURATION
# ============================================================================
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## ⚠️ CRITICAL: Redirect URI Configuration

### What You Need to Update in Square Connect:

1. **Log into Square Connect** using the credentials provided:
   - **Email**: `ali.khalid@acme-one.com`
   - **Password**: `y~j^2>+5H7@=t,06`

2. **Navigate to your application settings** in Square Connect

3. **Update the Redirect URI** to match exactly:
   ```
   https://superiorseats.ali-khalid.com/api/auth/square/callback
   ```

4. **For local development**, also add:
   ```
   http://localhost:3000/api/auth/square/callback
   ```

### Why This Matters:
- The redirect URI in your Square Connect app settings **MUST EXACTLY MATCH** the one in your code
- If they don't match, OAuth authentication will fail
- Your application is configured to use: `/api/auth/square/callback`

## Environment Management

### For Development:
1. Use `env.local` for your current development setup
2. Copy `env.development` template for team members
3. Fill in actual values for `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.

### For Production:
1. Copy `env.production` template to your production server
2. Fill in all production values
3. Update Square environment from `sandbox` to `production`
4. Update Square URLs from sandbox to production domains

### Environment Switching:
```bash
# Development
cp env.development .env.local

# Production
cp env.production .env.local
```

## Application Structure

### Frontend Files Created:
- `src/services/SquareApiConfig.ts` - Configuration and types
- `src/services/SquareApiService.ts` - API service methods
- `src/hooks/useSquareApi.ts` - React hook for components
- `src/components/SquarePaymentExample.tsx` - Example usage component

### Backend API Endpoints Needed:
You'll need to create these API routes in your Next.js app:

```
/api/square/payments     - Create payments
/api/square/orders      - Create orders
/api/square/customers   - Customer management
/api/auth/square/callback - OAuth callback handler
/api/square/webhooks    - Webhook handler
```

## Testing the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Import and use the example component** in any page:
   ```tsx
   import SquarePaymentExample from '../components/SquarePaymentExample';
   
   export default function TestPage() {
     return <SquarePaymentExample />;
   }
   ```

3. **Check the browser console** for configuration details

4. **Verify environment detection** - should show "Sandbox (Testing)"

## Security Notes

- **Never expose** `SQUARE_APPLICATION_SECRET` in frontend code
- **Always use** `NEXT_PUBLIC_` prefix for frontend-accessible variables
- **Keep** all environment files in your `.gitignore` file
- **Use HTTPS** in production for all Square API calls
- **Rotate secrets** regularly in production

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:
   - Check that the redirect URI in Square Connect matches exactly
   - Ensure no trailing slashes or typos

2. **"Application ID not found" error**:
   - Verify your `SQUARE_APPLICATION_ID` is correct
   - Check that you're using the right environment (sandbox vs production)

3. **OAuth flow not working**:
   - Confirm your redirect URI is properly configured
   - Check that your domain is accessible from the internet

4. **Environment variables not loading**:
   - Ensure you're using the correct environment file
   - Check that `.env.local` is in your project root
   - Restart your development server after changes

### Support:
- Square Developer Documentation: https://developer.squareup.com/
- Square Connect Dashboard: https://connect.squareup.com/

## Next Steps

1. ✅ **Update Square Connect redirect URI** (CRITICAL)
2. ✅ **Fill in missing environment variables** (DATABASE_URL, NEXTAUTH_SECRET)
3. ✅ **Test the integration** using the example component
4. ✅ **Create backend API endpoints** for Square operations
5. ✅ **Implement actual payment flow** in your application
6. ✅ **Set up webhooks** for payment notifications
7. ✅ **Test in sandbox** before going to production

## Production Deployment

When ready for production:

1. **Copy `env.production`** to your production server
2. **Fill in all production values**:
   - Production Square API credentials
   - Production database URL
   - Production NextAuth secret
   - Production domain URLs
3. **Change `SQUARE_ENVIROMENT`** from `sandbox` to `production`
4. **Update URLs** from sandbox to production domains
5. **Test thoroughly** in production environment
6. **Monitor webhooks** and payment flows

## Environment File Checklist

### Development (env.local):
- [ ] Square API sandbox credentials
- [ ] Database URL for development
- [ ] NextAuth secret for development
- [ ] API base URL
- [ ] Local development URLs

### Production (env.production):
- [ ] Square API production credentials
- [ ] Production database URL
- [ ] Production NextAuth secret
- [ ] Production domain URLs
- [ ] Production Square environment

---

**Remember**: 
1. The redirect URI configuration is the most critical step
2. Keep all environment files secure and never commit them to version control
3. Use different credentials for development and production
4. Test thoroughly in sandbox before going live
