import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Users, GitBranch, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const revenueData = [
  { month: "Янв", revenue: 4200, tasks: 38 },
  { month: "Фев", revenue: 5800, tasks: 52 },
  { month: "Мар", revenue: 4900, tasks: 44 },
  { month: "Апр", revenue: 7200, tasks: 68 },
  { month: "Май", revenue: 6800, tasks: 61 },
  { month: "Июн", revenue: 8400, tasks: 79 },
  { month: "Июл", revenue: 9100, tasks: 85 },
  { month: "Авг", revenue: 8700, tasks: 81 },
  { month: "Сен", revenue: 10200, tasks: 94 },
  { month: "Окт", revenue: 11400, tasks: 102 },
  { month: "Ноя", revenue: 10800, tasks: 98 },
  { month: "Дек", revenue: 13200, tasks: 118 },
];

const workflowData = [
  { name: "CRM", completed: 32, active: 14, failed: 2 },
  { name: "Продажи", completed: 28, active: 9, failed: 1 },
  { name: "HR", completed: 19, active: 6, failed: 0 },
  { name: "Финансы", completed: 24, active: 11, failed: 3 },
  { name: "Логистика", completed: 15, active: 7, failed: 1 },
];

const activities = [
  { id: 1, user: "Мария С.", action: "запустила воркфлоу", target: "Онбординг клиента #847", time: "2 мин назад", type: "success" },
  { id: 2, user: "Дмитрий К.", action: "завершил задачу", target: "Квартальный отчёт Q4", time: "15 мин назад", type: "success" },
  { id: 3, user: "AI-агент", action: "обнаружил аномалию в", target: "Воркфлоу «Расчёт зарплат»", time: "28 мин назад", type: "warning" },
  { id: 4, user: "Ольга Н.", action: "добавила пользователя в", target: "Группу «Менеджеры»", time: "1 час назад", type: "info" },
  { id: 5, user: "AI-агент", action: "оптимизировал", target: "3 процесса в CRM-интеграции", time: "2 часа назад", type: "success" },
  { id: 6, user: "Сервер", action: "ошибка выполнения в", target: "Воркфлоу «Email-рассылка»", time: "3 часа назад", type: "error" },
];

const kpis = [
  { label: "Активных воркфлоу", value: "247", delta: "+12%", up: true, icon: GitBranch, color: "#00d4c8" },
  { label: "Пользователей", value: "1,284", delta: "+8%", up: true, icon: Users, color: "#3b82f6" },
  { label: "Выполнено задач", value: "8,941", delta: "+23%", up: true, icon: CheckCircle2, color: "#a78bfa" },
  { label: "Ср. время обработки", value: "1.4 мин", delta: "-18%", up: false, icon: Clock, color: "#f59e0b" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "8px 12px" }}>
        <p style={{ color: "#8b949e", fontSize: "11px", marginBottom: "4px" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontSize: "12px", fontWeight: 500 }}>
            {p.name}: {typeof p.value === "number" && p.name === "revenue" ? `₽${p.value.toLocaleString()}K` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 p-5 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#e6edf3", fontSize: "18px", fontWeight: 600, margin: 0 }}>Обзор системы</h1>
          <p style={{ color: "#8b949e", fontSize: "12px", marginTop: "2px" }}>Последнее обновление: сегодня, 14:32</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            style={{
              background: "#21262d",
              border: "1px solid rgba(48,54,61,0.8)",
              color: "#e6edf3",
              borderRadius: "6px",
              padding: "5px 10px",
              fontSize: "12px",
            }}
          >
            <option>Последние 30 дней</option>
            <option>Последние 7 дней</option>
            <option>Этот квартал</option>
          </select>
          <button
            style={{
              background: "#00d4c8",
              color: "#0d1117",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Экспорт
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {kpis.map(({ label, value, delta, up, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              background: "#161b22",
              border: "1px solid rgba(48,54,61,0.8)",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
              <div style={{ padding: "6px", background: `${color}18`, borderRadius: "6px" }}>
                <Icon size={14} style={{ color }} />
              </div>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#e6edf3", letterSpacing: "-0.02em" }}>{value}</div>
            <div className="flex items-center gap-1 mt-1">
              {up ? <TrendingUp size={12} style={{ color: "#00d4c8" }} /> : <TrendingDown size={12} style={{ color: "#f85149" }} />}
              <span style={{ fontSize: "11px", color: up ? "#00d4c8" : "#f85149", fontWeight: 500 }}>{delta}</span>
              <span style={{ fontSize: "11px", color: "#8b949e" }}>vs прош. период</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Area chart */}
        <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "16px" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600, margin: 0 }}>Выручка и задачи</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d4c8" }} />
                <span style={{ fontSize: "11px", color: "#8b949e" }}>Выручка</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }} />
                <span style={{ fontSize: "11px", color: "#8b949e" }}>Задачи</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4c8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00d4c8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(48,54,61,0.5)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area key="area-revenue" type="monotone" dataKey="revenue" stroke="#00d4c8" strokeWidth={2} fill="url(#colorRevenue)" name="revenue" />
              <Area key="area-tasks" type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTasks)" name="tasks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>Воркфлоу по отделам</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workflowData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(48,54,61,0.5)" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar key="bar-completed" dataKey="completed" fill="#00d4c8" radius={[3, 3, 0, 0]} name="completed" />
              <Bar key="bar-active" dataKey="active" fill="#3b82f6" radius={[3, 3, 0, 0]} name="active" />
              <Bar key="bar-failed" dataKey="failed" fill="#f85149" radius={[3, 3, 0, 0]} name="failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity feed */}
      <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "16px" }}>
        <h3 style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>Последняя активность</h3>
        <div className="flex flex-col gap-0">
          {activities.map((a, i) => (
            <div
              key={a.id}
              className="flex items-center gap-3"
              style={{
                padding: "8px 0",
                borderBottom: i < activities.length - 1 ? "1px solid rgba(48,54,61,0.5)" : "none",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: a.type === "success" ? "#00d4c8" : a.type === "warning" ? "#f59e0b" : a.type === "error" ? "#f85149" : "#3b82f6",
                  flexShrink: 0,
                }}
              />
              <div className="flex items-center gap-1 flex-1 flex-wrap" style={{ minWidth: 0 }}>
                <span style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500 }}>{a.user}</span>
                <span style={{ fontSize: "12px", color: "#8b949e" }}>{a.action}</span>
                <span style={{ fontSize: "12px", color: "#00d4c8" }}>{a.target}</span>
              </div>
              <span style={{ fontSize: "11px", color: "#8b949e", flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
