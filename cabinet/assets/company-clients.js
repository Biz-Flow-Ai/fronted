(function () {
  const api = window.BizFlowApi;
  const listEl = document.getElementById("clientsList");
  const detailEl = document.getElementById("clientDetail");
  const searchInput = document.getElementById("clientSearch");
  const state = { clients: [], selectedId: null, consultations: [] };

  init();

  async function init() {
    if (!api?.requireAuth()) return;
    bindSearch();
    try {
      await api.waitForShell();
      await loadClients();
      setInterval(loadClients, 20000);
    } catch (e) {
      api.showToast(e.message || "Ошибка загрузки клиентов", "error");
    }
  }

  function bindSearch() {
    let t;
    searchInput?.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(loadClients, 300);
    });
  }

  async function loadClients() {
    const search = searchInput?.value.trim() || "";
    const data = await api.get(`/api/company/my/clients?search=${encodeURIComponent(search)}`);
    state.clients = data.clients || [];
    document.getElementById("clientsSubtitle").textContent = `${data.total || 0} клиентов`;
    renderList();
    if (state.selectedId && !state.clients.some((c) => c.id === state.selectedId) && state.clients[0]) {
      selectClient(state.clients[0].id);
    }
  }

  function renderList() {
    if (!listEl) return;
    if (!state.clients.length) {
      listEl.innerHTML = `<div class="ex-empty"><p>Клиентов пока нет</p></div>`;
      return;
    }
    listEl.innerHTML = state.clients.map((c) => {
      const initial = c.name?.charAt(0)?.toUpperCase() || "?";
      const avatar = c.avatarUrl
        ? `<img src="${esc(c.avatarUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
        : initial;
      return `<article class="ex-item${state.selectedId === c.id ? " active" : ""}" data-id="${c.id}">
        <div class="ex-avatar" style="background:${esc(c.avatarColor)}">${avatar}</div>
        <div class="ex-item-body">
          <div class="ex-item-name">${esc(c.name)}</div>
          <div class="ex-item-meta">${esc(c.phone || c.interestedService || "VK")} · ${esc(c.updatedAt)}</div>
        </div>
      </article>`;
    }).join("");
    listEl.querySelectorAll(".ex-item").forEach((el) => el.addEventListener("click", () => selectClient(Number(el.dataset.id))));
  }

  async function selectClient(id) {
    state.selectedId = id;
    renderList();
    const client = state.clients.find((c) => c.id === id);
    if (!client) return;
    const consultData = await api.get("/api/company/my/consultations?status=upcoming");
    const consults = (consultData.consultations || []).filter((x) => x.customerCardId === id);
    renderDetail(client, consults);
  }

  function renderDetail(client, consults) {
    detailEl.innerHTML = `
      <div class="ex-card">
        <h3>${esc(client.name)}</h3>
        <div class="ex-tag">${esc(client.statusLabel)}</div>
        ${client.budget ? `<div class="ex-tag">${esc(client.budget)}</div>` : ""}
        <p style="margin:12px 0 0;color:var(--bf-text-muted);font-size:13px">${esc(client.interestedService || "Интересы уточняются")}</p>
        <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
          ${client.dialogId ? `<a class="ex-btn ex-btn--primary" href="/company/dialogs">Диалог</a>` : ""}
          ${client.vkProfileUrl ? `<a class="ex-btn" href="${esc(client.vkProfileUrl)}" target="_blank" rel="noopener">VK</a>` : ""}
        </div>
      </div>
      <div class="ex-card">
        <h3>Контакты</h3>
        <label class="ex-field"><span>Телефон</span><input id="clientPhone" value="${esc(client.phone || "")}" /></label>
        <label class="ex-field"><span>Email</span><input id="clientEmail" value="${esc(client.email || "")}" /></label>
        <label class="ex-field"><span>Заметки</span><textarea id="clientNotes" rows="3">${esc(client.notes || "")}</textarea></label>
        <button type="button" class="ex-btn ex-btn--primary" id="saveClientBtn">Сохранить</button>
      </div>
      <div class="ex-card">
        <h3>Консультации (${consults.length})</h3>
        <div class="ex-consult-list">${consults.length ? consults.map((c) => `<div class="ex-consult-item"><strong>${esc(c.typeLabel)}</strong> — ${esc(c.scheduledAt)}<br><span style="color:var(--bf-text-muted)">${esc(c.statusLabel)}</span></div>`).join("") : "<p style='color:var(--bf-text-muted);font-size:13px'>Записей нет. ИИ создаст при согласовании времени в чате.</p>"}</div>
      </div>`;
    document.getElementById("saveClientBtn")?.addEventListener("click", async () => {
      try {
        await api.patch(`/api/company/my/clients/${client.id}`, {
          phone: document.getElementById("clientPhone").value,
          email: document.getElementById("clientEmail").value,
          notes: document.getElementById("clientNotes").value,
        });
        api.showToast("Сохранено", "success");
        await loadClients();
      } catch (e) {
        api.showToast(e.message, "error");
      }
    });
  }

  function esc(v) {
    return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
