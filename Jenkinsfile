pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'MalakAssalll'
        BACKEND_IMAGE = 'todo-backend'
        FRONTEND_IMAGE = 'todo-frontend' // Added Frontend Image Name
        
        // Offset BUILD_NUMBER so Build #1 starts at v1.0.2
        VERSION_TAG = "v1.0.${env.BUILD_NUMBER.toInteger() + 1}"
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
                    echo "Building images version: ${VERSION_TAG}"
                    
                    // Spins up both frontend and backend
                    sh 'docker compose up -d --build'
                    
                    // Tag Backend
                    sh "docker tag ${BACKEND_IMAGE}:latest ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION_TAG}"
                    sh "docker tag ${BACKEND_IMAGE}:latest ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest"

                    // Tag Frontend
                    sh "docker tag ${FRONTEND_IMAGE}:latest ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${VERSION_TAG}"
                    sh "docker tag ${FRONTEND_IMAGE}:latest ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                // Runs backend tests inside running container
                sh 'docker compose exec -T backend npm test'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        
                        # Push Backend
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:${VERSION_TAG}
                        docker push ${DOCKERHUB_USER}/${BACKEND_IMAGE}:latest

                        # Push Frontend
                        docker push ${DOCKERHUB_USER}/${FRONTEND_IMAGE}:${VERSION_TAG}
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
            echo "Successfully built, tested, and published version ${VERSION_TAG} to Docker Hub!"
        }
        failure {
            echo "Pipeline failed for version ${VERSION_TAG}."
        }
    }
}