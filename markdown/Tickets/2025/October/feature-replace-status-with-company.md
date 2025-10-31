
# Production Checklist
1. delete all jobs in `vector db`
2. Query only `status=PUBLISHED` jobs and transfer to `vector db`
```json
GET worko-jobs/_search
{
  "size": 10000,
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "status.keyword": "PUBLISHED"
          }
        }
      ]
    }
  }
}
```

# Code updates
1. If status is `ARCHIVED` or `DRAFT` or `CLOSED` (other than `PUBLISHED`) then delete from `s3 vector`