pipeline {
    agent any

    environment {
        REGISTRY = "10.100.102.175:8082"
        IMAGE    = "${REGISTRY}/tic-tac-toe:${env.BUILD_NUMBER}"
    }

    stages {

        stage('Ensure kubectl exists') {
            steps {
                sh '''
                    if ! command -v kubectl >/dev/null 2>&1; then
                      URL=$(curl -sL https://dl.k8s.io/release/stable.txt)
                      curl -sL -o kubectl "https://dl.k8s.io/release/${URL}/bin/linux/amd64/kubectl"
                      install -m 0755 kubectl /usr/local/bin/kubectl
                      rm kubectl
                    fi
                '''
            }
        }

        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Docker image') {
            steps { sh "docker build -t ${IMAGE} ." }
        }

        stage('Push to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-docker',
                                                  usernameVariable: 'USER',
                                                  passwordVariable: 'PASS')]) {
                    sh '''
                        echo "$PASS" | docker login 10.100.102.175:8082 -u "$USER" --password-stdin
                        docker push "$IMAGE"
                    '''
                }
            }
        }

   stage('Deploy to Minikube') {
    steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KCFG')]) {
            sh """
                export KUBECONFIG=\$KCFG
                PORT=\$(grep -oE 'host.docker.internal:[0-9]+' \$KCFG | cut -d: -f2)
                kubectl --server=https://host.docker.internal:\$PORT --insecure-skip-tls-verify apply -f k8s/deployment.yaml
                kubectl --server=https://host.docker.internal:\$PORT --insecure-skip-tls-verify set image deployment/tic-tac-deploy tic-tac-container=${IMAGE} --record
            """
        }
    }
}
    }
}
