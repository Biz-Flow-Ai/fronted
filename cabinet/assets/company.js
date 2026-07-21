const token = localStorage.getItem("bizflow_token");
const savedUser = JSON.parse(localStorage.getItem("bizflow_user") || "null");

if (!token && !window.BizFlowShell) {
  window.location.href = "/";
}

const currentUser = document.querySelector("#currentUser");
const logoutButton = document.querySelector("#logoutButton");
const companyTitle = document.querySelector("#companyTitle");
const companyNote = document.querySelector("#companyNote");
const companyConnectionBadge = document.querySelector(
  "#companyConnectionBadge",
);
const connectionWarnings = document.querySelector("#connectionWarnings");
const connectedBanner = document.querySelector("#connectedBanner");
const setupWizard = document.querySelector("#setupWizard");
const connectedTargetCard = document.querySelector("#connectedTargetCard");
const vkConfigForm = document.querySelector("#vkConfigForm");
const connectionTypeSelect = document.querySelector("#connectionType");
const communityNameInput = document.querySelector("#communityName");
const targetIdInput = document.querySelector("#targetId");
const targetIdLabel = document.querySelector("#targetIdLabel");
const vkAccessTokenInput = document.querySelector("#vkAccessToken");
const maskedTokenHint = document.querySelector("#maskedTokenHint");
const callbackUrlInput = document.querySelector("#callbackUrl");
const callbackUrlHint = document.querySelector("#callbackUrlHint");
const secretKeyInput = document.querySelector("#secretKey");
const confirmationTokenInput = document.querySelector("#confirmationToken");
const vkConfigMessage = document.querySelector("#vkConfigMessage");
const statusGrid = document.querySelector("#statusGrid");
const checkReport = document.querySelector("#checkReport");
const checkVkButton = document.querySelector("#checkVkButton");
const managedCallbackPreview = document.querySelector(
  "#managedCallbackPreview",
);
const managedSecretPreview = document.querySelector("#managedSecretPreview");
const copyCallbackButton = document.querySelector("#copyCallbackButton");
const copySecretButton = document.querySelector("#copySecretButton");
const generateSecretButton = document.querySelector("#generateSecretButton");
const setupCallbackButton = document.querySelector("#setupCallbackButton");

let currentUserData = savedUser;
let currentCompanyId = null;
let managedCallbackUrl = `${window.location.origin}/api/vkbot/webhook`;

init();

async function init() {
  logoutButton?.addEventListener("click", logout);
  connectionTypeSelect.addEventListener("change", updateModeUI);
  vkConfigForm.addEventListener("submit", saveConfig);
  checkVkButton.addEventListener("click", runCheck);
  setupCallbackButton?.addEventListener("click", setupCallback);
  copyCallbackButton?.addEventListener("click", () =>
    copyText(managedCallbackUrl, "Callback URL скопирован."),
  );
  copySecretButton?.addEventListener("click", () =>
    copyText(secretKeyInput.value.trim(), "Secret Key скопирован."),
  );
  generateSecretButton?.addEventListener("click", () => {
    secretKeyInput.value = generateSecret();
    syncManagedPreview();
    setMessage(
      "Сгенерирован новый Secret Key. Сохраните настройки и вставьте его в VK.",
      "success",
    );
  });

  currentUserData = await apiGet("/api/auth/me");

  if (!window.BizFlowShell) {
    localStorage.setItem("bizflow_user", JSON.stringify(currentUserData));
    if (isAdmin(currentUserData.role)) {
      window.location.href = "/admin";
      return;
    }
    renderUser();
  }
  currentCompanyId = currentUserData.companyId;
  await loadConfig();
}

function renderUser() {
  if (!currentUser) return;
  const fullName = [currentUserData.firstName, currentUserData.lastName]
    .filter(Boolean)
    .join(" ");
  currentUser.textContent = fullName || currentUserData.email || "Пользователь";
}

