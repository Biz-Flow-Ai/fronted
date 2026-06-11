const { useState, useEffect } = React;

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDialog, setSelectedDialog] = useState(null);
  const [dialogs, setDialogs] = useState([]);

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
      default:
        return (
          <div className="empty-state">
            <h2>Эта страница в разработке</h2>
            <p>Скороче здесь появится новый функционал</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<Admin />);