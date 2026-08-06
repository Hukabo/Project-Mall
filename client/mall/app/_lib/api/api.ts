const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "";
const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "Api Error";
    this.status = status;
    this.data = data;
  }
}

type Params = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Params;
  timeout?: number;
  skipAuth?: boolean;
}

function buildUrl(path: string, params?: Params): string {
  const url = new URL(
    path.startsWith("http") ? path : `${BASE_URL}/${path}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  // 서버 환경(SSR)에서 절대경로가 필요 없는 경우 origin 제거
  return path.startsWith("http") || BASE_URL
    ? url.toString()
    : url.pathname + url.search;
}

async function request<T = unknown>(
  path: string,
  {
    body,
    params,
    timeout = DEFAULT_TIMEOUT_MS,
    skipAuth = false,
    headers,
    ...init
  }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const isFormData = body instanceof FormData;

  try {
    const res = await fetch(buildUrl(path, params), {
      ...init,
      credentials: "include",
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body:
        body !== undefined
          ? isFormData
            ? body
            : JSON.stringify(body)
          : undefined,
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      let message = `요청이 실패했습니다 (${res.status})`;

      if (data && typeof data === "object" && "message" in data) {
        message = String((data as { message: unknown }).message);
      }

      throw new ApiError(message, res.status, data);
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(err);
      throw err;
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("요청 시간이 초과됐습니다.", 408, null);
    }
    throw new ApiError(
      err instanceof Error ? err.message : "네트워크 오류가 발생했습니다.",
      0,
      null,
    );
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T = unknown>(
    path: string,
    options?: Omit<RequestOptions, "body" | "method">,
  ) => request<T>(path, { ...options, method: "GET" }),

  post: <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body" | "method">,
  ) => request<T>(path, { ...options, method: "POST", body }),

  put: <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body" | "method">,
  ) => request<T>(path, { ...options, method: "PUT", body }),

  patch: <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body" | "method">,
  ) => request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T = unknown>(
    path: string,
    options?: Omit<RequestOptions, "body" | "method">,
  ) => request<T>(path, { ...options, method: "DELETE" }),
};
