const token = localStorage.getItem("bizflow_token");
const savedUser = JSON.parse(localStorage.getItem("bizflow_user") || "null");

if (!token) {
  window.location.href = "/auth?key=admin";
}

const sections = {
  dashboard: {
    title: "Dashboard",
    element: document.querySelector("#dashboardSection"),
  },
  companies: {
    title: "Компании",
    element: document.querySelector("#companiesSection"),
  },
  users: {
    title: "Пользователи",
    element: document.querySelector("#usersSection"),
  },
  "vk-integrations": {
    title: "VK Интеграции",
    element: document.querySelector("#vkIntegrationsSection"),
  },
  messages: {
    title: "Мониторинг сообщений",
    element: document.querySelector("#messagesSection"),
  },
  "ai-requests": {
    title: "Мониторинг AI",
    element: document.querySelector("#aiRequestsSection"),
  },
  "customer-cards": {
    title: "Карточки клиентов",
    element: document.querySelector("#customerCardsSection"),
  },
  dialogs: {
    title: "Диалоги",
    element: document.querySelector("#dialogsSection"),
  },
  logs: { title: "Логи", element: document.querySelector("#logsSection") },
  "service-status": {
    title: "Состояние сервисов",
    element: document.querySelector("#serviceStatusSection"),
  },
  "giga-chat": {
    title: "GigaChat",
    element: document.querySelector("#gigaChatSection"),
  },
  "test-vk-bot": {
    title: "Тестирование VK Бота",
    element: document.querySelector("#testVkBotSection"),
  },
};

const sectionTitle = document.querySelector("#sectionTitle");
const currentUser = document.querySelector("#currentUser");
const logoutButton = document.querySelector("#logoutButton");
const applyDialogFiltersButton = document.querySelector("#applyDialogFilters");
const runVkTestButton = document.querySelector("#runVkTest");
const createUserForm = document.querySelector("#createUserForm");
const createUserMessage = document.querySelector("#createUserMessage");

let user = savedUser;

init();

async function init() {
  bindNavigation();
  logoutButton.addEventListener("click", logout);
  applyDialogFiltersButton?.addEventListener("click", () => loadDialogs());
  runVkTestButton?.addEventListener("click", testVkBot);
  createUserForm?.addEventListener("submit", createUserByAdmin);

  renderUser();
  showSection(getCurrentSection());

  try {
    user = await apiGet("/api/auth/me");
    localStorage.setItem("bizflow_user", JSON.stringify(user));

    if (!isAdmin(user.role)) {
      window.location.href = "/company";
      return;
    }

    renderUser();
    await loadSectionData(getCurrentSection());
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      alert("Сессия admin устарела. Войдите заново.");
      logout();
      return;
    }
    console.error(error);
  }
}

function bindNavigation() {
  document.querySelectorAll("[data-section-link]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const section = link.dataset.sectionLink;
      history.pushState(null, "", `/admin?section=${section}`);
      showSection(section);
      await loadSectionData(section);
    });
  });

  window.addEventListener("popstate", async () => {
    const section = getCurrentSection();
    showSection(section);
    await loadSectionData(section);
  });
}

function renderUser() {
  if (!user) {
    currentUser.textContent = "Пользователь";
    return;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  currentUser.textContent = fullName || user.email || "Пользователь";
}

function showSection(sectionName) {
  const activeSection = sections[sectionName] ? sectionName : "dashboard";

  Object.entries(sections).forEach(([name, section]) => {
    section.element.hidden = name !== activeSection;
  });

  document.querySelectorAll("[data-section-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.sectionLink === activeSection);
  });

  sectionTitle.textContent = sections[activeSection].title;
}

