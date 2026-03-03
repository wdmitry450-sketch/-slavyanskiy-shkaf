/* ═══════════════════════════════════════════════════════════
   SLAVIC SHKAF — CENTRAL DATA FILE v2
   ВСЕ настройки меняются ТОЛЬКО здесь или в админке
═══════════════════════════════════════════════════════════ */

// ── Сайт ───────────────────────────────────────────────────
const SITE = {
  name:    'Slavic Shkaf',
  nameRu:  'Славянский шкаф',
  tagline: { ru: 'Проверенные мастера · 22 страны EU', en: 'Verified Masters · 22 EU Countries' },
  logo:    'logo.png',
  tg:      'https://t.me/slavyanskiy_shkaf_bot',
  email:   'support@slavic-shkaf.eu',
};

// ── Настройки (меняются из админки, хранятся в localStorage) ──
const DEFAULTS = {
  freeResponses:    2,      // лимит откликов бесплатно в месяц
  topLimitCity:     10,     // макс мастеров в ТОП города
  topLimitCountry:  20,     // макс мастеров в ТОП страны
  prices: {
    subMonthly:  29,   // €/мес подписка
    subYearly:   249,  // €/год подписка
    topCity:     19,   // €/мес ТОП в городе
    topCountry:  39,   // €/мес ТОП в стране
  },
  currency: '€',
};

// ── i18n ───────────────────────────────────────────────────
const T = {
  ru: {
    login: 'Войти', register: 'Регистрация', logout: 'Выйти',
    email: 'Email', password: 'Пароль', name: 'Имя', surname: 'Фамилия',
    phone: 'Телефон', city: 'Город', country: 'Страна',
    master: 'Мастер', client: 'Заказчик',
    forgotPassword: 'Забыли пароль?', resetPassword: 'Сбросить пароль',
    backToLogin: '← Назад ко входу',
    step: 'Шаг', of: 'из',
    next: 'Далее →', back: '← Назад', submit: 'Создать аккаунт',
    category: 'Категория', categories: 'Категории',
    telegram: 'Telegram (необязательно)',
    companyName: 'Название компании / ИП',
    workType: 'Тип работы',
    solo: 'Работаю один',
    company: 'В компании',
    license: 'Лицензия / Сертификат',
    uploadDoc: 'Загрузить документ',
    uploadPassport: 'Загрузить паспорт',
    verifying: 'На верификации',
    verified: 'Верифицирован',
    dashboard: 'Кабинет',
    orders: 'Заявки', myOrders: 'Мои заявки',
    responses: 'Отклики',
    chat: 'Чат',
    profile: 'Профиль',
    verification: 'Верификация',
    subscription: 'Подписка',
    statistics: 'Статистика',
    top: 'ТОП',
    settings: 'Настройки',
    save: 'Сохранить',
    cancel: 'Отмена',
    send: 'Отправить',
    apply: 'Откликнуться',
    choose: 'Выбрать',
    complete: 'Выполнено',
    review: 'Отзыв',
    noData: 'Нет данных',
    loading: 'Загрузка...',
    or: 'или',
    free: 'Бесплатно',
    monthly: '/мес',
    yearly: '/год',
    savePercent: 'Скидка',
  },
  en: {
    login: 'Sign In', register: 'Sign Up', logout: 'Sign Out',
    email: 'Email', password: 'Password', name: 'First Name', surname: 'Last Name',
    phone: 'Phone', city: 'City', country: 'Country',
    master: 'Master', client: 'Client',
    forgotPassword: 'Forgot password?', resetPassword: 'Reset Password',
    backToLogin: '← Back to Sign In',
    step: 'Step', of: 'of',
    next: 'Next →', back: '← Back', submit: 'Create Account',
    category: 'Category', categories: 'Categories',
    telegram: 'Telegram (optional)',
    companyName: 'Company / Business Name',
    workType: 'Work Type',
    solo: 'Solo worker',
    company: 'In a company',
    license: 'License / Certificate',
    uploadDoc: 'Upload document',
    uploadPassport: 'Upload passport',
    verifying: 'Under review',
    verified: 'Verified',
    dashboard: 'Dashboard',
    orders: 'Orders', myOrders: 'My Orders',
    responses: 'Responses',
    chat: 'Chat',
    profile: 'Profile',
    verification: 'Verification',
    subscription: 'Subscription',
    statistics: 'Statistics',
    top: 'TOP',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    send: 'Send',
    apply: 'Apply',
    choose: 'Choose',
    complete: 'Mark Complete',
    review: 'Review',
    noData: 'No data',
    loading: 'Loading...',
    or: 'or',
    free: 'Free',
    monthly: '/mo',
    yearly: '/yr',
    savePercent: 'Save',
  },
};

