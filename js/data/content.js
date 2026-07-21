const plans = window.plans || [
  {
    name: "Free",
    price: "0",
    period: "",
    desc: "Познакомьтесь с платформой",
    features: [
      "До 20 диалогов в месяц",
      "VK-бот и AI-ответы",
      "База знаний о компании",
      "Сбор заявок",
      "История переписки",
    ],
    btn: "Начать бесплатно",
    primary: false,
    popular: false,
  },
  {
    name: "Start",
    price: "990",
    period: "₽/мес",
    desc: "Для небольших команд",
    features: [
      "До 100 диалогов",
      "1 роль AI",
      "Сбор заявок из VK",
      "Уведомления о лидах",
      "FAQ и сценарии",
    ],
    btn: "Подключить Start",
    primary: false,
    popular: false,
  },
  {
    name: "Business",
    price: "2 990",
    period: "₽/мес",
    desc: "Оптимальный для роста",
    features: [
      "До 500 диалогов",
      "До 5 ролей AI",
      "Аналитика и воронка",
      "Запись на консультации",
      "Ежедневные сводки",
      "CRM в кабинете",
    ],
    btn: "Подключить Business",
    primary: true,
    popular: true,
  },
  {
    name: "Premium",
    price: "7 990",
    period: "₽/мес",
    desc: "Для агентств и потока",
    features: [
      "Безлимитные диалоги",
      "API и интеграции",
      "White Label",
      "Приоритетная поддержка",
      "Персональные роли",
    ],
    btn: "Подключить Premium",
    primary: false,
    popular: false,
  },
];

window.plans = plans;

const heroPerks = window.heroPerks || [
  { title: "Отвечает за 30 секунд", sub: "24/7 без выходных" },
  { title: "от 990 ₽ в месяц", sub: "вместо зарплаты менеджера" },
  { title: "Работает на GigaChat", sub: "умные ответы из коробки" },
  { title: "Интеграция без кода", sub: "VK, Telegram, MAX, сайт — за 15 минут" },
];

window.heroPerks = heroPerks;

const features = window.features || [
  { icon: "chat", title: "Обрабатывать сотни диалогов", desc: "Параллельно ведёт переписку во всех подключённых каналах — без очереди." },
  { icon: "plug", title: "Работать в VK, TG и MAX", desc: "Мессенджеры, виджет на сайте и API — клиент пишет где удобно, ответ один." },
  { icon: "users", title: "CRM внутри платформы", desc: "Клиенты, статусы, телефоны и история — без внешних таблиц." },
  { icon: "brain", title: "Знать ваш бизнес", desc: "Услуги, цены и документы — AI отвечает как лучший менеджер." },
  { icon: "calendar", title: "Записывать на консультации", desc: "Уточняет время, телефон и подтверждает встречу клиенту." },
  { icon: "inbox", title: "Собирать заявки", desc: "Формирует структурированную заявку с полным контекстом диалога." },
  { icon: "bolt", title: "Отвечать мгновенно", desc: "Ночью, в выходные и в пик — лиды не остывают." },
  { icon: "role", title: "Разные роли в воронке", desc: "Менеджер, консультант или администратор — на каждом этапе." },
  { icon: "chart", title: "Аналитика в реальном времени", desc: "Диалоги, конверсия, заявки и активность каналов." },
];

window.features = features;

const integrations = window.integrations || [
  {
    title: "VK · Telegram · MAX",
    desc: "Подключите мессенджеры из кабинета. Все входящие — в одной ленте, AI отвечает от имени бизнеса.",
  },
  {
    title: "Сайт и API",
    desc: "Виджет на сайт, webhook и REST API — ведите переписку внутри любой системы.",
  },
  {
    title: "GigaChat",
    desc: "Нейросеть для умных ответов. Настройте тон, стиль и правила — AI говорит вашим языком.",
  },
  {
    title: "CRM BizFlow",
    desc: "Карточки клиентов, заявки и статусы — всё в одном месте, без программиста.",
  },
];

window.integrations = integrations;

const products = window.products || [
  {
    id: "sales",
    label: "ИИ-менеджер",
    desc: "Квалифицирует лидов, отвечает на вопросы и доводит диалог до заявки. Не теряется на неожиданных вопросах.",
  },
  {
    id: "consult",
    label: "ИИ-консультант",
    desc: "Консультирует по услугам, ценам и условиям из базы знаний. Спокойный экспертный тон.",
  },
  {
    id: "admin",
    label: "ИИ-администратор",
    desc: "Записывает на услуги, собирает контакты и подтверждает бронь — без участия живого администратора.",
  },
];

window.products = products;

const benefits = window.benefits || [
  {
    icon: "bolt",
    title: "Ответ за 30 секунд",
    desc: "AI ведёт диалоги круглосуточно — клиенты не ждут и не уходят к конкурентам.",
  },
  {
    icon: "plug",
    title: "Подключение без кода",
    desc: "VK, Telegram, MAX, сайт и CRM — из кабинета за 15 минут, без программиста.",
  },
  {
    icon: "brain",
    title: "GigaChat из коробки",
    desc: "Умные ответы на основе вашей базы знаний — услуги, цены, FAQ и документы.",
  },
];

window.benefits = benefits;

const channelLogos = window.channelLogos || [
  { name: "VK", src: "https://upload.wikimedia.org/wikipedia/commons/f/f3/VK_Compact_Logo_%282021-present%29.svg" },
  { name: "Telegram", src: "https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg" },
  { name: "HeadHunter", src: "https://papik.pro/uploads/posts/2022-01/1643610822_1-papik-pro-p-hh-logotip-1.png" },
  { name: "Avito", src: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Main_red_02.jpg" },
  { name: "Jivo", src: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Jivo-logo.png" },
  { name: "OK", src: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Odnoklassniki.svg" },
  { name: "Wildberries", src: "https://png.klev.club/uploads/posts/2024-04/png-klev-club-b6iu-p-logotip-vaildberriz-png-6.png" },
  { name: "RetailCRM", src: "https://s3-s1.retailcrm.tech/eu-central-1/retailcrm-static/branding/retailcrm/logo/logo_icon_core.svg" },
  { name: "Яндекс Маркет", src: "https://logo-teka.com/wp-content/uploads/2025/06/yandex-market-sign-logo.svg" },
  { name: "MAX", src: "https://upload.wikimedia.org/wikipedia/commons/7/75/Max_logo_2025.png" },
  { name: "Calltouch", src: "https://www.calltouch.ru/upload/iblock/908/908168b40d4a17ff55c2fee7e3001439.png" },
  { name: "Alfa CRM", src: "https://crmindex.ru/uploads/catalog/alfa_crm_67b87662887cf.png" },
];

window.channelLogos = channelLogos;

const heroChannelIcons = window.heroChannelIcons || [
  { name: "VK", src: "https://upload.wikimedia.org/wikipedia/commons/f/f3/VK_Compact_Logo_%282021-present%29.svg" },
  { name: "Telegram", src: "https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg" },
  { name: "MAX", src: "https://upload.wikimedia.org/wikipedia/commons/7/75/Max_logo_2025.png" },
];

window.heroChannelIcons = heroChannelIcons;

const audiences = window.audiences || [];

const leftNodes = window.leftNodes || [];
const rightNodes = window.rightNodes || [];
