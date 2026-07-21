(function () {
const api = window.BizFlowApi;

const CHANNELS = [
  { id: "all", label: "Все" },
  { id: "vk", label: "VK", className: "dlg-channel-icon--vk" },
  { id: "telegram", label: "TG", className: "dlg-channel-icon--tg" },
  { id: "max", label: "MAX", className: "dlg-channel-icon--max" },
  { id: "whatsapp", label: "WA", className: "dlg-channel-icon--wa" },
];

const CHANNEL_ICONS = {
  vk: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.254 2.151-3.185 2.151-3.185.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.203.322-.271.44 0 .78.186.254.78.780 1.186 1.253.745.712 1.304 1.253 1.459 1.642.17.407-.085.78-.576.78z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  max: `<span>max</span>`,
};

let state = {
  filter: "all",
  channel: "all",
  search: "",
  page: 1,
  dialogs: [],
  counts: {},
  selectedId: null,
  channelNote: "",
};

let pollTimer = null;
let chatFingerprint = "";

const listEl = document.getElementById("dialogsList");
const filtersEl = document.getElementById("dialogFilters");
const channelsEl = document.getElementById("dialogChannels");
const searchInput = document.getElementById("dialogSearch");
const channelNoteEl = document.getElementById("channelNote");
const chatHeadEl = document.getElementById("chatHead");
const messagesEl = document.getElementById("chatMessages");
const clientPanelEl = document.getElementById("clientPanel");
const chatEmptyEl = document.getElementById("chatEmpty");

init();

async function init() {
  if (!api) return;
  if (!api.requireAuth()) return;

  bindUi();
  try {
    await api.waitForShell();
    await loadDialogs();
    startPolling();
  } catch (error) {
    console.error(error);
    api.showToast(error.message || "Не удалось загрузить диалоги", "error");
  }
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(() => {
    if (document.hidden) return;
    refreshInBackground();
  }, 4000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshInBackground();
  });
}

function dialogsFingerprint(dialogs) {
  return (dialogs || [])
    .map((d) => `${d.id}:${d.time}:${d.preview || ""}:${d.unread ? 1 : 0}:${d.isBlocked ? 1 : 0}:${d.isAiPaused ? 1 : 0}`)
    .join("|");
}

async function refreshInBackground() {
  try {
    const params = new URLSearchParams({
      filter: state.filter,
      channel: state.channel,
      search: state.search,
      page: String(state.page),
      pageSize: "30",
    });
    const data = await api.get(`/api/company/my/dialogs?${params}`);
    const nextDialogs = data.dialogs || [];
    const fp = dialogsFingerprint(nextDialogs);

    if (fp !== dialogsFingerprint(state.dialogs)) {
      state.dialogs = nextDialogs;
      state.counts = data.counts || state.counts;
      state.channelNote = data.channelNote || "";
      renderFilters();
      renderChannels();
      renderList();
      if (channelNoteEl) {
        channelNoteEl.hidden = !state.channelNote;
        channelNoteEl.textContent = state.channelNote;
      }
      BizFlowShell?.setDialogBadge(state.counts.unread || state.counts.all || 0);
    }

    if (state.selectedId) {
      await refreshActiveChat(state.selectedId, false);
    }
  } catch {
    /* фоновое обновление — без уведомлений */
  }
}

function bindUi() {
  filtersEl?.querySelectorAll(".dlg-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.filter || "all";
      state.page = 1;
      filtersEl.querySelectorAll(".dlg-filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadDialogs();
    });
  });

  channelsEl?.querySelectorAll(".dlg-channel-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.channel = btn.dataset.channel || "all";
      state.page = 1;
      channelsEl.querySelectorAll(".dlg-channel-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadDialogs();
    });
  });

  let searchTimer;
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.search = searchInput.value.trim();
      state.page = 1;
      loadDialogs();
    }, 300);
  });
}

async function loadDialogs() {
  const params = new URLSearchParams({
    filter: state.filter,
    channel: state.channel,
    search: state.search,
    page: String(state.page),
    pageSize: "30",
  });

  const data = await api.get(`/api/company/my/dialogs?${params}`);
  state.dialogs = data.dialogs || [];
  state.counts = data.counts || {};
  state.channelNote = data.channelNote || "";

  renderFilters();
  renderChannels();
  renderList();

  if (channelNoteEl) {
    channelNoteEl.hidden = !state.channelNote;
    channelNoteEl.textContent = state.channelNote;
  }

  BizFlowShell?.setDialogBadge(state.counts.unread || state.counts.all || 0);

  if (state.dialogs.length && !state.selectedId) {
    selectDialog(state.dialogs[0].id);
  } else if (!state.dialogs.length) {
    state.selectedId = null;
    showChatEmpty("Нет диалогов", state.channelNote || "Подключите VK и напишите боту — диалоги появятся здесь.");
    clientPanelEl.innerHTML = "";
  }
}

