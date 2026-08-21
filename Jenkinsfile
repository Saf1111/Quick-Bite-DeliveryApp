pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t quick-bite:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop quick-bite || true
                    docker rm quick-bite || true
                    docker run -d \
                      --name quick-bite \
                      -p 3000:3000 \
                      --restart unless-stopped \
                      quick-bite:latest
                '''
            }
        }
    }
}
