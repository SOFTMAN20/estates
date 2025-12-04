---
inclusion:  always
---

# Security Guidelines & Policies

## Overview
NyumbaLink implements security best practices across authentication, data validation, authorization, and secure coding to protect user data and prevent vulnerabilities.

## Authentication & Authorization

### Supabase Authentication
```typescript
// ✅ Always use Supabase auth
import { supabase } from '@/lib/supabase';

// Sign up with secure password requirements
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password, // Min 8 chars, validated client-side
  options: {
    data: { full_name: fullName }
  }
});

// ❌ Never store passwords in plain text
// ❌ Never implement custom auth without proper security
```

### Password Requirements
- Minimum 8 characters
- Must contain uppercase and lowercase letters
- Must contain at least one number
- Must contain at least one special character
- Validate on both client and server side

### Session Management
```typescript
// ✅ Check auth state on protected routes
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  navigate('/login');
  return;
}

// ✅ Handle session expiry
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    // Handle appropriately
  }
});

// ❌ Never store tokens in localStorage without encryption
// ✅ Supabase handles secure token storage automatically
```

## Row Level Security (RLS)

### Enable RLS on All Tables
```sql
-- ✅ Always enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

### RLS Policy Patterns
```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Hosts can manage their own properties
CREATE POLICY "Hosts can manage own properties"
ON properties FOR ALL
USING (auth.uid() = host_id);

-- Guests can view approved properties
CREATE POLICY "Anyone can view approved properties"
ON properties FOR SELECT
USING (status = 'approved' AND is_available = true);

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (
  auth.uid() = guest_id OR 
  auth.uid() IN (
    SELECT host_id FROM properties WHERE id = property_id
  )
);

-- Admin-only access
CREATE POLICY "Admins can manage all"
ON properties FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Input Validation & Sanitization

### Client-Side Validation with Zod
```typescript
import { z } from 'zod';

// ✅ Define strict schemas
const propertySchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
  
  price_per_month: z.number()
    .positive('Price must be positive')
    .max(100000000, 'Price exceeds maximum'),
  
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  
  bedrooms: z.number()
    .int('Must be a whole number')
    .min(1)
    .max(20),
});

// ✅ Validate before submission
const result = propertySchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
  console.error(result.error.errors);
  return;
}
```

### Sanitize User Input
```typescript
// ✅ Sanitize HTML content
import DOMPurify from 'dompurify';

const sanitizedDescription = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
  ALLOWED_ATTR: []
});

// ✅ Escape special characters for display
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ❌ Never use dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // Bad

// ✅ Sanitize first
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

## SQL Injection Prevention

### Use Parameterized Queries
```typescript
// ✅ Supabase automatically prevents SQL injection
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('city', userInput); // Safe - parameterized

// ❌ Never construct raw SQL with user input
const query = `SELECT * FROM properties WHERE city = '${userInput}'`; // Vulnerable!

// ✅ If using raw SQL, use parameters
const { data } = await supabase.rpc('search_properties', {
  search_term: userInput // Passed as parameter
});
```

## XSS (Cross-Site Scripting) Prevention

### Content Security Policy
```typescript
// vercel.json or server configuration
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Safe Rendering
```typescript
// ✅ React escapes by default
<div>{userInput}</div> // Safe

// ✅ Use textContent for DOM manipulation
element.textContent = userInput; // Safe

// ❌ Avoid innerHTML
element.innerHTML = userInput; // Vulnerable
```

## File Upload Security

### Validate File Types
```typescript
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File): boolean {
  // ✅ Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.');
  }
  
  // ✅ Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 5MB.');
  }
  
  // ✅ Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
    throw new Error('Invalid file extension.');
  }
  
  return true;
}
```

### Secure File Upload
```typescript
async function uploadPropertyImage(file: File, propertyId: string) {
  // ✅ Validate file
  validateFile(file);
  
  // ✅ Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${propertyId}/${fileName}`;
  
  // ✅ Upload to Supabase Storage with RLS
  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  return data;
}

// ❌ Never trust client-provided filenames
// ❌ Never execute uploaded files
// ❌ Never store files in publicly accessible directories without validation
```

## API Security

### Rate Limiting
```typescript
// Implement client-side debouncing
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query: string) => {
  await searchProperties(query);
}, 300);

