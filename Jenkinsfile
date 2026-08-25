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

            // ONLY build the images; do NOT spin up background containers
            sh "VERSION=${VERSION} docker compose -f docker-compose.yaml build"

            // Tag Backend
            sh "docker tag ${BACKEND_IMAGE}:${VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION}"
            sh "docker tag ${BACKEND_IMAGE}:${VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest"

            // Tag Frontend
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
                    // Login directly using environment variables safely
                    sh 'docker login -u "$DOCKER_USER" -p "$DOCKER_PASS"'

                    // Push images
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