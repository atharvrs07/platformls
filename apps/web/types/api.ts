export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { path?: string; message: string }[];
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ApiErrorBody["error"]["details"];

  constructor(status: number, code: string, message: string, details?: ApiErrorBody["error"]["details"]) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
