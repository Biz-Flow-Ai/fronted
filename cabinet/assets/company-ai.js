(function () {
const api = window.BizFlowApi;

if (!api) {
  document.body.innerHTML =
    '<p style="padding:24px;color:#fff;font-family:sans-serif">Ошибка загрузки. Обновите страницу (Ctrl+F5).</p>';
} else if (!api.requireAuth()) {
  /* redirect */
}

const PRESET_ICONS = {
  shop: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  services: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  cafe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  beauty: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  education: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>',
  freelance: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  auto: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17h14v-5H5v5zM5 12l2-4h10l2 4"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>',
  medical: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  general: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
};

const BEHAVIOR_RULES = {
  behaviorIntro: "Всегда представляйся от имени компании.",
  behaviorBudget: "Уточняй бюджет проекта, если клиент интересуется услугой.",
  behaviorDeadline: "Уточняй сроки выполнения, если это уместно.",
  behaviorContacts: "Собирай контактные данные клиента для обратной связи.",
};

const WORK_DAYS = [
  { id: 1, short: "Пн" },
  { id: 2, short: "Вт" },
  { id: 3, short: "Ср" },
  { id: 4, short: "Чт" },
  { id: 5, short: "Пт" },
  { id: 6, short: "Сб" },
  { id: 7, short: "Вс" },
];

let presets = [];
let currentSettings = null;
let selectedBusinessType = "general";
let services = [];
let consultationTypes = [];
let consultationMeta = { enabled: true, autoRemind: true, remindHoursBefore: 24 };
let businessKnowledge = createEmptyBusinessKnowledge();
let savedSnapshot = null;

function createEmptyBusinessKnowledge() {
  return {
    city: "",
    address: "",
    businessPhone: "",
    website: "",
    serviceTypes: "",
    productsDescription: "",
    targetAudience: "",
    advantages: "",
    policies: "",
    fullDetails: "",
    documentText: "",
    lastAnalysis: null,
  };
}

const presetGrid = document.getElementById("presetGrid");
const servicesList = document.getElementById("servicesList");
const emptyServices = document.getElementById("emptyServices");
const serviceRowTemplate = document.getElementById("serviceRowTemplate");
const formMessage = document.getElementById("formMessage");
const aisContent = document.querySelector(".ais-content");

init();

async function init() {
  if (!api) return;
  if (!api.requireAuth()) return;

  bindTabs();
  bindSliders();
  bindActions();
  bindScheduleControls();

  document.querySelectorAll(".ais-style-card").forEach((card) => {
    card.addEventListener("click", () => selectTone(card.dataset.tone));
  });

  try {
    setPageLoading(true);
    await api.waitForShell();

    const vkConfig = await api.getVkConfig();
    if (!api.isVkIntegrated(vkConfig)) {
      api.showIntegrationGate({
        title: "Доступ ограничен",
        message:
          "Сначала подключите сообщество VK в разделе интеграций. Без этого AI-бот не сможет отвечать клиентам в сообщениях.",
      });
      setMessage("Подключите VK, чтобы настроить бота", "error");
      return;
    }

    api.hideIntegrationGate();

    presets = await api.get("/api/company/ai-presets");
    renderPresets();

    currentSettings = await api.get("/api/company/my/ai-settings");
    fillForm(currentSettings);
    savedSnapshot = JSON.stringify(collectPayload());

    if (!currentSettings.businessName) {
      document.querySelector(".ais-details")?.setAttribute("open", "");
    }
  } catch (error) {
    console.error("AI init error:", error);
    setMessage(error.message || "Не удалось загрузить настройки AI", "error");
    api.showToast(error.message || "Ошибка загрузки AI", "error");
    if (presetGrid) {
      presetGrid.innerHTML =
        '<p class="ais-empty">Не удалось загрузить шаблоны. Обновите страницу.</p>';
    }
  } finally {
    setPageLoading(false);
  }
}

function bindTabs() {
  document.querySelectorAll(".ais-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".ais-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".ais-tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`)?.classList.add("active");
    });
  });

  document.getElementById("templatesLink")?.addEventListener("click", () => {
    document.querySelector('.ais-tab[data-tab="templates"]')?.click();
  });

  document.getElementById("configureScenarioBtn")?.addEventListener("click", () => {
    document.querySelector(".ais-details")?.setAttribute("open", "");
    document.querySelector(".ais-details")?.scrollIntoView({ behavior: "smooth" });
  });
}

