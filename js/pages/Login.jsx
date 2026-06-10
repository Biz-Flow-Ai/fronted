const { useState, useEffect, useRef } = React;

function Login() {
  const searchParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname.split('/').pop().toLowerCase();
  const initialTab = searchParams.get('tab') === 'register' || path === 'register.html' ? 'register' : 'login';
  const [tab, setTab] = useState(initialTab);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdReg, setShowPwdReg] = useState(false);
  const [pwdStrength, setPwdStrength] = useState(0);
  const [remember, setRemember] = useState(false);
  const [focused, setFocused] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [message, setMessage] = useState('');
  const sparksRef = useRef(null);

  // Вспомогательная функция для выполнения JSON-запросов
  async function fetchJson(url, opts = {}) {
    const defaultOpts = {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    const merged = Object.assign({}, defaultOpts, opts);
    const res = await fetch(url, merged);
    const contentType = res.headers.get('content-type') || '';
    let body = null;
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    if (!res.ok) {
      const err = new Error(body && body.message ? body.message : res.statusText || 'Ошибка запроса');
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body;
  }

  useEffect(() => {
    // Генерация фоновых частиц для страницы входа
    const wrap = sparksRef.current;
    if (!wrap || wrap.dataset.init) return;
    wrap.dataset.init = '1';

    for (let i = 0; i < 26; i++) {
      const s = document.createElement('div');
      s.className = 'login-spark';
      const sz = Math.random() * 3 + 1;
      s.style.cssText = `
        width:${sz}px; height:${sz}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        background:${Math.random() > 0.5 ? 'rgba(123,97,255,.6)' : 'rgba(74,158,255,.55)'};
        animation-duration:${Math.random() * 12 + 7}s;
        animation-delay:${Math.random() * 10}s;
      `;
      wrap.appendChild(s);
    }
  }, []);

  // Проверка надежности пароля
  function checkStrength(val) {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setPwdStrength(s);
  }

  // Определение CSS-класса для индикатора надежности пароля
  function barClass(idx) {
    if (pwdStrength === 0) return 'pwd-bar';
    if (idx > pwdStrength) return 'pwd-bar';
    if (pwdStrength === 1) return 'pwd-bar weak';
    if (pwdStrength === 2) return 'pwd-bar medium';
    return 'pwd-bar strong';
  }

  const EyeIcon = ({ visible }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.6"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
        </>
      )}
    </svg>
  );

  const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );

  const TgIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#29B6F6"/>
      <path d="M5.5 11.8l10-4c.5-.2.9.1.8.6l-1.7 8c-.1.4-.5.6-.8.4l-2.8-2.1-1.3 1.3c-.2.2-.4.2-.5 0l-.6-2.1-3.1-1c-.4-.1-.4-.6 0-.8z" fill="white"/>
    </svg>
  );

  return (
    <>
      <div className="login-bg">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />
        <div ref={sparksRef} />
      </div>

      <nav className="login-nav">
        <a href="index.html" className="login-nav-logo">BizFlow <span>AI</span></a>
        <a href="index.html" className="login-nav-back">← На главную</a>
      </nav>

      <div className="login-page">
        {/* Левая часть: форма */}
        <div className="login-left">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                className={`auth-tab${tab === 'login' ? ' active' : ''}`}
                onClick={() => setTab('login')}
              >Войти</button>
              <button
                className={`auth-tab${tab === 'register' ? ' active' : ''}`}
                onClick={() => setTab('register')}
              >Регистрация</button>
            </div>

            {tab === 'login' && (
              <>
                <div className="auth-title">С возвращением</div>
                <div className="auth-sub">Войдите в аккаунт BizFlow AI</div>

                <button className="btn-tg">
                  <TgIcon /> Войти через Telegram
                </button>

                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">или по email</span>
                  <div className="auth-divider-line" />
                </div>

                <div className="auth-secure">
                  <span className="auth-secure-dot" />
                  Соединение защищено · данные зашифрованы
                </div>

                <div className="auth-form">
                  <div className="field-wrap">
                    <label className={`field-label${focused === 'email' ? ' focused' : ''}`}>Email</label>
                    <div className="field-input-wrap">
                      <span className="field-icon"><EmailIcon /></span>
                      <input
                        className="field-input"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                            onFocus={() => setFocused('email')}
                            onBlur={() => setFocused('')}
                      />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label className={`field-label${focused === 'pwd' ? ' focused' : ''}`}>Пароль</label>
                    <div className="field-input-wrap">
                      <span className="field-icon"><LockIcon /></span>
                      <input
                        className="field-input"
                        type={showPwd ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={loginPwd}
                        onChange={e => setLoginPwd(e.target.value)}
                        onFocus={() => setFocused('pwd')}
                        onBlur={() => setFocused('')}
                      />
                      <button
                        className={`field-eye${showPwd ? ' visible' : ''}`}
                        onClick={() => setShowPwd(p => !p)}
                        type="button"
                      >
                        <EyeIcon visible={showPwd} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="auth-row">
                  <label className="auth-remember">
                    <input
                      type="checkbox"
                      className="auth-checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                    />
                    <span className="auth-remember-label">Запомнить меня</span>
                  </label>
                  <a href="#" className="auth-forgot">Забыли пароль?</a>
                </div>

                {message && <div className="auth-message">{message}</div>}
                <button
                  className="btn-submit"
                  onClick={async () => {
                    setMessage('');
                    setLoadingLogin(true);
                    try {
                      const data = await fetchJson('/api/auth/login', {
                        method: 'POST',
                        body: JSON.stringify({ email: loginEmail, password: loginPwd, remember }),
                      });
                      // on success, redirect or show message
                      if (data && data.redirect) {
                        window.location.href = data.redirect;
                        return;
                      }
                      setMessage('Вход выполнен успешно');
                      setTimeout(() => window.location.href = 'index.html', 700);
                    } catch (err) {
                      setMessage(err && err.body && err.body.message ? err.body.message : err.message || 'Ошибка входа');
                    } finally {
                      setLoadingLogin(false);
                    }
                  }}
                  disabled={loadingLogin}
                >{loadingLogin ? 'Вход...' : 'Войти →'}</button>

                <div className="auth-switch">
                  Нет аккаунта?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); setTab('register'); }}>
                    Зарегистрироваться
                  </a>
                </div>
              </>
            )}

            {tab === 'register' && (
              <>
                <div className="auth-title">Создать аккаунт</div>
                <div className="auth-sub">Начните бесплатно — без карты</div>

                <button className="btn-tg">
                  <TgIcon /> Зарегистрироваться через Telegram
                </button>

                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">или по email</span>
                  <div className="auth-divider-line" />
                </div>

                <div className="auth-form">
                  <div className="field-wrap">
                    <label className={`field-label${focused === 'name' ? ' focused' : ''}`}>Имя</label>
                    <div className="field-input-wrap">
                      <span className="field-icon"><UserIcon /></span>
                      <input
                        className="field-input"
                        type="text"
                        placeholder="Ваше имя"
                        autoComplete="name"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused('')}
                      />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label className={`field-label${focused === 'email-r' ? ' focused' : ''}`}>Email</label>
                    <div className="field-input-wrap">
                      <span className="field-icon"><EmailIcon /></span>
                      <input
                        className="field-input"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        onFocus={() => setFocused('email-r')}
                        onBlur={() => setFocused('')}
                      />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label className={`field-label${focused === 'pwd-r' ? ' focused' : ''}`}>Пароль</label>
                    <div className="field-input-wrap">
                      <span className="field-icon"><LockIcon /></span>
                      <input
                        className="field-input"
                        type={showPwdReg ? 'text' : 'password'}
                        placeholder="Минимум 8 символов"
                        autoComplete="new-password"
                        value={regPwd}
                        onChange={e => { setRegPwd(e.target.value); checkStrength(e.target.value); }}
                        onFocus={() => setFocused('pwd-r')}
                        onBlur={() => setFocused('')}
                      />
                      <button
                        className={`field-eye${showPwdReg ? ' visible' : ''}`}
                        onClick={() => setShowPwdReg(p => !p)}
                        type="button"
                      >
                        <EyeIcon visible={showPwdReg} />
                      </button>
                    </div>
                    <div className="pwd-strength">
                      <div className={barClass(1)} />
                      <div className={barClass(2)} />
                      <div className={barClass(3)} />
                    </div>
                  </div>
                </div>

                {message && <div className="auth-message">{message}</div>}
                <button
                  className="btn-submit"
                  style={{ marginTop: '8px' }}
                  onClick={async () => {
                    setMessage('');
                    setLoadingRegister(true);
                    try {
                      const data = await fetchJson('/api/auth/register', {
                        method: 'POST',
                        body: JSON.stringify({ name: regName, email: regEmail, password: regPwd }),
                      });
                      if (data && data.redirect) {
                        window.location.href = data.redirect;
                        return;
                      }
                      setMessage('Аккаунт создан — вы вошли');
                      setTimeout(() => window.location.href = 'index.html', 800);
                    } catch (err) {
                      setMessage(err && err.body && err.body.message ? err.body.message : err.message || 'Ошибка регистрации');
                    } finally {
                      setLoadingRegister(false);
                    }
                  }}
                  disabled={loadingRegister}
                >{loadingRegister ? 'Создание...' : 'Создать аккаунт →'}</button>

                <div className="auth-switch">
                  Уже есть аккаунт?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); setTab('login'); }}>
                    Войти
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Правая часть: 3D иллюстрации */}
        <div className="login-right">
          <div className="login-right-text">
            <div className="login-right-title">Ваш AI-ассистент</div>
            <div className="login-right-desc">
              Автоматизирует общение с клиентами и помогает эффективно работать
            </div>
          </div>

          <div className="login-3d-container">
            <img 
              className="login-3d-girl" 
              src="icon/Character-working-laptop-sitting-chair.png" 
              alt="Girl with laptop" 
            />
            <img 
              className="login-3d-cactus" 
              src="icon/cactus.png" 
              alt="Cactus" 
            />
          </div>
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Login />);
