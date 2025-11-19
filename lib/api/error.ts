export class ApiError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return `Error ${error.code}: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error occurred";
}

// export function handleApiError(error: unknown): string {
//   if (
//     error &&
//     typeof error === "object" &&
//     "code" in error &&
//     "message" in error
//   ) {
//     const err = error as ErrorResponse;
//     return `Error ${err.code}: ${err.message}`;
//   }
//   if (error instanceof Error) {
//     return error.message;
//   }
//   return "An unknown error occurred.";
// }
