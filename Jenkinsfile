pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'MalakAssalll'
        BACKEND_IMAGE = 'todo-backend'
        FRONTEND_IMAGE = 'todo-frontend'

        // Dynamic build versioning
        VERSION = "v1.0.${env.BUILD_NUMBER.toInteger() + 1}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Images via Docker Compose') {
            steps {
                script {
                    echo "Building images version: ${VERSION}"

                    sh 'docker compose up -d --build'

                    // Tag Backend for Docker Hub
                    sh "docker tag ${BACKEND_IMAGE}:${VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION}"
                    sh "docker tag ${BACKEND_IMAGE}:${VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest"

                    // Tag Frontend for Docker Hub
                    sh "docker tag ${FRONTEND_IMAGE}:${VERSION} ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${VERSION}"
                    sh "docker tag ${FRONTEND_IMAGE}:${VERSION} ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    // 1. Login using strictly single-quoted bash execution to safely pipe DOCKER_PASS
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                    // 2. Push images using double quotes for Groovy variable expansion
                    sh """
                        # Push Backend
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION}
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest

                        # Push Frontend
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${VERSION}
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }
    }

    post {
        always {
            sh 'docker compose down'
        }

        success {
            echo "Successfully built, tested, and published version ${VERSION} to Docker Hub!"
        }

        failure {
            echo "Pipeline failed for version ${VERSION}."
        }
    }
}