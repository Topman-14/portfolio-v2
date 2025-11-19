# Contributing to Portfolio V2

Thank you for your interest in contributing to Portfolio V2! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/portfolio-v2.git
   cd portfolio-v2
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/Topman-14/portfolio-v2.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables**

   Create a `.env` file in the root directory. See the [README.md](./README.md#3-environment-variables) for required environment variables:
   ```bash
   # Create .env file with the following variables:
   # DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db?schema=public"
   # AUTH_SECRET="your-secret-key-here"
   # NEXTAUTH_URL="http://localhost:3000"
   ```

6. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

7. **Create a test admin user**

   ```bash
   npm run createsuperuser
   ```

8. **Start the development server**

   ```bash
   npm run dev
   ```

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### Making Changes

1. Make your changes following the [coding standards](#coding-standards)
2. Test your changes thoroughly
3. Ensure the code lints without errors: `npm run lint`
4. Test the build: `npm run build`

### Keeping Your Fork Updated

Regularly sync your fork with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper types or `unknown`
- Use interfaces for object shapes, types for unions/intersections
- Export types/interfaces that are used in multiple files

### React/Next.js

- Use functional components with hooks
- Use `async` server components when possible
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use meaningful component and function names

**Example:**
```typescript
// Good
export function UserProfile({ userId }: { userId: string }) {
  const user = useUser(userId);
  return <div>{user.name}</div>;
}

// Avoid
export function Component({ id }: { id: string }) {
  const data = useData(id);
  return <div>{data.name}</div>;
}
```

### Code Organization

- **DRY Principle**: Don't repeat yourself - extract common code
- **Component Structure**: Keep similar items in arrays/maps when possible
- **File Naming**: Use kebab-case for files, PascalCase for components
- **Imports**: Group imports (external, internal, relative)
- **No Comments**: Don't add comments unless specifically requested

**Example:**
```typescript
// Good - DRY with array mapping
const navItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "Blog", href: "/blog" },
];

export function Navigation() {
  return (
    <nav>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
```

### Styling

- Use Tailwind CSS classes for styling
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

### Database

- Always use Prisma for database operations
- Use transactions for multi-step operations
- Handle errors appropriately
- Use proper Prisma types

### Error Handling

- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors appropriately (console.error in development)
- Return proper HTTP status codes in API routes

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(admin): add article search functionality

fix(blog): resolve image loading issue on mobile

docs(readme): update setup instructions

refactor(components): extract reusable form logic
```

### Commit Best Practices

- Make atomic commits (one logical change per commit)
- Write clear commit messages
- Don't commit sensitive data or `.env` files
- Test before committing

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run checks**
   ```bash
   npm run lint
   npm run build
   ```

3. **Test thoroughly**
   - Test your changes in different browsers
   - Test on mobile devices if UI-related
   - Test edge cases

### Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin your-branch-name
   ```

2. **Create PR on GitHub**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring
   - [ ] Other (please describe)

   ## Testing
   - [ ] Tested locally
   - [ ] All tests pass
   - [ ] No console errors

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   ```


### Bug Reports

When reporting bugs, please include:

1. **Clear title** - Brief description of the issue
2. **Description** - Detailed explanation of the problem
3. **Steps to reproduce** - How to trigger the bug
4. **Expected behavior** - What should happen
5. **Actual behavior** - What actually happens
6. **Screenshots** - If applicable
7. **Environment**:
   - OS and version
   - Node.js version
   - Browser (if applicable)
   - Database version

### Feature Requests

For feature requests, include:

1. **Clear title** - Brief description of the feature
2. **Use case** - Why this feature would be useful
3. **Proposed solution** - How you envision it working
4. **Alternatives** - Other solutions you've considered

## Questions?

If you have questions about contributing:

- Open an issue with the `question` label
- Check existing issues and PRs
- Review the codebase and documentation

## Thank You!
