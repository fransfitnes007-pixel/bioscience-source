
# Partner Onboarding Flow: Password Setup After Approval

## Overview

When an admin approves a partner application, the system will:
1. Create a user account with a temporary/magic link
2. Send an email with a unique password setup link
3. Redirect the partner to a dedicated password creation page
4. After setting their password, redirect them to the login page

## Current State Analysis

- **Applications table**: Stores business partner applications with `email`, `contact_name`, `business_name`, etc.
- **Profiles table**: Stores user profile data linked to `auth.users` via `user_id`
- **Approval flow**: When admin approves, an email is sent with a link to `/access` (login page)
- **Problem**: Partners receive a link but have no account/password to log in with

---

## Solution Architecture

```text
+------------------+     +-------------------+     +------------------+
|  Admin Approves  | --> | Edge Function     | --> | Partner Receives |
|  Application     |     | Creates User +    |     | Setup Email      |
+------------------+     | Sends Magic Link  |     +------------------+
                         +-------------------+              |
                                                           v
                         +-------------------+     +------------------+
                         |  Password Set     | <-- | Partner Clicks   |
                         |  Confirmation     |     | Email Link       |
                         +-------------------+     +------------------+
                                  |
                                  v
                         +-------------------+
                         |  Redirect to      |
                         |  Gateway/Login    |
                         +-------------------+
```

---

## Implementation Steps

### 1. Create New Page: `/set-password`

**File**: `src/pages/SetPassword.tsx`

This page will:
- Extract the access token from the URL (from Supabase magic link)
- Show password + confirm password fields
- Validate passwords match and meet requirements
- Call `supabase.auth.updateUser()` to set the password
- Show success message and redirect to Gateway page

### 2. Update Edge Function: `send-application-email`

**File**: `supabase/functions/send-application-email/index.ts`

Modify the approval flow to:
- Accept a `setupLink` parameter instead of `approvalLink`
- Update the email template to say "Set Up Your Account" instead of "Access Partner Portal"
- Include instructions that they need to create a password

### 3. Update Admin Approval Flow

**File**: `src/pages/admin/Applications.tsx`

When approving an application:
1. Use Supabase's `signUp` with a random temporary password to create the user
2. Call `resetPasswordForEmail` to generate a password reset/setup link
3. Create the user's profile in the `profiles` table
4. Link the application to the new user via `user_id`
5. Send the setup email with the magic link

### 4. Create Edge Function: `create-partner-account`

**File**: `supabase/functions/create-partner-account/index.ts`

A new backend function that:
- Creates the auth user using the Supabase Admin API (service role)
- Generates a password reset link
- Creates the profile record
- Updates the application with the new user_id
- Returns the setup link for the email

### 5. Add Route for Set Password Page

**File**: `src/App.tsx`

Add the new route:
```tsx
<Route path="/set-password" element={<SetPassword />} />
```

---

## Technical Details

### Password Requirements
- Minimum 8 characters
- Show password strength indicator (optional enhancement)

### Email Template Update
The approval email will change from:
- "Access Partner Portal" button
To:
- "Set Up Your Password" button
- Text explaining this is a one-time setup link

### Auth Flow Using Supabase
1. Admin approves → Edge function creates user with `signUp` (random password, email confirmed)
2. Edge function calls `auth.admin.generateLink({ type: 'magiclink' })` to get a setup URL
3. Email contains this link pointing to `/set-password`
4. User lands on `/set-password`, Supabase auto-signs them in via the token
5. User sets password with `updateUser({ password })`
6. Redirect to Gateway (`/`) to sign in with new credentials

### Database Updates
- Update `applications` table to set `user_id` when account is created
- Create `profiles` record with data from the application

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/SetPassword.tsx` | Create | Password setup page |
| `src/App.tsx` | Modify | Add /set-password route |
| `supabase/functions/create-partner-account/index.ts` | Create | Backend user creation |
| `supabase/functions/send-application-email/index.ts` | Modify | Update email template |
| `src/pages/admin/Applications.tsx` | Modify | Call new edge function on approval |

---

## User Experience Flow

1. **Partner applies** at `/apply` → receives confirmation email
2. **Admin approves** in dashboard → system creates account + sends setup email
3. **Partner receives email** → clicks "Set Up Your Password"
4. **Partner lands on** `/set-password` → enters password twice
5. **Success** → "Your account is ready! Please sign in."
6. **Partner signs in** at Gateway (`/`) with email + new password
7. **Access granted** → navigates to `/home`
