# End-to-End Testing Guide
## 3D Product Order Integration

This document provides comprehensive testing procedures for the 3D customizable product order flow, from product selection to order completion and viewing.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Environment Setup](#test-environment-setup)
3. [Test Scenarios](#test-scenarios)
4. [Step-by-Step Test Procedures](#step-by-step-test-procedures)
5. [Expected Results](#expected-results)
6. [Edge Cases & Error Scenarios](#edge-cases--error-scenarios)
7. [Data Verification](#data-verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Backend Requirements
- ✅ Laravel API server running (`php artisan serve`)
- ✅ Database migrations run (`php artisan migrate`)
- ✅ Seeders executed (`php artisan db:seed`)
- ✅ At least one 3D customizable product seeded
- ✅ Material types, colors, and patterns available
- ✅ Storage symlink created (`php artisan storage:link`)

### Frontend Requirements
- ✅ Next.js development server running (`npm run dev`)
- ✅ Environment variables configured (`.env.local`)
- ✅ API base URL pointing to Laravel backend
- ✅ User authentication working

### Test Data Requirements
- ✅ At least one 3D customizable product in database
- ✅ Product has `is_customize_3d_product = true`
- ✅ Product has associated material types, colors, and patterns
- ✅ Static assets available in `public/assets/`:
  - `/assets/models/1/chair1_v03.glb`
  - `/assets/fabrics/*.png`
  - `/assets/patterns/1/*-preview.jpg`

---

## Test Environment Setup

### 1. Verify Backend Setup

```bash
# Navigate to API directory
cd "D:\Allied C Work\Superior Seats\superiorseats-api"

# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# Verify migrations
php artisan migrate:status

# Check seeded data
php artisan tinker
>>> \App\Models\Product::where('is_customize_3d_product', true)->count();
>>> exit
```

### 2. Verify Frontend Setup

```bash
# Navigate to frontend directory
cd "D:\Allied C Work\Superior Seats\Superior-Seats"

# Check environment variables
cat .env.local | grep NEXT_PUBLIC_API

# Verify API connectivity
# Open browser console and check for API errors
```

### 3. Verify Static Assets

```bash
# Check static assets exist
ls public/assets/models/1/
ls public/assets/fabrics/
ls public/assets/patterns/1/
```

---

## Test Scenarios

### Scenario 1: Complete 3D Product Order Flow (Authenticated User)
**Objective**: Test the full flow from product selection to order completion for an authenticated user.

### Scenario 2: 3D Product Order Flow (Unauthenticated User)
**Objective**: Test that unauthenticated users can customize but are redirected to login before adding to cart.

### Scenario 3: Order View & Customization Data Display
**Objective**: Verify that saved 3D customization data is correctly displayed in order views.

### Scenario 4: Two-Tone Customization
**Objective**: Test per-part customization (two-tone feature) and verify it's saved correctly.

### Scenario 5: Price Calculation & Breakdown
**Objective**: Verify that prices are calculated correctly for all customization options.

### Scenario 6: Order Editing (Admin)
**Objective**: Test that admins can view and edit orders with 3D customization data.

---

## Step-by-Step Test Procedures

### Test Scenario 1: Complete 3D Product Order Flow (Authenticated User)

#### Step 1: Navigate to Customize Your Seat Page
1. Open browser and navigate to `/customize-your-seat`
2. **Expected**: Page loads showing list of products
3. **Verify**: At least one product with "Customize" button is visible

#### Step 2: Select 3D Customizable Product
1. Click "Customize" button on a 3D customizable product
2. **Expected**: Redirected to `/build-your-seat?productId={id}`
3. **Verify**: URL contains `productId` parameter
4. **Verify**: 3D model loads (may take a few seconds)

#### Step 3: Customize Material Type
1. In the "Fabric Type" dropdown, select a material type (e.g., "Carroll Leather")
2. **Expected**: 
   - Dropdown shows selected material
   - Material preview image appears below dropdown
   - Available colors update to show colors for selected material
   - 3D model updates to show selected material texture
3. **Verify**: No console errors
4. **Verify**: Material preview image loads (or shows hex fallback)

#### Step 4: Customize Color
1. Click on a color tile in the "Fabric Color" section
2. **Expected**:
   - Selected color is highlighted with checkmark
   - Material preview image updates to show selected color texture
   - 3D model updates to show selected color
   - Price breakdown updates (if color has price)
3. **Verify**: Color image loads (or shows hex fallback)
4. **Verify**: Hover tooltip shows color name, hex, and price

#### Step 5: Customize Stitch Pattern
1. In the "Seat Stitch Pattern" section, click on a pattern tile
2. **Expected**:
   - Selected pattern is highlighted with border
   - Pattern preview image loads
   - 3D model updates to show selected pattern
   - Price breakdown updates (if pattern has price)
3. **Verify**: Pattern image loads from `/assets/patterns/1/XX-preview.jpg`
4. **Verify**: Hover tooltip shows pattern name, description, and price

#### Step 6: Customize Stitch Color
1. After selecting a pattern, click on a stitch color tile
2. **Expected**:
   - Selected stitch color is highlighted
   - 3D model updates to show selected stitch color
   - Price breakdown updates (if stitch color has price)
3. **Verify**: Stitch color is applied to pattern in 3D model

#### Step 7: Configure Other Options
1. In the "Customize Options" section (bottom), select:
   - Recline Type
   - Lumbar Type
   - Heat/Cool Option
   - Seat Type
   - Item Type
   - Seat Style
   - Included Arm
2. **Expected**: Each selection updates the price breakdown
3. **Verify**: Price breakdown shows all selected options with prices

#### Step 8: Verify Price Breakdown
1. Check the price breakdown section on the right
2. **Expected**:
   - Base Price displayed
   - Material Type price (if applicable)
   - Color price (if applicable)
   - Stitch Pattern price (if applicable)
   - Stitch Color price (if applicable)
   - All other selected options with prices
   - Total Price calculated correctly
3. **Verify**: Total = Base Price + sum of all option prices

#### Step 9: Add to Cart
1. Click "Add to Cart" button
2. **Expected**:
   - If authenticated: Product added to cart, redirected to `/shop/orders/create`
   - If not authenticated: Redirected to login page with redirect parameter
3. **Verify**: No console errors
4. **Verify**: Cart contains the product with correct customization data

#### Step 10: Complete Order Wizard
1. In the order wizard (`/shop/orders/create`):
   - Verify customer information is pre-filled
   - Enter/verify shipping address
   - Enter/verify billing address
   - Select payment method
   - Review order summary
2. **Expected**: All customization details are preserved
3. **Verify**: Price matches the breakdown from customization page

#### Step 11: Submit Order
1. Click "Submit Order" button
2. **Expected**:
   - Order is created successfully
   - Redirected to order confirmation page
   - Order number is displayed
3. **Verify**: No errors in console or network tab

#### Step 12: Verify Order in Database
```bash
# Check order was created
php artisan tinker
>>> $order = \App\Models\Order::latest()->first();
>>> $order->orderItems->first()->customization_data;
>>> exit
```
**Expected**: `customization_data` contains:
```json
{
  "fabricType": "1",
  "fabricColor": "#dfdfdf",
  "patternId": "1-2",
  "stitchColor": "#ffffff",
  "twoToneCustomizations": {}
}
```

---

### Test Scenario 2: 3D Product Order Flow (Unauthenticated User)

#### Step 1: Logout (if logged in)
1. Logout from the application
2. **Verify**: User is logged out

#### Step 2: Navigate and Customize
1. Follow Steps 1-8 from Scenario 1
2. **Expected**: All customization features work without authentication

#### Step 3: Attempt to Add to Cart
1. Click "Add to Cart" button
2. **Expected**:
   - Redirected to `/login?redirect=/build-your-seat?productId={id}`
   - Customization data is stored in `sessionStorage` as `pending3DCustomization`
3. **Verify**: Check browser `sessionStorage`:
   ```javascript
   JSON.parse(sessionStorage.getItem('pending3DCustomization'))
   ```

#### Step 4: Login
1. Complete login process
2. **Expected**: After login, redirected back to customization page
3. **Verify**: Previous customizations are preserved (if implemented)

#### Step 5: Add to Cart After Login
1. Click "Add to Cart" again
2. **Expected**: Product added to cart successfully
3. **Verify**: Customization data is included in cart item

---

### Test Scenario 3: Order View & Customization Data Display

#### Step 1: View Order (Admin)
1. Navigate to `/admin/orders/{orderId}`
2. **Expected**: Order details page loads
3. **Verify**: Order items are displayed in table

#### Step 2: Open Variants Drawer
1. Click "Details" button for a 3D customizable product
2. **Expected**: `AdminVariantsViewDrawer` opens
3. **Verify**: Drawer shows:
   - Material type selection (read-only)
   - Color selection (read-only)
   - Pattern selection (read-only)
   - All other variant selections
   - 3D Customization Details section (if `customizationData` exists)
   - Two-Tone Customizations section (if applicable)

#### Step 3: Verify 3D Customization Data Display
1. In the drawer, check for "3D Customization Details" section
2. **Expected**: Shows:
   - Material Type ID
   - Fabric Color (hex code)
   - Pattern ID
   - Stitch Color (hex code)
3. **Verify**: All values match what was selected during customization

#### Step 4: Verify Two-Tone Customizations
1. If two-tone customizations exist, check the "Two-Tone Customizations" section
2. **Expected**: Shows chips for each customized part:
   - Part name (e.g., "backrest", "seat")
   - Fabric color for that part
3. **Verify**: All parts are listed correctly

#### Step 5: View Order (Shop/Customer)
1. Navigate to `/shop/orders/{orderId}`
2. **Expected**: Order details page loads
3. **Verify**: Same customization data is displayed in variants drawer

---

### Test Scenario 4: Two-Tone Customization

#### Step 1: Enable Two-Tone Mode
1. On customization page, click "Edit Two-Tone Color & Pattern" button
2. **Expected**: Popup opens with part selection

#### Step 2: Customize Individual Parts
1. In the popup, select different parts (e.g., "backrest", "seat")
2. For each part:
   - Select a fabric color
   - Select a pattern
   - Select a stitch color
3. **Expected**: Each part can have different customizations
4. **Verify**: 3D model updates to show per-part customizations

#### Step 3: Apply to All
1. Customize one part, then click "Apply to All"
2. **Expected**: All parts use the same customization
3. **Verify**: 3D model shows consistent customization across all parts

#### Step 4: Save and Verify
1. Close popup and add to cart
2. Complete order
3. **Expected**: `twoToneCustomizations` in `customization_data`:
```json
{
  "twoToneCustomizations": {
    "backrest": {
      "fabricColor": "#ff0000",
      "patternId": "1-2",
      "stitchColor": "#ffffff"
    },
    "seat": {
      "fabricColor": "#00ff00",
      "patternId": "1-3",
      "stitchColor": "#000000"
    }
  }
}
```

---

### Test Scenario 5: Price Calculation & Breakdown

#### Step 1: Select Options with Prices
1. On customization page, select:
   - Material type with price
   - Color with price
   - Pattern with price
   - Stitch color with price
   - Other options with prices
2. **Expected**: Price breakdown updates for each selection

#### Step 2: Verify Price Calculation
1. Check price breakdown section
2. **Expected**: 
   - Base price: Product base price
   - Material Type: Material type price (if selected)
   - Color: Color price (if selected)
   - Pattern: Pattern price (if selected)
   - Stitch Color: Stitch color price (if selected)
   - Other options: Individual option prices
   - Total: Sum of all prices
3. **Verify**: Manual calculation matches displayed total

#### Step 3: Test Price Tiers
1. Login as user with price tier (e.g., wholesale customer)
2. Select same options
3. **Expected**: Prices are discounted according to price tier
4. **Verify**: Discounted prices are shown in breakdown

#### Step 4: Verify Final Order Price
1. Complete order
2. **Expected**: Order total matches the calculated total from breakdown
3. **Verify**: Check order in database:
```bash
php artisan tinker
>>> $order = \App\Models\Order::latest()->first();
>>> $order->total_amount;
>>> $order->orderItems->first()->total_price;
```

---

### Test Scenario 6: Order Editing (Admin)

#### Step 1: Open Order for Editing
1. Navigate to `/admin/orders/{orderId}/edit`
2. **Expected**: Order wizard opens with existing order data

#### Step 2: View 3D Product Details
1. Click "Details" button for 3D customizable product
2. **Expected**: `AdminVariantsDrawer` opens
3. **Verify**: 
   - Shows "3D Customizable Product" banner
   - Shows "Open Full 3D Editor" button
   - Displays current customization data

#### Step 3: Edit in 3D Editor
1. Click "Open Full 3D Editor" button
2. **Expected**: Redirected to `/build-your-seat?productId={id}&edit=true`
3. **Verify**: 3D editor loads with current customizations applied

#### Step 4: Modify Customizations
1. Change material type, color, pattern, etc.
2. **Expected**: Changes are reflected in 3D model
3. **Verify**: Price breakdown updates

#### Step 5: Save Changes
1. Return to order wizard and update order
2. **Expected**: Order is updated with new customization data
3. **Verify**: Database reflects new `customization_data`

---

## Expected Results

### Database Verification

#### Order Items Table
```sql
SELECT 
    id,
    product_id,
    name,
    customization_data
FROM order_items
WHERE customization_data IS NOT NULL;
```

**Expected**: 
- `customization_data` is JSON format
- Contains `fabricType`, `fabricColor`, `patternId`, `stitchColor`
- May contain `twoToneCustomizations` if two-tone was used

#### API Response Verification
```bash
# Get order via API
curl -X GET "http://localhost:8000/api/orders/{orderId}" \
  -H "Authorization: Bearer {token}"
```

**Expected Response**:
```json
{
  "data": {
    "order": {
      "orderItems": [
        {
          "id": 1,
          "productId": 4,
          "name": "Customizable Premium Seat - 3D Edition",
          "customizationData": {
            "fabricType": "1",
            "fabricColor": "#dfdfdf",
            "patternId": "1-2",
            "stitchColor": "#ffffff"
          },
          "variants": {
            "materialType": "1",
            "color": "5",
            "seatStitchPattern": "2"
          }
        }
      ]
    }
  }
}
```

---

## Edge Cases & Error Scenarios

### Edge Case 1: Missing Static Assets
**Scenario**: GLB file or texture images are missing
**Expected Behavior**:
- GLB: Falls back to `/assets/models/1/chair1_v03.glb`
- Images: Shows hex color fallback or placeholder

**Test Steps**:
1. Remove GLB file from API path
2. Verify fallback to static asset works
3. Remove texture images
4. Verify hex fallback displays

### Edge Case 2: Invalid Customization Data
**Scenario**: Malformed `customizationData` in database
**Expected Behavior**:
- Order view should handle gracefully
- Drawer should not crash
- Should display error message or skip 3D data

**Test Steps**:
1. Manually corrupt `customization_data` in database:
```sql
UPDATE order_items 
SET customization_data = '{"invalid": "data"}' 
WHERE id = 1;
```
2. Open order view
3. Verify no crashes occur

### Edge Case 3: Product Deleted After Order
**Scenario**: 3D product is deleted after order is placed
**Expected Behavior**:
- Order should still be viewable
- Customization data should still be displayed
- Product details may show "Product not found"

**Test Steps**:
1. Create order with 3D product
2. Delete the product
3. View order
4. Verify customization data is still accessible

### Edge Case 4: Network Failures
**Scenario**: API calls fail during customization
**Expected Behavior**:
- Error messages displayed to user
- Partial data is not saved
- User can retry

**Test Steps**:
1. Stop API server
2. Attempt to customize product
3. Verify error handling
4. Restart API server
5. Verify recovery works

---

## Data Verification

### Checklist for Successful Test

- [ ] 3D model loads without errors
- [ ] Material type selection works
- [ ] Color selection works
- [ ] Pattern selection works
- [ ] Stitch color selection works
- [ ] Price breakdown calculates correctly
- [ ] "Add to Cart" works (authenticated)
- [ ] "Add to Cart" redirects to login (unauthenticated)
- [ ] Order is created successfully
- [ ] `customization_data` is saved in database
- [ ] Order view displays customization data
- [ ] Two-tone customizations are saved (if used)
- [ ] Price tiers are applied correctly
- [ ] Order editing preserves customization data

### Database Queries for Verification

```sql
-- Check orders with 3D customization
SELECT 
    o.id,
    o.order_number,
    oi.name,
    oi.customization_data,
    oi.total_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE oi.customization_data IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 10;

-- Check specific order item
SELECT 
    oi.*,
    p.name as product_name,
    p.is_customize_3d_product
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.id = {order_item_id};

-- Verify customization_data structure
SELECT 
    id,
    JSON_EXTRACT(customization_data, '$.fabricType') as fabric_type,
    JSON_EXTRACT(customization_data, '$.fabricColor') as fabric_color,
    JSON_EXTRACT(customization_data, '$.patternId') as pattern_id,
    JSON_EXTRACT(customization_data, '$.stitchColor') as stitch_color,
    JSON_EXTRACT(customization_data, '$.twoToneCustomizations') as two_tone
FROM order_items
WHERE customization_data IS NOT NULL;
```

---

## Troubleshooting

### Issue: 3D Model Not Loading
**Symptoms**: Blank 3D viewer, console errors
**Solutions**:
1. Check browser console for errors
2. Verify GLB file exists at API path or static path
3. Check CORS configuration
4. Verify `model_file_path` in database
5. Check network tab for failed requests

### Issue: Customization Data Not Saving
**Symptoms**: Order created but `customization_data` is NULL
**Solutions**:
1. Check `OrderController::store()` method
2. Verify `customizationData` is in request payload
3. Check database migration ran successfully
4. Verify `OrderItem` model has `customization_data` in fillable
5. Check Laravel logs: `storage/logs/laravel.log`

### Issue: Price Breakdown Incorrect
**Symptoms**: Total price doesn't match sum of parts
**Solutions**:
1. Check `calculatePriceBreakdown()` function
2. Verify all options have prices in database
3. Check price tier calculations
4. Verify `price_adjustment` vs `price` fields
5. Check browser console for calculation errors

### Issue: Order View Not Showing Customization Data
**Symptoms**: Drawer opens but no 3D customization section
**Solutions**:
1. Verify API response includes `customizationData`
2. Check order view page maps `customization_data` correctly
3. Verify `AdminVariantsViewDrawer` receives `customizationData` prop
4. Check browser console for prop errors
5. Verify database has `customization_data` for order item

### Issue: Two-Tone Customizations Not Saving
**Symptoms**: Two-tone selections not in `customization_data`
**Solutions**:
1. Check `onCustomizationChange` callback in `App.jsx`
2. Verify `twoToneCustomizations` is included in payload
3. Check `handleAddToCart` maps two-tone data correctly
4. Verify `CustomizationData` interface includes `twoToneCustomizations`
5. Check Redux cart stores `customizationData` correctly

---

## Test Data Setup Script

```bash
# Run this script to set up test data
cd "D:\Allied C Work\Superior Seats\superiorseats-api"

# Reset and seed database
php artisan migrate:fresh
php artisan db:seed

# Verify 3D product exists
php artisan tinker
>>> $product = \App\Models\Product::where('is_customize_3d_product', true)->first();
>>> echo "Product ID: " . $product->id . "\n";
>>> echo "Product Name: " . $product->name . "\n";
>>> exit
```

---

## Performance Testing

### Load Time Benchmarks
- 3D model load: < 5 seconds
- Material/color selection: < 1 second
- Pattern selection: < 1 second
- Price calculation: < 500ms
- Order creation: < 2 seconds

### Test with Multiple Customizations
1. Create 10 orders with different customizations
2. Verify all `customization_data` is saved correctly
3. Check order view performance
4. Verify no memory leaks in 3D viewer

---

## Browser Compatibility Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## API Testing with Postman/Insomnia

### Create Order with 3D Customization

**Endpoint**: `POST /api/orders`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "cartItems": [
    {
      "itemId": "4",
      "productId": 4,
      "name": "Customizable Premium Seat - 3D Edition",
      "quantity": 1,
      "unitPrice": 1500.00,
      "totalPrice": 1500.00,
      "variants": {
        "materialType": "1",
        "color": "5",
        "seatStitchPattern": "2"
      },
      "customizationData": {
        "fabricType": "1",
        "fabricColor": "#dfdfdf",
        "patternId": "1-2",
        "stitchColor": "#ffffff"
      }
    }
  ],
  "customerInfo": {
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "1234567890",
    "shippingAddress": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "IN",
      "postalCode": "12345",
      "country": "US"
    },
    "billingAddress": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "IN",
      "postalCode": "12345",
      "country": "US"
    }
  },
  "cartSummary": {
    "subTotal": 1500.00,
    "tax": 105.00,
    "discount": 0,
    "grandTotal": 1605.00,
    "shippingCost": 350
  },
  "notes": "Test order with 3D customization"
}
```

**Expected Response**: `201 Created` with order details including `customizationData`

---

## Conclusion

This testing guide covers all aspects of the 3D product order integration. Follow these procedures systematically to ensure the feature works correctly across all scenarios.

For issues or questions, refer to the troubleshooting section or check the application logs.