function renderFilters() {
  if (!filtersEl) return;
  const map = [
    ["all", "Все диалоги", state.counts.all],
    ["unread", "Непрочитанные", state.counts.unread],
    ["mine", "Мои диалоги", state.counts.mine],
  ];

  filtersEl.innerHTML = map
    .map(
      ([id, label, count]) =>
        `<button type="button" class="dlg-filter-btn${state.filter === id ? " active" : ""}" data-filter="${id}">${label} <span>${count ?? 0}</span></button>`,
    )
    .join("");

  filtersEl.querySelectorAll(".dlg-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.filter || "all";
      state.page = 1;
      loadDialogs();
    });
  });
}

function renderChannels() {
  if (!channelsEl) return;
  channelsEl.innerHTML = CHANNELS.map((ch) => {
    const count = ch.id === "all" ? state.counts.all : state.counts[ch.id];
    const isOff = ch.id !== "all" && ch.id !== "vk" && (count ?? 0) === 0;
    const icon =
      ch.id === "all"
        ? ""
        : `<span class="dlg-channel-icon ${ch.className}">${CHANNEL_ICONS[ch.id] || ""}</span>`;
    return `<button type="button" class="dlg-channel-pill${state.channel === ch.id ? " active" : ""}${isOff ? " is-off" : ""}" data-channel="${ch.id}">${icon}${ch.label}${ch.id === "all" ? "" : ` · ${count ?? 0}`}</button>`;
  }).join("");

  channelsEl.querySelectorAll(".dlg-channel-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.channel = btn.dataset.channel || "all";
      state.page = 1;
      loadDialogs();
    });
  });
}

function renderList() {
  if (!listEl) return;

  if (!state.dialogs.length) {
    listEl.innerHTML = `<div class="dlg-empty"><p>Диалогов нет</p></div>`;
    return;
  }

  listEl.innerHTML = state.dialogs
    .map((d) => {
      const initial = d.name?.charAt(0)?.toUpperCase() || "?";
      const channel = d.channel || "vk";
      const channelClass =
        channel === "telegram" ? "tg" : channel === "whatsapp" ? "wa" : channel === "max" ? "max" : "vk";
      const photoUrl = String(d.avatarUrl || "").trim();
      const avatarInner = photoUrl
        ? `<img class="dlg-avatar dlg-community-photo" src="${escapeHtml(photoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-initial="${escapeHtml(initial)}" data-color="${escapeHtml(d.avatarColor)}" />`
        : `<span class="dlg-avatar" style="background:${escapeHtml(d.avatarColor)}">${initial}</span>`;

      return `
        <article class="dlg-item${state.selectedId === d.id ? " active" : ""}" data-id="${d.id}">
          <div class="dlg-avatar-wrap">
            ${avatarInner}
            <span class="dlg-source-badge dlg-channel-icon dlg-channel-icon--${channelClass}">${CHANNEL_ICONS[channel] || CHANNEL_ICONS.vk}</span>
          </div>
          <div class="dlg-item-body">
            <div class="dlg-item-top">
              <span class="dlg-item-name">${escapeHtml(d.name)}</span>
              <span class="dlg-item-time">${escapeHtml(d.time)}</span>
            </div>
            <p class="dlg-item-preview" title="${escapeHtml(d.preview)}">${escapeHtml(truncatePreview(d.preview))}</p>
            <div class="dlg-item-meta">
              ${d.unread ? `<span class="dlg-unread">${d.unreadCount || 1}</span>` : ""}
              ${d.isBlocked ? `<span class="dlg-status-tag dlg-status-tag--blocked">Заблок.</span>` : ""}
              ${!d.isBlocked && d.isAiPaused ? `<span class="dlg-status-tag dlg-status-tag--muted">ИИ выкл.</span>` : ""}
              <span class="dlg-status-tag dlg-status-tag--${escapeHtml(d.status)}">${escapeHtml(d.statusLabel)}</span>
              <span class="dlg-status-tag">${escapeHtml(d.channelLabel || "VK")}</span>
            </div>
          </div>
        </article>`;
    })
    .join("");

  listEl.querySelectorAll(".dlg-item").forEach((item) => {
    item.addEventListener("click", () => selectDialog(Number(item.dataset.id)));
  });

  bindAvatarErrors(listEl);
}

