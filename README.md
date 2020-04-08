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
`#ToDo`