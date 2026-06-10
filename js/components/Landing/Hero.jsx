const motion = window.motion;

function Hero({ heroRightRef }) {
  return (
    <section className="hero">
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      <div className="hero-left">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-бот для Telegram
        </div>
        <h1 className="hero-heading">
          Ваш<br />
          <em className="hero-heading-gradient">AI-менеджер</em><br />
          в Telegram
        </h1>
        <p className="hero-sub">
          Принимает заявки, выясняет потребности,<br />
          формирует ТЗ и передаёт готового клиента менеджеру.
        </p>
        <div className="hero-actions">
          <button className="btn-hero-primary">Подключить бота →</button>
          <button className="btn-hero-secondary">Смотреть демо</button>
        </div>
      </div>

      <div className="hero-right" ref={heroRightRef}>
        <div className="hero-scene">
          <div className="scene-halo halo-1" />
          <div className="scene-halo halo-2" />
          <div className="orbit-wrap">
            <div className="orbit-core-glow" />
            <div className="orbit orbit-1"><div className="orbit-dot" /></div>
            <div className="orbit orbit-2"><div className="orbit-dot orbit-dot-2" /></div>
            <div className="orbit orbit-3" />
            <div className="glow-ring glow-ring-1" />
            <div className="glow-ring glow-ring-2" />
            <div className="orbital-beam beam-1" />
            <div className="orbital-beam beam-2" />
          </div>
          <motion.div
            className="hero-chat tg-chat"
            initial={{ y: 18, opacity: 0.92 }}
            animate={{ y: [18, 0, 18], opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="tg-header">
              <button className="tg-header-btn" type="button" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="tg-avatar">BF</div>
              <div className="tg-header-info">
                <div className="tg-name">
                  BizFlow AI
                  <span className="tg-bot-badge">bot</span>
                </div>
                <div className="tg-status">online</div>
              </div>
              <div className="tg-header-actions">
                <button className="tg-header-btn" type="button" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
                <button className="tg-header-btn" type="button" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                </button>
              </div>
            </div>

            <div className="tg-messages">
              <div className="tg-date">Сегодня</div>

              <div className="tg-msg tg-msg-out">
                <div className="tg-bubble tg-bubble-out delay-1">
                  <span className="tg-text">Хочу заказать сайт для кофейни</span>
                  <span className="tg-meta">
                    <span className="tg-time">14:32</span>
                    <span className="tg-checks">
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M1 5.5L4 8.5L9 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L9 8.5L15 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </span>
                </div>
              </div>

              <div className="tg-msg tg-msg-in">
                <div className="tg-bubble tg-bubble-in delay-2">
                  <span className="tg-text">Расскажите подробнее — кофейня уже работает или запускается?</span>
                  <span className="tg-time">14:32</span>
                </div>
              </div>

              <div className="tg-msg tg-msg-out">
                <div className="tg-bubble tg-bubble-out delay-3">
                  <span className="tg-text">Уже работает</span>
                  <span className="tg-meta">
                    <span className="tg-time">14:33</span>
                    <span className="tg-checks">
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M1 5.5L4 8.5L9 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L9 8.5L15 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </span>
                </div>
              </div>

              <div className="tg-msg tg-msg-in">
                <div className="tg-bubble tg-bubble-in delay-4">
                  <span className="tg-text">Отлично. Подготовлю техническое задание и список необходимых функций.</span>
                  <span className="tg-time">14:33</span>
                </div>
              </div>

              <div className="tg-msg tg-msg-in">
                <div className="tg-bubble tg-bubble-in tg-bubble-typing delay-5">
                  <span /><span /><span />
                </div>
              </div>
            </div>

            <div className="tg-input-bar">
              <button className="tg-input-btn" type="button" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a4.5 4.5 0 01-6.36-6.36l9.19-9.19a2.5 2.5 0 013.54 3.54l-9.2 9.19a1 1 0 01-1.41-1.41l8.49-8.48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="tg-input-field">Сообщение</div>
              <button className="tg-input-btn tg-input-mic" type="button" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
