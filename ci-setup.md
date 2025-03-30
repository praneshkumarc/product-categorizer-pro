
# CI Setup with Jenkins

This document explains how to set up Jenkins CI for testing this project.

## Prerequisites

1. Jenkins server installed and running
2. Docker installed on the Jenkins server (if using the Docker agent)
3. Node.js plugin for Jenkins

## Setting Up Jenkins Pipeline

1. In Jenkins, create a new Pipeline job
2. Configure the job to use the SCM repository where your code is hosted
3. Specify the path to the Jenkinsfile as `Jenkinsfile` (root of the project)
4. Save the configuration

## Pipeline Stages

The pipeline includes the following stages:

- **Checkout**: Fetches the code from the repository
- **Install Dependencies**: Installs all npm dependencies
- **Lint**: Runs linting to ensure code quality
- **Test**: Runs Vitest tests

## Test Reports

The test results will be available in the Jenkins console output. Future improvements could include generating and publishing test reports.

## Troubleshooting

If tests fail, check the Jenkins console output for detailed error messages. Common issues include:

- Missing dependencies
- Type errors in the code
- Failed test assertions

## Local Testing

To simulate the CI testing locally before pushing:

```bash
# Install dependencies
npm ci

# Run tests
npm run test
```
