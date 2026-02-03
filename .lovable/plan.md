

# Supplier-Restricted Fulfillment & Order Management System

## Overview

This plan outlines a comprehensive multi-role order fulfillment system with three distinct user types: Admin (full control), Supplier (restricted fulfillment access), and Customer (email notifications only). The system builds upon the existing admin dashboard, order management, and messaging infrastructure.

---

## Phase 1: Database Schema Design

### New Tables Required

**1. suppliers**
Stores supplier company information and credentials.
```
- id (uuid, PK)
- user_id (uuid, references auth.users)
- company_name (text)
- contact_name (text)
- contact_email (text)
- phone (text, nullable)
- address (text, nullable)
- is_active (boolean, default true)
- created_at, updated_at (timestamps)
```

**2. supplier_order_assignments**
Junction table linking orders to suppliers.
```
- id (uuid, PK)
- order_id (uuid, FK to orders)
- supplier_id (uuid, FK to suppliers)
- assigned_by (uuid, admin user_id)
- assigned_at (timestamp)
- notes (text, nullable)
```

**3. order_item_fulfillment**
Per-item fulfillment tracking.
```
- id (uuid, PK)
- order_item_id (uuid, FK to order_items)
- supplier_id (uuid, FK to suppliers)
- status (enum: pending, in_production, packed, shipped, completed)
- shipping_carrier (text, nullable)
- tracking_number (text, nullable)
- shipped_at (timestamp, nullable)
- notes (text, nullable)
- updated_by (uuid)
- created_at, updated_at (timestamps)
```

**4. supplier_messages**
Order-specific admin-supplier chat.
```
- id (uuid, PK)
- order_id (uuid, FK to orders)
- supplier_id (uuid, FK to suppliers)
- sender_user_id (uuid)
- sender_type (text: admin/supplier)
- message (text)
- is_read (boolean)
- created_at (timestamp)
```

**5. order_activity_log**
Complete audit trail.
```
- id (uuid, PK)
- order_id (uuid, FK to orders)
- user_id (uuid)
- action (text)
- details (jsonb)
- created_at (timestamp)
```

### Schema Modifications

**Update app_role enum:**
Add 'supplier' to existing enum: `('admin', 'moderator', 'user', 'supplier')`

**Update orders table:**
Add columns for proper shipping tracking:
```
- shipping_carrier (text)
- tracking_number (text)
- estimated_delivery_date (date)
- shipped_at (timestamp)
```

---

## Phase 2: Security & Access Control

### RLS Policies

**suppliers table:**
- Admins: Full CRUD access
- Suppliers: SELECT own record only

**supplier_order_assignments table:**
- Admins: Full CRUD
- Suppliers: SELECT where supplier matches their ID

**order_item_fulfillment table:**
- Admins: Full CRUD
- Suppliers: SELECT/UPDATE/INSERT only for their assigned orders

**supplier_messages table:**
- Admins: Full CRUD
- Suppliers: SELECT/INSERT only for their assigned orders

**orders table (modified):**
- Suppliers: SELECT only assigned orders
- Critical: Exclude customer contact fields (email, phone) from supplier queries via database view

### Supplier-Safe Order View

Create a database view `supplier_order_view` that excludes sensitive customer data:
```
- order_number
- status
- shipping address (for fulfillment)
- product details
- EXCLUDES: billing_email, billing_phone, customer name
```

---

## Phase 3: Application Architecture

### New Routes Structure

```
/supplier                    - Supplier Dashboard
/supplier/orders             - Assigned Orders List
/supplier/orders/:id         - Order Fulfillment Page
/supplier/messages           - Chat with Admin
/admin/suppliers             - Manage Suppliers (NEW)
/admin/orders/:id/assign     - Order Assignment Dialog
```

### Component Hierarchy

```
src/
├── components/
│   └── supplier/
│       ├── SupplierAuthGuard.tsx
│       ├── SupplierLayout.tsx
│       ├── SupplierSidebar.tsx
│       ├── FulfillmentChecklist.tsx
│       ├── ShippingForm.tsx
│       └── SupplierChat.tsx
├── pages/
│   └── supplier/
│       ├── Dashboard.tsx
│       ├── Orders.tsx
│       ├── OrderFulfillment.tsx
│       └── Messages.tsx
└── pages/admin/
    └── Suppliers.tsx (NEW)
```

---

## Phase 4: Supplier Dashboard Features

### Dashboard Home
- Summary stats (assigned orders, pending fulfillment, shipped today)
- Quick action list for urgent orders
- Recent activity feed

### Orders List
- Table showing only assigned orders
- Filters: status, date range
- Columns: Order #, Products Count, Status, Due Date, Actions
- NO customer contact information visible

### Order Fulfillment Page
- Product checklist with individual fulfillment toggles
- Status progression: Pending → In Production → Packed → Shipped → Completed
- Shipping form fields:
  - Carrier selection (dropdown with common carriers)
  - Tracking number input
  - Shipping label notes
  - Estimated delivery date
- Order-specific chat panel with admin

### Fulfillment Status Workflow

