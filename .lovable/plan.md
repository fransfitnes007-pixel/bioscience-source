
# Custom Logo Labeling Feature Implementation Plan

## Overview
This plan implements a comprehensive custom logo labeling system that allows customers to choose between standard white-label vials or custom-branded vials with their company logo during checkout and application.

---

## Database Changes

### 1. Create Storage Bucket for Company Logos
- Create `company-logos` storage bucket (public access for logo display)
- Configure RLS policies for secure uploads

### 2. Update `applications` Table
Add column:
- `company_logo_url` (TEXT, nullable) - stores the uploaded logo path from application

### 3. Update `profiles` Table
Add column:
- `company_logo_url` (TEXT, nullable) - stores the customer's company logo for future orders

### 4. Update `orders` Table
Add columns:
- `custom_labeling` (BOOLEAN, default false) - whether custom labeling was selected
- `custom_labeling_logo_url` (TEXT, nullable) - the logo URL used for this specific order
- `custom_labeling_cost` (NUMERIC, default 0) - price for custom labeling (set to $0 for now)

---

## Application Process Changes (Apply.tsx)

### Add New Step 7: Company Logo Upload
- Insert between current Step 6 (Additional Info) and submission
- Update step count from 6 to 7
- Step content:
  - Header: "Upload Your Company Logo"
  - Description explaining the logo will be used for custom vial labeling
  - File upload component accepting PNG and PDF files
  - Requirements displayed:
    - Transparent background required
    - PNG or PDF format
    - Recommended dimensions
  - Preview of uploaded logo
  - Optional checkbox: "I want custom-labeled vials for my orders"
  - Skip option (optional upload)

---

## Checkout Flow Changes (Checkout.tsx)

### Add Labeling Options Section
Position: After shipping information, before payment notice

**UI Design:**
```text
+--------------------------------------------------+
|  🏷️  Vial Labeling Options                       |
+--------------------------------------------------+
|  [ ] Standard White Label (FREE)                 |
|      Clean, professional blank white labels      |
|                                                  |
|  [ ] Custom Logo Labeling ($0.00)               |
|      Your company logo on every vial            |
|                                                  |
|  [Upload Logo Button] or [Use Saved Logo]       |
|  Accepts: PNG, PDF (transparent background)     |
|                                                  |
|  [Preview of uploaded logo if exists]           |
+--------------------------------------------------+
```

**Logic:**
- Check if user has saved logo in profile
- If yes, show "Use saved logo" option
- Allow new upload that overrides for this order
- File validation for PNG/PDF only
- Store selection in order record

---

## Client Portal Changes (Profile.tsx)

### Add Company Logo Section
New card component after "Business Information":

```text
+--------------------------------------------------+
|  🏷️  Company Logo                                |
+--------------------------------------------------+
|  Upload your company logo for custom vial        |
|  labeling on your orders.                        |
|                                                  |
|  [Current Logo Preview]  or  [No logo uploaded] |
|                                                  |
|  [Upload New Logo]  [Remove Logo]               |
|                                                  |
|  Requirements:                                   |
|  • PNG or PDF format                            |
|  • Transparent background                        |
|  • Recommended: 300x100px minimum               |
+--------------------------------------------------+
```

---

## Admin Dashboard Changes

### 1. Businesses Page (Businesses.tsx)
- Add company logo thumbnail in the business details dialog
- Show logo status indicator in table (icon showing if logo exists)

### 2. Applications Page (Applications.tsx)
- Display uploaded logo in application detail dialog
- Add logo preview section showing the submitted logo

### 3. Orders Page (Orders.tsx)
- Add "Custom Labeling" column/indicator
- Show labeling preferences in order detail view
- Display the logo URL/preview that was used for the order

---

## File Upload Component

### Create Reusable LogoUploader Component
Location: `src/components/shared/LogoUploader.tsx`

**Features:**
- Drag-and-drop support
- Click to browse
- File type validation (PNG, PDF only)
- File size limit (e.g., 5MB)
- Preview display
- Upload progress indicator
- Error handling with user-friendly messages

---

## Technical Implementation Details

### Storage Structure
```
company-logos/
├── applications/
│   └── {application_id}/logo.{ext}
├── profiles/
│   └── {user_id}/logo.{ext}
└── orders/
    └── {order_id}/logo.{ext}
```

### RLS Policies for Storage Bucket
- Users can upload to their own profile folder
- Users can upload during application (public insert for applications folder)
- Admins can read all logos
- Public read access for displaying logos

---

## Implementation Order

1. **Database migrations** - Create storage bucket and add columns
2. **LogoUploader component** - Reusable file upload component  
3. **Apply.tsx updates** - Add Step 7 for logo upload
4. **Profile.tsx updates** - Add logo management section
5. **Checkout.tsx updates** - Add labeling options
6. **Admin pages updates** - Display logos in dashboards
7. **Order flow integration** - Store labeling preference with orders

---

## Files to Create
- `src/components/shared/LogoUploader.tsx`

## Files to Modify
- `src/pages/Apply.tsx` - Add Step 7
- `src/pages/Checkout.tsx` - Add labeling options
- `src/pages/portal/Profile.tsx` - Add logo management
- `src/pages/admin/Businesses.tsx` - Display logos
- `src/pages/admin/Applications.tsx` - Display logos
- `src/pages/admin/Orders.tsx` - Display labeling info

## Database Migration
- Create `company-logos` storage bucket
- Add columns to `applications`, `profiles`, and `orders` tables
- Add appropriate RLS policies
