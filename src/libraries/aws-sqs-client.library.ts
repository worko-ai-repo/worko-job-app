// NPM packages
import AWS from "aws-sdk";

/**
 * AwsSqsClientLibrary
 *
 * This library is a wrapper library for AWS SQS service that has regularly used methods.
 * Feel free to enhance this as needed.
 */
class AwsSqsClientLibrary {
  /**
   * sqs
   *
   * AWS SQS object to perform SQS related operations.
   */
  private sqs: AWS.SQS;

  /**
   * constructor
   *
   * @param {AWS.SQS.ClientConfiguration} config
   */
  constructor(private config: AWS.SQS.ClientConfiguration) {
    this.sqs = new AWS.SQS(this.config);

    // Log message
    console.log(`The '${AwsSqsClientLibrary.name}' is initialised."`, {
      filePath: __filename,
    });
  }

  /**
   * updateConfig
   *
   * Update the AWS SQS configuration
   *
   * @param {AWS.SQS.ClientConfiguration} config
   * @returns {void}
   */
  updateConfig(config: AWS.SQS.ClientConfiguration): void {
    this.config = config;
    this.sqs = new AWS.SQS(config);
  }

  /**
   * ********************************************************************************************************************************************
   * Manage Sending Messages
   * ********************************************************************************************************************************************
   */

  /**
   * sendMessage
   * 
   * Send a message to an SQS queue
   * 
   * @param {string} queueUrl 
   * @param {string} messageBody 
   * @param {number} [delaySeconds] 
   * @returns {Promise<AWS.SQS.SendMessageResult>}
   */
  async sendMessage(queueUrl: string, messageBody: string, delaySeconds?: number): Promise<AWS.SQS.SendMessageResult> {
    const params: AWS.SQS.SendMessageRequest = {
      ...(delaySeconds && { DelaySeconds: delaySeconds }),
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    };

    // Logger message
    global.logger.info("Sending message to SQS queue (data).", {
      filePath: __filename,
      methodName: this.sendMessage.name,
      queueUrl: queueUrl,
      messageBody: messageBody,
      delaySeconds: delaySeconds,
    });

    return this.sqs.sendMessage(params).promise();
  }

  /**
   * ********************************************************************************************************************************************
   * Manage Receiving Messages
   * ********************************************************************************************************************************************
   */

  /**
   * receiveMessages
   * 
   * Receive messages from an SQS queue
   * 
   * @param {string} queueUrl 
   * @param {number} [maxNumberOfMessages=1] 
   * @param {number} [waitTimeSeconds=0] 
   * @returns {Promise<AWS.SQS.ReceiveMessageResult>}
   */
  async receiveMessages(queueUrl: string, maxNumberOfMessages: number = 1, waitTimeSeconds: number = 0): Promise<AWS.SQS.ReceiveMessageResult> {
    const params: AWS.SQS.ReceiveMessageRequest = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: maxNumberOfMessages,
      WaitTimeSeconds: waitTimeSeconds,
    };

    // Logger message
    global.logger.info("Receiving messages from SQS queue (data).", {
      filePath: __filename,
      methodName: this.receiveMessages.name,
      queueUrl: queueUrl,
      maxNumberOfMessages: maxNumberOfMessages,
      waitTimeSeconds: waitTimeSeconds,
    });

    return this.sqs.receiveMessage(params).promise();
  }

  /**
   * ********************************************************************************************************************************************
   * Manage Deleting Messages
   * ********************************************************************************************************************************************
   */

  /**
   * deleteMessage
   * 
   * Delete a message from an SQS queue
   * 
   * @param {string} queueUrl 
   * @param {string} receiptHandle 
   * @returns {Promise<{}>}
   */
  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<{}> {
    const params: AWS.SQS.DeleteMessageRequest = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    // Logger message
    global.logger.info("Deleting message from SQS queue (data).", {
      filePath: __filename,
      methodName: this.deleteMessage.name,
      queueUrl: queueUrl,
      receiptHandle: receiptHandle,
    });

    return this.sqs.deleteMessage(params).promise();
  }

  /**
   * ********************************************************************************************************************************************
   * Manage Queue Operations
   * ********************************************************************************************************************************************
   */

  /**
   * purgeQueue
   * 
   * Purge all messages from an SQS queue
   * 
   * @param {string} queueUrl 
   * @returns {Promise<{}>}
   */
  async purgeQueue(queueUrl: string): Promise<{}> {
    const params: AWS.SQS.PurgeQueueRequest = {
      QueueUrl: queueUrl,
    };

    // Logger message
    global.logger.warn("Purging SQS queue (data).", {
      filePath: __filename,
      methodName: this.purgeQueue.name,
      queueUrl: queueUrl,
    });

    return this.sqs.purgeQueue(params).promise();
  }

  /**
   * getQueueUrl
   * 
   * Get the URL of an SQS queue
   * 
   * @param {string} queueName 
   * @returns {Promise<string>}
   */
  async getQueueUrl(queueName: string): Promise<string> {
    const params: AWS.SQS.GetQueueUrlRequest = {
      QueueName: queueName,
    };

    // Logger message
    global.logger.info("Getting SQS queue URL (data).", {
      filePath: __filename,
      methodName: this.getQueueUrl.name,
      queueName: queueName,
    });

    const result = await this.sqs.getQueueUrl(params).promise();
    if (!result.QueueUrl) {
      throw new Error(`Queue URL not found for queue name: ${queueName}`);
    }
    return result.QueueUrl;
  }

  /**
   * createQueue
   * 
   * Create a new SQS queue
   * 
   * @param {string} queueName 
   * @param {AWS.SQS.CreateQueueRequest["Attributes"]} [attributes] 
   * @returns {Promise<AWS.SQS.CreateQueueResult>}
   */
  async createQueue(queueName: string, attributes?: AWS.SQS.CreateQueueRequest["Attributes"]): Promise<AWS.SQS.CreateQueueResult> {
    const params: AWS.SQS.CreateQueueRequest = {
      QueueName: queueName,
      Attributes: attributes,
    };

    // Logger message
    global.logger.info("Creating new SQS queue (data).", {
      filePath: __filename,
      methodName: this.createQueue.name,
      queueName: queueName,
      attributes: attributes,
    });

    return this.sqs.createQueue(params).promise();
  }
}

export { AwsSqsClientLibrary }