---
inclusion:  always
---







# NyumbaLink Product Development Guidelines

## Project Overview
NyumbaLink is a full-featured rental management platform built with React, Supabase, and modern web technologies. The platform enables users to browse and book properties as guests, list and manage properties as hosts, with comprehensive admin controls.

## Core Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** as build tool and dev server
- **Tailwind CSS** for styling (utility-first approach)
- **ShadCN UI** as component library
- **Lucide React** for icons
- **React Router DOM** for routing
- **React Query** for data fetching and caching
- **Framer Motion** for animations
- **React Hook Form** with Zod validation

### Backend
- **Supabase** as Backend as a Service:
  - PostgreSQL Database
  - Authentication (email/password)
  - Real-time subscriptions
  - Storage for images
  - Edge Functions
  - Row Level Security (RLS)

### Key Integrations
- **M-Pesa API / Azampay** for payment processing
- **SendGrid / Resend** for email notifications
- **Google Analytics 4** for analytics
- **Sentry** for error monitoring

## Architecture Principles

### Three-Mode System
1. **Guest Mode**: Browse properties, make bookings, manage bookings
2. **Host Mode**: List properties, manage listings, view bookings, track earnings
3. **Admin Panel**: Full platform management, approvals, analytics

Users can seamlessly switch between Guest and Host modes without profile completion requirements.

### Database Schema
Follow the established schema with these core tables:
- `users` - User profiles with role-based access
- `properties` - Property listings with approval workflow
- `bookings` - Booking management with status tracking
- `payments` - Payment processing with multiple methods
- `reviews` - Multi-dimensional ratings and comments
- `notifications` - Real-time user notifications
- `admin_activity_log` - Admin action tracking

### Security
- Always implement Row Level Security (RLS) policies for new tables
- Use Supabase auth for authentication
- Never expose sensitive keys in frontend code
- Validate all user inputs with Zod schemas
- Sanitize data before database operations

## Development Standards

### Code Style
- Use TypeScript for all new files
- Follow functional component patterns with hooks
- Use custom hooks for reusable logic (prefix with `use`)
- Keep components small and focused (single responsibility)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   ├── properties/     # Property-related components
│   ├── bookings/       # Booking-related components
│   ├── payments/       # Payment components
│   ├── reviews/        # Review components
│   ├── notifications/  # Notification components
│   ├── admin/          # Admin panel components
│   └── ui/             # ShadCN UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```

