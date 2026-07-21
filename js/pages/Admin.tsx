const { useEffect } = React;

function Admin() {
  useEffect(() => {
    const auth = window.BizFlowAuth;
    if (!auth?.getToken?.() || !auth?.getUser?.()) {
      window.location.href = '/login';
      return;
    }
    const user = auth.getUser();
    if (auth.isAdmin(user?.role)) {
      window.location.href = '/admin';
      return;
    }
    window.location.href = '/company';
  }, []);

  return (
    <div className="admin-container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#94a3b8' }}>Открываем кабинет...</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Admin />);
