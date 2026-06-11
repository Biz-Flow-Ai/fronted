function Dashboard() {
  const stats = [
    { label: 'Активных диалогов', value: '34', change: '+12%', color: 'blue' },
    { label: 'Новых клиентов', value: '89', change: '+8%', color: 'green' },
    { label: 'Закрыто за сегодня', value: '156', change: '+23%', color: 'purple' },
    { label: 'Доход за месяц', value: '45,200 ₽', change: '+15%', color: 'orange' }
  ];

  const recentClients = [
    { id: 1, name: 'Иван Петров', status: 'активный', lastMessage: '2 часа назад' },
    { id: 2, name: 'Анна Крючкова', status: 'новый', lastMessage: '4 часа назад' },
    { id: 3, name: 'Михаил Сидоров', status: 'ожидает', lastMessage: 'Вчера' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Главная</h1>
          <p className="dashboard-subtitle">Обзор ключевых метрик</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">📅 Сегодня</button>
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

      <div className="dashboard-content">
        <div className="widget">
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
                <div className={`status-badge ${client.status}`}>{client.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;