#!/usr/bin/env groovy

podTemplate(containers: [
    containerTemplate(name: 'cct-datascience-python', image: 'cityofcapetown/datascience:python', ttyEnabled: true, command: 'cat')
    containerTemplate(name: 'cct-airflow', image: 'cityofcapetown/airflow', command: "cat", ttyEnabled: true, livenessProbe: containerLivenessProbe(initialDelaySeconds: 120))
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
        stage('covid-19-dashboard upload') {
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
        stage('covid-19-dashboard dags validate') {
            git credentialsId: 'jenkins-user', url: 'https://ds1.capetown.gov.za/ds_gitlab/opm/covid-19-dashboard.git'
            container('cct-airflow') {
                sh '''#!/usr/bin/env bash
                  set -e
                  for dag_file in $(ls dags/); do
                    echo "Testing "$dag_file"..."
                    python3 dags/"$dag_file"
                  done
                  '''
            }
            updateGitlabCommitStatus name: 'dags-validate', state: 'success'
        }
        stage('covid-19-dashboard dags commit') {
            container('cct-datascience-python') {
                withCredentials([usernamePassword(credentialsId: 'jenkins-user', passwordVariable: 'JENKINS_PASSWORD', usernameVariable: 'JENKINS_USERNAME')]) {
                    sh label: 'dags_commit_script', script: '''#!/usr/bin/env bash
                        current_commit=$(git rev-parse HEAD)

                        git config --global credential.helper store
                        echo "https://"$JENKINS_USERNAME":"$JENKINS_PASSWORD"@ds1.capetown.gov.za" > ~/.git-credentials

                        cd ..
                        git clone "https://ds1.capetown.gov.za/ds_gitlab/OPM/airflow-dags.git"
                        cp covid-19-dashboard/dags/*.py airflow-dags/
                        cd airflow-dags
                        git add *
                        git config --global user.email "opm.data@capetown.gov.za"
                        git config --global user.name "JenkinsCI"
                        git commit -a -m "Automated commit by covid-19 dashboard pipeline (https://ds1.capetown.gov.za/ds_gitlab/opm/covid-19-dashboard/commit/"$current_commit")"
                        git push --set-upstream origin master
                        exit $?'''
                }
            }
            updateGitlabCommitStatus name: 'dags-commit', state: 'success'
        }
    }
}
