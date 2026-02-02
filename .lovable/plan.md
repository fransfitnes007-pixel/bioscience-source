
# Fix: UUID Syntax Error on Checkout

## Problem
When proceeding to payment, the checkout fails with "invalid input syntax for type uuid: ''" because empty strings are being passed to UUID columns in the database.

## Root Cause
1. Cart items store `productId` and `variationId` as empty strings (from `item.product_id || ""`)
2. Checkout.tsx passes these empty strings directly to `order_items` table
3. Database expects UUIDs or NULL, not empty strings

## Solution
Modify `src/pages/Checkout.tsx` to convert empty strings to `null` before database insertion.

### File Change: src/pages/Checkout.tsx

**Location**: Lines 161-170

**Current Code**:
```typescript
const orderItems = items.map((item) => ({
  order_id: order.id,
  product_id: item.productId,
  variation_id: item.variationId,
  product_name: item.productName,
  variation_name: item.variationName,
  quantity: item.quantity,
  unit_price: item.price,
  total_price: item.price * item.quantity,
}));
```

**Fixed Code**:
```typescript
const orderItems = items.map((item) => ({
  order_id: order.id,
  product_id: item.productId || null,
  variation_id: item.variationId || null,
  product_name: item.productName,
  variation_name: item.variationName,
  quantity: item.quantity,
  unit_price: item.price,
  total_price: item.price * item.quantity,
}));
```

## Technical Details
- The `||` operator converts empty strings to `null`
- The `product_id` and `variation_id` columns are nullable in the database
- The product/variation names are already stored as text for display purposes
- This pattern matches how the cart_items table already handles these fields

## Testing
After the fix, the checkout flow should:
1. Create order successfully in database
2. Redirect to Stripe Checkout
3. Complete payment without errors
