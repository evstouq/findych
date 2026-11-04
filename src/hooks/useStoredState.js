import { useCallback, useState } from "react";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

/** useState, который переживает перезагрузку страницы (localStorage). */
export function useStoredState(key, fallback, migrate) {
  const [value, setValue] = useState(() => {
    const v = read(key, fallback);
    return migrate ? migrate(v) : v;
  });

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* приватный режим или переполнение — просто не сохраняем */
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update];
}
