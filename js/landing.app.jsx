const { useState, useEffect, useRef } = React;

const Icons = {
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Sparkles: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.9 2.7L22 18l-2.1.9L19 22l-.9-3.1L16 18l2.1-1.3z"/><path d="M5 14l.7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7z"/>
    </svg>
  ),
  Brain: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>
    </svg>
  ),
  MessageCircle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Chart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Calendar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Zap: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Key: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  Quote: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M7.17 17A5.17 5.17 0 0 1 2 11.83V9a7 7 0 0 1 7-7h1v4h-1a3 3 0 0 0-3 3v1h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v3h1.17zm10 0A5.17 5.17 0 0 1 12 11.83V9a7 7 0 0 1 7-7h1v4h-1a3 3 0 0 0-3 3v1h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v3h1.17z"/>
    </svg>
  ),
  Send: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Plug: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4"/>
    </svg>
  ),
  Inbox: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  VK: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.721-1.033-1-1.479-1.137-1.743-1.137-.357 0-.459.102-.459.593v1.565c0 .424-.135.678-1.253.678-1.845 0-3.896-1.118-5.339-3.202C4.624 10.857 4 8.482 4 7.992c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.152.135-.305.339-.305h2.744c.287 0 .389.153.389.643v2.727c0 .372.17.508.271.508.221 0 .458-.17 1.001-.747 1.523-1.948 2.489-3.981 2.489-3.981.12-.22.27-.44.711-.44h1.744c.543 0 .66.27.542.66-.254.813-2.098 3.624-2.098 3.624-.186.304-.254.44 0 .78.254.338 1.085 1.22 1.66 2.065.863 1.253 1.523 2.167 1.523 2.578 0 .255-.204.509-.712.509z"/>
    </svg>
  ),
  Telegram: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  WhatsApp: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Hash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  ),
  Layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
};

const channelLogos = [
  { name: "ВКонтакте", src: "/images/integrations/vk.svg" },
  { name: "Telegram", src: "/images/integrations/telegram.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "Email", imgType: "icon" },
  { name: "Сайт", imgType: "site" },
  { name: "MAX", src: "/images/integrations/max.svg" },
  { name: "Авито", src: "/images/integrations/avito.jpg" },
  { name: "Wildberries", src: "/images/integrations/wildberries.svg" },
  { name: "Я.Маркет", src: "/images/integrations/yandex-market.svg" },
  { name: "Одноклассники", src: "/images/integrations/ok.svg" },
  { name: "HH", src: "/images/integrations/hh.svg" },
  { name: "Alfa CRM", src: "/images/integrations/alfa-crm.svg" },
];

const duplicateForMarquee = (arr) => [...arr, ...arr];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    const items = el.querySelectorAll(".reveal");
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);
  return ref;
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`nav-shell ${scrolled ? "scrolled" : ""}`}>
      <nav className="nav">
        <a href="#" className="nav-logo">
          <span className="nav-logo-mark">B</span>
          Biz<span>Flow</span>
        </a>
        <div className="nav-pill">
          <div className="nav-links">
            <a href="#channels">Каналы</a>
            <a href="#features">Возможности</a>
            <a href="#ai">ИИ-ассистент</a>
            <a href="#how">Как работает</a>
            <a href="#pricing">Тарифы</a>
          </div>
        </div>
        <div className="nav-buttons">
          <a href="/login" className="nav-cta">Войти</a>
          <a href="#pricing" className="nav-cta nav-cta-primary">Начать бесплатно</a>
        </div>
      </nav>
    </div>
  );
}

