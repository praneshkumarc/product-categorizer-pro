pipeline {
    agent {
        // This specifies where the pipeline will execute
        docker {
            image 'node:18' // Using Node.js 18 for compatibility with your project
            args '-v /tmp:/tmp' // Optional volume mapping
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Get the code from the repository
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install the project dependencies
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                // Run linting to ensure code quality
                sh 'npm run lint || true' // The '|| true' ensures pipeline continues even if linting fails
            }
        }
        
        stage('Test') {
            steps {
                // Run the Vitest tests
                sh 'npm run test'
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        
        success {
            echo 'Tests passed successfully!'
        }
        
        failure {
            echo 'Tests failed. Please check the logs for more details.'
        }
    }
}