```text
For each product in order:
┌─────────┐    ┌──────────────┐    ┌────────┐    ┌─────────┐    ┌───────────┐
│ Pending │ -> │ In Production│ -> │ Packed │ -> │ Shipped │ -> │ Completed │
└─────────┘    └──────────────┘    └────────┘    └─────────┘    └───────────┘

Order is "Fully Fulfilled" when ALL items reach "Shipped" status
```

---

## Phase 5: Admin Dashboard Enhancements

### Supplier Management Page
- List all suppliers with status
- Add/edit/deactivate suppliers
- View supplier performance metrics
- Create supplier account (triggers invite email)

### Order Assignment Flow
- "Assign to Supplier" button on order detail
- Dropdown to select from active suppliers
- Optional assignment notes
- Automatic notification to supplier

### Enhanced Orders View
- New columns: Assigned Supplier, Fulfillment Progress
- Progress indicator showing "3 of 5 items shipped"
- Filter by supplier
- Real-time updates when supplier makes changes

### Activity Timeline
- Chronological log of all order actions
- Shows: status changes, shipping updates, messages
- Visible on order detail page

---

## Phase 6: Automation & Notifications

### Email Edge Functions

**New: send-shipping-notification**
Triggers when supplier marks items as shipped.
```
Email to customer contains:
- Order number
- Products shipped
- Carrier name
- Tracking number (clickable link)
- Estimated delivery date
```

**Tracking Link Templates:**
- UPS: https://www.ups.com/track?tracknum={tracking}
- FedEx: https://www.fedex.com/fedextrack/?tracknumbers={tracking}
- USPS: https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking}
- DHL: https://www.dhl.com/us-en/home/tracking.html?tracking-id={tracking}

### Realtime Subscriptions

Enable realtime on new tables:
- `order_item_fulfillment` - Admin sees supplier updates instantly
- `supplier_messages` - Bidirectional chat
- `supplier_order_assignments` - Supplier sees new assignments

### Admin Notification Triggers
- When supplier updates shipping info
- When order is partially fulfilled
- When order is fully fulfilled
- When supplier sends a message

---

## Phase 7: Implementation Order

### Step 1: Database Setup
1. Add 'supplier' to app_role enum
2. Create all new tables with proper constraints
3. Add shipping columns to orders table
4. Create supplier-safe view
5. Implement all RLS policies
6. Enable realtime on required tables

### Step 2: Supplier Authentication
1. Create SupplierAuthGuard component
2. Implement supplier login flow
3. Create supplier account creation edge function

### Step 3: Supplier Dashboard
1. Build SupplierLayout and navigation
2. Implement Orders list with restricted data
3. Build FulfillmentChecklist component
4. Create ShippingForm with carrier dropdown
5. Implement status update mutations

### Step 4: Admin Enhancements
1. Create Supplier management page
2. Add order assignment modal
3. Enhance order detail with fulfillment tracking
4. Add activity timeline component
5. Create supplier performance stats

### Step 5: Messaging System
1. Extend existing chat for order-specific supplier conversations
2. Add chat panel to supplier fulfillment page
3. Implement unread indicators

### Step 6: Email Automation
1. Create send-shipping-notification edge function
2. Build email templates with tracking links
3. Add database trigger for automatic sending
4. Test delivery flow end-to-end

---

## Technical Considerations

### Data Isolation
- Suppliers NEVER see customer email/phone
- Suppliers NEVER see other suppliers' data
- Suppliers NEVER see orders not assigned to them
- Customer data masking is enforced at database level (not frontend)

### Performance
- Realtime subscriptions filtered by supplier_id
- Indexed queries on supplier_order_assignments
- Pagination on orders list (existing 1000 row limit applies)

### Audit Trail
- All fulfillment actions logged with timestamp and user
- Order activity visible to admin only
- Immutable log entries (INSERT only, no UPDATE/DELETE)

---

## File Changes Summary

### New Files (17 total)
- `src/components/supplier/SupplierAuthGuard.tsx`
- `src/components/supplier/SupplierLayout.tsx`
- `src/components/supplier/SupplierSidebar.tsx`
- `src/components/supplier/FulfillmentChecklist.tsx`
- `src/components/supplier/ShippingForm.tsx`
- `src/components/supplier/SupplierChat.tsx`
- `src/pages/supplier/Dashboard.tsx`
- `src/pages/supplier/Orders.tsx`
- `src/pages/supplier/OrderFulfillment.tsx`
- `src/pages/supplier/Messages.tsx`
- `src/pages/admin/Suppliers.tsx`
- `src/hooks/useSupplierNotifications.ts`
- `supabase/functions/send-shipping-notification/index.ts`
- `supabase/functions/create-supplier-account/index.ts`

### Modified Files (4 total)
- `src/App.tsx` - Add supplier routes
- `src/pages/admin/Orders.tsx` - Add assignment, fulfillment progress
- `src/integrations/supabase/types.ts` - Auto-generated after migration
- Database: New migration for all schema changes

---

## Estimated Scope

This is a substantial feature set that will:
- Add 5 new database tables
- Create 14+ new React components/pages
- Add 2 new edge functions
- Implement comprehensive RLS policies
- Enable real-time sync across roles

