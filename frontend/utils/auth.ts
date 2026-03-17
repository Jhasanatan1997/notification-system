export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_jwt");
}

export function setToken(token: string) {
  localStorage.setItem("admin_jwt", token);
}

export function clearToken() {
  localStorage.removeItem("admin_jwt");
}

