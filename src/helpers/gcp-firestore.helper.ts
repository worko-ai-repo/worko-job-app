export function gcpFirestorelastKeyToBase64EncodeStr(value?: {
  gcpFirestoreDocumentId: string;
}): undefined | string {
  try {
    // If the provided value is `undefined` then return `undefined`
    if (!value) {
      return undefined;
    }

    // Return the encoded value
    return Buffer.from(JSON.stringify(value)).toString("base64");
  } catch (error: any) {
    // Logger message
    global.logger.error("Unable to perform Base64Encode.", {
      methodName: "gcpFirestorelastKeyToBase64EncodeStr",
      message: error.message,
    });
    return undefined;
  }
}

export function gcpFirestoreBase64EncodeStrToLastKey(str?: string):
  | undefined
  | {
      gcpFirestoreDocumentId: string;
    } {
  try {
    // If the provided value is null, undefined, etc
    if (!str) {
      return undefined;
    }

    return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
  } catch (error: any) {
    // Logger message
    global.logger.error("Unable to perform Base64Decode.", {
      methodName: "gcpFirestoreBase64EncodeStrToLastKey",
      str: str,
      message: error.message,
    });
    return undefined;
  }
}
