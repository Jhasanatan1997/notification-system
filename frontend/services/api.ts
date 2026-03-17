const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

export type ApiError = { error: { code: string; message: string } };

async function request<T>(path: string, opts: RequestInit & { token?: string } = {}): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
      ...(opts.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw json as ApiError;
  return json as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  overview: (token: string) => request("/admin/overview", { token }),
  logs: (token: string, query: string) => request(`/admin/logs${query}`, { token }),
  notifications: (token: string, query: string) => request(`/notifications${query}`, { token }),
  notificationLogs: (token: string, notificationId: string) =>
    request(`/notifications/${notificationId}/logs`, { token }),
  retry: (token: string, notificationId: string) =>
    request(`/admin/notifications/${notificationId}/retry`, { token, method: "POST" }),

  templates: (token: string) => request("/templates", { token }),
  upsertTemplate: (token: string, body: { type: string; channel: string; templateBody: string }) =>
    request("/templates", { token, method: "PUT", body: JSON.stringify(body) }),
  deleteTemplate: (token: string, type: string, channel: string) =>
    request(`/templates/${encodeURIComponent(type)}/${encodeURIComponent(channel)}`, { token, method: "DELETE" }),

  userPrefs: (token: string, userId: string) => request(`/users/${userId}/preferences`, { token }),
  upsertUserPref: (
    token: string,
    userId: string,
    body: {
      notificationType: string;
      emailEnabled: boolean;
      smsEnabled: boolean;
      pushEnabled: boolean;
      inAppEnabled: boolean;
    }
  ) => request(`/users/${userId}/preferences`, { token, method: "PUT", body: JSON.stringify(body) }),

  sendTest: (body: any) => request("/notifications", { method: "POST", body: JSON.stringify(body) }),

  aiGenerate: (token: string, body: { input: string; channel: "email" | "sms" | "push" | "inapp" }) =>
    request("/ai/generate-message", { token, method: "POST", body: JSON.stringify(body) }),
  aiSpam: (token: string, body: { message: string; recentPerMinute: number }) =>
    request("/ai/detect-spam", { token, method: "POST", body: JSON.stringify(body) }),
  aiEngagement: (token: string, body: { message: string; channel: string; userSegment?: string }) =>
    request("/ai/predict-engagement", { token, method: "POST", body: JSON.stringify(body) }),
};