async function loadConfig() {
  const config = await apiGet("/api/company/my/vk-config");
  currentCompanyId = config.companyId;
  managedCallbackUrl =
    config.managedCallbackUrl || `${window.location.origin}/api/vkbot/webhook`;

  companyTitle.textContent =
    config.companyName || `Компания #${config.companyId}`;
  companyNote.textContent = config.note || "Настройте подключение VK.";
  communityNameInput.value = config.communityName || "";
  connectionTypeSelect.value = config.connectionType || "group";
  targetIdInput.value = config.targetId || "";
  callbackUrlInput.value = config.callbackUrl || managedCallbackUrl;
  secretKeyInput.value = config.secretKey || generateSecret();
  confirmationTokenInput.value = config.confirmationToken || generateSecret().slice(0, 16);
  vkAccessTokenInput.value = "";
  maskedTokenHint.textContent = config.hasAccessToken
    ? `Текущий токен: ${config.maskedAccessToken}`
    : "Токен ещё не задан";

  updateModeUI();
  syncManagedPreview();
  renderStatus(config);
  renderConnectedTarget(config);
  renderWarnings(config);
  renderConnectedBanner(config);
  updateSetupWizard(config);
  setConnected(
    config.isConnected &&
      !config.callbackIsLocal &&
      config.confirmationTokenConfigured,
  );
}

function renderStatus(config) {
  const items = [
    { label: "Подключение", value: formatVkStatus(config.connectionStatus) },
    { label: "Callback", value: formatVkStatus(config.callbackStatus) },
    { label: "Access Token", value: formatVkStatus(config.accessTokenStatus) },
    { label: "Long Poll", value: formatVkStatus(config.longPollStatus) },
    {
      label: "Сообщество / аккаунт",
      value: formatVkStatus(config.communityStatus),
    },
    {
      label: "Последняя активность",
      value: config.lastActivityAt
        ? new Date(config.lastActivityAt).toLocaleString()
        : "—",
    },
    { label: "Сообщений за сутки", value: String(config.messagesToday || 0) },
  ];

  statusGrid.innerHTML = items
    .map(
      (item) => `
        <div class="status-box">
            <p class="card-label">${escapeHtml(item.label)}</p>
            <p class="status-box-value">${escapeHtml(item.value)}</p>
        </div>
    `,
    )
    .join("");
}

function renderConnectedTarget(config) {
  connectedTargetCard.innerHTML = `
    <div class="report-header">
      <h3>Что подключено сейчас</h3>
      <span class="badge">${escapeHtml(config.connectionType === "personal" ? "Личный аккаунт" : "Сообщество VK")}</span>
    </div>
    <div class="detail-grid">
      <div><strong>Компания</strong><p>${escapeHtml(config.companyName || "—")}</p></div>
      <div><strong>Цель подключения</strong><p>${escapeHtml(config.targetId || "—")}</p></div>
      <div><strong>Название</strong><p>${escapeHtml(config.communityName || "—")}</p></div>
      <div><strong>Callback URL</strong><p>${escapeHtml(config.callbackUrl || "—")}</p></div>
      <div><strong>Secret Key</strong><p>${escapeHtml(config.secretKey || "—")}</p></div>
      <div><strong>Confirmation token</strong><p>${escapeHtml(config.confirmationToken || "—")}</p></div>
      <div><strong>Токен</strong><p>${escapeHtml(config.hasAccessToken ? config.maskedAccessToken : "Не сохранён")}</p></div>
    </div>
  `;
}

function renderConnectedBanner(config) {
  if (!config.isConnected) {
    connectedBanner.hidden = true;
    connectedBanner.innerHTML = "";
    return;
  }

  const vkLink = config.targetId
    ? `https://vk.com/club${config.targetId}`
    : "https://vk.com/project_official_rp";

  connectedBanner.hidden = false;
  connectedBanner.className = "connected-banner";
  connectedBanner.innerHTML = `
    <div>
      <strong>✅ ${escapeHtml(config.communityName || "Сообщество VK")} подключено</strong>
      <p class="muted-copy">ID ${escapeHtml(config.targetId || "—")} · Callback API активен · бот готов принимать сообщения</p>
    </div>
    <a class="ghost-button link-button" href="${escapeHtml(vkLink)}" target="_blank" rel="noreferrer">Открыть группу VK</a>
  `;
}

