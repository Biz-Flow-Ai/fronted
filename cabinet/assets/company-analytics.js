(function () {
  const api = window.BizFlowApi;
  let periodDays = 7;
  let activityChart = null;
  let mixChart = null;

  init();

  async function init() {
    if (!api?.requireAuth()) return;

    bindPeriodTabs();
    try {
      await api.waitForShell();
      await loadAnalytics();
    } catch (error) {
      console.error(error);
      api.showToast(error.message || "Не удалось загрузить аналитику", "error");
    }
  }

  function bindPeriodTabs() {
    document.getElementById("periodTabs")?.querySelectorAll(".an-period-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        periodDays = Number(btn.dataset.days) || 7;
        document.querySelectorAll(".an-period-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        await loadAnalytics();
      });
    });
  }

  async function loadAnalytics() {
    const data = await api.get(`/api/company/my/analytics?days=${periodDays}`);
    renderSummary(data.summary, data.period);
    renderActivityChart(data.activity || []);
    renderFunnel(data.leadFunnel || {});
    renderMixChart(data.messageMix || {});
    renderBudgetBars(data.budgetDistribution || []);
    renderChannels(data.channels || []);
    renderInterests(data.topInterests || []);
    renderRecentLeads(data.recentLeads || []);
    BizFlowShell?.setDialogBadge(data.summary?.openDialogs || 0);
  }

  function renderSummary(summary, period) {
    if (!summary) return;

    setText("statMessages", summary.messages);
    setTrend("statMessagesTrend", summary.messagesTrend, "к прошлому периоду");

    setText("statDialogs", summary.dialogs);
    setTrend("statDialogsTrend", summary.dialogsTrend, "к прошлому периоду");

    setText("statAi", summary.aiResponses);
    const rateEl = document.getElementById("statAiRate");
    if (rateEl) {
      rateEl.textContent = `${summary.responseRate ?? 0}% ответов на сообщения клиентов`;
      rateEl.style.color = "#a78bfa";
    }

    setText("statConversion", `${summary.conversionRate ?? 0}%`);
    setTrend("statLeadsTrend", summary.leadsTrend, `новых лидов · всего ${summary.totalLeads ?? 0}`);

    const subtitle = document.getElementById("periodSubtitle");
    if (subtitle && period) {
      subtitle.textContent = `Статистика за ${period.label} · с ${period.from}`;
    }
  }

  function renderActivityChart(activity) {
    const canvas = document.getElementById("activityChart");
    if (!canvas || !window.Chart) return;

    if (activityChart) activityChart.destroy();

    activityChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: activity.map((d) => d.label),
        datasets: [
          {
            label: "Сообщения",
            data: activity.map((d) => d.messages),
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96, 165, 250, 0.1)",
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "Диалоги",
            data: activity.map((d) => d.dialogs),
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.08)",
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "Лиды",
            data: activity.map((d) => d.leads),
            borderColor: "#34d399",
            backgroundColor: "rgba(52, 211, 153, 0.08)",
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: chartOptions(),
    });
  }

  function renderMixChart(mix) {
    const canvas = document.getElementById("mixChart");
    if (!canvas || !window.Chart) return;

    if (mixChart) mixChart.destroy();

    const values = [mix.customer || 0, mix.ai || 0, mix.operatorMessages || 0];
    const hasData = values.some((v) => v > 0);

    mixChart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["Клиент", "ИИ", "Оператор"],
        datasets: [
          {
            data: hasData ? values : [1, 0, 0],
            backgroundColor: ["#60a5fa", "#a78bfa", "#fbbf24"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#94a3b8", boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
  }

  function renderFunnel(funnel) {
    const root = document.getElementById("leadFunnel");
    if (!root) return;

    const rows = [
      ["Новые", funnel.new || 0],
      ["В работе", funnel.inProgress || 0],
      ["Квалифицированы", funnel.qualified || 0],
      ["Конвертированы", funnel.converted || 0],
    ];
    const max = Math.max(...rows.map((r) => r[1]), 1);

    root.innerHTML = rows
      .map(
        ([label, value]) => `
        <div class="an-funnel-row">
          <span class="an-funnel-label">${escapeHtml(label)}</span>
          <div class="an-funnel-bar-wrap">
            <div class="an-funnel-bar" style="width:${Math.max(8, (value / max) * 100)}%"></div>
          </div>
          <span class="an-funnel-value">${value}</span>
        </div>`,
      )
      .join("");
  }

  function renderBudgetBars(items) {
    const root = document.getElementById("budgetBars");
    if (!root) return;

    if (!items.length) {
      root.innerHTML = `<div class="an-empty">Пока нет данных по бюджетам</div>`;
      return;
    }

    const max = Math.max(...items.map((i) => i.count), 1);
    root.innerHTML = items
      .map(
        (item) => `
        <div class="an-bar-row">
          <div class="an-bar-top">
            <span>${escapeHtml(item.label)}</span>
            <strong>${item.count}</strong>
          </div>
          <div class="an-bar-track">
            <div class="an-bar-fill" style="width:${item.count ? Math.max(8, (item.count / max) * 100) : 0}%"></div>
          </div>
        </div>`,
      )
      .join("");
  }

  function renderChannels(channels) {
    const root = document.getElementById("channelStats");
    if (!root) return;

    root.innerHTML = channels
      .map(
        (ch) => `
        <div class="an-channel-row">
          <div>
            <div class="an-channel-name">${escapeHtml(ch.name)}${ch.connected ? "" : " · скоро"}</div>
            <div class="an-channel-meta">${ch.dialogs} диалогов · ${ch.messages} сообщений</div>
          </div>
          <div class="an-channel-share">${ch.share}%</div>
        </div>`,
      )
      .join("");
  }

  function renderInterests(items) {
    const root = document.getElementById("interestTags");
    if (!root) return;

    if (!items.length) {
      root.innerHTML = `<div class="an-empty">Интересы появятся из переписок с клиентами</div>`;
      return;
    }

    root.innerHTML = items
      .map((item) => `<span class="an-tag">${escapeHtml(item.label)} <span>${item.count}</span></span>`)
      .join("");
  }

  function renderRecentLeads(leads) {
    const root = document.getElementById("recentLeads");
    if (!root) return;

    if (!leads.length) {
      root.innerHTML = `<div class="an-empty">Лидов пока нет</div>`;
      return;
    }

    root.innerHTML = leads
      .map(
        (lead) => `
        <article class="an-lead-item">
          <div class="an-lead-top">
            <span class="an-lead-name">${escapeHtml(lead.name)}</span>
            <span class="an-lead-date">${escapeHtml(lead.date || "")}</span>
          </div>
          <p class="an-lead-need">${escapeHtml(lead.need || "Запрос уточняется")}</p>
          <div class="an-lead-meta">
            <span class="an-lead-badge">${escapeHtml(lead.statusLabel || "—")}</span>
            ${lead.budget ? `<span class="an-lead-badge an-lead-badge--budget">${escapeHtml(lead.budget)}</span>` : ""}
          </div>
        </article>`,
      )
      .join("");
  }

  function chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#94a3b8", boxWidth: 12, font: { size: 11 } },
        },
        tooltip: {
          backgroundColor: "#1e1e2e",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          titleColor: "#f1f5f9",
          bodyColor: "#94a3b8",
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { color: "#64748b", font: { size: 11 } },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { color: "#64748b", font: { size: 11 }, stepSize: 1 },
          border: { display: false },
        },
      },
    };
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "—";
  }

  function setTrend(id, value, suffix) {
    const el = document.getElementById(id);
    if (!el) return;
    const num = Number(value) || 0;
    const sign = num >= 0 ? "+" : "";
    el.textContent = `${sign}${Math.round(num)}% ${suffix}`;
    el.style.color = num >= 0 ? "#10b981" : "#ef4444";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
