pipeline {
    agent any
    environment {
        IMAGE_NAME = "10.100.102.175:8082/docker-local/tic-tac-toe"
        TAG = "dev1"
    }
    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$TAG ."
            }
        }
        stage('Push to Nexus') {
            steps {
                sh "docker login http://10.100.102.175:8082 -u admin -p 1234"
                sh "docker push $IMAGE_NAME:$TAG"
            }
        }
        stage('Deploy to Minikube') {
            steps {
                sh "kubectl rollout restart deployment tic-tac-deploy || kubectl apply -f k8s-deployment.yaml"
            }
        }
    }
}
