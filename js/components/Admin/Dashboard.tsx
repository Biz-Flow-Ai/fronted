type QuickAction = {
  title: string;
  description: string;
  icon: string;
};

function Dashboard() {
  const stats = [
    { label: 'Активных диалогов', value: '34', change: '+12%', color: 'blue' },
    { label: 'Новых клиентов', value: '89', change: '+8%', color: 'green' },
    { label: 'Закрыто за сегодня', value: '156', change: '+23%', color: 'purple' },
    { label: 'Доход за месяц', value: '45 200 ₽', change: '+15%', color: 'orange' }
  ];

  const recentClients = [
    { id: 1, name: 'Иван Петров', status: 'активный', lastMessage: '2 часа назад' },
    { id: 2, name: 'Анна Крючкова', status: 'новый', lastMessage: '4 часа назад' },
    { id: 3, name: 'Михаил Сидоров', status: 'ожидает', lastMessage: 'Вчера' }
  ];

  const quickActions: QuickAction[] = [
    { title: 'Обновить сценарии', description: 'Настройте AI-ответы под новый сезон.', icon: '⚡' },
    { title: 'Проверить KPI', description: 'Сравните показатели за последние 7 дней.', icon: '📈' },
    { title: 'Запустить кампанию', description: 'Добавьте новое предложение для лидов.', icon: '🚀' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Панель управления</h1>
          <p className="dashboard-subtitle">Обзор в реальном времени и быстрые команды для бизнеса</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">📅 Сегодня</button>
        </div>
      </div>

      <div className="dashboard-hero-card">
        <div className="hero-card">
          <div>
            <span className="hero-badge">AI Подсказка</span>
            <h2>Рекомендуем увеличить поток из Instagram</h2>
            <p>Сгенерируйте автоматическую воронку и предложите клиентам бонус за заявку.</p>
          </div>
          <button className="btn btn-secondary">Запустить рекомендацию</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.color}`}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content-grid">
        <div className="widget widget-large">
          <div className="widget-header">
            <h3>Последние клиенты</h3>
          </div>
          <div className="widget-body">
            {recentClients.map(client => (
              <div key={client.id} className="client-row">
                <div className="client-info">
                  <div className="client-avatar">{client.name[0]}</div>
                  <div>
                    <div className="client-name">{client.name}</div>
                    <div className="client-status">{client.lastMessage}</div>
                  </div>
                </div>
                <div className={`status-badge status-pill ${client.status}`}>{client.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="widget quick-actions-widget">
          <div className="widget-header">
            <h3>Быстрые действия</h3>
          </div>
          <div className="widget-body">
            {quickActions.map((action, index) => (
              <div key={index} className="quick-action-card">
                <div className="quick-action-icon">{action.icon}</div>
                <div>
                  <div className="quick-action-title">{action.title}</div>
                  <div className="quick-action-desc">{action.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
