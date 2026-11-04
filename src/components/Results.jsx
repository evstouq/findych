import { useEffect, useMemo, useState } from "react";
import { Layers, Pencil, Share2, Star } from "lucide-react";
import { GROUPS } from "../data/sources.js";
import SourceCard from "./SourceCard.jsx";

export default function Results({ query, sources, cheapFirst, isFavorite, onToggleFavorite, onShare, onOpenAll, onEdit }) {
  const [tab, setTab] = useState("all");

  const groups = useMemo(
    () => GROUPS.map((g) => ({ ...g, items: sources.filter((s) => s.group === g.id) })).filter((g) => g.items.length),
    [sources]
  );
  const activeTab = groups.some((g) => g.id === tab) ? tab : "all";
  const shown = useMemo(() => (activeTab === "all" ? groups : groups.filter((g) => g.id === activeTab)), [groups, activeTab]);

  const ordered = useMemo(() => shown.flatMap((g) => g.items), [shown]);

  // Цифры 1–9 открывают площадку, если фокус не в поле ввода
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (document.querySelector("dialog[open]")) return;
      const i = Number(e.key) - 1;
      if (Number.isInteger(i) && i >= 0 && ordered[i]) {
        const w = window.open(ordered[i].href, "_blank");
        if (w) w.opener = null;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ordered]);

  let n = 0;

  return (
    <section className="results" aria-live="polite">
      <div className="results-head">
        <div className="results-title">
          <span className="kicker">ИЩЕМ{cheapFirst ? " · СНАЧАЛА ДЕШЁВЫЕ" : ""}</span>
          <h2>«{query}»</h2>
        </div>
        <div className="results-actions">
          <button type="button" className={isFavorite ? "chip-btn on" : "chip-btn"} onClick={onToggleFavorite} aria-pressed={isFavorite}>
            <Star size={14} /> {isFavorite ? "В избранном" : "В избранное"}
          </button>
          <button type="button" className="chip-btn" onClick={onShare}><Share2 size={14} /> Поделиться</button>
          <button type="button" className="chip-btn" onClick={onEdit}><Pencil size={14} /> Изменить</button>
          <button type="button" className="chip-btn primary" onClick={() => onOpenAll(ordered)}>
            <Layers size={14} /> Открыть все
          </button>
        </div>
      </div>

      {groups.length > 1 && (
        <div className="tabs" role="tablist" aria-label="Фильтр по типу площадок">
          <button type="button" role="tab" aria-selected={activeTab === "all"} className={activeTab === "all" ? "tab on" : "tab"} onClick={() => setTab("all")}>
            Все <span>{sources.length}</span>
          </button>
          {groups.map((g) => (
            <button type="button" role="tab" key={g.id} aria-selected={activeTab === g.id} className={activeTab === g.id ? "tab on" : "tab"} onClick={() => setTab(g.id)}>
              {g.short} <span>{g.items.length}</span>
            </button>
          ))}
        </div>
      )}

      {shown.map((g) => (
        <div className="source-group" key={g.id}>
          <div className="group-title">{g.title}</div>
          <div className="source-grid">
            {g.items.map((s) => {
              n += 1;
              return <SourceCard key={s.id} source={s} href={s.href} hotkey={n <= 9 ? n : null} cheapFirst={cheapFirst} />;
            })}
          </div>
        </div>
      ))}

      {!sources.length && <p className="empty-note">Все площадки выключены. Включите хотя бы одну в настройках «Площадки».</p>}

      <div className="footnote">
        <span className="footnote-mark">i</span>
        <span>
          Цены, наличие и доставка показываются на самих площадках. «Сначала дешёвые» работает на WB, Ozon, Яндекс Маркете и Авито.
          Цифры <kbd>1</kbd>–<kbd>9</kbd> на клавиатуре открывают площадку сразу.
        </span>
      </div>
    </section>
  );
}