function bindStyleCards() {
  /* handled in init */
}

function setPageLoading(isLoading) {
  aisContent?.classList.toggle("bf-page-loading", isLoading);
}

function bindSliders() {
  const creativity = document.getElementById("creativityRange");
  const maxLength = document.getElementById("maxLengthRange");
  const creativityValue = document.getElementById("creativityValue");
  const maxLengthValue = document.getElementById("maxLengthValue");

  creativity?.addEventListener("input", () => {
    creativityValue.textContent = (creativity.value / 100).toFixed(1);
  });

  maxLength?.addEventListener("input", () => {
    maxLengthValue.textContent = maxLength.value;
  });
}

function bindScheduleControls() {
  document.querySelectorAll("#workDaysToggle .ais-day-btn").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      updateWorkingHoursPreview();
    });
  });

  document.getElementById("workTimeFrom")?.addEventListener("change", updateWorkingHoursPreview);
  document.getElementById("workTimeTo")?.addEventListener("change", updateWorkingHoursPreview);
}

function fillWorkingHoursSchedule(raw) {
  const parsed = parseWorkingHours(raw);
  document.querySelectorAll("#workDaysToggle .ais-day-btn").forEach((button) => {
    const day = Number(button.dataset.day);
    button.classList.toggle("active", parsed.days.includes(day));
  });
  const fromInput = document.getElementById("workTimeFrom");
  const toInput = document.getElementById("workTimeTo");
  if (fromInput) fromInput.value = parsed.from;
  if (toInput) toInput.value = parsed.to;
  updateWorkingHoursPreview();
}

function syncWorkingHoursToHidden() {
  const hidden = document.getElementById("workingHours");
  if (hidden) hidden.value = serializeWorkingHours();
}

function updateWorkingHoursPreview() {
  const preview = document.getElementById("workHoursPreview");
  const text = serializeWorkingHours();
  if (preview) preview.textContent = text || "Выберите дни и время";
  syncWorkingHoursToHidden();
}

function getSelectedWorkDays() {
  return Array.from(document.querySelectorAll("#workDaysToggle .ais-day-btn.active"))
    .map((button) => Number(button.dataset.day))
    .filter((day) => day >= 1 && day <= 7)
    .sort((a, b) => a - b);
}

function serializeWorkingHours() {
  const days = getSelectedWorkDays();
  if (!days.length) return "";

  const from = document.getElementById("workTimeFrom")?.value || "09:00";
  const to = document.getElementById("workTimeTo")?.value || "18:00";
  return `${formatDayRange(days)} ${from}–${to}`;
}

function formatDayRange(days) {
  if (days.length === 7) return "Ежедневно";
  if (days.length === 5 && days[0] === 1 && days[4] === 5) return "Пн–Пт";
  if (days.length === 2 && days[0] === 6 && days[1] === 7) return "Сб–Вс";

  const labels = new Map(WORK_DAYS.map((day) => [day.id, day.short]));
  const parts = [];
  let start = days[0];
  let prev = days[0];

  for (let index = 1; index <= days.length; index++) {
    const current = days[index];
    if (current === prev + 1) {
      prev = current;
      continue;
    }

    parts.push(start === prev ? labels.get(start) : `${labels.get(start)}–${labels.get(prev)}`);
    start = current;
    prev = current;
  }

  return parts.join(", ");
}

