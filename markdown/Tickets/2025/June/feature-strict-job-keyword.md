
# An OpenSearch index uses a data structure called an inverted index:-
```ts
/**
 * @see https://docs.opensearch.org/docs/latest/getting-started/intro/#inverted-index
 * 
 * @see https://docs.opensearch.org/docs/latest/query-dsl/full-text/match/
 * 
 * @see https://docs.opensearch.org/docs/latest/query-dsl/term/terms/
 * 
 * @see https://docs.opensearch.org/docs/latest/search-plugins/keyword-search/
 */
```

# `CompanyName` schema in opensearch:
```json
"companyName": {
   "fields": {
      "keyword": {
         "type": "keyword",
         "ignore_above": 256
      }
   },
   "type": "text"
}
```

# Old company name filter:-
   1. company filter
   ```json
   {
   "awsOpensearchQuery": {
      "query": {
         "bool": {
         "must": [
            {
               "match": {
               "companyName": "Test neobrim"
               }
            },
            {
               "match": {
               "status": "PUBLISHED"
               }
            }
         ]
         }
      },
      "size": 100,
      "sort": [
         {
         "_script": {
            "order": "desc",
            "script": {
               "lang": "painless",
               "source": "doc.containsKey('companyId.keyword') && !doc['companyId.keyword'].empty ? 1 : 0"
            },
            "type": "number"
         }
         },
         {
         "createdAt": {
            "order": "desc"
         }
         },
         {
         "_id": {
            "order": "desc"
         }
         }
      ]
   }
   }
   ```

   2. Results for above `"companyName": "Test neobrim"` filter
   ```json
   {
   "data": [
      {
         // ......
         "companyName": "TEST WORKO 4.0",
         // ......
      },
      {
         // ......
         "companyName": "NEOBRIM TEST",
         // ......
      },
      {
         // ......
         "companyName": "TEST NEOBRIM",
         // ......
      }
   ],
   "pagination": {
      "count": 3,
      "pageSize": 100
   }
   }
   ```
