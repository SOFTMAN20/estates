#!/bin/bash

# Generate TypeScript types from Supabase database schema
# Run this after applying migrations to update types

echo "Generating Supabase TypeScript types..."

npx supabase gen types typescript --project-id $VITE_SUPABASE_PROJECT_ID > src/lib/integrations/supabase/types.ts

echo "✅ Types generated successfully!"
echo "📝 File: src/lib/integrations/supabase/types.ts"
