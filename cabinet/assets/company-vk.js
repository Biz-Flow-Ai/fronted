(function () {
const api = window.BizFlowApi;

const vkConfigForm = document.querySelector("#vkConfigForm");
const vksContent = document.querySelector("#vksContent");
const pageError = document.querySelector("#pageError");
const addCommunitySection = document.querySelector("#addCommunitySection");
const addFormConnectedHint = document.querySelector("#addFormConnectedHint");
const connectionTypeSelect = document.querySelector("#connectionType");
const communityNameInput = document.querySelector("#communityName");
const targetIdInput = document.querySelector("#targetId");
const targetIdLabel = document.querySelector("#targetIdLabel");
const vkAccessTokenInput = document.querySelector("#vkAccessToken");
const maskedTokenHint = document.querySelector("#maskedTokenHint");
const callbackUrlInput = document.querySelector("#callbackUrl");
const secretKeyInput = document.querySelector("#secretKey");
const confirmationTokenInput = document.querySelector("#confirmationToken");
const confirmationTokenVisible = document.querySelector("#confirmationTokenVisible");
const vkConfigMessage = document.querySelector("#vkConfigMessage");
const connectedList = document.querySelector("#connectedList");
const connectedEmpty = document.querySelector("#connectedEmpty");
const connectionWarnings = document.querySelector("#connectionWarnings");
const checkReport = document.querySelector("#checkReport");
const connectButton = document.querySelector("#connectButton");
const checkVkButton = document.querySelector("#checkVkButton");
const saveManageButton = document.querySelector("#saveManageButton");
const managedCallbackPreview = document.querySelector("#managedCallbackPreview");
const managedSecretPreview = document.querySelector("#managedSecretPreview");
const copyCallbackButton = document.querySelector("#copyCallbackButton");
const copySecretButton = document.querySelector("#copySecretButton");
const generateSecretButton = document.querySelector("#generateSecretButton");
const setupCallbackButton = document.querySelector("#setupCallbackButton");
const toggleTokenButton = document.querySelector("#toggleTokenButton");
const addCommunityButton = document.querySelector("#addCommunityButton");
const manageModal = document.querySelector("#manageModal");
const closeManageModal = document.querySelector("#closeManageModal");
const manageCommunityName = document.querySelector("#manageCommunityName");
const manageTargetId = document.querySelector("#manageTargetId");
const manageTargetIdLabel = document.querySelector("#manageTargetIdLabel");
const manageVkAccessToken = document.querySelector("#manageVkAccessToken");
const manageTokenHint = document.querySelector("#manageTokenHint");
const manageToggleTokenButton = document.querySelector("#manageToggleTokenButton");
const manageTypeToggle = document.querySelector("#manageTypeToggle");
const manageModalSubtitle = document.querySelector("#manageModalSubtitle");
const copyDocsLinkButton = document.querySelector("#copyDocsLinkButton");

let managedCallbackUrl = `${window.location.origin}/api/vkbot/webhook`;
let latestConfig = null;
let hasSavedToken = false;
let manageConnectionType = "group";
let isCommunityConnected = false;

const VK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.254 2.151-3.185 2.151-3.185.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.203.322-.271.44 0 .78.186.254.78.780 1.186 1.253.745.712 1.304 1.253 1.459 1.642.17.407-.085.78-.576.78z"/></svg>`;

init();

async function init() {
  if (!api) return;
  if (!api.requireAuth()) return;

  bindEvents();

  try {
    setPageLoading(true);
    await api.waitForShell();
    await loadConfig();
  } catch (error) {
    console.error("VK init error:", error);
    showPageError(error.message || "Не удалось загрузить настройки VK.");
    api.showToast(error.message || "Ошибка загрузки VK", "error");
  } finally {
    setPageLoading(false);
  }
}

function bindEvents() {
  connectionTypeSelect?.addEventListener("change", updateAddModeUI);
  vkConfigForm?.addEventListener("submit", saveConfig);
  checkVkButton?.addEventListener("click", runCheck);
  saveManageButton?.addEventListener("click", saveFromModal);
  setupCallbackButton?.addEventListener("click", setupCallback);
  copyCallbackButton?.addEventListener("click", () =>
    copyText(managedCallbackUrl, "Callback URL скопирован."),
  );
  copySecretButton?.addEventListener("click", () =>
    copyText(secretKeyInput?.value.trim(), "Secret Key скопирован."),
  );
  generateSecretButton?.addEventListener("click", () => {
    if (secretKeyInput) secretKeyInput.value = generateSecret();
    syncManagedPreview();
    notify("Сгенерирован новый Secret Key. Сохраните настройки.", "success");
  });
  toggleTokenButton?.addEventListener("click", () => toggleTokenVisibility(vkAccessTokenInput, ".vks-eye-icon--hide", ".vks-eye-icon--show"));
  manageToggleTokenButton?.addEventListener("click", () =>
    toggleTokenVisibility(manageVkAccessToken, ".vks-eye-icon--hide-manage", ".vks-eye-icon--show-manage"),
  );
  addCommunityButton?.addEventListener("click", focusConnectForm);
  closeManageModal?.addEventListener("click", () => manageModal?.close());

  manageModal?.addEventListener("cancel", (event) => event.preventDefault());
  manageModal?.addEventListener("click", (event) => {
    if (event.target === manageModal) manageModal.close();
  });

  manageTypeToggle?.querySelectorAll(".vks-type-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setManageConnectionType(button.dataset.type);
    });
  });

  confirmationTokenVisible?.addEventListener("input", () => {
    if (confirmationTokenInput) {
      confirmationTokenInput.value = confirmationTokenVisible.value.trim();
    }
  });

  copyDocsLinkButton?.addEventListener("click", () =>
    copyText(`${window.location.origin}/company/docs#vk-integration`, "Ссылка на документацию скопирована."),
  );

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) discardUnsavedAddFormDraft();
  });

  manageModal?.addEventListener("close", () => {
    if (latestConfig) fillManageForm(latestConfig);
  });
}

