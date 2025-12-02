# Backend Instructions for 3D Customization Data

## Overview
This document provides instructions for backend changes needed to support the new 3D customization color options (External Stitching Color and Piping Color) in the order system.

## Frontend Implementation Summary

The frontend now:
1. ✅ Collects `externalStitchColor` and `pipingColor` from the 3D customization UI
2. ✅ Stores them in `customizationData` object when adding to cart
3. ✅ Includes `customizationData` in the order payload as a JSON string in `variants.customizationData`
4. ✅ Displays these colors in the variant details drawer for both order creation and order details views

## Backend Changes Required

### 1. Database Schema Updates

#### Option A: Store in `variants` JSON Column (Recommended)
If your `order_items` table already has a `variants` JSON column, the customization data is already being sent as:
```json
{
  "variants": {
    "materialType": "1",
    "color": "5",
    "seatStitchPattern": "3",
    "reclineType": "2",
    "lumbarType": "1",
    "heatOption": "1",
    "seatType": "1",
    "itemType": "1",
    "seatStyle": "1",
    "armType": "1",
    "customizationData": "{\"fabricType\":\"1\",\"fabricColor\":\"5\",\"patternId\":\"3\",\"stitchColor\":\"2\",\"externalStitchColor\":\"#ff0000\",\"pipingColor\":\"#0000ff\",\"seatType\":\"single\",\"meshCustomizations\":{}}"
  }
}
```

**No schema changes needed** - just ensure the `variants` JSON column can store this data.

#### Option B: Add Separate Column (Alternative)
If you prefer a separate column for better querying:

```sql
ALTER TABLE order_items 
ADD COLUMN customization_data JSON NULL 
COMMENT '3D customization data including externalStitchColor and pipingColor';
```

### 2. Order Creation API Endpoint

**Endpoint:** `POST /api/orders`

**Current Payload Structure:**
```json
{
  "cartItems": [
    {
      "itemId": "123",
      "productId": 1,
      "variationId": null,
      "name": "Customized Seat",
      "quantity": 1,
      "unitPrice": 599.99,
      "total": 599.99,
      "totalPrice": 599.99,
      "variants": {
        "materialType": "1",
        "color": "5",
        "seatStitchPattern": "3",
        "customizationData": "{\"externalStitchColor\":\"#ff0000\",\"pipingColor\":\"#0000ff\",...}"
      }
    }
  ],
  "customerInfo": {...},
  "paymentInfo": {...},
  "cartSummary": {...}
}
```

**Action Required:**
1. Ensure the `variants` JSON is stored as-is in the `order_items.variants` column
2. If using Option B, parse `variants.customizationData` and store in `order_items.customization_data` column

**Example PHP/Laravel Code:**
```php
foreach ($request->cartItems as $item) {
    $variants = $item['variants'] ?? [];
    
    // Parse customizationData if it's a JSON string
    if (isset($variants['customizationData']) && is_string($variants['customizationData'])) {
        $customizationData = json_decode($variants['customizationData'], true);
        // Option A: Keep in variants
        // Option B: Store separately
        $orderItem->customization_data = $customizationData;
    }
    
    $orderItem->variants = $variants;
    $orderItem->save();
}
```

### 3. Order Retrieval API Endpoint

**Endpoint:** `GET /api/orders/{id}`

**Action Required:**
1. Ensure `variants` JSON is returned as-is from the database
2. If using Option B, merge `customization_data` back into `variants.customizationData` as a JSON string

**Example Response:**
```json
{
  "id": 123,
  "items": [
    {
      "id": 456,
      "product_id": 1,
      "variants": {
        "materialType": "1",
        "color": "5",
        "customizationData": "{\"externalStitchColor\":\"#ff0000\",\"pipingColor\":\"#0000ff\",...}"
      }
    }
  ]
}
```

