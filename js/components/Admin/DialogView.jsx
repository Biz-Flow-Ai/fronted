function DialogView({ dialog, onBack }) {
  if (!dialog) {
    return (
      <div className="dialog-view empty">
        <h2>Выберите диалог для просмотра</h2>
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
          </div>
        </div>
      </div>
      <div className="chat-history">
        {dialog.messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
            <div className="message-time">{msg.time}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Напишите сообщение..."
          className="chat-input"
        />
        <button className="send-btn">📤 Отправить</button>
      </div>
    </div>
  );
}

window.DialogView = DialogView;