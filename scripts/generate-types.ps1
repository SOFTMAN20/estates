# Generate TypeScript types from Supabase database schema
# Run this after applying migrations to update types

Write-Host "Generating Supabase TypeScript types..." -ForegroundColor Cyan

$projectId = $env:VITE_SUPABASE_PROJECT_ID

if (-not $projectId) {
    Write-Host "❌ Error: VITE_SUPABASE_PROJECT_ID environment variable not set" -ForegroundColor Red
    Write-Host "Please set it in your .env file or environment" -ForegroundColor Yellow
    exit 1
}

npx supabase gen types typescript --project-id $projectId > src/lib/integrations/supabase/types.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Types generated successfully!" -ForegroundColor Green
    Write-Host "📝 File: src/lib/integrations/supabase/types.ts" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to generate types" -ForegroundColor Red
    exit 1
}
