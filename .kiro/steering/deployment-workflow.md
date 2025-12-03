---
inclusion: manual 
---

# Deployment Process & Workflow

## Overview
NyumbaLink uses Vercel for frontend deployment and Supabase for backend services. This document outlines the complete deployment process, CI/CD pipeline, and environment management.

## Environments

### Development (Local)
- **URL**: `http://localhost:5173`
- **Purpose**: Local development and testing
- **Database**: Supabase development project
- **Branch**: Feature branches

### Staging (Preview)
- **URL**: `https://nyumbalink-*.vercel.app`
- **Purpose**: Testing before production
- **Database**: Supabase staging project
- **Branch**: `develop` or PR branches

### Production
- **URL**: `https://nyumbalink.com`
- **Purpose**: Live application
- **Database**: Supabase production project
- **Branch**: `main`

## Environment Variables

### Required Variables by Environment

#### Development (.env.local)
```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# App Configuration
VITE_APP_NAME=NyumbaLink
VITE_APP_URL=http://localhost:5173
VITE_PLATFORM_COMMISSION=0.10

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=false

# Development Only
VITE_DEBUG_MODE=true
```

#### Staging
```bash
# Supabase Staging
VITE_SUPABASE_URL=https://staging-xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# App Configuration
VITE_APP_NAME=NyumbaLink (Staging)
VITE_APP_URL=https://nyumbalink-staging.vercel.app
VITE_PLATFORM_COMMISSION=0.10

# Third-party Services (Test Mode)
VITE_MPESA_API_KEY=test_key
VITE_SENTRY_DSN=https://...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
```

#### Production
```bash
# Supabase Production
VITE_SUPABASE_URL=https://prod-xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# App Configuration
VITE_APP_NAME=NyumbaLink
VITE_APP_URL=https://nyumbalink.com
VITE_PLATFORM_COMMISSION=0.10

# Third-party Services (Live)
VITE_MPESA_API_KEY=live_key
VITE_SENTRY_DSN=https://...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
VITE_MAINTENANCE_MODE=false
```

## Build Process

### Local Build
```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Lint
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Configuration

#### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

## CI/CD Pipeline

### GitHub Actions Workflow

#### .github/workflows/ci.yml
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://nyumbalink-staging.vercel.app
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://nyumbalink.com
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
      
      - name: Notify deployment
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
          -H 'Content-Type: application/json' \
          -d '{"text":"✅ NyumbaLink deployed to production"}'
```

## Vercel Configuration

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
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
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "VITE_APP_NAME": "NyumbaLink"
  }
}
```

## Supabase Deployment

### Database Migrations

#### Running Migrations
```bash
# Link to Supabase project
npx supabase link --project-ref your-project-ref

# Create new migration
npx supabase migration new migration_name

# Apply migrations locally
npx supabase db reset

# Push migrations to remote
npx supabase db push

# Generate TypeScript types
npx supabase gen types typescript --project-id your-project-ref > src/lib/integrations/supabase/types.ts
```

#### Migration Workflow
```bash
# 1. Create migration locally
npx supabase migration new add_analytics_table

# 2. Write SQL in supabase/migrations/YYYYMMDDHHMMSS_add_analytics_table.sql

# 3. Test locally
npx supabase db reset

# 4. Push to staging
npx supabase db push --project-ref staging-ref

# 5. Verify in staging

# 6. Push to production
npx supabase db push --project-ref prod-ref
```

### Edge Functions Deployment

#### Deploy Edge Function
```bash
# Deploy single function
npx supabase functions deploy function-name

# Deploy all functions
npx supabase functions deploy

# Deploy with secrets
npx supabase secrets set MPESA_API_KEY=your_key
npx supabase functions deploy payment-processor
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Breaking changes documented
- [ ] Changelog updated

### Deployment Steps

