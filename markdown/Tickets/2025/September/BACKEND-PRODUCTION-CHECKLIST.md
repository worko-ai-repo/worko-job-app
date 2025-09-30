
# Production checklist
1. Take a latest pull from `dev` branch of `worko-job-app` repository and perform `npm install`
2. Populate `.env.prod` to `.env` 
3. `worko-auth` lambda
4. Transfer jobs from `Aws opensearch` to `Aws s3 vector` 
5. Take a latest pull from `feature/rohith-cand-dash-new-1` branch of `worko-api` repository and perform `npm install`
6. Create `worko-resume-signup-skills-parser-prod` lambda function in `prod` by checking with `shaukat`
7. Check below are created in `aws` by checking with `arup`
```sh
"worko-job-index-prod"
"worko-vector-store-job-crud-prod"
"worko-vector-store-job-search-prod"
```