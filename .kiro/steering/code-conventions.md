---
inclusion:  always
---

# Code Style & Conventions

## Overview
NyumbaLink follows modern React and TypeScript best practices with a focus on modularity,maintainability, readability, reusability and type safety.

## Naming Conventions

### Files & Directories
- **Components**: PascalCase - `PropertyCard.tsx`, `BookingForm.tsx`
- **Hooks**: camelCase with `use` prefix - `useAuth.tsx`, `useProperties.tsx`
- **Utilities**: camelCase - `formatCurrency.ts`, `dateHelpers.ts`
- **Types**: PascalCase - `PropertyType.ts`, `BookingStatus.ts`
- **Constants**: UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`, `VALIDATION_RULES.ts`
- **Pages**: PascalCase - `Dashboard.tsx`, `PropertyDetail.tsx`

### Variables & Functions
```typescript
// Variables: camelCase
const propertyList = [];
const isLoading = false;
const userProfile = {};

// Functions: camelCase, descriptive verbs
function fetchProperties() {}
function calculateTotalAmount() {}
function handleSubmit() {}

// Boolean variables: is/has/should prefix
const isAvailable = true;
const hasPermission = false;
const shouldRedirect = true;

// Constants: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 10;
const PLATFORM_COMMISSION = 0.1;
```

### TypeScript Types & Interfaces
```typescript
// Interfaces: PascalCase with 'I' prefix (optional)
interface Property {
  id: string;
  title: string;
}

// Types: PascalCase
type PropertyStatus = 'pending' | 'approved' | 'rejected';
type UserRole = 'guest' | 'host' | 'admin';

// Enums: PascalCase
enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled'
}
```

## File Organization

### Project Structure
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── properties/     # Property-related components
│   ├── bookings/       # Booking components
│   ├── forms/          # Form components
│   ├── common/         # Shared components
│   └── ui/             # ShadCN UI components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
│   ├── integrations/   # Third-party integrations
│   ├── utils.ts        # Utility functions
│   └── constants.ts    # App constants
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

### Component File Structure
```typescript
// 1. Imports - grouped and ordered
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Property } from '@/types';

// 2. Types/Interfaces
interface PropertyCardProps {
  property: Property;
  onSelect?: (id: string) => void;
}

// 3. Component
export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  // 3a. Hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 3b. Derived state
  const formattedPrice = formatCurrency(property.price_per_month);
  
  // 3c. Event handlers
  const handleClick = () => {
    onSelect?.(property.id);
  };
  
  // 3d. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 3e. Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  );
}
```

## Import Ordering

### Standard Order
```typescript
// 1. React & React-related
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 3. Internal utilities & configs
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { PROPERTY_TYPES } from '@/lib/constants';

// 4. Components
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/properties/PropertyCard';

// 5. Types
import type { Property, Booking } from '@/types';

// 6. Styles (if any)
import './styles.css';
```

## Component Patterns

### Functional Components
```typescript
// ✅ Good: Arrow function with explicit return type
export const PropertyCard = ({ property }: PropertyCardProps): JSX.Element => {
  return <div>{property.title}</div>;
};

// ✅ Also good: Function declaration
export function PropertyCard({ property }: PropertyCardProps) {
  return <div>{property.title}</div>;
}

// ❌ Avoid: Default exports
export default PropertyCard;
```

### Custom Hooks Pattern
```typescript
// hooks/useProperties.tsx
export function useProperties(filters?: PropertyFilters) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
  });

  return {
    properties: data ?? [],
    isLoading,
    error,
    refetch,
  };
}

// Usage
const { properties, isLoading } = useProperties({ city: 'Dar es Salaam' });
```

### Form Handling Pattern
```typescript
const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  price: z.number().positive('Price must be positive'),
});

type FormData = z.infer<typeof schema>;

export function PropertyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      price: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## TypeScript Best Practices

### Type Definitions
```typescript
// ✅ Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  full_name: string | null;
}

// ✅ Use type for unions and primitives
type UserRole = 'guest' | 'host' | 'admin';
type PropertyStatus = 'pending' | 'approved' | 'rejected';

// ✅ Use generics for reusable types
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// ✅ Use utility types
type PartialProperty = Partial<Property>;
type RequiredUser = Required<User>;
type PropertyKeys = keyof Property;
```

### Type Safety
```typescript
// ✅ Explicit return types for functions
function calculateTotal(price: number, months: number): number {
  return price * months;
}

// ✅ Type guards
function isProperty(obj: unknown): obj is Property {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

// ✅ Discriminated unions
type ApiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Property[] }
  | { status: 'error'; error: string };

// ❌ Avoid 'any'
const data: any = fetchData(); // Bad

// ✅ Use 'unknown' and type guards
const data: unknown = fetchData();
if (isProperty(data)) {
  // Now TypeScript knows data is Property
}
```

