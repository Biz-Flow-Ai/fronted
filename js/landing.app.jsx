const { useEffect, useRef, useState } = React;

function VkIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="5.5" fill="#0077FF" />
      <path
        fill="#FFFFFF"
        d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.188 1.366 1.258 2.183 1.814.615.422 1.082.33 1.082.33l2.177-.03s1.138-.071.598-.967c-.044-.073-.314-.66-1.618-1.865-1.366-1.258-1.183-.105.462-3.218.998-1.678 1.397-2.7 1.272-3.14-.118-.412-.84-.303-.84-.303l-2.453.015s-.182-.025-.316.056-.522.43-.522.43-.937 2.504-2.183 4.63c-.415.707-.582.937-.804.937-.165 0-.165-.272-.165-.992V9.97c0-.84.025-1.19-.165-1.28-.165-.09-.57-.06-.735-.04-.15.015-.26.105-.26.21 0 .22.015.875.015 1.275 0 .39-.015 1.005-.015 1.005s-.015.39-.165.6c-.165.225-.48.24-.48.24h-1.08s-1.62.1-3.6-1.875C5.4 7.5 3.9 4.2 3.9 4.2s-.12-.3.015-.465c.12-.15.36-.195.36-.195h2.28s.165-.022.285.075c.105.09.165.285.165.285s.3.795.705 1.515c.855 1.635 1.2 1.725 1.335 1.62.33-.24.247-.975.247-1.5 0-.81-.12-1.155-.247-1.335-.195-.27-.555-.36-.735-.39-.165-.03.105-.075.45-.075.855 0 1.485.015 1.755.105.555.195.96.63.96.63s.51.675.51 1.65v2.475c0 .375.075.45.165.45.165 0 .45-.075.975-.75 1.335-1.755 2.295-4.455 2.295-4.455s.12-.285.33-.42c.255-.165.615-.12.615-.12l2.4-.015s.72-.045.855.33c.12.345-.285 1.245-1.335 2.7-.21.285-.375.525-.375.675 0 .165.12.315.375.615.855 1.005 1.935 2.16 2.145 2.895.21.72-.15 1.08-.15 1.08z"
      />
    </svg>
  );
}

function LogoStrip({ logos, stripKey = "a", hidden = false }) {
  return (
    <div className="logos" aria-hidden={hidden ? "true" : undefined}>
      {logos.map((logo, i) => (
        <div className="logo-item" key={`${stripKey}-${logo.name}-${i}`}>
          <img loading="lazy" src={logo.src} alt={logo.name} width="48" height="48" />
        </div>
      ))}
    </div>
  );
}

function LogoCarousel({ logos, direction = "left", speed = 0.55 }) {
  const trackRef = useRef(null);
  const offsetRef = useRef(direction === "right" ? null : 0);
  const stripWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const firstStrip = track.querySelector(".logos");
      stripWidthRef.current = firstStrip ? firstStrip.offsetWidth : 0;
      if (direction === "right" && offsetRef.current === null) {
        offsetRef.current = -stripWidthRef.current;
      }
    };

    measure();
    window.addEventListener("resize", measure);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return () => window.removeEventListener("resize", measure);
    }

    let rafId = 0;
    let last = performance.now();
    const sign = direction === "left" ? -1 : 1;

    const tick = (now) => {
      const dt = Math.min(now - last, 32);
      last = now;
      const stripW = stripWidthRef.current;
      if (stripW > 0) {
        if (offsetRef.current === null) offsetRef.current = direction === "right" ? -stripW : 0;
        offsetRef.current += sign * speed * (dt / 16);
        while (offsetRef.current <= -stripW) offsetRef.current += stripW;
        while (offsetRef.current > 0) offsetRef.current -= stripW;
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
    };
  }, [direction, speed, logos]);

  return (
    <div className="logo-carousel" data-direction={direction}>
      <div className="logos-track" ref={trackRef}>
        <LogoStrip logos={logos} stripKey="1" />
        <LogoStrip logos={logos} stripKey="2" />
        <LogoStrip logos={logos} stripKey="3" hidden />
      </div>
    </div>
  );
}

