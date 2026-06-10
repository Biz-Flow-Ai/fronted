function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">BizFlow <span>AI</span></div>
      <div className="nav-links">
        <a href="#pricing">Цены</a>
        <a href="#contact">Контакты</a>
      </div>
      <div className="nav-buttons">
        <a href="login.html" className="nav-cta">Войти</a>
        <a href="register.html" className="nav-cta nav-cta-registr">Регистрация</a>
      </div>
    </nav>
  );
}
