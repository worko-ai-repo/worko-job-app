/**
 * Placeholder parameters for WhatsApp message templates.
 * This interface allows for flexible key-value pairs of placeholder types and their corresponding values.
 *
 * Each key represents the placeholder name, and each value is an object defining the placeholder type and value.
 */
export interface WhatsappPlaceholderParamDto {
  [key: string]: WhatsappPlaceholderTypesDto;
}

/**
 * Details of each placeholder type for WhatsApp messages.
 * This interface defines the structure for individual placeholders within a template.
 *
 * @property {any} type - The type of the placeholder (e.g., 'text', 'image', 'video', etc.). It specifies what kind of content the placeholder will hold.
 * @property {any} value - The actual value to be inserted in place of the placeholder. This can be a string, URL, or other data types depending on the placeholder type.
 */
export interface WhatsappPlaceholderTypesDto {
  /**
   * The type of the placeholder (e.g., 'text', 'image', 'video', etc.).
   * Specifies the content type for the placeholder. It helps in understanding what kind of data should be provided.
   */
  type: any;

  /**
   * The actual value to be inserted in place of the placeholder.
   * This can be a string, URL, or other data types, depending on the type of placeholder.
   */
  value: any;
}

/**
 * Placeholder for the candidate welcome message template.
 * Used when sending an initial welcome message to a new candidate.
 *
 * @template CAND_WELCOME_MSG
 */
export interface WhatsappTemplatePlaceholderCAND_WELCOME_MSG {
  /**
   * The body placeholder, typically containing the candidate's name.
   *
   * @property {string} type - The type of the placeholder, which in this case is 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name.
   */
  body: { type: string; value: string };
}

/**
 * Placeholder for the employee work email verification pending notification template.
 * Used to remind employees to verify their work email.
 */
export interface WhatsappTemplatePlaceholderEMP_WORK_EMAIL_VERIFY_PENDING_NOTIFICATION {
  /**
   * The body placeholder, typically containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body: { type: string; value: string };
}

/**
 * Placeholder for the employee welcome message template.
 * Used when sending an initial welcome message to a new employee.
 */
export interface WhatsappTemplatePlaceholderEMP_WELCOME_MSG {
  /**
   * The body placeholder, typically containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body: { type: string; value: string };
}

/**
 * Placeholder for the candidate reference request accepted notification template.
 * Used to inform a candidate that their reference request has been accepted.
 */
export interface WhatsappTemplatePlaceholderCAND_REF_REQ_ACCEPTED {
  /**
   * The first body placeholder, likely containing the candidate's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, possibly containing the referee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the referee's name.
   */
  body2: { type: string; value: string };

  /**
   * The third body placeholder, potentially containing the job URL.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the job URL.
   */
  body3: { type: string; value: string };

  /**
   * The fourth body placeholder, containing the company name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the company name.
   */
  body4: { type: string; value: string };
}

/**
 * Placeholder for the candidate reference request completed notification template.
 * Used to inform a candidate that their reference check has been completed.
 */
export interface WhatsappTemplatePlaceholderCAND_REF_REQ_COMPLETED {
  /**
   * The first body placeholder, likely containing the candidate's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, possibly containing the referee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the referee's name.
   */
  body2: { type: string; value: string };

  /**
   * The third body placeholder, potentially containing the job URL.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the job URL.
   */
  body3: { type: string; value: string };
}

/**
 * Placeholder for the employee received referral request notification template.
 * Used to notify an employee that they have received a new referral request.
 */
export interface WhatsappTemplatePlaceholderEMP_RECEIVED_REFERRAL_REQ_NOTIFICATION {
  /**
   * The first body placeholder, likely containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, possibly containing the candidate's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name.
   */
  body2: { type: string; value: string };

  /**
   * The third body placeholder, potentially containing the job position.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the job position.
   */
  body3: { type: string; value: string };

