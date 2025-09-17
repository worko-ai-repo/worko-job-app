import { WhatsappMessageTypeCloudApiEnum } from "../enums/WhatsappMessageLog.enum";
import {
  WhatsappWebhookConversationOriginTypeCloudApiEnum,
  WhatsappWebhookMessageStatusTypeCloudApiEnum,
  WhatsappWebhookPricingCategoryTypeCloudApiEnum,
} from "../enums/WhatsappWebhook.enum";

/**
 * Represents the main structure of a WhatsApp webhook event.
 */
export interface WhatsappWebhookEventCloudApiDto {
  /** The object type, typically "whatsapp_business_account" */
  object: string;
  /** An array of entries containing changes */
  entry: WhatsappWebhookEntryCloudApi[];
}

/**
 * Represents a single entry in the webhook event.
 */
export interface WhatsappWebhookEntryCloudApi {
  /** The ID of the WhatsApp Business Account */
  id: string;
  /** An array of changes associated with this entry */
  changes: WhatsappWebhookChangeCloudApiDto[];
}

/**
 * Represents a change within a webhook entry.
 */
export interface WhatsappWebhookChangeCloudApiDto {
  /** The value object containing detailed information about the change */
  value: WhatsappWebhookValueCloudApiDto;
  /** The field that changed, typically "messages" */
  field: string;
}

/**
 * Contains the core information about a webhook event.
 */
export interface WhatsappWebhookValueCloudApiDto {
  /** Conversation information */
  conversation: any;
  /** The messaging product, typically "whatsapp" */
  messaging_product: string;
  /** Metadata about the WhatsApp Business Account */
  metadata: WhatsappWebhookMetadataCloudApiDto;
  /** Optional array of contacts involved in the event */
  contacts?: WhatsappWebhookContactCloudApiDto[];
  /** Optional array of messages in the event */
  messages?: WhatsappWebhookMessageCloudApiDto[];
  /** Optional array of message statuses */
  statuses?: WhatsappWebhookStatusCloudApiDto[];
}

/**
 * Contains metadata about the WhatsApp Business Account.
 */
export interface WhatsappWebhookMetadataCloudApiDto {
  /** The display phone number of the WhatsApp Business Account */
  display_phone_number: string;
  /** The ID of the phone number */
  phone_number_id: string;
}

/**
 * Represents a contact in a WhatsApp webhook event.
 */
export interface WhatsappWebhookContactCloudApiDto {
  /** The contact's profile information */
  profile: {
    /** The name of the contact */
    name: string;
  };
  /** The WhatsApp ID of the contact */
  wa_id: string;
}

/**
 * Represents a message in a WhatsApp webhook event.
 */
export interface WhatsappWebhookMessageCloudApiDto {
  /** The sender's phone number */
  from: string;
  /** The unique ID of the message */
  id: string;
  /** The timestamp when the message was sent */
  timestamp: string;
  /** The type of the message */
  type: WhatsappMessageTypeCloudApiEnum;
  /** Optional text content of the message */
  text?: {
    body: string;
  };
  /** Optional reaction information */
  reaction?: {
    message_id: string;
    emoji: string;
  };
  /** Optional image attachment */
  image?: WhatsappWebhookMediaCloudApiDto;
  /** Optional video attachment */
  video?: WhatsappWebhookMediaCloudApiDto;
  /** Optional audio attachment */
  audio?: WhatsappWebhookMediaCloudApiDto;
  /** Optional document attachment */
  document?: WhatsappWebhookMediaCloudApiDto;
  /** Optional sticker attachment */
  sticker?: WhatsappWebhookMediaCloudApiDto;
  /** Optional location information */
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  /** Optional array of contacts shared in the message */
  contacts?: WhatsappWebhookContactCloudApiDto[];
  /** Optional button information for button messages */
  button?: {
    text: string;
    payload: string;
  };
  /** Optional interactive message information */
  interactive?: {
    type: string;
    list_reply?: {
      id: string;
      title: string;
      description: string;
    };
    button_reply?: {
      id: string;
      title: string;
    };
  };
  /** Optional order information for catalog-based orders */
  order?: {
    catalog_id: string;
    product_items: WhatsappWebhookProductItemCloudApiDto[];
    text?: string;
  };
  /** Optional system message information */
  system?: {
    body: string;
    new_wa_id?: string;
    type: string;
  };
  /** Optional context information for the message */
  context?: {
    from: string;
    id: string;
    referred_product?: {
      catalog_id: string;
      product_retailer_id: string;
    };
  };
  /** Optional referral information */
  referral?: WhatsappWebhookReferralCloudApiDto;
  /** Optional array of errors associated with the message */
  errors?: WhatsappWebhookErrorCloudApiDto[];
}

/**
 * Represents media content in a WhatsApp message.
 */
export interface WhatsappWebhookMediaCloudApiDto {
  /** Optional caption for the media */
  caption?: string;
  /** Optional filename for documents */
  filename?: string;
  /** The MIME type of the media */
  mime_type: string;
  /** The SHA256 hash of the media content */
  sha256: string;
  /** The unique ID of the media */
  id: string;
}

/**
 * Represents a product item in a catalog-based order.
 */
export interface WhatsappWebhookProductItemCloudApiDto {
  /** The retailer's ID for the product */
  product_retailer_id: string;
  /** The quantity of the product ordered */
  quantity: number;
  /** The price per item */
  item_price: number;
  /** The currency of the price */
  currency: string;
}

/**
 * Represents the status of a WhatsApp message.
 */
export interface WhatsappWebhookStatusCloudApiDto {
  /** The ID of the message */
  id: string;
  /** The status of the message */
  status: WhatsappWebhookMessageStatusTypeCloudApiEnum;
  /** The timestamp of the status update */
  timestamp: string;
  /** The recipient's ID */
  recipient_id: string;
  /** Optional conversation information */
  conversation?: {
    id: string;
    expiration_timestamp?: string;
    origin: {
      type: WhatsappWebhookConversationOriginTypeCloudApiEnum;
    };
  };
  /** Optional pricing information */
  pricing?: {
    billable: boolean;
    pricing_model: string;
    category: WhatsappWebhookPricingCategoryTypeCloudApiEnum;
  };
  /** Optional array of errors associated with the status */
  errors?: WhatsappWebhookErrorCloudApiDto[];
}

/**
 * Represents an error in a WhatsApp webhook event.
 */
export interface WhatsappWebhookErrorCloudApiDto {
  /** The error code */
  code: number;
  /** The title of the error */
  title: string;
  /** The error message */
  message: string;
  /** Optional additional error data */
  error_data?: {
    details: string;
  };
  /** Optional URL for more information about the error */
  href?: string;
}

/**
 * Represents referral information in a WhatsApp message.
 */
export interface WhatsappWebhookReferralCloudApiDto {
  /** The source URL of the referral */
  source_url: string;
  /** The ID of the referral source */
  source_id: string;
  /** The type of the referral source */
  source_type: string;
  /** The headline of the referral */
  headline: string;
  /** The body text of the referral */
  body: string;
  /** The media type of the referral */
  media_type: string;
  /** Optional URL for an image in the referral */
  image_url?: string;
  /** Optional URL for a video in the referral */
  video_url?: string;
  /** Optional URL for a thumbnail in the referral */
  thumbnail_url?: string;
  /** The click-to-WhatsApp ad's ID */
  ctwa_clid: string;
}
