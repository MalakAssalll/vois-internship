pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = 'MalakAssalll'
        BACKEND_IMAGE   = 'todo-backend'
        FRONTEND_IMAGE  = 'todo-frontend'
        VERSION         = "v1.0.${env.BUILD_NUMBER}"
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

                    // Pass VERSION environment variable directly into docker compose build
                    sh "VERSION=${VERSION} docker compose -f docker-compose.yaml build"

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
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    
                    sh """
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION}
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${VERSION}
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }
    }

    post {
        always {
            // Remove locally generated build artifacts to clear disk space on agent
            sh "docker rmi ${BACKEND_IMAGE}:${VERSION} ${FRONTEND_IMAGE}:${VERSION} || true"
        }
        success {
            echo "Successfully built and published version ${VERSION} to Docker Hub."
        }
        failure {
            echo "Pipeline failed for version ${VERSION}."
        }
    }
}