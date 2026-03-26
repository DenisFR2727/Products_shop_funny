---
description: Reusable React component best practices
globs: *.tsx
alwaysApply: false
---
- Create components inside @src/components directory
- Build small, reusable, and composable components
- Keep components focused on a single responsibility
- Use props instead of hardcoding values
- Use TypeScript for props (strict typing)
- Prefer interfaces/types for props definition
- Avoid side effects inside components
- Extract logic into custom hooks when needed
- Use children and composition patterns
- Avoid duplication, reuse existing components
- Keep JSX clean and readable
- Use meaningful and consistent naming
- Avoid inline styles, use modules or classes
- Memoize components only when needed (React.memo)
- Do not over-engineer simple components