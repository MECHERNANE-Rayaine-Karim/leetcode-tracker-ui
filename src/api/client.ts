const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  params?: Record<string, string | number | (string | number)[]>
): Promise<T> {
  const token = localStorage.getItem("token");

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url.toString(), { ...options, headers });

  if (!response.ok) {
  const errorBody = await response.json().catch(() => null);
  let message = `Request failed: ${response.status}`;

  if (errorBody?.detail) {
    if (typeof errorBody.detail === "string") {
      message = errorBody.detail;
    } else if (Array.isArray(errorBody.detail)) {
      message = errorBody.detail.map((e: { msg: string }) => e.msg).join(", ");
    }
  }

  throw new Error(message);
}

  if (response.status === 204) {
  return undefined as T;
  }

  return response.json();
}