function discardUnsavedAddFormDraft() {
  clearAddForm();
  vkConfigForm?.reset();
}

async function loadConfig() {
  const config = await api.get("/api/company/my/vk-config");
  latestConfig = config;
  hasSavedToken = Boolean(config.hasAccessToken);
  isCommunityConnected = Boolean(config.targetId || config.hasAccessToken);
  managedCallbackUrl =
    config.managedCallbackUrl || `${window.location.origin}/api/vkbot/webhook`;

  if (callbackUrlInput) callbackUrlInput.value = config.callbackUrl || managedCallbackUrl;
  if (secretKeyInput) secretKeyInput.value = config.secretKey || "";
  const confirmation = config.confirmationToken || "";
  if (confirmationTokenInput) confirmationTokenInput.value = confirmation;
  if (confirmationTokenVisible) confirmationTokenVisible.value = confirmation;

  discardUnsavedAddFormDraft();
  updateAddFormState();
  syncManagedPreview();
  renderConnectedCommunities(config);
  renderWarnings(config);
  clearPageError();
}

function clearAddForm() {
  if (communityNameInput) communityNameInput.value = "";
  if (connectionTypeSelect) connectionTypeSelect.value = "group";
  if (targetIdInput) targetIdInput.value = "";
  if (vkAccessTokenInput) vkAccessTokenInput.value = "";
  if (maskedTokenHint) {
    maskedTokenHint.textContent = "Токен необходим для получения и отправки сообщений";
  }
  updateAddModeUI();
}

function updateAddFormState() {
  if (isCommunityConnected) {
    clearAddForm();
    addFormConnectedHint && (addFormConnectedHint.hidden = false);
    vkConfigForm?.classList.add("vks-form--secondary");
    addCommunitySection?.classList.add("vks-card--secondary");
  } else {
    addFormConnectedHint && (addFormConnectedHint.hidden = true);
    vkConfigForm?.classList.remove("vks-form--secondary");
    addCommunitySection?.classList.remove("vks-card--secondary");
  }
}

