# About The Project
It is is NodeJs based serverless microservice. It serves/facilitates WORKO JOB APP APIS.

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development, testing purposes, and deployment on higher environments.

## Prerequisites
What softwares you need to install for development.
1.  NodeJs with NPM support
2.  NoSQL Workbench
3.  AWS CLI

## Setup git repository on your local machine
```sh
# Clone git repository
$ git clone command with git url

# Take pull from the remote `master` branch (Note: We should never use `master` branch for development purpose)
$ git pull origin master

# Switch to `dev` branch (Note: `dev` branch is development branch)
$ git checkout dev
```

## Local Environment Variables
```sh
# Copy the "environments/.env.local" content into ".env" file
$ cp environments/.env.local .env
```

After copying the environment configurations, review the configurations, update them as per your local environment.

## Install NPM Packages
```sh
# Install the npm packages based on the "package.lock"
$ npm ci
```

# AWS CLI Configuration
We need to set up the AWS CLI with multiple profiles in order to execute serverless commands for different environments using the corresponding profile.

Get the required credentials for the profiles from the Team. Use the below commands and follow the instruction to setup the profiles.

```sh
# Setup the "worko-dev-serverless-cli-admin-access" profile for "local" and "development" environments.
$ aws configure --profile worko-dev-serverless-cli-admin-access

# Setup the "worko-prod-serverless-cli-admin-access" profile for "production" environment.
$ aws configure --profile worko-prod-serverless-cli-admin-access
```

# Deployment on Local (Offline)

If you need to deploy the application offline for testing purposes during your development process, please refer to the instructions provided below.
These instructions can also be applied to serve the application offline for any specified environment by specifying the relevant options or parameters.

In the following example, we will demonstrate the steps for the `local` environment.

```sh
# Copy the specified environment file content to the ".env" file.
$ cp environments/.env.local .env

# Deploy the application on offline for the "local" environemnt.
$ npm run sls:offline -- --stage=local --aws-profile=worko-dev-serverless-cli-admin-access
```

# Deployment on Higher Environments (Dev)

If you want to deploy the application on the cloud for testing or for live users, please follow the instructions provided below to carry out the deployment process.

Similarly, if you want to deploy the application on the cloud for any specific environment, you can follow the same instructions with the relevant options or parameters.

In the example below, we will demonstrate the deployment process for the `dev` environment.

```sh
# Copy the specified environment file content to the ".env" file.
$ cp environments/.env.dev .env

# Get the deployment list for the provided stage
$ sls deploy list --stage=dev --aws-profile=worko-dev-serverless-cli-admin-access

# Deploy the applications on the cloud for different non local environments to access the APIs globally
$ npm run sls:deploy -- --stage=dev --aws-profile=worko-dev-serverless-cli-admin-access
```

# Serverless Commads

```sh
# Get recent deployment details like endpoints, aws details, etc.
$ sls info --stage={stage} --aws-profile={stageAwsProfile}

# Get the deployment list for the provided stage
$ sls deploy list --stage={stage} --aws-profile={stageAwsProfile}

# Rollback to the build associated with the provided timestamp
$ serverless rollback --stage={stage} --aws-profile={stageAwsProfile} --timestamp={buildTimestamp}

# Print active environment variable and serverless.ts config with parsed values.
$ sls print
```

# Branching

We have two main branches `master` and `dev`.

-   `master`

    -   This is the main branch of this repository, you can refer it as the release branch
    -   So we should use this only for the release purpose, not for development purpose
    -   We should be very careful while merging any code to this branch

-   `dev`

    -   This is the dev branch of this repository, you can use this for development purpose
    -   Anything which is finalized by QA can be merged into `dev` then on release date `dev` branch will be merged to `master` branch and then `master` will be deployed to the `prod` environment

Branch creation flow:
`master` -> `dev` -> `TAK-BRANCH`

Branch merging flow:
`master` <- `dev` <- `TAK-BRANCH`

# Environments

-   As of now we are supporting the following environment for different purposes
    -   `local`, for local development and testing.
    -   `dev`, for the Dev and QA team to verifiy the changes are working fine on the "development" environment.
    -   `prod`, for the production/live environment.
-   The configurations for the different environments needs to be reviewed before deployment and it should be upto date.

# Patterns / Naming Conventions

# Kind suggestions

-   Follow fix coding standard
-   Use tools from your editor to format your code (Typscript)
-   Try to use your editor's shortcuts to speedup the development process
-   Connect with your team member if you find any difficulty in development or environment