// ── Категории ──────────────────────────────────────────────
const SK = [
  { id: 'plumbing',  i: '🔧', ru: 'Сантехника',         en: 'Plumbing',       n: 89 },
  { id: 'electric',  i: '⚡', ru: 'Электрика',          en: 'Electrical',     n: 74 },
  { id: 'paint',     i: '🎨', ru: 'Покраска',           en: 'Painting',       n: 61 },
  { id: 'carpentry', i: '🪟', ru: 'Столярка / Окна',    en: 'Carpentry',      n: 48 },
  { id: 'masonry',   i: '🏗️', ru: 'Кладка / Бетон',     en: 'Masonry',        n: 43 },
  { id: 'ac',        i: '❄️', ru: 'Кондиционер / Вент', en: 'AC / Ventilation',n: 37 },
  { id: 'floor',     i: '🪵', ru: 'Паркет / Полы',      en: 'Flooring',       n: 32 },
  { id: 'bathroom',  i: '🛁', ru: 'Ванная / Плитка',    en: 'Bathroom',       n: 29 },
  { id: 'roof',      i: '🏠', ru: 'Кровля / Фасад',     en: 'Roofing',        n: 26 },
  { id: 'it',        i: '🔌', ru: 'Слаботочка / IT',    en: 'IT / Network',   n: 22 },
  { id: 'locks',     i: '🔑', ru: 'Замки / Двери',      en: 'Locks / Doors',  n: 21 },
  { id: 'garden',    i: '🌱', ru: 'Сад / Ландшафт',     en: 'Garden',         n: 18 },
  { id: 'clean',     i: '🧹', ru: 'Уборка / Клининг',   en: 'Cleaning',       n: 16 },
  { id: 'move',      i: '📦', ru: 'Переезды',           en: 'Moving',         n: 12 },
];

// ── Страны ─────────────────────────────────────────────────
const CO = [
  { f:'🇫🇷',ru:'Франция',    en:'France'      },{ f:'🇩🇪',ru:'Германия',  en:'Germany'     },
  { f:'🇪🇸',ru:'Испания',    en:'Spain'       },{ f:'🇮🇹',ru:'Италия',    en:'Italy'       },
  { f:'🇧🇪',ru:'Бельгия',    en:'Belgium'     },{ f:'🇳🇱',ru:'Нидерланды',en:'Netherlands' },
  { f:'🇵🇱',ru:'Польша',     en:'Poland'      },{ f:'🇦🇹',ru:'Австрия',   en:'Austria'     },
  { f:'🇨🇭',ru:'Швейцария',  en:'Switzerland' },{ f:'🇵🇹',ru:'Португалия',en:'Portugal'    },
  { f:'🇸🇪',ru:'Швеция',     en:'Sweden'      },{ f:'🇳🇴',ru:'Норвегия',  en:'Norway'      },
  { f:'🇩🇰',ru:'Дания',      en:'Denmark'     },{ f:'🇫🇮',ru:'Финляндия', en:'Finland'     },
  { f:'🇨🇿',ru:'Чехия',      en:'Czechia'     },{ f:'🇸🇰',ru:'Словакия',  en:'Slovakia'    },
  { f:'🇭🇺',ru:'Венгрия',    en:'Hungary'     },{ f:'🇷🇴',ru:'Румыния',   en:'Romania'     },
  { f:'🇧🇬',ru:'Болгария',   en:'Bulgaria'    },{ f:'🇭🇷',ru:'Хорватия',  en:'Croatia'     },
  { f:'🇸🇮',ru:'Словения',   en:'Slovenia'    },{ f:'🇬🇷',ru:'Греция',    en:'Greece'      },
];