function fillManageForm(config) {
  manageConnectionType = config.connectionType || "group";
  setManageConnectionType(manageConnectionType, false);

  if (manageCommunityName) {
    manageCommunityName.value = config.communityName || config.companyName || "";
  }
  if (manageTargetId) manageTargetId.value = config.targetId || "";
  if (manageVkAccessToken) manageVkAccessToken.value = "";
  if (manageTokenHint) {
    manageTokenHint.textContent = hasSavedToken
      ? `Текущий токен сохранён: ${config.maskedAccessToken}. Оставьте поле пустым, чтобы не менять.`
      : "Введите Access Token сообщества";
  }
  if (confirmationTokenVisible) {
    confirmationTokenVisible.value = config.confirmationToken || confirmationTokenInput?.value || "";
  }
  if (confirmationTokenInput) {
    confirmationTokenInput.value = confirmationTokenVisible?.value || config.confirmationToken || "";
  }
  if (secretKeyInput && config.secretKey) secretKeyInput.value = config.secretKey;

  manageModalSubtitle.textContent = config.communityName
    ? `${config.communityName} · ID ${config.targetId || "—"}`
    : "Настройки подключённого сообщества";
  syncManagedPreview();
}

function setManageConnectionType(type, updateLabel = true) {
  manageConnectionType = type === "personal" ? "personal" : "group";
  manageTypeToggle?.querySelectorAll(".vks-type-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.type === manageConnectionType);
  });
  if (updateLabel && manageTargetIdLabel) {
    manageTargetIdLabel.textContent =
      manageConnectionType === "personal" ? "VK ID менеджера" : "ID сообщества";
  }
}

function setConnectedEmptyVisible(visible) {
  if (!connectedEmpty) return;
  connectedEmpty.hidden = !visible;
  connectedEmpty.style.display = visible ? "" : "none";
}

function isGenericVkPhoto(url) {
  const value = String(url || "");
  return /\/images\/(community|camera|deactivated)_100\.png/i.test(value);
}

function renderCommunityAvatar(config) {
  const photoUrl = String(config.communityPhotoUrl || "").trim();
  if (photoUrl && !isGenericVkPhoto(photoUrl)) {
    return `
      <div class="vks-community-icon vks-community-icon--photo">
        <img
          class="vks-community-photo"
          src="${escapeHtml(photoUrl)}"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <span class="vks-community-icon-fallback" hidden aria-hidden="true">${VK_ICON}</span>
      </div>`;
  }

  return `<div class="vks-community-icon vks-community-icon--fallback">${VK_ICON}</div>`;
}

function bindCommunityAvatarFallback(card) {
  const img = card.querySelector(".vks-community-photo");
  const fallback = card.querySelector(".vks-community-icon-fallback");
  const iconWrap = card.querySelector(".vks-community-icon--photo");
  if (!img || !fallback || !iconWrap) return;

  img.addEventListener("error", () => {
    iconWrap.classList.remove("vks-community-icon--photo");
    iconWrap.classList.add("vks-community-icon--fallback");
    img.remove();
    fallback.hidden = false;
  });
}

function renderConnectedCommunities(config) {
  connectedList?.querySelectorAll(".vks-community").forEach((node) => node.remove());

  const hasCommunity = Boolean(config.targetId || config.hasAccessToken);
  if (!hasCommunity) {
    setConnectedEmptyVisible(true);
    return;
  }

  setConnectedEmptyVisible(false);

  const fullyConnected =
    config.isConnected && !config.callbackIsLocal && config.confirmationTokenConfigured;

  const typeLabel =
    config.connectionType === "personal" ? "Личный аккаунт" : "Публичная страница";
  const name = config.communityName || config.companyName || "Сообщество VK";
  const statusLabel = fullyConnected ? "Подключено" : "Требует настройки";
  const badgeClass = fullyConnected ? "vks-badge--ok" : "vks-badge--warn";
  const activityStatus = fullyConnected ? "Активно" : "Настройка";
  const activityClass = fullyConnected ? "ok" : "";
  const connectedDate = config.lastActivityAt ? formatDate(config.lastActivityAt) : "—";
  const vkUrl = config.targetId ? `https://vk.com/club${config.targetId}` : "#";

  const card = document.createElement("article");
  card.className = "vks-community";
  card.innerHTML = `
    <div class="vks-community-top">
      ${renderCommunityAvatar(config)}
      <div class="vks-community-meta">
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(typeLabel)}</p>
      </div>
      <div class="vks-community-actions">
        <span class="vks-badge ${badgeClass}">${escapeHtml(statusLabel)}</span>
        <button type="button" class="vks-menu-btn" data-action="manage" aria-label="Управление">⋯</button>
      </div>
    </div>
    <div class="vks-stats">
      <div class="vks-stat">
        <label>ID сообщества</label>
        <strong>${escapeHtml(config.targetId || "—")}</strong>
      </div>
      <div class="vks-stat">
        <label>Сообщений сегодня</label>
        <strong>${escapeHtml(String(config.messagesToday ?? 0))}</strong>
      </div>
      <div class="vks-stat">
        <label>Статус</label>
        <strong class="${activityClass}">${escapeHtml(activityStatus)}</strong>
      </div>
      <div class="vks-stat">
        <label>Активность</label>
        <strong>${escapeHtml(connectedDate)}</strong>
      </div>
    </div>
    <div class="vks-community-footer">
      <button type="button" class="vks-manage-btn" data-action="manage">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Управление
      </button>
      ${
        config.targetId
          ? `<a class="vks-link vks-open-vk" href="${escapeHtml(vkUrl)}" target="_blank" rel="noreferrer">Открыть в VK</a>`
          : ""
      }
    </div>
  `;

  connectedList?.appendChild(card);
  bindCommunityAvatarFallback(card);
  card.querySelectorAll('[data-action="manage"]').forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openManageModal();
    });
  });
}

