# API Troubleshooting Guide

## Overview
This guide helps resolve the "AxiosError: Network Error" that occurs when submitting the contact form.

## Common Causes & Solutions

### 1. **API Server Unreachable**
**Problem**: The API endpoint `https://superiorseats.ali-khalid.com/api/contact` is not accessible.

**Solutions**:
- Check if the API server is running
- Verify the API endpoint URL is correct
- Check server logs for any errors
- Ensure the server is accessible from your network

### 2. **CORS Issues**
**Problem**: Browser blocks the request due to CORS policy.

**Solutions**:
- Ensure the API server allows requests from your domain
- Check if the server has proper CORS headers
- Verify the request origin is whitelisted

### 3. **Network Connectivity**
**Problem**: Local network or internet connectivity issues.

**Solutions**:
- Check your internet connection
- Try accessing the API endpoint directly in browser
- Check firewall settings
- Test with different networks

### 4. **Environment Configuration**
**Problem**: Incorrect API URL configuration.

**Solutions**:
- Check `env.local` file for correct `NEXT_PUBLIC_API_URL`
- Verify environment variables are loaded properly
- Restart the development server after changing env vars

## Quick Fixes

### Enable Mock API Fallback
If the main API is down, you can enable the mock API fallback:

1. **Set environment variable**:
   ```bash
   # In env.local
   NEXT_PUBLIC_USE_MOCK_API=true
   ```

2. **Or enable programmatically**:
   ```typescript
   import { setMockFallback } from '@/services/contactpageapi';
   setMockFallback(true);
   ```

### Use Local API
For development, you can point to a local API:

```bash
# In env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Debug Tools

### API Status Debugger
The contact page includes a debug component (visible in development mode) that shows:
- API configuration
- Connection status
- Connection test results
- Mock API toggle

### Console Logs
Check browser console for detailed error information:
- Network request details
- Error codes and messages
- Retry attempts

## Testing API Connectivity

### 1. **Test API Health Endpoint**
```bash
curl https://superiorseats.ali-khalid.com/api/health
```

### 2. **Test Contact Endpoint**
```bash
curl -X POST https://superiorseats.ali-khalid.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","phone":"1234567890","subject":"Test","message":"Test message"}'
```

### 3. **Check API Status**
```typescript
import { getApiStatus, testApiConnection } from '@/services/contactpageapi';

// Check API status
const status = await getApiStatus();
console.log('API Status:', status);

// Test connection
const isConnected = await testApiConnection();
console.log('Connected:', isConnected);
```

## Environment Variables

### Required Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://superiorseats.ali-khalid.com

# Optional: Enable mock API fallback
NEXT_PUBLIC_USE_MOCK_API=true
```

### Development Overrides
```bash
# Local development
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Staging environment
NEXT_PUBLIC_API_URL=https://staging.superiorseats.com/api
```

## Error Handling Improvements

The API service now includes:
- **Retry Logic**: Automatically retries failed requests
- **Better Error Messages**: User-friendly error descriptions
- **Fallback Options**: Mock API when main API fails
- **Timeout Handling**: Increased timeout to 15 seconds
- **Network Error Detection**: Specific handling for network issues

## Common Error Messages

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `NETWORK_ERROR` | Network connection failed | Check internet connection |
| `ECONNABORTED` | Request timeout | Increase timeout or check server |
| `NO_RESPONSE` | Server unreachable | Check API endpoint and server status |
| `404` | Endpoint not found | Verify API route exists |
| `500` | Server error | Check server logs |

## Support

If the issue persists:
1. Check the API Status Debugger component
2. Review browser console logs
3. Test API endpoints manually
4. Contact the API server administrator
5. Enable mock API fallback for testing

## Mock API Features

The mock API provides:
- Simulated form submission
- Realistic response delays
- Occasional failure simulation (10% chance)
- Form data validation
- Development/testing capabilities

Enable with: `NEXT_PUBLIC_USE_MOCK_API=true`
