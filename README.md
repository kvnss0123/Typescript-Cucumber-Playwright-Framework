# PolicyCenter Test Automation Framework

## Prerequisites
- Node.js (v16+)
- npm (v8+)

## Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running Tests
- Run all tests:
```bash
npm test
```

- Run specific feature:
```bash
npx cucumber-js features/login.feature
```

## Framework Features
- TypeScript
- Playwright
- Cucumber BDD
- YAML-based test data and locators
- Page Object Model
- Custom utilities
- Detailed reporting

## Project Structure
- `config/`: Configuration files
- `src/`:
  - `pages/`: Page object classes
  - `steps/`: Cucumber step definitions
  - `supports/`: Support utilities
  - `utils/`: Helper functions
- `features/`: Cucumber feature files
- `reports/`: Test reports

## Best Practices
- Separation of concerns
- Reusable components
- Type-safe code
- Centralized test data management
- Detailed logging and reporting

## Reporting
HTML and JSON reports are generated in the `reports/` directory after test execution.