// ── Мастера (демо) ─────────────────────────────────────────
const MASTERS = [
  { id:1,a:'👷',nm:'Алексей М.',city:'Париж',country:'Франция',
    cats:['plumbing','bathroom'],skills:['Сантехника','Ванная под ключ','Отопление'],
    rate:4.9,reviews:47,price:45,lvl:3,online:true,experience:12,sub:true,topCity:true,topCountry:false,
    about:'Сантехник с 12-летним опытом во Франции и Бельгии. Гарантия 2 года.',
    portfolio:['🚿','🛁','🔧','🏠','⚙️','💧'],
    revList:[
      {author:'Жан-Поль Б.',date:'12 нояб 2024',stars:5,text:'Отличная работа! Приехал вовремя, сделал чисто.'},
      {author:'Моника Р.',  date:'3 окт 2024',  stars:5,text:'Бойлер установил быстро, цена соответствует.'},
    ]},
  { id:2,a:'👨‍🔧',nm:'Этьен Б.',city:'Брюссель',country:'Бельгия',
    cats:['electric','it'],skills:['Электрика','RGE','Умный дом'],
    rate:4.8,reviews:32,price:55,lvl:3,online:true,experience:8,sub:true,topCity:true,topCountry:true,
    about:'Сертифицированный электрик RGE. Умные дома, промышленные объекты.',
    portfolio:['⚡','🔌','💡','🏭','🖥️','🔋'],
    revList:[{author:'Клара М.',date:'5 дек 2024',stars:5,text:'Полная замена проводки. Аккуратно, с документами.'}]},
  { id:3,a:'🧑‍🏭',nm:'Павел К.',city:'Берлин',country:'Германия',
    cats:['paint','floor'],skills:['Покраска','Паркет','Шпаклёвка'],
    rate:4.7,reviews:28,price:38,lvl:2,online:false,experience:9,sub:false,topCity:false,topCountry:false,
    about:'Маляр-отделочник. Работаю в Берлине и пригороде.',
    portfolio:['🎨','🖌️','🏠','🪵','✨','🏗️'],
    revList:[{author:'Хельга Ш.',date:'20 нояб 2024',stars:5,text:'Покрасил квартиру за 3 дня. Доволен!'}]},
  { id:4,a:'👩‍🔧',nm:'Соня Л.',city:'Лион',country:'Франция',
    cats:['masonry','bathroom'],skills:['Кладка','Плитка','Стяжка'],
    rate:5.0,reviews:19,price:42,lvl:2,online:true,experience:7,sub:true,topCity:false,topCountry:false,
    about:'Мастер по плитке и кладке. 7 лет опыта.',
    portfolio:['🏗️','🪨','🏠','🛁','✨','🔨'],
    revList:[{author:'Люсьен Д.',date:'1 янв 2025',stars:5,text:'Ванная с нуля. Превзошло ожидания!'}]},
  { id:5,a:'🧔',nm:'Дмитрий В.',city:'Варшава',country:'Польша',
    cats:['carpentry','floor'],skills:['Столярка','Паркет','Двери'],
    rate:4.6,reviews:22,price:35,lvl:2,online:false,experience:11,sub:false,topCity:false,topCountry:false,
    about:'Столяр. Окна, двери, паркет под ключ.',
    portfolio:['🪵','🚪','🪟','🛋️','🔨','✨'],
    revList:[{author:'Анна К.',date:'15 дек 2024',stars:5,text:'5 дверей установил идеально.'}]},
  { id:6,a:'👱',nm:'Карлос М.',city:'Мадрид',country:'Испания',
    cats:['ac','electric'],skills:['Кондиционер','Вентиляция','Электрика'],
    rate:4.8,reviews:35,price:48,lvl:3,online:true,experience:10,sub:true,topCity:true,topCountry:false,
    about:'Партнёр Daikin и Mitsubishi Electric.',
    portfolio:['❄️','🌬️','⚡','🏢','🏠','🔧'],
    revList:[{author:'Педро Г.',date:'8 дек 2024',stars:5,text:'Климат в офисе. Профессионально.'}]},
  { id:7,a:'👩',nm:'Ирина С.',city:'Вена',country:'Австрия',
    cats:['clean','move'],skills:['Клининг','Химчистка','Переезды'],
    rate:4.9,reviews:64,price:28,lvl:2,online:true,experience:6,sub:true,topCity:false,topCountry:false,
    about:'Клининг квартир, офисов, после ремонта.',
    portfolio:['🧹','✨','🏠','🧺','📦','🚚'],
    revList:[{author:'Вернер Х.',date:'20 янв 2025',stars:5,text:'Уборка после ремонта — отлично.'}]},
  { id:8,a:'🧑',nm:'Томас Б.',city:'Амстердам',country:'Нидерланды',
    cats:['roof','masonry'],skills:['Кровля','Фасад','Гидроизоляция'],
    rate:4.7,reviews:18,price:52,lvl:3,online:false,experience:15,sub:true,topCity:false,topCountry:true,
    about:'Кровельщик с голландской лицензией.',
    portfolio:['🏠','🏗️','🌧️','🔨','✨','⚙️'],
    revList:[{author:'Ян Д.',date:'5 фев 2025',stars:5,text:'Кровля после шторма. Надёжно.'}]},
];

