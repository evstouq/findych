const enc = encodeURIComponent;

/** Группы площадок в том порядке, в котором они показываются в результатах. */
export const GROUPS = [
  { id: "market", title: "Маркетплейсы", short: "Маркетплейсы" },
  { id: "tech", title: "Техника и электроника", short: "Техника" },
  { id: "used", title: "Б/у и объявления", short: "Б/у" },
  { id: "web", title: "Весь интернет", short: "Интернет" },
];

/**
 * Площадки. `url(q, cheap)` строит ссылку на поиск;
 * `cheap: true` — площадка умеет сортировать по возрастанию цены.
 */
export const SOURCES = [
  { id: "wb", group: "market", name: "Wildberries", mark: "WB", color: "#cb11ab", note: "Маркетплейс", cheap: true,
    url: (q, c) => `https://www.wildberries.ru/catalog/0/search.aspx?search=${enc(q)}${c ? "&sort=priceup" : ""}` },
  { id: "oz", group: "market", name: "Ozon", mark: "O", color: "#005bff", note: "Маркетплейс", cheap: true,
    url: (q, c) => `https://www.ozon.ru/search/?text=${enc(q)}${c ? "&sorting=price" : ""}` },
  { id: "ym", group: "market", name: "Яндекс Маркет", mark: "Я", color: "#f5b800", note: "Маркетплейс", cheap: true,
    url: (q, c) => `https://market.yandex.ru/search?text=${enc(q)}${c ? "&how=aprice" : ""}` },
  { id: "mm", group: "market", name: "Мегамаркет", mark: "М", color: "#8654cc", note: "Маркетплейс",
    url: (q) => `https://megamarket.ru/catalog/?q=${enc(q)}` },
  { id: "ali", group: "market", name: "AliExpress", mark: "Ali", color: "#e43225", note: "Товары из Китая",
    url: (q) => `https://aliexpress.ru/wholesale?SearchText=${enc(q)}` },
  { id: "lamoda", group: "market", name: "Lamoda", mark: "L", color: "#9a9a9a", note: "Одежда и обувь",
    url: (q) => `https://www.lamoda.ru/catalogsearch/result/?q=${enc(q)}` },

  { id: "dns", group: "tech", name: "DNS", mark: "D", color: "#fc8507", note: "Техника и электроника",
    url: (q) => `https://www.dns-shop.ru/search/?q=${enc(q)}` },
  { id: "ct", group: "tech", name: "Ситилинк", mark: "С", color: "#22a2e3", note: "Техника и электроника",
    url: (q) => `https://www.citilink.ru/search/?text=${enc(q)}` },
  { id: "mv", group: "tech", name: "М.Видео", mark: "М.", color: "#e5001c", note: "Техника и электроника",
    url: (q) => `https://www.mvideo.ru/product-list-page?q=${enc(q)}` },
  { id: "eld", group: "tech", name: "Эльдорадо", mark: "Э", color: "#4fb846", note: "Техника и электроника",
    url: (q) => `https://www.eldorado.ru/search/catalog.php?q=${enc(q)}` },

  { id: "av", group: "used", name: "Авито", mark: "A", color: "#00aaff", note: "Новое и б/у", cheap: true,
    url: (q, c) => `https://www.avito.ru/all?q=${enc(q)}${c ? "&s=1" : ""}` },

  { id: "google", group: "web", name: "Google", mark: "G", color: "#4285f4", note: "Обзоры и другие магазины",
    url: (q) => `https://www.google.com/search?q=${enc(q + " купить")}` },
  { id: "yandex", group: "web", name: "Яндекс", mark: "Я", color: "#fc3f1d", note: "Поиск по всем магазинам",
    url: (q) => `https://yandex.ru/search/?text=${enc(q + " купить")}` },
  { id: "reviews", group: "web", name: "Отзывы", mark: "★", color: "#d4b270", note: "Отзывы и обзоры на YouTube",
    url: (q) => `https://www.youtube.com/results?search_query=${enc(q + " обзор")}` },
];

export const DEFAULT_ENABLED = SOURCES.map((s) => s.id);

export const IDEAS = ["Logitech G102", "1stplayer ngdp 850w", "AirPods Pro 2", "Робот-пылесос Dreame", "Кроссовки New Balance 574"];

export const normalizeQuery = (value) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
