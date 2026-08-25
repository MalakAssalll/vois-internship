pipeline {
    agent any

    environment {
        BASE_VERSION   = '1.0'
        VERSION        = "v${BASE_VERSION}.${env.BUILD_NUMBER}"
        
        DOCKERHUB_USER = 'MalakAssalll'
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
                    echo "Building images version: ${env.VERSION}"
                    sh "VERSION=${env.VERSION} docker compose -f docker-compose.yaml build"

                    sh "docker tag ${BACKEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${env.VERSION}"
                    sh "docker tag ${BACKEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest"

                    sh "docker tag ${FRONTEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${env.VERSION}"
                    sh "docker tag ${FRONTEND_IMAGE}:${env.VERSION} ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest"
                }
            }
        }

      stage('Push to Docker Hub') {
    steps {
          withDockerRegistry(credentialsId: 'dockerhub-credentials', url: '') {
        
        sh "docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${env.VERSION}"
        sh "docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest"
         sh "docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${env.VERSION}"
        sh "docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest"
        
    }
        }
    }
}
    }

    post {
        always {
            sh 'docker compose down'
        }
    }
}