**Example PHP/Laravel Code:**
```php
$orderItem->variants = $orderItem->variants ?? [];
if ($orderItem->customization_data) {
    $orderItem->variants['customizationData'] = json_encode($orderItem->customization_data);
}
```

### 4. CustomizationData Structure

The `customizationData` object contains:
```json
{
  "fabricType": "1",              // Material type ID
  "fabricColor": "5",             // Color ID
  "patternId": "3",               // Pattern ID
  "stitchColor": "2",             // Internal stitching color ID
  "externalStitchColor": "#ff0000", // External stitching color (HEX)
  "pipingColor": "#0000ff",       // Piping color (HEX)
  "seatType": "single",           // "single" or "two-tone"
  "meshCustomizations": {}        // Two-tone mode part customizations
}
```

### 5. Validation

**Recommended Validations:**
1. If `externalStitchColor` or `pipingColor` are provided, validate they are valid HEX colors (e.g., `#ffffff`, `#000000`)
2. Ensure `seatType` is either "single" or "two-tone"
3. If `seatType` is "two-tone", validate `meshCustomizations` structure

**Example Validation (PHP/Laravel):**
```php
$rules = [
    'variants.customizationData' => 'sometimes|json',
];

// Custom validation for customizationData
if (isset($data['variants']['customizationData'])) {
    $customizationData = json_decode($data['variants']['customizationData'], true);
    
    if (isset($customizationData['externalStitchColor'])) {
        if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $customizationData['externalStitchColor'])) {
            throw new ValidationException('Invalid externalStitchColor format');
        }
    }
    
    if (isset($customizationData['pipingColor'])) {
        if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $customizationData['pipingColor'])) {
            throw new ValidationException('Invalid pipingColor format');
        }
    }
}
```

### 6. Migration Script (If Using Option B)

```sql
-- Migration: Add customization_data column
ALTER TABLE order_items 
ADD COLUMN customization_data JSON NULL 
AFTER variants;

-- Migration: Backfill existing data (if needed)
UPDATE order_items 
SET customization_data = JSON_EXTRACT(variants, '$.customizationData')
WHERE variants IS NOT NULL 
  AND JSON_EXTRACT(variants, '$.customizationData') IS NOT NULL;
```

### 7. API Response Format

**Ensure order items include variants:**
```json
{
  "order": {
    "id": 123,
    "items": [
      {
        "id": 456,
        "product_id": 1,
        "variants": {
          "materialType": "1",
          "color": "5",
          "customizationData": "{\"externalStitchColor\":\"#ff0000\",\"pipingColor\":\"#0000ff\"}"
        }
      }
    ]
  }
}
```

## Testing Checklist

- [ ] Order creation with 3D customization data stores correctly
- [ ] Order retrieval returns customization data in variants
- [ ] External stitching color is preserved and displayed
- [ ] Piping color is preserved and displayed
- [ ] Order details page shows customization colors
- [ ] Variant drawer displays customization colors
- [ ] Validation rejects invalid color formats
- [ ] Backward compatibility with orders without customization data

## Notes

1. **Backward Compatibility:** The frontend handles missing customization data gracefully, so existing orders will continue to work.

2. **Color Format:** Colors are stored as HEX strings (e.g., `#ffffff`, `#ff0000`). The frontend displays them with color swatches and names.

3. **JSON Storage:** The `customizationData` is stored as a JSON string within the `variants` object to maintain compatibility with existing variant structure.

4. **Querying:** If you need to query orders by customization colors, consider:
   - Using JSON functions: `JSON_EXTRACT(variants, '$.customizationData')`
   - Or storing in a separate column for better indexing

## Support

If you encounter any issues or need clarification, please refer to:
- Frontend code: `src/components/CustomizedSeat.tsx` (Add to Cart)
- Frontend code: `src/components/shop/ShopOrderWizard.tsx` (Order Creation)
- Frontend code: `src/components/admin/AdminVariantsDrawer.tsx` (Variant Display)

