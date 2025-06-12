pipeline {
    agent any
    environment {
        IMAGE_NAME = "localhost:8082/docker-local/tic-tac-toe"
        TAG = "latest"
    }
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${TAG}")
                }
            }
        }
        stage('Push to Nexus') {
            steps {
                script {
                    docker.withRegistry('http://localhost:8082', 'nexus-credentials') {
                        docker.image("${IMAGE_NAME}:${TAG}").push()
                    }
                }
            }
        }
        stage('Deploy to Minikube') {
            steps {
                bat "kubectl rollout restart deployment tic-tac-deploy || kubectl apply -f k8s-deployment.yaml"
            }
        }
    }
}
