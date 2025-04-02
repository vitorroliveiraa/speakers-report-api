export class AppError extends Error {
  public readonly statusCode: number;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    statusCode: number = 400,
    originalError?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.originalError = originalError;

    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 400, originalError);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 401, originalError);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 403, originalError);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 404, originalError);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal Server Error",
    originalError?: unknown
  ) {
    super(message, 500, originalError);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 409, originalError);
  }
}

export class GoneError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 410, originalError);
  }
}

export class RateLimitError extends AppError {
  constructor(public retryAfter: number) {
    super("Too many requests", 429);
  }
}
