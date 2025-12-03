<!-- ---
inclusion: manual
--- -->

# Testing Standards & Approach

## Overview
NyumbaLink follows a pragmatic testing approach focusing on critical user flows and business logic. We prioritize tests that provide the most value and catch real bugs.

## Testing Stack

### Core Libraries
- **Vitest** - Fast unit test runner (Vite-native)
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers
- **MSW (Mock Service Worker)** - API mocking
- **@supabase/supabase-js** - Mocked for tests

### Installation
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

## Test File Organization

### Directory Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── LoginForm.test.tsx
│   └── properties/
│       ├── PropertyCard.tsx
│       └── PropertyCard.test.tsx
├── hooks/
│   ├── useAuth.tsx
│   └── useAuth.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── __tests__/
    ├── setup.ts
    ├── mocks/
    │   ├── supabase.ts
    │   └── handlers.ts
    └── utils/
        └── test-utils.tsx
```

### Naming Conventions
- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Test suites: Describe the component/function being tested
- Test cases: Use descriptive "should" statements

## Unit Testing

### Utility Functions
```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateServiceFee } from './utils';

describe('formatCurrency', () => {
  it('should format Tanzanian Shillings correctly', () => {
    expect(formatCurrency(50000)).toBe('TZS 50,000');
  });

  it('should handle zero values', () => {
    expect(formatCurrency(0)).toBe('TZS 0');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000)).toBe('TZS 1,000,000');
  });
});

describe('calculateServiceFee', () => {
  it('should calculate 10% service fee', () => {
    expect(calculateServiceFee(50000)).toBe(5000);
  });

  it('should round to nearest integer', () => {
    expect(calculateServiceFee(55555)).toBe(5556);
  });
});
```

### Custom Hooks
```typescript
// hooks/useAuth.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null user initially', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('should sign in user successfully', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser, session: {} },
      error: null
    });

    const { result } = renderHook(() => useAuth());
    
    await result.current.signIn('test@example.com', 'password');
    
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should handle sign in errors', async () => {
    const mockError = { message: 'Invalid credentials' };
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    });

    const { result } = renderHook(() => useAuth());
    
    await expect(
      result.current.signIn('test@example.com', 'wrong')
    ).rejects.toThrow('Invalid credentials');
  });
});
```

## Component Testing

### Basic Component Test
```typescript
// components/properties/PropertyCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyCard } from './PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Modern Apartment',
    price_per_month: 50000,
    bedrooms: 2,
    bathrooms: 1,
    city: 'Dar es Salaam',
    image_urls: ['https://example.com/image.jpg']
  };

  it('should render property details', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
    expect(screen.getByText(/TZS 50,000/)).toBeInTheDocument();
    expect(screen.getByText(/2 bed/)).toBeInTheDocument();
    expect(screen.getByText(/Dar es Salaam/)).toBeInTheDocument();
  });

  it('should display property image', () => {
    render(<PropertyCard property={mockProperty} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProperty.image_urls[0]);
  });
});
```

### Form Component Test
```typescript
// components/auth/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<LoginForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('should show validation errors', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={vi.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('should disable submit button while loading', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading={true} />);
    
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();
  });
});
```

## Integration Testing

### Testing with React Query
```typescript
// __tests__/utils/test-utils.tsx
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0
      }
    }
  });
}

export function renderWithProviders(ui: ReactNode) {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

### Testing Data Fetching
```typescript
// hooks/useProperties.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProperties } from './useProperties';
import { createTestQueryClient, renderWithProviders } from '@/__tests__/utils/test-utils';

describe('useProperties', () => {
  it('should fetch properties successfully', async () => {
    const mockProperties = [
      { id: '1', title: 'Property 1' },
      { id: '2', title: 'Property 2' }
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: mockProperties,
          error: null
        })
      })
    });

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => renderWithProviders(children)
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProperties);
  });
});
```

## Mocking Strategies

### Supabase Client Mock
```typescript
// __tests__/mocks/supabase.ts
import { vi } from 'vitest';

export const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis()
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
      remove: vi.fn()
    }))
  }
};

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase
}));
```

### MSW Handlers
```typescript
// __tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/rest/v1/properties', () => {
    return HttpResponse.json([
      { id: '1', title: 'Property 1' },
      { id: '2', title: 'Property 2' }
    ]);
  }),

  http.post('/rest/v1/bookings', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'new-booking-id',
      ...body,
      status: 'pending'
    }, { status: 201 });
  })
];
```

## Test Coverage Expectations

### Coverage Targets
- **Critical paths**: 90%+ coverage
  - Authentication flows
  - Booking creation
  - Payment processing
  - Property approval workflow
- **Business logic**: 80%+ coverage
  - Utility functions
  - Custom hooks
  - Form validation
- **UI components**: 60%+ coverage
  - Focus on user interactions
  - Test error states
  - Test loading states

### Running Coverage
```bash
npm run test:coverage
```

## Testing Best Practices

### DO
1. **Test user behavior, not implementation**
   ```typescript
   // Good
   await user.click(screen.getByRole('button', { name: /submit/i }));
   expect(screen.getByText(/success/i)).toBeInTheDocument();
   
   // Bad
   expect(component.state.isSubmitting).toBe(false);
   ```

2. **Use accessible queries**
   ```typescript
   // Preferred order
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText(/email/i)
   screen.getByPlaceholderText(/search/i)
   screen.getByText(/welcome/i)
   ```

3. **Test error scenarios**
   ```typescript
   it('should handle network errors', async () => {
     vi.mocked(supabase.from).mockRejectedValue(
       new Error('Network error')
     );
     
     render(<PropertyList />);
     
     expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
   });
   ```

4. **Clean up after tests**
   ```typescript
   afterEach(() => {
     vi.clearAllMocks();
     cleanup();
   });
   ```

### DON'T
1. **Don't test implementation details**
2. **Don't test third-party libraries**
3. **Don't write tests that always pass**
4. **Don't mock everything** - Mock only external dependencies
5. **Don't test styles** - Use visual regression testing tools instead

## Critical Test Scenarios

### Authentication Flow
- Sign up with valid data
- Sign in with valid credentials
- Handle invalid credentials
- Sign out successfully
- Persist session across page reloads

### Booking Flow
- Create booking with valid dates
- Validate date ranges (check-out > check-in)
- Calculate total amount correctly
- Handle unavailable properties
- Cancel booking

### Payment Flow
- Process M-Pesa payment
- Handle payment success
- Handle payment failure
- Update booking status on payment
- Refund processing

### Property Management
- Create property listing
- Upload property images
- Edit property details
- Toggle availability
- Admin approval workflow

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Resources
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
