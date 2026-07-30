const plans = window.plans || [
  {
    code: "free",
    name: "Free",
    price: "0",
    period: "₽",
    desc: "Познакомьтесь с платформой",
    features: [
      "До 20 диалогов в месяц",
      "Все каналы связи: VK, Telegram, MAX",
      "AI-ответы 24/7",
      "База знаний о компании",
      "Сбор заявок и история переписки",
    ],
    btn: "Начать бесплатно",
    primary: false,
    popular: false,
  },
  {
    code: "start",
    name: "Start",
    price: "990",
    period: "₽/мес",
    desc: "Для небольших команд",
    features: [
      "До 100 диалогов в месяц",
      "1 роль AI (менеджер/консультант)",
      "VK, Telegram, WhatsApp, чат сайта",
      "Уведомления о новых лидах",
      "FAQ и сценарии быстрых ответов",
    ],
    btn: "Подключить Start",
    primary: false,
    popular: false,
  },
  {
    code: "business",
    name: "Business",
    price: "2 990",
    period: "₽/мес",
    desc: "Оптимальный тариф для роста",
    features: [
      "До 500 диалогов в месяц",
      "До 5 ролей AI (менеджер, консультант, админ и т.д.)",
      "Аналитика диалогов и воронка продаж",
      "Запись на консультации и подтверждения",
      "Ежедневные сводки и отчёты",
      "Полноценная CRM в кабинете",
    ],
    btn: "Подключить Business",
    primary: true,
    popular: true,
  },
  {
    code: "premium",
    name: "Premium",
    price: "7 990",
    period: "₽/мес",
    desc: "Для агентств и большого потока",
    features: [
      "Безлимитные диалоги во всех каналах",
      "REST API и готовые интеграции",
      "White Label и брендинг",
      "Приоритетная поддержка 24/7",
      "Персональные роли AI под ваш бизнес",
    ],
    btn: "Подключить Premium",
    primary: false,
    popular: false,
  },
];

window.plans = plans;

const heroPerks = window.heroPerks || [
  { title: "Отвечает за 30 секунд", sub: "24/7 без выходных и перерывов" },
  { title: "от 990 ₽ в месяц", sub: "вместо зарплаты менеджера" },
  { title: "Ассистент под ваш бизнес", sub: "быстрые ответы на основе ваших данных" },
  { title: "Интеграция без кода", sub: "VK, Telegram, WhatsApp, MAX, сайт — за 15 минут" },
];

window.heroPerks = heroPerks;

const features = window.features || [
  { icon: "chat", title: "Обрабатывать сотни диалогов", desc: "ИИ параллельно ведёт переписку во всех подключённых каналах — без очередей и ожидания." },
  { icon: "plug", title: "Работать в VK, Telegram, WhatsApp, MAX", desc: "Мессенджеры, виджет на сайте и API — клиент пишет где удобно, ответ один в едином окне." },
  { icon: "users", title: "Встроенная CRM", desc: "Карточки клиентов, статусы, телефоны и история переписки — без внешних таблиц и сервисов." },
  { icon: "brain", title: "Знать ваш бизнес", desc: "Услуги, цены и документы — ИИ отвечает так же компетентно, как лучший менеджер по продажам." },
  { icon: "calendar", title: "Записывать на консультации", desc: "Уточняет удобное время, контактный телефон и автоматически подтверждает встречу клиенту." },
  { icon: "inbox", title: "Собирать заявки 24/7", desc: "Формирует структурированную заявку с полным контекстом диалога и отправляет в любой канал." },
  { icon: "bolt", title: "Отвечать мгновенно", desc: "Ночью, в выходные и в пиковые часы — лиды не остывают и не уходят к конкурентам." },
  { icon: "role", title: "Разные роли ИИ в воронке", desc: "Менеджер, консультант или администратор — отдельная роль на каждом этапе воронки." },
  { icon: "chart", title: "Аналитика в реальном времени", desc: "Диалоги, конверсия, заявки и эффективность каналов — полная картина бизнеса." },
];

window.features = features;

const integrations = window.integrations || [
  {
    title: "VK · Telegram · WhatsApp · MAX",
    desc: "Подключите все популярные мессенджеры из кабинета. Все входящие — в одной ленте, ИИ отвечает от имени бизнеса.",
  },
  {
    title: "Чат на сайте · Email · Авито",
    desc: "Виджет чата на сайт, электронная почта, Авито и маркетплейсы — ведите клиента в привычном ему канале.",
  },
  {
    title: "AI-автоматизация и интеграции",
    desc: "Нейросети для умных ответов. Настройте тон, стиль и правила — ИИ говорит на языке вашего бренда.",
  },
  {
    title: "CRM Virexo и внешние API",
    desc: "Карточки клиентов, заявки и статусы — всё в одном месте, либо подключайте вашу CRM по REST API.",
  },
];