function parseWorkingHours(raw) {
  const result = { days: [1, 2, 3, 4, 5], from: "09:00", to: "18:00" };
  const value = String(raw || "").trim();
  if (!value) return result;

  const timeMatch = value.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (timeMatch) {
    result.from = padTime(timeMatch[1]);
    result.to = padTime(timeMatch[2]);
  }

  const lower = value.toLowerCase();
  if (lower.includes("ежедневно")) {
    result.days = [1, 2, 3, 4, 5, 6, 7];
    return result;
  }

  const dayMap = {
    пн: 1,
    вт: 2,
    ср: 3,
    чт: 4,
    пт: 5,
    сб: 6,
    вс: 7,
  };

  const rangeMatch = lower.match(/(пн|вт|ср|чт|пт|сб|вс)\s*[–-]\s*(пн|вт|ср|чт|пт|сб|вс)/);
  if (rangeMatch) {
    const fromDay = dayMap[rangeMatch[1]];
    const toDay = dayMap[rangeMatch[2]];
    if (fromDay && toDay) {
      result.days = [];
      for (let day = fromDay; day <= toDay; day++) result.days.push(day);
      return result;
    }
  }

  const found = Object.entries(dayMap)
    .filter(([label]) => lower.includes(label))
    .map(([, id]) => id);
  if (found.length) result.days = [...new Set(found)].sort((a, b) => a - b);

  return result;
}

function padTime(value) {
  const match = String(value).match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "09:00";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function bindActions() {
  document.getElementById("saveButton")?.addEventListener("click", saveSettings);
  document.getElementById("resetButton")?.addEventListener("click", resetSettings);
  document.getElementById("addServiceButton")?.addEventListener("click", () => addService());
  document.getElementById("addConsultationTypeBtn")?.addEventListener("click", () => addConsultationType());
  document.getElementById("previewButton")?.addEventListener("click", previewPrompt);
  document.getElementById("testButton")?.addEventListener("click", testAiReply);
  document.getElementById("isEnabled")?.addEventListener("change", onAutoReplyToggle);
  document.getElementById("bkUploadBtn")?.addEventListener("click", () => document.getElementById("bkDocumentFile")?.click());
  document.getElementById("bkDocumentFile")?.addEventListener("change", uploadBusinessDocument);
  document.getElementById("analyzeBusinessBtn")?.addEventListener("click", analyzeBusiness);
  document.getElementById("testPhoneBtn")?.addEventListener("click", testPhoneReply);
}

let autoReplyToggleTimer;
async function onAutoReplyToggle() {
  clearTimeout(autoReplyToggleTimer);
  autoReplyToggleTimer = setTimeout(async () => {
    const enabled = document.getElementById("isEnabled")?.checked ?? true;
    try {
      const result = await api.request("/api/company/my/ai-settings/enabled", {
        method: "PATCH",
        body: JSON.stringify({ isEnabled: enabled }),
      });
      currentSettings = result.settings || currentSettings;
      if (currentSettings) currentSettings.isEnabled = result.isEnabled;
      setMessage(result.message, "success");
    } catch (error) {
      setMessage(error.message || "Не удалось переключить автоответчик", "error");
    }
  }, 250);
}

function renderPresets() {
  if (!presetGrid) return;

  if (!presets?.length) {
    presetGrid.innerHTML = '<p class="ais-empty">Загрузка шаблонов...</p>';
    return;
  }

  presetGrid.innerHTML = presets
    .map(
      (preset) => `
        <button type="button" class="ais-preset-card" data-type="${preset.type}">
          <span class="ais-preset-icon">${PRESET_ICONS[preset.type] || PRESET_ICONS.general}</span>
          <span class="ais-preset-title">${escapeHtml(preset.title)}</span>
          <span class="ais-preset-desc">${escapeHtml(preset.description)}</span>
        </button>
      `,
    )
    .join("");

  presetGrid.querySelectorAll(".ais-preset-card").forEach((card) => {
    card.addEventListener("click", () => applyPreset(card.dataset.type));
  });

  highlightPreset(selectedBusinessType);
}

function highlightPreset(type) {
  selectedBusinessType = type;
  presetGrid?.querySelectorAll(".ais-preset-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.type === type);
  });
}

function selectTone(tone) {
  document.getElementById("tone").value = tone;
  document.querySelectorAll(".ais-style-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.tone === tone);
  });
}

