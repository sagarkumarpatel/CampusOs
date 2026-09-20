# Testing Guide

CampusOS employs two primary testing strategies to ensure application stability: E2E Testing (Playwright) and API Testing (Vitest).

## End-to-End (E2E) Testing with Playwright

Playwright is used to test critical user flows directly in a headless browser environment.

### Setup
1. Ensure both the frontend and backend are running locally (`npm run dev` in both directories).
2. Install Playwright browsers (first-time only):
   ```bash
   cd frontend
   npx playwright install --with-deps
   ```

### Running Tests
Run the entire suite:
```bash
cd frontend
npm run test:e2e
```

Run tests with the UI runner (useful for debugging):
```bash
npx playwright test --ui
```

### Test Data Management
Playwright tests interact with the actual database. A setup script runs before the test suite to seed necessary data, and a teardown script cleans up the test artifacts afterward to prevent polluting the local database.

---

## API Testing with Vitest

Vitest is used in combination with Supertest to execute integration tests against the backend API endpoints without spinning up the full Express server.

### Running Tests
Run the backend test suite:
```bash
cd backend
npm run test
```

Watch mode for active development:
```bash
npm run test:watch
```

### Test Coverage
To generate a coverage report:
```bash
npm run coverage
```
Coverage reports will be output to the `backend/coverage/` directory.
