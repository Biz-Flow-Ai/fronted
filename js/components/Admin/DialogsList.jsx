function DialogsList({ dialogs, onSelectDialog }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDialogs = dialogs.filter(dialog => 
    dialog.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dialog.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dialogs-list">
      <div className="dialogs-header">
        <h1>Диалоги</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по клиентам или сообщениям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <div className="dialogs-table-container">
        <table className="dialogs-table">
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Последнее сообщение</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {filteredDialogs.map(dialog => (
              <tr key={dialog.id} className="table-row">
                <td>
                  <div className="client-cell">
                    <div className="client-avatar-small">{dialog.clientName[0]}</div>
                    <span>{dialog.clientName}</span>
                  </div>
                </td>
                <td className="truncate">{dialog.lastMessage}</td>
                <td>{dialog.date}</td>
                <td>
                  <span className={`status-dot ${dialog.status}`}></span>
                  {dialog.status === 'active' ? 'Активный' : dialog.status === 'new' ? 'Новый' : 'Закрытый'}
                </td>
                <td>
                  <button
                    onClick={() => onSelectDialog(dialog)}
                    className="view-btn"
                  >
                    👁️ Просмотр
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.DialogsList = DialogsList;