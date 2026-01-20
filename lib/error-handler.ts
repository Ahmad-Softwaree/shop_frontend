export type SerializableError = {
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: string[];
  fields?: Array<{ field: string; messages: string[] }>;
};

export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  details?: string[];
  fields?: Array<{ field: string; messages: string[] }>;

  constructor(data: SerializableError) {
    super(data.message);
    this.name = "ApiError";
    this.statusCode = data.statusCode;
    this.errorCode = data.errorCode;
    this.details = data.details;
    this.fields = data.fields;
  }
}

export function handleServerError(error: unknown): never {
  console.error("handleServerError received:", error);

  if (typeof error === "object" && error !== null) {
    const anyErr = error as any;

    const statusCode = anyErr.statusCode ?? 500;
    const errorCode = anyErr.errorCode;
    const message = anyErr.message;

    // --- Case 1: Validation errors (422) ---
    if (
      statusCode === 422 &&
      Array.isArray(message) &&
      message.length > 0 &&
      typeof message[0] === "object" &&
      "field" in message[0]
    ) {
      const validationErrors = message as Array<{
        field: string;
        messages: string[];
      }>;

      const allMessages = validationErrors.flatMap((e) => e.messages);

      throw new ApiError({
        statusCode,
        message: allMessages[0] || "errors.validationFailed",
        details: allMessages,
        fields: validationErrors,
      });
    }

    // --- Case 2: message is array ---
    if (Array.isArray(message)) {
      throw new ApiError({
        statusCode,
        message: message[0],
        details: message,
      });
    }

    // --- Case 3: message is string ---
    if (typeof message === "string") {
      throw new ApiError({
        statusCode,
        message,
        errorCode,
      });
    }

    // --- Unknown shape ---
    throw new ApiError({
      statusCode,
      message: "errors.unknownServerShape",
    });
  }

  throw new ApiError({
    statusCode: 500,
    message: "errors.unknownError",
  });
}

export function handleMutationError(
  error: any,
  t: any,
  fallbackKey: string,
  onError: (message: string) => void,
  options?: {
    showAllErrors?: boolean;
    includeFieldNames?: boolean;
  }
): void {
  // --- Validation errors ---
  if (error.fields?.length) {
    const showAll = options?.showAllErrors ?? true;
    const includeField = options?.includeFieldNames ?? false;

    const fields = showAll ? error.fields : [error.fields[0]];

    fields.forEach((f: { field: string; messages: string[] }) => {
      f.messages.forEach((msg) => {
        const translated = t(msg) || msg;
        onError(includeField ? `${f.field}: ${translated}` : translated);
      });
    });
    return;
  }

  // --- Multiple messages ---
  if (error.details?.length) {
    error.details.forEach((msg: string) => onError(t(msg) || msg));
    return;
  }

  // --- Single message ---
  onError(t(error.message) || error.message);
}