function updateSetupWizard(config) {
  if (!setupWizard) return;

  const steps = setupWizard.querySelectorAll(".setup-step");
  const hasBasic = Boolean(config.targetId && config.hasAccessToken);
  const hasCallback =
    config.isConnected &&
    !config.callbackIsLocal &&
    config.confirmationTokenConfigured;
  const activeStep = hasCallback ? 4 : hasBasic ? 3 : 1;

  steps.forEach((step) => {
    const stepNumber = Number(step.dataset.step);
    step.classList.remove("active", "done");
    if (stepNumber < activeStep) step.classList.add("done");
    if (stepNumber === activeStep) step.classList.add("active");
  });
}

function renderWarnings(config) {
  const warnings = [];

  if (config.callbackIsLocal) {
    warnings.push(
      "Сейчас callback указывает на localhost. VK не сможет присылать webhook на локальный адрес.",
    );
  }

  if (!config.confirmationTokenConfigured) {
    warnings.push(
      "Укажите confirmation token в BizFlow и вставьте ту же строку в VK → Callback API → Строка подтверждения.",
    );
  }

  connectionWarnings.innerHTML = warnings
    .map(
      (item) => `
        <div class="report-item error">
          <strong>⚠️ Важно</strong>
          <p>${escapeHtml(item)}</p>
        </div>
      `,
    )
    .join("");
}

function setConnected(isConnected) {
  companyConnectionBadge.textContent = isConnected
    ? "Подключено"
    : "Не подключено";
  companyConnectionBadge.className = `status-pill ${isConnected ? "connected" : "disconnected"}`;
}

function updateModeUI() {
  const isPersonal = connectionTypeSelect.value === "personal";
  targetIdLabel.textContent = isPersonal ? "VK ID менеджера" : "VK Group ID";

  callbackUrlInput.readOnly = !isPersonal;
  if (!isPersonal) {
    callbackUrlInput.value = managedCallbackUrl;
    callbackUrlHint.textContent = managedCallbackUrl;
  } else {
    callbackUrlHint.textContent =
      "Для личного режима callback обычно не используется.";
  }

  if (!secretKeyInput.value.trim()) {
    secretKeyInput.value = generateSecret();
  }

  syncManagedPreview();
}

function syncManagedPreview() {
  managedCallbackPreview.textContent = managedCallbackUrl || "—";
  managedSecretPreview.textContent = secretKeyInput.value.trim() || "—";
  callbackUrlHint.textContent =
    connectionTypeSelect.value === "personal"
      ? "Для личного режима callback обычно не используется."
      : managedCallbackUrl || "—";
}

async function saveConfig(event) {
  event.preventDefault();

  const payload = getFormPayload();
  const validationErrors = validateForm(payload, false);
  if (validationErrors.length > 0) {
    setMessage(validationErrors[0], "error");
    renderClientValidationReport(
      "Исправьте ошибки в форме перед сохранением.",
      validationErrors,
    );
    return;
  }

  try {
    setMessage("Сохраняем настройки BizFlow для VK...", "");
    await apiPost("/api/company/my/vk-config", payload);
    setMessage(
      "Настройки сохранены. Если хотите, чтобы сообщения реально приходили из VK, дальше обязательно настройте Callback API, confirmation code и публичный URL вместо localhost.",
      "success",
    );
    await loadConfig();
  } catch (error) {
    const serverErrors = extractServerErrors(error);
    setMessage(error.message || "Не удалось сохранить настройки.", "error");
    if (serverErrors.length > 0) {
      renderClientValidationReport(
        "Сервер отклонил сохранение из-за ошибок валидации.",
        serverErrors,
      );
    }
  }
}

