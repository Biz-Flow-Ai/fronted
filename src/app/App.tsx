import { useState } from "react";
import { Bell, Search, Zap } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { WorkflowsPage } from "./components/WorkflowsPage";
import { UsersPage } from "./components/UsersPage";
import { SettingsPage } from "./components/SettingsPage";

const pageTitles: Record<string, string> = {
  dashboard: "Дашборд",
  analytics: "Аналитика",
  workflows: "Воркфлоу",
  users: "Пользователи",
  settings: "Настройки",
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [notifications] = useState(4);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#0d1117", overflow: "hidden" }}>
      <Sidebar activePage={page} onNavigate={setPage} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header
          style={{
            height: "56px",
            minHeight: "56px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 20px",
            borderBottom: "1px solid rgba(48,54,61,0.8)",
            background: "#0d1117",
          }}
        >
          <h2 style={{ color: "#e6edf3", fontSize: "14px", fontWeight: 600, margin: 0, marginRight: "auto" }}>
            {pageTitles[page]}
          </h2>

          {/* Search */}
          <div
            className="flex items-center gap-2"
            style={{
              background: "#21262d",
              border: "1px solid rgba(48,54,61,0.8)",
              borderRadius: "6px",
              padding: "5px 10px",
              width: "220px",
            }}
          >
            <Search size={12} style={{ color: "#8b949e", flexShrink: 0 }} />
            <input
              placeholder="Поиск..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e6edf3",
                fontSize: "12px",
                width: "100%",
              }}
            />
            <kbd style={{ fontSize: "10px", color: "#8b949e", background: "rgba(48,54,61,0.6)", padding: "1px 4px", borderRadius: "3px", flexShrink: 0 }}>⌘K</kbd>
          </div>

          {/* AI status */}
          <div
            className="flex items-center gap-1.5"
            style={{
              background: "rgba(0,212,200,0.08)",
              border: "1px solid rgba(0,212,200,0.2)",
              borderRadius: "6px",
              padding: "5px 10px",
            }}
          >
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00d4c8", boxShadow: "0 0 6px #00d4c8" }} />
            <Zap size={11} style={{ color: "#00d4c8" }} />
            <span style={{ fontSize: "11px", color: "#00d4c8", fontWeight: 500 }}>AI активен</span>
          </div>

          {/* Notifications */}
          <button
            style={{
              position: "relative",
              background: "none",
              border: "none",
              color: "#8b949e",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Bell size={16} />
            {notifications > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  width: "14px",
                  height: "14px",
                  background: "#f85149",
                  borderRadius: "50%",
                  fontSize: "9px",
                  color: "#fff",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {notifications}
              </span>
            )}
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "hidden" }}>
          {page === "dashboard" && <DashboardPage />}
          {page === "analytics" && <AnalyticsPage />}
          {page === "workflows" && <WorkflowsPage />}
          {page === "users" && <UsersPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
