(function () {
  const api = window.BizFlowApi;

  const filtersEl = document.getElementById("leadFilters");
  const searchInput = document.getElementById("leadSearch");
  const listEl = document.getElementById("leadsList");
  const detailEl = document.getElementById("leadDetail");

  const STATUS_OPTIONS = [
    ["new", "Новый"],
    ["progress", "В работе"],
    ["qualified", "Квалифицирован"],
    ["converted", "Конвертирован"],
    ["rejected", "Отклонён"],
  ];

  const FILTER_OPTIONS = [
    ["all", "Все"],
    ["new", "Новые"],
    ["progress", "В работе"],
    ["qualified", "Квалифицированы"],
    ["converted", "Конвертированы"],
    ["rejected", "Отклонённые"],
  ];

  const VK_ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.08 14.27h-1.46c-.55 0-.72-.44-1.71-1.42-.86-.82-1.24-.93-1.46-.93-.3 0-.39.08-.39.5v1.3c0 .36-.12.58-1.08.58-1.59 0-3.36-.96-4.6-2.75-1.87-2.64-2.38-4.63-2.38-4.77 0-.21.08-.4.5-.4h1.46c.37 0 .51.17.65.57.71 2.05 1.9 3.85 2.39 3.85.18 0 .27-.08.27-.54V9.74c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.36-.34h2.3c.31 0 .42.17.42.53v2.86c0 .31.14.42.23.42.18 0 .33-.11.66-.44 1.02-1.14 1.75-2.9 1.75-2.9.1-.21.26-.4.63-.4h1.46c.44 0 .53.23.44.53-.18.84-1.93 3.26-1.93 3.26-.15.25-.21.36 0 .65.15.21.66.64 1 1.04.61.73 1.08 1.34 1.21 1.76.13.42-.07.64-.48.64z"/></svg>';

  const state = {
    filter: "all",
    search: "",
    page: 1,
    leads: [],
    counts: {},
    selectedId: null,
    detail: null,
    updating: false,
  };

  init();

  async function init() {
    if (!api?.requireAuth()) return;

    bindSearch();
    try {
      await api.waitForShell();
      await loadLeads();
      setInterval(refreshLeads, 15000);
    } catch (error) {
      console.error(error);
      api.showToast(error.message || "Не удалось загрузить заявки", "error");
    }
  }

  function bindSearch() {
    let timer;
    searchInput?.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.search = searchInput.value.trim();
        state.page = 1;
        loadLeads();
      }, 300);
    });
  }

  async function refreshLeads() {
    try {
      await loadLeads(false);
      if (state.selectedId) await loadDetail(state.selectedId, false);
    } catch {
      /* фоновое обновление */
    }
  }

  async function loadLeads(showErrors = true) {
    const params = new URLSearchParams({
      status: state.filter,
      search: state.search,
      page: String(state.page),
      pageSize: "50",
    });

    const data = await api.get(`/api/company/my/leads?${params}`);
    state.leads = data.leads || [];
    state.counts = data.counts || {};

    renderFilters();
    renderList();

    const subtitle = document.getElementById("leadsSubtitle");
    if (subtitle) {
      subtitle.textContent = `${data.total ?? state.leads.length} заявок из диалогов VK`;
    }

    if (state.leads.length && !state.selectedId) {
      selectLead(state.leads[0].id);
    } else if (!state.leads.length) {
      state.selectedId = null;
      state.detail = null;
      showDetailEmpty("Заявок пока нет", "Когда клиенты напишут в VK, карточки появятся здесь автоматически.");
    } else if (state.selectedId && !state.leads.some((l) => l.id === state.selectedId)) {
      selectLead(state.leads[0].id);
    }
  }

  function renderFilters() {
    if (!filtersEl) return;

    filtersEl.innerHTML = FILTER_OPTIONS.map(([id, label]) => {
      const count = id === "all" ? state.counts.all : state.counts[id];
      return `<button type="button" class="ld-filter-btn${state.filter === id ? " active" : ""}" data-filter="${id}">${label} <span>${count ?? 0}</span></button>`;
    }).join("");

    filtersEl.querySelectorAll(".ld-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filter = btn.dataset.filter || "all";
        state.page = 1;
        loadLeads();
      });
    });
  }

  function renderList() {
    if (!listEl) return;

    if (!state.leads.length) {
      listEl.innerHTML = `<div class="ld-empty"><p>Заявок нет</p></div>`;
      return;
    }

    listEl.innerHTML = state.leads
      .map((lead) => {
        const initial = lead.name?.charAt(0)?.toUpperCase() || "?";
        const photoUrl = String(lead.avatarUrl || "").trim();
        const avatarInner = photoUrl
          ? `<img src="${escapeHtml(photoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-initial="${escapeHtml(initial)}" data-color="${escapeHtml(lead.avatarColor)}" />`
          : "";

        return `
          <article class="ld-item${state.selectedId === lead.id ? " active" : ""}" data-id="${lead.id}">
            <div class="ld-avatar-wrap">
              <div class="ld-avatar" style="background:${escapeHtml(lead.avatarColor)}">
                ${avatarInner || initial}
              </div>
              <span class="ld-source-badge">${VK_ICON}</span>
            </div>
            <div class="ld-item-body">
              <div class="ld-item-top">
                <span class="ld-item-name">${escapeHtml(lead.name)}</span>
                <span class="ld-item-time">${escapeHtml(lead.time || "")}</span>
              </div>
              <p class="ld-item-need">${escapeHtml(lead.customerNeed || "Запрос уточняется")}</p>
              <div class="ld-item-meta">
                <span class="ld-tag ld-tag--${escapeHtml(lead.status)}">${escapeHtml(lead.statusLabel)}</span>
                ${lead.budget ? `<span class="ld-tag ld-tag--budget">${escapeHtml(lead.budget)}</span>` : ""}
              </div>
            </div>
          </article>`;
      })
      .join("");

    listEl.querySelectorAll(".ld-item").forEach((item) => {
      item.addEventListener("click", () => selectLead(Number(item.dataset.id)));
    });

    bindAvatarErrors(listEl);
  }

  async function selectLead(id) {
    state.selectedId = id;
    renderList();
    await loadDetail(id, true);
  }

  async function loadDetail(id, showErrors) {
    try {
      const data = await api.get(`/api/company/my/leads/${id}`);
      state.detail = data;
      renderDetail(data);
    } catch (error) {
      if (showErrors) api.showToast(error.message || "Не удалось открыть заявку", "error");
    }
  }

  function renderDetail(lead) {
    if (!detailEl || !lead) return;

    const initial = lead.name?.charAt(0)?.toUpperCase() || "?";
    const avatarHtml = renderAvatarHtml(lead.avatarUrl, lead.avatarColor, initial);
    const services = lead.services || [];

    detailEl.innerHTML = `
      <div class="ld-detail-head">
        <div class="ld-avatar-wrap">
          ${avatarHtml}
          <span class="ld-source-badge">${VK_ICON}</span>
        </div>
        <div class="ld-detail-title">
          <h2>${escapeHtml(lead.name)}</h2>
          <p>VK · обновлено ${escapeHtml(lead.updatedAt || lead.time || "—")}</p>
        </div>
        <div class="ld-detail-actions">
          ${
            lead.dialogId
              ? `<a class="ld-btn ld-btn--primary" href="/company/dialogs?dialog=${lead.dialogId}">Открыть диалог</a>`
              : ""
          }
          ${
            lead.vkProfileUrl
              ? `<a class="ld-btn" href="${escapeHtml(lead.vkProfileUrl)}" target="_blank" rel="noopener noreferrer">Профиль VK</a>`
              : ""
          }
        </div>
      </div>

      <section class="ld-card">
        <h3>Статус заявки</h3>
        <div class="ld-status-grid" id="statusGrid">
          ${STATUS_OPTIONS.map(
            ([value, label]) =>
              `<button type="button" class="ld-status-btn${lead.status === value ? " active" : ""}" data-status="${value}">${escapeHtml(label)}</button>`,
          ).join("")}
        </div>
      </section>

      <section class="ld-card">
        <h3>Что хочет клиент</h3>
        <div class="ld-need-block">${escapeHtml(lead.customerNeed || "Запрос уточняется из переписки")}</div>
        ${
          services.length
            ? `<div class="ld-services" style="margin-top:12px">${services.map((s) => `<span class="ld-service-tag">${escapeHtml(s)}</span>`).join("")}</div>`
            : ""
        }
      </section>

      <section class="ld-card">
        <h3>Детали</h3>
        <div class="ld-info-grid">
          <div class="ld-info-item">
            <span>Бюджет</span>
            <strong>${escapeHtml(lead.budget || "Не указан")}</strong>
          </div>
          <div class="ld-info-item">
            <span>Тип проекта</span>
            <strong>${escapeHtml(lead.projectType || "—")}</strong>
          </div>
          <div class="ld-info-item">
            <span>Сроки</span>
            <strong>${escapeHtml(lead.timeline || "—")}</strong>
          </div>
          <div class="ld-info-item">
            <span>Создана</span>
            <strong>${escapeHtml(lead.createdAt || "—")}</strong>
          </div>
        </div>
      </section>`;

    bindAvatarErrors(detailEl);

    detailEl.querySelectorAll(".ld-status-btn").forEach((btn) => {
      btn.addEventListener("click", () => updateStatus(lead.id, btn.dataset.status));
    });
  }

  async function updateStatus(leadId, status) {
    if (!status || state.updating) return;

    state.updating = true;
    try {
      await api.patch(`/api/company/my/leads/${leadId}`, { status });
      api.showToast("Статус заявки обновлён", "success");
      await loadLeads(false);
      await loadDetail(leadId, false);
    } catch (error) {
      api.showToast(error.message || "Не удалось обновить статус", "error");
    } finally {
      state.updating = false;
    }
  }

  function showDetailEmpty(title, text) {
    if (!detailEl) return;
    detailEl.innerHTML = `<div class="ld-empty"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`;
  }

  function renderAvatarHtml(avatarUrl, color, initial) {
    const photoUrl = String(avatarUrl || "").trim();
    if (photoUrl) {
      return `<div class="ld-avatar" style="background:${escapeHtml(color)}"><img src="${escapeHtml(photoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-initial="${escapeHtml(initial)}" data-color="${escapeHtml(color)}" /></div>`;
    }
    return `<div class="ld-avatar" style="background:${escapeHtml(color)}">${escapeHtml(initial)}</div>`;
  }

  function bindAvatarErrors(root) {
    root?.querySelectorAll("img[data-initial]").forEach((img) => {
      img.addEventListener("error", () => {
        const parent = img.parentElement;
        if (!parent) return;
        parent.textContent = img.dataset.initial || "?";
        if (img.dataset.color) parent.style.background = img.dataset.color;
      });
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
