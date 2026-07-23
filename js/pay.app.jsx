const { useEffect, useMemo, useState } = React;

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrand(number) {
  const digits = number.replace(/\D/g, "");
  if (/^2200|^2201|^2202|^2203|^2204/.test(digits) || /^220[0-4]/.test(digits)) return "mir";
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9][1-9]|[3-6]\d\d|7[01]\d|720)/.test(digits)) return "mastercard";
  if (/^2/.test(digits)) return "mir";
  return "unknown";
}

function luhnValid(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function parsePriceToNumber(price) {
  const digits = String(price).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function CardBrandIcon({ brand }) {
  if (brand === "visa") {
    return <span className="pay-brand pay-brand--visa">VISA</span>;
  }
  if (brand === "mastercard") {
    return (
      <span className="pay-brand pay-brand--mc" aria-hidden="true">
        <i /><i />
      </span>
    );
  }
  if (brand === "mir") {
    return <span className="pay-brand pay-brand--mir">МИР</span>;
  }
  return null;
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1BA36C" />
      <path d="M7 12.5l3 3 7-7.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardMethodIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="22" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="1" y="5.5" width="22" height="3" fill="currentColor" />
    </svg>
  );
}

function SbpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 17.5h5M18 15v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="14" r="1.4" fill="currentColor" />
    </svg>
  );
}

function usePlanFromQuery() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get("plan") || "").toLowerCase();
    const plans = Array.isArray(window.plans) ? window.plans : [];
    const found = plans.find((p) => (p.code || p.name.toLowerCase()) === code);
    if (found) return found;
    return plans.find((p) => p.price !== "0") || plans[0] || null;
  }, []);
}

function OrderSummary({ plan }) {
  if (!plan) return null;
  const amount = parsePriceToNumber(plan.price);
  return (
    <div className="pay-summary">
      <div className="pay-summary-row pay-summary-row--head">
        <span>Тариф</span>
        <strong>{plan.name}</strong>
      </div>
      <ul className="pay-summary-features">
        {(plan.features || []).slice(0, 4).map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <div className="pay-summary-divider" />
      <div className="pay-summary-row pay-summary-row--total">
        <span>К оплате</span>
        <strong>{amount.toLocaleString("ru-RU")} ₽{plan.period ? " /мес" : ""}</strong>
      </div>
    </div>
  );
}

function CardForm({ email, setEmail, onSubmit, submitting, disabled }) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState({});
  const brand = detectBrand(number);

  const errors = {
    number: number.replace(/\D/g, "").length >= 12 && !luhnValid(number) ? "Проверьте номер карты" : "",
    expiry: touched.expiry && expiry.length === 5 && !isExpiryValid(expiry) ? "Карта просрочена" : "",
    cvc: touched.cvc && cvc.length > 0 && cvc.length < 3 ? "Введите CVC полностью" : "",
    email: touched.email && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Некорректный email" : "",
  };

  const canSubmit = number.replace(/\D/g, "").length >= 16 && luhnValid(number) && expiry.length === 5 && isExpiryValid(expiry) && cvc.length === 3 && name.trim().length > 1 && !disabled;

  function isExpiryValid(val) {
    const [mm, yy] = val.split("/");
    if (!mm || !yy) return false;
    const month = parseInt(mm, 10);
    if (month < 1 || month > 12) return false;
    const year = 2000 + parseInt(yy, 10);
    const now = new Date();
    const expDate = new Date(year, month, 0);
    return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return (
    <form className="pay-form" onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit(); }}>
      <label className="pay-field">
        <span className="pay-field-label">Номер карты</span>
        <div className="pay-field-input-wrap">
          <input className="pay-field-input" inputMode="numeric" placeholder="0000 0000 0000 0000" value={number} maxLength={23} onChange={(e) => setNumber(formatCardNumber(e.target.value))} onBlur={() => setTouched((t) => ({ ...t, number: true }))} autoComplete="cc-number" />
          <CardBrandIcon brand={brand} />
        </div>
        {errors.number && <span className="pay-field-error">{errors.number}</span>}
      </label>

      <div className="pay-field-row">
        <label className="pay-field">
          <span className="pay-field-label">Срок действия</span>
          <input className="pay-field-input" inputMode="numeric" placeholder="ММ/ГГ" value={expiry} maxLength={5} onChange={(e) => setExpiry(formatExpiry(e.target.value))} onBlur={() => setTouched((t) => ({ ...t, expiry: true }))} autoComplete="cc-exp" />
          {errors.expiry && <span className="pay-field-error">{errors.expiry}</span>}
        </label>
        <label className="pay-field">
          <span className="pay-field-label">CVC</span>
          <input className="pay-field-input" inputMode="numeric" type="password" placeholder="•••" value={cvc} maxLength={3} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} onBlur={() => setTouched((t) => ({ ...t, cvc: true }))} autoComplete="cc-csc" />
          {errors.cvc && <span className="pay-field-error">{errors.cvc}</span>}
        </label>
      </div>

      <label className="pay-field">
        <span className="pay-field-label">Имя держателя карты</span>
        <input className="pay-field-input" placeholder="IVAN IVANOV" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} autoComplete="cc-name" />
      </label>

      <label className="pay-field">
        <span className="pay-field-label">Email для чека</span>
        <input className="pay-field-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} autoComplete="email" />
        {errors.email && <span className="pay-field-error">{errors.email}</span>}
      </label>

      <button type="submit" className="pay-btn-submit" disabled={!canSubmit || submitting}>
        {submitting ? "Сохраняем выбор…" : "Подтвердить выбор"}
      </button>
    </form>
  );
}