### Naming Conventions
- Components: PascalCase (e.g., `PropertyCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useProperties.ts`)
- Utilities: camelCase (e.g., `formatCurrency.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)
- Types/Interfaces: PascalCase (e.g., `PropertyType`)

### State Management
- Use React Query for server state
- Use React Context for global UI state (mode switching, theme)
- Use local state (useState) for component-specific state
- Avoid prop drilling - use Context or composition

### Form Handling
- Use React Hook Form for all forms
- Validate with Zod schemas
- Show clear error messages
- Implement proper loading states
- Handle submission errors gracefully

### Data Fetching
- Use React Query hooks for all API calls
- Implement proper loading and error states
- Use optimistic updates where appropriate
- Cache data effectively
- Handle stale data with refetch strategies

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use ShadCN UI components for consistency
- Maintain WCAG AA accessibility standards
- Support dark mode (optional feature)
- Use consistent spacing (4px base unit)

### Image Handling
- Support multiple image uploads (3-10 images per property)
- Implement drag-and-drop functionality
- Store images in Supabase Storage buckets:
  - `property-images` (public)
  - `avatars` (public)
  - `review-images` (public)
- Optimize images before upload
- Show upload progress indicators

### Real-time Features
- Use Supabase real-time subscriptions for:
  - Booking notifications
  - Payment status updates
  - Property approval status
  - New messages/notifications
- Clean up subscriptions on component unmount

### Error Handling
- Use try-catch blocks for async operations
- Show user-friendly error messages
- Log errors to Sentry in production
- Implement error boundaries for React components
- Provide fallback UI for errors

### Performance
- Lazy load routes with React.lazy()
- Implement virtual scrolling for long lists
- Optimize images (WebP format, responsive sizes)
- Use React.memo for expensive components
- Debounce search inputs
- Implement pagination for large datasets

## Feature-Specific Guidelines

### Property Management
- Properties require admin approval before going live
- Status flow: pending → approved/rejected
- Hosts can toggle availability without re-approval
- Support property types: apartment, house, villa, studio
- Amenities stored as JSONB array
- Track average_rating and total_reviews

### Booking System
- Validate date ranges (check_out > check_in)
- Calculate total_months, service_fee, total_amount
- Status flow: pending → confirmed → completed/cancelled
- Link bookings to payments (one-to-one relationship)
- Allow special requests from guests
- Track cancellation reasons

### Payment Processing
- Support multiple methods: M-Pesa, card, bank transfer
- Implement M-Pesa STK Push for mobile payments
- Store transaction_id for reconciliation
- Status flow: pending → completed/failed/refunded
- Store payment_provider_response as JSONB
- Auto-confirm booking on successful payment
- Implement retry mechanism for failures

### Review System
- Only allow reviews for completed bookings
- Require minimum 50 characters, maximum 1000 characters
- Multi-dimensional ratings:
  - Overall rating (required)
  - Cleanliness, communication, value, location (optional)
- Allow host responses (max 500 characters)
- Track helpful_count for review quality
- Update property average_rating on new reviews

### Notification System
- Types: booking, payment, property, system, message
- Priority levels: low, normal, high, urgent
- Include action_url for clickable notifications
- Track is_read status and read_at timestamp
- Support real-time delivery via Supabase subscriptions
- Send email notifications for critical events

### Admin Features
- Property approval workflow with rejection reasons
- User management (suspend/activate accounts)
- Comprehensive analytics dashboard
- Financial reports and transaction monitoring
- Activity logging for audit trail
- System-wide notification broadcasting

## Testing Guidelines
- Write unit tests for utility functions
- Test custom hooks with React Testing Library
- Test critical user flows (booking, payment)
- Mock Supabase client in tests
- Test error scenarios
- Maintain >80% code coverage for critical paths

## Deployment
- Deploy to Vercel for production
- Use environment variables for all secrets
- Enable automatic deployments from main branch
- Set up preview deployments for PRs
- Configure custom domain with SSL
- Monitor with Sentry and Google Analytics

## Environment Variables
Always use these prefixes:
- `VITE_` for frontend-accessible variables
- Never commit `.env.local` to version control
- Document all required variables in `.env.example`

Required variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_NAME`
- `VITE_APP_URL`
- `VITE_PLATFORM_COMMISSION`

## Accessibility
- Use semantic HTML elements
- Provide alt text for all images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Use ARIA labels where needed
- Test with screen readers
- Follow WCAG AA standards

## Best Practices
1. **No Profile Completion Required**: Users can become hosts immediately without filling additional profile information
2. **Mode Switching**: Always respect the current mode (guest/host) in UI and data fetching
3. **Real-time Updates**: Implement subscriptions for time-sensitive data
4. **Optimistic UI**: Update UI immediately, rollback on error
5. **Error Recovery**: Provide clear actions for users to recover from errors
6. **Loading States**: Always show loading indicators for async operations
7. **Empty States**: Design meaningful empty states with clear CTAs
8. **Responsive Design**: Test on mobile, tablet, and desktop
9. **Progressive Enhancement**: Core features work without JavaScript
10. **Security First**: Validate on both client and server, use RLS policies

## Common Patterns

### Custom Hook Pattern
```typescript
export function useProperties() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });
  
  return { properties: data, isLoading, error };
}
```

### Form Pattern
```typescript
const schema = z.object({
  title: z.string().min(5),
  price: z.number().positive(),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### RLS Policy Pattern
```sql
CREATE POLICY "policy_name" ON table_name
  FOR operation
  USING (condition)
  WITH CHECK (condition);
```

## Documentation
- Update README.md for major feature additions
- Document API changes in code comments
- Keep database schema documentation current
- Add JSDoc comments for exported functions
- Update environment variable documentation

## Version Control
- Use meaningful commit messages
- Create feature branches from main
- Squash commits before merging
- Tag releases with semantic versioning
- Keep main branch deployable at all times

## Support & Resources
- Supabase Docs: https://supabase.com/docs
- React Query Docs: https://tanstack.com/query
- Tailwind CSS Docs: https://tailwindcss.com/docs
- ShadCN UI: https://ui.shadcn.com
- TypeScript Handbook: https://www.typescriptlang.org/docs