async function selectDialog(id) {
  state.selectedId = id;
  chatFingerprint = "";
  renderList();
  await refreshActiveChat(id, true);
}

async function refreshActiveChat(id, showErrors) {
  const listItem = state.dialogs.find((d) => d.id === id);

  try {
    const data = await api.get(`/api/company/my/dialogs/${id}`);
    if (listItem) {
      data.avatarUrl = data.avatarUrl || listItem.avatarUrl;
      data.avatarColor = data.avatarColor || listItem.avatarColor;
      data.name = data.name || listItem.name;
    }

    const messages = data.messages || [];
    const fp = `${messages.length}:${messages[messages.length - 1]?.id || 0}:${data.isBlocked ? 1 : 0}:${data.isAiPaused ? 1 : 0}:${data.status || ""}:${data.customerCard?.customerNeed || ""}:${data.customerCard?.budget || ""}`;
    if (fp === chatFingerprint && !showErrors) return;
    chatFingerprint = fp;

    const wasAtBottom =
      !messagesEl.hidden &&
      messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 48;

    renderChat(data, wasAtBottom);
    renderClient(data);
    chatEmptyEl.hidden = true;
    chatHeadEl.hidden = false;
    messagesEl.hidden = false;
  } catch (error) {
    if (showErrors) api.showToast(error.message || "Не удалось открыть диалог", "error");
  }
}

function renderChat(dialog, scrollToBottom = true) {
  const channel = dialog.channel || "vk";
  const channelClass =
    channel === "telegram" ? "tg" : channel === "whatsapp" ? "wa" : channel === "max" ? "max" : "vk";
  const initial = dialog.name?.charAt(0)?.toUpperCase() || "?";
  const headAvatar = renderAvatarHtml(dialog.avatarUrl, dialog.avatarColor, initial, "dlg-avatar--sm");
  const isBlocked = Boolean(dialog.isBlocked);
  const isAiPaused = Boolean(dialog.isAiPaused);
  const isClosed = dialog.statusLabel === "Закрыт" || dialog.statusLabel === "В архиве";

  chatHeadEl.innerHTML = `
    <div class="dlg-chat-client">
      ${headAvatar}
      <div class="dlg-chat-client-info">
        <h2>${escapeHtml(dialog.name)}</h2>
        <p>ID VK: ${escapeHtml(String(dialog.vkUserId || "—"))}</p>
        ${isBlocked ? `<p class="dlg-chat-flag dlg-chat-flag--danger">Клиент заблокирован — ИИ и автоответы отключены</p>` : ""}
        ${!isBlocked && isAiPaused ? `<p class="dlg-chat-flag dlg-chat-flag--warn">ИИ не отвечает в этом диалоге</p>` : ""}
      </div>
      <span class="dlg-channel-label">
        <span class="dlg-channel-icon dlg-channel-icon--${channelClass}">${CHANNEL_ICONS[channel] || CHANNEL_ICONS.vk}</span>
        ${escapeHtml(dialog.channelLabel || "VK")}
      </span>
    </div>
    <div class="dlg-chat-actions">
      <div class="dlg-actions-wrap">
        <button type="button" class="dlg-btn dlg-btn--primary" id="dlgActionsBtn" aria-haspopup="true" aria-expanded="false">
          Действия
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="dlg-actions-menu" id="dlgActionsMenu" hidden>
          <button type="button" class="dlg-action-item" data-action="${isAiPaused ? "resume_ai" : "pause_ai"}" ${isBlocked ? "disabled" : ""}>
            ${isAiPaused ? "Включить автоответ ИИ" : "ИИ не отвечать"}
          </button>
          <button type="button" class="dlg-action-item${isBlocked ? " dlg-action-item--danger" : ""}" data-action="${isBlocked ? "unblock" : "block"}">
            ${isBlocked ? "Разблокировать клиента" : "Заблокировать клиента"}
          </button>
          <button type="button" class="dlg-action-item" data-action="${isClosed ? "reopen" : "close"}">
            ${isClosed ? "Открыть диалог снова" : "Закрыть диалог"}
          </button>
          <button type="button" class="dlg-action-item" data-action="archive">В архив</button>
        </div>
      </div>
    </div>`;

  bindAvatarErrors(chatHeadEl);
  bindDialogActions(dialog);

  if (!dialog.messages?.length) {
    messagesEl.innerHTML = `<div class="dlg-inline-empty">Сообщений пока нет</div>`;
    return;
  }

  let lastDate = "";
  const parts = [];
  for (const msg of dialog.messages) {
    if (msg.date && msg.date !== lastDate) {
      lastDate = msg.date;
      parts.push(`<div class="dlg-msg-date">${escapeHtml(msg.date)}</div>`);
    }
    const authorClass =
      msg.author === "customer" ? "customer" : msg.author === "operator" ? "operator" : "ai";
    const authorLabel =
      authorClass === "customer" ? "Клиент" : authorClass === "operator" ? "Оператор" : "ИИ";
    const body = formatMessageText(msg.content);
    parts.push(
      `<div class="dlg-msg dlg-msg--${authorClass}">
        <span class="dlg-msg-author">${escapeHtml(authorLabel)}</span>
        <span class="dlg-msg-text">${body}</span>
        <time>${escapeHtml(msg.time)}</time>
      </div>`,
    );
  }
  messagesEl.innerHTML = parts.join("");

  if (scrollToBottom) {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }
}

