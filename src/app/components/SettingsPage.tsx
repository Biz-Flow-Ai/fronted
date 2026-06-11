import { useState } from "react";
import { Save, Key, Globe, Bell, Shield, Zap, Database, Mail } from "lucide-react";

const tabs = [
  { id: "general", label: "Основные", icon: Globe },
  { id: "security", label: "Безопасность", icon: Shield },
  { id: "notifications", label: "Уведомления", icon: Bell },
  { id: "integrations", label: "Интеграции", icon: Zap },
  { id: "api", label: "API", icon: Key },
];

const integrations = [
  { name: "Bitrix24 CRM", desc: "Синхронизация клиентов и сделок", connected: true, logo: "B24" },
  { name: "1С:Предприятие", desc: "Интеграция с учётной системой", connected: true, logo: "1С" },
  { name: "Telegram Bot", desc: "Уведомления и команды через Telegram", connected: false, logo: "TG" },
  { name: "AmoCRM", desc: "Синхронизация воронки продаж", connected: false, logo: "AMO" },
  { name: "Slack", desc: "Алерты и отчёты в каналах Slack", connected: true, logo: "SL" },
  { name: "Google Workspace", desc: "Документы, таблицы, Drive", connected: false, logo: "GW" },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        border: "none",
        background: value ? "#00d4c8" : "#30363d",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: value ? "18px" : "2px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [notifs, setNotifs] = useState({ email: true, telegram: false, slack: true, digest: true });
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: true, ipWhitelist: false });
  const [connectedIntegrations, setConnectedIntegrations] = useState(
    Object.fromEntries(integrations.map((i) => [i.name, i.connected]))
  );

  return (
    <div className="flex gap-0 h-full overflow-hidden">
      {/* Tabs sidebar */}
      <div style={{ width: "180px", flexShrink: 0, borderRight: "1px solid rgba(48,54,61,0.8)", padding: "16px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
        <p style={{ fontSize: "10px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 8px", marginBottom: "8px" }}>Настройки</p>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: activeTab === id ? "rgba(0,212,200,0.10)" : "transparent",
              color: activeTab === id ? "#00d4c8" : "#8b949e",
              fontSize: "12px",
              fontWeight: activeTab === id ? 500 : 400,
              textAlign: "left",
              borderLeft: activeTab === id ? "2px solid #00d4c8" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "none" }}>
        {activeTab === "general" && (
          <div className="flex flex-col gap-5">
            <h2 style={{ color: "#e6edf3", fontSize: "15px", fontWeight: 600, margin: 0 }}>Основные настройки</h2>
            <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "12px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Организация</h3>
              {[
                { label: "Название компании", value: "BizFlow Technologies" },
                { label: "Домен", value: "bizflow.ai" },
                { label: "Часовой пояс", value: "Europe/Moscow (UTC+3)" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "5px" }}>{label}</label>
                  <input
                    defaultValue={value}
                    style={{
                      width: "100%",
                      background: "#21262d",
                      border: "1px solid rgba(48,54,61,0.8)",
                      borderRadius: "6px",
                      padding: "7px 10px",
                      color: "#e6edf3",
                      fontSize: "12px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "12px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>AI-модель</h3>
              <div>
                <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "5px" }}>Провайдер</label>
                <select style={{ background: "#21262d", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "7px 10px", color: "#e6edf3", fontSize: "12px", outline: "none", width: "100%" }}>
                  <option>Anthropic Claude (Sonnet 4.6)</option>
                  <option>OpenAI GPT-4o</option>
                  <option>Yandex GPT Pro</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#8b949e", display: "block", marginBottom: "5px" }}>Язык интерфейса</label>
                <select style={{ background: "#21262d", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "7px 10px", color: "#e6edf3", fontSize: "12px", outline: "none", width: "100%" }}>
                  <option>Русский</option>
                  <option>English</option>
                </select>
              </div>
            </div>

            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "#00d4c8", color: "#0d1117", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", width: "fit-content" }}>
              <Save size={13} />
              Сохранить изменения
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="flex flex-col gap-5">
            <h2 style={{ color: "#e6edf3", fontSize: "15px", fontWeight: 600, margin: 0 }}>Безопасность</h2>
            <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {([
                ["twoFactor", "Двухфакторная аутентификация", "Требовать 2FA для всех пользователей"],
                ["sessionTimeout", "Тайм-аут сессии", "Автовыход через 8 часов неактивности"],
                ["ipWhitelist", "Белый список IP", "Разрешать вход только с доверенных адресов"],
              ] as [keyof typeof security, string, string][]).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between" style={{ paddingBottom: "14px", borderBottom: "1px solid rgba(48,54,61,0.4)" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500, margin: "0 0 2px 0" }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "#8b949e", margin: 0 }}>{desc}</p>
                  </div>
                  <Toggle value={security[key]} onChange={(v) => setSecurity((s) => ({ ...s, [key]: v }))} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="flex flex-col gap-5">
            <h2 style={{ color: "#e6edf3", fontSize: "15px", fontWeight: 600, margin: 0 }}>Уведомления</h2>
            <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {([
                ["email", "Email-уведомления", "Ошибки воркфлоу и важные события"],
                ["telegram", "Telegram-бот", "Алерты в режиме реального времени"],
                ["slack", "Slack-интеграция", "Уведомления в выбранные каналы"],
                ["digest", "Ежедневный дайджест", "Сводка активности в 09:00"],
              ] as [keyof typeof notifs, string, string][]).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between" style={{ paddingBottom: "14px", borderBottom: "1px solid rgba(48,54,61,0.4)" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500, margin: "0 0 2px 0" }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "#8b949e", margin: 0 }}>{desc}</p>
                  </div>
                  <Toggle value={notifs[key]} onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="flex flex-col gap-5">
            <h2 style={{ color: "#e6edf3", fontSize: "15px", fontWeight: 600, margin: 0 }}>Интеграции</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {integrations.map((intg) => {
                const isConnected = connectedIntegrations[intg.name];
                return (
                  <div
                    key={intg.name}
                    style={{
                      background: "#161b22",
                      border: `1px solid ${isConnected ? "rgba(0,212,200,0.3)" : "rgba(48,54,61,0.8)"}`,
                      borderRadius: "8px",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: isConnected ? "rgba(0,212,200,0.12)" : "#21262d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isConnected ? "#00d4c8" : "#8b949e",
                        fontSize: "10px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {intg.logo}
                    </div>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500, margin: "0 0 2px 0" }}>{intg.name}</p>
                      <p style={{ fontSize: "11px", color: "#8b949e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intg.desc}</p>
                    </div>
                    <button
                      onClick={() => setConnectedIntegrations((c) => ({ ...c, [intg.name]: !c[intg.name] }))}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "5px",
                        border: `1px solid ${isConnected ? "rgba(248,81,73,0.3)" : "rgba(0,212,200,0.4)"}`,
                        background: "transparent",
                        color: isConnected ? "#f85149" : "#00d4c8",
                        fontSize: "11px",
                        fontWeight: 500,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {isConnected ? "Отключить" : "Подключить"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="flex flex-col gap-5">
            <h2 style={{ color: "#e6edf3", fontSize: "15px", fontWeight: 600, margin: 0 }}>API-ключи</h2>
            <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { name: "Production API Key", key: "bzf_live_••••••••••••••••••3a8f", created: "12.01.2026", lastUsed: "Сегодня" },
                { name: "Development API Key", key: "bzf_test_••••••••••••••••••9c2d", created: "03.03.2026", lastUsed: "Вчера" },
              ].map((apiKey) => (
                <div key={apiKey.name} style={{ padding: "14px", background: "#0d1117", borderRadius: "6px", border: "1px solid rgba(48,54,61,0.6)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 600, margin: 0 }}>{apiKey.name}</p>
                    <div className="flex items-center gap-2">
                      <button style={{ fontSize: "11px", color: "#8b949e", background: "rgba(48,54,61,0.6)", border: "none", borderRadius: "4px", padding: "3px 8px", cursor: "pointer" }}>Показать</button>
                      <button style={{ fontSize: "11px", color: "#f85149", background: "rgba(248,81,73,0.08)", border: "none", borderRadius: "4px", padding: "3px 8px", cursor: "pointer" }}>Удалить</button>
                    </div>
                  </div>
                  <code style={{ fontSize: "11px", color: "#00d4c8", fontFamily: "monospace", display: "block", marginBottom: "6px" }}>{apiKey.key}</code>
                  <p style={{ fontSize: "10px", color: "#8b949e", margin: 0 }}>Создан: {apiKey.created} · Последнее использование: {apiKey.lastUsed}</p>
                </div>
              ))}
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", color: "#00d4c8", border: "1px solid rgba(0,212,200,0.4)", borderRadius: "6px", padding: "7px 14px", fontSize: "12px", fontWeight: 500, cursor: "pointer", width: "fit-content" }}>
              <Key size={13} />
              Создать новый ключ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
