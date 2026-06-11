type Message = {
  sender: 'client' | 'ai';
  text: string;
  time: string;
};

type Dialog = {
  id: number;
  clientName: string;
  clientEmail: string;
  status: 'active' | 'new' | 'closed';
  lastMessage: string;
  date: string;
  messages: Message[];
};

type DialogViewProps = {
  dialog: Dialog | null;
  onBack: () => void;
};

function DialogView({ dialog, onBack }: DialogViewProps) {
  if (!dialog) {
    return (
      <div className="dialog-view empty">
        <h2>Выберите диалог для просмотра</h2>
        <p>Здесь появится полный чат и быстрые команды.</p>
      </div>
    );
  }

  return (
    <div className="dialog-view">
      <div className="dialog-header">
        <button onClick={onBack} className="back-btn">← Назад</button>
        <div className="dialog-info">
          <div className="dialog-avatar">{dialog.clientName[0]}</div>
          <div>
            <h3>{dialog.clientName}</h3>
            <p>{dialog.clientEmail}</p>
            <p className="dialog-meta">{dialog.date} · {dialog.status === 'active' ? 'Активный' : dialog.status === 'new' ? 'Новый' : 'Закрытый'}</p>
          </div>
        </div>
        <button className="export-btn">Экспорт чата</button>
      </div>

      <div className="chat-history">
        {dialog.messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
            <div className="message-time">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input type="text" placeholder="Напишите сообщение..." className="chat-input" />
        <button className="send-btn">📤 Отправить</button>
      </div>
    </div>
  );
}

window.DialogView = DialogView;
