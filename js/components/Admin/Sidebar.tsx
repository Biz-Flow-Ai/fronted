type MenuItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Главная', icon: '📊', href: '/company' },
  { id: 'dialogs', label: 'Диалоги', icon: '💬', href: '/company/dialogs' },
  { id: 'leads', label: 'Заявки', icon: '📋', href: '/company/leads' },
  { id: 'clients', label: 'Клиенты', icon: '👥', href: '/company/clients' },
  { id: 'analytics', label: 'Аналитика', icon: '📈', href: '/company/analytics' },
  { id: 'notify', label: 'Уведомления', icon: '🔔', href: '/company/notify' },
  { id: 'tariffs', label: 'Тарифы', icon: '📦', href: '/company/plans' },
  { id: 'ai', label: 'ИИ-ассистент', icon: '⚡', href: '/company/ai' },
  { id: 'vk', label: 'VK', icon: '💙', href: '/company/vk' },
];

function Sidebar() {
  const auth = (window as any).BizFlowAuth;
  const user = auth?.getUser?.();
  const name = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email : 'Пользователь';
  const initials = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="admin-sidebar">
      <a href="/" className="admin-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span className="logo-icon">✨</span>
        <div>
          <div className="logo-text">BizFlow AI</div>
          <div className="logo-subtitle">Кабинет компании</div>
        </div>
      </a>

      <nav className="admin-nav">
        {menuItems.map(item => (
          <a key={item.id} href={item.href} className="nav-item">
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="admin-upgrade-card">
        <div className="upgrade-title">Консультации и запись</div>
        <p>Настройте типы консультаций и ссылки — ИИ запишет клиентов из VK.</p>
        <a className="btn btn-secondary" href="/company/ai">Настроить</a>
      </div>

      <div className="admin-user">
        <div className="user-avatar">{initials || '?'}</div>
        <div className="user-info">
          <div className="user-name">{name}</div>
          <div className="user-role">Владелец</div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
