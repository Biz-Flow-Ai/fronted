(function () {
  const api = window.BizFlowApi;

  init();

  async function init() {
    if (!api?.requireAuth()) return;
    try {
      await api.waitForShell();
      const data = await api.get("/api/company/my/tariffs");
      renderCurrent(data.current, data.usage);
      renderUsage(data.usage, data.current);
      renderPlans(data.plans || [], data.current?.code);
    } catch (e) {
      api.showToast(e.message || "Ошибка загрузки тарифов", "error");
    }
  }

  function renderCurrent(current, usage) {
    const el = document.getElementById("currentPlan");
    if (!el || !current) return;
    const price = current.price > 0 ? `${current.price.toLocaleString("ru-RU")} ₽/мес` : "По запросу";
    el.innerHTML = `
      <div class="ex-tag">Текущий тариф</div>
      <h2 style="margin:8px 0 4px;font-size:24px">${esc(current.name)}</h2>
      <p style="margin:0;color:var(--bf-text-muted)">${price}</p>
      <ul class="ex-plan-features" style="margin-top:16px">${(current.features || []).map((f) => `<li>✓ ${esc(f)}</li>`).join("")}</ul>`;
    document.getElementById("plansSubtitle").textContent =
      `Диалогов: ${usage?.dialogs ?? 0} · Клиентов: ${usage?.clients ?? 0}`;
  }

  function renderUsage(usage, current) {
    const el = document.getElementById("usageGrid");
    if (!el) return;
    const limits = [
      ["Сообщения ИИ (30 дн.)", usage?.aiRequests ?? 0, current?.aiRequestsLimit ?? "—"],
      ["Диалоги", usage?.dialogs ?? 0, current?.messagesLimit ?? "—"],
      ["Клиенты", usage?.clients ?? 0, "—"],
    ];
    el.innerHTML = limits.map(([label, val, limit]) => `
      <div class="ex-usage-card"><span>${label}</span><strong>${val}</strong><span style="font-size:11px;color:var(--bf-text-muted)">лимит: ${limit}</span></div>`).join("");
  }

  function renderPlans(plans, currentCode) {
    const el = document.getElementById("plansGrid");
    if (!el) return;
    el.innerHTML = plans.map((p) => {
      const isCurrent = p.code === currentCode;
      const price = p.price > 0 ? `${p.price.toLocaleString("ru-RU")} ₽` : "Индивидуально";
      return `<article class="ex-plan-card${isCurrent ? " current" : ""}">
        <h2>${esc(p.name)}</h2>
        <div class="ex-plan-price">${price}</div>
        <ul class="ex-plan-features">${(p.features || []).map((f) => `<li>✓ ${esc(f)}</li>`).join("")}</ul>
        ${isCurrent ? '<div class="ex-tag" style="margin-top:12px">Активен</div>' : '<button type="button" class="ex-btn" style="margin-top:12px" disabled>Скоро</button>'}
      </article>`;
    }).join("");
  }

  function esc(v) {
    return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
