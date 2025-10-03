# Test Coverage

## Test Suite Overview

This project includes comprehensive test coverage using Jest and React Testing Library.

### Test Statistics
- **Total Test Suites**: 6
- **Total Tests**: 36
- **Pass Rate**: 100%

## Test Categories

### 1. API Tests (`__tests__/api/`)
- **tasks.test.ts**: Task API operations
  - Authentication requirements
  - Task querying with user filtering
  - Task creation with user_id
  - Task updates for authorized users
  - Task deletion for authorized users

### 2. Component Tests (`__tests__/components/`)

#### TaskForm Component
- Renders form with all required fields
- Form submission with valid data
- Custom submit labels
- Initial data display
- Cancel button functionality
- Form validation (required fields)
- Form reset after submission

#### TaskCard Component
- Task information display
- Status badge rendering with correct colors
- Edit and delete button functionality
- Edit mode toggle
- Task update operations
- Null description handling
- Edit mode cancellation

### 3. Page Tests (`__tests__/pages/`)

#### Login Page
- Login form rendering
- Signup page navigation link
- Successful user login
- Error message display on failure
- Loading state during authentication
- Required field validation

#### Signup Page
- Signup form rendering
- Login page navigation link
- Successful account creation
- Error message display on failure
- Loading state during registration

### 4. Library Tests (`__tests__/lib/`)
- Supabase client creation
- Environment variable configuration

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- TaskForm.test.tsx
```

## Test Configuration

- **Framework**: Jest
- **Testing Library**: React Testing Library
- **Environment**: jsdom
- **Coverage**: Configured for app/, components/, and lib/ directories

## Mocked Dependencies

- `@/lib/supabase/client` - Supabase browser client
- `@/lib/supabase/server` - Supabase server client
- `next/navigation` - Next.js router

## Test Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: External dependencies are properly mocked
3. **User Events**: Tests simulate real user interactions
4. **Async Handling**: Proper use of waitFor for async operations
5. **Accessibility**: Tests use accessible queries (getByRole, getByLabelText)

## Coverage Areas

✅ **Covered**:
- Authentication flow (login/signup)
- Task CRUD operations
- Form validation
- Error handling
- Loading states
- User authorization
- Component rendering
- User interactions

## Future Enhancements

Potential areas for additional testing:
- E2E tests with Playwright or Cypress
- Visual regression tests
- Performance testing
- Accessibility audits (automated)
