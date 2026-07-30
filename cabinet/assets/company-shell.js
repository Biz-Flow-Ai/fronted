const api = window.BizFlowApi;

if (!api) {
    document.body.innerHTML =
        '<p style="padding:24px;color:#fff;font-family:sans-serif">Ошибка загрузки. Обновите страницу (Ctrl+F5).</p>';
} else if (!api.requireAuth()) {
    /* redirect */
}

let currentUserData = JSON.parse(localStorage.getItem("bizflow_user") || "null");

const shellInit = (async() => {
    if (!api) return null;
    try {
        currentUserData = await api.get("/api/auth/me");
        localStorage.setItem("bizflow_user", JSON.stringify(currentUserData));
        if (currentUserData.company) {
            localStorage.setItem("bizflow_company", JSON.stringify(currentUserData.company));
        }

        if (api.isAdmin(currentUserData.role)) {
            window.location.href = "/admin";
            return null;
        }

        const page = document.body.dataset.page || "home";
        const company = currentUserData.company;
        if (company && company.onboardingCompleted === false && page !== "onboarding") {
            window.location.href = "/company/onboarding";
            return null;
        }

        if (page === "onboarding" && company && company.onboardingCompleted === true) {
            window.location.href = "/company";
            return null;
        }

        if (page !== "onboarding") {
            renderSidebar();
            updateGreeting();
            bindUserCard();
        }
        return currentUserData;
    } catch (error) {
        if (api) api.logout();
        return null;
    }
})();

window.BizFlowShell = {
    ready: shellInit,
    setDialogBadge,
    apiGet: (url) => api.get(url),
    apiPost: (url, body) => api.post(url, body),
    currentUserData: () => currentUserData,
};

const NAV_ICONS = {
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    dialogs: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    clients: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
    leads: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    analytics: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    ai: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    vk: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.08 14.27h-1.46c-.55 0-.72-.44-1.71-1.42-.86-.82-1.24-.93-1.46-.93-.3 0-.39.08-.39.5v1.3c0 .36-.12.58-1.08.58-1.59 0-3.36-.96-4.6-2.75-1.87-2.64-2.38-4.63-2.38-4.77 0-.21.08-.4.5-.4h1.46c.37 0 .51.17.65.57.71 2.05 1.9 3.85 2.39 3.85.18 0 .27-.08.27-.54V9.74c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.36-.34h2.3c.31 0 .42.17.42.53v2.86c0 .31.14.42.23.42.18 0 .33-.11.66-.44 1.02-1.14 1.75-2.9 1.75-2.9.1-.21.26-.4.63-.4h1.46c.44 0 .53.23.44.53-.18.84-1.93 3.26-1.93 3.26-.15.25-.21.36 0 .65.15.21.66.64 1 1.04.61.73 1.08 1.34 1.21 1.76.13.42-.07.64-.48.64z"/></svg>',
    settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    profile: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    bot: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 2v6"/><circle cx="8.5" cy="14" r="1"/><circle cx="15.5" cy="14" r="1"/><path d="M9 18h6"/></svg>',
    book: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    kwork: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" opacity="0.15"/><text x="12" y="16.5" text-anchor="middle" fill="currentColor" font-size="12" font-weight="800" font-family="Inter,Arial,sans-serif">K</text></svg>',
};

