type DialogStatus = 'active' | 'new' | 'closed';

type Dialog = {
  id: number;
  clientName: string;
  clientEmail: string;
  status: DialogStatus;
  lastMessage: string;
  date: string;
  messages: { sender: 'client' | 'ai'; text: string; time: string }[];
};

type DialogsListProps = {
  dialogs: Dialog[];
  onSelectDialog: (dialog: Dialog) => void;
};

function DialogsList({ dialogs, onSelectDialog }: DialogsListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState<'all' | DialogStatus>('all');

  const filteredDialogs = dialogs.filter(dialog => {
    const matchesStatus = activeStatus === 'all' || dialog.status === activeStatus;
    const matchesQuery = [dialog.clientName, dialog.lastMessage, dialog.clientEmail]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="dialogs-list">
      <div className="dialogs-header">
        <div>
          <h1>Диалоги</h1>
          <p className="dialogs-subtitle">Просматривайте диалоги, фильтруйте по статусу и отвечайте быстро.</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по клиентам или сообщениям..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="dialog-tabs">
        {['all', 'active', 'new', 'closed'].map(status => (
          <button
            key={status}
            className={`status-tab ${activeStatus === status ? 'active' : ''}`}
            onClick={() => setActiveStatus(status as 'all' | DialogStatus)}>
            {status === 'all' ? 'Все' : status === 'active' ? 'Активные' : status === 'new' ? 'Новые' : 'Закрытые'}
          </button>
        ))}
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
                  <button onClick={() => onSelectDialog(dialog)} className="view-btn">
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