  /**
   * The fourth body placeholder, possibly containing a match score.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the match score.
   */
  body4: { type: string; value: string };
}

/**
 * Placeholder for the candidate referral query by employee template.
 * Used when an employee asks a question or seeks clarification about a candidate's referral.
 */
export interface WhatsappTemplatePlaceholderCAND_REFERRAL_QUERY_BY_EMP {
  /**
   * The first body placeholder, likely containing the candidate's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, possibly containing the employee's (referee's) name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body2: { type: string; value: string };

  /**
   * The third body placeholder, potentially containing the query or question.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the query or question.
   */
  body3: { type: string; value: string };
}

/**
 * Placeholder for the employee referral query by candidate template.
 * Used when a candidate asks a question or seeks clarification about their referral to an employee.
 */
export interface WhatsappTemplatePlaceholderEMP_REFERRAL_QUERY_BY_CAND {
  /**
     * The first body placeholder, likely containing the employee's name.
     * 
     * @property {string} type - The type of the placeholder, which is generally 'text'.
     * @property {string} value - The value to be inserted into the template, such as the employee's name
    /**
     * The first body placeholder, likely containing the employee's name.
     * 
     * @property {string} type - The type of the placeholder, which is generally 'text'.
     * @property {string} value - The value to be inserted into the template, such as the employee's name.
     */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, possibly containing the candidate's name or query.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name or their query.
   */
  body2: { type: string; value: string };
}

/**
 * Placeholder for the employee pending accepted referral request notification template.
 * Used to remind employees about referral requests they've accepted but haven't completed.
 */
export interface WhatsappTemplatePlaceholderEMP_PENDING_ACCEPTED_REFERRAL_REQ_NOTIFICATION {
  /**
   * The first body placeholder, likely containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, possibly containing the number of pending requests or a reminder message.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the number of pending requests or a reminder.
   */
  body2: { type: string; value: string };
}

/**
 * Placeholder for the employee pending accepted referral request counts notification template.
 * Used to inform employees about the number of referral requests they've accepted but haven't completed.
 */
export interface WhatsappTemplatePlaceholderEMP_PENDING_ACCEPTED_REFERRAL_REQ_COUNTS_NOTIFICATION {
  /**
   * The first body placeholder, containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, containing the count of pending accepted referral requests.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the count of pending requests.
   */
  body2: { type: string; value: string };
}

/**
 * Placeholder for the employee pending awaiting referral request counts notification template.
 * Used to inform employees about the number of referral requests awaiting their action.
 */
export interface WhatsappTemplatePlaceholderEMP_PENDING_AWAITING_REFERRAL_REQ_COUNTS_NOTIFICATION {
  /**
   * The first body placeholder, containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, containing the count of pending awaiting referral requests.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the count of pending awaiting requests.
   */
  body2: { type: string; value: string };
}

/**
 * Placeholder for the employee new chat message from candidate notification template.
 * Used to notify an employee that they have received a new chat message from a candidate.
 */
export interface WhatsappTemplatePlaceholderEMP_NEW_CHAT_MSG_FROM_CAND_NOTIFICATION {
  /**
   * The first body placeholder, likely containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, possibly containing the candidate's name or a snippet of the message.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name or message snippet.
   */
  body2: { type: string; value: string };
}

/**
 * Placeholder for the candidate new chat message from employee notification template.
 * Used to notify a candidate that they have received a new chat message from an employee (referee).
 */
export interface WhatsappTemplatePlaceholderCAND_NEW_CHAT_MSG_FROM_EMP_NOTIFICATION {
  /**
   * The first body placeholder, containing the candidate's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, containing the referee's (employee's) name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the referee's name.
   */
  body2: { type: string; value: string };
}

/**
 * Placeholder for the employee pending chat message count by candidate notification template.
 * Used to inform employees about the number of unread messages from candidates.
 */
export interface WhatsappTemplatePlaceholderEMP_PENDING_CHAT_MSG_COUNT_BY_CAND_NOTIFICATION {
  /**
   * The first body placeholder, likely containing the employee's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the employee's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, containing the count of pending messages from candidates.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the count of pending messages.
   */
  body2: { type: string; value: string };
}

/**
 * Placeholder for the candidate pending chat message count by employee notification template.
 * Used to inform candidates about the number of unread messages from employees (referees).
 */
export interface WhatsappTemplatePlaceholderCAND_PENDING_CHAT_MSG_COUNT_BY_EMP_NOTIFICATION {
  /**
   * The first body placeholder, likely containing the candidate's name.
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the candidate's name.
   */
  body1: { type: string; value: string };

  /**
   * The second body placeholder, containing the count of pending messages from employees (referees).
   *
   * @property {string} type - The type of the placeholder, which is generally 'text'.
   * @property {string} value - The value to be inserted into the template, such as the count of pending messages from employees.
   */
  body2: { type: string; value: string };
}
