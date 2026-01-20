export type SerializableError = {
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: string[];
  fields?: Array<{ field: string; messages: string[] }>;
};

export function handleServerError(error: unknown): never {
  console.log("handleServerError received:", error);

  // 1) Fetch throws plain object → treat it directly
  if (typeof error === "object" && error !== null) {
    const anyErr = error as any;

    const statusCode = anyErr.statusCode ?? 500;
    const errorCode = anyErr.errorCode;
    const responseData = anyErr;

    // --- Case 1: Validation Errors (422) ---
    if (
      statusCode === 422 &&
      Array.isArray(responseData.message) &&
      responseData.message.length > 0 &&
      typeof responseData.message[0] === "object" &&
      "field" in responseData.message[0]
    ) {
      const validationErrors = responseData.message as Array<{
        field: string;
        messages: string[];
      }>;

      const allMessages = validationErrors.flatMap((err) => err.messages);

      const errorObject: SerializableError = {
        statusCode,
        message: allMessages[0] || "errors.validationFailed",
        details: allMessages,
        fields: validationErrors,
      };

      throw new Error(JSON.stringify(errorObject));
    }

    // --- Case 2: message is array ---
    if (Array.isArray(responseData.message)) {
      const errorObject: SerializableError = {
        statusCode,
        message: responseData.message[0],
        details: responseData.message,
      };
      throw new Error(JSON.stringify(errorObject));
    }

    // --- Case 3: message is a string ---
    if (typeof responseData.message === "string") {
      const errorObject: SerializableError = {
        statusCode,
        message: responseData.message,
        errorCode,
      };
      console.log('before thrwoning from error-handler', errorObject)
      throw new Error(JSON.stringify(errorObject));
    }

    // --- Unknown shape but still object ---
    throw new Error(
      JSON.stringify({
        statusCode,
        message: "errors.unknownServerShape",
      } as SerializableError)
    );
  }

  // --- Fallback if not object ---
  throw new Error(
    JSON.stringify({
      statusCode: 500,
      message: "errors.unknownError",
    } as SerializableError)
  );
}

export function parseServerError(error: Error): SerializableError | null {
  try {
    const parsed = JSON.parse(error.message);
    if (parsed?.statusCode && parsed?.message) {
      return parsed as SerializableError;
    }
    return null;
  } catch {
    return null;
  }
}

export function handleMutationError(
  error: Error,
  t: any,
  fallbackKey: string,
  onError: (message: string) => void,
  options?: {
    showAllErrors?: boolean;
    includeFieldNames?: boolean;
  }
): void {
  const parsedError = parseServerError(error);

  if (parsedError) {
    // --- Case 1: Validation errors with fields (422) ---
    if (parsedError.fields && parsedError.fields.length > 0) {
      const showAll = options?.showAllErrors ?? true;
      const includeField = options?.includeFieldNames ?? false;

      if (showAll) {
        parsedError.fields.forEach((fieldErr) => {
          fieldErr.messages.forEach((msg) => {
            const translated = t(msg) || msg;
            const finalMsg = includeField
              ? `${fieldErr.field}: ${translated}`
              : translated;
            onError(finalMsg);
          });
        });
      } else {
        const f = parsedError.fields[0];
        const firstMsg = t(f.messages[0]) || f.messages[0];
        const finalMsg = includeField ? `${f.field}: ${firstMsg}` : firstMsg;
        onError(finalMsg);
      }
      return;
    }

    // --- Case 2: Non-validation multiple messages ---
    if (parsedError.details && parsedError.details.length > 1) {
      const showAll = options?.showAllErrors ?? true;

      if (showAll) {
        parsedError.details.forEach((msg) => onError(t(msg) || msg));
      } else {
        onError(t(parsedError.message) || parsedError.message);
      }
      return;
    }

    // --- Case 3: single message ---
    onError(t(parsedError.message) || parsedError.message);
    return;
  }

  // --- Completely unknown error ---
  onError(t(fallbackKey));
}
