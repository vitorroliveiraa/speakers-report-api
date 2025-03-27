export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public originalError?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    if (originalError) {
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
