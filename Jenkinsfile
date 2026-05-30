pipeline {
    agent any

    parameters {
        string(
            name: 'BRANCH',
            defaultValue: 'main',
            description: 'Deploy edilecek branch (örn: main, feature/xyz)'
        )
        string(
            name: 'ROLLBACK_TO',
            defaultValue: '',
            description: 'Rollback: önceki commit SHA gir (örn: a1b2c3d). Boş bırakırsan BRANCH deploy edilir.'
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
                    echo "Rolling back to ${IMAGE_NAME}:${tag}"
                    sh """
                        docker image inspect ${IMAGE_NAME}:${tag} > /dev/null 2>&1 || \
                            (echo "HATA: ${IMAGE_NAME}:${tag} image bulunamadi!" && exit 1)
                        docker tag ${IMAGE_NAME}:${tag} ${IMAGE_NAME}:latest
                        ${COMPOSE} up -d backend
                    """
                }
            }
        }

        stage('Pull') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh """
                    cd ${APP_DIR}
                    git fetch origin
                    git checkout ${params.BRANCH}
                    git pull origin ${params.BRANCH}
                """
            }
        }

        stage('Build Image') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                script {
                    env.GIT_SHA = sh(
                        script: "cd ${APP_DIR} && git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    echo "Building ${IMAGE_NAME}:${env.GIT_SHA} from branch ${params.BRANCH}"
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
                sh "${COMPOSE} up -d backend"
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    sleep 10
                    curl -sf https://ceptecash.com/api/ServerHealthCheck | grep -q '"success":true' \
                        && echo "Health check OK" \
                        || (echo "Health check FAILED" && exit 1)
                """
            }
        }

        stage('Cleanup Old Images') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh """
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
                    ? "ROLLBACK to ${params.ROLLBACK_TO}"
                    : "DEPLOY ${params.BRANCH} @ ${env.GIT_SHA}"
                echo "OK: Backend ${version}"
            }
        }
        failure {
            echo 'FAILED — rollback icin ROLLBACK_TO parametresiyle tekrar calistir.'
        }
    }
}
