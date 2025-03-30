
#!/bin/bash
# Simple script to run tests in Jenkins

set -e # Exit immediately if a command exits with a non-zero status

echo "Running Vitest tests..."
npm run test

if [ $? -eq 0 ]; then
    echo "All tests passed successfully!"
    exit 0
else
    echo "Tests failed. Please check the logs for more details."
    exit 1
fi
