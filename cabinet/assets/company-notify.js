(function () {
  const api = window.BizFlowApi;
  const listEl = document.getElementById("notifyList");
  const state = { filter: "all", items: [] };

  init();

  async function init() {
    if (!api?.requireAuth()) return;
    bindUi();
    try {
      await api.waitForShell();
      await loadNotifications();
      setInterval(loadNotifications, 15000);
    } catch (e) {
      api.showToast(e.message || "Ошибка загрузки уведомлений", "error");
    }
  }

  function bindUi() {
    document.getElementById("notifyFilters")?.querySelectorAll(".ex-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filter = btn.dataset.filter || "all";
        document.querySelectorAll(".ex-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderList();
      });
    });
    document.getElementById("markAllReadBtn")?.addEventListener("click", async () => {
      try {
        await api.post("/api/company/my/notifications/read-all", {});
        api.showToast("Все прочитано", "success");
        await loadNotifications();
      } catch (e) {
        api.showToast(e.message, "error");
      }
    });
  }

  async function loadNotifications() {
    const data = await api.get("/api/company/my/notifications");
    state.items = data.notifications || [];
    document.getElementById("notifySubtitle").textContent =
      `${data.unreadCount || 0} непрочитанных · записи на консультации и напоминания`;
    renderList();
  }

  function renderList() {
    if (!listEl) return;
    const items = state.filter === "unread" ? state.items.filter((n) => !n.isRead) : state.items;
    if (!items.length) {
      listEl.innerHTML = `<div class="ex-empty"><h3>Уведомлений нет</h3><p>Появятся при записи на консультацию или новых заявках</p></div>`;
      return;
    }
    listEl.innerHTML = items.map((n) => `
      <article class="ex-notify-item${n.isRead ? "" : " unread"}" data-id="${n.id}">
        <div class="ex-notify-icon">${iconFor(n.type)}</div>
        <div class="ex-notify-body">
          <strong>${esc(n.title)}</strong>
          <p>${esc(n.body)}</p>
        </div>
        <span class="ex-notify-time">${esc(n.time || n.createdAt)}</span>
      </article>`).join("");

    listEl.querySelectorAll(".ex-notify-item").forEach((el) => {
      el.addEventListener("click", async () => {
        const id = Number(el.dataset.id);
        try {
          await api.patch("/api/company/my/notifications/read", { ids: [id] });
          if (el.classList.contains("unread")) {
            const item = state.items.find((n) => n.id === id);
            if (item?.entityType === "consultation") window.location.href = "/company/clients";
          }
          await loadNotifications();
        } catch { /* ignore */ }
      });
    });
  }

  function iconFor(type) {
    if (type?.includes("consultation")) return "📅";
    if (type?.includes("lead")) return "📋";
    return "🔔";
  }

  function esc(v) {
    return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
