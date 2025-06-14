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
                withCredentials([
                    usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS')
                ]) {
                    powershell '''
                    $repo      = "docker-local"
                    $imageName = "tic-tac-toe"
                    $keepTag   = $env:BUILD_NUMBER
                    $baseUrl   = "$env:NEXUS_URL/service/rest/v1"

                    $continue = $null
                    do {
                        $url = "$baseUrl/search?repository=$repo&name=$imageName"
                        if ($continue) { $url = "$url&continuationToken=$continue" }

                        $resp = Invoke-RestMethod -Method Get -Uri $url `
                                -Credential (New-Object pscredential(
                                    $env:NEXUS_USER,
                                    (ConvertTo-SecureString $env:NEXUS_PASS -AsPlainText -Force)))

                        foreach ($c in $resp.items) {
                            if ($c.version -ne $keepTag) {
                                Write-Host "Deleting $($c.name):$($c.version)"
                                Invoke-RestMethod -Method Delete `
                                    -Uri "$baseUrl/components/$($c.id)" `
                                    -Credential (New-Object pscredential(
                                        $env:NEXUS_USER,
                                        (ConvertTo-SecureString $env:NEXUS_PASS -AsPlainText -Force)))
                            }
                        }
                        $continue = $resp.continuationToken
                    } while ($continue)
                    '''
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
