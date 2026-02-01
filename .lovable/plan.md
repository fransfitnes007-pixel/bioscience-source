

# Admin Dashboard App & Client Portal Implementation

This plan will transform your existing admin dashboard into a standalone Progressive Web App (PWA) that you can add to your home screen, plus create a full client portal for your customers.

---

## Overview

We'll build two main things:
1. **PWA Setup** - Make your site installable as an app on phones/tablets/desktops
2. **Client Portal** - A dedicated area for customers to view orders, send messages, and manage their account
3. **Admin Enhancements** - Add a Businesses/Customers section and a messaging inbox

---

## What You'll Get

### For You (Admin):
- Install the app on your phone/tablet/computer home screen
- Access the full admin dashboard without opening a browser
- New "Businesses" section showing all registered customers
- Unified messaging inbox to communicate with clients

### For Your Clients:
- Personal dashboard showing their order history
- Ability to message you directly from their portal
- View order status and details
- Manage their account/profile information

---

## Implementation Phases

### Phase 1: Progressive Web App (PWA) Setup

Convert the site into an installable app:

- Create `manifest.json` with app name, icons, and theme colors
- Add service worker for offline capability
- Generate app icons in multiple sizes (192x192, 512x512, etc.)
- Add "Add to Home Screen" prompt for mobile users
- Configure proper meta tags for Apple/Android

Once done, you can:
- On iPhone: Safari → Share → "Add to Home Screen"
- On Android: Chrome menu → "Install app"
- On Desktop: Chrome address bar → install icon

---

### Phase 2: Client Portal

Create a dedicated customer area at `/portal`:

**Portal Dashboard (`/portal`)**
- Welcome message with customer name
- Quick stats (total orders, pending orders)
- Recent orders list
- Quick links to messages and profile

**Order History (`/portal/orders`)**
- Full list of all orders with status
- Filter by status (pending, processing, shipped, delivered)
- Click to view order details with line items

**Messaging (`/portal/messages`)**
- View conversation history with your team
- Send new messages
- See message status (read/unread)

**Profile Settings (`/portal/profile`)**
- View/edit business information
- Update contact details
- Change password

---

### Phase 3: Admin Enhancements

**New "Businesses" Page (`/admin/businesses`)**
- Consolidated view of all registered customers
- Display: business name, contact person, email, phone, status, total orders
- Search and filter capabilities
- Click to view full business details and their order history
- Quick actions: send message, view orders, change status

**Messaging Center (`/admin/messages-center`)**
- Unified inbox for all client conversations
- View conversations grouped by client
- Reply to messages directly
- Mark as read/unread
- See which staff member responded

---

## Database Changes

New table needed for the messaging system:

```text
client_messages
├── id (uuid)
├── conversation_id (uuid) - groups related messages
├── sender_type (text) - 'client' or 'admin'
├── sender_user_id (uuid)
├── client_id (uuid) - the client/business this relates to
├── message (text)
├── is_read (boolean)
├── read_at (timestamp)
├── created_at (timestamp)
```

---

## Navigation Structure

```text
Admin Routes (requires admin role):
├── /admin                → Dashboard
├── /admin/applications   → Applications (existing)
├── /admin/inquiries      → Inquiries (existing)
├── /admin/messages       → Contact Messages (existing)
├── /admin/businesses     → All Customers/Businesses (NEW)
└── /admin/messages-center → Client Messages (NEW)

Client Portal Routes (requires approved user):
├── /portal              → Client Dashboard
├── /portal/orders       → Order History
├── /portal/messages     → Message Center
└── /portal/profile      → Profile Settings
```

---

## Access Control

- **Admin pages**: Only users with 'admin' role (existing)
- **Client portal**: Only users with 'approved' profile status
- **PWA**: Works for both admin and clients based on their role

---

## Technical Details

### PWA Files to Create:
- `/public/manifest.json` - App manifest with name, icons, colors
- `/public/sw.js` - Service worker for caching
- `/public/icons/` - App icons in various sizes

### New React Components:
- `ClientPortalLayout.tsx` - Layout wrapper for portal pages
- `ClientAuthGuard.tsx` - Auth guard requiring approved status
- `PortalSidebar.tsx` - Navigation for portal
- `ConversationList.tsx` - Message thread list
- `MessageThread.tsx` - Individual conversation view

### New Pages:
- `src/pages/portal/Dashboard.tsx`
- `src/pages/portal/Orders.tsx`
- `src/pages/portal/Messages.tsx`
- `src/pages/portal/Profile.tsx`
- `src/pages/admin/Businesses.tsx`
- `src/pages/admin/MessagesCenter.tsx`

---

## Mobile Experience

The PWA will:
- Work offline (cached pages)
- Send push notifications (optional future enhancement)
- Feel like a native app
- Auto-update when you publish changes
- Support gesture navigation

---

## Summary

| Feature | Admin | Client |
|---------|-------|--------|
| PWA Install | Yes | Yes |
| Dashboard | Yes | Yes |
| View Orders | All | Own only |
| Messaging | All conversations | Own only |
| Manage Businesses | Yes | No |
| View Applications | Yes | No |
| Profile Settings | No | Yes |

