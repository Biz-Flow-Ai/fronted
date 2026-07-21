(function () {
  const TOKEN_KEY = "bizflow_token";
  const USER_KEY = "bizflow_user";
  const COMPANY_KEY = "bizflow_company";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  }

  function getCompany() {
    try {
      return JSON.parse(localStorage.getItem(COMPANY_KEY) || "null");
    } catch {
      return null;
    }
  }

  function isAdmin(role) {
    return role === 0 || String(role).toLowerCase() === "admin";
  }

  function persistSession(data) {
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    if (data?.company) localStorage.setItem(COMPANY_KEY, JSON.stringify(data.company));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COMPANY_KEY);
  }

  function needsOnboarding(company) {
    return company && company.onboardingCompleted === false;
  }

  function redirectAfterAuth(user, company) {
    if (isAdmin(user?.role)) {
      window.location.href = "/admin";
      return;
    }
    if (needsOnboarding(company)) {
      window.location.href = "/company/onboarding";
      return;
    }
    window.location.href = "/company";
  }

  async function fetchJson(url, opts = {}) {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "1",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(opts.headers || {}),
    };

    const res = await fetch(url, { ...opts, headers });
    const contentType = res.headers.get("content-type") || "";
    let body = null;

    if (contentType.includes("application/json")) {
      body = await res.json().catch(() => ({}));
    } else {
      const text = await res.text().catch(() => "");
      body = text.trim().startsWith("{") ? JSON.parse(text) : { message: text };
    }

    if (!res.ok) {
      const err = new Error(body?.message || res.statusText || "Ошибка запроса");
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body;
  }

  function requireAuth() {
    const token = getToken();
    const user = getUser();
    if (token && user) return true;
    window.location.href = "/login";
    return false;
  }

  function guardAuthPage() {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      redirectAfterAuth(user, getCompany());
      return true;
    }
    return false;
  }

  window.BizFlowAuth = {
    getToken,
    getUser,
    getCompany,
    isAdmin,
    needsOnboarding,
    persistSession,
    clearSession,
    redirectAfterAuth,
    fetchJson,
    requireAuth,
    guardAuthPage,
    login: (email, password) =>
      fetchJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    registerOwner: (payload) =>
      fetchJson("/api/auth/register-owner", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  };
})();