function renderSidebar(dialogBadge = "0") {
    const page = document.body.dataset.page || "home";
    const sidebar = document.getElementById("companySidebar");
    if (!sidebar) return;

    const link = (id, href, label, icon, badge, disabled) => {
        const active = page === id ? " active" : "";
        const dis = disabled ? " disabled" : "";
        const badgeClass = badge === "NEW" ? "bf-nav-badge bf-nav-badge--new" : "bf-nav-badge";
        const badgeHtml = badge ? `<span class="${badgeClass}">${badge}</span>` : "";
        return `<a class="bf-nav-link${active}${dis}" href="${href}">${NAV_ICONS[icon] || ""}<span>${label}</span>${badgeHtml}</a>`;
    };

    sidebar.innerHTML = `
    <a class="bf-logo" href="/">
      <div class="bf-logo-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8l-6 4 6 4"/></svg>
      </div>
      <span class="bf-logo-text">Virexo</span>
    </a>

    <nav class="bf-nav-group">
      <span class="bf-nav-label">Главная</span>
      ${link("home", "/company", "Главная", "home")}
    </nav>

    <nav class="bf-nav-group">
      <span class="bf-nav-label">Основное</span>
      ${link("dialogs", "/company/dialogs", "Диалоги", "dialogs", dialogBadge)}
      ${link("clients", "/company/clients", "Клиенты", "clients")}
      ${link("leads", "/company/leads", "Заявки", "leads")}
      ${link("analytics", "/company/analytics", "Аналитика", "analytics")}
      ${link("ai", "/company/ai", "ИИ-ассистент", "ai")}
    </nav>

    <nav class="bf-nav-group">
      <span class="bf-nav-label">Интеграции</span>
      ${link("vk", "/company/vk", "VK", "vk")}
      ${link("telegram", "#", "Telegram", "dialogs", "", true)}
      ${link("kwork", "/company/kwork", "Kwork", "kwork", "NEW")}
      ${link("max", "#", "MAX", "dialogs", "", true)}
      ${link("whatsapp", "#", "WhatsApp", "dialogs", "", true)}
    </nav>

    <nav class="bf-nav-group">
      <span class="bf-nav-label">Помощь</span>
      ${link("docs", "/company/docs", "Документация", "book")}
    </nav>

    <nav class="bf-nav-group">
      <span class="bf-nav-label">Настройки</span>
      ${link("profile", "/company/profile", "Профиль", "profile")}
      ${link("staff", "#", "Сотрудники", "clients", "", true)}
      ${link("roles", "#", "Роли и права", "settings", "", true)}
      ${link("notify", "/company/notify", "Уведомления", "settings")}
      ${link("payments", "/company/payments", "Платежи", "settings")}
      ${link("plans", "/company/plans", "Тарифы", "settings")}
      ${link("bot-settings", "/company/settings#bot", "Настройки бота", "bot")}
    </nav>

    <div class="bf-user-card" id="userCard" title="Открыть профиль">
      <div class="bf-user-avatar" id="userAvatar">?</div>
      <div class="bf-user-info">
        <div class="bf-user-name" id="userName">Пользователь</div>
        <div class="bf-user-role">Администратор</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.4"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  `;
}

function updateGreeting() {
    const el = document.getElementById("greetingTitle");
    if (!el || !currentUserData) return;
    const name = currentUserData.firstName || (currentUserData.email && currentUserData.email.split("@")[0]) || "коллега";
    el.textContent = `Добро пожаловать, ${name}!`;
}

function bindUserCard() {
    const name = [currentUserData.firstName, currentUserData.lastName].filter(Boolean).join(" ") ||
        currentUserData.email ||
        "Пользователь";
    const initials = name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const roleLabel =
        currentUserData.role === 2 || currentUserData.role === "CompanyOwner" ?
        "Владелец" :
        currentUserData.role === 0 || currentUserData.role === "Admin" ?
        "Администратор" :
        "Оператор";

    const userName = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");
    const userRole = document.querySelector(".bf-user-role");
    if (userName) userName.textContent = name;
    if (userAvatar) userAvatar.textContent = initials;
    if (userRole) userRole.textContent = roleLabel;

    var uc = document.getElementById("userCard");
    if (uc) uc.addEventListener("click", function() {
        window.location.href = "/company/profile";
    });
}

function setDialogBadge(count) {
    renderSidebar(String(count));
    bindUserCard();
}