function SbpPane({ onConfirm, submitting, disabled }) {
  return (
    <div className="pay-sbp">
      <div className="pay-qr" aria-hidden="true">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <rect width="120" height="120" fill="#fff" />
          {Array.from({ length: 11 }).map((_, row) => Array.from({ length: 11 }).map((_, col) => {
            const seed = (row * 11 + col * 7) % 5;
            if (seed !== 0) return null;
            return <rect key={`${row}-${col}`} x={col * 10} y={row * 10} width="9" height="9" fill="#0c1a2e" />;
          }))}
        </svg>
      </div>
      <p className="pay-sbp-text">Отсканируйте QR-код в приложении вашего банка или откройте список банков, чтобы оплатить через Систему быстрых платежей.</p>
      <button type="button" className="pay-btn-submit pay-btn-submit--ghost" disabled={disabled}>Выбрать банк</button>
      <button type="button" className="pay-btn-submit" onClick={onConfirm} disabled={submitting || disabled}>{submitting ? "Сохраняем выбор…" : "Подтвердить выбор"}</button>
    </div>
  );
}

function WalletPane({ onConfirm, submitting, disabled }) {
  const [wallet, setWallet] = useState("");
  const canSubmit = wallet.replace(/\D/g, "").length >= 10 && !disabled;
  return (
    <div className="pay-form">
      <label className="pay-field">
        <span className="pay-field-label">Номер телефона или счёта ЮMoney</span>
        <input className="pay-field-input" placeholder="+7 900 000-00-00" value={wallet} onChange={(e) => setWallet(e.target.value)} />
      </label>
      <button type="button" className="pay-btn-submit" onClick={onConfirm} disabled={!canSubmit || submitting}>{submitting ? "Сохраняем выбор…" : "Подтвердить выбор"}</button>
    </div>
  );
}

function PayApp() {
  const plan = usePlanFromQuery();
  const [method, setMethod] = useState("card");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("form");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = plan ? `Оплата ${plan.name} — BizFlow AI` : "Оплата — BizFlow AI";
  }, [plan]);

  async function handlePay() {
    if (!plan) return;
    setStatus("processing");
    setErrorMessage("");
    await sleep(1200);
    setStatus("success");
  }

  if (!plan) {
    return (
      <div className="pay-page">
        <div className="pay-card">
          <p className="pay-empty">Тариф не найден. Вернитесь на страницу тарифов и выберите план.</p>
          <a href="/#pricing" className="pay-btn-submit pay-btn-submit--link">К тарифам</a>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="pay-page">
        <div className="pay-card pay-card--status">
          <CheckCircle />
          <h1 className="pay-status-title">Тариф выбран</h1>
          <p className="pay-status-text">Тариф «{plan.name}» отмечен как выбранный. Мы сохранили ваш выбор{email ? ` для ${email}` : ""}.</p>
          <a href="/company/plans" className="pay-btn-submit pay-btn-submit--link">Перейти в кабинет</a>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <div className="pay-card">
        <a href="/#pricing" className="pay-back">
          <ChevronLeft /> К тарифам
        </a>

        <div className="pay-header">
          <div className="pay-logo">BizFlow<em>AI</em></div>
          <div className="pay-secure">
            <LockIcon /> Соединение защищено
          </div>
        </div>

        <OrderSummary plan={plan} />

        <div className="pay-methods">
          <button type="button" className={`pay-method${method === "card" ? " active" : ""}`} onClick={() => setMethod("card")}> <CardMethodIcon /> Карта</button>
          <button type="button" className={`pay-method${method === "sbp" ? " active" : ""}`} onClick={() => setMethod("sbp")}> <SbpIcon /> СБП</button>
          <button type="button" className={`pay-method${method === "wallet" ? " active" : ""}`} onClick={() => setMethod("wallet")}> <WalletIcon /> ЮMoney</button>
        </div>

        {status === "error" && <div className="pay-alert">{errorMessage}</div>}

        {method === "card" && <CardForm email={email} setEmail={setEmail} onSubmit={handlePay} submitting={status === "processing"} disabled={status === "processing"} />}
        {method === "sbp" && <SbpPane onConfirm={handlePay} submitting={status === "processing"} disabled={status === "processing"} />}
        {method === "wallet" && <WalletPane onConfirm={handlePay} submitting={status === "processing"} disabled={status === "processing"} />}

        <p className="pay-footnote">Это чистый фронтенд-экран выбора тарифа. Здесь нет интеграции с ЮKassa и нет реального списания денег.</p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<PayApp />);