function openManageModal() {
  if (!latestConfig) return;
  fillManageForm(latestConfig);
  manageModal?.showModal();
}

function renderWarnings(config) {
  const warnings = [];
  if (config.callbackIsLocal) {
    warnings.push("Завершите настройку Callback API в окне «Управление» или обратитесь в поддержку.");
  }
  if (!config.confirmationTokenConfigured) {
    warnings.push("Скопируйте confirmation token в VK → Callback API → Строка подтверждения.");
  }
  if (!warnings.length) {
    if (connectionWarnings) {
      connectionWarnings.hidden = true;
      connectionWarnings.innerHTML = "";
    }
    return;
  }
  if (connectionWarnings) {
    connectionWarnings.hidden = false;
    connectionWarnings.innerHTML = warnings
      .map((item) => `<div class="vks-warning">${escapeHtml(item)}</div>`)
      .join("");
  }
}

function updateAddModeUI() {
  if (!connectionTypeSelect) return;
  const isPersonal = connectionTypeSelect.value === "personal";
  if (targetIdLabel) {
    targetIdLabel.textContent = isPersonal ? "VK ID менеджера" : "ID сообщества";
  }
}

function syncManagedPreview() {
  if (managedCallbackPreview) managedCallbackPreview.textContent = managedCallbackUrl || "—";
  if (managedSecretPreview) managedSecretPreview.textContent = secretKeyInput?.value.trim() || "—";
}

function toggleTokenVisibility(input, hideSelector, showSelector) {
  if (!input) return;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  const hideIcon = document.querySelector(hideSelector);
  const showIcon = document.querySelector(showSelector);
  if (hideIcon) hideIcon.hidden = !isPassword;
  if (showIcon) showIcon.hidden = isPassword;
}

function focusConnectForm() {
  if (isCommunityConnected) {
    clearAddForm();
    notify("Заполните форму, чтобы заменить текущее подключение на другое сообщество.", "info");
  }
  addCommunitySection?.scrollIntoView({ behavior: "smooth", block: "start" });
  communityNameInput?.focus();
}

async function saveConfig(event) {
  event.preventDefault();
  await persistConfig({ source: "add", closeModal: false });
}

async function saveFromModal() {
  await persistConfig({ source: "manage", closeModal: true });
}

function syncManageFieldsToHidden() {
  if (confirmationTokenVisible && confirmationTokenInput) {
    confirmationTokenInput.value = confirmationTokenVisible.value.trim();
  }
}

