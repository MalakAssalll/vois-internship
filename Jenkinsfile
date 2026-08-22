
pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'MalakAssalll'
        BACKEND_IMAGE = 'todo-backend'
        FRONTEND_IMAGE = 'todo-frontend'

        // Build #1 → v1.0.2
        // Build #2 → v1.0.3
        // Build #3 → v1.0.4
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

                    // VERSION is automatically available to Docker Compose
                    // Compose will build:
                    // todo-backend:${VERSION}
                    // todo-frontend:${VERSION}
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
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                        # Push Backend
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION}
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest

                        # Push Frontend
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${VERSION}
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest
                    '''
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
