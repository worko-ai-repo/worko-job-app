
# Prod checklist
1. Create `GSI3` index in `worko-job-app` table
2. Deploy this `feature branch` and after Running script to update old all job applications with new `GSI3` index then we Need to make `required:true`
```ts
  GSI3PK?: string;
  GSI3SK?: string;
```
```ts
    GSI3PK: {
      type: String,
      index: {
        name: "GSI3",
        type: "global",
        rangeKey: "GSI3SK",
      },
      required: false,
    },
    GSI3SK: {
      type: String,
      index: {
        name: "GSI3",
        type: "global",
      },
      required: false,
    },
```
3. And merge this code to `dev` 
4. Tell Angular team to deploy the branch for `matching score` listing to corp b/w `70` to `89`
5. And deploy `dev` branch of `worko-job-app` to `prod`