function fillForm(settings) {
  selectedBusinessType = settings.businessType || "general";
  document.getElementById("businessName").value = settings.businessName || "";
  document.getElementById("businessDescription").value = settings.businessDescription || "";
  document.getElementById("projectDescription").value = settings.projectDescription || "";
  fillWorkingHoursSchedule(settings.workingHours || "");
  document.getElementById("greetingHint").value = settings.greetingHint || "";
  document.getElementById("isEnabled").checked = settings.isEnabled !== false;

  selectTone(settings.tone || "friendly");
  document.getElementById("responseLength").value = settings.responseLength || "medium";

  const { baseInstructions, meta } = parseCustomInstructions(settings.customInstructions || "");
  document.getElementById("customInstructions").value = baseInstructions;

  if (meta.creativity != null) {
    document.getElementById("creativityRange").value = Math.round(meta.creativity * 100);
    document.getElementById("creativityValue").textContent = meta.creativity.toFixed(1);
  }
  if (meta.maxLength != null) {
    document.getElementById("maxLengthRange").value = meta.maxLength;
    document.getElementById("maxLengthValue").textContent = meta.maxLength;
  }
  if (meta.emojiUsage) document.getElementById("emojiUsage").value = meta.emojiUsage;
  if (meta.responseFormat) document.getElementById("responseFormat").value = meta.responseFormat;
  if (meta.language) document.getElementById("language").value = meta.language;

  Object.keys(BEHAVIOR_RULES).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.checked = meta.behaviors?.[id] !== false;
  });

  services = parseProductsCatalog(settings.productsCatalog);
  if (!services.length && settings.businessType === "shop") {
    services = [{ name: "", price: "", description: "" }];
  }
  renderServices();
  fillConsultationSettings(settings.consultationSettings || "");
  fillBusinessKnowledge(settings.businessKnowledgeJson || "");
  highlightPreset(selectedBusinessType);
}

function parseBusinessKnowledge(raw) {
  if (!raw) return createEmptyBusinessKnowledge();
  try {
    const data = JSON.parse(raw);
    return { ...createEmptyBusinessKnowledge(), ...data };
  } catch {
    return createEmptyBusinessKnowledge();
  }
}

function fillBusinessKnowledge(raw) {
  businessKnowledge = parseBusinessKnowledge(raw);
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
  };
  set("bkCity", businessKnowledge.city);
  set("bkAddress", businessKnowledge.address);
  set("bkPhone", businessKnowledge.businessPhone);
  set("bkWebsite", businessKnowledge.website);
  set("bkServiceTypes", businessKnowledge.serviceTypes);
  set("bkProducts", businessKnowledge.productsDescription);
  set("bkAudience", businessKnowledge.targetAudience);
  set("bkAdvantages", businessKnowledge.advantages);
  set("bkPolicies", businessKnowledge.policies);
  set("bkFullDetails", businessKnowledge.fullDetails);

  const status = document.getElementById("bkDocumentStatus");
  const preview = document.getElementById("bkDocumentPreview");
  if (businessKnowledge.documentText) {
    if (status) status.textContent = `Загружено: ${businessKnowledge.documentText.length} символов`;
    if (preview) {
      preview.textContent = businessKnowledge.documentText.slice(0, 1200) + (businessKnowledge.documentText.length > 1200 ? "…" : "");
      preview.hidden = false;
    }
  } else {
    if (status) status.textContent = "Файл не выбран";
    if (preview) preview.hidden = true;
  }

  renderAnalysisResult(businessKnowledge.lastAnalysis);
}

function collectBusinessKnowledge() {
  const get = (id) => document.getElementById(id)?.value?.trim() || "";
  businessKnowledge = {
    ...businessKnowledge,
    city: get("bkCity"),
    address: get("bkAddress"),
    businessPhone: get("bkPhone"),
    website: get("bkWebsite"),
    serviceTypes: get("bkServiceTypes"),
    productsDescription: get("bkProducts"),
    targetAudience: get("bkAudience"),
    advantages: get("bkAdvantages"),
    policies: get("bkPolicies"),
    fullDetails: get("bkFullDetails"),
  };
  return JSON.stringify(businessKnowledge);
}

