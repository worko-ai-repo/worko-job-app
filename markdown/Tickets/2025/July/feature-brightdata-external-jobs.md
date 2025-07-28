
# Production checklist
1. Check whether `worko-job-batch-inference-update-function` lambda has mapped roles in `AWS Opensearch` or not




```ts
// Fantastic external jobs
S3 > Buckets > `worko-batch-inference-dev/input/fantastic-external-jobs/dd-mm-yyyy/{ulidId}/file-{ulidId}.jsonl`
S3 > Buckets > `worko-batch-inference-dev/output/fantastic-external-jobs/dd-mm-yyyy/{ulidId}/file-{ulidId}.jsonl`

// Bright data external jobs
S3 > Buckets > `worko-batch-inference-dev/input/bright-data-external-jobs/dd-mm-yyyy/{ulidId}/`
S3 > Buckets > `worko-batch-inference-dev/output/bright-data-external-jobs/dd-mm-yyyy/{ulidId}/`
```

```json
[
    {
        "id": "s_mdhdypjy1kj6typw7k",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "failed",
        "created": "2025-07-24T12:45:59.902Z"
    },
    {
        "id": "s_mdftu6y21kdx1ttlzf",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T10:34:50.666Z"
    },
    {
        "id": "s_mdfsnikd261mopqh8r",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 7,
        "created": "2025-07-23T10:01:39.517Z"
    },
    {
        "id": "s_mdfsgexh1wtb8gregi",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1768,
        "cost": 2.66,
        "created": "2025-07-23T09:56:08.213Z"
    },
    {
        "id": "s_mdfsd32u1khdt4pbzu",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1747,
        "cost": 2.63,
        "created": "2025-07-23T09:53:32.886Z"
    },
    {
        "id": "s_mdfscz5ntuv5dy92f",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1785,
        "cost": 2.6799999999999997,
        "created": "2025-07-23T09:53:27.803Z"
    },
    {
        "id": "s_mdfs9sh1fqc7tn7op",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1784,
        "cost": 2.6800000000000006,
        "created": "2025-07-23T09:50:59.173Z"
    },
    {
        "id": "s_mdfrs01r26nz9zwty",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1000,
        "cost": 1.5,
        "created": "2025-07-23T09:37:09.183Z"
    },
    {
        "id": "s_mdfpezjz1n2g8jktyg",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T08:31:02.783Z"
    },
    {
        "id": "s_mdfo6c12113mlab4lp",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T07:56:19.430Z"
    },
    {
        "id": "s_mdfnjl9r2d5sz4bp3d",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T07:38:38.319Z"
    },
    {
        "id": "s_mdfnhekt1769l324vb",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T07:36:56.333Z"
    },
    {
        "id": "s_mdfmmi4qptz0c13bj",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T07:12:54.602Z"
    },
    {
        "id": "s_mdflnrxr1ss1431gdu",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T06:45:54.351Z"
    },
    {
        "id": "s_mdflll0a23unvomkoc",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 0,
        "created": "2025-07-23T06:44:12.058Z"
    },
    {
        "id": "s_mdfk2ufm5aizfsg2i",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T06:01:38.194Z"
    },
    {
        "id": "s_mdfj9sj51xigrgl1s6",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T05:39:02.705Z"
    },
    {
        "id": "s_mdfj5447225dya6hfl",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-23T05:35:24.439Z"
    },
    {
        "id": "s_mdels2yads3jfn6t1",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 5,
        "created": "2025-07-22T14:01:29.074Z"
    },
    {
        "id": "s_mdel32ca2of0t5j8l3",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-22T13:42:01.882Z"
    },
    {
        "id": "s_mdel2cei19fldg70fg",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 4,
        "created": "2025-07-22T13:41:28.266Z"
    },
    {
        "id": "s_mdeko9q61ikfkqf5lv",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 4,
        "created": "2025-07-22T13:30:31.614Z"
    },
    {
        "id": "s_mde8w63h2cavlqlw6m",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 5,
        "created": "2025-07-22T08:00:44.765Z"
    },
    {
        "id": "s_mde87gqa2ndiewwhk1",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 5,
        "created": "2025-07-22T07:41:32.146Z"
    },
    {
        "id": "s_mde70f7uiu17rvrc0",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 5,
        "created": "2025-07-22T07:08:03.978Z"
    },
    {
        "id": "s_mdd3nmxn2r147filfz",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1000,
        "cost": 1.5,
        "created": "2025-07-21T12:46:22.427Z"
    },
    {
        "id": "s_mdcyovso1ujoleicjd",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 108,
        "cost": 0.17,
        "created": "2025-07-21T10:27:22.488Z"
    },
    {
        "id": "s_mdcouoct1wkbice95f",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 86,
        "cost": 0.13,
        "created": "2025-07-21T05:51:56.621Z"
    },
    {
        "id": "s_mdcmrkki14jty8xsnn",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 6,
        "created": "2025-07-21T04:53:32.514Z"
    },
    {
        "id": "s_mdcmi1yl25sv235wlr",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 5,
        "created": "2025-07-21T04:46:08.493Z"
    },
    {
        "id": "s_md8wdkxoitux7a69",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 514,
        "cost": 0.78,
        "created": "2025-07-18T14:11:31.260Z"
    },
    {
        "id": "s_md8u0k1y15crax51m0",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 501,
        "cost": 0.76,
        "created": "2025-07-18T13:05:24.358Z"
    },
    {
        "id": "s_md45vx2n1arql5rmo3",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 40,
        "cost": 0.06,
        "created": "2025-07-15T06:38:52.463Z"
    },
    {
        "id": "s_md45s6wy27u5r9r26t",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 25,
        "cost": 0.04,
        "created": "2025-07-15T06:35:58.594Z"
    },
    {
        "id": "s_md362saq1zic7e09kw",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 25,
        "cost": 0.04,
        "created": "2025-07-14T13:56:26.690Z"
    },
    {
        "id": "s_md35ovw92clv1e7svm",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 20,
        "created": "2025-07-14T13:45:38.169Z"
    },
    {
        "id": "s_md35jknbrf7assdjb",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 10,
        "created": "2025-07-14T13:41:30.311Z"
    },
    {
        "id": "s_mcddgcyx298j99mza8",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1247,
        "cost": 1.88,
        "created": "2025-06-26T12:40:56.745Z"
    },
    {
        "id": "s_mcd4quo0171zpx08xn",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 1097,
        "cost": 1.65,
        "created": "2025-06-26T08:37:09.696Z"
    },
    {
        "id": "s_mbz133cf2i9tnk5thk",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 449,
        "cost": 0.68,
        "created": "2025-06-16T11:45:55.887Z"
    },
    {
        "id": "s_mbz0tplw1ov8rv1xxl",
        "dataset_id": "gd_lpfll7v5hcqtkxl6l",
        "status": "ready",
        "dataset_size": 3,
        "created": "2025-06-16T11:38:38.180Z"
    }
]
```