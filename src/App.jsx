import { useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpDown, ExternalLink, Search, Sparkles, X } from "lucide-react";
import "./style.css";

const SOURCES = [
  { id: "wb", group: "market", name: "Wildberries", mark: "WB", note: "Маркетплейс", url: (q, cheap) => `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(q)}${cheap ? "&sort=priceup" : ""}` },
  { id: "oz", group: "market", name: "Ozon", mark: "O", note: "Маркетплейс", url: (q, cheap) => `https://www.ozon.ru/search/?text=${encodeURIComponent(q)}${cheap ? "&sorting=price" : ""}` },
  { id: "ym", group: "market", name: "Яндекс Маркет", mark: "Я", note: "Маркетплейс", url: (q, cheap) => `https://market.yandex.ru/search?text=${encodeURIComponent(q)}${cheap ? "&how=aprice" : ""}` },
  { id: "mm", group: "market", name: "Мегамаркет", mark: "М", note: "Маркетплейс", url: (q) => `https://megamarket.ru/catalog/?q=${encodeURIComponent(q)}` },
  { id: "dns", group: "shop", name: "DNS", mark: "D", note: "Техника и электроника", url: (q) => `https://www.dns-shop.ru/search/?q=${encodeURIComponent(q)}` },
  { id: "ct", group: "shop", name: "Ситилинк", mark: "С", note: "Техника и электроника", url: (q) => `https://www.citilink.ru/search/?text=${encodeURIComponent(q)}` },
  { id: "av", group: "used", name: "Авито", mark: "A", note: "Новое и б/у", url: (q, cheap) => `https://www.avito.ru/all?q=${encodeURIComponent(q)}${cheap ? "&s=1" : ""}` },
  { id: "google", group: "web", name: "Google", mark: "G", note: "Обзоры и другие магазины", url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q + " купить")}` },
];
const GROUPS = [
  { id: "market", title: "Маркетплейсы" },
  { id: "shop", title: "Магазины техники" },
  { id: "used", title: "Б/у" },
  { id: "web", title: "Весь интернет" },
];
const IDEAS = ["Logitech G102", "1stplayer ngdp 850w", "AirPods Pro 2", "Робот-пылесос Dreame"];

export default function App() {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [cheapFirst, setCheapFirst] = useState(() => localStorage.getItem("find-cheap-first") === "1");
  const [recent, setRecent] = useState(() => { try { return JSON.parse(localStorage.getItem("price-watch-search-recent")) || []; } catch { return []; } });
  
  const links = useMemo(() => SOURCES.map(s => ({ ...s, href: s.url(submitted, cheapFirst) })), [submitted, cheapFirst]);

  const runSearch = (value = query) => {
    const v = String(value).replace(/\s+/g, " ").trim();
    if (!v) { inputRef.current?.focus(); return; }
    setQuery(v);
    setSubmitted(v);
    const next = [v, ...recent.filter(x => x.toLowerCase() !== v.toLowerCase())].slice(0, 6);
    setRecent(next);
    try { localStorage.setItem("price-watch-search-recent", JSON.stringify(next)); } catch {}
  };

  const toggleCheap = () => { 
    const n = !cheapFirst; 
    setCheapFirst(n); 
    try { localStorage.setItem("find-cheap-first", n ? "1" : "0"); } catch {} 
  };
  
  const clearRecent = () => { 
    setRecent([]); 
    try { localStorage.removeItem("price-watch-search-recent"); } catch {} 
  };

  return <main className="search-app">
    <header className="search-topbar">
      <a className="search-brand" href="#home">
        <span className="search-brand-icon"><Search size={19}/></span>
        <span>FIND<span>ыч</span><small>ПОИСК ПО МАГАЗИНАМ</small></span>
      </a>
      <span className="topbar-note"><Sparkles size={14}/>Один запрос, {SOURCES.length} площадок</span>
    </header>
    
    <section className="search-hero" id="home">
      <div className="hero-kicker"><span className="hero-kicker-dot"/>ПОИСКОВИК ПО ПОПУЛЯРНЫМ ПЛОЩАДКАМ</div>
      <h1>Найди нужное.<br/><i>Сравни спокойно.</i></h1>
      <p>Напиши, что хочешь купить, и открой поиск сразу на маркетплейсах, в магазинах техники и на Авито.</p>
      
      <div className="all-search-form" role="search">
        <Search size={20}/>
        <input 
          ref={inputRef} 
          autoFocus 
          value={query} 
          onChange={e=>setQuery(e.target.value)} 
          onKeyDown={e=>{ if (e.key === "Enter") { e.preventDefault(); runSearch(); } }} 
          placeholder="Например, мышь logitech g102" 
          aria-label="Что ищем?" 
          enterKeyHint="search"
        />
        {query && <button type="button" className="clear-btn" onClick={()=>{setQuery(""); setSubmitted(""); inputRef.current?.focus();}} aria-label="Очистить"><X size={15}/></button>}
        <button type="button" className="find-btn" onClick={()=>runSearch()}>Найти <ArrowRight size={16}/></button>
      </div>
      
      <div className="search-options">
        <button type="button" className={cheapFirst ? "cheap-toggle on" : "cheap-toggle"} onClick={toggleCheap} aria-pressed={cheapFirst}>
          <ArrowUpDown size={13}/>Сначала дешёвые<span className="switch"><span/></span>
        </button>
      </div>
      
      <div className="suggestions">
        <span>НАПРИМЕР:</span>
        {IDEAS.map(idea=><button type="button" key={idea} onClick={()=>runSearch(idea)}>{idea}</button>)}
      </div>
    </section>

    {submitted ? <section className="results-section" aria-live="polite">
      <div className="results-heading">
        <div>
          <span className="section-kicker">ИЩЕМ{cheapFirst ? " · СНАЧАЛА ДЕШЁВЫЕ" : ""}</span>
          <h2>«{submitted}»</h2>
        </div>
        <button type="button" className="change-query" onClick={()=>{inputRef.current?.focus();inputRef.current?.select();window.scrollTo({top:0,behavior:"smooth"});}}>
          Изменить запрос
        </button>
      </div>
      
      {GROUPS.map(g => 
        <div className="source-group" key={g.id}>
          <div className="group-title">{g.title}</div>
          <div className="source-grid">
            {links.filter(l=>l.group===g.id).map(item=>
              <a key={item.id} className="source-card" data-source={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                <span className="source-mark">{item.mark}</span>
                <span className="source-copy"><b>{item.name}</b><small>{item.note}</small></span>
                <ExternalLink size={16}/>
              </a>
            )}
          </div>
        </div>
      )}
      <div className="source-footnote"><span className="footnote-mark">i</span><span>Цены, наличие и доставка показываются на самих площадках. Сортировка «сначала дешёвые» работает на WB, Ozon, Яндекс Маркете и Авито.</span></div>
    </section> : <section className="welcome-section">
      <div className="welcome-art">
        <span className="orbit orbit-one"/>
        <span className="orbit orbit-two"/>
        <span className="gold-dust" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{"--i":i}}/>)}</span>
        <span className="product-card-ghost"><span>ПОИСК</span><b>дёшево</b><small>под боком</small></span>
        <span className="mini-spark">✳</span>
      </div>
      <div className="welcome-copy">
        <span className="section-kicker">КАК ЭТО РАБОТАЕТ</span>
        <h2>Пишешь как обычно.<br/>Мы открываем все площадки.</h2>
        <p>Точная модель не нужна: «logitech g102» или «1stplayer ngdp 850w» вполне хватит. Нажми на площадку, и поиск откроется там с твоим запросом.</p>
      </div>
    </section>}
    
    {recent.length>0 && <section className="recent-searches">
      <div className="recent-head"><span className="section-kicker">НЕДАВНИЕ ЗАПРОСЫ</span><button type="button" onClick={clearRecent}>Очистить</button></div>
      <div className="recent-list">{recent.map(item=><button type="button" key={item} onClick={()=>runSearch(item)}>{item}<ArrowRight size={13}/></button>)}</div>
    </section>}
    
    <footer className="search-footer"><span>FINDыч</span><span>Не связан с площадками. Поиск открывается на их сайтах.</span></footer>
  </main>;
}
