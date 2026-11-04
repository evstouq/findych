import { memo } from "react";

/** Декоративный космический фон. Статичный, поэтому не перерисовывается. */
function Background() {
  return (
    <div className="space-bg" aria-hidden="true">
      <div className="solar">
        <div className="solar-sun" />
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`solar-orbit solar-orbit-${n}`}>
            <div className={`solar-planet planet-${n}`}>{n === 4 && <span className="planet-ring" />}</div>
          </div>
        ))}
      </div>
      {[1, 2, 3, 4].map((n) => <div key={`s${n}`} className={`shooting-star s-star-${n}`} />)}
      {[1, 2, 3, 4].map((n) => <div key={`p${n}`} className={`falling-speck speck-${n}`} />)}
    </div>
  );
}

export default memo(Background);
