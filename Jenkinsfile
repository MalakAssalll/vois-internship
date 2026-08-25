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
                // withCredentials explicitly binds the password to $DOCKER_PASS in the OS environment
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials', 
                    usernameVariable: 'DOCKER_USER', 
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    // Uses withEnv to guarantee $DOCKER_PASS is present in the Linux subshell
                    sh '''
                        docker login -u "$DOCKER_USER" -p "$DOCKER_PASS"
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION}
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest
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
    }
}