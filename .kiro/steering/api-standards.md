---
inclusion: fileMatch
fileMatchPattern: '**/{api,functions,edge-functions,supabase/functions,lib/integrations,hooks}/**'
---


# API Standards & Conventions

## Overview
NyumbaLink uses Supabase as the backend, which provides a RESTful API auto-generated from PostgreSQL schema. This document defines conventions for interacting with the Supabase API and custom Edge Functions.

## Supabase Client Usage

### Client Initialization
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/integrations/supabase/types';

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Query Patterns

#### Fetching Data
```typescript
// Single record
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .eq('id', propertyId)
  .single();

// Multiple records with filters
const { data, error } = await supabase
  .from('properties')
  .select('*, users(full_name, avatar_url)')
  .eq('status', 'approved')
  .eq('is_available', true)
  .order('created_at', { ascending: false })
  .range(0, 9);
```

#### Inserting Data
```typescript
const { data, error } = await supabase
  .from('properties')
  .insert({
    title: 'Modern Apartment',
    price_per_month: 50000,
    host_id: userId,
    status: 'pending'
  })
  .select()
  .single();
```

#### Updating Data
```typescript
const { data, error } = await supabase
  .from('properties')
  .update({ is_available: false })
  .eq('id', propertyId)
  .select()
  .single();
```

#### Deleting Data
```typescript
const { error } = await supabase
  .from('bookings')
  .delete()
  .eq('id', bookingId);
```

## Error Handling

### Standard Error Response Format
```typescript
interface ApiError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Example error handling
try {
  const { data, error } = await supabase
    .from('properties')
    .select('*');
    
  if (error) throw error;
  
  return data;
} catch (error) {
  console.error('Failed to fetch properties:', error);
  throw new Error(error.message || 'An unexpected error occurred');
}
```

### Common Error Codes
- `PGRST116` - No rows returned (404)
- `23505` - Unique violation (409)
- `23503` - Foreign key violation (400)
- `42501` - Insufficient privileges (403)
- `42P01` - Undefined table (500)

### Error Handling Pattern
```typescript
export async function handleSupabaseError(error: any): Promise<never> {
  if (error.code === 'PGRST116') {
    throw new Error('Resource not found');
  }
  if (error.code === '23505') {
    throw new Error('This record already exists');
  }
  if (error.code === '42501') {
    throw new Error('You do not have permission to perform this action');
  }
  throw new Error(error.message || 'An unexpected error occurred');
}
```

## Authentication Flow

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'guest'
    }
  }
});
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
});
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
```

### Session Management
```typescript
// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Handle sign in
  }
  if (event === 'SIGNED_OUT') {
    // Handle sign out
  }
});
```

## Real-time Subscriptions

### Subscribe to Changes
```typescript
const subscription = supabase
  .channel('bookings-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'bookings',
      filter: `guest_id=eq.${userId}`
    },
    (payload) => {
      console.log('New booking:', payload.new);
    }
  )
  .subscribe();

// Cleanup
return () => {
  subscription.unsubscribe();
};
```

## File Storage

### Upload Pattern
```typescript
const { data, error } = await supabase.storage
  .from('property-images')
  .upload(`${propertyId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```

### Get Public URL
```typescript
const { data } = supabase.storage
  .from('property-images')
  .getPublicUrl(`${propertyId}/${fileName}`);

const publicUrl = data.publicUrl;
```

### Delete File
```typescript
const { error } = await supabase.storage
  .from('property-images')
  .remove([`${propertyId}/${fileName}`]);
```

## Edge Functions

### Calling Edge Functions
```typescript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { key: 'value' },
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Edge Function Structure
```typescript
// supabase/functions/function-name/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { key } = await req.json();
    
    // Process request
    const result = await processData(key);
    
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

## HTTP Status Codes

### Success Codes
- `200 OK` - Successful GET, PUT, PATCH, DELETE
- `201 Created` - Successful POST (resource created)
- `204 No Content` - Successful DELETE (no response body)

### Client Error Codes
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate)
- `422 Unprocessable Entity` - Validation error

### Server Error Codes
- `500 Internal Server Error` - Unexpected server error
- `503 Service Unavailable` - Service temporarily unavailable

## Request/Response Examples

### Create Property
```typescript
// Request
const propertyData = {
  title: 'Luxury Villa in Masaki',
  description: 'Beautiful 3-bedroom villa...',
  property_type: 'villa',
  price_per_month: 150000,
  bedrooms: 3,
  bathrooms: 2,
  square_meters: 200,
  address: 'Masaki, Dar es Salaam',
  city: 'Dar es Salaam',
  country: 'Tanzania',
  amenities: ['wifi', 'parking', 'pool', 'security'],
  host_id: userId
};

const { data, error } = await supabase
  .from('properties')
  .insert(propertyData)
  .select()
  .single();

// Response
{
  id: 'uuid',
  title: 'Luxury Villa in Masaki',
  status: 'pending',
  created_at: '2025-11-29T10:00:00Z',
  // ... other fields
}
```

### Create Booking
```typescript
// Request
const bookingData = {
  property_id: propertyId,
  guest_id: userId,
  check_in: '2025-12-01',
  check_out: '2026-01-01',
  total_months: 1,
  total_amount: 50000,
  service_fee: 5000,
  special_requests: 'Early check-in if possible'
};

const { data, error } = await supabase
  .from('bookings')
  .insert(bookingData)
  .select('*, properties(*), users(*)')
  .single();

// Response includes related data
{
  id: 'uuid',
  status: 'pending',
  properties: { title: '...', ... },
  users: { full_name: '...', ... },
  // ... other fields
}
```

## Pagination

### Offset-based Pagination
```typescript
const page = 1;
const pageSize = 10;
const from = (page - 1) * pageSize;
const to = from + pageSize - 1;

const { data, error, count } = await supabase
  .from('properties')
  .select('*', { count: 'exact' })
  .range(from, to);

// Calculate total pages
const totalPages = Math.ceil((count || 0) / pageSize);
```

## Rate Limiting
- Supabase has built-in rate limiting
- Free tier: 500 requests per second
- Implement client-side debouncing for search inputs
- Use React Query caching to reduce API calls

## Best Practices

1. **Always handle errors** - Check for error in response
2. **Use TypeScript types** - Import Database types from generated file
3. **Select specific fields** - Don't use `select('*')` in production
4. **Use RLS policies** - Never bypass Row Level Security
5. **Batch operations** - Use `.insert([])` for multiple records
6. **Cache responses** - Use React Query for automatic caching
7. **Clean up subscriptions** - Always unsubscribe on unmount
8. **Validate input** - Use Zod schemas before API calls
9. **Use transactions** - For operations that must succeed together
10. **Monitor performance** - Track slow queries in Supabase dashboard