function renderAnalysisResult(analysis) {
  const card = document.getElementById("analysisResultCard");
  const summaryEl = document.getElementById("analysisSummary");
  const productsEl = document.getElementById("analysisProducts");
  if (!analysis || !card) {
    card?.setAttribute("hidden", "");
    return;
  }

  card.hidden = false;
  if (summaryEl) {
    summaryEl.innerHTML = `
      <p><strong>Тип:</strong> ${escapeHtml(analysis.businessTypeLabel || analysis.businessType || "—")}</p>
      <p>${escapeHtml(analysis.summary || "")}</p>
    `;
  }

  if (productsEl && Array.isArray(analysis.products) && analysis.products.length) {
    productsEl.innerHTML = `
      <p class="ais-test-label">Определённые товары/услуги</p>
      <ul>${analysis.products
        .map(
          (p) =>
            `<li><strong>${escapeHtml(p.name)}</strong>${p.price ? ` — ${escapeHtml(p.price)}` : ""}${p.description ? `<br><span class="ais-muted">${escapeHtml(p.description)}</span>` : ""}</li>`,
        )
        .join("")}</ul>
    `;
  } else if (productsEl) {
    productsEl.innerHTML = "";
  }
}

async function uploadBusinessDocument(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const status = document.getElementById("bkDocumentStatus");
  try {
    if (status) status.textContent = "Загрузка…";
    const form = new FormData();
    form.append("file", file);
    const result = await api.request("/api/company/my/ai-settings/upload-document", {
      method: "POST",
      body: form,
      headers: {},
    });
    businessKnowledge = parseBusinessKnowledge(result.businessKnowledgeJson);
    fillBusinessKnowledge(result.businessKnowledgeJson);
    setMessage(result.message, "success");
  } catch (error) {
    if (status) status.textContent = "Ошибка загрузки";
    setMessage(error.message || "Не удалось загрузить документ", "error");
  }
}

async function analyzeBusiness() {
  const btn = document.getElementById("analyzeBusinessBtn");
  try {
    btn.disabled = true;
    setMessage("AI анализирует данные о бизнесе…", "info");
    const payload = collectPayload();
    delete payload.sampleMessage;
    const result = await api.post("/api/company/my/ai-settings/analyze-business", payload);
    currentSettings = result.settings;
    fillForm(currentSettings);
    renderAnalysisResult(result.analysis);
    savedSnapshot = JSON.stringify(collectPayload());
    setMessage(result.message, "success");
  } catch (error) {
    setMessage(error.message || "Не удалось выполнить анализ", "error");
  } finally {
    btn.disabled = false;
  }
}

async function testPhoneReply() {
  const btn = document.getElementById("testPhoneBtn");
  const phone = document.getElementById("testPhone")?.value?.trim();
  const sampleMessage = document.getElementById("testPhoneMessage")?.value?.trim();
  if (!phone) {
    setMessage("Укажите номер телефона", "error");
    return;
  }

  try {
    btn.disabled = true;
    setMessage("Генерируем ответ для номера…", "info");
    const settingsPayload = { ...collectPayload() };
    delete settingsPayload.sampleMessage;
    const result = await api.post("/api/company/my/ai-settings/test-phone", {
      phone,
      sampleMessage,
      settings: settingsPayload,
    });
    document.getElementById("testPhoneResponse").textContent = result.aiResponse;
    document.getElementById("testPhoneResult").hidden = false;
    setMessage(result.message, "success");
  } catch (error) {
    setMessage(error.message || "Не удалось выполнить тест", "error");
  } finally {
    btn.disabled = false;
  }
}

function fillConsultationSettings(raw) {
  const parsed = parseConsultationSettings(raw);
  consultationMeta = parsed.meta;
  consultationTypes = parsed.types;

  const enabledEl = document.getElementById("consultationEnabled");
  const remindEl = document.getElementById("consultationAutoRemind");
  const hoursEl = document.getElementById("consultationRemindHours");
  if (enabledEl) enabledEl.checked = consultationMeta.enabled !== false;
  if (remindEl) remindEl.checked = consultationMeta.autoRemind !== false;
  if (hoursEl) hoursEl.value = consultationMeta.remindHoursBefore || 24;

  renderConsultationTypes();
}

