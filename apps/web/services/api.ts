import { ApiClientError, type ApiResponse } from "@/types/api";

const REFRESH_PATH = "/api/auth/refresh";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function readBody(res: Response): Promise<ApiResponse<unknown>> {
  const text = await res.text();
  if (!text) return { success: false, error: { code: "EMPTY", message: "Empty response" } };
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, error: { code: "PARSE", message: "Malformed response" } };
  }
}

class ApiClient {
  async request<T>(path: string, options: RequestOptions = {}, retried = false): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(options.headers as Record<string, string> | undefined),
    };

    const res = await fetch(path, {
      ...options,
      headers,
      credentials: "include",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (res.status === 401 && !retried && path !== REFRESH_PATH) {
      if (await this.refresh()) {
        return this.request<T>(path, options, true);
      }
      throw new ApiClientError(401, "UNAUTHORIZED", "Your session has expired. Please sign in again.");
    }

    const json = await readBody(res);

    if (!res.ok) {
      if (json && "error" in json) {
        throw new ApiClientError(res.status, json.error.code, json.error.message, json.error.details);
      }
      throw new ApiClientError(res.status, "INTERNAL_ERROR", "Something went wrong. Please try again.");
    }

    if (json && "data" in json) {
      return json.data as T;
    }

    return undefined as T;
  }

  private async refresh(): Promise<boolean> {
    try {
      const res = await fetch(REFRESH_PATH, { method: "POST", credentials: "include" });
      return res.ok;
    } catch {
      return false;
    }
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "POST", body });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "PATCH", body });
  }

  delete<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "DELETE", body });
  }
}

export const api = new ApiClient();
