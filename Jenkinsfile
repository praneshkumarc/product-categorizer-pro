pipeline {
    agent any
    
    stages {
        
        stage('Install Dependencies') {
            steps {
                // Install the project dependencies
                bat 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                // Run linting to ensure code quality
                bat 'npm run lint || exit 0' // Ensures pipeline continues even if linting fails
            }
        }
        
        stage('Test') {
            steps {
                // Run the Vitest tests
                bat 'npm run test'
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