function parseConsultationSettings(raw) {
  const defaults = {
    meta: { enabled: true, autoRemind: true, remindHoursBefore: 24 },
    types: [
      {
        id: "phone",
        label: "Консультация по телефону",
        mode: "phone",
        enabled: true,
        durationMin: 30,
        phone: "",
        bookingUrl: "",
        instructions: "Менеджер перезвонит в назначенное время.",
      },
      {
        id: "video",
        label: "Видеоконсультация",
        mode: "video",
        enabled: true,
        durationMin: 45,
        phone: "",
        bookingUrl: "",
        instructions: "Отправим ссылку на видеозвонок перед встречей.",
      },
    ],
  };

  if (!raw) return defaults;
  try {
    const data = JSON.parse(raw);
    return {
      meta: {
        enabled: data.enabled !== false,
        autoRemind: data.autoRemind !== false,
        remindHoursBefore: Number(data.remindHoursBefore) || 24,
      },
      types: Array.isArray(data.types) && data.types.length ? data.types : defaults.types,
    };
  } catch {
    return defaults;
  }
}

function serializeConsultationSettings() {
  return JSON.stringify({
    enabled: document.getElementById("consultationEnabled")?.checked ?? true,
    autoRemind: document.getElementById("consultationAutoRemind")?.checked ?? true,
    remindHoursBefore: Number(document.getElementById("consultationRemindHours")?.value) || 24,
    types: consultationTypes.map((t) => ({
      id: t.id || `type_${Date.now()}`,
      label: t.label?.trim() || "Консультация",
      mode: t.mode || "phone",
      enabled: t.enabled !== false,
      durationMin: Number(t.durationMin) || 30,
      phone: t.phone?.trim() || "",
      bookingUrl: t.bookingUrl?.trim() || "",
      instructions: t.instructions?.trim() || "",
    })),
  });
}

function renderConsultationTypes() {
  const root = document.getElementById("consultationTypesList");
  if (!root) return;

  root.innerHTML = consultationTypes
    .map(
      (type, index) => `
      <div class="ais-consult-row" data-index="${index}">
        <div class="ais-consult-row-head">
          <label class="ais-switch"><input type="checkbox" class="consult-enabled" ${type.enabled !== false ? "checked" : ""} /><span></span></label>
          <input type="text" class="consult-label" value="${escapeHtml(type.label || "")}" placeholder="Название" />
          <select class="consult-mode">
            <option value="phone" ${type.mode === "phone" ? "selected" : ""}>По телефону</option>
            <option value="video" ${type.mode === "video" ? "selected" : ""}>Видеозвонок</option>
          </select>
          <button type="button" class="ais-icon-btn consult-remove" title="Удалить">×</button>
        </div>
        <div class="ais-consult-row-body">
          <input type="text" class="consult-phone" value="${escapeHtml(type.phone || "")}" placeholder="Телефон для звонка (опционально)" />
          <input type="url" class="consult-url" value="${escapeHtml(type.bookingUrl || "")}" placeholder="Ссылка на запись (Calendly, Zoom...)" />
          <input type="number" class="consult-duration" value="${type.durationMin || 30}" min="15" max="180" placeholder="Минут" />
          <input type="text" class="consult-instructions" value="${escapeHtml(type.instructions || "")}" placeholder="Инструкция для клиента" />
        </div>
      </div>`,
    )
    .join("");

  root.querySelectorAll(".ais-consult-row").forEach((row) => {
    const index = Number(row.dataset.index);
    const sync = () => {
      consultationTypes[index] = {
        ...consultationTypes[index],
        enabled: row.querySelector(".consult-enabled")?.checked ?? true,
        label: row.querySelector(".consult-label")?.value || "",
        mode: row.querySelector(".consult-mode")?.value || "phone",
        phone: row.querySelector(".consult-phone")?.value || "",
        bookingUrl: row.querySelector(".consult-url")?.value || "",
        durationMin: Number(row.querySelector(".consult-duration")?.value) || 30,
        instructions: row.querySelector(".consult-instructions")?.value || "",
      };
    };

    row.querySelectorAll("input, select").forEach((el) => el.addEventListener("input", sync));
    row.querySelector(".consult-remove")?.addEventListener("click", () => {
      consultationTypes.splice(index, 1);
      renderConsultationTypes();
    });
  });
}