async function loadSectionData(sectionName) {
  switch (sectionName) {
    case "dashboard":
      return loadDashboard();
    case "companies":
      return loadCompanies();
    case "users":
      return loadUsers();
    case "vk-integrations":
      return loadVkIntegrations();
    case "messages":
      return loadMessages();
    case "ai-requests":
      return loadAiRequests();
    case "customer-cards":
      return loadCustomerCards();
    case "dialogs":
      return loadDialogs();
    case "logs":
      return loadLogs();
    case "service-status":
      return loadServiceStatus();
    case "giga-chat":
      return loadGigaChatConfig();
    case "test-vk-bot":
      return Promise.resolve();
    default:
      return loadDashboard();
  }
}

async function loadDashboard() {
  const data = await apiGet("/api/superadmin/dashboard");
  setText("#totalCompanies", data.totalCompanies);
  setText("#connectedVk", data.connectedVk);
  setText("#messagesToday", data.messagesToday);
  setText("#errors", data.errors);
  setText("#aiRequests", data.aiRequests);
  setText("#activeDialogs", data.activeDialogs);
  setText(
    "#avgAiResponseTime",
    `${Number(data.avgAiResponseTime || 0).toFixed(1)} сек`,
  );
}

async function loadCompanies() {
  const companies = await apiGet("/api/superadmin/companies");
  const tbody = document.querySelector("#companiesTableBody");
  tbody.innerHTML = companies
    .map(
      (company) => `
        <tr>
            <td>${company.id}</td>
            <td>${escapeHtml(company.name)}</td>
            <td>${formatDate(company.createdAt, false)}</td>
            <td>${renderTariffSelect(company.id, company.tariff || "free")}</td>
            <td>${company.isActive ? "Активна" : "Заблокирована"}</td>
            <td>${company.clientCount}</td>
            <td>${company.dialogCount}</td>
            <td>${company.hasVkToken ? "Есть токен" : "—"}</td>
            <td class="table-actions">
                <button class="ghost-button" type="button" onclick="saveCompanyTariff(${company.id})">Сохранить тариф</button>
                <button class="ghost-button" type="button" onclick="blockCompany(${company.id})" ${!company.isActive ? "disabled" : ""}>Блок</button>
                <button class="ghost-button" type="button" onclick="activateCompany(${company.id})" ${company.isActive ? "disabled" : ""}>Активировать</button>
                <button class="ghost-button" type="button" onclick="deleteCompany(${company.id})">Удалить</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

const TARIFF_OPTIONS = ["free", "start", "business", "premium", "enterprise"];

function renderTariffSelect(id, current) {
  const value = (current || "free").toLowerCase();
  const options = TARIFF_OPTIONS.map(
    (t) => `<option value="${t}"${t === value ? " selected" : ""}>${t}</option>`,
  ).join("");
  return `<select class="tariff-select" id="tariff-company-${id}" data-company-id="${id}">${options}</select>`;
}

function renderUserTariffSelect(userId, current) {
  const value = (current || "free").toLowerCase();
  const options = TARIFF_OPTIONS.map(
    (t) => `<option value="${t}"${t === value ? " selected" : ""}>${t}</option>`,
  ).join("");
  return `<select class="tariff-select" id="tariff-user-${userId}" data-user-id="${userId}">${options}</select>`;
}

async function saveCompanyTariff(companyId) {
  const select = document.getElementById(`tariff-company-${companyId}`);
  if (!select) return;
  await apiPatch(`/api/superadmin/companies/${companyId}/tariff`, {
    tariff: select.value,
  });
  await loadCompanies();
}

async function loadUsers() {
  const users = await apiGet("/api/superadmin/users");
  const tbody = document.querySelector("#usersTableBody");
  tbody.innerHTML = users
    .map((user) => {
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
      return `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(name)}</td>
            <td>
              <select id="role-user-${user.id}">
                <option value="Admin"${user.role === "Admin" ? " selected" : ""}>Admin</option>
                <option value="CompanyOwner"${user.role === "CompanyOwner" ? " selected" : ""}>CompanyOwner</option>
                <option value="Operator"${user.role === "Operator" ? " selected" : ""}>Operator</option>
              </select>
            </td>
            <td>${escapeHtml(user.companyName || "—")}</td>
            <td>${renderUserTariffSelect(user.id, user.tariff || "free")}</td>
            <td>${user.isActive ? "Активен" : "Отключён"}</td>
            <td>${formatDate(user.createdAt, false)}</td>
            <td class="table-actions">
                <button class="ghost-button" type="button" onclick="saveUser(${user.id})">Сохранить</button>
                <button class="ghost-button" type="button" onclick="toggleUserActive(${user.id}, ${user.isActive ? "false" : "true"})">${user.isActive ? "Отключить" : "Включить"}</button>
            </td>
        </tr>`;
    })
    .join("");
}

async function saveUser(userId) {
  const roleSelect = document.getElementById(`role-user-${userId}`);
  const tariffSelect = document.getElementById(`tariff-user-${userId}`);
  await apiPatch(`/api/superadmin/users/${userId}`, {
    role: roleSelect?.value,
    tariff: tariffSelect?.value,
  });
  await loadUsers();
}

async function toggleUserActive(userId, active) {
  await apiPatch(`/api/superadmin/users/${userId}`, { isActive: active });
  await loadUsers();
}

window.saveCompanyTariff = saveCompanyTariff;
window.saveUser = saveUser;
window.toggleUserActive = toggleUserActive;

async function blockCompany(id) {
  await apiPost(`/api/superadmin/companies/${id}/block`);
  await loadCompanies();
}

async function activateCompany(id) {
  await apiPost(`/api/superadmin/companies/${id}/activate`);
  await loadCompanies();
}

async function deleteCompany(id) {
  if (!confirm("Удалить компанию?")) return;
  await apiDelete(`/api/superadmin/companies/${id}`);
  await loadCompanies();
}

async function loadVkIntegrations() {
  const integrations = await apiGet("/api/superadmin/vk-integrations");
  const tbody = document.querySelector("#vkIntegrationsTableBody");
  tbody.innerHTML = integrations
    .map(
      (integration) => `
        <tr>
            <td>${escapeHtml(integration.companyName)}</td>
            <td>${integration.connectionType === "personal" ? "Личный" : "Сообщество"}</td>
            <td>${escapeHtml(integration.communityName || "-")}</td>
            <td>${escapeHtml(integration.targetId || integration.vkCommunityId || "-")}</td>
            <td>${formatVkStatus(integration.connectionStatus)}</td>
            <td>${formatVkStatus(integration.callbackStatus)}</td>
            <td>${integration.lastActivityAt ? formatDate(integration.lastActivityAt, true) : "—"}</td>
            <td>${integration.messagesToday || 0}</td>
            <td class="table-actions">
                <button class="ghost-button" type="button" onclick="checkIntegration(${integration.id})">Проверить</button>
                <button class="ghost-button" type="button" onclick="showIntegrationDetail(${integration.id})">Открыть</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

async function checkIntegration(id) {
  await apiPost(`/api/superadmin/vk-integrations/${id}/check`);
  await loadVkIntegrations();
  await showIntegrationDetail(id);
}

async function showIntegrationDetail(id) {
  const detail = await apiGet(`/api/superadmin/vk-integrations/${id}`);
  const card = document.querySelector("#integrationDetailCard");
  card.hidden = false;
  card.classList.add("detail-card--visible");
  card.innerHTML = `
        <div class="report-header">
            <h3>Карточка интеграции</h3>
            <span class="badge">${escapeHtml(formatVkStatus(detail.connectionStatus))}</span>
        </div>
        <div class="detail-grid">
            <div><strong>Компания</strong><p>${escapeHtml(detail.companyName)}</p></div>
            <div><strong>Режим</strong><p>${detail.connectionType === "personal" ? "Личный аккаунт" : "Сообщество VK"}</p></div>
            <div><strong>VK Group / User ID</strong><p>${escapeHtml(detail.targetId || detail.vkCommunityId || "-")}</p></div>
            <div><strong>Access Token</strong><p>${escapeHtml(detail.accessTokenMasked || "—")}</p></div>
            <div><strong>Callback URL</strong><p>${escapeHtml(detail.callbackUrl || "—")}</p></div>
            <div><strong>Секретный ключ</strong><p>${escapeHtml(detail.secretKey || "—")}</p></div>
            <div><strong>Последний запрос VK</strong><p>${escapeHtml(detail.lastVkRequest || "—")}</p></div>
            <div><strong>Последний ответ сервера</strong><p>${escapeHtml(detail.lastServerResponse || "—")}</p></div>
        </div>
    `;
}

async function loadMessages() {
  const messages = await apiGet("/api/superadmin/messages");
  const tbody = document.querySelector("#messagesTableBody");
  const statusLabels = [
    "Получено",
    "Сохранено",
    "Передано AI",
    "Ответ отправлен",
    "Ошибка",
  ];
  tbody.innerHTML = messages
    .map(
      (message) => `
        <tr>
            <td>${escapeHtml(message.companyName)}</td>
            <td>${escapeHtml(message.client || "-")}</td>
            <td>${message.vkUserId}</td>
            <td>${escapeHtml(truncate(message.content, 90))}</td>
            <td>${formatDate(message.createdAt, true)}</td>
            <td>${statusLabels[message.processingStatus] || "Unknown"}</td>
        </tr>
    `,
    )
    .join("");
}

async function loadAiRequests() {
  const requests = await apiGet("/api/superadmin/ai-requests");
  const tbody = document.querySelector("#aiRequestsTableBody");
  const statusLabels = ["Pending", "Processing", "Completed", "Failed"];
  tbody.innerHTML = requests
    .map(
      (request) => `
        <tr>
            <td>${request.id}</td>
            <td>${escapeHtml(request.companyName)}</td>
            <td>${request.vkUserId || "-"}</td>
            <td>${request.contextSize}</td>
            <td>${Number(request.generationTimeSeconds || 0).toFixed(2)} сек</td>
            <td>${statusLabels[request.status] || "Unknown"}</td>
            <td><button class="ghost-button" type="button" onclick='showAiRequestDetail(${JSON.stringify(request).replace(/'/g, "&#39;")})'>Детали</button></td>
        </tr>
    `,
    )
    .join("");
}

function showAiRequestDetail(request) {
  const card = document.querySelector("#aiRequestDetail");
  card.hidden = false;
  card.classList.add("detail-card--visible");
  card.innerHTML = `
        <h3>Детали AI запроса #${request.id}</h3>
        <div class="detail-grid">
            <div><strong>Prompt</strong><p>${escapeHtml(request.prompt || "—")}</p></div>
            <div><strong>Ответ AI</strong><p>${escapeHtml(request.response || "—")}</p></div>
            <div><strong>Ошибка</strong><p>${escapeHtml(request.error || "—")}</p></div>
        </div>
    `;
}

async function loadCustomerCards() {
  const cards = await apiGet("/api/superadmin/customer-cards");
  const tbody = document.querySelector("#customerCardsTableBody");
  tbody.innerHTML = cards
    .map(
      (card) => `
        <tr>
            <td>${escapeHtml([card.firstName, card.lastName].filter(Boolean).join(" ") || "-")}</td>
            <td>${card.vkUserId}</td>
            <td>${escapeHtml(card.companyName)}</td>
            <td>${card.dialogCount}</td>
            <td>${escapeHtml(truncate(card.lastMessage || "-", 90))}</td>
        </tr>
    `,
    )
    .join("");
}

async function loadDialogs() {
  const companyId = document
    .querySelector("#dialogCompanyFilter")
    ?.value.trim();
  const vkUserId = document.querySelector("#dialogVkFilter")?.value.trim();
  const status = document.querySelector("#dialogStatusFilter")?.value;
  const params = new URLSearchParams();
  if (companyId) params.set("companyId", companyId);
  if (vkUserId) params.set("vkUserId", vkUserId);
  if (status !== "") params.set("status", status);

  const query = params.toString();
  const dialogs = await apiGet(
    `/api/superadmin/dialogs${query ? `?${query}` : ""}`,
  );
  const tbody = document.querySelector("#dialogsTableBody");
  const statusLabels = ["Open", "InProgress", "Closed", "Archived"];
  tbody.innerHTML = dialogs
    .map(
      (dialog) => `
        <tr>
            <td>${dialog.id}</td>
            <td>${escapeHtml(dialog.companyName)}</td>
            <td>${dialog.vkUserId}</td>
            <td>${statusLabels[dialog.status] || "Unknown"}</td>
            <td>${formatDate(dialog.createdAt, true)}</td>
            <td><button class="ghost-button" type="button" onclick="showDialogDetail(${dialog.id})">Открыть</button></td>
        </tr>
    `,
    )
    .join("");
}

async function showDialogDetail(id) {
  const dialog = await apiGet(`/api/superadmin/dialogs/${id}`);
  const card = document.querySelector("#dialogDetail");
  const authorLabels = ["Клиент", "AI", "Оператор"];
  card.hidden = false;
  card.classList.add("detail-card--visible");
  card.innerHTML = `
        <h3>Диалог #${dialog.id}</h3>
        <div class="message-thread">
            ${(dialog.messages || [])
              .map(
                (message) => `
                <article class="message-bubble">
                    <p class="card-label">${authorLabels[message.author] || "Система"} • ${formatDate(message.createdAt, true)}</p>
                    <p>${escapeHtml(message.content)}</p>
                </article>
            `,
              )
              .join("")}
        </div>
    `;
}

async function loadLogs(level = null) {
  const params = new URLSearchParams();
  if (level !== null) params.set("level", String(level));
  const logs = await apiGet(
    `/api/superadmin/logs${params.toString() ? `?${params.toString()}` : ""}`,
  );
  const tbody = document.querySelector("#logsTableBody");
  tbody.innerHTML = logs
    .map(
      (log) => `
        <tr>
            <td>${formatDate(log.createdAt, true)}</td>
            <td>${escapeHtml(log.module)}</td>
            <td>${escapeHtml(log.message)}</td>
            <td>${escapeHtml(log.stackTrace || "-")}</td>
        </tr>
    `,
    )
    .join("");
}

function filterLogs(level) {
  loadLogs(level);
}
window.filterLogs = filterLogs;
window.blockCompany = blockCompany;
window.activateCompany = activateCompany;
window.deleteCompany = deleteCompany;
window.checkIntegration = checkIntegration;
window.showIntegrationDetail = showIntegrationDetail;
window.showAiRequestDetail = showAiRequestDetail;
window.showDialogDetail = showDialogDetail;

async function loadServiceStatus() {
  const status = await apiGet("/api/superadmin/service-status");
  const list = document.querySelector("#serviceStatusList");
  const items = [
    ["PostgreSQL", status.postgres],
    ["Redis", status.redis],
    ["VK API", status.vkApi],
    ["AI API", status.aiApi],
    ["Backend API", status.backendApi],
  ];

  list.innerHTML = items
    .map(
      ([name, value]) => `
        <div class="service-status-item">
            <span class="status-indicator ${mapStatusClass(value)}"></span>
            <span>${escapeHtml(name)}: ${escapeHtml(value)}</span>
        </div>
    `,
    )
    .join("");
}

async function loadGigaChatConfig() {
  const config = await apiGet("/api/superadmin/giga-chat/config");
  const container = document.querySelector("#gigaChatConfig");
  const statusClass = config.authKeyConfigured ? "ok" : "error";
  const statusLabel = config.authKeyConfigured ? "Настроен" : "Требует ключа";

  container.innerHTML = `
        <div class="setup-wizard">
            <div class="setup-steps">
                <div class="setup-step done"><span>1</span><p>Получить Authorization key</p></div>
                <div class="setup-step ${config.authKeyConfigured ? "done" : "active"}"><span>2</span><p>Сохранить в BizFlow</p></div>
                <div class="setup-step"><span>3</span><p>Проверить API</p></div>
                <div class="setup-step"><span>4</span><p>Бот VK отвечает через ИИ</p></div>
            </div>
        </div>

        <div class="report-item ${statusClass}" style="margin-bottom:18px">
            <strong>${config.authKeyConfigured ? "✅" : "⚠️"} Статус GigaChat: ${statusLabel}</strong>
            <p>${config.authKeyConfigured ? "Ключ сохранён. Проверьте соединение кнопкой ниже." : "Вставьте Authorization key из личного кабинета GigaChat."}</p>
        </div>

        <div class="detail-grid">
            <div><strong>Provider</strong><p>${escapeHtml(config.provider)}</p></div>
            <div><strong>Client ID</strong><p><code>${escapeHtml(config.clientId || "—")}</code></p></div>
            <div><strong>Scope</strong><p><code>${escapeHtml(config.scope || "—")}</code></p></div>
            <div><strong>Текущий ключ</strong><p>${escapeHtml(config.maskedAuthorizationKey || "не задан")}</p></div>
            <div><strong>OAuth URL</strong><p>${escapeHtml(config.oauthUrl)}</p></div>
            <div><strong>API URL</strong><p>${escapeHtml(config.apiUrl)}</p></div>
        </div>

        <form id="gigaChatForm" class="settings-form" style="margin-top:20px">
            <label>
                <span>Authorization key</span>
                <input id="gigaChatAuthKey" type="password" placeholder="Вставьте ключ из кабинета GigaChat" />
                <small>Ключ передаётся в заголовке Authorization: Basic при запросе Access token.</small>
            </label>
            <div class="form-actions">
                <button class="primary-button" type="submit">Сохранить ключ</button>
                <button class="ghost-button" type="button" id="testGigaChatButton">Проверить GigaChat</button>
            </div>
            <p id="gigaChatMessage" class="form-message" role="status"></p>
        </form>

        <div class="docs-grid" style="margin-top:20px">
            ${(config.setupGuide || [])
              .map(
                (step, index) => `
                <article class="doc-card ${index === 0 ? "emphasis-card" : ""}">
                    <p class="card-label">Шаг ${index + 1}</p>
                    <p>${escapeHtml(step)}</p>
                </article>
            `,
              )
              .join("")}
        </div>
        <div id="gigaChatTestReport" class="detail-card" hidden></div>
    `;

  document
    .querySelector("#gigaChatForm")
    ?.addEventListener("submit", saveGigaChatConfig);
  document
    .querySelector("#testGigaChatButton")
    ?.addEventListener("click", testGigaChatConnection);
}

async function saveGigaChatConfig(event) {
  event.preventDefault();
  const message = document.querySelector("#gigaChatMessage");
  const key = document.querySelector("#gigaChatAuthKey")?.value?.trim() || "";
  if (!key) {
    message.textContent = "Вставьте Authorization key.";
    message.className = "form-message error";
    return;
  }

  try {
    message.textContent = "Сохраняем ключ GigaChat...";
    message.className = "form-message";
    await apiPost("/api/superadmin/giga-chat/config", {
      authorizationKey: key,
    });
    message.textContent = "Ключ сохранён. Нажмите «Проверить GigaChat».";
    message.className = "form-message success";
    await loadGigaChatConfig();
  } catch (error) {
    message.textContent = error.message || "Не удалось сохранить ключ.";
    message.className = "form-message error";
  }
}

async function testGigaChatConnection() {
  const message = document.querySelector("#gigaChatMessage");
  const report = document.querySelector("#gigaChatTestReport");
  try {
    message.textContent = "Проверяем GigaChat API...";
    message.className = "form-message";
    const result = await apiPost("/api/superadmin/giga-chat/test");
    message.textContent = result.message || "GigaChat работает.";
    message.className = "form-message success";
    report.hidden = false;
    report.classList.add("detail-card--visible");
    report.innerHTML = `
            <div class="report-header">
                <h3>Тестовый ответ GigaChat</h3>
                <span class="badge">OK</span>
            </div>
            <p>${escapeHtml(result.sampleResponse || "Ответ получен.")}</p>
        `;
  } catch (error) {
    message.textContent =
      error.message || "GigaChat не отвечает. Проверьте Authorization key.";
    message.className = "form-message error";
  }
}

async function testVkBot() {
  const result = await apiPost("/api/superadmin/test-vk-bot");
  const reportDiv = document.querySelector("#testReport");
  reportDiv.hidden = false;
  reportDiv.classList.add("detail-card--visible");
  reportDiv.innerHTML = `
        <div class="report-header">
            <h3>Отчёт</h3>
            <span class="badge">Company #${result.companyId}</span>
        </div>
        <div class="report-list">
            ${(result.report || [])
              .map(
                (step) => `
                <div class="report-item">
                    <strong>${step.status === "Passed" ? "✅" : step.status === "Warning" ? "⚠️" : "❌"} ${escapeHtml(step.name)}</strong>
                    <p>${escapeHtml(step.details || "")}</p>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

async function createUserByAdmin(event) {
  event.preventDefault();

  const submitButton = createUserForm.querySelector("button[type='submit']");
  const payload = {
    email: document.querySelector("#createUserEmail")?.value.trim(),
    password: document.querySelector("#createUserPassword")?.value,
    firstName: document.querySelector("#createUserFirstName")?.value.trim(),
    lastName: document.querySelector("#createUserLastName")?.value.trim(),
    role: document.querySelector("#createUserRole")?.value,
    companyId: Number(
      document.querySelector("#createUserCompanyId")?.value || 0,
    ),
  };

  const validationError = validateCreateUserPayload(payload);
  if (validationError) {
    setInlineMessage(createUserMessage, validationError, "error");
    return;
  }

  setInlineMessage(createUserMessage, "Создаём пользователя...", "");
  submitButton.disabled = true;

  try {
    const result = await apiPost("/api/auth/admin/create-user", payload);
    setInlineMessage(
      createUserMessage,
      `Готово: ${result.user.email} создан с ролью ${result.user.role}.`,
      "success",
    );
    createUserForm.reset();
  } catch (error) {
    setInlineMessage(
      createUserMessage,
      error.message || "Не удалось создать пользователя.",
      "error",
    );
  } finally {
    submitButton.disabled = false;
  }
}

function getCurrentSection() {
  return (
    new URLSearchParams(window.location.search).get("section") || "dashboard"
  );
}

function isAdmin(role) {
  return role === 0 || String(role).toLowerCase() === "admin";
}

function mapStatusClass(value) {
  if (String(value).toLowerCase() === "online") return "online";
  if (String(value).toLowerCase() === "warning") return "warning";
  return "offline";
}

function formatVkStatus(value) {
  const numeric = Number(value);
  if (numeric === 1) return "✅ OK";
  if (numeric === 2) return "🟡 Warning";
  if (numeric === 3) return "🔴 Error";
  return "⚪ Unknown";
}

function truncate(value, length) {
  const text = String(value || "");
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

function formatDate(value, withTime) {
  if (!value) return "—";
  const date = new Date(value);
  return withTime ? date.toLocaleString() : date.toLocaleDateString();
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setInlineMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-message ${type}`.trim();
}

function validateCreateUserPayload(payload) {
  if (!payload.email) return "Укажите email пользователя.";
  if (!payload.password || payload.password.length < 6) {
    return "Пароль должен быть не короче 6 символов.";
  }
  if (!payload.role) return "Выберите роль пользователя.";
  if (payload.companyId < 0) return "Company ID не может быть отрицательным.";
  return "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

async function apiPatch(url, body = {}) {
  return request(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

async function apiDelete(url) {
  return request(url, { method: "DELETE" });
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

    if (response.status === 403) {
      error.message =
        "Доступ к admin запрещён. Перелогиньтесь под пользователем с ролью Admin.";
    }

    throw error;
  }

  return data;
}

function logout() {
  localStorage.removeItem("bizflow_token");
  localStorage.removeItem("bizflow_user");
  localStorage.removeItem("bizflow_company");
  window.location.href = "/auth?key=admin";
}