window.integrations = integrations;

const products = window.products || [
  {
    id: "sales",
    label: "ИИ-менеджер по продажам",
    desc: "Квалифицирует лидов, отвечает на вопросы по услугам и ценам, доводит диалог до оформления заявки.",
  },
  {
    id: "consult",
    label: "ИИ-консультант",
    desc: "Консультирует по услугам, ценам и условиям из базы знаний. Спокойный экспертный тон без галлюцинаций.",
  },
  {
    id: "admin",
    label: "ИИ-администратор",
    desc: "Записывает на услуги, собирает контакты и подтверждает бронирование — без участия живого администратора.",
  },
  {
    id: "support",
    label: "ИИ-поддержка",
    desc: "Отвечает на типовые вопросы по заказам, доставке и оплате — 86% обращений решает без оператора.",
  },
];

window.products = products;

const benefits = window.benefits || [
  {
    icon: "bolt",
    title: "Ответ за 30 секунд",
    desc: "AI ведёт диалоги круглосуточно — клиенты не ждут и не уходят к конкурентам, даже в 3 часа ночи.",
  },
  {
    icon: "plug",
    title: "Подключение без программистов",
    desc: "VK, Telegram, WhatsApp, MAX, сайт и CRM — из кабинета за 15 минут, без разработчиков и кода.",
  },
  {
    icon: "brain",
    title: "Ассистент под ваш бизнес",
    desc: "Умные ответы на основе вашей базы знаний — услуги, цены, FAQ, прайсы и документы компании.",
  },
  {
    icon: "shield",
    title: "Защита базы клиентов",
    desc: "Храните контакты и переписки в Virexo. Увольнение сотрудника больше не грозит потерей клиентов.",
  },
];

window.benefits = benefits;

