/* ═══════════════════════════════════════════════════════════════════════
   TRANSLATIONS - ПОЛНЫЙ СЛОВАРЬ РУ/EN
   Используется на всех страницах (register, login, dashboard, client, admin)
   ═══════════════════════════════════════════════════════════════════════ */

const TRANSLATIONS = {
  ru: {
    // NAV
    'nav.lang_ru': 'РУ',
    'nav.lang_en': 'ENG',
    'nav.catalog': 'Каталог',
    'nav.how': 'Как это работает',
    'nav.login': '🔓 Вход',
    'nav.register': 'Регистрация',
    'nav.cabinet': 'Кабинет',
    'nav.logout': 'Выход',

    // TABS
    'tab.orders': 'Заявки',
    'tab.responses': 'Отклики',
    'tab.chat': 'Чат',
    'tab.stats': 'Статистика',
    'tab.profile': 'Профиль',
    'tab.verif': 'Верификация',
    'tab.sub': 'Подписка',
    'tab.exit': 'Выйти',
    'tab.my_orders': 'Мои заявки',
    'tab.new_order': 'Новая заявка',
    'tab.find': 'Мастера',
    'tab.masters': 'Мастера',
    'tab.clients': 'Заказчики',
    'tab.top': 'ТОП',
    'tab.admin_stats': 'Стат.',
    'tab.admin_users': 'Пользователи',
    'tab.admin_broadcast': 'Рассылка',

    // BUTTONS
    'btn.apply': 'Откликнуться',
    'btn.save': 'Сохранить',
    'btn.cancel': 'Отмена',
    'btn.verify': 'Верифицировать',
    'btn.block': 'Заблокировать',
    'btn.unblock': 'Разблокировать',
    'btn.create': 'Создать заявку',
    'btn.contact': 'Связаться',
    'btn.back': '← Назад',
    'btn.view_orders': 'Просмотр заявок',
    'btn.edit': 'Редактировать',
    'btn.delete': 'Удалить',
    'btn.send': 'Отправить',
    'btn.accept': 'Принять',
    'btn.reject': 'Отклонить',

    // LABELS
    'lbl.online': 'Онлайн',
    'lbl.offline': 'Оффлайн',
    'lbl.pro': 'Pro',
    'lbl.free': 'Free',
    'lbl.top_city': 'ТОП города',
    'lbl.top_country': 'ТОП страны',
    'lbl.rating': 'Рейтинг',
    'lbl.reviews': 'Отзывов',
    'lbl.experience': 'Опыт',
    'lbl.price': 'Ставка',
    'lbl.name': 'Имя',
    'lbl.lastname': 'Фамилия',
    'lbl.email': 'Email',
    'lbl.phone': 'Телефон',
    'lbl.city': 'Город',
    'lbl.country': 'Страна',
    'lbl.postal_code': 'Индекс',
    'lbl.about': 'О себе',
    'lbl.category': 'Категория',
    'lbl.budget': 'Бюджет',
    'lbl.desc': 'Описание',
    'lbl.password': 'Пароль',
    'lbl.created': 'Создано',
    'lbl.status': 'Статус',

    // STATUS
    'status.open': 'Открыта',
    'status.in_progress': 'В работе',
    'status.completed': 'Завершена',
    'status.cancelled': 'Отменена',
    'status.pending': 'На рассмотрении',

    // AUTH
    'auth.login_title': 'Войти в аккаунт',
    'auth.no_account': 'Нет аккаунта?',
    'auth.register_link': 'Зарегистрироваться',
    'auth.forgot': 'Забыли пароль?',
    'auth.login_btn': 'Войти →',
    'auth.register_title': 'Создать аккаунт',
    'auth.have_account': 'Уже есть?',
    'auth.login_link': 'Войти',
    'auth.register_btn': 'Зарегистрироваться →',
    'auth.master': 'Я мастер',
    'auth.master_sub': 'Получаю заказы',
    'auth.client': 'Заказчик',
    'auth.client_sub': 'Ищу мастера',
    'auth.firstname': 'Имя',
    'auth.lastname': 'Фамилия',
    'auth.min_pass': 'Минимум 6 символов',
    'auth.specialties': 'Специальности',

    // MESSAGES
    'msg.hello': 'Привет',
    'msg.master_created': 'Профиль мастера создан!',
    'msg.client_created': 'Аккаунт заказчика создан!',
    'msg.profile_updated': 'Профиль обновлён',
    'msg.order_created': 'Заявка создана',
    'msg.order_accepted': 'Заявка принята',
    'msg.order_rejected': 'Заявка отклонена',
    'msg.message_sent': 'Сообщение отправлено',
    'msg.verified': 'Верифицировано',
    'msg.blocked': 'Заблокировано',
    'msg.unblocked': 'Разблокировано',

    // ERRORS
    'err.fill_required': 'Заполните все обязательные поля',
    'err.email_used': 'Email уже используется',
    'err.email_invalid': 'Некорректный email',
    'err.password_short': 'Пароль должен быть минимум 6 символов',
    'err.select_country': 'Выберите страну',
    'err.enter_city': 'Введите город',
    'err.invalid_creds': 'Неправильные учётные данные',
    'err.blocked': 'Аккаунт заблокирован',
    'err.pwd_min': 'Пароль минимум 6 символов',
    'err.not_found': 'Не найдено',
    'err.server_error': 'Ошибка сервера',

    // FORGOT PASSWORD
    'forgot.title': 'Восстановление пароля',
    'forgot.sub': 'Введите email — пришлём инструкции',
    'forgot.btn': 'Отправить →',
    'forgot.back': '← Назад к входу',
    'forgot.option1': '📱 Напишите в Telegram-бот',
    'forgot.option1_desc': 'Администратор сбросит пароль вручную',
    'forgot.option2': '✉️ Email администратору',
    'forgot.option2_desc': 'Ответим в течение 24 часов',
    'forgot.option3': '🔑 Сброс через Telegram',
    'forgot.telegram_note': 'Самый быстрый способ — напишите боту:',

    // CATALOG
    'catalog.title': 'Каталог мастеров',
    'catalog.search': 'Поиск по имени...',
    'catalog.all_cats': 'Все категории',
    'catalog.all_countries': 'Все страны',
    'catalog.all_cities': 'Все города',
    'catalog.all': 'Все',
    'catalog.online': '🟢 Онлайн',
    'catalog.sort_top': 'ТОП первые',
    'catalog.sort_rate': 'По рейтингу',
    'catalog.sort_price_asc': 'Цена ↑',
    'catalog.sort_price_desc': 'Цена ↓',
    'catalog.sort_reviews': 'По отзывам',
    'catalog.found': 'Найдено',
    'catalog.masters': 'мастеров',
    'catalog.not_found': 'Мастера не найдены',

    // INDEX / HOME
    'index.badge': 'мастера · 22 страны',
    'index.hero1': 'Проверенные мастера',
    'index.hero2': 'по всей Европе',
    'index.hero_sub': 'Лицензия · Страховка · Гарантия — каждый мастер верифицирован',
    'index.cta_master': 'Я мастер →',
    'index.cta_master_sub': 'Получайте заказы по Европе',
    'index.cta_client': 'Ищу мастера →',
    'index.cta_client_sub': 'Проверенные профили',
    'index.stat_masters': 'Мастеров',
    'index.stat_countries': 'Стран',
    'index.stat_rating': 'Рейтинг',

    // ADMIN
    'admin.title': 'Администратор',
    'admin.users': 'Пользователи',
    'admin.broadcast': 'Рассылка',
    'admin.stats': 'Статистика',
    'admin.select_recipients': 'Выберите получателей',
    'admin.all_users': 'Все пользователи',
    'admin.only_masters': 'Только мастерам',
    'admin.only_clients': 'Только заказчикам',
    'admin.message_text': 'Текст сообщения',
    'admin.send_broadcast': 'Отправить рассылку',
    'admin.sent': 'Отправлено',

    // DASHBOARD (MASTER)
    'dashboard.title': 'Кабинет мастера',
    'dashboard.welcome': 'Добро пожаловать',
    'dashboard.my_profile': 'Мой профиль',
    'dashboard.edit_profile': 'Редактировать профиль',
    'dashboard.my_orders': 'Мои заказы',
    'dashboard.responses': 'Отклики на заявки',
    'dashboard.chats': 'Чаты',
    'dashboard.stats': 'Статистика',
    'dashboard.verification': 'Верификация',
    'dashboard.subscription': 'Подписка',

    // CLIENT
    'client.title': 'Кабинет заказчика',
    'client.welcome': 'Добро пожаловать',
    'client.my_profile': 'Мой профиль',
    'client.edit_profile': 'Редактировать профиль',
    'client.my_orders': 'Мои заявки',
    'client.create_order': 'Создать новую заявку',
    'client.find_masters': 'Найти мастера',
    'client.chats': 'Чаты',
    'client.reviews': 'Мои отзывы',
  },

  en: {
    // NAV
    'nav.lang_ru': 'RU',
    'nav.lang_en': 'EN',
    'nav.catalog': 'Catalog',
    'nav.how': 'How it works',
    'nav.login': '🔓 Login',
    'nav.register': 'Sign Up',
    'nav.cabinet': 'Cabinet',
    'nav.logout': 'Logout',

    // TABS
    'tab.orders': 'Orders',
    'tab.responses': 'Responses',
    'tab.chat': 'Chat',
    'tab.stats': 'Statistics',
    'tab.profile': 'Profile',
    'tab.verif': 'Verification',
    'tab.sub': 'Subscription',
    'tab.exit': 'Exit',
    'tab.my_orders': 'My Orders',
    'tab.new_order': 'New Order',
    'tab.find': 'Find Masters',
    'tab.masters': 'Masters',
    'tab.clients': 'Clients',
    'tab.top': 'TOP',
    'tab.admin_stats': 'Stats',
    'tab.admin_users': 'Users',
    'tab.admin_broadcast': 'Broadcast',

    // BUTTONS
    'btn.apply': 'Apply',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.verify': 'Verify',
    'btn.block': 'Block',
    'btn.unblock': 'Unblock',
    'btn.create': 'Create Order',
    'btn.contact': 'Contact',
    'btn.back': '← Back',
    'btn.view_orders': 'View Orders',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.send': 'Send',
    'btn.accept': 'Accept',
    'btn.reject': 'Reject',

    // LABELS
    'lbl.online': 'Online',
    'lbl.offline': 'Offline',
    'lbl.pro': 'Pro',
    'lbl.free': 'Free',
    'lbl.top_city': 'TOP City',
    'lbl.top_country': 'TOP Country',
    'lbl.rating': 'Rating',
    'lbl.reviews': 'Reviews',
    'lbl.experience': 'Experience',
    'lbl.price': 'Price',
    'lbl.name': 'Name',
    'lbl.lastname': 'Last Name',
    'lbl.email': 'Email',
    'lbl.phone': 'Phone',
    'lbl.city': 'City',
    'lbl.country': 'Country',
    'lbl.postal_code': 'Postal Code',
    'lbl.about': 'About',
    'lbl.category': 'Category',
    'lbl.budget': 'Budget',
    'lbl.desc': 'Description',
    'lbl.password': 'Password',
    'lbl.created': 'Created',
    'lbl.status': 'Status',

    // STATUS
    'status.open': 'Open',
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.pending': 'Pending',

    // AUTH
    'auth.login_title': 'Sign In',
    'auth.no_account': 'No account?',
    'auth.register_link': 'Sign Up',
    'auth.forgot': 'Forgot password?',
    'auth.login_btn': 'Sign In →',
    'auth.register_title': 'Create Account',
    'auth.have_account': 'Already have?',
    'auth.login_link': 'Sign In',
    'auth.register_btn': 'Sign Up →',
    'auth.master': 'I am a master',
    'auth.master_sub': 'Get orders',
    'auth.client': 'I am a client',
    'auth.client_sub': 'Find a master',
    'auth.firstname': 'First Name',
    'auth.lastname': 'Last Name',
    'auth.min_pass': 'Minimum 6 characters',
    'auth.specialties': 'Specialties',

    // MESSAGES
    'msg.hello': 'Hello',
    'msg.master_created': 'Master profile created!',
    'msg.client_created': 'Client account created!',
    'msg.profile_updated': 'Profile updated',
    'msg.order_created': 'Order created',
    'msg.order_accepted': 'Order accepted',
    'msg.order_rejected': 'Order rejected',
    'msg.message_sent': 'Message sent',
    'msg.verified': 'Verified',
    'msg.blocked': 'Blocked',
    'msg.unblocked': 'Unblocked',

    // ERRORS
    'err.fill_required': 'Fill all required fields',
    'err.email_used': 'Email already in use',
    'err.email_invalid': 'Invalid email',
    'err.password_short': 'Password must be at least 6 characters',
    'err.select_country': 'Select country',
    'err.enter_city': 'Enter city',
    'err.invalid_creds': 'Invalid credentials',
    'err.blocked': 'Account is blocked',
    'err.pwd_min': 'Password minimum 6 characters',
    'err.not_found': 'Not found',
    'err.server_error': 'Server error',

    // FORGOT PASSWORD
    'forgot.title': 'Password Recovery',
    'forgot.sub': 'Enter email - we will send instructions',
    'forgot.btn': 'Send →',
    'forgot.back': '← Back to login',
    'forgot.option1': '📱 Write to Telegram bot',
    'forgot.option1_desc': 'Admin will reset password manually',
    'forgot.option2': '✉️ Email to admin',
    'forgot.option2_desc': 'We will respond within 24 hours',
    'forgot.option3': '🔑 Reset via Telegram',
    'forgot.telegram_note': 'Fastest way - write to bot:',

    // CATALOG
    'catalog.title': 'Masters Catalog',
    'catalog.search': 'Search by name...',
    'catalog.all_cats': 'All categories',
    'catalog.all_countries': 'All countries',
    'catalog.all_cities': 'All cities',
    'catalog.all': 'All',
    'catalog.online': '🟢 Online',
    'catalog.sort_top': 'TOP first',
    'catalog.sort_rate': 'By rating',
    'catalog.sort_price_asc': 'Price ↑',
    'catalog.sort_price_desc': 'Price ↓',
    'catalog.sort_reviews': 'By reviews',
    'catalog.found': 'Found',
    'catalog.masters': 'masters',
    'catalog.not_found': 'Masters not found',

    // INDEX / HOME
    'index.badge': 'masters · 22 countries',
    'index.hero1': 'Verified Masters',
    'index.hero2': 'across Europe',
    'index.hero_sub': 'License · Insurance · Guarantee - every master is verified',
    'index.cta_master': 'I am a master →',
    'index.cta_master_sub': 'Get orders across Europe',
    'index.cta_client': 'Find a master →',
    'index.cta_client_sub': 'Verified profiles',
    'index.stat_masters': 'Masters',
    'index.stat_countries': 'Countries',
    'index.stat_rating': 'Rating',

    // ADMIN
    'admin.title': 'Administration',
    'admin.users': 'Users',
    'admin.broadcast': 'Broadcast',
    'admin.stats': 'Statistics',
    'admin.select_recipients': 'Select recipients',
    'admin.all_users': 'All users',
    'admin.only_masters': 'Masters only',
    'admin.only_clients': 'Clients only',
    'admin.message_text': 'Message text',
    'admin.send_broadcast': 'Send broadcast',
    'admin.sent': 'Sent',

    // DASHBOARD (MASTER)
    'dashboard.title': 'Master Cabinet',
    'dashboard.welcome': 'Welcome',
    'dashboard.my_profile': 'My Profile',
    'dashboard.edit_profile': 'Edit Profile',
    'dashboard.my_orders': 'My Orders',
    'dashboard.responses': 'Responses',
    'dashboard.chats': 'Chats',
    'dashboard.stats': 'Statistics',
    'dashboard.verification': 'Verification',
    'dashboard.subscription': 'Subscription',

    // CLIENT
    'client.title': 'Client Cabinet',
    'client.welcome': 'Welcome',
    'client.my_profile': 'My Profile',
    'client.edit_profile': 'Edit Profile',
    'client.my_orders': 'My Orders',
    'client.create_order': 'Create New Order',
    'client.find_masters': 'Find Master',
    'client.chats': 'Chats',
    'client.reviews': 'My Reviews',
  }
};

// ═══════════════════════════════════════════════════════════════════════
// ФУНКЦИИ ДЛЯ РАБОТЫ С ПЕРЕВОДАМИ
// ═══════════════════════════════════════════════════════════════════════

function getLang() {
  return localStorage.getItem('ss_lang') || 'ru';
}

function setLang(lang) {
  localStorage.setItem('ss_lang', lang);
}

function t(key) {
  const lang = getLang();
  const translation = TRANSLATIONS[lang]?.[key];
  if (!translation) {
    console.warn(`Translation missing: ${lang}.${key}`);
    return key;
  }
  return translation;
}

function i18n_init() {
  // Переводим все элементы с data-t атрибутом
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    el.textContent = t(key);
  });
}

// Вызвать при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', i18n_init);
} else {
  i18n_init();
}
