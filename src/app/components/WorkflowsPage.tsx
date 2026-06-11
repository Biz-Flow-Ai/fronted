import { useState } from "react";
import { Play, Pause, MoreHorizontal, Plus, Search, CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";

type Status = "active" | "paused" | "completed" | "failed";

const statusConfig: Record<Status, { label: string; color: string; bg: string; icon: any }> = {
  active: { label: "Активен", color: "#00d4c8", bg: "rgba(0,212,200,0.12)", icon: Play },
  paused: { label: "Пауза", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: Pause },
  completed: { label: "Завершён", color: "#8b949e", bg: "rgba(139,148,158,0.12)", icon: CheckCircle2 },
  failed: { label: "Ошибка", color: "#f85149", bg: "rgba(248,81,73,0.12)", icon: XCircle },
};

const workflows = [
  { id: 1, name: "Онбординг нового клиента", category: "CRM", status: "active" as Status, runs: 1284, lastRun: "2 мин назад", nextRun: "авто", owner: "Мария С.", triggers: ["Webhook", "Форма"] },
  { id: 2, name: "Квалификация входящего лида", category: "Продажи", status: "active" as Status, runs: 3902, lastRun: "5 мин назад", nextRun: "авто", owner: "AI-агент", triggers: ["Email", "CRM"] },
  { id: 3, name: "Расчёт зарплат сотрудников", category: "Финансы", status: "paused" as Status, runs: 412, lastRun: "3 дня назад", nextRun: "01.07.2026", owner: "Дмитрий К.", triggers: ["Расписание"] },
  { id: 4, name: "Согласование и оплата счетов", category: "Финансы", status: "active" as Status, runs: 876, lastRun: "15 мин назад", nextRun: "авто", owner: "AI-агент", triggers: ["Email"] },
  { id: 5, name: "Приём нового сотрудника", category: "HR", status: "active" as Status, runs: 238, lastRun: "1 час назад", nextRun: "авто", owner: "Ольга Н.", triggers: ["HR-система"] },
  { id: 6, name: "Ежеквартальный отчёт", category: "Аналитика", status: "completed" as Status, runs: 8, lastRun: "14 дней назад", nextRun: "01.07.2026", owner: "Дмитрий К.", triggers: ["Расписание"] },
  { id: 7, name: "Email-рассылка по сегменту", category: "Маркетинг", status: "failed" as Status, runs: 156, lastRun: "3 часа назад", nextRun: "—", owner: "Сергей В.", triggers: ["Триггер"] },
  { id: 8, name: "Обновление прайс-листа", category: "Продажи", status: "active" as Status, runs: 594, lastRun: "30 мин назад", nextRun: "авто", owner: "AI-агент", triggers: ["Webhook"] },
];

const kanbanCols: { id: Status; label: string }[] = [
  { id: "active", label: "Активные" },
  { id: "paused", label: "На паузе" },
  { id: "completed", label: "Завершённые" },
  { id: "failed", label: "С ошибкой" },
];

export function WorkflowsPage() {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");

  const filtered = workflows.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || w.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-4 p-5 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#e6edf3", fontSize: "18px", fontWeight: 600, margin: 0 }}>Воркфлоу</h1>
          <p style={{ color: "#8b949e", fontSize: "12px", marginTop: "2px" }}>{workflows.length} процессов всего</p>
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
          Новый воркфлоу
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2" style={{ background: "#21262d", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "6px 10px", flex: "1", minWidth: "200px", maxWidth: "320px" }}>
          <Search size={13} style={{ color: "#8b949e", flexShrink: 0 }} />
          <input
            placeholder="Поиск воркфлоу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "#e6edf3", fontSize: "12px", width: "100%" }}
          />
        </div>

        <div className="flex items-center gap-1" style={{ background: "#21262d", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "3px" }}>
          {([["all", "Все"], ["active", "Активные"], ["paused", "Пауза"], ["failed", "Ошибки"]] as [Status | "all", string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: "3px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                background: filter === val ? "#161b22" : "transparent",
                color: filter === val ? "#e6edf3" : "#8b949e",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto" style={{ background: "#21262d", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "6px", padding: "3px" }}>
          {(["table", "kanban"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "3px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                background: view === v ? "#161b22" : "transparent",
                color: view === v ? "#e6edf3" : "#8b949e",
              }}
            >
              {v === "table" ? "Таблица" : "Канбан"}
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <div style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(48,54,61,0.8)" }}>
                {["Воркфлоу", "Категория", "Статус", "Запусков", "Последний запуск", "Следующий", "Владелец", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: "10px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 12px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((w, i) => {
                const s = statusConfig[w.status];
                const SIcon = s.icon;
                return (
                  <tr
                    key={w.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(48,54,61,0.4)" : "none",
                      transition: "background 0.1s",
                    }}
                    className="hover:bg-secondary"
                  >
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500 }}>{w.name}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: "11px", color: "#8b949e", background: "rgba(48,54,61,0.6)", padding: "2px 6px", borderRadius: "4px" }}>{w.category}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div className="flex items-center gap-1.5" style={{ background: s.bg, borderRadius: "5px", padding: "3px 8px", width: "fit-content" }}>
                        <SIcon size={11} style={{ color: s.color }} />
                        <span style={{ fontSize: "11px", color: s.color, fontWeight: 500 }}>{s.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", color: "#8b949e", fontVariantNumeric: "tabular-nums" }}>{w.runs.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", color: "#8b949e" }}>{w.lastRun}</td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", color: "#8b949e" }}>{w.nextRun}</td>
                    <td style={{ padding: "10px 12px", fontSize: "12px", color: "#8b949e" }}>{w.owner}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <button style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", padding: "2px" }}>
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)", alignItems: "start" }}>
          {kanbanCols.map(({ id, label }) => {
            const colItems = filtered.filter((w) => w.status === id);
            const s = statusConfig[id];
            return (
              <div key={id} style={{ background: "#161b22", border: "1px solid rgba(48,54,61,0.8)", borderRadius: "8px", overflow: "hidden" }}>
                <div className="flex items-center justify-between" style={{ padding: "10px 12px", borderBottom: "1px solid rgba(48,54,61,0.8)" }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
                    <span style={{ fontSize: "11px", color: "#e6edf3", fontWeight: 600 }}>{label}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#8b949e", background: "rgba(48,54,61,0.6)", padding: "1px 6px", borderRadius: "10px" }}>{colItems.length}</span>
                </div>
                <div className="flex flex-col gap-2 p-2">
                  {colItems.map((w) => (
                    <div key={w.id} style={{ background: "#0d1117", border: "1px solid rgba(48,54,61,0.6)", borderRadius: "6px", padding: "10px" }}>
                      <p style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 500, marginBottom: "6px", lineHeight: 1.3 }}>{w.name}</p>
                      <p style={{ fontSize: "10px", color: "#8b949e", marginBottom: "6px" }}>{w.category} · {w.owner}</p>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: "10px", color: "#8b949e" }}>{w.runs.toLocaleString()} запусков</span>
                        <span style={{ fontSize: "10px", color: "#8b949e" }}>{w.lastRun}</span>
                      </div>
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <p style={{ fontSize: "11px", color: "#8b949e", textAlign: "center", padding: "16px 0" }}>Нет воркфлоу</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
