import { memo } from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";

function SourceCard({ source, href, hotkey, cheapFirst, onOpen }) {
  return (
    <a
      className="source-card"
      style={{ "--brand": source.color }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onOpen}
    >
      <span className="source-mark">{source.mark}</span>
      <span className="source-copy">
        <b>{source.name}</b>
        <small>
          {source.note}
          {cheapFirst && source.cheap && <em><ArrowUpDown size={10} /> дешёвые</em>}
        </small>
      </span>
      {hotkey && <kbd className="source-key" aria-hidden="true">{hotkey}</kbd>}
      <ExternalLink size={16} className="source-ext" aria-hidden="true" />
    </a>
  );
}

export default memo(SourceCard);
