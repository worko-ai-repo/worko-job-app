
1. Lets say below is the jobs data stored in `opensearch`: 
```json
[
  {
    "experienceRange": {
      "min": 13,
      "max": 20
    }
  },
  {
    "experienceRange": {
      "min": 9,
      "max": 15
    }
  },
  {
    "experienceRange": {
      "min": 11,
      "max": 14
    }
  },
  {
    "experienceRange": {
      "min": 5,
      "max": 6
    }
  }
]
```

2. Candidate's `YOE` is `10` and `YOE` filter is applied and below jobs should retrieve:
```json
[
  {
    "experienceRange": {
      "min": 9,
      "max": 15
    }
  },
  {
    "experienceRange": {
      "min": 5,
      "max": 6
    }
  }
]
```