## Code Style

### Conditional Rendering
```typescript
// ✅ Good: Early returns
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <PropertyList properties={properties} />;

// ✅ Good: Ternary for simple conditions
{isAvailable ? <Badge>Available</Badge> : <Badge>Unavailable</Badge>}

// ✅ Good: Logical AND for conditional rendering
{hasPermission && <AdminPanel />}

// ❌ Avoid: Nested ternaries
{status === 'pending' ? <Pending /> : status === 'approved' ? <Approved /> : <Rejected />}
```

### Array Operations
```typescript
// ✅ Use map for transformations
const propertyCards = properties.map(property => (
  <PropertyCard key={property.id} property={property} />
));

// ✅ Use filter for filtering
const availableProperties = properties.filter(p => p.is_available);

// ✅ Use reduce for aggregations
const totalValue = properties.reduce((sum, p) => sum + p.price_per_month, 0);

// ✅ Use optional chaining
const firstImage = property.image_urls?.[0];
```

### Async/Await
```typescript
// ✅ Good: Try-catch with async/await
async function fetchProperty(id: string) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch property:', error);
    throw error;
  }
}

// ❌ Avoid: Unhandled promises
fetchProperty(id); // Missing await or .catch()
```

## Styling Conventions

### Tailwind CSS
```typescript
// ✅ Group related classes
<div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-white shadow-md">

// ✅ Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>

// ✅ Extract repeated patterns
const cardClasses = "p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow";
```

### Component Composition
```typescript
// ✅ Good: Composition over props
<Card>
  <CardHeader>
    <CardTitle>Property Details</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// ❌ Avoid: Too many props
<Card title="Property Details" content={content} footer={footer} />
```

## Anti-Patterns to Avoid

### ❌ Prop Drilling
```typescript
// Bad
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} />
  </Child>
</Parent>

// ✅ Use Context or composition
const DataContext = createContext<Data | null>(null);

<DataContext.Provider value={data}>
  <Parent>
    <Child>
      <GrandChild />
    </Child>
  </Parent>
</DataContext.Provider>
```

### ❌ Massive Components
```typescript
// Bad: 500+ line component
export function Dashboard() {
  // Too much logic
  // Too many responsibilities
}

// ✅ Split into smaller components
export function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <DashboardStats />
      <DashboardContent />
    </>
  );
}
```

### ❌ Inline Functions in JSX
```typescript
// ❌ Bad: Creates new function on every render
<Button onClick={() => handleClick(id)}>Click</Button>

// ✅ Good: Use useCallback or define outside
const handleButtonClick = useCallback(() => {
  handleClick(id);
}, [id]);

<Button onClick={handleButtonClick}>Click</Button>
```

## Comments & Documentation

### JSDoc Comments
```typescript
/**
 * Calculates the total booking amount including service fees
 * @param basePrice - Monthly rent price
 * @param months - Number of months
 * @param commission - Platform commission rate (default: 0.1)
 * @returns Total amount including fees
 */
export function calculateBookingTotal(
  basePrice: number,
  months: number,
  commission: number = 0.1
): number {
  const subtotal = basePrice * months;
  const serviceFee = subtotal * commission;
  return subtotal + serviceFee;
}
```

### Inline Comments
```typescript
// ✅ Explain WHY, not WHAT
// Using setTimeout to debounce search to avoid excessive API calls
const debouncedSearch = debounce(handleSearch, 300);

// ❌ Obvious comments
// Set loading to true
setLoading(true);
```

## Performance Considerations

### Memoization
```typescript
// ✅ Memoize expensive calculations
const sortedProperties = useMemo(() => {
  return properties.sort((a, b) => b.price_per_month - a.price_per_month);
}, [properties]);

// ✅ Memoize callbacks passed to children
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// ✅ Memoize components
export const PropertyCard = memo(({ property }: PropertyCardProps) => {
  return <div>{property.title}</div>;
});
```

### Lazy Loading
```typescript
// ✅ Lazy load routes
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const PropertyDetail = lazy(() => import('@/pages/PropertyDetail'));

// ✅ Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

## Accessibility

### Semantic HTML
```typescript
// ✅ Use semantic elements
<nav>
  <ul>
    <li><a href="/properties">Properties</a></li>
  </ul>
</nav>

// ✅ Use proper button elements
<button onClick={handleClick}>Submit</button>

// ❌ Avoid div buttons
<div onClick={handleClick}>Submit</div>
```

### ARIA Labels
```typescript
// ✅ Add labels for screen readers
<button aria-label="Close modal" onClick={onClose}>
  <X />
</button>

// ✅ Use proper form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

## Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
