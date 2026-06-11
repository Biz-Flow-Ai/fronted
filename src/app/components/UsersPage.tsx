import { useState } from "react";
import { Search, Plus, MoreHorizontal, Shield, User, UserCheck, Ban } from "lucide-react";

type Role = "admin" | "manager" | "analyst" | "viewer";
type UserStatus = "active" | "inactive" | "pending";

const roleConfig: Record<Role, { label: string; color: string; bg: string }> = {
  admin: { label: "Администратор", color: "#f85149", bg: "rgba(248,81,73,0.12)" },
  manager: { label: "Менеджер", color: "#00d4c8", bg: "rgba(0,212,200,0.12)" },
  analyst: { label: "Аналитик", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  viewer: { label: "Наблюдатель", color: "#8b949e", bg: "rgba(139,148,158,0.12)" },
};

const statusConf: Record<UserStatus, { label: string; color: string }> = {
  active: { label: "Активен", color: "#00d4c8" },
  inactive: { label: "Неактивен", color: "#8b949e" },
  pending: { label: "Ожидает", color: "#f59e0b" },
};

const users = [
  { id: 1, name: "Алексей Дмитриев", email: "alexey@bizflow.ai", role: "admin" as Role, status: "active" as UserStatus, workflows: 24, lastLogin: "Сегодня, 14:20", avatar: "АД" },
  { id: 2, name: "Мария Соколова", email: "maria@bizflow.ai", role: "manager" as Role, status: "active" as UserStatus, workflows: 18, lastLogin: "Сегодня, 13:45", avatar: "МС" },
  { id: 3, name: "Дмитрий Козлов", email: "dmitry@bizflow.ai", role: "analyst" as Role, status: "active" as UserStatus, workflows: 9, lastLogin: "Вчера, 18:32", avatar: "ДК" },
  { id: 4, name: "Ольга Никитина", email: "olga@bizflow.ai", role: "manager" as Role, status: "active" as UserStatus, workflows: 12, lastLogin: "Сегодня, 11:00", avatar: "ОН" },
  { id: 5, name: "Сергей Власов", email: "sergey@bizflow.ai", role: "analyst" as Role, status: "inactive" as UserStatus, workflows: 5, lastLogin: "3 дня назад", avatar: "СВ" },
  { id: 6, name: "Екатерина Морозова", email: "kate@bizflow.ai", role: "viewer" as Role, status: "pending" as UserStatus, workflows: 0, lastLogin: "Никогда", avatar: "ЕМ" },
  { id: 7, name: "Андрей Белов", email: "andrey@bizflow.ai", role: "manager" as Role, status: "active" as UserStatus, workflows: 15, lastLogin: "Сегодня, 09:15", avatar: "АБ" },
  { id: 8, name: "Наталья Волкова", email: "natalia@bizflow.ai", role: "analyst" as Role, status: "active" as UserStatus, workflows: 7, lastLogin: "Вчера, 20:10", avatar: "НВ" },
  { id: 9, name: "Иван Орлов", email: "ivan@bizflow.ai", role: "viewer" as Role, status: "active" as UserStatus, workflows: 3, lastLogin: "2 дня назад", avatar: "ИО" },
  { id: 10, name: "Людмила Тихонова", email: "lyudmila@bizflow.ai", role: "manager" as Role, status: "inactive" as UserStatus, workflows: 6, lastLogin: "1 неделю назад", avatar: "ЛТ" },
];

const avatarColors = ["#00d4c8", "#3b82f6", "#a78bfa", "#f59e0b", "#f85149"];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col gap-4 p-5 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#e6edf3", fontSize: "18px", fontWeight: 600, margin: 0 }}>Пользователи</h1>
          <p style={{ color: "#8b949e", fontSize: "12px", marginTop: "2px" }}>{users.length} аккаунтов · {users.filter((u) => u.status === "active").length} активных</p>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#00d4c8",
            color: "#0d1117",
            border: "none",
            borderRadius: "6px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Пригласить
        </button>
      </div>

      {/* Stats row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Всего", value: users.length, icon: User, color: "#8b949e" },
          { label: "Активных", value: users.filter((u) => u.status === "active").length, icon: UserCheck, color: "#00d4c8" },
          { label: "Ожидают", value: users.filter((u) => u.status === "pending").length, icon: Shield, color: "#f59e0b" },
          { label: "Заблокировано", value: users.filter((u) => u.status === "inactive").length, icon: Ban, color: "#f85149" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "8px", background: `${color}18`, borderRadius: "6px" }}>
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#e6edf3", margin: 0, letterSpacing: "-0.02em" }}>{value}</p>
              <p style={{ fontSize: "11px", color: "#8b949e", margin: 0 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2" style={{ background: "#21262d", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "6px 10px", flex: "1", minWidth: "200px", maxWidth: "300px" }}>
          <Search size={13} style={{ color: "#8b949e", flexShrink: 0 }} />
          <input
            placeholder="Поиск по имени или email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#e6edf3", fontSize: "12px", width: "100%" }}
          />
        </div>

        <div className="flex items-center gap-1" style={{ background: "#21262d", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "3px" }}>
          {([["all", "Все роли"], ["admin", "Адм."], ["manager", "Менеджер"], ["analyst", "Аналитик"], ["viewer", "Наблюдатель"]] as [Role | "all", string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setRoleFilter(val)}
              style={{
                padding: "3px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                background: roleFilter === val ? "#161b22" : "transparent",
                color: roleFilter === val ? "#e6edf3" : "#8b949e",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span style={{ fontSize: "11px", color: "#8b949e" }}>Выбрано: {selected.length}</span>
            <button style={{ fontSize: "11px", color: "#f85149", background: "rgba(248,81,73,0.12)", border: "none", borderRadius: "5px", padding: "4px 10px", cursor: "pointer" }}>
              Удалить
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(48,54,61,0.8)" }}>
              <th style={{ padding: "10px 12px", width: "36px" }}>
                <input type="checkbox" style={{ accentColor: "#00d4c8" }} />
              </th>
              {["Пользователь", "Роль", "Статус", "Воркфлоу", "Последний вход", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: "10px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 12px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const role = roleConfig[u.role];
              const status = statusConf[u.status];
              const avatarColor = avatarColors[u.id % avatarColors.length];
              const isSelected = selected.includes(u.id);
              return (
                <tr
                  key={u.id}
                  className="hover:bg-secondary"
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(48,54,61,0.4)" : "none",
                    background: isSelected ? "rgba(0,212,200,0.04)" : "transparent",
                    transition: "background 0.1s",
                  }}
                >
                  <td style={{ padding: "10px 12px" }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(u.id)}
                      style={{ accentColor: "#00d4c8" }}
                    />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: "30px",
                          height: "30px",
                          background: `${avatarColor}20`,
                          border: `1px solid ${avatarColor}40`,
                          color: avatarColor,
                          fontSize: "10px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {u.avatar}
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500, margin: 0 }}>{u.name}</p>
                        <p style={{ fontSize: "11px", color: "#8b949e", margin: 0 }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: "11px", color: role.color, background: role.bg, padding: "3px 8px", borderRadius: "5px", fontWeight: 500 }}>
                      {role.label}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div className="flex items-center gap-1">
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: status.color }} />
                      <span style={{ fontSize: "12px", color: status.color }}>{status.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", color: "#8b949e", fontVariantNumeric: "tabular-nums" }}>{u.workflows}</td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", color: "#8b949e" }}>{u.lastLogin}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer" }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(48,54,61,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "#8b949e" }}>Показано {filtered.length} из {users.length}</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "4px",
                  border: "1px solid rgba(48,54,61,0.8)",
                  background: p === 1 ? "#00d4c8" : "transparent",
                  color: p === 1 ? "#0d1117" : "#8b949e",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: p === 1 ? 600 : 400,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
