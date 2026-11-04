import { forwardRef, useId, useMemo, useState } from "react";
import { ArrowRight, Clock, Search, Star, X } from "lucide-react";

/** Поисковая строка с подсказками из истории и избранного. */
const SearchBar = forwardRef(function SearchBar({ value, onChange, onSubmit, onClear, recent, favorites }, ref) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    const seen = new Set();
    const all = [
      ...favorites.map((text) => ({ text, kind: "fav" })),
      ...recent.map((text) => ({ text, kind: "recent" })),
    ].filter(({ text }) => {
      const k = text.toLowerCase();
      if (seen.has(k) || k === q) return false;
      seen.add(k);
      return !q || k.includes(q);
    });
    return all.slice(0, 6);
  }, [value, recent, favorites]);

  const showList = open && suggestions.length > 0;

  const pick = (text) => {
    setOpen(false);
    setActive(-1);
    onSubmit(text);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showList && active >= 0) pick(suggestions[active].text);
      else pick(value);
    } else if (e.key === "Escape") {
      if (showList) setOpen(false);
      else if (value) onClear();
    }
  };

  return (
    <form className="search-form" role="search" onSubmit={(e) => { e.preventDefault(); pick(value); }}>
      <Search size={20} className="search-form-icon" aria-hidden="true" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
        placeholder="Например, мышь logitech g102"
        aria-label="Что ищем?"
        enterKeyHint="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        maxLength={200}
      />
      {!value && <kbd className="kbd-hint" aria-hidden="true">/</kbd>}
      {value && (
        <button type="button" className="clear-btn" onClick={onClear} aria-label="Очистить">
          <X size={15} />
        </button>
      )}
      <button type="submit" className="find-btn">
        <span>Найти</span> <ArrowRight size={16} />
      </button>

      {showList && (
        <ul className="suggest" id={listId} role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.text}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "active" : undefined}
              onMouseDown={(e) => { e.preventDefault(); pick(s.text); }}
              onMouseEnter={() => setActive(i)}
            >
              {s.kind === "fav" ? <Star size={14} className="suggest-fav" /> : <Clock size={14} />}
              <span>{s.text}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
});

export default SearchBar;