#### 1. Prepare Release
```bash
# Update version
npm version patch|minor|major

# Update CHANGELOG.md
# Document changes, fixes, and new features

# Commit changes
git add .
git commit -m "chore: release v1.2.3"
git tag v1.2.3
```

#### 2. Deploy Database Changes
```bash
# Backup production database
npx supabase db dump --project-ref prod-ref > backup.sql

# Apply migrations
npx supabase db push --project-ref prod-ref

# Verify migrations
npx supabase db diff --linked
```

#### 3. Deploy Frontend
```bash
# Merge to main branch
git checkout main
git merge develop
git push origin main

# Vercel auto-deploys from main branch
# Monitor deployment at https://vercel.com/dashboard
```

#### 4. Deploy Edge Functions
```bash
# Deploy updated functions
npx supabase functions deploy --project-ref prod-ref

# Verify function logs
npx supabase functions logs function-name
```

### Post-Deployment
- [ ] Verify deployment URL is accessible
- [ ] Test critical user flows
- [ ] Check error monitoring (Sentry)
- [ ] Monitor performance metrics
- [ ] Verify database connections
- [ ] Test payment processing
- [ ] Check real-time subscriptions
- [ ] Notify team of deployment

## Rollback Strategy

### Frontend Rollback

#### Vercel Instant Rollback
```bash
# Via Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "Promote to Production"

# Via CLI:
vercel rollback
```

### Database Rollback

#### Restore from Backup
```bash
# List backups
npx supabase db dump --list

# Restore specific backup
npx supabase db restore backup.sql --project-ref prod-ref
```

#### Revert Migration
```bash
# Create down migration
npx supabase migration new revert_feature

# Write SQL to undo changes
# Apply migration
npx supabase db push
```

### Emergency Rollback Procedure
1. **Identify Issue**: Confirm the problem and impact
2. **Enable Maintenance Mode**: Set `VITE_MAINTENANCE_MODE=true`
3. **Rollback Frontend**: Use Vercel instant rollback
4. **Rollback Database**: Restore from backup if needed
5. **Verify**: Test critical functionality
6. **Communicate**: Notify users and team
7. **Post-Mortem**: Document incident and prevention

## Monitoring & Alerts

### Health Checks
```typescript
// src/lib/healthCheck.ts
export async function checkHealth() {
  const checks = {
    database: await checkDatabase(),
    storage: await checkStorage(),
    auth: await checkAuth(),
  };
  
  return {
    status: Object.values(checks).every(c => c) ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  };
}

async function checkDatabase() {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}
```

### Error Monitoring (Sentry)
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Filter sensitive data
      if (event.request) {
        delete event.request.cookies;
      }
      return event;
    },
  });
}
```

### Performance Monitoring
```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to Google Analytics or custom endpoint
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Maintenance Mode

### Enable Maintenance Mode
```typescript
// src/App.tsx
if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
  return <MaintenancePage />;
}

// components/MaintenancePage.tsx
export function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>We'll be back soon!</h1>
        <p>We're performing scheduled maintenance.</p>
        <p>Expected completion: {import.meta.env.VITE_MAINTENANCE_END}</p>
      </div>
    </div>
  );
}
```

## Performance Optimization

### Build Optimization
- Code splitting by route
- Lazy loading components
- Image optimization (WebP format)
- Tree shaking unused code
- Minification and compression
- CDN for static assets

### Caching Strategy
```typescript
// Service Worker for offline support
// public/sw.js
const CACHE_NAME = 'nyumbalink-v1';
const urlsToCache = [
  '/',
  '/assets/logo.svg',
  '/assets/fonts/inter.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
```

## Security Considerations

### Pre-Deployment Security Checks
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for secrets in code
git secrets --scan

# Verify environment variables
node scripts/verify-env.js
```

### Production Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)
- Referrer-Policy

## Documentation Updates

### Post-Deployment Documentation
- Update API documentation
- Update user guides
- Document new features
- Update troubleshooting guides
- Update environment setup docs

## Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Sentry Documentation](https://docs.sentry.io/)
