import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const aiEfficiencyData = [
  { day: "Пн", manual: 85, ai: 42 },
  { day: "Вт", manual: 92, ai: 38 },
  { day: "Ср", manual: 78, ai: 35 },
  { day: "Чт", manual: 88, ai: 40 },
  { day: "Пт", manual: 95, ai: 36 },
  { day: "Сб", manual: 60, ai: 28 },
  { day: "Вс", manual: 45, ai: 22 },
];

const conversionData = [
  { month: "Янв", leads: 340, converted: 87 },
  { month: "Фев", leads: 420, converted: 115 },
  { month: "Мар", leads: 390, converted: 108 },
  { month: "Апр", leads: 510, converted: 148 },
  { month: "Май", leads: 480, converted: 142 },
  { month: "Июн", leads: 620, converted: 195 },
];

const categoryData = [
  { name: "CRM", value: 34, color: "#00d4c8" },
  { name: "Продажи", value: 22, color: "#3b82f6" },
  { name: "HR", value: 15, color: "#a78bfa" },
  { name: "Финансы", value: 18, color: "#f59e0b" },
  { name: "Прочее", value: 11, color: "#8b949e" },
];

const topFlows = [
  { name: "Онбординг клиента", runs: 1284, success: 97.2, saved: "48 ч" },
  { name: "Квалификация лида", runs: 3902, success: 99.1, saved: "120 ч" },
  { name: "Расчёт зарплат", runs: 412, success: 94.8, saved: "36 ч" },
  { name: "Согласование счетов", runs: 876, success: 98.4, saved: "62 ч" },
  { name: "Приём сотрудника", runs: 238, success: 96.6, saved: "28 ч" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "8px 12px" }}>
        <p style={{ color: "#8b949e", fontSize: "11px", marginBottom: "4px" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontSize: "12px", fontWeight: 500 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5 p-5 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#e6edf3", fontSize: "18px", fontWeight: 600, margin: 0 }}>Аналитика</h1>
          <p style={{ color: "#8b949e", fontSize: "12px", marginTop: "2px" }}>Данные за последние 6 месяцев</p>
        </div>
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
          <option>6 месяцев</option>
          <option>3 месяца</option>
          <option>1 год</option>
        </select>
      </div>

      {/* Summary row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { label: "Сэкономлено часов AI", value: "12,480", sub: "+34% vs прош. кв." },
          { label: "Точность AI-решений", value: "98.7%", sub: "−0.2% vs прош. кв." },
          { label: "ROI автоматизации", value: "×4.8", sub: "Возврат инвестиций" },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            style={{
              background: "#161b22",
              border: "1px solid rgba(48,54,61,0.8)",
              borderRadius: "8px",
              padding: "16px 20px",
            }}
          >
            <p style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: "#00d4c8", letterSpacing: "-0.03em", marginBottom: "4px" }}>{value}</p>
            <p style={{ fontSize: "11px", color: "#8b949e" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* AI vs manual time */}
        <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>AI vs ручное время (мин)</h3>
          <p style={{ fontSize: "11px", color: "#8b949e", marginBottom: "16px" }}>Среднее время выполнения задачи</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={aiEfficiencyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(48,54,61,0.5)" strokeDasharray="2 4" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line key="line-manual" type="monotone" dataKey="manual" stroke="#8b949e" strokeWidth={2} dot={false} name="Ручное" />
              <Line key="line-ai" type="monotone" dataKey="ai" stroke="#00d4c8" strokeWidth={2} dot={false} name="AI" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Воркфлоу по категориям</h3>
          <p style={{ fontSize: "11px", color: "#8b949e", marginBottom: "12px" }}>Доля активных процессов</p>
          <div className="flex items-center gap-4">
            <PieChart width={140} height={140}>
              <Pie
                data={categoryData}
                cx={70}
                cy={70}
                innerRadius={40}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex flex-col gap-2">
              {categoryData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: "#8b949e" }}>{name}</span>
                  <span style={{ fontSize: "11px", color: "#e6edf3", fontWeight: 600, marginLeft: "auto" }}>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion chart */}
      <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "16px" }}>
        <h3 style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>Лиды и конверсия</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={conversionData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(48,54,61,0.5)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#8b949e" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar key="bar-leads" dataKey="leads" fill="#21262d" radius={[3, 3, 0, 0]} name="Лиды" />
            <Bar key="bar-converted" dataKey="converted" fill="#00d4c8" radius={[3, 3, 0, 0]} name="Конвертировано" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top flows table */}
      <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", padding: "16px" }}>
        <h3 style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>Топ воркфлоу</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(48,54,61,0.8)" }}>
              {["Воркфлоу", "Запусков", "Успешность", "Сэкономлено"].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: "10px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 0 8px 0", paddingRight: "16px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topFlows.map((f, i) => (
              <tr key={f.name} style={{ borderBottom: i < topFlows.length - 1 ? "1px solid rgba(48,54,61,0.4)" : "none" }}>
                <td style={{ padding: "10px 16px 10px 0", fontSize: "12px", color: "#e6edf3" }}>{f.name}</td>
                <td style={{ padding: "10px 16px 10px 0", fontSize: "12px", color: "#8b949e", fontVariantNumeric: "tabular-nums" }}>{f.runs.toLocaleString()}</td>
                <td style={{ padding: "10px 16px 10px 0" }}>
                  <div className="flex items-center gap-2">
                    <div style={{ flex: 1, height: "4px", background: "rgba(48,54,61,0.8)", borderRadius: "2px", maxWidth: "80px" }}>
                      <div style={{ width: `${f.success}%`, height: "100%", background: "#00d4c8", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "11px", color: "#00d4c8", fontVariantNumeric: "tabular-nums" }}>{f.success}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 0", fontSize: "12px", color: "#a78bfa" }}>{f.saved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