async function persistConfig({ source, closeModal }) {
  syncManageFieldsToHidden();

  const payload = source === "manage" ? getManageFormPayload() : getAddFormPayload();
  const previousTargetId = latestConfig?.targetId || "";
  const validationErrors = validateForm(payload, {
    requireToken: source === "add",
    allowExistingToken: source === "manage",
  });
  if (validationErrors.length) {
    notify(validationErrors[0], "error");
    return;
  }

  if (source === "add") {
    if (!payload.secretKey) payload.secretKey = generateSecret();
    if (!payload.confirmationToken) payload.confirmationToken = generateSecret().slice(0, 16);
  }

  try {
    setBusy(true);
    notify("Сохраняем настройки VK...", "info");
    await api.post("/api/company/my/vk-config", payload);
    const groupSwitched =
      payload.connectionType === "group" &&
      previousTargetId &&
      payload.targetId &&
      normalizeTargetId(previousTargetId, false) !== normalizeTargetId(payload.targetId, false);

    if (payload.connectionType === "group" && (payload.vkAccessToken || hasSavedToken)) {
      try {
        const result = await api.post("/api/company/my/vk-setup-callback");
        await loadConfig();
        notify(
          groupSwitched
            ? result.message || "Новая группа VK подключена, Callback API настроен."
            : result.message || "Callback API настроен.",
          "success",
        );
      } catch (setupError) {
        await loadConfig();
        notify(
          groupSwitched
            ? `Группа сохранена, но Callback API не настроен: ${setupError.message}. Нажмите «Настроить Callback API».`
            : `Настройки сохранены. Callback API: ${setupError.message}`,
          "error",
        );
      }
    } else {
      await loadConfig();
      notify("Настройки VK сохранены", "success");
    }

    if (closeModal) manageModal?.close();
  } catch (error) {
    const serverErrors = api.extractErrors(error);
    notify(error.message || "Не удалось сохранить.", "error");
    if (serverErrors.length) renderClientValidationReport("Ошибки валидации", serverErrors);
  } finally {
    setBusy(false);
  }
}

async function setupCallback() {
  syncManageFieldsToHidden();
  await setupCallbackInternal();
}

async function setupCallbackInternal() {
  const payload = getManageFormPayload();
  const validationErrors = validateForm(payload, { requireToken: false, allowExistingToken: true });
  if (validationErrors.length) {
    notify(validationErrors[0], "error");
    return;
  }

  try {
    setBusy(true);
    notify("Сначала сохраняем изменения...", "info");
    await api.post("/api/company/my/vk-config", payload);
    const result = await api.post("/api/company/my/vk-setup-callback");
    await loadConfig();
    notify(result.message || "Callback API настроен", "success");
  } catch (error) {
    notify(error.message || "Не удалось настроить Callback API.", "error");
  } finally {
    setBusy(false);
  }
}

async function runCheck() {
  syncManageFieldsToHidden();
  const payload = getManageFormPayload();
  const validationErrors = validateForm(payload, { requireToken: false, allowExistingToken: true });
  if (validationErrors.length) {
    notify(validationErrors[0], "error");
    return;
  }

  try {
    setBusy(true);
    notify("Проверяем подключение VK...", "info");
    await api.post("/api/company/my/vk-config", payload);
    const report = await api.post("/api/company/my/vk-check");
    renderCheckReport(report);
    await loadConfig();
    notify(report.summary || "Проверка завершена", report.overallStatus === 1 ? "success" : "info");
  } catch (error) {
    notify(error.message || "Не удалось выполнить проверку.", "error");
    const serverErrors = api.extractErrors(error);
    if (serverErrors.length) renderClientValidationReport("Ошибки конфигурации", serverErrors);
  } finally {
    setBusy(false);
  }
}

function getAddFormPayload() {
  const isPersonal = connectionTypeSelect?.value === "personal";
  return {
    connectionType: connectionTypeSelect?.value || "group",
    communityName: communityNameInput?.value.trim() || "",
    targetId: targetIdInput?.value.trim() || "",
    vkAccessToken: vkAccessTokenInput?.value.trim() || "",
    callbackUrl: isPersonal ? callbackUrlInput?.value.trim() || "" : managedCallbackUrl,
    secretKey: secretKeyInput?.value.trim() || "",
    confirmationToken: confirmationTokenInput?.value.trim() || "",
  };
}

function getManageFormPayload() {
  const isPersonal = manageConnectionType === "personal";
  const targetId = manageTargetId?.value.trim() || latestConfig?.targetId || "";
  return {
    connectionType: manageConnectionType,
    communityName: manageCommunityName?.value.trim() || "",
    targetId,
    vkAccessToken: manageVkAccessToken?.value.trim() || "",
    callbackUrl: isPersonal ? callbackUrlInput?.value.trim() || "" : managedCallbackUrl,
    secretKey: secretKeyInput?.value.trim() || "",
    confirmationToken: confirmationTokenVisible?.value.trim() || confirmationTokenInput?.value.trim() || "",
  };
}

