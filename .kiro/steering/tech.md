---
inclusion: always
---

# Tech Stack & Build System

## Frontend
- **React 18** + TypeScript
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first styling
- **ShadCN UI** - Component library (Radix primitives)
- **React Router DOM 6** - Client-side routing
- **React Query (TanStack)** - Server state management
- **React Hook Form** + Zod - Form handling and validation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **i18next** - Internationalization (en/sw)
- **Recharts** - Charts and analytics

## Backend (Supabase)
- **PostgreSQL** - Database with Row Level Security (RLS)
- **Supabase Auth** - Email/password authentication
- **Supabase Storage** - Image uploads (property-images, avatars)
- **Supabase Realtime** - Live subscriptions for notifications
- **Edge Functions** - Serverless functions (Deno)

## Key Integrations
- **M-Pesa / PalmPay** - Payment processing
- **Mapbox** - Property location maps
- **Vercel** - Hosting and deployment

## Common Commands

```bash
# Development
npm run dev          # Start dev server (localhost:8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # ESLint check

# Supabase
npx supabase start              # Start local Supabase
npx supabase db reset           # Reset local database
npx supabase db push            # Push migrations to remote
npx supabase gen types typescript --project-id <id> > src/lib/integrations/supabase/types.ts
npx supabase functions deploy   # Deploy edge functions
```

## Environment Variables
Required in `.env` (prefix with `VITE_` for frontend access):
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APP_NAME=NyumbaLink
VITE_APP_URL=http://localhost:8080
VITE_PLATFORM_COMMISSION=0.10
```

## Build Output
- Output directory: `dist/`
- Code splitting: Vendor chunks for React, Supabase, React Query, icons, i18n, Framer Motion
- Target: ES2020
- Minification: esbuild
- Console/debugger dropped in production

## Path Aliases
```typescript
import { Component } from '@/components/...'  // → src/components/...
import { useHook } from '@/hooks/...'         // → src/hooks/...
import { supabase } from '@/lib/...'          // → src/lib/...
```
