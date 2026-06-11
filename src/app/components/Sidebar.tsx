import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  GitBranch,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  Zap,
  LogOut,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
  { id: "workflows", label: "Воркфлоу", icon: GitBranch },
  { id: "users", label: "Пользователи", icon: Users },
  { id: "settings", label: "Настройки", icon: Settings },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-full transition-all duration-200 border-r border-border"
      style={{
        width: collapsed ? "64px" : "224px",
        background: "#0d1117",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 border-b border-border"
        style={{ height: "56px", minHeight: "56px" }}
      >
        <div
          className="flex items-center justify-center rounded"
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #00d4c8 0%, #0099ff 100%)",
            flexShrink: 0,
          }}
        >
          <Zap size={16} style={{ color: "#0d1117" }} />
        </div>
        {!collapsed && (
          <span style={{ color: "#e6edf3", fontWeight: 600, fontSize: "15px", letterSpacing: "-0.01em" }}>
            BizFlow <span style={{ color: "#00d4c8" }}>AI</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex items-center justify-center rounded hover:bg-secondary transition-colors"
          style={{ width: "24px", height: "24px", flexShrink: 0 }}
        >
          <ChevronLeft
            size={14}
            style={{
              color: "#8b949e",
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-0.5 px-2">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="flex items-center gap-3 rounded transition-all duration-150 text-left"
                style={{
                  height: "36px",
                  padding: collapsed ? "0 12px" : "0 10px",
                  background: active ? "rgba(0,212,200,0.12)" : "transparent",
                  color: active ? "#00d4c8" : "#8b949e",
                  borderLeft: active ? "2px solid #00d4c8" : "2px solid transparent",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                title={collapsed ? label : undefined}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ fontSize: "13px", fontWeight: active ? 500 : 400 }}>{label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border py-3 px-2 flex flex-col gap-0.5">
        <button
          className="flex items-center gap-3 rounded transition-colors hover:bg-secondary"
          style={{
            height: "36px",
            padding: collapsed ? "0 12px" : "0 10px",
            color: "#8b949e",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          title={collapsed ? "Уведомления" : undefined}
        >
          <Bell size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: "13px" }}>Уведомления</span>}
        </button>
        <button
          className="flex items-center gap-3 rounded transition-colors hover:bg-secondary"
          style={{
            height: "36px",
            padding: collapsed ? "0 12px" : "0 10px",
            color: "#8b949e",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          title={collapsed ? "Помощь" : undefined}
        >
          <HelpCircle size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: "13px" }}>Помощь</span>}
        </button>

        {/* User avatar */}
        <div
          className="flex items-center gap-3 rounded mt-2 pt-2 border-t border-border"
          style={{ padding: collapsed ? "8px 12px" : "8px 10px", justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <div
            className="flex items-center justify-center rounded-full text-xs font-semibold"
            style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #00d4c8 0%, #0099ff 100%)",
              color: "#0d1117",
              flexShrink: 0,
            }}
          >
            АД
          </div>
          {!collapsed && (
            <div className="flex flex-col" style={{ minWidth: 0 }}>
              <span style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Алексей Д.
              </span>
              <span style={{ fontSize: "11px", color: "#8b949e" }}>Администратор</span>
            </div>
          )}
          {!collapsed && (
            <button className="ml-auto" style={{ color: "#8b949e" }}>
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