function renderCheckReport(report) {
  if (!checkReport) return;
  checkReport.hidden = false;
  checkReport.innerHTML = `
    <h3>Отчёт по проверке <span class="vks-badge ${report.overallStatus === 1 ? "vks-badge--ok" : "vks-badge--warn"}">${escapeHtml(formatVkStatus(report.overallStatus))}</span></h3>
    <p class="vks-hint">${escapeHtml(report.summary || "")}</p>
    <div class="vks-report-list">
      ${(report.checks || [])
        .map(
          (check) => `
        <div class="vks-report-item ${check.ok ? "ok" : "error"}">
          <strong>${check.ok ? "OK" : "Ошибка"} — ${escapeHtml(check.label)}</strong>
          <p>${escapeHtml(check.details || "")}</p>
        </div>`,
        )
        .join("")}
    </div>`;
  checkReport.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderClientValidationReport(title, errors) {
  if (!checkReport) return;
  checkReport.hidden = false;
  checkReport.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <div class="vks-report-list">
      ${errors.map((error) => `<div class="vks-report-item error"><p>${escapeHtml(error)}</p></div>`).join("")}
    </div>`;
}

function notify(message, type = "info") {
  if (!message || !api) return;
  if (vkConfigMessage) {
    vkConfigMessage.hidden = false;
    vkConfigMessage.textContent = message;
    vkConfigMessage.className = `vks-message ${type}`.trim();
  }
  api.showToast(message, type);
}

function showPageError(message) {
  if (!pageError) return;
  pageError.hidden = false;
  pageError.textContent = message;
}

function clearPageError() {
  if (!pageError) return;
  pageError.hidden = true;
  pageError.textContent = "";
}

function setPageLoading(isLoading) {
  vksContent?.classList.toggle("bf-page-loading", isLoading);
}

function setBusy(isBusy) {
  if (connectButton) connectButton.disabled = isBusy;
  if (checkVkButton) checkVkButton.disabled = isBusy;
  if (saveManageButton) saveManageButton.disabled = isBusy;
  if (setupCallbackButton) setupCallbackButton.disabled = isBusy;
}

function validateForm(payload, { requireToken = false, allowExistingToken = false } = {}) {
  const errors = [];
  if (!payload.targetId) {
    errors.push("Укажите ID сообщества или ссылку VK.");
  } else if (payload.connectionType === "personal") {
    const normalized = normalizeTargetId(payload.targetId, true);
    if (!/^\d+$/.test(normalized)) errors.push("Для личного аккаунта укажите numeric VK ID.");
  } else {
    const normalized = normalizeTargetId(payload.targetId, false);
    if (!/^\d+$/.test(normalized) && !/^[a-zA-Z0-9_.]+$/.test(normalized)) {
      errors.push("Некорректный ID сообщества.");
    }
  }

  if (requireToken && !payload.vkAccessToken && !(allowExistingToken && hasSavedToken)) {
    errors.push("Нужен Access Token — вставьте токен.");
  }

  if (payload.vkAccessToken) {
    if (/\s/.test(payload.vkAccessToken)) errors.push("Токен не должен содержать пробелы.");
    else if (payload.vkAccessToken.length < 20) errors.push("Токен слишком короткий.");
  }

  if (payload.secretKey && (payload.secretKey.includes(" ") || payload.secretKey.length < 6)) {
    errors.push("Secret Key: минимум 6 символов без пробелов.");
  }

  return errors;
}

function formatVkStatus(value) {
  const numeric = Number(value);
  if (numeric === 1) return "OK";
  if (numeric === 2) return "Warning";
  if (numeric === 3) return "Error";
  return "Unknown";
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
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
  if (/^club\d+$/i.test(normalized)) return normalized.replace(/^club/i, "");
  if (/^public\d+$/i.test(normalized)) return normalized.replace(/^public/i, "");
  return normalized;
}

function generateSecret() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID().replace(/-/g, "");
  return `${Date.now()}${Math.random().toString(16).slice(2)}`;
}

async function copyText(value, successMessage) {
  if (!value) {
    notify("Сначала сохраните значение.", "error");
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    notify(successMessage, "success");
  } catch {
    notify("Скопируйте значение вручную.", "error");
  }
}
})();
