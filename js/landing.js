(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svgProps = (extra) => Object.assign(
    { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
    extra || {}
  );

  const ICONS = {
    Check: (p) => `<svg ${toAttr(svgProps(p))}><polyline points="20 6 9 17 4 12"/></svg>`,
    ArrowRight: (p) => `<svg ${toAttr(svgProps(p))}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    Sparkles: (p) => `<svg ${toAttr(svgProps(p))}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.9 2.7L22 18l-2.1.9L19 22l-.9-3.1L16 18l2.1-1.3z"/><path d="M5 14l.7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7z"/></svg>`,
    Brain: (p) => `<svg ${toAttr(svgProps(p))}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/></svg>`,
    MessageCircle: (p) => `<svg ${toAttr(svgProps(p))}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    Users: (p) => `<svg ${toAttr(svgProps(p))}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    Chart: (p) => `<svg ${toAttr(svgProps(p))}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    Calendar: (p) => `<svg ${toAttr(svgProps(p))}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    Zap: (p) => `<svg ${toAttr(svgProps(p))}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    Shield: (p) => `<svg ${toAttr(svgProps(p))}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    Lock: (p) => `<svg ${toAttr(svgProps(p))}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    Eye: (p) => `<svg ${toAttr(svgProps(p))}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    Key: (p) => `<svg ${toAttr(svgProps(p))}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
    Quote: (p) => `<svg ${toAttr({ viewBox: '0 0 24 24', fill: 'currentColor' }, p)}><path d="M7.17 17A5.17 5.17 0 0 1 2 11.83V9a7 7 0 0 1 7-7h1v4h-1a3 3 0 0 0-3 3v1h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v3h1.17zm10 0A5.17 5.17 0 0 1 12 11.83V9a7 7 0 0 1 7-7h1v4h-1a3 3 0 0 0-3 3v1h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v3h1.17z"/></svg>`,
    Send: (p) => `<svg ${toAttr(Object.assign(svgProps(p), { 'stroke-width': '2.5' }))}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    Plug: (p) => `<svg ${toAttr(svgProps(p))}><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4"/></svg>`,
    Inbox: (p) => `<svg ${toAttr(svgProps(p))}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
    VK: (p) => `<svg ${toAttr({ viewBox: '0 0 24 24', fill: 'currentColor' }, p)}><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.721-1.033-1-1.479-1.137-1.743-1.137-.357 0-.459.102-.459.593v1.565c0 .424-.135.678-1.253.678-1.845 0-3.896-1.118-5.339-3.202C4.624 10.857 4 8.482 4 7.992c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.152.135-.305.339-.305h2.744c.287 0 .389.153.389.643v2.727c0 .372.17.508.271.508.221 0 .458-.17 1.001-.747 1.523-1.948 2.489-3.981 2.489-3.981.12-.22.27-.44.711-.44h1.744c.543 0 .66.27.542.66-.254.813-2.098 3.624-2.098 3.624-.186.304-.254.44 0 .78.254.338 1.085 1.22 1.66 2.065.863 1.253 1.523 2.167 1.523 2.578 0 .255-.204.509-.712.509z"/></svg>`,
    Telegram: (p) => `<svg ${toAttr({ viewBox: '0 0 24 24', fill: 'currentColor' }, p)}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
    WhatsApp: (p) => `<svg ${toAttr({ viewBox: '0 0 24 24', fill: 'currentColor' }, p)}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
    Mail: (p) => `<svg ${toAttr(svgProps(p))}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    Globe: (p) => `<svg ${toAttr(svgProps(p))}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    Hash: (p) => `<svg ${toAttr(svgProps(p))}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
    Layers: (p) => `<svg ${toAttr(svgProps(p))}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    Clock: (p) => `<svg ${toAttr(svgProps(p))}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    Play: (p) => `<svg ${toAttr(Object.assign(svgProps(p), { 'stroke-width': '2.5' }))}><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  };

  const channelLogos = [
    { name: 'ВКонтакте', icon: 'VK', slug: 'vk', color: '#0077ff' },
    { name: 'Telegram', icon: 'Telegram', slug: 'telegram', color: '#229ed9' },
    { name: 'WhatsApp', icon: 'WhatsApp', slug: 'whatsapp', color: '#25d366' },
    { name: 'Email', icon: 'Mail', slug: 'email', color: '#f59e0b' },
    { name: 'Сайт', icon: 'Globe', slug: 'site', color: '#8b5cf6' },
    { name: 'MAX', icon: 'Hash', slug: 'max', color: '#06b6d4' },
    { name: 'Авито', icon: 'Inbox', slug: 'avito', color: '#ef4444' },
    { name: 'Wildberries', icon: 'Layers', slug: 'wildberries', color: '#8b5cf6' },
    { name: 'Я.Маркет', icon: 'Chart', slug: 'yandex-market', color: '#f59e0b' },
    { name: 'Однокл.', icon: 'Users', slug: 'ok', color: '#ee8208' },
    { name: 'HH', icon: 'Eye', slug: 'hh', color: '#e02020' },
    { name: 'AlfaCRM', icon: 'Shield', slug: 'alfacrm', color: '#0077ff' },
  ];

  const duplicateForMarquee = (arr) => arr.concat(arr);

  function toAttr(obj) {
    return Object.keys(obj).map((k) => {
      const v = obj[k];
      if (v === undefined || v === null || v === false) return '';
      const key = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${key}="${escapeAttr(v)}"`;
    }).join(' ');
  }

  function escapeAttr(v) {
    return String(v).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function imageUrl(prompt, imageSize) {
    return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${encodeURIComponent(imageSize || 'square_hd')}`;
  }

  function portrait(prompt, alt, eager) {
    return `<img src="${imageUrl(prompt, 'square_hd')}" alt="${escapeAttr(alt)}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }

  function ic(name, size, style) {
    const sz = size || 18;
    const props = { width: sz, height: sz, style: style || '' };
    return (ICONS[name] || (() => ''))(props);
  }

  function iconImg(name) {
    const size = 24;
    return ic(name, size, '');
  }

  function brandLogo() {
    return `
      <span class="brand-logo" aria-hidden="true">
        <img class="brand-logo-mark-img" src="/icon/virexo_ic_logo.jpg" alt="" loading="eager" decoding="async">
        <img class="brand-logo-text-img" src="/icon/virexo_text_ic.jpg" alt="" loading="eager" decoding="async">
      </span>
      <span class="sr-only">Virexo</span>`;
  }

  function renderIntegrationBadge(logo) {
    switch (logo.slug) {
      case 'vk':
        return `<span class="logo-badge logo-badge-vk" aria-hidden="true">${ic('VK', 18)}</span>`;
      case 'telegram':
        return `<span class="logo-badge logo-badge-telegram" aria-hidden="true">${ic('Telegram', 18)}</span>`;
      case 'whatsapp':
        return `<span class="logo-badge logo-badge-whatsapp" aria-hidden="true">${ic('WhatsApp', 18)}</span>`;
      case 'email':
        return `<span class="logo-badge logo-badge-email" aria-hidden="true">${ic('Mail', 18)}</span>`;
      case 'site':
        return `<span class="logo-badge logo-badge-site" aria-hidden="true">${ic('Globe', 18)}</span>`;
      case 'max':
        return `<span class="logo-badge logo-badge-max" aria-hidden="true"><span class="logo-badge-text">MAX</span></span>`;
      case 'avito':
        return `<span class="logo-badge logo-badge-avito" aria-hidden="true"><span></span><span></span><span></span><span></span></span>`;
      case 'wildberries':
        return `<span class="logo-badge logo-badge-wb" aria-hidden="true"><span class="logo-badge-text">WB</span></span>`;
      case 'yandex-market':
        return `<span class="logo-badge logo-badge-ymarket" aria-hidden="true"><span class="logo-badge-text">Я</span></span>`;
      case 'ok':
        return `<span class="logo-badge logo-badge-ok" aria-hidden="true"><span class="logo-badge-text">OK</span></span>`;
      case 'hh':
        return `<span class="logo-badge logo-badge-hh" aria-hidden="true"><span class="logo-badge-text">hh</span></span>`;
      case 'alfacrm':
        return `<span class="logo-badge logo-badge-alfa" aria-hidden="true"><span class="logo-badge-text">A</span></span>`;
      default:
        return `<span class="logo-badge" aria-hidden="true">${iconImg(logo.icon)}</span>`;
    }
  }

  function renderNav() {
    return `
    <div class="nav-shell" id="navShell">
      <nav class="nav">
        <a href="#" class="nav-logo" aria-label="Virexo">
          ${brandLogo()}
        </a>
        <div class="nav-pill">
          <div class="nav-links">
            <a href="#channels">Каналы</a>
            <a href="#features">Возможности</a>
            <a href="#ai">Автоматизация</a>
            <a href="#how">Как работает</a>
            <a href="#pricing">Тарифы</a>
          </div>
        </div>
        <div class="nav-buttons">
          <a href="/login" class="nav-cta">Войти</a>
          <a href="#pricing" class="nav-cta nav-cta-primary">Начать бесплатно</a>
        </div>
      </nav>
    </div>`;
  }

  function renderHero() {
    const chats = [
      {
        cls: 'vk',
        name: 'Анна Петрова',
        message: 'Добрый день! Скажите, сколько стоит доставка?',
        time: '14:32',
        badge: '2',
        prompt: 'photorealistic close-up portrait of a smiling Russian woman, 28 years old, customer support client, natural daylight, soft studio background, business casual, realistic skin, high detail'
      },
      {
        cls: 'tg',
        name: 'Иван Смирнов',
        message: 'Хочу записаться на консультацию',
        time: '14:28',
        prompt: 'photorealistic portrait of a young Russian man, 32 years old, entrepreneur, neutral office background, natural light, realistic face, business casual, high detail'
      },
      {
        cls: 'wa',
        name: 'Елена К.',
        message: 'ИИ: Здравствуйте! У нас есть 3 тарифа...',
        time: '14:21',
        prompt: 'photorealistic portrait of a stylish woman, 31 years old, warm smile, soft daylight, modern office background, realistic facial features, high detail'
      },
      {
        cls: 'site',
        name: 'Михаил (сайт)',
        message: 'Подскажите по поводу акции',
        time: '13:59',
        prompt: 'photorealistic portrait of a friendly man, 35 years old, casual shirt, daylight portrait, realistic face, soft background blur, high detail'
      }
    ];
    return `
    <section class="landing-hero">
      <div class="hero-grid-bg"></div>
      <div class="landing-shell hero-shell">
        <div class="hero-copy reveal">
          <div class="hero-announcement">
            <span class="hero-announcement-dot"></span>
            Virexo уже подключают первые 100 компаний
          </div>
          <h1 class="hero-title">
            <span class="hero-title-line">Все каналы общения</span>
            <span class="hero-title-line">с клиентами —</span>
            <span class="hero-title-line hero-title-gradient">в одном окне</span>
          </h1>
          <p class="hero-lead">
            Единая платформа для управления сообщениями из VK, Telegram, WhatsApp, сайта и почты. Умный ассистент отвечает 24/7, автоматизирует рутину и помогает превращать обращения в сделки.
          </p>
          <div class="hero-actions">
            <a href="#pricing" class="hero-btn hero-btn-primary">
              Начать бесплатно
              <span class="hero-btn-arrow">${ic('ArrowRight', 18)}</span>
            </a>
            <a href="#how" class="hero-btn hero-btn-secondary">
              ${ic('Play', 16)}
              Посмотреть как работает
            </a>
          </div>
          <div class="hero-trust">
            <div class="hero-trust-item">
              <div class="hero-trust-icon">${ic('Clock', 18)}</div>
              <div class="hero-trust-copy">
                <strong>Ответ за 30 секунд</strong>
                <span>Круглосуточно, без выходных</span>
              </div>
            </div>
            <div class="hero-trust-item">
              <div class="hero-trust-icon" style="background: var(--secondary-soft); color: var(--secondary-hover)">${ic('Zap', 18)}</div>
              <div class="hero-trust-copy">
                <strong>Подключение за 15 минут</strong>
                <span>Быстрый запуск без разработчика</span>
              </div>
            </div>
            <div class="hero-trust-item">
              <div class="hero-trust-icon" style="background: rgba(139, 92, 246, 0.12); color: #7c3aed">${ic('Brain', 18)}</div>
              <div class="hero-trust-copy">
                <strong>Ассистент знает ваш бизнес</strong>
                <span>Учитывает ваши услуги, цены и правила</span>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-visual reveal reveal-delay-2">
          <div class="hero-visual-float">
            <div class="hero-dashboard">
              <div class="hero-dashboard-header">
                <div class="hero-dash-dots"><span></span><span></span><span></span></div>
                <div class="hero-dash-title">Центр диалогов · Virexo</div>
                <div class="hero-dash-pill">В сети</div>
              </div>
              <div class="hero-dashboard-body">
                <div class="hero-chat-list">
                  ${chats.map((chat, index) => `
                    <div class="hero-chat-item ${index === 0 ? 'active' : ''}">
                      <div class="hero-chat-avatar ${chat.cls}">
                        ${portrait(chat.prompt, chat.name, index === 0)}
                        <span class="hero-chat-channel">${iconImg(chat.cls === 'site' ? 'Globe' : chat.cls === 'vk' ? 'VK' : chat.cls === 'tg' ? 'Telegram' : 'WhatsApp')}</span>
                      </div>
                      <div class="hero-chat-copy">
                        <strong>${chat.name}</strong>
                        <span>${chat.message}</span>
                      </div>
                      <div class="hero-chat-meta">
                        <time>${chat.time}</time>
                        ${chat.badge ? `<span class="hero-chat-badge">${chat.badge}</span>` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div class="hero-stats-col">
                  <div class="hero-mini-stat">
                    <div class="hero-mini-stat-label">Диалоги</div>
                    <div class="hero-mini-stat-value">128</div>
                    <div class="hero-mini-stat-unit">за сегодня</div>
                  </div>
                  <div class="hero-mini-stat">
                    <div class="hero-mini-stat-label">Заявок</div>
                    <div class="hero-mini-stat-value">34</div>
                    <div class="hero-mini-stat-unit">новых лидов</div>
                  </div>
                  <div class="hero-mini-stat">
                    <div class="hero-mini-stat-label">Ответы ИИ</div>
                    <div class="hero-mini-stat-value">86%</div>
                    <div class="hero-mini-stat-unit">автоматически</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="hero-floating-tag ai">
              ${ic('Sparkles', 16, 'color: #8b5cf6')}
              Ассистент берёт рутину на себя
            </div>
            <div class="hero-floating-tag channels">
              ${ic('MessageCircle', 16, 'color: var(--primary)')}
              8 каналов в одном окне
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderStats() {
    const stats = [
      { value: '200', suffix: ' тыс+', label: 'бизнесов подключено' },
      { value: '14', suffix: ' млн+', label: 'диалогов обработано' },
      { value: '86', suffix: '%', label: 'ответов ИИ-ассистентом' },
      { value: '15', suffix: ' мин', label: 'на подключение' },
    ];
    return `
    <section class="stats-section">
      <div class="landing-shell">
        <div class="stats-grid">
          ${stats.map((s, i) => `
            <div class="stat-card reveal reveal-delay-${Math.min(i + 1, 4)}">
              <strong>${s.value}<small>${s.suffix}</small></strong>
              <span>${s.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderLogoMarquee() {
    const items = duplicateForMarquee(channelLogos);
    return `
    <section class="logo-section">
      <div class="landing-shell">
        <div class="logo-section-label reveal">Интеграции с популярными сервисами</div>
        <div class="logo-marquee reveal reveal-delay-1">
          <div class="logo-track">
            ${items.map((l) => `
              <div class="logo-chip">
                ${renderIntegrationBadge(l)}
                <span class="logo-chip-name">${l.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderChannels() {
    const channels = [
      {
        cls: 'vk', icon: 'VK', title: 'ВКонтакте',
        desc: 'Отвечайте на сообщения из ВК прямо в Virexo. Ассистент подхватит диалог даже в нерабочее время.',
        list: ['История всех переписок', 'Голосовые и текстовые', 'Шаблоны и быстрые ответы', 'Маршрутизация по менеджерам']
      },
      {
        cls: 'tg', icon: 'Telegram', title: 'Telegram',
        desc: 'Храните всю переписку в безопасном месте. Ни одного потерянного обращения.',
        list: ['Каналы и боты', 'Защита данных клиентов', 'Назначение ответственных', 'Уведомления в реальном времени']
      },
      {
        cls: 'wa', icon: 'WhatsApp', title: 'WhatsApp',
        desc: 'Запускайте рассылки и общайтесь с клиентами через официальный Business API.',
        list: ['Единый аккаунт для команды', 'Без риска блокировок', 'Массовые рассылки', 'Шаблоны сообщений']
      },
      {
        cls: 'site', icon: 'Globe', title: 'Чат на сайте',
        desc: 'Приглашайте посетителей в диалог и отвечайте на вопросы, пока они на сайте.',
        list: ['Умные приглашения', 'Сбор контактов', 'Оффлайн-сообщения', 'Адаптивный виджет']
      },
      {
        cls: 'email', icon: 'Mail', title: 'Электронная почта',
        desc: 'Обрабатывайте письма в том же интерфейсе, что и мессенджеры — без переключений.',
        list: ['Любые почтовые ящики', 'Автораспределение', 'Теги и папки', 'Отслеживание статуса']
      },
      {
        cls: 'max', icon: 'Hash', title: 'MAX и другие',
        desc: 'Поддержка российских и международных мессенджеров — подключайте, что нужно.',
        list: ['MAX Messenger', 'Одноклассники', 'Авито и маркетплейсы', 'REST API для своих']
      },
    ];
    return `
    <section id="channels" class="landing-section channels-section">
      <div class="landing-shell">
        <div class="section-heading section-heading-center reveal">
          <div class="section-kicker">${ic('MessageCircle', 14)} Каналы</div>
          <h2><span>Общайтесь с клиентами</span><em>там, где им удобно</em></h2>
          <p>Все входящие сообщения из VK, Telegram, WhatsApp, сайта и почты стекаются в единый центр. Без потерь заявок и бесконечных переключений между вкладками.</p>
        </div>
        <div class="channels-grid">
          ${channels.map((c, i) => `
            <div class="channel-card ${c.cls} reveal reveal-delay-${(i % 6) + 1}">
              <div class="channel-card-icon">${iconImg(c.icon)}</div>
              <h3>${c.title}</h3>
              <p>${c.desc}</p>
              <ul>
                ${c.list.map((it) => `<li>${ic('Check', 16)}${it}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderFeatures() {
    const features = [
      { icon: 'MessageCircle', title: 'Сотни диалогов одновременно', desc: 'ИИ-ассистент параллельно ведёт переписку во всех каналах — клиенты не ждут в очереди.' },
      { icon: 'Plug', title: 'Подключение без кода', desc: 'VK, Telegram, MAX, сайт и CRM подключаются из кабинета за 15 минут без разработчика.' },
      { icon: 'Users', title: 'Встроенная CRM', desc: 'Карточки клиентов, статусы, телефоны и история переписки — без Excel и внешних сервисов.' },
      { icon: 'Brain', title: 'Ассистент знает ваш бизнес', desc: 'Загрузите услуги, цены и документы, чтобы ответы звучали точно и по делу.' },
      { icon: 'Calendar', title: 'Запись на консультации', desc: 'Уточняет удобное время, собирает телефон и автоматически подтверждает встречу.' },
      { icon: 'Inbox', title: 'Сбор заявок 24/7', desc: 'Формирует структурированную заявку из диалога и отправляет менеджеру в любой канал.' },
    ];
    return `
    <section id="features" class="landing-section">
      <div class="landing-shell">
        <div class="section-heading section-heading-center reveal">
          <div class="section-kicker">${ic('Layers', 14)} Возможности</div>
            <h2><span>Всё, что нужно для</span><em>продаж и поддержки</em></h2>
          <p>Комплекс инструментов, который заменяет десятки разрозненных сервисов и помогает команде работать эффективнее.</p>
        </div>
        <div class="features-grid">
          ${features.map((f, i) => `
            <div class="feature-card reveal reveal-delay-${(i % 6) + 1}">
              <div class="feature-icon">${iconImg(f.icon)}</div>
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderAiSection() {
    const benefits = [
      { icon: 'Zap', title: 'Ответ за 30 секунд', desc: 'Ассистент ведёт диалоги круглосуточно, чтобы клиенты не уходили к конкурентам даже ночью.' },
      { icon: 'Brain', title: 'Подстраивается под компанию', desc: 'Использует ваши услуги, цены, акции и правила общения, чтобы отвечать по делу.' },
      { icon: 'Users', title: 'Сценарии под разные задачи', desc: 'Продажи, консультации, запись и первичная квалификация лидов работают в одной логике.' },
    ];
    return `
    <section id="ai" class="landing-section ai-section">
      <div class="landing-shell ai-layout">
        <div class="ai-copy reveal">
          <div class="section-heading">
            <div class="section-kicker">${ic('Sparkles', 14)} Автоматизация</div>
            <h2><span>Ассистент, который</span><em>работает за вас</em></h2>
            <p>Подключите автоматизацию без сложной настройки. Virexo помогает быстрее отвечать, собирать заявки и разгружать менеджеров.</p>
          </div>
          <div class="ai-benefits">
            ${benefits.map((b, i) => `
              <div class="ai-benefit reveal-delay-${i + 1}">
                <div class="ai-benefit-icon">${iconImg(b.icon)}</div>
                <div>
                  <h4>${b.title}</h4>
                  <p>${b.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="ai-visual reveal reveal-delay-3">
          <div class="ai-chat-window">
            <div class="ai-chat-header">
              <div class="ai-chat-avatar">${ic('Brain', 20)}</div>
              <div class="ai-chat-head-copy">
                <strong>Virexo Ассистент · Продажи</strong>
                <span>Сейчас отвечает</span>
              </div>
            </div>
            <div class="ai-chat-body">
              <div class="ai-msg user">
                <div class="ai-msg-bubble">Добрый день! Скажите, у вас есть доставка по Москве и сколько она стоит?</div>
                <div class="ai-msg-time">14:32</div>
              </div>
              <div class="ai-msg ai">
                <div class="ai-msg-bubble">Здравствуйте! Да, мы осуществляем доставку по всей Москве и Московской области. Стоимость доставки в пределах МКАД — 350 ₽, бесплатна при заказе от 5 000 ₽. Подскажите, какой товар вас интересует? Я подскажу сроки и варианты оплаты.</div>
                <div class="ai-msg-time">14:32 · ассистент</div>
              </div>
              <div class="ai-msg user">
                <div class="ai-msg-bubble">Хочу комплект №4. Можно оплатить при получении?</div>
                <div class="ai-msg-time">14:33</div>
              </div>
              <div class="ai-msg ai">
                <div class="ai-msg-bubble">Отличный выбор! Да, оплата при получении доступна. Для оформления заказа уточните, пожалуйста:<br>• Ваш номер телефона<br>• Адрес доставки<br>• Удобное время</div>
                <div class="ai-msg-time">14:33 · ассистент</div>
              </div>
            </div>
            <div class="ai-chat-input">
              <div class="ai-input-box">Напишите сообщение ассистенту…</div>
              <button class="ai-send-btn" type="button">${ic('Send', 16)}</button>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderHow() {
    const steps = [
      { n: 1, title: 'Зарегистрируйтесь', desc: 'Создайте аккаунт за 2 минуты через почту или Telegram. Никаких звонков и менеджеров.' },
      { n: 2, title: 'Подключите каналы', desc: 'Добавьте VK, Telegram, WhatsApp и другие каналы из кабинета. На всё про всё — 15 минут.' },
      { n: 3, title: 'Расскажите ИИ о бизнесе', desc: 'Загрузите услуги, цены и правила. Настройте роли ИИ — и он начнёт работать за вас.' },
    ];
    return `
    <section id="how" class="landing-section">
      <div class="landing-shell">
        <div class="section-heading section-heading-center reveal">
          <div class="section-kicker">${ic('Clock', 14)} Как начать</div>
          <h2><span>Готово к работе</span><em>за 15 минут</em></h2>
          <p>Три простых шага, и команда уже работает в едином интерфейсе, а первые обращения не теряются в мессенджерах.</p>
        </div>
        <div class="how-spotlight reveal reveal-delay-1">
          <div class="how-spotlight-badge">${ic('Zap', 16)} Быстрый старт</div>
          <div class="how-spotlight-grid">
            <div class="how-spotlight-time">
              <span>15</span>
              <small>минут</small>
            </div>
            <div class="how-spotlight-copy">
              <strong>Подключаете каналы, добавляете данные о компании и сразу начинаете принимать обращения в одном окне.</strong>
              <div class="how-spotlight-points">
                <span>${ic('Check', 14)} Без разработчика</span>
                <span>${ic('Check', 14)} Без долгой настройки</span>
                <span>${ic('Check', 14)} Без потери диалогов</span>
              </div>
            </div>
          </div>
          <div class="how-spotlight-orbit" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div class="how-steps">
          ${steps.map((s, i) => `
            <div class="step-card reveal reveal-delay-${i + 1}">
              <div class="step-number-wrap">
                <div class="step-number-ring"></div>
                <div class="step-number">${s.n}</div>
              </div>
              <div class="step-label">Шаг 0${s.n}</div>
              <h3>${s.title}</h3>
              <p>${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderBenefits() {
    const cards = [
      { icon: 'Shield', title: 'Защита базы клиентов', desc: 'Храните контакты в Virexo, а не в телефонах менеджеров. Увольнение сотрудника больше не проблема.' },
      { icon: 'Key', title: 'Пароли не нужны операторам', desc: 'Менеджеры отвечают из приложения, не получая доступ к аккаунтам мессенджеров и соцсетей.' },
      { icon: 'Eye', title: 'Контроль переписки', desc: 'Следите за качеством общения и анализируйте сохранённые диалоги — всегда знайте, что происходит.' },
      { icon: 'Lock', title: 'Аккаунты — ваша собственность', desc: 'Предотвратить утечку клиентов легче, чем компенсировать урон от их потери.' },
    ];
    return `
    <section class="landing-section benefits-section">
      <div class="landing-shell">
        <div class="section-heading section-heading-center reveal">
          <div class="section-kicker">${ic('Shield', 14)} Защита бизнеса</div>
          <h2><span>Возьмите общение</span><em>под контроль</em></h2>
          <p>Уволившиеся сотрудники, потерянные телефоны и забытые пароли больше не повод для тревоги.</p>
        </div>
        <div class="benefits-grid">
          ${cards.map((b, i) => `
            <div class="benefit-card reveal reveal-delay-${i + 1}">
              <div class="benefit-card-icon">${iconImg(b.icon)}</div>
              <h3>${b.title}</h3>
              <p>${b.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderTestimonials() {
    const items = [
      {
        text: 'С подключением Virexo количество лидов выросло на <strong>70%</strong>, а конверсия в сделки увеличилась на 15%. Теперь мы не пропускаем ни одного сообщения даже в нерабочее время.',
        name: 'Ольга Волкова', role: 'Руководитель отдела обслуживания', company: '«Ренессанс Жизнь»',
        avatarPrompt: 'photorealistic portrait of a confident Russian woman executive, 38 years old, elegant business style, natural daylight, premium office background, realistic facial details, high detail'
      },
      {
        text: 'Подключение мессенджеров позволило уже в первый месяц увеличить продажи на <strong>32%</strong>. Доступ к аккаунтам надёжно защищён: операторы отвечают из приложения, пароли знают только ответственные.',
        name: 'Дмитрий Ковалёв', role: 'Руководитель интернет-маркетинга', company: '«Авилон»',
        avatarPrompt: 'photorealistic portrait of a Russian male marketing director, 36 years old, business casual, clean office interior, natural light, realistic skin texture, high detail'
      },
      {
        text: 'Благодаря Virexo мы оперативно связываемся с клиентом и получаем нужную информацию. Служба поддержки стала обрабатывать <strong>в 2 раза больше</strong> обращений.',
        name: 'Анна Морозова', role: 'Директор по операциям', company: 'ТПК «Пеплос»',
        avatarPrompt: 'photorealistic portrait of a Russian woman operations director, 41 years old, warm expression, neutral studio background, realistic face, professional attire, high detail'
      },
    ];
    return `
    <section class="landing-section">
      <div class="landing-shell">
        <div class="section-heading section-heading-center reveal">
            <div class="section-kicker">${ic('Quote', 14)} Отзывы клиентов</div>
            <h2><span>Нам</span><em>доверяют</em></h2>
            <p>От небольших студий до крупных корпораций, компании масштабируют продажи и поддержку вместе с Virexo.</p>
        </div>
        <div class="testimonials-grid">
          ${items.map((t, i) => `
            <div class="testimonial-card reveal reveal-delay-${i + 1}">
              <div class="testimonial-quote">${ic('Quote', 20)}</div>
              <p class="testimonial-text">${t.text}</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">
                  ${portrait(t.avatarPrompt, t.name, false)}
                </div>
                <div class="testimonial-author-copy">
                  <strong>${t.name}</strong>
                  <span>${t.role}</span>
                  <span>${t.company}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderPricing() {
    const plans = [
      { name: 'Free', price: '0', period: '₽', desc: 'Познакомьтесь с платформой',
        features: ['До 20 диалогов в месяц', 'Все каналы связи', 'AI-ответы 24/7', 'База знаний о компании', 'Сбор заявок и история'],
        btn: 'Начать бесплатно', primary: false, popular: false },
      { name: 'Start', price: '990', period: '₽/мес', desc: 'Для небольших команд',
        features: ['До 100 диалогов', '1 роль AI', 'VK, Telegram, WhatsApp, сайт', 'Уведомления о лидах', 'FAQ и быстрые ответы'],
        btn: 'Подключить Start', primary: false, popular: false },
      { name: 'Business', price: '2 990', period: '₽/мес', desc: 'Оптимальный для роста',
        features: ['До 500 диалогов', 'До 5 ролей AI', 'Аналитика и воронка', 'Запись на консультации', 'Ежедневные сводки', 'Полная CRM в кабинете'],
        btn: 'Подключить Business', primary: true, popular: true },
      { name: 'Premium', price: '7 990', period: '₽/мес', desc: 'Для агентств и потока',
        features: ['Безлимитные диалоги', 'API и интеграции', 'White Label', 'Приоритетная поддержка', 'Персональные роли AI'],
        btn: 'Подключить Premium', primary: false, popular: false },
    ];
    return `
    <section id="pricing" class="landing-section pricing-section">
      <div class="landing-shell">
        <div class="section-heading section-heading-center reveal">
          <div class="section-kicker">${ic('Chart', 14)} Тарифы</div>
            <h2><span>Честные цены</span><em>без сюрпризов</em></h2>
          <p>Выберите подходящий план и начните бесплатно. Меняйте тариф в любой момент без переплат.</p>
        </div>
        <div class="pricing-grid">
          ${plans.map((p, i) => `
            <div class="price-card ${p.popular ? 'is-popular' : ''} reveal reveal-delay-${i + 1}">
              ${p.popular ? '<div class="price-badge-popular">Популярный выбор</div>' : ''}
              <div class="price-head">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
              </div>
              <div class="price-value">
                <strong>${p.price}</strong>
                <span>${p.period}</span>
              </div>
              <ul class="price-features">
                ${p.features.map((f) => `<li>${ic('Check', 16)}${f}</li>`).join('')}
              </ul>
              <a href="/login" class="price-button ${p.primary ? 'price-button-primary' : ''}">${p.btn}</a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderFinalCTA() {
    return `
    <section class="final-cta-section">
      <div class="landing-shell">
        <div class="final-cta reveal">
          <div class="final-cta-grid">
            <div class="final-cta-copy">
              <h2>Готовы начать получать больше заявок уже сегодня?</h2>
              <p>Подключите Virexo и убедитесь сами. Ранний доступ бесплатен для первых 100 компаний.</p>
            </div>
            <div class="final-cta-actions">
              <a href="/login" class="final-cta-btn final-cta-btn-primary">
                Создать аккаунт бесплатно
                ${ic('ArrowRight', 18)}
              </a>
              <a href="#channels" class="final-cta-btn final-cta-btn-secondary">
                Узнать больше о каналах
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `
    <footer class="footer-section">
      <div class="landing-shell">
        <div class="footer-shell">
          <div class="footer-brand">
            <a href="#" class="footer-logo" aria-label="Virexo">
              ${brandLogo()}
            </a>
            <p>Многофункциональная CRM-платформа для автоматизации взаимодействия с клиентами. Объединяем все каналы коммуникации в едином интерфейсе.</p>
          </div>
          <div class="footer-col">
            <h4>Продукт</h4>
            <ul class="footer-links">
              <li><a href="#channels">Каналы связи</a></li>
              <li><a href="#features">Возможности</a></li>
              <li><a href="#ai">Автоматизация</a></li>
              <li><a href="#pricing">Тарифы</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Компания</h4>
            <ul class="footer-links">
              <li><a href="/login">Войти</a></li>
              <li><a href="/login">Регистрация</a></li>
              <li><a href="/panel">Панель</a></li>
              <li><a href="#">Блог</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Контакты</h4>
            <ul class="footer-contacts">
              <li><a href="mailto:hello@bizflow.ru">hello@bizflow.ru</a></li>
              <li><a href="tel:+78000000000">8 (800) 000-00-00</a></li>
              <li><a href="#">Telegram</a></li>
              <li><a href="#">ВКонтакте</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-meta">
          <span>© ${year} Virexo. Все права защищены.</span>
          <span>Сделано с любовью для российского бизнеса</span>
        </div>
      </div>
    </footer>`;
  }

  function renderAll() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
      <div class="app-container" id="appRoot">
        ${renderNav()}
        ${renderHero()}
        ${renderStats()}
        ${renderLogoMarquee()}
        ${renderChannels()}
        ${renderFeatures()}
        ${renderAiSection()}
        ${renderHow()}
        ${renderBenefits()}
        ${renderTestimonials()}
        ${renderPricing()}
        ${renderFinalCTA()}
        ${renderFooter()}
      </div>`;
    initInteractive();
  }

  function initInteractive() {
    const navShell = document.getElementById('navShell');
    const onScroll = () => {
      if (navShell) {
        if (window.scrollY > 20) navShell.classList.add('scrolled');
        else navShell.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const root = document.getElementById('appRoot');
    if (!root || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((e) => e.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
})();
