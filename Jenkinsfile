pipeline {
    agent any

    environment {
        IMAGE_NAME = "10.100.102.175:8082/docker-local/tic-tac-toe"
        TAG        = "${env.BUILD_NUMBER}"
        NEXUS_URL  = "http://10.100.102.175:8082"
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

        stage('Cleanup old images in Nexus') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'nexus-credentials',
            usernameVariable: 'NEXUS_USER',
            passwordVariable: 'NEXUS_PASS')]) {

            powershell """
            \$repo      = 'docker-local'
            \$imageName = 'tic-tac-toe'
            \$keepTag   = '${BUILD_NUMBER}'
            \$baseUrl   = '${NEXUS_URL}/service/rest/v1'

            \$b64 = [Convert]::ToBase64String(
                    [Text.Encoding]::ASCII.GetBytes('${NEXUS_USER}:${NEXUS_PASS}'))
            \$headers = @{ Authorization = \"Basic \$b64\" }

            \$token = \$null
            do {
                \$search = \"\$baseUrl/search?repository=\$repo&format=docker\" +
                           \"&docker.imageName=\$imageName\"
                if (\$token) { \$search += \"&continuationToken=\$token\" }

                \$resp = Invoke-RestMethod -Uri \$search -Headers \$headers -Method Get

                foreach (\$comp in \$resp.items) {
                    if (\$comp.version -ne \$keepTag) {
                        Write-Host \"Deleting \$imageName:\$([\$comp.version])\"
                        Invoke-RestMethod -Uri \"\$baseUrl/components/\$([\$comp.id])\" `
                                          -Headers \$headers -Method Delete
                    }
                }
                \$token = \$resp.continuationToken
            } while (\$token)
            """
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
