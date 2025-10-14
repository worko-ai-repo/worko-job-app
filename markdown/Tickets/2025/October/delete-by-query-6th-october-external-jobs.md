
```json
// Query to retrieve bright data external jobs on between `2025-10-06T22:30:31.544+05:30` and  `createdAt` date

// POST worko-jobs/_delete_by_query
// GET worko-jobs/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "externalJobId"
          }
        },
        {
          "term": {
            "sourcedFrom.keyword": "BRIGHT_DATA_JOB"
          }
        },
        {
          "range": {
            "createdAt": {
              "gte": "2025-10-06T17:00:31.544Z", 
              "lte": "2025-10-06T17:47:42.835Z"
            }
          }
        }
      ]
    }
  }
}
```
