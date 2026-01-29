// Import aiplatform package for Batch Jobs
import { JobServiceClient, protos } from "@google-cloud/aiplatform";
type JobServiceClientConfig = ConstructorParameters<typeof JobServiceClient>[0];

// Import sdk configs & secrets
import { awsClientSecretsManagerLibrary } from "../configs/aws-sdk.config";
import { GcpAiplatformSecretResponseDto } from "../dtos/Common.gcp-aiplatform.dto";

// Import utils & types
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * GcpAiPlatformBatchInferenceLibrary
 */
class GcpAiPlatformBatchInferenceLibrary {
  private jobClient?: JobServiceClient;

  constructor() {
    if (
      !process.env.APP_GCP_AI_PLATFORM_BATCH_INFERENCE_LOCATION ||
      !process.env.APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM ||
      !process.env.APP_GCP_PROJECT_ID
    ) {
      global.logger.error(
        `MODEL_NAME or LOCATION is not defined in .env file.`,
        {
          projectId: process.env.APP_GCP_PROJECT_ID,
          awsSecretsManager:
            process.env.APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM,
        }
      );
      throw new BaseError(
        "MODEL_NAME or LOCATION is not defined in .env file.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  // Use specific Batch environment variables to avoid regional conflicts with Embeddings
  private readonly LOCATION = process.env
    .APP_GCP_AI_PLATFORM_BATCH_INFERENCE_LOCATION as string;
  private readonly PROJECT_ID = process.env.APP_GCP_PROJECT_ID as string;

  async initAiPlatformBatchInferenceArguments(): Promise<JobServiceClientConfig> {
    const credentials: GcpAiplatformSecretResponseDto =
      await awsClientSecretsManagerLibrary.getParsedSecret<GcpAiplatformSecretResponseDto>(
        process.env.APP_AWS_SECRETS_MANAGER_GCP_AI_PLATFORM as string
      );
    const config: JobServiceClientConfig = {
      apiEndpoint:
        this.LOCATION === "global"
          ? "aiplatform.googleapis.com"
          : `${this.LOCATION}-aiplatform.googleapis.com`,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    };

    return config;
  }

  private async getAiPlatformJobServiceClient(): Promise<JobServiceClient> {
    if (!this.jobClient) {
      const config: JobServiceClientConfig =
        await this.initAiPlatformBatchInferenceArguments();
      this.jobClient = new JobServiceClient(config);
    }
    return this.jobClient;
  }

  /**
   * Submit a batch job
   * @see https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/batch-prediction-from-cloud-storage#submit
   *
   * Method: batchPredictionJobs.create
   * @see https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.batchPredictionJobs/create
   */
  async createBatchPredictionJob(
    inputGcsUri: string, // "gs://worko-batch-inference-dev/input/bright-data-external-jobs/31-12-2025/01KDSCA5WH7DX632WJPQG105G0/*"
    outputGcsUri: string, // "gs://worko-batch-inference-dev/output/bright-data-external-jobs/31-12-2025/01KDSCA5WH7DX632WJPQG105G0/"
    jobDisplayName: string,

    /**
     * @note
     *  1. publisher model name, for example, "publishers/google/models/gemini-2.5-flash";
     *  2. or the tuned endpoint name, for example, "projects/PROJECT_ID/locations/LOCATION/models/MODEL_ID", where MODEL_ID is the model ID of the tuned model.
     */
    modelPath: string
  ): Promise<{
    input: protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest;
    output: [
      protos.google.cloud.aiplatform.v1.IBatchPredictionJob,
      (
        | protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest
        | undefined
      ),
      {} | undefined
    ];
  }> {
    const client: JobServiceClient = await this.getAiPlatformJobServiceClient();

    /**
     * @see https://docs.cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.batchPredictionJobs#BatchPredictionJob
     */
    const batchPredictionJob: protos.google.cloud.aiplatform.v1.IBatchPredictionJob =
      {
        displayName: jobDisplayName,
        model: modelPath,
        inputConfig: {
          instancesFormat: "jsonl",
          gcsSource: {
            uris: [inputGcsUri],
          },
        },
        outputConfig: {
          predictionsFormat: "jsonl",
          gcsDestination: {
            outputUriPrefix: outputGcsUri,
          },
        },
      };

    const request: protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest =
      {
        /**
         * The resource name of the Location to create the BatchPredictionJob in.
         * @format "projects/{project}/locations/{location}"
         */
        parent: `projects/${this.PROJECT_ID}/locations/${this.LOCATION}`,

        batchPredictionJob,
      };

    /*
    // Sample Output:
    [
      {
        "partialFailures": [],
        "labels": {},
        "name": "projects/136457644871/locations/global/batchPredictionJobs/3015595357129146368",
        "displayName": "01KE6VWVE4FGSCM98WCGCSF7DD",
        "model": "publishers/google/models/gemini-3-pro-preview",
        "inputConfig": {
            "instancesFormat": "jsonl",
            "gcsSource": {
                "uris": [
                    "gs://worko-batch-inference-dev/input/bright-data-external-jobs/05-01-2026/01KE6Q6WD40PPV9XV5DNY7Z4WF/*"
                ]
            },
            "source": "gcsSource"
        },
        "modelParameters": null,
        "outputConfig": {
            "predictionsFormat": "jsonl",
            "gcsDestination": {
                "outputUriPrefix": "gs://worko-batch-inference-dev/output/bright-data-external-jobs/05-01-2026/01KE6Q6WD40PPV9XV5DNY7Z4WF/"
            },
            "destination": "gcsDestination"
        },
        "dedicatedResources": null,
        "manualBatchTuningParameters": null,
        "outputInfo": null,
        "state": "JOB_STATE_PENDING",
        "error": null,
        "resourcesConsumed": null,
        "completionStats": null,
        "createTime": {
            "seconds": "1767609647",
            "nanos": 153838000
        },
        "startTime": null,
        "endTime": null,
        "updateTime": {
            "seconds": "1767609647",
            "nanos": 153838000
        },
        "generateExplanation": false,
        "encryptionSpec": {
            "kmsKeyName": ""
        },
        "explanationSpec": null,
        "instanceConfig": null,
        "unmanagedContainerModel": null,
        "serviceAccount": "",
        "modelVersionId": "1",
        "disableContainerLogging": false,
        "satisfiesPzs": false,
        "satisfiesPzi": false
      },
      null,
      null
    ]
    */
    const output: [
      protos.google.cloud.aiplatform.v1.IBatchPredictionJob,
      (
        | protos.google.cloud.aiplatform.v1.ICreateBatchPredictionJobRequest
        | undefined
      ),
      {} | undefined
    ] = await client.createBatchPredictionJob(request);

    return {
      input: request,
      output,
    };
  }
}

export { GcpAiPlatformBatchInferenceLibrary };
