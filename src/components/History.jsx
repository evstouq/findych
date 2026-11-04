import { ArrowRight, Star, X } from "lucide-react";

function List({ title, items, onPick, onRemove, onClear, fav }) {
  if (!items.length) return null;
  return (
    <div className="history-block">
      <div className="history-head">
        <span className="kicker">{title}</span>
        {onClear && <button type="button" className="link-btn" onClick={onClear}>Очистить</button>}
      </div>
      <div className="history-list">
        {items.map((item) => (
          <span className={fav ? "history-item fav" : "history-item"} key={item}>
            <button type="button" className="history-pick" onClick={() => onPick(item)}>
              {fav && <Star size={12} />}
              {item}
              <ArrowRight size={13} />
            </button>
            <button type="button" className="history-remove" onClick={() => onRemove(item)} aria-label={`Удалить «${item}»`}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function History({ recent, favorites, onPick, onRemoveRecent, onRemoveFavorite, onClearRecent }) {
  if (!recent.length && !favorites.length) return null;
  return (
    <section className="history">
      <List title="ИЗБРАННОЕ" items={favorites} onPick={onPick} onRemove={onRemoveFavorite} fav />
      <List title="НЕДАВНИЕ ЗАПРОСЫ" items={recent} onPick={onPick} onRemove={onRemoveRecent} onClear={onClearRecent} />
    </section>
  );
}
