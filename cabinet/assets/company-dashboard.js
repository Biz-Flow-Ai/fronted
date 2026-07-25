let activityChart = null;

const CHANNEL_ICONS = {
  vk: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.254 2.151-3.185 2.151-3.185.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.203.322-.271.44 0 .78.186.254.78.780 1.186 1.253.745.712 1.304 1.253 1.459 1.642.17.407-.085.78-.576.78z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  kwork: `<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="17" text-anchor="middle" fill="currentColor" font-size="15" font-weight="800" font-family="Inter,Arial,sans-serif">K</text></svg>`,
};

function getMaxIcon(uid) {
  return `<svg viewBox="0 0 40 40" aria-hidden="true" class="bf-channel-icon-max">
    <defs>
      <linearGradient id="max-grad-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2AABEE"/>
        <stop offset="50%" stop-color="#7C5CFF"/>
        <stop offset="100%" stop-color="#FF4FD8"/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="11" fill="url(#max-grad-${uid})"/>
    <text x="20" y="25" text-anchor="middle" fill="#fff" font-size="11" font-weight="800" font-family="Inter,Arial,sans-serif">max</text>
  </svg>`;
}

function getChannelIconMarkup(channelId, index) {
  if (channelId === "max") {
    return getMaxIcon(`ch-${index}`);
  }
  return CHANNEL_ICONS[channelId] || "";
}

let dashboardPollTimer = null;

initDashboard();

async function initDashboard() {
  try {
    const data = await BizFlowShell.apiGet("/api/company/my/dashboard");
    renderStats(data.stats, data.activity);
    renderChannels(data.channels);
    renderVkSteps(data.vkSetupStep);
    renderRecentDialogs(data.recentDialogs);
    renderActivityChart(data.activity);
    BizFlowShell.setDialogBadge(data.openDialogs || data.stats?.newDialogs || 0);
    startDashboardPolling();
  } catch (error) {
    console.error(error);
  }
}

function startDashboardPolling() {
  if (dashboardPollTimer) clearInterval(dashboardPollTimer);
  dashboardPollTimer = setInterval(async () => {
    if (document.hidden) return;
    try {
      const data = await BizFlowShell.apiGet("/api/company/my/dashboard");
      renderRecentDialogs(data.recentDialogs);
      BizFlowShell.setDialogBadge(data.openDialogs || data.stats?.newDialogs || 0);
    } catch {
      /* фоновое обновление */
    }
  }, 15000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      BizFlowShell.apiGet("/api/company/my/dashboard")
        .then((data) => {
          renderRecentDialogs(data.recentDialogs);
          BizFlowShell.setDialogBadge(data.openDialogs || data.stats?.newDialogs || 0);
        })
        .catch(() => {});
    }
  });
}

function renderStats(stats, activity) {
  if (!stats) return;

  setText("statDialogs", stats.newDialogs);
  setText("statLeads", stats.totalLeads);
  setText("statClients", stats.clients);
  setText("statViews", stats.views);

  setTrend("statDialogsTrend", stats.newDialogsTrend, "за сегодня");
  setTrend("statLeadsTrend", stats.leadsTrend, "за неделю");
  setTrend("statClientsTrend", stats.clientsTrend, "за неделю");
  setTrend("statViewsTrend", stats.viewsTrend, "за неделю");

  if (activity?.length) {
    drawSparkline("sparkDialogs", activity.map((d) => d.dialogs), "#60a5fa");
    drawSparkline("sparkLeads", activity.map((d) => d.leads), "#34d399");
    drawSparkline("sparkClients", activity.map((d) => d.dialogs + d.leads), "#a78bfa");
    drawSparkline("sparkViews", activity.map((d) => d.dialogs * 2 + d.leads), "#fbbf24");
  }
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

function drawSparkline(id, values, color) {
  const svg = document.getElementById(id);
  if (!svg || !values.length) return;

  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * 120;
      const y = 32 - (v / max) * 28;
      return `${x},${y}`;
    })
    .join(" ");

  svg.innerHTML = `
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    <linearGradient id="grad-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient>
  `;
}

function renderChannels(channels) {
  const list = document.getElementById("channelsList");
  if (!list || !channels) return;

  list.innerHTML = channels
    .map((ch, index) => {
      const connected = ch.connected;
      const iconClass = {
        vk: "bf-channel-icon--vk",
        telegram: "bf-channel-icon--tg",
        max: "bf-channel-icon--max",
        whatsapp: "bf-channel-icon--wa",
        kwork: "bf-channel-icon--kwork",
      }[ch.id] || "";

      return `
        <div class="bf-channel-row">
          <div class="bf-channel-icon ${iconClass}" aria-hidden="true">
            ${getChannelIconMarkup(ch.id, index)}
          </div>
          <div class="bf-channel-info">
            <div class="bf-channel-name">${escapeHtml(ch.name)}</div>
            <span class="bf-status ${connected ? "bf-status--ok" : "bf-status--off"}">
              ${connected ? "Подключено" : "Не подключено"}
            </span>
          </div>
          <div class="bf-channel-actions">
            ${
              connected
                ? `<a class="bf-btn bf-btn--sm bf-btn--connected" href="${ch.configureUrl}">Настроить <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>`
                : `<a class="bf-btn bf-btn--sm bf-btn--primary" href="${ch.configureUrl}">Подключить</a>`
            }
          </div>
        </div>
      `;
    })
    .join("");
}