function Hero() {
  return (
    <section className="landing-hero">
      <div className="hero-grid-bg" />
      <div className="landing-shell hero-shell">
        <div className="hero-copy reveal">
          <div className="hero-announcement">
            <span className="hero-announcement-dot" />
            Ранний доступ уже открыт для первых 100 компаний
          </div>
          <h1 className="hero-title">
            <span className="hero-title-line">Все каналы общения</span>
            <span className="hero-title-line">с клиентами —</span>
            <span className="hero-title-line hero-title-gradient">в одном окне</span>
          </h1>
          <p className="hero-lead">
            Единая платформа для управления сообщениями из VK, Telegram, WhatsApp, сайта и почты. AI-ассистент отвечает 24/7, автоматизирует рутину и помогает превращать обращения в сделки.
          </p>
          <div className="hero-actions">
            <a href="#pricing" className="hero-btn hero-btn-primary">
              Начать бесплатно
              <span className="hero-btn-arrow"><Icons.ArrowRight width="18" height="18" /></span>
            </a>
            <a href="#how" className="hero-btn hero-btn-secondary">
              <Icons.Play width="16" height="16" />
              Посмотреть как работает
            </a>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-item">
              <div className="hero-trust-icon">
                <Icons.Clock width="18" height="18" />
              </div>
              <div className="hero-trust-copy">
                <strong>Ответ за 30 секунд</strong>
                <span>Круглосуточно, без выходных</span>
              </div>
            </div>
            <div className="hero-trust-item">
              <div className="hero-trust-icon" style={{ background: "var(--secondary-soft)", color: "var(--secondary-hover)" }}>
                <Icons.Zap width="18" height="18" />
              </div>
              <div className="hero-trust-copy">
                <strong>Подключение за 15 минут</strong>
                <span>Без программистов и кода</span>
              </div>
            </div>
            <div className="hero-trust-item">
              <div className="hero-trust-icon" style={{ background: "rgba(139, 92, 246, 0.12)", color: "#7c3aed" }}>
                <Icons.Brain width="18" height="18" />
              </div>
              <div className="hero-trust-copy">
                <strong>ИИ на GigaChat</strong>
                <span>Знает ваш бизнес из коробки</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-2">
          <div className="hero-visual-float">
            <div className="hero-dashboard">
              <div className="hero-dashboard-header">
                <div className="hero-dash-dots"><span/><span/><span/></div>
                <div className="hero-dash-title">Центр диалогов · BizFlow</div>
                <div className="hero-dash-pill">В сети</div>
              </div>
              <div className="hero-dashboard-body">
                <div className="hero-chat-list">
                  <div className="hero-chat-item active">
                    <div className="hero-chat-avatar vk">АП</div>
                    <div className="hero-chat-copy">
                      <strong>Анна Петрова</strong>
                      <span>Добрый день! Скажите, сколько стоит доставка?</span>
                    </div>
                    <div className="hero-chat-meta">
                      <time>14:32</time>
                      <span className="hero-chat-badge">2</span>
                    </div>
                  </div>
                  <div className="hero-chat-item">
                    <div className="hero-chat-avatar tg">ИС</div>
                    <div className="hero-chat-copy">
                      <strong>Иван Смирнов</strong>
                      <span>Хочу записаться на консультацию</span>
                    </div>
                    <div className="hero-chat-meta"><time>14:28</time></div>
                  </div>
                  <div className="hero-chat-item">
                    <div className="hero-chat-avatar wa">ЕК</div>
                    <div className="hero-chat-copy">
                      <strong>Елена К.</strong>
                      <span>ИИ: Здравствуйте! У нас есть 3 тарифа...</span>
                    </div>
                    <div className="hero-chat-meta"><time>14:21</time></div>
                  </div>
                  <div className="hero-chat-item">
                    <div className="hero-chat-avatar site">МС</div>
                    <div className="hero-chat-copy">
                      <strong>Михаил (сайт)</strong>
                      <span>Подскажите по поводу акции</span>
                    </div>
                    <div className="hero-chat-meta"><time>13:59</time></div>
                  </div>
                </div>
                <div className="hero-stats-col">
                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-label">Диалоги</div>
                    <div className="hero-mini-stat-value">128</div>
                    <div className="hero-mini-stat-unit">за сегодня</div>
                  </div>
                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-label">Заявок</div>
                    <div className="hero-mini-stat-value">34</div>
                    <div className="hero-mini-stat-unit">новых лидов</div>
                  </div>
                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-label">Ответы ИИ</div>
                    <div className="hero-mini-stat-value">86%</div>
                    <div className="hero-mini-stat-unit">автоматически</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-floating-tag ai">
              <Icons.Sparkles width="16" height="16" style={{ color: "#8b5cf6" }} />
              ИИ отвечает за вас
            </div>
            <div className="hero-floating-tag channels">
              <Icons.MessageCircle width="16" height="16" style={{ color: "var(--primary)" }} />
              6+ каналов связи
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  const stats = [
    { value: "200+", suffix: " тыс", label: "бизнесов подключено" },
    { value: "14", suffix: " млн", label: "диалогов обработано" },
    { value: "86", suffix: "%", label: "ответов ИИ-ассистентом" },
    { value: "15", suffix: " мин", label: "на подключение" },
  ];
  return (
    <section className="stats-section">
      <div className="landing-shell">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className={`stat-card reveal reveal-delay-${Math.min(i + 1, 4)}`}>
              <strong>{s.value}<small>{s.suffix}</small></strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoMarquee() {
  const logos = duplicateForMarquee(channelLogos);
  return (
    <section className="logo-section">
      <div className="landing-shell">
        <div className="logo-section-label reveal">Интеграции с популярными сервисами</div>
        <div className="logo-marquee reveal reveal-delay-1">
          <div className="logo-track">
            {logos.map((l, i) => (
              <div key={i} className="logo-chip">
                {l.imgType === "icon" && <Icons.Mail width="22" height="22" style={{ color: "var(--accent-amber)" }} />}
                {l.imgType === "site" && <Icons.Globe width="22" height="22" style={{ color: "var(--accent-violet)" }} />}
                {l.src && <img src={l.src} alt={l.name} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                <span>{l.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChannelsSection() {
  const channels = [
    {
      cls: "vk", Icon: Icons.VK, title: "ВКонтакте",
      desc: "Отвечайте на сообщения из ВК прямо в BizFlow. ИИ ответит даже в нерабочее время.",
      list: ["История всех переписок", "Голосовые и текстовые", "Шаблоны и быстрые ответы", "Маршрутизация по менеджерам"]
    },
    {
      cls: "tg", Icon: Icons.Telegram, title: "Telegram",
      desc: "Храните всю переписку в безопасном месте. Ни одного потерянного обращения.",
      list: ["Каналы и боты", "Защита данных клиентов", "Назначение ответственных", "Уведомления в реальном времени"]
    },
    {
      cls: "wa", Icon: Icons.WhatsApp, title: "WhatsApp",
      desc: "Запускайте рассылки и общайтесь с клиентами через официальный Business API.",
      list: ["Единый аккаунт для команды", "Без риска блокировок", "Массовые рассылки", "Шаблоны сообщений"]
    },
    {
      cls: "site", Icon: Icons.Globe, title: "Чат на сайте",
      desc: "Приглашайте посетителей в диалог и отвечайте на вопросы, пока они на сайте.",
      list: ["Умные приглашения", "Сбор контактов", "Оффлайн-сообщения", "Адаптивный виджет"]
    },
    {
      cls: "email", Icon: Icons.Mail, title: "Электронная почта",
      desc: "Обрабатывайте письма в том же интерфейсе, что и мессенджеры — без переключений.",
      list: ["Любые почтовые ящики", "Автораспределение", "Теги и папки", "Отслеживание статуса"]
    },
    {
      cls: "max", Icon: Icons.Hash, title: "MAX и другие",
      desc: "Поддержка российских и международных мессенджеров — подключайте, что нужно.",
      list: ["MAX Messenger", "Одноклассники", "Авито и маркетплейсы", "REST API для своих"]
    },
  ];
  return (
    <section id="channels" className="landing-section channels-section">
      <div className="landing-shell">
        <div className="section-heading section-heading-center reveal">
          <div className="section-kicker"><Icons.MessageCircle width="14" height="14" /> Каналы связи</div>
          <h2>Общайтесь с клиентами <em>там, где им удобно</em></h2>
          <p>Все входящие сообщения из VK, Telegram, WhatsApp, сайта и почты стекаются в единый центр. Не теряйте заявки, переключаясь между вкладками.</p>
        </div>
        <div className="channels-grid">
          {channels.map((c, i) => (
            <div key={c.title} className={`channel-card ${c.cls} reveal reveal-delay-${(i % 6) + 1}`}>
              <div className="channel-card-icon">
                <c.Icon />
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <ul>
                {c.list.map((item) => (
                  <li key={item}><Icons.Check width="16" height="16" />{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { Icon: Icons.MessageCircle, title: "Сотни диалогов одновременно", desc: "ИИ-ассистент параллельно ведёт переписку во всех каналах — клиенты не ждут в очереди." },
    { Icon: Icons.Plug, title: "Подключение без кода", desc: "VK, Telegram, MAX, сайт и CRM подключаются из кабинета за 15 минут без разработчика." },
    { Icon: Icons.Users, title: "Встроенная CRM", desc: "Карточки клиентов, статусы, телефоны и история переписки — без Excel и внешних сервисов." },
    { Icon: Icons.Brain, title: "ИИ знает ваш бизнес", desc: "Загрузите услуги, цены и документы — ИИ отвечает как лучший менеджер по продажам." },
    { Icon: Icons.Calendar, title: "Запись на консультации", desc: "Уточняет удобное время, собирает телефон и автоматически подтверждает встречу." },
    { Icon: Icons.Inbox, title: "Сбор заявок 24/7", desc: "Формирует структурированную заявку из диалога и отправляет менеджеру в любой канал." },
  ];
  return (
    <section id="features" className="landing-section">
      <div className="landing-shell">
        <div className="section-heading section-heading-center reveal">
          <div className="section-kicker"><Icons.Layers width="14" height="14" /> Возможности</div>
          <h2>Всё, что нужно для <em>продаж и поддержки</em></h2>
          <p>Комплекс инструментов, который заменяет десятки разрозненных сервисов и помогает команде работать эффективнее.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={f.title} className={`feature-card reveal reveal-delay-${(i % 6) + 1}`}>
              <div className="feature-icon"><f.Icon /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiSection() {
  const benefits = [
    { Icon: Icons.Zap, title: "Ответ за 30 секунд", desc: "ИИ ведёт диалоги круглосуточно — клиенты не уходят к конкурентам, даже ночью." },
    { Icon: Icons.Brain, title: "Знает ваш бизнес", desc: "Настраивается под ваши услуги, цены и правила. Отвечает точно, без галлюцинаций." },
    { Icon: Icons.Users, title: "Разные роли ИИ", desc: "Менеджер по продажам, консультант или администратор — отдельная роль для каждого этапа воронки." },
  ];
  return (
    <section id="ai" className="landing-section ai-section">
      <div className="landing-shell ai-layout">
        <div className="ai-copy reveal">
          <div className="section-heading">
            <div className="section-kicker"><Icons.Sparkles width="14" height="14" /> ИИ-ассистент</div>
            <h2>ИИ, который <em>работает за вас</em></h2>
            <p>Внедрите искусственный интеллект в свой бизнес за 5 минут. Без разработчиков, сложных настроек и проектирования промптов.</p>
          </div>
          <div className="ai-benefits">
            {benefits.map((b, i) => (
              <div key={b.title} className={`ai-benefit reveal-delay-${i + 1}`}>
                <div className="ai-benefit-icon"><b.Icon /></div>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ai-visual reveal reveal-delay-3">
          <div className="ai-chat-window">
            <div className="ai-chat-header">
              <div className="ai-chat-avatar">
                <Icons.Brain width="20" height="20" />
              </div>
              <div className="ai-chat-head-copy">
                <strong>BizFlow AI · Менеджер продаж</strong>
                <span>Сейчас отвечает</span>
              </div>
            </div>
            <div className="ai-chat-body">
              <div className="ai-msg user">
                <div className="ai-msg-bubble">Добрый день! Скажите, у вас есть доставка по Москве и сколько она стоит?</div>
                <div className="ai-msg-time">14:32</div>
              </div>
              <div className="ai-msg ai">
                <div className="ai-msg-bubble">Здравствуйте! Да, мы осуществляем доставку по всей Москве и Московской области. Стоимость доставки в пределах МКАД — 350 ₽, бесплатна при заказе от 5 000 ₽. Подскажите, какой товар вас интересует? Я подскажу сроки и варианты оплаты.</div>
                <div className="ai-msg-time">14:32 · ИИ</div>
              </div>
              <div className="ai-msg user">
                <div className="ai-msg-bubble">Хочу комплект №4. Можно оплатить при получении?</div>
                <div className="ai-msg-time">14:33</div>
              </div>
              <div className="ai-msg ai">
                <div className="ai-msg-bubble">Отличный выбор! Да, оплата при получении доступна. Для оформления заказа уточните, пожалуйста:<br/>• Ваш номер телефона<br/>• Адрес доставки<br/>• Удобное время</div>
                <div className="ai-msg-time">14:33 · ИИ</div>
              </div>
            </div>
            <div className="ai-chat-input">
              <div className="ai-input-box">Напишите сообщение ИИ-ассистенту…</div>
              <button className="ai-send-btn" type="button">
                <Icons.Send width="16" height="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowSection() {
  const steps = [
    { n: 1, title: "Зарегистрируйтесь", desc: "Создайте аккаунт за 2 минуты через почту или Telegram. Никаких звонков и менеджеров." },
    { n: 2, title: "Подключите каналы", desc: "Добавьте VK, Telegram, WhatsApp и другие каналы из кабинета. На всё про всё — 15 минут." },
    { n: 3, title: "Расскажите ИИ о бизнесе", desc: "Загрузите услуги, цены и правила. Настройте роли ИИ — и он начнёт работать за вас." },
  ];
  return (
    <section id="how" className="landing-section">
      <div className="landing-shell">
        <div className="section-heading section-heading-center reveal">
          <div className="section-kicker"><Icons.Clock width="14" height="14" /> Как начать</div>
          <h2>Готово к работе <em>за 15 минут</em></h2>
          <p>Три простых шага — и ваша команда работает в едином интерфейсе, а ИИ-ассистент отвечает на первые обращения.</p>
        </div>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div key={s.n} className={`step-card reveal reveal-delay-${i + 1}`}>
              <div className="step-number">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const cards = [
    { Icon: Icons.Shield, title: "Защита базы клиентов", desc: "Храните контакты в BizFlow, а не в телефонах менеджеров. Увольнение сотрудника больше не проблема." },
    { Icon: Icons.Key, title: "Пароли не нужны операторам", desc: "Менеджеры отвечают из приложения, не получая доступ к аккаунтам мессенджеров и соцсетей." },
    { Icon: Icons.Eye, title: "Контроль переписки", desc: "Следите за качеством общения и анализируйте сохранённые диалоги — всегда знайте, что происходит." },
    { Icon: Icons.Lock, title: "Аккаунты — ваша собственность", desc: "Предотвратить утечку клиентов легче, чем компенсировать урон от их потери." },
  ];
  return (
    <section className="landing-section benefits-section">
      <div className="landing-shell">
        <div className="section-heading section-heading-center reveal">
          <div className="section-kicker"><Icons.Shield width="14" height="14" /> Защита бизнеса</div>
          <h2>Возьмите общение <em>под контроль</em></h2>
          <p>Уволившиеся сотрудники, потерянные телефоны и забытые пароли больше не повод для тревоги.</p>
        </div>
        <div className="benefits-grid">
          {cards.map((b, i) => (
            <div key={b.title} className={`benefit-card reveal reveal-delay-${i + 1}`}>
              <div className="benefit-card-icon"><b.Icon /></div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const items = [
    {
      text: "С подключением BizFlow ИИ-ассистента количество лидов выросло на <strong>70%</strong>, а конверсия в сделки увеличилась на 15%. Теперь мы не пропускаем ни одного сообщения даже в нерабочее время.",
      name: "Ольга Волкова", role: "Руководитель отдела обслуживания · «Ренессанс Жизнь»", avatar: "ОВ"
    },
    {
      text: "Подключение мессенджеров позволило уже в первый месяц увеличить продажи на <strong>32%</strong>. Доступ к аккаунтам надёжно защищён — операторы отвечают из приложения, пароли знают только ответственные.",
      name: "Дмитрий Ковалёв", role: "Руководитель интернет-маркетинга · «Авилон»", avatar: "ДК"
    },
    {
      text: "Благодаря BizFlow мы можем оперативно связаться с клиентом и получить нужную информацию, не доставляя неудобства лишними звонками. Служба поддержки стала обрабатывать <strong>в 2 раза больше</strong> обращений.",
      name: "Анна Морозова", role: "Директор по операциям · «Пеплос»", avatar: "АМ"
    },
  ];
  return (
    <section className="landing-section">
      <div className="landing-shell">
        <div className="section-heading section-heading-center reveal">
          <div className="section-kicker"><Icons.Quote width="14" height="14" /> Отзывы</div>
          <h2>Нам <em>доверяют</em></h2>
          <p>От небольших студий до крупных корпораций — предприниматели масштабируют продажи и поддержку вместе с BizFlow.</p>
        </div>
        <div className="testimonials-grid">
          {items.map((t, i) => (
            <div key={t.name} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
              <div className="testimonial-quote"><Icons.Quote /></div>
              <p className="testimonial-text" dangerouslySetInnerHTML={{ __html: t.text }} />
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      code: "free", name: "Free", price: "0", period: "₽", desc: "Познакомьтесь с платформой",
      features: ["До 20 диалогов в месяц", "VK-бот и AI-ответы", "База знаний о компании", "Сбор заявок", "История переписки"],
      btn: "Начать бесплатно", primary: false, popular: false,
    },
    {
      code: "start", name: "Start", price: "990", period: "₽/мес", desc: "Для небольших команд",
      features: ["До 100 диалогов", "1 роль AI", "Сбор заявок из VK, TG, WA", "Уведомления о лидах", "FAQ и сценарии ответов"],
      btn: "Подключить Start", primary: false, popular: false,
    },
    {
      code: "business", name: "Business", price: "2 990", period: "₽/мес", desc: "Оптимальный тариф для роста",
      features: ["До 500 диалогов", "До 5 ролей AI", "Аналитика и воронка", "Запись на консультации", "Ежедневные сводки", "Полная CRM в кабинете"],
      btn: "Подключить Business", primary: true, popular: true,
    },
    {
      code: "premium", name: "Premium", price: "7 990", period: "₽/мес", desc: "Для агентств и большого потока",
      features: ["Безлимитные диалоги", "API и интеграции", "White Label", "Приоритетная поддержка", "Персональные роли ИИ"],
      btn: "Подключить Premium", primary: false, popular: false,
    },
  ];
  return (
    <section id="pricing" className="landing-section pricing-section">
      <div className="landing-shell">
        <div className="section-heading section-heading-center reveal">
          <div className="section-kicker"><Icons.Chart width="14" height="14" /> Тарифы</div>
          <h2>Честные цены <em>без сюрпризов</em></h2>
          <p>Выберите подходящий план и начните бесплатно. Меняйте тариф в любой момент без переплат.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <div key={p.code} className={`price-card ${p.popular ? "is-popular" : ""} reveal reveal-delay-${i + 1}`}>
              {p.popular && <div className="price-badge-popular">Популярный выбор</div>}
              <div className="price-head">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
              <div className="price-value">
                <strong>{p.price}</strong>
                <span>{p.period}</span>
              </div>
              <ul className="price-features">
                {p.features.map((f) => (
                  <li key={f}><Icons.Check width="16" height="16" />{f}</li>
                ))}
              </ul>
              <a href="/login" className={`price-button ${p.primary ? "price-button-primary" : ""}`}>{p.btn}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="landing-shell">
        <div className="final-cta reveal">
          <div className="final-cta-grid">
            <div className="final-cta-copy">
              <h2>Готовы начать получать больше заявок уже сегодня?</h2>
              <p>Подключите BizFlow и убедитесь сами. Ранний доступ бесплатен для первых 100 компаний.</p>
            </div>
            <div className="final-cta-actions">
              <a href="/login" className="final-cta-btn final-cta-btn-primary">
                Создать аккаунт бесплатно
                <Icons.ArrowRight width="18" height="18" />
              </a>
              <a href="#channels" className="final-cta-btn final-cta-btn-secondary">
                Узнать больше о каналах
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-section">
      <div className="landing-shell">
        <div className="footer-shell">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <span className="nav-logo-mark">B</span>
              Biz<span>Flow</span>
            </a>
            <p>Многофункциональная CRM-платформа для автоматизации взаимодействия с клиентами. Объединяем все каналы коммуникации в едином интерфейсе.</p>
          </div>
          <div className="footer-col">
            <h4>Продукт</h4>
            <ul className="footer-links">
              <li><a href="#channels">Каналы связи</a></li>
              <li><a href="#features">Возможности</a></li>
              <li><a href="#ai">ИИ-ассистент</a></li>
              <li><a href="#pricing">Тарифы</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Компания</h4>
            <ul className="footer-links">
              <li><a href="/login">Войти</a></li>
              <li><a href="/login">Регистрация</a></li>
              <li><a href="/panel">Панель</a></li>
              <li><a href="#">Блог</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Контакты</h4>
            <ul className="footer-contacts">
              <li><a href="mailto:hello@bizflow.ru">hello@bizflow.ru</a></li>
              <li><a href="tel:+78000000000">8 (800) 000-00-00</a></li>
              <li><a href="https://t.me/bizflow">Telegram</a></li>
              <li><a href="https://vk.com/bizflow">ВКонтакте</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-meta">
          <span>© {year} BizFlow. Все права защищены.</span>
          <span>Сделано с любовью для российского бизнеса</span>
        </div>
      </div>
    </footer>
  );
}

<<<<<<< Updated upstream
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

function getPlanHref(plan) {
  if (!plan) return "/register";
  const code = plan.code || plan.name?.toLowerCase?.() || "";
  const isFree = String(plan.price).replace(/[^\d]/g, "") === "0";
  if (isFree) return "/register";
  return `/pay?plan=${encodeURIComponent(code)}`;
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
              <a href={getPlanHref(plan)} className={`vf-price-btn${plan.primary ? " primary" : ""}`}>{plan.btn}</a>
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

=======
>>>>>>> Stashed changes
function App() {
  const rootRef = useReveal();
  return (
    <div className="app-container" ref={rootRef}>
      <Nav />
      <Hero />
      <StatsBand />
      <LogoMarquee />
      <ChannelsSection />
      <FeaturesSection />
      <AiSection />
      <HowSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