function renderAvatarHtml(photoUrl, color, initial, extraClass = "") {
  const cls = `dlg-avatar${extraClass ? ` ${extraClass}` : ""}`;
  const safeColor = escapeHtml(color || "#6366f1");
  const safeInitial = escapeHtml(initial);

  if (String(photoUrl || "").trim()) {
    return `<div class="dlg-avatar-wrap">
      <img class="${cls} dlg-community-photo" src="${escapeHtml(photoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-initial="${safeInitial}" data-color="${safeColor}" />
    </div>`;
  }

  return `<div class="dlg-avatar-wrap"><span class="${cls}" style="background:${safeColor}">${safeInitial}</span></div>`;
}

function bindAvatarErrors(root) {
  root?.querySelectorAll(".dlg-community-photo").forEach((img) => {
    img.addEventListener("error", () => {
      const initial = img.dataset.initial || "?";
      const color = img.dataset.color || "#6366f1";
      const span = document.createElement("span");
      span.className = img.className.replace("dlg-community-photo", "").trim() || "dlg-avatar";
      span.style.background = color;
      span.textContent = initial;
      img.replaceWith(span);
    });
  });
}

function truncatePreview(text, max = 72) {
  const value = String(text || "").replace(/\*+/g, "").replace(/\s+/g, " ").trim();
  if (!value) return "Нет сообщений";
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}