function renderVkSteps(currentStep) {
  document.querySelectorAll(".bf-vk-step").forEach((step) => {
    const num = Number(step.dataset.step);
    step.classList.remove("active", "done");
    if (num < currentStep) step.classList.add("done");
    if (num === currentStep) step.classList.add("active");
    if (currentStep >= 4 && num === 4) step.classList.add("active", "done");
  });
}

function renderRecentDialogs(dialogs) {
  const list = document.getElementById("recentDialogs");
  if (!list) return;

  if (!dialogs?.length) {
    list.innerHTML = '<p class="bf-empty-dialogs">Пока нет диалогов. Подключите VK и напишите боту.</p>';
    return;
  }

  list.innerHTML = dialogs
    .map((d) => {
      const initial = d.name?.charAt(0)?.toUpperCase() || "?";
      const channel = d.channel || "vk";
      const channelClass =
        channel === "telegram"
          ? "tg"
          : channel === "whatsapp"
            ? "wa"
            : channel === "max"
              ? "max"
              : channel === "kwork"
                ? "kwork"
                : "vk";
      const avatarHtml = renderDialogAvatar(d, initial, channelClass);

      return `
        <a class="bf-dialog-item" href="/company/dialogs">
          ${avatarHtml}
          <div class="bf-dialog-body">
            <div class="bf-dialog-top">
              <span class="bf-dialog-name">${escapeHtml(d.name)}</span>
              <span class="bf-dialog-meta">
                <span class="bf-dialog-channel bf-dialog-channel--${channelClass}">${escapeHtml(d.channelLabel || "VK")}</span>
                <span class="bf-dialog-time">${escapeHtml(d.time)}</span>
              </span>
            </div>
            <p class="bf-dialog-preview" title="${escapeHtml(d.preview)}">${escapeHtml(truncatePreview(d.preview))}</p>
            <span class="bf-dialog-status bf-dialog-status--${d.status}">${escapeHtml(d.statusLabel)}</span>
          </div>
        </a>
      `;
    })
    .join("");

  list.querySelectorAll(".bf-dialog-avatar-photo").forEach((img) => {
    img.addEventListener("error", () => {
      const wrap = img.closest(".bf-dialog-avatar-wrap");
      if (!wrap) return;
      const initial = img.dataset.initial || "?";
      const color = img.dataset.color || "#6366f1";
      const span = document.createElement("span");
      span.className = "bf-dialog-avatar bf-dialog-avatar-fallback";
      span.style.background = color;
      span.textContent = initial;
      img.replaceWith(span);
    });
  });
}

function renderDialogAvatar(dialog, initial, channelClass) {
  const photoUrl = String(dialog.avatarUrl || "").trim();
  const channelIcon = getChannelIconMarkup(dialog.channel || "vk");
  const color = escapeHtml(dialog.avatarColor || "#6366f1");
  const safeInitial = escapeHtml(initial);

  const avatarInner = photoUrl
    ? `<img class="bf-dialog-avatar-photo" src="${escapeHtml(photoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-initial="${safeInitial}" data-color="${color}" />`
    : `<span class="bf-dialog-avatar bf-dialog-avatar-fallback" style="background:${color}">${safeInitial}</span>`;

  return `
    <div class="bf-dialog-avatar-wrap">
      ${avatarInner}
      <span class="bf-dialog-source bf-dialog-channel-icon--${channelClass}" aria-hidden="true">${channelIcon}</span>
    </div>`;
}

function getChannelIconMarkup(channelId) {
  return CHANNEL_ICONS[channelId] || CHANNEL_ICONS.vk;
}

function truncatePreview(text, max = 80) {
  const value = String(text || "").replace(/\*+/g, "").replace(/\s+/g, " ").trim();
  if (!value) return "Нет сообщений";
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}

function renderActivityChart(activity) {
  const canvas = document.getElementById("activityChart");
  if (!canvas || !window.Chart || !activity?.length) return;

  const labels = activity.map((d) => d.label);
  const dialogs = activity.map((d) => d.dialogs);
  const leads = activity.map((d) => d.leads);

  if (activityChart) activityChart.destroy();

  activityChart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Диалоги",
          data: dialogs,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.12)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: "Заявки",
          data: leads,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.08)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e1e2e",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          titleColor: "#f1f5f9",
          bodyColor: "#94a3b8",
          padding: 12,
          cornerRadius: 8,
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
    },
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