// ✅ Use React Query for automatic request deduplication
const { data } = useQuery({
  queryKey: ['properties', filters],
  queryFn: () => fetchProperties(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### CORS Configuration
```typescript
// Supabase handles CORS automatically
// For custom Edge Functions:
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.VITE_APP_URL,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // Handle request
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
```

## Environment Variables

### Secure Configuration
```typescript
// .env.example (commit this)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_URL=http://localhost:5173

// .env.local (never commit this)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Server-side only!

// ✅ Access environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL');
}

// ❌ Never commit secrets to version control
// ❌ Never expose service role key to client
// ❌ Never hardcode API keys
```

## Data Privacy

### Personal Data Handling
```typescript
// ✅ Minimize data collection
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  // Only collect what's necessary
}

// ✅ Encrypt sensitive data
// Supabase encrypts data at rest automatically

// ✅ Implement data retention policies
// Delete old data that's no longer needed

// ❌ Never log sensitive information
console.log('User password:', password); // Bad!
console.log('Payment details:', paymentInfo); // Bad!

// ✅ Log safely
console.log('User authenticated:', userId);
```

### GDPR Compliance
```typescript
// ✅ Implement data export
async function exportUserData(userId: string) {
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('guest_id', userId);
  
  return { profile, bookings };
}

// ✅ Implement data deletion
async function deleteUserAccount(userId: string) {
  // Delete user data in correct order (foreign keys)
  await supabase.from('bookings').delete().eq('guest_id', userId);
  await supabase.from('properties').delete().eq('host_id', userId);
  await supabase.from('users').delete().eq('id', userId);
  await supabase.auth.admin.deleteUser(userId);
}
```

## Payment Security

### PCI Compliance
```typescript
// ✅ Never store credit card details
// ✅ Use payment provider's SDK (M-Pesa, Stripe)
// ✅ Validate payment amounts server-side

// Edge Function for payment processing
async function processPayment(bookingId: string, amount: number) {
  // ✅ Verify amount matches booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('total_amount')
    .eq('id', bookingId)
    .single();
  
  if (booking.total_amount !== amount) {
    throw new Error('Amount mismatch');
  }
  
  // ✅ Process payment with provider
  // ✅ Use idempotency keys to prevent duplicate charges
}

// ❌ Never trust client-provided amounts
// ❌ Never expose payment provider secrets to client
```

## Error Handling

### Secure Error Messages
```typescript
// ✅ Generic error messages to users
try {
  await processPayment(data);
} catch (error) {
  // ✅ Log detailed error server-side
  console.error('Payment processing failed:', error);
  
  // ✅ Show generic message to user
  toast.error('Payment failed. Please try again.');
  
  // ❌ Don't expose internal details
  // toast.error(error.message); // May leak sensitive info
}

// ✅ Different messages for different environments
const errorMessage = import.meta.env.DEV
  ? error.message // Detailed in development
  : 'An error occurred'; // Generic in production
```

## Security Checklist

### Before Deployment
- [ ] All tables have RLS policies enabled
- [ ] Environment variables are properly configured
- [ ] No secrets committed to version control
- [ ] Input validation on all forms
- [ ] File upload validation implemented
- [ ] HTTPS enforced in production
- [ ] CSP headers configured
- [ ] Error messages don't leak sensitive info
- [ ] Authentication required for protected routes
- [ ] Rate limiting implemented
- [ ] Dependencies updated (no known vulnerabilities)
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified

### Regular Security Audits
```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Incident Response

### Security Breach Protocol
1. **Identify**: Detect and confirm the breach
2. **Contain**: Isolate affected systems
3. **Investigate**: Determine scope and impact
4. **Remediate**: Fix vulnerabilities
5. **Notify**: Inform affected users if required
6. **Review**: Update security measures

### Logging & Monitoring
```typescript
// ✅ Log security events
async function logSecurityEvent(event: string, userId: string, details: any) {
  await supabase.from('security_logs').insert({
    event_type: event,
    user_id: userId,
    details: details,
    ip_address: req.headers.get('x-forwarded-for'),
    user_agent: req.headers.get('user-agent'),
    timestamp: new Date().toISOString()
  });
}

// Log important events
- Failed login attempts
- Password changes
- Permission changes
- Data exports
- Account deletions
```

## Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
