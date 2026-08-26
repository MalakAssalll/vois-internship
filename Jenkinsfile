pipeline {
    agent any

    environment {
        BASE_VERSION   = '1.0'
        VERSION        = "v${BASE_VERSION}.${env.BUILD_NUMBER}"
        
        DOCKERHUB_USER = 'xgenosama'
        BACKEND_IMAGE  = 'todo-backend'
        FRONTEND_IMAGE = 'todo-frontend'
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
                echo "Tagging and pushing images version: ${env.VERSION}"

                // 1. Wrap the commands inside the registry block for secure authentication
                withDockerRegistry(credentialsId: 'dockerhub-credentials') {
                    // 1. build docker container 
                    sh "docker build -t ${BACKEND_IMAGE}:${env.VERSION} ./backend"
                    sh "docker build -t ${FRONTEND_IMAGE}:${env.VERSION} ./frontend"
                    // 2. Tag the Backend Images
                    sh "docker tag ${BACKEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${env.VERSION}"
                    sh "docker tag ${BACKEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest"
                    
                    // 3. Tag the Frontend Images
                    sh "docker tag ${FRONTEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${env.VERSION}"
                    sh "docker tag ${FRONTEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest"

                    // 4. Push Backend Images to Docker Hub
                    sh "docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${env.VERSION}"
                    sh "docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest"

                    // 5. Push Frontend Images to Docker Hub
                    sh "docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${env.VERSION}"
                    sh "docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest"
                }
            }
        }
    }
}
}