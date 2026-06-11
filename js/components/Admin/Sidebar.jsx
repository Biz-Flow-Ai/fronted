function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Главная', icon: '📊' },
    { id: 'dialogs', label: 'Диалоги', icon: '💬' },
    { id: 'clients', label: 'Клиенты', icon: '👥' },
    { id: 'tariffs', label: 'Тарифы', icon: '📦' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <span className="logo-icon">✨</span>
        <span className="logo-text">BizFlow AI</span>
      </div>
      <nav className="admin-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="admin-user">
        <div className="user-avatar">W</div>
        <div className="user-info">
          <div className="user-name">Wwwixz</div>
          <div className="user-role">Администратор</div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;