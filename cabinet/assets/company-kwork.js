/**
 * Страница интеграции Kwork.
 * На данный момент бэкенд-эндпоинтов для Kwork ещё нет, поэтому страница
 * работает на демонстрационных (mock) данных и хранит состояние переключателей
 * только в памяти вкладки. Когда появится API (/api/company/my/integrations/kwork
 * и т.д.), функции ниже нужно будет заменить на BizFlowShell.apiGet/apiPost.
 */

const KWORK_MOCK_ORDERS = [
  { id: "52314591", title: "Разработка лендинга на Tilda", price: "18 000 ₽", status: "new", statusLabel: "Новый", time: "14:32" },
  { id: "52314577", title: "Доработка сайта на WordPress", price: "7 500 ₽", status: "progress", statusLabel: "В работе", time: "13:15" },
  { id: "52314562", title: "Настройка контекстной рекламы", price: "10 000 ₽", status: "new", statusLabel: "Новый", time: "12:45" },
  { id: "52314548", title: "Создание интернет-магазина", price: "25 000 ₽", status: "new", statusLabel: "Новый", time: "11:20" },
  { id: "52314533", title: "SEO-аудит сайта", price: "5 000 ₽", status: "done", statusLabel: "Завершен", time: "10:05" },
];

const KWORK_MOCK_ACTIVITY = {
  labels: ["15 июн.", "16 июн.", "17 июн.", "18 июн.", "19 июн.", "20 июн.", "21 июн."],
  orders: [0, 0, 1, 2, 4, 6, 15],
  messages: [0, 0, 1, 2, 3, 4, 9],
};

document.addEventListener("DOMContentLoaded", () => {
  renderOrders(KWORK_MOCK_ORDERS);
  renderActivityChart(KWORK_MOCK_ACTIVITY);
  setLastCheck();
  bindKeyToggle();
  bindCopyWebhook();
  bindSwitches();
  bindFormSubmits();
  bindDisconnect();
});

function renderOrders(orders) {
  const list = document.getElementById("kwOrdersList");
  if (!list) return;

  list.innerHTML = orders
    .map(
      (o) => `
        <div class="kw-order-row">
          <div class="kw-order-body">
            <p class="kw-order-id">#${escapeHtml(o.id)}</p>
            <p class="kw-order-title" title="${escapeHtml(o.title)}">${escapeHtml(o.title)}</p>
          </div>
          <div class="kw-order-price">${escapeHtml(o.price)}</div>
          <div class="kw-order-meta">
            <span class="kw-order-status kw-order-status--${o.status}">${escapeHtml(o.statusLabel)}</span>
            <span class="kw-order-time">${escapeHtml(o.time)}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function renderActivityChart(activity) {
  const canvas = document.getElementById("kwActivityChart");
  if (!canvas || !window.Chart) return;

  new Chart(canvas, {
    type: "line",
    data: {
      labels: activity.labels,
      datasets: [
        {
          label: "Заказы",
          data: activity.orders,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.12)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: "Сообщения",
          data: activity.messages,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
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
          ticks: { color: "#64748b", font: { size: 11 }, stepSize: 5 },
          border: { display: false },
        },
      },
    },
  });
}

function setLastCheck() {
  const el = document.getElementById("kwLastCheck");
  if (!el) return;
  const now = new Date();
  const date = now.toLocaleDateString("ru-RU");
  const time = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  el.textContent = `${date}, ${time}`;
}

function bindKeyToggle() {
  const input = document.getElementById("kwApiKey");
  const btn = document.getElementById("kwToggleKey");
  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.querySelector(".kw-eye-icon--hide").hidden = isHidden;
    btn.querySelector(".kw-eye-icon--show").hidden = !isHidden;
  });
}

function bindCopyWebhook() {
  const input = document.getElementById("kwWebhookUrl");
  const btn = document.getElementById("kwCopyWebhook");
  if (!input || !btn) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(input.value);
      btn.classList.add("kw-copied");
      setTimeout(() => btn.classList.remove("kw-copied"), 1500);
    } catch {
      input.select();
      document.execCommand("copy");
    }
  });

  const testBtn = document.getElementById("kwTestWebhook");
  testBtn?.addEventListener("click", () => {
    testBtn.disabled = true;
    const originalText = testBtn.textContent;
    testBtn.textContent = "Проверяем…";
    setTimeout(() => {
      testBtn.disabled = false;
      testBtn.textContent = originalText;
      setLastCheck();
    }, 900);
  });
}

function bindSwitches() {
  const pairs = [
    ["kwAutoReplyToggle", "kwAutoReplyState"],
    ["kwContextToggle", "kwContextState"],
    ["kwCreateLeadToggle", "kwCreateLeadState"],
  ];

  pairs.forEach(([inputId, labelId]) => {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if (!input || !label) return;
    input.addEventListener("change", () => {
      label.textContent = input.checked ? "Включено" : "Выключено";
    });
  });
}

function bindFormSubmits() {
  const connectionForm = document.getElementById("kwConnectionForm");
  connectionForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    flashButton(connectionForm.querySelector(".kw-form-submit"));
  });

  document.getElementById("kwSaveAutoReply")?.addEventListener("click", (e) => {
    flashButton(e.currentTarget);
  });

  document.getElementById("kwSaveLeads")?.addEventListener("click", (e) => {
    flashButton(e.currentTarget);
  });
}

function flashButton(btn) {
  if (!btn) return;
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Сохранено ✓";
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = original;
  }, 1200);
}

function bindDisconnect() {
  const btn = document.getElementById("disconnectButton");
  const statusBadge = document.getElementById("kwStatusBadge");
  if (!btn || !statusBadge) return;

  btn.addEventListener("click", () => {
    const connected = statusBadge.classList.contains("bf-status--ok");
    if (connected) {
      const confirmed = window.confirm("Отключить интеграцию с Kwork? Новые заказы и сообщения перестанут поступать в BizFlow AI.");
      if (!confirmed) return;
      statusBadge.textContent = "Отключено";
      statusBadge.classList.remove("bf-status--ok");
      statusBadge.classList.add("bf-status--off");
      btn.textContent = "Подключить интеграцию";
    } else {
      statusBadge.textContent = "Подключено";
      statusBadge.classList.remove("bf-status--off");
      statusBadge.classList.add("bf-status--ok");
      btn.textContent = "Отключить интеграцию";
    }
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
