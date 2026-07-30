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

boot();

function boot() {
    const run = () => {
        renderOrders(KWORK_MOCK_ORDERS);
        renderActivityChart(KWORK_MOCK_ACTIVITY);
        setLastCheck();
        bindKeyToggle();
        bindCopyWebhook();
        bindSwitches();
        bindFormSubmits();
        bindDisconnect();
        initCustomSelects();
        requestAnimationFrame(() => bindKeyToggle());
        setTimeout(() => bindKeyToggle(), 50);
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
        run();
    }
    window.addEventListener("pageshow", run);
    document.addEventListener("spa-navigated", () => setTimeout(run, 0));
}

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
            datasets: [{
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

    const setIconVisible = (icon, visible) => {
        if (!icon) return;
        icon.hidden = !visible;
        icon.style.setProperty("display", visible ? "block" : "none", "important");
        icon.setAttribute("aria-hidden", String(!visible));
    };

    const sync = () => {
        const hiddenPassword = input.type === "password";
        const hideIcon = btn.querySelector('[data-eye="hide"]');
        const showIcon = btn.querySelector('[data-eye="show"]');
        setIconVisible(hideIcon, hiddenPassword);
        setIconVisible(showIcon, !hiddenPassword);
    };

    btn.addEventListener("click", () => {
        input.type = input.type === "password" ? "text" : "password";
        sync();
    });

    sync();
}

function bindCopyWebhook() {
    const input = document.getElementById("kwWebhookUrl");
    const btn = document.getElementById("kwCopyWebhook");
    if (!input || !btn) return;

    btn.addEventListener("click", async() => {
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
    testBtn ?.addEventListener("click", () => {
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
    connectionForm ?.addEventListener("submit", (e) => {
        e.preventDefault();
        flashButton(connectionForm.querySelector(".kw-form-submit"));
    });

    document.getElementById("kwSaveAutoReply") ?.addEventListener("click", (e) => {
        flashButton(e.currentTarget);
    });

    document.getElementById("kwSaveLeads") ?.addEventListener("click", (e) => {
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

function initCustomSelects() {
    const selectIds = ["kwReplyStyle", "kwReplyLength", "kwLeadStatus", "kwLeadOwner", "kwLeadPriority"];
    selectIds.forEach((id) => setupCustomSelect(document.getElementById(id), document.getElementById(`${id}Custom`)));

    document.addEventListener("click", (e) => {
        document.querySelectorAll(".kw-custom-select.open").forEach((box) => {
            if (!box.contains(e.target)) closeCustomSelect(box);
        });
    });
}

function openCustomSelect(box) {
    box.classList.add("open");
    box.setAttribute("aria-expanded", "true");
    const dropdown = box.querySelector(".kw-custom-select__dropdown");
    dropdown ?.setAttribute("aria-hidden", "false");
}

function closeCustomSelect(box) {
    box.classList.remove("open");
    box.setAttribute("aria-expanded", "false");
    const dropdown = box.querySelector(".kw-custom-select__dropdown");
    dropdown ?.setAttribute("aria-hidden", "true");
}

function setupCustomSelect(select, box) {
    if (!select || !box) return;

    const trigger = box.querySelector(".kw-custom-select__trigger");
    const label = box.querySelector(".kw-custom-select__label");
    const options = box.querySelectorAll(".kw-custom-select__option");

    const applyValueToUI = (value, { silent = false } = {}) => {
        let matchedOption = null;
        options.forEach((opt) => {
            const isSel = opt.dataset.value === value;
            if (isSel) matchedOption = opt;
            opt.classList.toggle("selected", isSel);
            opt.setAttribute("aria-selected", String(isSel));
        });
        if (matchedOption && label) {
            label.textContent = (matchedOption.querySelector("span") ?.textContent || "").trim();
        }
        if (select.value !== value) {
            select.value = value;
            if (!silent) select.dispatchEvent(new Event("change"));
        }
    };

    const toggle = () => {
        if (box.classList.contains("open")) closeCustomSelect(box);
        else openCustomSelect(box);
    };

    trigger ?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
    });

    box.addEventListener("click", (e) => {
        const option = e.target.closest(".kw-custom-select__option");
        if (option) {
            e.preventDefault();
            e.stopPropagation();
            applyValueToUI(option.dataset.value);
            closeCustomSelect(box);
        }
    });

    box.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!box.classList.contains("open")) openCustomSelect(box);
        } else if (e.key === "Escape") {
            closeCustomSelect(box);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!box.classList.contains("open")) openCustomSelect(box);
            const list = Array.from(options);
            const idx = list.findIndex((o) => o.classList.contains("selected"));
            const next = list[(idx + 1) % list.length];
            next ?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!box.classList.contains("open")) openCustomSelect(box);
            const list = Array.from(options);
            const idx = list.findIndex((o) => o.classList.contains("selected"));
            const prev = list[(idx - 1 + list.length) % list.length];
            prev ?.focus();
        }
    });

    const syncFromHiddenSelect = () => applyValueToUI(select.value, { silent: true });

    if (!select._kwCustomPatched) {
        select._kwCustomPatched = true;
        if (select.form) {
            select.form.addEventListener("reset", () => setTimeout(syncFromHiddenSelect, 0));
        }
    }
}