/* ======================== SPA Router: smooth page transitions ======================== */
const SPA_ROUTER = (() => {
    const pageCache = new Map();
    let transitionEl = null;
    const PERSISTENT_CSS_HREFS = ["/assets/company-shell.css"];
    const SHELL_SCRIPT_HREFS = ["/assets/company-api.js", "/assets/company-shell.js"];
    let navigating = false;

    function ensureTransitionEl() {
        if (transitionEl && document.body.contains(transitionEl)) return transitionEl;
        transitionEl = document.createElement("div");
        transitionEl.className = "bf-page-transition";
        transitionEl.setAttribute("aria-hidden", "true");
        transitionEl.innerHTML = '<div class="bf-page-transition__spinner"></div>';
        document.body.appendChild(transitionEl);
        return transitionEl;
    }

    function normalizeUrl(url) {
        try {
            const u = new URL(url, location.origin);
            return u.pathname + (u.search || "") + (u.hash || "");
        } catch {
            return url;
        }
    }

    function isSpaRoute(url) {
        try {
            const u = new URL(url, location.origin);
            if (u.origin !== location.origin) return false;
            if (!u.pathname.startsWith("/company")) return false;
            if (u.pathname.includes(".") && !u.pathname.endsWith("/")) {
                // allow /company/foo but not .php/etc
                const last = u.pathname.split("/").pop();
                if (last.includes(".")) return false;
            }
            return true;
        } catch { return false; }
    }

    function showOverlay() {
        const el = ensureTransitionEl();
        el.setAttribute("aria-hidden", "false");
        requestAnimationFrame(() => el.classList.add("is-active"));
    }

    function hideOverlay() {
        if (!transitionEl) return;
        transitionEl.classList.remove("is-active");
        transitionEl.setAttribute("aria-hidden", "true");
    }

    function parsePageScriptSrcs(doc) {
        const out = [];
        doc.querySelectorAll("script[src]").forEach((s) => {
            const src = s.getAttribute("src");
            if (src && !SHELL_SCRIPT_HREFS.some((h) => src.startsWith(h)) && !src.startsWith("http") && !src.startsWith("data:") && !src.includes("chart.js")) {
                out.push(src);
            }
            if (src && src.includes("chart.js")) {
                // skip
            }
        });
        return Array.from(new Set(out));
    }

    function parsePageStyles(doc) {
        const links = [];
        doc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
            const href = l.getAttribute("href") || "";
            if (PERSISTENT_CSS_HREFS.includes(href)) return;
            if (href.startsWith("https://fonts.googleapis")) return;
            if (href.startsWith("https://cdn.jsdelivr")) return;
            links.push(href);
        });
        return Array.from(new Set(links));
    }

    function parseHeadInlineStyles(doc) {
        return Array.from(doc.head.querySelectorAll("style")).map((s) => s.textContent);
    }

    async function loadPageDoc(url) {
        const key = url.split("#")[0].split("?")[0] || url;
        if (pageCache.has(key)) return pageCache.get(key);
        const res = await fetch(url, { credentials: "same-origin", headers: { "X-Spa-Navigate": "1" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const entry = {
            title: doc.title || document.title,
            page: doc.body ?.dataset ?.page || (new URL(url, location.origin).pathname.replace(/^\/company\/?/, "") || "home"),
            layoutHtml: doc.querySelector(".bf-layout") ? doc.querySelector(".bf-layout").innerHTML : "",
            styleHrefs: parsePageStyles(doc),
            headInlineStyles: parseHeadInlineStyles(doc),
            pageScriptSrcs: parsePageScriptSrcs(doc),
            scriptsInline: Array.from(doc.body.querySelectorAll("script:not([src])")).map((s) => s.textContent),
            stylesInlineBody: Array.from(doc.body.querySelectorAll("style")).map((s) => s.textContent),
            bodyClass: doc.body ? doc.body.className : "",
        };
        pageCache.set(key, entry);
        return entry;
    }

    function applyCachedPage(entry) {
        document.title = entry.title;
        document.body.dataset.page = entry.page;
        if (entry.bodyClass) {
            document.body.className = entry.bodyClass;
            if (!document.body.classList.contains("bf-app")) document.body.classList.add("bf-app");
        }

        /* Head styles — swap page css links */
        const head = document.head;
        head.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
            const href = l.getAttribute("href") || "";
            if (PERSISTENT_CSS_HREFS.includes(href)) return;
            if (href.startsWith("https://fonts.googleapis")) return;
            if (href.startsWith("https://cdn.jsdelivr")) return;
            l.remove();
        });
        entry.styleHrefs.forEach((href) => {
            if (head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return;
            const ln = document.createElement("link");
            ln.rel = "stylesheet";
            ln.href = href;
            head.appendChild(ln);
        });

        /* Head inline styles swap */
        head.querySelectorAll("style[data-spa-inline]").forEach((s) => s.remove());
        entry.headInlineStyles.forEach((txt) => {
            const st = document.createElement("style");
            st.setAttribute("data-spa-inline", "1");
            st.textContent = txt;
            head.appendChild(st);
        });

        /* Body inline styles (if any on pages with cards) */
        document.body.querySelectorAll(":scope > style[data-spa-inline-body]").forEach((s) => s.remove());
        entry.stylesInlineBody.forEach((txt) => {
            const st = document.createElement("style");
            st.setAttribute("data-spa-inline-body", "1");
            st.textContent = txt;
            document.body.appendChild(st);
        });

        /* Replace layout DOM */
        const layout = document.querySelector(".bf-layout");
        if (layout) {
            layout.innerHTML = entry.layoutHtml || "";
            layout.classList.remove("bf-layout--fading");
        }

        /* Re-init shell renderers (sidebar, user card) */
        renderSidebar();
        bindUserCard();
        if (typeof updateGreeting === "function") updateGreeting();

        /* Ensure SPA transition overlay back into new body */
        if (transitionEl && !document.body.contains(transitionEl)) document.body.appendChild(transitionEl);

        const runScripts = async() => {
            for (const src of entry.pageScriptSrcs) {
                await new Promise((resolve) => {
                    const bust = "v=" + Date.now();
                    const sep = src.includes("?") ? "&" : "?";
                    const s = document.createElement("script");
                    s.src = src + sep + bust;
                    s.async = false;
                    s.onload = resolve;
                    s.onerror = () => {
                        console.warn("SpaRouter: failed to load", src);
                        resolve();
                    };
                    document.body.appendChild(s);
                });
            }
            for (const code of entry.scriptsInline) {
                try {
                    (0, eval)(code); } catch (err) { console.error("SpaRouter inline script err:", err); }
            }
            window.scrollTo({ top: 0, behavior: "auto" });
            hideOverlay();
            requestAnimationFrame(() => {
                document.dispatchEvent(new CustomEvent("spa-navigated", { detail: { url: location.pathname, page: entry.page } }));
            });
        };

        Promise.resolve().then(runScripts);
    }

    async function navigateTo(rawUrl, opts = {}) {
        if (navigating) return;
        const url = normalizeUrl(rawUrl);
        const cur = normalizeUrl(location.href);
        if (!isSpaRoute(rawUrl)) {
            location.href = rawUrl;
            return;
        }
        if (url === cur && !opts.force) return;
        navigating = true;
        const layout = document.querySelector(".bf-layout");
        if (layout) layout.classList.add("bf-layout--fading");
        showOverlay();
        try {
            const entry = await loadPageDoc(url);
            if (opts.pushState !== false) {
                history.pushState({ spa: true, url: url }, "", rawUrl);
            }
            applyCachedPage(entry);
        } catch (err) {
            console.warn("SpaRouter fallthrough:", err);
            hideOverlay();
            if (layout) layout.classList.remove("bf-layout--fading");
            location.href = rawUrl;
        } finally {
            navigating = false;
        }
    }

    function installLinkInterceptor() {
        document.addEventListener("click", (e) => {
            if (e.defaultPrevented) return;
            if (e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target.closest("a[href]");
            if (!a) return;
            const href = a.getAttribute("href") || "";
            if (a.target && a.target !== "_self") return;
            if (a.hasAttribute("download")) return;
            if (a.getAttribute("rel") && /\bexternal\b/.test(a.getAttribute("rel"))) return;
            if (href.startsWith("#")) return;
            if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
            if (!isSpaRoute(href.startsWith("/") ? href : a.href)) return;
            e.preventDefault();
            navigateTo(href.startsWith("/") ? href : a.href);
        }, true);

        window.addEventListener("popstate", () => {
            if (!history.state || !history.state.spa) return;
            navigateTo(location.pathname + location.search + location.hash, { pushState: false, force: true });
        });
    }

    function start() {
        ensureTransitionEl();
        installLinkInterceptor();
    }

    return { start, navigateTo, clearCache: () => pageCache.clear() };
})();

document.addEventListener("DOMContentLoaded", () => SPA_ROUTER.start(), { once: true });
window.BizFlowSpa = SPA_ROUTER;