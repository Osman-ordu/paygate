pipeline {
    agent any

    parameters {
        string(
            name: 'ROLLBACK_TO',
            defaultValue: '',
            description: 'Rollback: önceki commit SHA gir (örn: a1b2c3d). Boş bırakırsan son commit deploy edilir.'
        )
    }

    environment {
        IMAGE_NAME  = 'paygate-backend'
        APP_DIR     = '/opt/paygate'
        COMPOSE     = 'docker compose -f /opt/paygate/docker-compose.yml'
        KEEP_IMAGES = '5'
    }

    stages {

        stage('Rollback') {
            when { expression { params.ROLLBACK_TO?.trim() } }
            steps {
                script {
                    def tag = params.ROLLBACK_TO.trim()
                    echo "⏪ Rolling back to ${IMAGE_NAME}:${tag}"
                    sh """
                        docker image inspect ${IMAGE_NAME}:${tag} > /dev/null 2>&1 || \
                            (echo "HATA: ${IMAGE_NAME}:${tag} image bulunamadı!" && exit 1)
                        docker tag ${IMAGE_NAME}:${tag} ${IMAGE_NAME}:latest
                        ${COMPOSE} up -d backend
                    """
                }
            }
        }

        stage('Pull') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh 'cd ${APP_DIR} && git pull origin main'
            }
        }

        stage('Build Image') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                script {
                    env.GIT_SHA = sh(
                        script: 'cd ${APP_DIR} && git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    echo "🔨 Building ${IMAGE_NAME}:${env.GIT_SHA}"
                    sh """
                        cd ${APP_DIR}
                        docker build -t ${IMAGE_NAME}:${env.GIT_SHA} -t ${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Deploy') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh '${COMPOSE} up -d backend'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Bekleniliyor..."
                    sleep 10
                    curl -sf http://localhost:5001/ServerHealthCheck | grep -q '"success":true' \
                        && echo "✅ Health check OK" \
                        || (echo "❌ Health check FAILED" && exit 1)
                '''
            }
        }

        stage('Cleanup Old Images') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh """
                    echo "Son ${KEEP_IMAGES} image tutuluyor..."
                    docker images ${IMAGE_NAME} --format '{{.Tag}}' \
                        | grep -v latest \
                        | tail -n +\$(( ${KEEP_IMAGES} + 1 )) \
                        | xargs -r -I{} docker rmi ${IMAGE_NAME}:{} || true
                """
            }
        }
    }

    post {
        success {
            script {
                def version = params.ROLLBACK_TO?.trim()
                    ? "ROLLBACK → ${params.ROLLBACK_TO}"
                    : "DEPLOY  → ${env.GIT_SHA}"
                echo "✅ Backend ${version}"
            }
        }
        failure {
            echo '❌ Pipeline FAILED — önceki versiyona dönmek için ROLLBACK_TO parametresiyle tekrar çalıştır.'
        }
    }
}
