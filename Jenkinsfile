pipeline {
    agent any

    environment {
        COMPOSE_FILE = '/opt/paygate/docker-compose.yml'
        APP_DIR      = '/opt/paygate'
    }

    stages {
        stage('Pull') {
            steps {
                sh '''
                    cd ${APP_DIR}
                    git pull origin main
                '''
            }
        }

        stage('Build & Deploy') {
            steps {
                sh '''
                    cd ${APP_DIR}
                    docker compose build backend --no-cache
                    docker compose up -d backend
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 10 && curl -sf http://localhost:5001/ServerHealthCheck | grep success'
            }
        }
    }

    post {
        failure {
            echo 'Backend deploy FAILED!'
        }
        success {
            echo 'Backend deploy OK.'
        }
    }
}