async function setupCallback() {
  const payload = getFormPayload();
  const validationErrors = validateForm(payload, true);
  if (validationErrors.length > 0) {
    setMessage(validationErrors[0], "error");
    return;
  }

  try {
    setMessage("Сохраняем настройки и регистрируем Callback API в VK...", "");
    await apiPost("/api/company/my/vk-config", payload);
    const result = await apiPost("/api/company/my/vk-setup-callback");
    setMessage(
      result.message ||
        "Callback API настроен. Напишите тестовое сообщение в сообщество VK.",
      "success",
    );
    await loadConfig();
  } catch (error) {
    setMessage(
      error.message ||
        "Не удалось автоматически настроить Callback API. Проверьте токен, confirmation token и публичный URL.",
      "error",
    );
  }
}

async function runCheck() {
  const payload = getFormPayload();
  const validationErrors = validateForm(payload, true);
  if (validationErrors.length > 0) {
    setMessage(validationErrors[0], "error");
    renderClientValidationReport(
      "Проверка не запущена: сначала исправьте ошибки в форме.",
      validationErrors,
    );
    return;
  }

  try {
    setMessage("Проверяем подключение VK...", "");
    const report = await apiPost("/api/company/my/vk-check");
    renderCheckReport(report);
    setMessage(
      report.summary || "Проверка завершена.",
      report.overallStatus === 1 ? "success" : "",
    );
    await loadConfig();
  } catch (error) {
    const serverErrors = extractServerErrors(error);
    setMessage(error.message || "Не удалось выполнить проверку.", "error");
    if (serverErrors.length > 0) {
      renderClientValidationReport(
        "Проверка остановлена сервером из-за ошибок конфигурации.",
        serverErrors,
      );
    }
  }
}