// ── Демо заявки ────────────────────────────────────────────
const DEMO_ORDERS = [
  { id:1,clientId:'c1',clientName:'Мари Д.',city:'Париж',country:'Франция',
    cat:'plumbing',title:'Замена труб в ванной',desc:'Нужно заменить все трубы в ванной комнате, ~15 кв.м',
    budget:800,date:'2025-03-10',status:'open',responses:[1,6],chosenMaster:null,
    createdAt:'2025-03-01' },
  { id:2,clientId:'c1',clientName:'Мари Д.',city:'Лион',country:'Франция',
    cat:'electric',title:'Замена проводки в квартире',desc:'2-комнатная квартира, старая проводка 1970х годов',
    budget:2000,date:'2025-03-15',status:'in_progress',responses:[2],chosenMaster:2,
    createdAt:'2025-02-28' },
  { id:3,clientId:'c2',clientName:'Ганс М.',city:'Берлин',country:'Германия',
    cat:'paint',title:'Покраска 3 комнат',desc:'Стены и потолок, светлые тона, нужны материалы',
    budget:1200,date:'2025-03-20',status:'open',responses:[],chosenMaster:null,
    createdAt:'2025-03-02' },
  { id:4,clientId:'c3',clientName:'Карин Л.',city:'Мадрид',country:'Испания',
    cat:'ac',title:'Установка кондиционера',desc:'3 комнаты, нужен монтаж и подбор оборудования',
    budget:1500,date:'2025-03-12',status:'open',responses:[6],chosenMaster:null,
    createdAt:'2025-03-01' },
  { id:5,clientId:'c4',clientName:'Лука Б.',city:'Рим',country:'Италия',
    cat:'floor',title:'Укладка паркета',desc:'Гостиная 30 кв.м, дуб, материал есть',
    budget:900,date:'2025-03-25',status:'completed',responses:[5],chosenMaster:5,
    createdAt:'2025-02-20' },
];

