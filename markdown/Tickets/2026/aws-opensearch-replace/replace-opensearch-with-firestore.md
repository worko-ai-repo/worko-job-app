
# Job listing Approaches and challenges in candidate dashboard
   ## Use Case:
   1. `Non-loggedin user`
      1. whenever user landed to the jobs page we will list all the `published` jobs from `gcp firestore` in `createdAt` sort order
      2. whenever user applies filters other than `refer a friend` then we will retrieve from `aws s3 vector`
   2. `Loggedin user`:
      1. whenever user landed to jobs page we will list all `published` jobs from `aws s3 vector` with default filters like `coreSkills, YOE`
      2. whenever user applies filters other than `refer a friend` then we will retrieve from `aws s3 vector`

   ## Challenges:
   1. whenever user apply `refer a friend` job and applies other filter then we cannot use `gcp firestore` like we used `aws opensearch` earlier because `gcp firestore` is not flexible with those many filters
   ## Possible Solutions
   1. we should remove `department` attribute from `aws s3 vector` and store `companyId` 
      1. Then we can use combination of `refer a friend` and other filters from `aws s3 vector`
