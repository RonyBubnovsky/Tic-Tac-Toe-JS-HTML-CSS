pipeline {
    agent any
    environment {
        IMAGE_NAME = "10.100.102.175:8082/docker-local/tic-tac-toe"
        TAG = "${env.BUILD_NUMBER}"
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
                powershell -Command "(Get-Content k8s-deployment.yaml).replace('IMAGE_TAG_TO_REPLACE', '%TAG%') | Set-Content k8s-deployment.generated.yaml"
                kubectl apply -f k8s-deployment.generated.yaml
                """
            }
        }
    }
}
