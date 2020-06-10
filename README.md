# City of Cape Town Covid-19 Dashboard
This repo is for code relating to the City of Cape Town's Covid-19 response.

## Getting Started
For most of these scripts, you'll need `db-utils` setup: 

`sudo -H pip3 install https://ds2.capetown.gov.za/db-utils/db_utils-0.3.2-py2.py3-none-any.whl`

### Local Development Copy
Sets up a local copy of the deployment env (aka the `covid` bucket) for use in local development.

**Warning**, this replicates the contents of the `covid` bucket in the destination directory, 
hence it might overwrite any content with the same path.

Run [the setup-local](./bin/setup-local.sh) script: 

`./bin/setup-local.sh <path to secrets.json> <path to local dev location>`

The default behaviour is to assume secrets are in `/secrets/secrets.json`, and to setup in `./build`

### Building
This copies the code that this repo is responsible for ([`assets`](./assets), 
[`ct-covid-dash.html`]("./ct-covid-dash.html")]) into the destination dir, and zips it up.

Run [the build-dash.sh](./bin/build-dash.sh) script:

`./bin/build-dash.sh <path to build destination>`

The default behaviour is to copy everything to the `build` directory, then create `covid-19-dashboard.zip` in `./dist`.
**NB** The zip only contains the code that this repo is responsible, i.e. no widgets nor any data will be copied.

### Testing
`#ToDo`

### Deploying
#### Minio Permissions
1. Create the user: `mc admin user add edge <access key e.g. covid-general-read-only> <secret key e.g. blash-fish-ten-59>`
2. Add the permission's policy: `mc admin policy add edge <policy name e.g. getonly-covid-general> <path to policy JSON e.g. resources/get-only-policy-covid-general.json> `
3. Apply the permissions to the user: `mc admin policy set edge <policy name e.g. getonly-covid-general> user=<user name e.g. covid-general-read-only>`

If new permissions need to be added, repeat steps (2) and (3)

#### Kubernetes Secrets
1. Copy the secrets file (e.g. `my-secrets-file.yaml`) to wherever you have access to `kubectl`
2. Create the secrets in the namespace: `kubectl apply --namespace covid-dash -f <path to secrets file e.g. my-secrets-file.yaml>`

#### Deploying the Kubernetes Infrastructure
1. Copy the deployment file (e.g. `resources/covid-dash-general.yaml`) to wherever you have access to `kubectl`
2. Deploy: `kubectl apply --namespace covid-dash -f <path to deployment file e.g. covid-dash-general.yaml>`

#### Removing the Kubernetes Deployment
1. Use the deployment file: `kubectl delete --namespace covid-dash -f <path to deployment file e.g. covid-dash-general.yaml>`