const channelLogos = window.channelLogos || [
  { name: "ВКонтакте", src: "/images/integrations/vk.svg" },
  { name: "Telegram", src: "/images/integrations/telegram.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "MAX Messenger", src: "/images/integrations/max.svg" },
  { name: "HeadHunter", src: "/images/integrations/hh.svg" },
  { name: "Авито", src: "/images/integrations/avito.jpg" },
  { name: "Odnoklassniki", src: "/images/integrations/ok.svg" },
  { name: "Wildberries", src: "/images/integrations/wildberries.svg" },
  { name: "Яндекс Маркет", src: "/images/integrations/yandex-market.svg" },
  { name: "RetailCRM", src: "/images/integrations/retailcrm.svg" },
  { name: "Calltouch", src: "/images/integrations/calltouch.svg" },
  { name: "Alfa CRM", src: "/images/integrations/alfa-crm.svg" },
];

window.channelLogos = channelLogos;

const heroChannelIcons = window.heroChannelIcons || [
  { name: "ВКонтакте", src: "/images/integrations/vk.svg" },
  { name: "Telegram", src: "/images/integrations/telegram.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "MAX", src: "/images/integrations/max.svg" },
  { name: "Сайт чат", imgType: "site" },
  { name: "Email", imgType: "email" },
];

window.heroChannelIcons = heroChannelIcons;

const audiences = window.audiences || [
  { id: "service", name: "Сфера услуг", icon: "/images/audience/service.png", desc: "Красота, медицина, образование, юридические и бухгалтерские услуги" },
  { id: "business", name: "Интернет-магазины", icon: "/images/audience/business.png", desc: "Товары любых категорий, доставка и маркетплейсы" },
  { id: "studio", name: "Студии и агентства", icon: "/images/audience/studio.png", desc: "Дизайн, реклама, веб-студии и маркетинговые агентства" },
];

window.audiences = audiences;

const stats = window.stats || [
  { value: "200", suffix: "тыс+", label: "компаний уже подключено" },
  { value: "14", suffix: "млн+", label: "диалогов обработано" },
  { value: "86", suffix: "%", label: "обращений ИИ решает сам" },
  { value: "15", suffix: "мин", label: "среднее время подключения" },
];

window.stats = stats;

const testimonials = window.testimonials || [
  {
    text: "С внедрением чат-бота и автоматизации Virexo количество лидов выросло на 70%, а конверсии в сделки увеличились на 15%. Теперь мы не пропускаем ни одного сообщения даже в нерабочее время.",
    name: "Ольга Волкова",
    role: "Начальник управления по клиентскому обслуживанию",
    company: "«Ренессанс Жизнь»",
    initials: "ОВ"
  },
  {
    text: "Подключение соцсетей в Virexo позволило уже в первый месяц увеличить продажи на 32%. При этом доступ к аккаунтам надежно защищён: операторы отвечают на сообщения из приложения, а пароли знают только ответственные лица.",
    name: "Дмитрий Ковалёв",
    role: "Руководитель отдела интернет-маркетинга",
    company: "«Авилон»",
    initials: "ДК"
  },
  {
    text: "С подключением Virexo наша служба поддержки стала обрабатывать в 2 раза больше обращений: консультируя по телефону, оператор обслуживает лишь одного пользователя — а автоматизация работает одновременно со всеми.",
    name: "Анна Морозова",
    role: "Директор по операциям",
    company: "Торгово-производственная компания «Пеплос»",
    initials: "АМ"
  },
];

window.testimonials = testimonials;

const channels = window.channels || [
  {
    id: "vk",
    title: "ВКонтакте",
    desc: "Отвечайте на сообщения и комментарии из ВКонтакте прямо в едином окне Virexo. Голосовые, фото, документы — всё в переписке.",
    features: [
      "Ответы на сообщения и комментарии",
      "Голосовые сообщения и текст",
      "История переписки с каждым клиентом",
      "Маршрутизация диалогов по менеджерам",
      "ИИ-ответы 24/7 даже в нерабочее время",
    ],
    accentColor: "#0077ff",
  },
  {
    id: "telegram",
    title: "Telegram",
    desc: "Оставайтесь на связи с клиентами в самом популярном мессенджере. Надёжно храните переписку, а не на устройствах сотрудников.",
    features: [
      "Личные сообщения и каналы",
      "Защита данных и клиентской базы",
      "Эффективная маршрутизация диалогов",
      "Уведомления в реальном времени",
      "Шаблоны ответов и быстрые кнопки",
    ],
    accentColor: "#229ed9",
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    desc: "Получите единый аккаунт для всей команды и обрабатывайте сообщения WhatsApp Business API в едином интерфейсе.",
    features: [
      "Официальный WhatsApp Business API",
      "Массовые рассылки без риска блокировок",
      "Единый аккаунт для всей команды",
      "Шаблоны сообщений и кнопки",
      "Статистика доставки и прочтения",
    ],
    accentColor: "#25d366",
  },
  {
    id: "site",
    title: "Чат на сайте",
    desc: "Превращайте посетителей в клиентов с помощью онлайн-чата. Приглашайте в диалог и отвечайте на вопросы, пока они на сайте.",
    features: [
      "Адаптивный виджет на любой сайт",
      "Умные приглашения в диалог",
      "Сбор контактов посетителей",
      "Оффлайн-сообщения с email-уведомлением",
      "ИИ-ассистент, отвечающий пока вы не в сети",
    ],
    accentColor: "#8b5cf6",
  },
  {
    id: "email",
    title: "Электронная почта",
    desc: "Не теряйте ни одного письма. Операторы обрабатывают письма в едином окне вместе с запросами из остальных каналов.",
    features: [
      "Поддержка любых почтовых сервисов",
      "Автораспределение входящих",
      "Теги, папки и фильтры",
      "Отслеживание статуса письма",
      "Шаблоны ответов для всей команды",
    ],
    accentColor: "#f59e0b",
  },
  {
    id: "max",
    title: "MAX, ОК, Авито и другие",
    desc: "Поддержка российских мессенджеров и маркетплейсов. Подключайте то, что нужно вашему бизнесу — REST API для любых своих решений.",
    features: [
      "MAX Messenger и Одноклассники",
      "Авито и маркетплейсы",
      "REST API и Webhooks",
      "Готовые SDK для мобильных",
      "Интеграции с 50+ CRM и сервисами",
    ],
    accentColor: "#06b6d4",
  },
];

window.channels = channels;

const roadmap = window.roadmap || [
  { title: "Готово", desc: "Центр диалогов, VK, Telegram, ИИ-ассистент, базовая CRM", date: "Сейчас", done: true },
  { title: "Q1", desc: "WhatsApp Business API, MAX Messenger, Email и чат сайта", date: "Сейчас", done: true },
  { title: "Q2", desc: "Автоматическая маршрутизация и конструктор сценариев диалогов", date: "В разработке", done: false },
  { title: "Q3", desc: "Полноценный CRM-модуль с воронкой продаж и воронкой лидов", date: "В планах", done: false },
  { title: "Q4", desc: "Расширенная аналитика, кастомные дашборды и интеграции с внешними сервисами", date: "Планируем", done: false },
];

window.roadmap = roadmap;

const leftNodes = window.leftNodes || [];
const rightNodes = window.rightNodes || [];
