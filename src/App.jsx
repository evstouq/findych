import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { DEFAULT_ENABLED, IDEAS, SOURCES, normalizeQuery } from "./data/sources.js";
import { useStoredState } from "./hooks/useStoredState.js";
import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Results from "./components/Results.jsx";
import Welcome from "./components/Welcome.jsx";
import History from "./components/History.jsx";
import SourcesDialog from "./components/SourcesDialog.jsx";
import Toast from "./components/Toast.jsx";

const KNOWN_IDS = new Set(SOURCES.map((s) => s.id));
const asList = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
const sameText = (a, b) => a.toLowerCase() === b.toLowerCase();
const queryFromUrl = () => normalizeQuery(new URLSearchParams(window.location.search).get("q"));
const BASE_TITLE = "FINDыч — поиск по всем магазинам сразу";

export default function App() {
  const inputRef = useRef(null);
  const toastTimer = useRef(0);

  const [submitted, setSubmitted] = useState(queryFromUrl);
  const [query, setQuery] = useState(submitted);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Ключи совместимы с прежней версией сайта — история пользователей сохраняется
  const [cheapFirst, setCheapFirst] = useStoredState("find-cheap-first", false, Boolean);
  const [recent, setRecent] = useStoredState("price-watch-search-recent", [], asList);
  const [favorites, setFavorites] = useStoredState("findych-favorites", [], asList);
  const [enabled, setEnabled] = useStoredState("findych-sources", DEFAULT_ENABLED, (v) =>
    Array.isArray(v) ? v.filter((id) => KNOWN_IDS.has(id)) : DEFAULT_ENABLED
  );

  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const sources = useMemo(() => {
    const on = new Set(enabled);
    return SOURCES.filter((s) => on.has(s.id)).map((s) => ({ ...s, href: s.url(submitted, cheapFirst) }));
  }, [enabled, submitted, cheapFirst]);

  const isFavorite = !!submitted && favorites.some((f) => sameText(f, submitted));

  // --- Навигация: запрос хранится в адресе (?q=), работает «назад» и ссылки
  const setUrl = (q) => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
  };

  useEffect(() => {
    const onPop = () => {
      const q = queryFromUrl();
      setSubmitted(q);
      setQuery(q);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.title = submitted ? `«${submitted}» — FINDыч` : BASE_TITLE;
  }, [submitted]);

  // «/» — быстрый переход к поиску
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || /^(INPUT|TEXTAREA)$/.test(e.target.tagName) || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- Действия
  const runSearch = (value) => {
    const v = normalizeQuery(value);
    if (!v) { inputRef.current?.focus(); return; }
    setQuery(v);
    setSubmitted(v);
    setUrl(v);
    setRecent((prev) => [v, ...prev.filter((x) => !sameText(x, v))].slice(0, 8));
    inputRef.current?.blur();
  };

  const goHome = () => {
    setQuery("");
    setSubmitted("");
    setUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearInput = () => {
    goHome();
    inputRef.current?.focus();
  };

  const toggleFavorite = () => {
    if (!submitted) return;
    if (isFavorite) {
      setFavorites((prev) => prev.filter((f) => !sameText(f, submitted)));
      notify("Убрано из избранного");
    } else {
      setFavorites((prev) => [submitted, ...prev].slice(0, 12));
      notify("Добавлено в избранное");
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `«${submitted}» — FINDыч`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      notify("Ссылка на поиск скопирована");
    } catch (err) {
      if (err?.name !== "AbortError") notify("Не удалось скопировать ссылку");
    }
  };

  const openAll = (list) => {
    let blocked = 0;
    list.forEach((s) => {
      const w = window.open(s.href, "_blank");
      if (w) w.opener = null;
      else blocked += 1;
    });
    if (blocked > 0) notify("Если открылась не вся подборка — разрешите всплывающие окна для сайта");
  };

  const editQuery = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    inputRef.current?.focus({ preventScroll: true });
    inputRef.current?.select();
  };

  return (
    <>
      <Background />
      <div className="app">
        <Header
          enabledCount={enabled.length}
          totalCount={SOURCES.length}
          onOpenSettings={() => setSettingsOpen(true)}
          onHome={goHome}
        />

        <main id="main">
          <section className={submitted ? "hero compact" : "hero"}>
            {!submitted && (
              <>
                <div className="hero-kicker"><span className="hero-dot" />ПОИСКОВИК ПО ПОПУЛЯРНЫМ ПЛОЩАДКАМ</div>
                <h1>Найди нужное.<br /><i>Сравни спокойно.</i></h1>
                <p className="hero-lead">Напиши, что хочешь купить, и открой поиск сразу на маркетплейсах, в магазинах техники, на Авито и в поисковиках.</p>
              </>
            )}

            <SearchBar
              ref={inputRef}
              value={query}
              onChange={setQuery}
              onSubmit={runSearch}
              onClear={clearInput}
              recent={recent}
              favorites={favorites}
            />

            <div className="hero-options">
              <button type="button" className={cheapFirst ? "cheap-toggle on" : "cheap-toggle"} onClick={() => setCheapFirst((v) => !v)} aria-pressed={cheapFirst}>
                <ArrowUpDown size={13} />Сначала дешёвые<span className="switch"><span /></span>
              </button>
            </div>

            {!submitted && (
              <div className="ideas">
                <span>НАПРИМЕР:</span>
                {IDEAS.map((idea) => <button type="button" key={idea} onClick={() => runSearch(idea)}>{idea}</button>)}
              </div>
            )}
          </section>

          {submitted ? (
            <Results
              key={submitted}
              query={submitted}
              sources={sources}
              cheapFirst={cheapFirst}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onShare={share}
              onOpenAll={openAll}
              onEdit={editQuery}
            />
          ) : (
            <Welcome />
          )}

          <History
            recent={recent}
            favorites={favorites}
            onPick={(q) => { runSearch(q); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            onRemoveRecent={(q) => setRecent((prev) => prev.filter((x) => x !== q))}
            onRemoveFavorite={(q) => setFavorites((prev) => prev.filter((x) => x !== q))}
            onClearRecent={() => setRecent([])}
          />
        </main>

        <footer className="footer">
          <span className="footer-brand">FIND<span>ыч</span></span>
          <span>Не связан с площадками. Поиск открывается на их сайтах.</span>
        </footer>
      </div>

      <SourcesDialog open={settingsOpen} enabled={enabled} onChange={setEnabled} onClose={() => setSettingsOpen(false)} />
      <Toast message={toast} />
    </>
  );
}
