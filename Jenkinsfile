pipeline {
    agent any

    environment {
        REGISTRY = "10.100.102.175:8082"
        IMAGE    = "${REGISTRY}/tic-tac-toe:${env.BUILD_NUMBER}"
        KCFG     = credentials('kubeconfig')
    }

    stages {
        stage('Ensure kubectl exists') {
            steps {
                sh '''
                  if ! command -v kubectl >/dev/null 2>&1 ; then
                    echo "▶ Installing kubectl..."
                    curl -sLO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                    install -m 0755 kubectl /usr/local/bin/kubectl
                    rm kubectl
                  else
                    echo "✔ kubectl already present"
                  fi
                '''
            }
        }

        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Docker image') {
            steps {
                sh "docker build -t ${IMAGE} ."
            }
        }

        stage('Push to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-docker',
                                                  usernameVariable: 'USER',
                                                  passwordVariable: 'PASS')]) {
                    sh '''
                      echo "$PASS" | docker login 10.100.102.175:8082 -u "$USER" --password-stdin
                      docker push '${IMAGE}'
                    '''
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                writeFile file: 'kubeconfig', text: KCFG
                sh """
                  export KUBECONFIG=$PWD/kubeconfig
                  sed -i 's#tic-tac-toe:latest#tic-tac-toe:${BUILD_NUMBER}#' k8s/deployment.yaml
                  kubectl apply -f k8s/deployment.yaml
                """
            }
        }
    }
}
