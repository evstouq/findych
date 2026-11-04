import { Keyboard, Layers, Share2 } from "lucide-react";

const FEATURES = [
  { icon: Layers, title: "Все площадки разом", text: "Маркетплейсы, магазины техники, Авито и поисковики — в один клик или кнопкой «Открыть все»." },
  { icon: Share2, title: "Ссылкой на поиск", text: "Адрес страницы содержит запрос — отправьте его другу или сохраните в закладки." },
  { icon: Keyboard, title: "Быстро с клавиатуры", text: "«/» — к поиску, ↑↓ — по истории, цифры 1–9 — открыть площадку." },
];

export default function Welcome() {
  return (
    <section className="welcome">
      <div className="welcome-main">
        <div className="welcome-art" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="gold-dust">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--i": i, "--top": (i * 29) % 72 }} />)}</span>
          <span className="ghost-card"><span>ПОИСК</span><b>дёшево</b><small>под боком</small></span>
          <span className="mini-spark">✳</span>
        </div>
        <div className="welcome-copy">
          <span className="kicker">КАК ЭТО РАБОТАЕТ</span>
          <h2>Пишешь как обычно.<br />Мы открываем все площадки.</h2>
          <p>Точная модель не нужна: «logitech g102» или «1stplayer ngdp 850w» вполне хватит. Нажми на площадку — поиск откроется там с твоим запросом.</p>
        </div>
      </div>
      <ul className="features">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <span className="feature-icon"><Icon size={17} /></span>
            <b>{title}</b>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
