// Example of how to run the entire test suite with a single command:
// ./run-tests.sh

// File: run-tests.sh
#!/bin/bash
# Make sure permissions are set: chmod +x run-tests.sh before execution

# Set up environment variables
export NODE_ENV=test

# Install dependencies if needed
npm install

# Run ESB Businessowners tests
echo "Running ESB Businessowners tests..."
npm run test:bop

# Run ESB Commercial Auto tests
echo "Running ESB Commercial Auto tests..."
npm run test:ca

# Generate and serve the report
echo "Generating test report..."
npm run report

echo "All tests completed."