function addConsultationType() {
  consultationTypes.push({
    id: `custom_${Date.now()}`,
    label: "Консультация",
    mode: "phone",
    enabled: true,
    durationMin: 30,
    phone: "",
    bookingUrl: "",
    instructions: "",
  });
  renderConsultationTypes();
}

function parseProductsCatalog(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      price: formatPriceForInput(item.price),
    }));
  } catch {
    return [];
  }
}

function stripPriceSuffix(value) {
  return String(value || "")
    .replace(/\s*₽\s*$/u, "")
    .replace(/\s*руб\.?\s*$/iu, "")
    .trim();
}

function formatPriceForInput(value) {
  const stripped = stripPriceSuffix(value);
  return stripped;
}

function formatPriceForSave(value) {
  const stripped = stripPriceSuffix(value);
  if (!stripped) return "";
  if (/₽|руб/i.test(stripped)) return stripped;
  return `${stripped} ₽`;
}

function serializeProductsCatalog() {
  const items = services
    .map((s) => ({
      name: s.name?.trim() || "",
      price: formatPriceForSave(s.price),
      description: s.description?.trim() || "",
    }))
    .filter((s) => s.name);
  return items.length ? JSON.stringify(items) : "";
}

function renderServices() {
  if (!servicesList) return;
  servicesList.innerHTML = "";

  services.forEach((service, index) => {
    const node = serviceRowTemplate.content.cloneNode(true);
    const row = node.querySelector(".ais-service-row");
    const nameInput = node.querySelector(".service-name");
    const priceInput = node.querySelector(".service-price");
    const removeBtn = node.querySelector(".service-remove");

    nameInput.value = service.name || "";
    priceInput.value = service.price || "";

    const sync = () => {
      services[index] = {
        name: nameInput.value,
        price: priceInput.value,
        description: service.description || "",
      };
    };

    nameInput.addEventListener("input", sync);
    priceInput.addEventListener("input", sync);
    removeBtn.addEventListener("click", () => {
      services.splice(index, 1);
      renderServices();
    });

    servicesList.appendChild(node);
  });

  const hasItems = services.length > 0;
  emptyServices.hidden = hasItems;
  servicesList.hidden = !hasItems;
}

function addService(seed = {}) {
  services.push({ name: seed.name || "", price: seed.price || "", description: seed.description || "" });
  renderServices();
}

function buildCustomInstructions() {
  const base = document.getElementById("customInstructions").value.trim();
  const behaviors = {};
  Object.keys(BEHAVIOR_RULES).forEach((id) => {
    behaviors[id] = document.getElementById(id)?.checked ?? true;
  });

  const behaviorLines = Object.entries(BEHAVIOR_RULES)
    .filter(([id]) => behaviors[id])
    .map(([, text]) => text);

  const emojiMap = {
    none: "Не используй эмодзи в ответах.",
    moderate: "Используй эмодзи умеренно, не чаще одного на сообщение.",
    often: "Можешь использовать эмодзи для дружелюбности.",
  };

  const formatMap = {
    paragraphs: "Форматируй ответы абзацами.",
    bullets: "Используй маркированные списки, где уместно.",
    short: "Отвечай короткими фразами.",
  };

  const creativity = (document.getElementById("creativityRange").value / 100).toFixed(1);
  const maxLen = document.getElementById("maxLengthRange").value;
  const emoji = document.getElementById("emojiUsage").value;
  const format = document.getElementById("responseFormat").value;
  const lang = document.getElementById("language").value;

  const meta = {
    creativity: parseFloat(creativity),
    maxLength: parseInt(maxLen, 10),
    emojiUsage: emoji,
    responseFormat: format,
    language: lang,
    behaviors,
  };

  const parts = [
    ...behaviorLines,
    emojiMap[emoji] || "",
    formatMap[format] || "",
    lang === "en" ? "Respond in English." : "Отвечай на русском языке.",
    `Креативность: ${creativity}. Ориентир длины: до ${maxLen} символов.`,
    base,
    `<!--BF_META:${JSON.stringify(meta)}-->`,
  ].filter(Boolean);

  return parts.join("\n");
}

