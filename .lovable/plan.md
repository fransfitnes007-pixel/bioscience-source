
# Email Notification System for Applications

## Overview
Create an automated email sequence that sends notifications at two key points:
1. **Application Received** - Confirmation email when someone submits an application
2. **Application Approved** - Welcome email with your link when an admin approves them

---

## What You'll Get

### Email 1: Application Confirmation
Sent immediately when someone submits the application form:
- Confirms receipt of their application
- Sets expectations (review within 24-48 hours)
- Professional branded email from PØINT BioSciences

### Email 2: Approval Welcome
Sent when you change an application status to "approved" in the admin dashboard:
- Congratulates them on approval
- Includes your provided link (product catalog, portal, etc.)
- Invites them to start ordering

---

## Implementation Steps

### Step 1: Add Resend API Key
Store the API key you provided (`re_GXixaw7D_...`) as a backend secret.

### Step 2: Create Email Edge Function
Build a backend function `send-application-email` that:
- Accepts email type ("confirmation" or "approved")
- Accepts recipient details (name, email, business name)
- Accepts optional custom link for approval emails
- Uses professionally designed HTML templates
- Sends via Resend API

### Step 3: Update Application Form
Modify `/apply` submission to call the email function after successful database insert.

### Step 4: Update Admin Approval Flow
Modify the admin Applications page to:
- Detect when status changes to "approved"
- Trigger the approval email with your link
- Show success feedback

---

## What I Need From You

1. **Your approval link** - What URL should approved partners receive? (e.g., `https://pointbiosciences.com/products` or a specific portal link)

2. **Verified sending domain** - Emails need to come from a verified domain in Resend. Do you have a domain verified (like `noreply@pointbiosciences.com`)?

---

## Technical Details

### Edge Function Structure
```
supabase/functions/send-application-email/index.ts
```

Function will handle both email types via a `type` parameter:
- `type: "confirmation"` → Application received email
- `type: "approved"` → Approval email with link

### Frontend Integration Points
- `src/pages/Apply.tsx` - Add email call after line 86 (after successful insert)
- `src/pages/admin/Applications.tsx` - Add email call in `handleSave()` when status becomes "approved"

### Email Templates
Professional HTML emails with:
- PØINT BioSciences branding
- Clean, minimal design matching your site aesthetic
- Mobile-responsive layout