// ── Демо чаты ──────────────────────────────────────────────
const DEMO_CHATS = [
  { id:'ch1', orderId:2, masterId:2, clientId:'c1',
    messages:[
      {from:'client',text:'Добрый день! Когда сможете приехать на осмотр?',ts:'10:30'},
      {from:'master',text:'Здравствуйте! Могу завтра с 10 до 12.',ts:'10:45'},
      {from:'client',text:'Отлично, завтра в 10 жду.',ts:'11:00'},
      {from:'master',text:'Принято, буду вовремя. Адрес уточните пожалуйста.',ts:'11:02'},
    ]},
];

// ── Уровни верификации ─────────────────────────────────────
const VERIF_LEVELS = [
  { ico:'🥉', lvl:{ru:'Уровень 1',en:'Level 1'}, t:{ru:'Зарегистрирован',en:'Registered'}, featured:false,
    docs:{ru:['Профессиональная лицензия','Личность подтверждена'],en:['Professional license','Identity confirmed']},
    bonus:{ru:'Стандартный каталог',en:'Standard catalog'} },
  { ico:'🥈', lvl:{ru:'Уровень 2 — Рекомендуем',en:'Level 2 — Recommended'}, t:{ru:'Проверенный мастер',en:'Verified Master'}, featured:true,
    docs:{ru:['Лицензия проверена','Страховка гражданской ответственности','Значок ✅ на профиле'],en:['License verified','Liability insurance','✅ Badge on profile']},
    bonus:{ru:'+40% видимых заказов',en:'+40% order visibility'} },
  { ico:'🥇', lvl:{ru:'Уровень 3 — Премиум',en:'Level 3 — Premium'}, t:{ru:'Сертифицированный эксперт',en:'Certified Expert'}, featured:false,
    docs:{ru:['Лицензия + страховка','Гарантия на работы','Доступ к премиум-заказам'],en:['License + insurance','Work guarantee','Access to premium orders']},
    bonus:{ru:'+70% · Премиум разблокирован',en:'+70% · Premium unlocked'} },
];

// ── Статистика сайта ───────────────────────────────────────
const SITE_STATS = [
  { v:'342', em:'+', l:{ru:'Мастеров',  en:'Masters'  } },
  { v:'22',  em:'',  l:{ru:'Страны EU', en:'EU Countries'} },
  { v:'4.9', em:'★', l:{ru:'Рейтинг',  en:'Rating'   } },
  { v:'24',  em:'ч', l:{ru:'Верификация',en:'Verification'} },
];

// ── Контент лендинга ───────────────────────────────────────
const FEATURES = [
  { ico:'🛡️', t:{ru:'Лицензия · Страховка · Гарантия',en:'License · Insurance · Guarantee'}, p:{ru:'Каждый документ проверяется за 24 часа',en:'Every document verified within 24 hours'} },
  { ico:'🌍', t:{ru:'22 страны охвачено',en:'22 countries covered'}, p:{ru:'Ваш профиль виден по всей Европе',en:'Your profile visible across Europe'} },
  { ico:'📱', t:{ru:'Telegram необязателен',en:'Telegram optional'}, p:{ru:'Email достаточен для работы',en:'Email is sufficient'} },
  { ico:'💰', t:{ru:'Регистрация бесплатна',en:'Free registration'}, p:{ru:'Начните получать заказы сегодня',en:'Start receiving orders today'} },
];

const HOW_STEPS = [
  { n:'01', ico:'📋', t:{ru:'Зарегистрируйтесь',en:'Sign Up'}, p:{ru:'2 минуты. Email или телефон.',en:'2 minutes. Email or phone.'} },
  { n:'02', ico:'✅', t:{ru:'Верификация за 24ч',en:'24h Verification'}, p:{ru:'Проверяем лицензию, страховку, документы.',en:'We verify license, insurance, documents.'} },
  { n:'03', ico:'💼', t:{ru:'Работайте',en:'Start Working'}, p:{ru:'Заявки, чат, смета. Уведомления на email.',en:'Orders, chat, estimates. Email notifications.'} },
];
