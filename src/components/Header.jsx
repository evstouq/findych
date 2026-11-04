import { Search, SlidersHorizontal } from "lucide-react";

export default function Header({ enabledCount, totalCount, onOpenSettings, onHome }) {
  return (
    <header className="topbar">
      <a className="brand" href="./" onClick={(e) => { e.preventDefault(); onHome(); }} aria-label="FINDыч — на главную">
        <span className="brand-icon"><Search size={19} /></span>
        <span className="brand-text">FIND<span>ыч</span><small>ПОИСК ПО МАГАЗИНАМ</small></span>
      </a>
      <button type="button" className="topbar-btn" onClick={onOpenSettings} aria-haspopup="dialog">
        <SlidersHorizontal size={14} />
        <span className="topbar-btn-label">Площадки</span>
        <span className="topbar-count">{enabledCount}/{totalCount}</span>
      </button>
    </header>
  );
}
