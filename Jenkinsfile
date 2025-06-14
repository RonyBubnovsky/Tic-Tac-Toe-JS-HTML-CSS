pipeline {
    agent any

    environment {
        IMAGE_NAME = '10.100.102.175:8082/docker-local/tic-tac-toe'
        TAG        = "${env.BUILD_NUMBER}"
        NEXUS_API  = 'http://10.100.102.175:8081'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%TAG% .'
            }
        }

        stage('Push to Nexus') {
            steps {
                script {
                    docker.withRegistry('http://10.100.102.175:8082', 'nexus-credentials') {
                        docker.image("${IMAGE_NAME}:${TAG}").push()
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

                    powershell '''
$repo      = "docker-local"
$imageName = "tic-tac-toe"
$keepTag   = $env:BUILD_NUMBER
$baseUrl   = "$env:NEXUS_API/service/rest/v1"

$sec  = ConvertTo-SecureString $env:NEXUS_PASS -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ($env:NEXUS_USER, $sec)

$token = $null
do {
    $u = "$baseUrl/search?repository=$repo&format=docker&docker.imageName=$imageName"
    if ($token) { $u += "&continuationToken=$token" }

    $resp = Invoke-RestMethod -Method Get -Uri $u -Credential $cred -Authentication Basic

    foreach ($c in $resp.items) {
        if ($c.version -ne $keepTag) {
            Write-Host "Deleting ${imageName}:$($c.version)"
            Invoke-RestMethod -Method Delete `
                              -Uri "$baseUrl/components/$($c.id)" `
                              -Credential $cred -Authentication Basic
        }
    }
    $token = $resp.continuationToken
} while ($token)
'''
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                bat '''
                powershell -Command "(Get-Content k8s-deployment.yaml) `
                    -replace 'IMAGE_TAG_TO_REPLACE', '%TAG%' | `
                    Set-Content k8s-deployment.generated.yaml"
                kubectl apply -f k8s-deployment.generated.yaml
                '''
            }
        }
    }
}