function formatMessageText(text) {
  const value = String(text || "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
  return escapeHtml(value || "—");
}

function renderClient(dialog) {
  const card = dialog.customerCard;
  const manageBlock = `
    <div class="dlg-client-block dlg-manage-block">
      <h3>Управление диалогом</h3>
      <div class="dlg-manage-grid">
        <button type="button" class="dlg-manage-btn${dialog.isAiPaused ? " is-active" : ""}" data-manage="${dialog.isAiPaused ? "resume_ai" : "pause_ai"}" ${dialog.isBlocked ? "disabled" : ""}>
          <span>${dialog.isAiPaused ? "ИИ выключен" : "ИИ включён"}</span>
          <small>${dialog.isAiPaused ? "Нажмите, чтобы включить" : "Отключить автоответ"}</small>
        </button>
        <button type="button" class="dlg-manage-btn${dialog.isBlocked ? " is-danger" : ""}" data-manage="${dialog.isBlocked ? "unblock" : "block"}">
          <span>${dialog.isBlocked ? "Заблокирован" : "Активен"}</span>
          <small>${dialog.isBlocked ? "Разблокировать" : "Заблокировать"}</small>
        </button>
      </div>
    </div>`;

  if (!card) {
    clientPanelEl.innerHTML = `
      <h3>Информация о клиенте</h3>
      ${manageBlock}
      <div class="dlg-empty" style="height:auto;padding:20px 0">
        <p>Карточка клиента появится после сбора данных ИИ-ассистентом</p>
      </div>`;
    bindManageActions(dialog);
    return;
  }

  const services = card.services?.length
    ? card.services
    : card.interestedService
      ? card.interestedService.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  clientPanelEl.innerHTML = `
    <h3>Информация о клиенте</h3>
    ${manageBlock}
    <div class="dlg-client-block">
      <div class="dlg-field"><label>Статус</label><strong>${escapeHtml(card.statusLabel || "—")}</strong></div>
      <div class="dlg-field"><label>Дата обращения</label><p>${escapeHtml(card.createdAt || "—")}</p></div>
      ${card.vkProfileUrl ? `<div class="dlg-field"><label>Профиль</label><p><a href="${escapeHtml(card.vkProfileUrl)}" target="_blank" rel="noreferrer">Открыть VK</a></p></div>` : ""}
    </div>
    <div class="dlg-client-block">
      <h3 style="margin-bottom:10px">Что хочет клиент</h3>
      ${card.customerNeed ? `<p class="dlg-need-summary">${escapeHtml(card.customerNeed)}</p>` : `<p class="dlg-need-empty">Пока не определено — появится из переписки</p>`}
      <div class="dlg-field"><label>Бюджет</label><strong class="price">${escapeHtml(card.budget || "Не указан")}</strong></div>
      <div class="dlg-field">
        <label>Интерес</label>
        <div class="dlg-tags">${services.length ? services.map((s) => `<span class="dlg-tag">${escapeHtml(s)}</span>`).join("") : '<span class="dlg-tag dlg-tag--muted">Не указано</span>'}</div>
      </div>
      ${card.projectType ? `<div class="dlg-field"><label>Тип запроса</label><p>${escapeHtml(card.projectType)}</p></div>` : ""}
      ${card.timeline ? `<div class="dlg-field"><label>Намерение</label><p>${escapeHtml(card.timeline)}</p></div>` : ""}
    </div>`;
  bindManageActions(dialog);
}

function bindDialogActions(dialog) {
  const btn = document.getElementById("dlgActionsBtn");
  const menu = document.getElementById("dlgActionsMenu");
  if (!btn || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };

  btn.onclick = (e) => {
    e.stopPropagation();
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  };

  menu.onclick = (e) => e.stopPropagation();

  menu.querySelectorAll(".dlg-action-item").forEach((item) => {
    item.onclick = async (e) => {
      e.stopPropagation();
      closeMenu();
      await runDialogAction(dialog.id, item.dataset.action);
    };
  });

  if (!window._dlgMenuCloserBound) {
    window._dlgMenuCloserBound = true;
    document.addEventListener("click", () => {
      const openMenu = document.getElementById("dlgActionsMenu");
      const openBtn = document.getElementById("dlgActionsBtn");
      if (!openMenu || openMenu.hidden) return;
      openMenu.hidden = true;
      openBtn?.setAttribute("aria-expanded", "false");
    });
  }
}

function bindManageActions(dialog) {
  clientPanelEl?.querySelectorAll("[data-manage]").forEach((btn) => {
    btn.onclick = () => runDialogAction(dialog.id, btn.dataset.manage);
  });
}

async function runDialogAction(dialogId, action) {
  const patch = {};
  let toastMsg = "";

  switch (action) {
    case "pause_ai":
      patch.isAiPaused = true;
      toastMsg = "ИИ не будет отвечать в этом диалоге";
      break;
    case "resume_ai":
      patch.isAiPaused = false;
      toastMsg = "Автоответ ИИ включён";
      break;
    case "block":
      if (!confirm("Заблокировать клиента? Сообщения сохранятся, но ИИ не будет отвечать.")) return;
      patch.isBlocked = true;
      toastMsg = "Клиент заблокирован";
      break;
    case "unblock":
      patch.isBlocked = false;
      patch.isAiPaused = false;
      toastMsg = "Клиент разблокирован";
      break;
    case "close":
      patch.status = "closed";
      toastMsg = "Диалог закрыт";
      break;
    case "reopen":
      patch.status = "open";
      toastMsg = "Диалог открыт";
      break;
    case "archive":
      patch.status = "archived";
      toastMsg = "Диалог в архиве";
      break;
    default:
      return;
  }

  try {
    await api.post(`/api/company/my/dialogs/${dialogId}/actions`, patch);
    api.showToast(toastMsg, "success");
    chatFingerprint = "";
    await loadDialogs();
    if (state.selectedId === dialogId) {
      await refreshActiveChat(dialogId, false);
    }
  } catch (error) {
    api.showToast(error.message || "Не удалось применить действие", "error");
  }
}

function showChatEmpty(title, text) {
  chatHeadEl.hidden = true;
  messagesEl.hidden = true;
  chatEmptyEl.hidden = false;
  chatEmptyEl.innerHTML = `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}
})();
