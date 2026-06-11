type TabId = 'dashboard' | 'dialogs' | 'clients' | 'tariffs' | 'settings';

type SidebarProps = {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
};

type MenuItem = {
  id: TabId;
  label: string;
  icon: string;
  accent?: string;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Главная', icon: '📊' },
  { id: 'dialogs', label: 'Диалоги', icon: '💬' },
  { id: 'clients', label: 'Клиенты', icon: '👥' },
  { id: 'tariffs', label: 'Тарифы', icon: '📦' },
  { id: 'settings', label: 'Настройки', icon: '⚙️' }
];

function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <span className="logo-icon">✨</span>
        <div>
          <div className="logo-text">BizFlow AI</div>
          <div className="logo-subtitle">Инструмент управления</div>
        </div>
      </div>

      <nav className="admin-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-upgrade-card">
        <div className="upgrade-title">AI-ускоритель</div>
        <p>Подключите рекомендации и автоматические сценарии для роста конверсии.</p>
        <button className="btn btn-secondary">Включить</button>
      </div>

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
