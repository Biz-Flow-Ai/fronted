(function () {
  function getToken() {
    return localStorage.getItem("bizflow_token");
  }

  function defaultHeaders(extra) {
    return {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "1",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(extra || {}),
    };
  }

  async function request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || 20000);
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: isFormData
          ? {
              "ngrok-skip-browser-warning": "1",
              ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
              ...(options.headers || {}),
            }
          : defaultHeaders(options.headers),
      });

      const contentType = response.headers.get("content-type") || "";
      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json().catch(() => ({}));
      } else {
        const text = await response.text().catch(() => "");
        if (text.trim().startsWith("{")) {
          try {
            data = JSON.parse(text);
          } catch {
            data = {};
          }
        } else if (text.includes("ngrok") || text.includes("<!DOCTYPE")) {
          throw new Error(
            "Сервер недоступен или вернул HTML вместо API. Перезагрузите страницу (Ctrl+F5).",
          );
        }
      }

      if (!response.ok) {
        const error = new Error(data.message || `Ошибка запроса (${response.status})`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Сервер не отвечает. Проверьте, что Virexo запущен на порту 5000.");
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function showToast(message, type = "info") {
    if (!message) return;

    let host = document.getElementById("bfToastHost");
    if (!host) {
      host = document.createElement("div");
      host.id = "bfToastHost";
      host.className = "bf-toast-host";
      host.setAttribute("aria-live", "polite");
      host.setAttribute("aria-atomic", "true");
      document.body.appendChild(host);
    }

    const toast = document.createElement("div");
    toast.className = `bf-toast bf-toast--${type} bf-toast--visible`;
    toast.innerHTML = `
      <span class="bf-toast-text"></span>
      <button type="button" class="bf-toast-close" aria-label="Закрыть">&times;</button>
    `;
    toast.querySelector(".bf-toast-text").textContent = message;
    toast.querySelector(".bf-toast-close").addEventListener("click", () => dismissToast(toast));

    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("bf-toast--show"));

    const timer = setTimeout(() => dismissToast(toast), 5500);
    toast._timer = timer;
  }

  function dismissToast(toast) {
    if (!toast || toast._dismissed) return;
    toast._dismissed = true;
    clearTimeout(toast._timer);
    toast.classList.remove("bf-toast--show");
    setTimeout(() => toast.remove(), 220);
  }

  function requireAuth() {
    if (!getToken()) {
      window.location.href = "/login";
      return false;
    }
    return true;
  }

  function isAdmin(role) {
    return role === 0 || role === "0" || String(role).toLowerCase() === "admin";
  }

  function logout() {
    localStorage.removeItem("bizflow_token");
    localStorage.removeItem("bizflow_user");
    localStorage.removeItem("bizflow_company");
    window.location.href = "/login";
  }

  async function waitForShell() {
    if (window.BizFlowShell?.ready) {
      await window.BizFlowShell.ready;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
    return waitForShell();
  }

  async function getVkConfig() {
    return request("/api/company/my/vk-config");
  }

  function isVkIntegrated(config) {
    return Boolean(config?.hasAccessToken && config?.targetId);
  }

  function showIntegrationGate(options = {}) {
    const {
      title = "Доступ ограничен",
      message = "Сначала подключите сообщество VK — без интеграции бот не сможет принимать сообщения.",
      targetId = "integrationGate",
    } = options;

    let gate = document.getElementById(targetId);
    if (!gate) {
      gate = document.createElement("div");
      gate.id = targetId;
      gate.className = "bf-integration-gate";
      gate.innerHTML = `
        <div class="bf-integration-gate-card">
          <div class="bf-integration-gate-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 data-gate-title></h2>
          <p data-gate-message></p>
          <a href="/company/vk" class="bf-integration-gate-btn">Подключить VK</a>
        </div>`;
      document.body.appendChild(gate);
    }

    gate.querySelector("[data-gate-title]").textContent = title;
    gate.querySelector("[data-gate-message]").textContent = message;
    gate.hidden = false;
    return gate;
  }

  function hideIntegrationGate(targetId = "integrationGate") {
    const gate = document.getElementById(targetId);
    if (gate) gate.hidden = true;
  }

  window.BizFlowApi = {
    getToken,
    get: (url) => request(url),
    post: (url, body = {}) =>
      request(url, { method: "POST", body: JSON.stringify(body) }),
    put: (url, body = {}) =>
      request(url, { method: "PUT", body: JSON.stringify(body) }),
    patch: (url, body = {}) =>
      request(url, { method: "PATCH", body: JSON.stringify(body) }),
    request,
    showToast,
    requireAuth,
    isAdmin,
    logout,
    waitForShell,
    getVkConfig,
    isVkIntegrated,
    showIntegrationGate,
    hideIntegrationGate,
    extractErrors(error) {
      if (!error?.data?.errors || !Array.isArray(error.data.errors)) return [];
      return error.data.errors.map(
        (item) => item.message || item.Message || JSON.stringify(item),
      );
    },
  };
})();