function renderCheckReport(report) {
  checkReport.hidden = false;
  checkReport.classList.add("detail-card--visible");
  checkReport.innerHTML = `
        <div class="report-header">
            <h3>Отчёт по проверке</h3>
            <span class="badge">${escapeHtml(formatVkStatus(report.overallStatus))}</span>
        </div>
        <p>${escapeHtml(report.summary || "")}</p>
        <div class="report-list">
            ${(report.checks || [])
              .map(
                (check) => `
                <div class="report-item ${check.ok ? "ok" : "error"}">
                    <strong>${check.ok ? "✅" : "⚠️"} ${escapeHtml(check.label)}</strong>
                    <p>${escapeHtml(check.details || "")}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

function renderClientValidationReport(title, errors) {
  checkReport.hidden = false;
  checkReport.classList.add("detail-card--visible");
  checkReport.innerHTML = `
        <div class="report-header">
            <h3>Валидация формы</h3>
            <span class="badge">Нужно исправить</span>
        </div>
        <p>${escapeHtml(title)}</p>
        <div class="report-list">
            ${errors
              .map(
                (error) => `
                <div class="report-item error">
                    <strong>⚠️ Проверьте поле</strong>
                    <p>${escapeHtml(error)}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

function setMessage(message, type) {
  vkConfigMessage.textContent = message;
  vkConfigMessage.className = `form-message ${type}`.trim();
}

function getFormPayload() {
  const isPersonal = connectionTypeSelect.value === "personal";
  return {
    connectionType: connectionTypeSelect.value,
    communityName: communityNameInput.value.trim(),
    targetId: targetIdInput.value.trim(),
    vkAccessToken: vkAccessTokenInput.value.trim(),
    callbackUrl: isPersonal
      ? callbackUrlInput.value.trim()
      : managedCallbackUrl,
    secretKey: secretKeyInput.value.trim(),
    confirmationToken: confirmationTokenInput.value.trim(),
  };
}

function validateForm(payload, requireToken) {
  const errors = [];

  if (!payload.targetId) {
    errors.push(
      "Укажите VK ID группы, ссылку на сообщество или короткий адрес VK.",
    );
  } else if (payload.connectionType === "personal") {
    const normalizedPersonal = normalizeTargetId(payload.targetId, true);
    if (!/^\d+$/.test(normalizedPersonal)) {
      errors.push(
        "Для личного аккаунта используйте numeric VK ID или ссылку вида vk.com/id12345.",
      );
    }
  } else {
    const normalizedGroup = normalizeTargetId(payload.targetId, false);
    const isDigits = /^\d+$/.test(normalizedGroup);
    const isAlias = /^[a-zA-Z0-9_.]+$/.test(normalizedGroup);
    if (!isDigits && !isAlias) {
      errors.push(
        "Для сообщества можно вставить 220113575, club220113575, ссылку vk.com/club220113575 или короткий адрес сообщества.",
      );
    }
  }

  if (payload.connectionType === "personal") {
    if (payload.callbackUrl) {
      try {
        const url = new URL(payload.callbackUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          errors.push("Callback URL должен начинаться с http:// или https://");
        }
      } catch {
        errors.push("Укажите корректный полный Callback URL.");
      }
    }
  }

  if (
    payload.secretKey &&
    (payload.secretKey.includes(" ") || payload.secretKey.length < 6)
  ) {
    errors.push(
      "Секретный ключ должен быть без пробелов и длиной не меньше 6 символов.",
    );
  }

  if (
    requireToken &&
    !payload.vkAccessToken &&
    !maskedTokenHint.textContent.includes("Текущий токен:")
  ) {
    errors.push("Для проверки подключения нужен сохранённый VK Access Token.");
  }

  if (payload.vkAccessToken) {
    if (/\s/.test(payload.vkAccessToken)) {
      errors.push(
        "VK Access Token не должен содержать пробелы или переносы строк.",
      );
    } else if (payload.vkAccessToken.length < 20) {
      errors.push(
        "VK Access Token выглядит слишком коротким. Проверьте, что вставили полный токен.",
      );
    }
  }

  return errors;
}

function extractServerErrors(error) {
  if (!error?.data?.errors || !Array.isArray(error.data.errors)) {
    return [];
  }

  return error.data.errors.map(
    (item) => item.message || item.Message || JSON.stringify(item),
  );
}

function isAdmin(role) {
  return role === 0 || String(role).toLowerCase() === "admin";
}

function formatVkStatus(value) {
  const numeric = Number(value);
  if (numeric === 1) return "OK";
  if (numeric === 2) return "Warning";
  if (numeric === 3) return "Error";
  return "Unknown";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeTargetId(value, personalMode) {
  let normalized = String(value || "").trim();
  normalized = normalized
    .replace(/^https?:\/\//i, "")
    .replace(/^vk\.com\//i, "")
    .replace(/^@/i, "")
    .replace(/\/$/, "");

  if (personalMode) {
    normalized = normalized.replace(/^id/i, "");
    return normalized.replace(/\D/g, "");
  }

  if (/^club\d+$/i.test(normalized)) {
    return normalized.replace(/^club/i, "");
  }

  if (/^public\d+$/i.test(normalized)) {
    return normalized.replace(/^public/i, "");
  }

  return normalized;
}

function generateSecret() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, "");
  }

  return `${Date.now()}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
}

async function copyText(value, successMessage) {
  if (!value) {
    setMessage("Сначала сохраните или сгенерируйте значение.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setMessage(successMessage, "success");
  } catch {
    setMessage(
      "Не удалось скопировать автоматически. Скопируйте значение вручную.",
      "error",
    );
  }
}

async function apiGet(url) {
  return request(url);
}

async function apiPost(url, body = {}) {
  return request(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "API request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function logout() {
  localStorage.removeItem("bizflow_token");
  localStorage.removeItem("bizflow_user");
  window.location.href = "/";
}
