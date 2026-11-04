import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { GROUPS, SOURCES } from "../data/sources.js";

/** Диалог выбора площадок, которые показываются в результатах. */
export default function SourcesDialog({ open, enabled, onChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const set = new Set(enabled);
  const toggle = (id) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(SOURCES.map((s) => s.id).filter((x) => next.has(x)));
  };
  const toggleGroup = (gid) => {
    const ids = SOURCES.filter((s) => s.group === gid).map((s) => s.id);
    const allOn = ids.every((id) => set.has(id));
    const next = new Set(set);
    ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
    onChange(SOURCES.map((s) => s.id).filter((x) => next.has(x)));
  };

  return (
    <dialog
      ref={ref}
      className="sources-dialog"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-labelledby="sources-title"
    >
      <div className="dialog-inner">
        <div className="dialog-head">
          <div>
            <span className="kicker">НАСТРОЙКА</span>
            <h3 id="sources-title">Где искать</h3>
          </div>
          <button type="button" className="clear-btn" onClick={onClose} aria-label="Закрыть"><X size={16} /></button>
        </div>

        {GROUPS.map((g) => {
          const items = SOURCES.filter((s) => s.group === g.id);
          return (
            <fieldset key={g.id} className="dialog-group">
              <legend>
                {g.title}
                <button type="button" className="link-btn" onClick={() => toggleGroup(g.id)}>
                  {items.every((s) => set.has(s.id)) ? "Снять все" : "Выбрать все"}
                </button>
              </legend>
              <div className="dialog-grid">
                {items.map((s) => (
                  <label key={s.id} className={set.has(s.id) ? "pick on" : "pick"} style={{ "--brand": s.color }}>
                    <input type="checkbox" checked={set.has(s.id)} onChange={() => toggle(s.id)} />
                    <span className="source-mark small">{s.mark}</span>
                    <span>{s.name}</span>
                    <span className="pick-check"><Check size={12} /></span>
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}

        <div className="dialog-foot">
          <button type="button" className="link-btn" onClick={() => onChange(SOURCES.map((s) => s.id))}>Включить все</button>
          <button type="button" className="chip-btn primary" onClick={onClose}>Готово</button>
        </div>
      </div>
    </dialog>
  );
}
