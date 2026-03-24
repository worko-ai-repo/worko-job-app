# About The Project
It is a NodeJs based serverless microservice. It serves/facilitates WORKO JOB APP APIS.

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development, testing purposes, and deployment on higher environments.

## Prerequisites
What softwares you need to install for development.
1.  NodeJs with NPM support
2.  AWS CLI
3.  AWS SAM CLI
4.  Docker (required by SAM CLI to simulate Lambda locally)

### Install Docker
SAM CLI uses Docker to run Lambda functions locally. Download and install Docker Desktop from https://www.docker.com/products/docker-desktop and make sure it is running before using `sam local` commands.

## Setup git repository on your local machine
```sh
# Switch to `dev` branch (Note: `dev` branch is development branch)
$ git checkout dev

# Create a feature branch for the task which you are working, for example you are working on `todo-list` application then create branch from `dev` with below name:
$ git checkout -b feature/todo-list dev
```

## Install NPM Packages
```sh
# Install the npm packages based on the "package-lock.json"
$ npm i
```

# Run Application In Your Local Machine
```sh
# Note: Open `docker` before running below command
$ npm run local
```

This will clean the previous build (`.aws-sam`), run a fresh SAM build using esbuild, and start the API locally via `sam local start-api`.

Alternatively, use nodemon for auto-restart on file changes:
```sh
$ npm run local-with-nodemon
```

# AWS CLI Configuration
We need to set up the AWS CLI with multiple profiles in order to execute SAM commands for different environments using the corresponding profile.

First, install the AWS CLI from https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html, then run:

```sh
$ aws configure
```

Get the required credentials for the profiles from the Team. Use the below commands and follow the instructions to set up the profiles.

Each command will prompt for:
- `AWS Access Key ID`
- `AWS Secret Access Key`
- `Default region name` → `ap-south-1`
- `Default output format` → `json`

# Deployment on Higher Environments (Prod)

If you want to deploy the application on the cloud for testing or for live users, please follow the instructions provided below.

The `samconfig.toml` file contains pre-configured deployment parameters for each environment (`dev`, `prod`).

In the example below, we will demonstrate the deployment process for the `prod` environment.

```sh
$ npm i
$ npm run clean
$ npm run build
$ sam deploy --config-env prod --force-upload
```

# CI/CD (AWS CodeCatalyst)

Automated deployments are handled via AWS CodeCatalyst workflows located in `.codecatalyst/workflows/`.

The `Worko-Api-Deployment-Dev-Manual.yaml` workflow:
1. Installs dependencies (`npm i`)
2. Cleans previous build (`npm run clean`)
3. Builds with esbuild via SAM (`npm run build`)
4. Deploys to `dev` using `sam deploy --config-env dev --force-upload`

# Branching
Branch creation flow:
`main` -> `dev` -> `feature/<task-name>`

Branch merging flow:
`main` <- `dev` <- `feature/<task-name>`

