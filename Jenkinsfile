#!/usr/bin/env groovy

podTemplate(containers: [
    containerTemplate(name: 'cct-datascience-python', image: 'cityofcapetown/datascience:python', ttyEnabled: true, command: 'cat')
  ]) {
    node(POD_LABEL) {
        stage('covid-19-dashboard build') {
            git credentialsId: 'jenkins-user', url: 'https://ds1.capetown.gov.za/ds_gitlab/opm/covid-19-dashboard.git'
            container('cct-datascience-python') {
                    sh label: 'package_script', script: '''#!/usr/bin/env bash
                        set -e
                        ./bin/build-dash.sh
                        '''
            }
            updateGitlabCommitStatus name: 'build', state: 'success'
        }
        stage('covid-19-dashboard build') {
            container('cct-datascience-python') {
                withCredentials([usernamePassword(credentialsId: 'minio-edge-credentials', passwordVariable: 'MINIO_SECRET', usernameVariable: 'MINIO_ACCESS')]) {
                    sh label: 'package_script', script: '''#!/usr/bin/env bash
                      set -e
                      ./bin/minio-upload.sh dist/covid-19-dashboard.zip "application/octet-stream" covid-19-dashboard-deploy
                    '''
                }
            }
            updateGitlabCommitStatus name: 'upload', state: 'success'
        }
        stage('covid-19-dashboard deploy') {
            container('cct-datascience-python') {
                withCredentials([usernamePassword(credentialsId: 'minio-edge-credentials', passwordVariable: 'MINIO_SECRET', usernameVariable: 'MINIO_ACCESS')]) {
                    sh label: 'deploy_script', script: '''#!/usr/bin/env bash
                        set -e
                        ./bin/deploy-dash.sh'''
                }
            }
            updateGitlabCommitStatus name: 'deploy', state: 'success'
        }
    }
}
