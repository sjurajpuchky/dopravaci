async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(path, { ...options, headers, credentials: "same-origin" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error || `Požadavek selhal (${response.status})`);
    error.status = response.status;
    error.details = payload?.details;
    throw error;
  }
  return payload;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  auth: {
    me: () => request("/api/auth/me"),
    login: (email, password) => request("/api/auth/login", json("POST", { email, password })),
    logout: () => request("/api/auth/logout", { method: "POST" }),
    register: (email, password) => request("/api/auth/register", json("POST", { email, password })),
    verify: (email, code) => request("/api/auth/verify", json("POST", { email, code })),
    resendVerification: (email) => request("/api/auth/resend-verification", json("POST", { email })),
    forgotPassword: (email) => request("/api/auth/forgot-password", json("POST", { email })),
    resetPassword: (token, password) => request("/api/auth/reset-password", json("POST", { token, password })),
  },
  settings: {
    public: () => request("/api/public/settings"),
    get: () => request("/api/admin/settings"),
    save: (data) => request("/api/admin/settings", json("PUT", data)),
  },
  articles: {
    public: () => request("/api/public/articles"),
    bySlug: (slug) => request(`/api/public/articles/${encodeURIComponent(slug)}`),
    list: () => request("/api/admin/articles"),
    create: (data) => request("/api/admin/articles", json("POST", data)),
    update: (id, data) => request(`/api/admin/articles/${encodeURIComponent(id)}`, json("PATCH", data)),
    delete: (id) => request(`/api/admin/articles/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  gallery: {
    public: () => request("/api/public/gallery"),
  },
  inquiries: {
    create: (data) => request("/api/inquiries", json("POST", data)),
    list: () => request("/api/inquiries"),
    update: (id, data) => request(`/api/inquiries/${encodeURIComponent(id)}`, json("PATCH", data)),
    delete: (id) => request(`/api/inquiries/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  users: {
    list: () => request("/api/admin/users"),
    update: (id, data) => request(`/api/admin/users/${encodeURIComponent(id)}`, json("PATCH", data)),
  },
  upload: async (file) => {
    const body = new FormData();
    body.append("file", file);
    return request("/api/upload", { method: "POST", body });
  },
};