function ChannelMarquee() {
  const logos = Array.isArray(window.channelLogos) ? window.channelLogos : [];
  if (!logos.length) return null;

  return (
    <section className="vf-channels" id="channels" aria-labelledby="vf-channels-title">
      <div className="vf-channels-head reveal">
        <h2 className="vf-channels-title" id="vf-channels-title">API на любой канал</h2>
        <p className="vf-channels-lead">
          Ведите переписку там, где клиент — VK, Telegram, MAX, сайт, CRM и маркетплейсы.
        </p>
      </div>
      <div className="logos-section reveal">
        <LogoCarousel logos={logos} direction="left" speed={0.52} />
        <LogoCarousel logos={logos} direction="right" speed={0.48} />
      </div>
      <p className="vf-channels-note reveal">VK — уже работает · Telegram и MAX — в roadmap · API и сайт — Premium</p>
    </section>
  );
}

function Nav() {
  const auth = window.BizFlowAuth;
  const user = auth?.getUser?.();
  const loggedIn = Boolean(auth?.getToken?.() && user);

  return (
    <header className="nav-shell">
      <nav className="nav" aria-label="Главная навигация">
        <a href="/" className="nav-logo">
          BizFlow <span>AI</span>
        </a>

        <div className="nav-pill">
          <div className="nav-links">
            <a href="/#channels">Каналы</a>
            <a href="/#pipeline">Воронка</a>
            <a href="/#features">Возможности</a>
            <a href="/#integrations">Интеграции</a>
            <a href="/#products">Продукты</a>
            <a href="/#pricing">Тарифы</a>
          </div>
        </div>

        <div className="nav-buttons">
          {loggedIn ? (
            <a href="/company" className="nav-cta nav-cta-registr">Кабинет</a>
          ) : (
            <>
              <a href="/login" className="nav-cta">Войти</a>
              <a href="/register" className="nav-cta nav-cta-registr">Регистрация</a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

const HERO_STACK = [
  {
    id: "dialogs",
    label: "Диалоги",
    hint: "Все сообщения из VK — в одном кабинете",
    panelTitle: "Единая лента переписки",
    panelDesc: "Входящие из VK-сообщества попадают в BizFlow. История, контекст и статусы — без переключения между вкладками и мессенджерами.",
    panelBullets: ["Все чаты в одном окне", "Полная история по клиенту", "Работает круглосуточно"],
  },
  {
    id: "leads",
    label: "Заявки",
    hint: "Структурированная заявка с контекстом диалога",
    panelTitle: "Заявка из диалога",
    panelDesc: "AI собирает имя, телефон, услугу и пожелания — менеджер получает готовую карточку с полным контекстом переписки.",
    panelBullets: ["Автосбор контактов", "Контекст всего разговора", "Уведомление в кабинет"],
  },
  {
    id: "manager",
    label: "Менеджер",
    hint: "Квалификация лидов и ответы на вопросы",
    panelTitle: "ИИ-менеджер продаж",
    panelDesc: "Выявляет потребности, отвечает на вопросы о ценах и услугах, доводит диалог до заявки — как лучший менеджер первой линии.",
    panelBullets: ["Квалификация лидов", "Ответы из базы знаний", "Доведение до сделки"],
  },
  {
    id: "consult",
    label: "Консультант",
    hint: "Экспертные ответы из базы знаний",
    panelTitle: "ИИ-консультант",
    panelDesc: "Спокойно и подробно консультирует по услугам, условиям и FAQ. Знает ваш бизнес — отвечает уверенно и по делу.",
    panelBullets: ["Экспертный тон", "Ответы из документов", "Без шаблонных фраз"],
  },
  {
    id: "booking",
    label: "Запись",
    hint: "Бронь и подтверждение без администратора",
    panelTitle: "Запись на услугу",
    panelDesc: "Уточняет услугу, удобное время и телефон, подтверждает запись прямо в VK — администратор не отвлекается на рутину.",
    panelBullets: ["Сбор даты и времени", "Подтверждение в чате", "Напоминание клиенту"],
  },
];

function StackDetailPanel({ item, className = "" }) {
  if (!item) return null;
  return (
    <article className={`vf-stack-panel${className ? ` ${className}` : ""}`} aria-live="polite">
      <div className="vf-stack-panel-glow" aria-hidden="true" />
      <div className="vf-stack-panel-inner">
        <div className="vf-stack-panel-head">
          <span className="vf-stack-panel-kicker">Этап воронки</span>
          <h3 className="vf-stack-panel-title">{item.panelTitle}</h3>
        </div>
        <p className="vf-stack-panel-desc">{item.panelDesc}</p>
        <ul className="vf-stack-panel-list">
          {(item.panelBullets || []).map((b) => (
            <li key={b}><CheckIcon />{b}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5 6.5 12 13 4" />
    </svg>
  );
}

function AnimatedFestStack({ items, interval = 2600, ariaLabel, activeIndex, onActiveChange, interactive = false, autoPlay = false, hoverSelect = false }) {
  const [internalActive, setInternalActive] = useState(0);
  const isControlled = activeIndex !== undefined;
  const active = isControlled ? activeIndex : internalActive;

  const setActive = React.useCallback((next) => {
    if (isControlled) {
      const value = typeof next === "function" ? next(activeIndex) : next;
      onActiveChange?.(value);
    } else {
      setInternalActive(next);
    }
  }, [isControlled, onActiveChange, activeIndex]);

  const rowRefs = useRef([]);
  const stackRef = useRef(null);
  const [highlight, setHighlight] = useState({ top: 0, left: 0, height: 0, width: 0 });

  const measure = React.useCallback(() => {
    const row = rowRefs.current[active];
    const stack = stackRef.current;
    if (!row || !stack) return;
    const word = row.querySelector(".vf-fest-word");
    if (!word) return;
    const stackRect = stack.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    setHighlight({
      top: wordRect.top - stackRect.top,
      left: wordRect.left - stackRect.left,
      height: wordRect.height,
      width: wordRect.width,
    });
  }, [active]);

  useEffect(() => {
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!autoPlay || reduced || items.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval, setActive, autoPlay]);

  return (
    <div className={`vf-fest-stack${interactive ? " is-interactive" : ""}${hoverSelect ? " is-hover" : ""}`} ref={stackRef} aria-label={ariaLabel}>
      <div
        className="vf-fest-highlight"
        style={{
          transform: `translate(${highlight.left}px, ${highlight.top}px)`,
          height: highlight.height || undefined,
          width: highlight.width || undefined,
        }}
        aria-hidden="true"
      />
      <ul className="vf-fest-list">
        {items.map((item, i) => (
          <li
            key={item.id}
            ref={(el) => { rowRefs.current[i] = el; }}
            className={`vf-fest-row${i === active ? " is-active" : ""}`}
          >
            {interactive ? (
              <div
                className="vf-fest-btn"
                role="button"
                tabIndex={0}
                aria-pressed={i === active}
                onMouseEnter={() => hoverSelect && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
              >
                <span className="vf-fest-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="vf-fest-word">{item.label}</span>
                <span className="vf-fest-arrow"><ArrowIcon /></span>
              </div>
            ) : (
              <>
                <span className="vf-fest-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="vf-fest-word">{item.label}</span>
                <span className="vf-fest-arrow"><ArrowIcon /></span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M17 7H9M17 7v8" />
    </svg>
  );
}

function FeatureIcon({ name }) {
  const props = { viewBox: "0 0 24 24", width: 22, height: 22, fill: "none", stroke: "currentColor", strokeWidth: 1.75, "aria-hidden": true };
  switch (name) {
    case "vk":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0077FF" aria-hidden="true">
          <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.188 1.366 1.258 2.183 1.814.615.422 1.082.33 1.082.33l2.177-.03s1.138-.071.598-.967c-.044-.073-.314-.66-1.618-1.865-1.366-1.258-1.183-.105.462-3.218.998-1.678 1.397-2.7 1.272-3.14-.118-.412-.84-.303-.84-.303l-2.453.015s-.182-.025-.316.056-.522.43-.522.43-.937 2.504-2.183 4.63c-.415.707-.582.937-.804.937-.165 0-.165-.272-.165-.992V9.97c0-.84.025-1.19-.165-1.28-.165-.09-.57-.06-.735-.04-.15.015-.26.105-.26.21 0 .22.015.875.015 1.275 0 .39-.015 1.005-.015 1.005s-.015.39-.165.6c-.165.225-.48.24-.48.24h-1.08s-1.62.1-3.6-1.875C5.4 7.5 3.9 4.2 3.9 4.2s-.12-.3.015-.465c.12-.15.36-.195.36-.195h2.28s.165-.022.285.075c.105.09.165.285.165.285s.3.795.705 1.515c.855 1.635 1.2 1.725 1.335 1.62.33-.24.247-.975.247-1.5 0-.81-.12-1.155-.247-1.335-.195-.27-.555-.36-.735-.39-.165-.03.105-.075.45-.075.855 0 1.485.015 1.755.105.555.195.96.63.96.63s.51.675.51 1.65v2.475c0 .375.075.45.165.45.165 0 .45-.075.975-.75 1.335-1.755 2.295-4.455 2.295-4.455s.12-.285.33-.42c.255-.165.615-.12.615-.12l2.4-.015s.72-.045.855.33c.12.345-.285 1.245-1.335 2.7-.21.285-.375.525-.375.675 0 .165.12.315.375.615.855 1.005 1.935 2.16 2.145 2.895.21.72-.15 1.08-.15 1.08z"/>
        </svg>
      );
    case "bolt":
      return <svg {...props}><path d="M13 2 4 14h7l-1 8 10-14h-7l0-6z" strokeLinejoin="round" /></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" /></svg>;
    case "brain":
      return <svg {...props}><path d="M8.5 8.5a3 3 0 0 1 5 0M9 12a2.5 2.5 0 0 1 4 0M12 3v2M6 6l1.5 1.5M18 6l-1.5 1.5M5 14a4 4 0 0 0 3 3.87V21h4v-3.13A4 4 0 0 0 19 14" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "inbox":
      return <svg {...props}><path d="M4 4h16v12H4zM4 13h4l2 3h4l2-3h4" strokeLinejoin="round" /></svg>;
    case "users":
      return <svg {...props}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6M16 11a3 3 0 1 0 0-6M21 20c0-2.8-2.2-5-5-5" strokeLinecap="round" /></svg>;
    case "plug":
      return <svg {...props}><path d="M12 22v-5M9 8V2M15 8V2M9 8h6v4a4 4 0 0 1-8 0V8h2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "chart":
      return <svg {...props}><path d="M4 19V5M4 19h16M8 17V11M12 17V7M16 17v-4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "role":
      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M6 20v-1a6 6 0 0 1 12 0v1" strokeLinecap="round" /></svg>;
    case "chat":
      return <svg {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" strokeLinejoin="round" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function Footer() {
  return (
    <footer id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="contact-cta">
          <div className="contact-cta-content">
            <div className="section-label">Старт</div>
            <h2 className="contact-cta-title">Готовы запустить AI-сотрудника?</h2>
            <p className="contact-cta-text">
              Создайте аккаунт, подключите VK и назначьте роль — настройка занимает около 15 минут.
            </p>
            <div className="contact-cta-actions">
              <a href="/register" className="contact-cta-btn">Создать аккаунт →</a>
              <a href="mailto:support@bizflow.ru" className="contact-cta-link">support@bizflow.ru</a>
            </div>
          </div>
        </div>

        <div className="contact-grid">
          <a href="mailto:support@bizflow.ru" className="contact-card">
            <span className="contact-card-icon contact-card-icon--mail">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>
            </span>
            <span className="contact-card-label">Email</span>
            <span className="contact-card-value">support@bizflow.ru</span>
          </a>
          <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="contact-card contact-card--vk">
            <span className="contact-card-icon contact-card-icon--vk">
              <VkIcon size={22} />
            </span>
            <span className="contact-card-label">Сообщество</span>
            <span className="contact-card-value">Мы в VK</span>
          </a>
          <a href="/login" className="contact-card">
            <span className="contact-card-icon contact-card-icon--cabinet">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>
            </span>
            <span className="contact-card-label">Кабинет</span>
            <span className="contact-card-value">Войти в личный кабинет</span>
          </a>
        </div>

        <div className="contact-bar">
          <div className="contact-bar-logo">
            BizFlow <span>AI</span>
          </div>
          <div className="contact-bar-links">
            <a href="/login">Войти</a>
            <a href="/register">Регистрация</a>
            <a href="/#pricing">Тарифы</a>
            <a href="/#features">Возможности</a>
          </div>
          <div className="contact-bar-copy">© 2026 BizFlow AI</div>
        </div>
      </div>
    </footer>
  );
}

function HeroVisual() {
  return (
    <div className="vf-hero-visual" aria-hidden="true">
      <div className="vf-hero-orbit vf-hero-orbit--1" />
      <div className="vf-hero-orbit vf-hero-orbit--2" />
      <article className="vf-hero-metric vf-hero-metric--main">
        <span className="vf-hero-metric-val">30 сек</span>
        <span className="vf-hero-metric-label">среднее время ответа</span>
      </article>
      <article className="vf-hero-metric vf-hero-metric--b">
        <span className="vf-hero-metric-val">24/7</span>
        <span className="vf-hero-metric-label">без выходных</span>
      </article>
      <article className="vf-hero-metric vf-hero-metric--c">
        <span className="vf-hero-metric-val">15 мин</span>
        <span className="vf-hero-metric-label">подключение канала</span>
      </article>
      <div className="vf-hero-chat">
        <div className="vf-hero-chat-head">
          <span className="vf-hero-chat-dot" />
          AI-менеджер онлайн
        </div>
        <div className="vf-hero-chat-bubble vf-hero-chat-bubble--in">Здравствуйте! Подскажите по услугам?</div>
        <div className="vf-hero-chat-bubble vf-hero-chat-bubble--out">Конечно! Расскажу о ценах и запишу на консультацию.</div>
      </div>
    </div>
  );
}

function FunnelShowcase() {
  const [active, setActive] = useState(0);
  const current = HERO_STACK[active] || HERO_STACK[0];

  return (
    <section className="vf-pipeline" id="pipeline">
      <div className="vf-inner">
        <div className="vf-section-head reveal">
          <div className="vf-kicker">Как это работает</div>
          <h2 className="vf-section-title vf-section-title--dark">
            Воронка <em>AI</em> — от диалога до заявки
          </h2>
          <p className="vf-section-lead vf-section-lead--dark">
            Наведите курсор на этап — справа откроется описание. Так работает AI-сотрудник в любом канале.
          </p>
        </div>

        <div className="vf-pipeline-shell reveal">
          <div className="vf-pipeline-glow" aria-hidden="true" />
          <div className="vf-pipeline-grid">
            <div className="vf-pipeline-stack">
              <AnimatedFestStack
                items={HERO_STACK}
                ariaLabel="Этапы работы AI-сотрудника"
                activeIndex={active}
                onActiveChange={setActive}
                interactive
                hoverSelect
              />
              <p className="vf-stack-hint vf-stack-hint--pipeline">Диалоги → Заявки → Менеджер → Консультант → Запись</p>
            </div>
            <StackDetailPanel item={current} className={current ? "is-visible" : ""} key={current?.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const heroPerks = Array.isArray(window.heroPerks) ? window.heroPerks : [];

  return (
    <section className="vf-hero hero">
      <div className="vf-hero-bg" aria-hidden="true" />

      <div className="vf-hero-inner">
        <div className="vf-hero-grid reveal">
          <div className="vf-hero-copy">
            <div className="vf-hero-badge">
              <span className="vf-hero-badge-dot" aria-hidden="true" />
              VK · Telegram · MAX · API · Сайт
            </div>

            <div className="vf-hero-chips" aria-label="Поддерживаемые каналы">
              {(Array.isArray(window.heroChannelIcons) ? window.heroChannelIcons : []).map((icon) => (
                <span className="vf-hero-chip" key={icon.name}>
                  <img src={icon.src} alt={icon.name} width="28" height="28" loading="lazy" />
                </span>
              ))}
            </div>

            <h1 className="vf-hero-title">
              Создавайте <span className="vf-hero-title-accent">ИИ-сотрудников</span> для продаж во всех каналах
            </h1>

            <p className="vf-hero-lead">
              BizFlow отвечает в VK, Telegram и MAX, на сайте и через API — собирает заявки и ведёт клиента до записи, 24/7.
            </p>

            <div className="vf-actions">
              <a href="/register" className="vf-btn-primary">
                Попробовать бесплатно
                <ArrowIcon />
              </a>
              <a href="/#channels" className="vf-btn-ghost">Все каналы</a>
            </div>
          </div>

          <HeroVisual />
        </div>

        {heroPerks.length > 0 && (
          <div className="vf-hero-strip reveal reveal-delay-1">
            {heroPerks.map((p) => (
              <div className="vf-hero-strip-item" key={p.title}>
                <strong>{p.title}</strong>
                <span>{p.sub}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturesSection({ items }) {
  return (
    <section className="vf-section vf-section--white" id="features">
      <div className="vf-inner">
        <div className="vf-section-head reveal">
          <div className="vf-kicker">Возможности</div>
          <h2 className="vf-section-title">Что может <em>BizFlow AI</em></h2>
        </div>
        <div className="vf-cap-grid">
          {items.map((item, i) => (
            <article
              className={`vf-cap-card reveal${i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : ""}`}
              key={item.title}
            >
              <div className="vf-cap-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="vf-cap-icon"><FeatureIcon name={item.icon} /></div>
              <h3 className="vf-cap-title">{item.title}</h3>
              <p className="vf-cap-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection({ items }) {
  return (
    <section className="vf-section vf-section--soft" id="integrations">
      <div className="vf-inner">
        <div className="vf-section-head reveal">
          <div className="vf-kicker">Интеграции</div>
          <h2 className="vf-section-title">Подключение <em>без кода</em></h2>
          <p className="vf-section-lead">
            VK, Telegram, MAX, сайт, API и CRM — всё настраивается из кабинета за 15 минут.
          </p>
        </div>
        <div className="vf-int-grid">
          {items.map((item, i) => (
            <article className={`vf-int-card reveal${i % 2 === 1 ? " reveal-delay-1" : ""}`} key={item.title}>
              <h3 className="vf-int-title">{item.title}</h3>
              <p className="vf-int-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsStrip({ items }) {
  if (!items.length) return null;
  return (
    <section className="vf-benefits" id="benefits">
      <div className="vf-inner">
        <div className="vf-benefits-grid">
          {items.map((item, i) => (
            <article className={`vf-benefit reveal${i === 1 ? " reveal-delay-1" : i === 2 ? " reveal-delay-2" : ""}`} key={item.title}>
              <div className="vf-benefit-icon"><FeatureIcon name={item.icon} /></div>
              <h3 className="vf-benefit-title">{item.title}</h3>
              <p className="vf-benefit-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ items }) {
  return (
    <section className="vf-section vf-section--sky" id="products">
      <div className="vf-inner">
        <div className="vf-section-head reveal">
          <div className="vf-kicker">Продукты</div>
          <h2 className="vf-section-title">Флагманские <em>роли AI</em></h2>
          <p className="vf-section-lead">Назначьте нейро-сотрудника под задачу вашего бизнеса</p>
        </div>
        <div className="vf-product-grid">
          {items.map((p, i) => (
            <article className={`vf-product-card reveal${i === 1 ? " reveal-delay-1" : i === 2 ? " reveal-delay-2" : ""}`} key={p.id}>
              <h3 className="vf-product-title">{p.label}</h3>
              <p className="vf-product-desc">{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="vf-section vf-section--white" id="support">
      <div className="vf-inner vf-support reveal">
        <div className="vf-kicker">Поддержка</div>
        <h2 className="vf-section-title">Служба заботы, которой <em>не всё равно</em></h2>
        <p className="vf-section-lead vf-support-text">
          Поможем подключить VK, настроить роль и сценарии, отредактируем промпт и подскажем по интеграции.
          Напишите на support@bizflow.ru — разберёмся вместе.
        </p>
      </div>
    </section>
  );
}

function Pricing({ plans = [] }) {
  if (!plans.length) return null;
  return (
    <section className="vf-pricing" id="pricing">
      <div className="vf-inner">
        <div className="vf-section-head reveal">
          <div className="vf-kicker">Тарифы</div>
          <h2 className="vf-section-title">Понятная тарификация <em>без скрытых платежей</em></h2>
          <p className="vf-section-lead">
            Платите за пакет диалогов — без подсчёта токенов. Чем больше объём, тем выгоднее.
          </p>
        </div>
        <div className="vf-pricing-grid">
          {plans.map((plan, i) => (
            <article className={`vf-price-card reveal${plan.popular ? " popular" : ""}${i ? ` reveal-delay-${Math.min(i, 3)}` : ""}`} key={i}>
              {plan.popular && <div className="vf-popular-badge">Популярный</div>}
              <div className="vf-price-name">{plan.name}</div>
              <div className="vf-price-amount">
                {plan.price}
                {plan.period && <span> {plan.period}</span>}
              </div>
              <div className="vf-price-desc">{plan.desc}</div>
              <ul className="vf-price-features">
                {(plan.features || []).slice(0, 6).map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a href="/register" className={`vf-price-btn${plan.primary ? " primary" : ""}`}>{plan.btn}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="vf-cta">
      <div className="vf-inner reveal">
        <h2 className="vf-cta-title">Готовы начать?</h2>
        <p className="vf-cta-text">
          Создайте аккаунт, подключите VK и назначьте роль AI-сотруднику.
        </p>
        <a href="/register" className="vf-btn-primary">Начать бесплатно</a>
      </div>
    </section>
  );
}

function LandingPage() {
  const features = Array.isArray(window.features) ? window.features : [];
  const integrations = Array.isArray(window.integrations) ? window.integrations : [];
  const products = Array.isArray(window.products) ? window.products : [];
  const benefits = Array.isArray(window.benefits) ? window.benefits : [];
  const plans = Array.isArray(window.plans) ? window.plans : [];

  useScrollReveal();

  return (
    <main>
      <Hero />
      <ChannelMarquee />
      <BenefitsStrip items={benefits} />
      <FunnelShowcase />
      <FeaturesSection items={features} />
      <IntegrationsSection items={integrations} />
      <ProductsSection items={products} />
      <SupportSection />
      <Pricing plans={plans} />
      <CtaBand />
    </main>
  );
}

function App() {
  return (
    <div className="app-container">
      <Nav />
      <LandingPage />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
