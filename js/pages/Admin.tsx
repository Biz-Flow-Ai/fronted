type TabId = 'dashboard' | 'dialogs' | 'clients' | 'tariffs' | 'settings';

type Dialog = {
  id: number;
  clientName: string;
  clientEmail: string;
  status: 'active' | 'new' | 'closed';
  lastMessage: string;
  date: string;
  messages: { sender: 'client' | 'ai'; text: string; time: string }[];
};

declare global {
  interface Window {
    adminDialogs?: Dialog[];
  }
}

const { useState, useEffect } = React;

function Admin() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null);
  const [dialogs, setDialogs] = useState<Dialog[]>([]);

  useEffect(() => {
    if (window.adminDialogs) {
      setDialogs(window.adminDialogs);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'dialogs':
        return selectedDialog ? (
          <DialogView dialog={selectedDialog} onBack={() => setSelectedDialog(null)} />
        ) : (
          <DialogsList dialogs={dialogs} onSelectDialog={setSelectedDialog} />
        );
      case 'clients':
        return (
          <div className="empty-state card-panel">
            <h2>Раздел клиенты</h2>
            <p>В этом разделе вы сможете отслеживать лиды, сегментировать аудиторию и назначать задачи команде.</p>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">128</div>
                <div className="metric-title">Активных клиентов</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">21</div>
                <div className="metric-title">Потенциальных</div>
              </div>
            </div>
          </div>
        );
      case 'tariffs':
        return (
          <div className="empty-state card-panel">
            <h2>Тарифы</h2>
            <p>Создавайте новые предложения и управляйте условиями оплаты в пару кликов.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="empty-state card-panel">
            <h2>Настройки</h2>
            <p>Управляйте пользователями, правами доступа и интеграциями.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Admin />);
