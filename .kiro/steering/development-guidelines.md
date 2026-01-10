---
inclusion: always
---

# Development Guidelines

## TypeScript Best Practices
- Enable strict mode where possible
- Use explicit types for function parameters and return values
- Prefer interfaces for object shapes, types for unions
- Avoid `any` - use `unknown` with type guards instead
- Use generics for reusable type-safe code

## Component Guidelines
- Use functional components with hooks (no class components)
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks (`use<Name>`)
- Use React.memo for expensive components
- Prefer composition over prop drilling

## Code Style
- Run `npm run lint` before committing
- Use meaningful, descriptive variable names
- Follow Tailwind CSS utility-first approach
- Use `cn()` utility for conditional classes
- Group related Tailwind classes logically

## Comments & Documentation
- Add comments for complex business logic
- Use JSDoc for exported functions
- Explain "why" not "what" in comments
- Update docs when changing functionality

## Git Workflow
- Write meaningful commit messages (imperative mood)
- Format: `type: description` (feat, fix, refactor, docs, chore)
- Keep commits focused and atomic
- Test changes thoroughly before pushing

## Testing Checklist
- Verify feature works as expected
- Check error states and edge cases
- Test on mobile viewport
- Ensure no console errors
- Validate TypeScript types pass
