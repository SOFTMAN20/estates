---
inclusion: always
---

# Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin panel components (Dashboard, Tables, Charts)
│   ├── auth/            # Auth components (LoginForm, RegisterForm, Guards)
│   ├── bookings/        # Booking components (BookingCard, BookingForm, Modal)
│   ├── common/          # Shared components (OptimizedImage, PageLoader)
│   ├── forms/           # Form components (AvatarUpload, ProfileSettings)
│   ├── host/            # Host dashboard components
│   │   └── dashboard/   # Property forms, analytics, booking requests
│   ├── layout/          # Layout components (Header, Footer, Navigation)
│   ├── Notifications/   # Notification components (Bell, Drawer, Dropdown)
│   ├── payments/        # Payment components (PaymentForm, PaymentModal)
│   ├── profile/         # Profile components (ProfileForm, ProfileHeader)
│   ├── properties/      # Property components
│   │   ├── propertyCommon/    # PropertyCard, FeaturedProperties
│   │   └── PropertyDetails/   # Detail page components
│   ├── reviews/         # Review components (ReviewCard, ReviewForm, RatingStars)
│   ├── search/          # Search components (SearchBar, FiltersPanel)
│   └── ui/              # ShadCN UI primitives (button, card, dialog, etc.)
│
├── pages/               # Route page components
│   ├── admin/           # Admin pages (Dashboard, Users, Properties, Reports)
│   └── host/            # Host pages (Dashboard, Properties, Analytics, Reviews)
│
├── hooks/               # Custom React hooks
│   ├── analyticsHooks/  # Analytics-related hooks
│   ├── browseHooks/     # Property search/filter hooks
│   ├── dashboardHooks/  # Dashboard data hooks
│   ├── profileHooks/    # Profile management hooks
│   └── use*.ts          # Feature hooks (useAuth, useBookings, useProperties, etc.)
│
├── contexts/            # React contexts (ModeContext, ToastContext)
├── types/               # TypeScript type definitions
├── lib/                 # Utilities and configurations
│   └── integrations/supabase/  # Supabase client and types
├── utils/               # Utility functions (cache, security, performance)
├── styles/              # Global CSS (index.css, critical.css)
└── data/i18n/           # Internationalization (en.json, sw.json)

supabase/
├── functions/           # Edge Functions (Deno)
│   ├── compress-image/
│   ├── get-user-with-auth/
│   └── get-users-with-auth/
└── migrations/          # Database migrations (SQL)

public/                  # Static assets (icons, images, manifest)
docs/                    # Documentation files
scripts/                 # Utility scripts (SQL, shell)
```

## Key Patterns

### Component Organization
- Feature-based grouping (bookings/, properties/, reviews/)
- Shared UI in `ui/` (ShadCN components)
- Common utilities in `common/`

### Hook Naming
- `use<Feature>.ts` - Feature hooks (useAuth, useBookings)
- `use<Feature>Hooks/` - Related hook groups (dashboardHooks/)

### Page Structure
- Public pages in `pages/` root
- Admin pages in `pages/admin/`
- Host pages in `pages/host/`

### Type Organization
- Domain types in `types/<domain>.ts` (property.ts, booking.ts)
- Supabase types auto-generated in `lib/integrations/supabase/types.ts`

### Migration Files
- Format: `YYYYMMDDHHMMSS_description.sql`
- Located in `supabase/migrations/`