function parseCustomInstructions(raw) {
  const match = raw.match(/<!--BF_META:(.*?)-->/s);
  let meta = { behaviors: {} };
  let baseInstructions = raw;

  if (match) {
    try {
      meta = JSON.parse(match[1]);
    } catch {
      /* ignore */
    }
    baseInstructions = raw.replace(match[0], "").trim();
  }

  return { baseInstructions, meta };
}

function collectPayload() {
  syncWorkingHoursToHidden();
  return {
    businessType: selectedBusinessType,
    businessName: document.getElementById("businessName").value.trim(),
    businessDescription: document.getElementById("businessDescription").value.trim(),
    projectDescription: document.getElementById("projectDescription").value.trim(),
    productsCatalog: serializeProductsCatalog(),
    tone: document.getElementById("tone").value,
    responseLength: document.getElementById("responseLength").value,
    servicesOffered: services
      .filter((s) => s.name?.trim())
      .map((s) => `${s.name}${s.price ? ` — ${s.price}` : ""}`)
      .join("; "),
    workingHours: document.getElementById("workingHours").value.trim(),
    greetingHint: document.getElementById("greetingHint").value.trim(),
    customInstructions: buildCustomInstructions(),
    consultationSettings: serializeConsultationSettings(),
    businessKnowledgeJson: collectBusinessKnowledge(),
    isEnabled: document.getElementById("isEnabled").checked,
    sampleMessage: document.getElementById("sampleMessage")?.value.trim(),
  };
}

async function applyPreset(type) {
  try {
    setMessage("Применяем шаблон...", "info");
    const result = await api.post("/api/company/my/ai-settings/apply-preset", {
      businessType: type,
      businessName: document.getElementById("businessName").value.trim() || undefined,
    });
    currentSettings = result.settings;
    fillForm(result.settings);
    if (type === "shop" && services.length === 0) {
      addService({ name: "Разработка сайтов", price: "от 30 000" });
    }
    setMessage(result.message, "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
}

async function saveSettings() {
  const btn = document.getElementById("saveButton");
  try {
    btn.disabled = true;
    setMessage("Сохранение...", "info");
    syncWorkingHoursToHidden();
    const payload = collectPayload();
    delete payload.sampleMessage;
    currentSettings = await api.post("/api/company/my/ai-settings", payload);
    fillForm(currentSettings);
    savedSnapshot = JSON.stringify(collectPayload());
    setMessage("Изменения сохранены", "success");
    formMessage?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    const serverErrors = api.extractErrors(error);
    setMessage(serverErrors[0] || error.message || "Не удалось сохранить настройки", "error");
  } finally {
    btn.disabled = false;
  }
}

async function resetSettings() {
  if (!savedSnapshot) return;
  try {
    const payload = JSON.parse(savedSnapshot);
    delete payload.sampleMessage;
    await api.post("/api/company/my/ai-settings", payload);
    currentSettings = await api.get("/api/company/my/ai-settings");
    fillForm(currentSettings);
    setMessage("Настройки сброшены к последнему сохранению", "info");
  } catch (error) {
    setMessage(error.message, "error");
  }
}

async function previewPrompt() {
  try {
    const result = await api.post("/api/company/my/ai-settings/preview", collectPayload());
    const pre = document.getElementById("promptPreview");
    pre.textContent = result.prompt;
    pre.hidden = false;
    setMessage("Промпт сформирован", "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
}

async function testAiReply() {
  const btn = document.getElementById("testButton");
  try {
    btn.disabled = true;
    setMessage("Генерируем ответ...", "info");
    const result = await api.post("/api/company/my/ai-settings/test", collectPayload());
    document.getElementById("testResponse").textContent = result.aiResponse;
    document.getElementById("testResponseCard").hidden = false;
    const pre = document.getElementById("promptPreview");
    if (result.prompt) {
      pre.textContent = result.prompt;
      pre.hidden = false;
    }
    setMessage("Тестовый ответ готов", "success");
  } catch (error) {
    setMessage(error.message, "error");
  } finally {
    btn.disabled = false;
  }
}

function setMessage(text, type = "info") {
  if (formMessage) {
    formMessage.textContent = text || "";
    formMessage.className = `ais-form-message ${type}`.trim();
    formMessage.hidden = !text;
  }
  if (text && api) api.showToast(text, type);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
})();
