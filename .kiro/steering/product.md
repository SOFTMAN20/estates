---
inclusion: always
---

# NyumbaLink Product Overview

## What It Is
NyumbaLink is a rental property management platform for Tanzania. Users can browse/book properties as guests, list/manage properties as hosts, and admins have full platform control.

## Three-Mode System
1. **Guest Mode**: Browse properties, make bookings, manage reservations, leave reviews
2. **Host Mode**: List properties, manage listings, view bookings, track earnings
3. **Admin Panel**: Property approvals, user management, analytics, reports

Users switch between Guest/Host modes seamlessly without profile completion requirements.

## Core Entities
- `profiles` - User accounts with role-based access (user/admin)
- `properties` - Listings with approval workflow (pending → approved/rejected)
- `bookings` - Reservations with status tracking (pending → confirmed → completed/cancelled)
- `payments` - M-Pesa, card, bank transfer support
- `reviews` - Multi-dimensional ratings with host responses
- `notifications` - Real-time alerts via Supabase subscriptions

## Key Business Rules
- Properties require admin approval before going live
- Hosts can toggle availability without re-approval
- Only completed bookings can be reviewed
- Reviews: 50-1000 chars, host responses: max 500 chars
- Platform commission: 10% service fee on bookings
- Booking dates: check_out must be after check_in

## User Roles
- **User (default)**: Can be guest or host, switch modes freely
- **Admin**: Full platform access, property approvals, user management

## Localization
- Primary languages: English (en), Swahili (sw)
- Currency: Tanzanian Shillings (TZS)
- Target market: Tanzania (Dar es Salaam focus)
