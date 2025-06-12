pipeline {
    agent any
    environment {
        IMAGE_NAME = "10.100.102.175:8082/docker-local/tic-tac-toe" 
        TAG = "dev1" 
    }
    stages {
        stage('Build Docker Image') {
            steps {
                bat """
                docker build -t %IMAGE_NAME%:%TAG% .
                """
            }
        }
        stage('Push to Nexus') {
            steps {
                script {
                    docker.withRegistry('http://10.100.102.175:8082', 'nexus-credentials') {
                        docker.image("${env.IMAGE_NAME}:${env.TAG}").push()
                    }
                }
            }
        }
        stage('Deploy to Minikube') {
            steps {
                bat """
                kubectl rollout restart deployment tic-tac-deploy || kubectl apply -f k8s-deployment.yaml
                """
            }
        }
    }
}
