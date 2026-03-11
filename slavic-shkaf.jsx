import { useState, useEffect, useCallback, useRef, useMemo, createContext, useContext } from "react";

// ============================================================
// SLAVIC SHKAF — Full Platform
// Mobile-first Telegram Mini App
// ============================================================

// --- Logos (base64) ---
const LOGO_CLOSED_SM = "data:image/png;base64,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";
const LOGO_OPEN_SM = "data:image/png;base64,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";
const LOGO_CLOSED_LG = "data:image/png;base64,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";

// --- i18n ---
const translations = {
  ru: {
    nav: { home: "Главная", login: "Вход", register: "Регистрация", profile: "Профиль", logout: "Выход", admin: "Админка" },
    hero: {
      title: "Проверенные мастера\nпо всей Европе",
      subtitle: "Нанимайте • Стройтесь • Гарантия — находите идеального мастера за 5 минут",
      cta: "Я мастер", ctaAlt: "Ищу мастера",
    },
    stats: { masters: "Проверенных мастеров", countries: "Стран Европы", rating: "Средний рейтинг", orders: "Закрытых заказов" },
    howItWorks: {
      title: "Как это работает",
      steps: [
        { t: "Мастер регистрируется", d: "Заполняет профиль, добавляет портфолио" },
        { t: "Клиент создаёт заказ", d: "Описывает задачу, указывает бюджет и сроки" },
        { t: "Мастера откликаются", d: "Вы получаете предложения от проверенных специалистов" },
        { t: "Работа выполнена", d: "Оставляете отзыв и оценку мастеру" },
      ],
    },
    categories: {
      title: "Найдите специалиста",
      viewAll: "Показать всех мастеров",
    },
    why: {
      title: "Почему Slavic Shkaf?",
      items: [
        { t: "Верифицированные мастера", d: "Каждый специалист проверен и имеет подтвержённый опыт работы" },
        { t: "Гарантия качества", d: "Проверенные работодатели и рейтинговая система качества" },
        { t: "По всей Европе", d: "Найдите мастера из 22+ стран — всегда рядом с вами" },
        { t: "Быстро и просто", d: "Размещаете заказ — получаете отклик. Работаем через Telegram" },
      ],
    },
    testimonials: {
      title: "Что говорят пользователи",
      items: [
        { text: "Нашёл отличного сантехника за 20 минут. Всё починил за пару часов!", name: "Алекс, Берлин", rating: 5 },
        { text: "Как мастер, получаю заказы каждый день. Очень удобная платформа!", name: "Сергей, Прага", rating: 5 },
        { text: "Профессиональный ремонт, быстрый отклик мастеров. Переехала и нашла мастера!", name: "Анна, Варшава", rating: 5 },
      ],
    },
    ready: { title: "Готовы начать?", subtitle: "Присоединяйтесь к 342+ мастерам и найдите идеального специалиста для своей задачи", cta: "Я мастер", ctaAlt: "Ищу мастера" },
    footer: { copy: "© 2025 Slavic Shkaf. Все права защищены.", privacy: "Условия", contact: "Контакты" },
    register: {
      title: "Регистрация",
      role: "Я являюсь",
      master: "Мастер",
      client: "Заказчик",
      name: "ФИО",
      email: "Электронная почта",
      phone: "Номер телефона",
      country: "Страна",
      selectCountry: "Выберите страну",
      categories: "Категории работ",
      password: "Пароль",
      confirmPassword: "Повторите пароль",
      postalCode: "Почтовый индекс",
      city: "Город",
      submit: "Зарегистрироваться",
      hasAccount: "Уже есть аккаунт?",
      login: "Войти",
    },
    login: {
      title: "Вход",
      email: "Электронная почта",
      password: "Пароль",
      submit: "Войти",
      noAccount: "Нет аккаунта?",
      register: "Зарегистрироваться",
      forgot: "Забыли пароль?",
    },
    masterDash: {
      exchange: "Биржа заказов",
      profile: "Профиль",
      calendar: "Календарь",
      myResponses: "Мои отклики",
      messages: "Сообщения",
    },
    clientDash: {
      newOrder: "Новый заказ",
      myOrders: "Мои заказы",
      profile: "Профиль",
      masters: "Каталог мастеров",
      messages: "Сообщения",
    },
    admin: {
      users: "Пользователи",
      orders: "Заказы",
      tops: "ТОП / Премиум",
      stats: "Статистика",
      broadcast: "Рассылка",
      settings: "Настройки",
      categories: "Категории",
      reports: "Жалобы",
    },
    orderForm: {
      title: "Создать заказ",
      category: "Категория работ",
      selectCategory: "Выберите категорию",
      description: "Описание работы",
      budget: "Бюджет (€)",
      deadline: "Срок выполнения",
      location: "Адрес / Район",
      submit: "Опубликовать заказ",
    },
    common: {
      search: "Поиск...",
      filter: "Фильтр",
      apply: "Применить",
      cancel: "Отменить",
      save: "Сохранить",
      delete: "Удалить",
      edit: "Редактировать",
      back: "Назад",
      loading: "Загрузка...",
      noResults: "Ничего не найдено",
      respond: "Откликнуться",
      details: "Подробнее",
      all: "Все",
      today: "Сегодня",
      send: "Отправить",
      premium: "ПРЕМИУМ",
      top: "ТОП",
    },
  },
  en: {
    nav: { home: "Home", login: "Login", register: "Register", profile: "Profile", logout: "Logout", admin: "Admin" },
    hero: {
      title: "Verified Tradespeople\nAcross Europe",
      subtitle: "Hire • Build • Guarantee — find the perfect tradesperson in 5 minutes",
      cta: "I'm a tradesperson", ctaAlt: "I need a tradesperson",
    },
    stats: { masters: "Verified tradespeople", countries: "European countries", rating: "Average rating", orders: "Completed orders" },
    howItWorks: {
      title: "How It Works",
      steps: [
        { t: "Tradesperson registers", d: "Fill profile, add portfolio" },
        { t: "Client creates order", d: "Describe the task, set budget and deadlines" },
        { t: "Tradespeople respond", d: "Get proposals from verified specialists" },
        { t: "Job completed", d: "Leave a review and rate the tradesperson" },
      ],
    },
    categories: {
      title: "Find a Specialist",
      viewAll: "View all tradespeople",
    },
    why: {
      title: "Why Slavic Shkaf?",
      items: [
        { t: "Verified Tradespeople", d: "Each specialist is vetted with confirmed work experience" },
        { t: "Quality Guarantee", d: "Verified employers and a quality rating system" },
        { t: "All Across Europe", d: "Find a tradesperson from 22+ countries — always nearby" },
        { t: "Fast & Simple", d: "Post an order — get a response. We work through Telegram" },
      ],
    },
    testimonials: {
      title: "What Our Users Say",
      items: [
        { text: "Found an excellent plumber in 20 minutes. Fixed everything in a couple of hours!", name: "Alex, Berlin", rating: 5 },
        { text: "As a tradesperson, I get orders every day. Very convenient platform!", name: "Sergei, Prague", rating: 5 },
        { text: "Professional renovation, quick response from tradespeople. Moved and found a master!", name: "Anna, Warsaw", rating: 5 },
      ],
    },
    ready: { title: "Ready to Start?", subtitle: "Join 342+ tradespeople and find the perfect specialist for your task", cta: "I'm a tradesperson", ctaAlt: "I need a tradesperson" },
    footer: { copy: "© 2025 Slavic Shkaf. All rights reserved.", privacy: "Terms", contact: "Contacts" },
    register: {
      title: "Register",
      role: "I am a",
      master: "Tradesperson",
      client: "Client",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      country: "Country",
      selectCountry: "Select country",
      categories: "Work Categories",
      password: "Password",
      confirmPassword: "Confirm Password",
      postalCode: "Postal Code",
      city: "City",
      submit: "Register",
      hasAccount: "Already have an account?",
      login: "Log in",
    },
    login: {
      title: "Login",
      email: "Email",
      password: "Password",
      submit: "Log in",
      noAccount: "Don't have an account?",
      register: "Register",
      forgot: "Forgot password?",
    },
    masterDash: {
      exchange: "Job Board",
      profile: "Profile",
      calendar: "Calendar",
      myResponses: "My Responses",
      messages: "Messages",
    },
    clientDash: {
      newOrder: "New Order",
      myOrders: "My Orders",
      profile: "Profile",
      masters: "Browse Masters",
      messages: "Messages",
    },
    admin: {
      users: "Users",
      orders: "Orders",
      tops: "TOP / Premium",
      stats: "Statistics",
      broadcast: "Broadcast",
      settings: "Settings",
      categories: "Categories",
      reports: "Reports",
    },
    orderForm: {
      title: "Create Order",
      category: "Work Category",
      selectCategory: "Select category",
      description: "Job Description",
      budget: "Budget (€)",
      deadline: "Deadline",
      location: "Address / Area",
      submit: "Publish Order",
    },
    common: {
      search: "Search...",
      filter: "Filter",
      apply: "Apply",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      loading: "Loading...",
      noResults: "No results found",
      respond: "Respond",
      details: "Details",
      all: "All",
      today: "Today",
      send: "Send",
      premium: "PREMIUM",
      top: "TOP",
    },
  },
};

// --- Categories ---
const CATEGORIES = [
  { id: "plumbing", icon: "🔧", ru: "Сантехника", en: "Plumbing" },
  { id: "electrical", icon: "⚡", ru: "Электрика", en: "Electrical" },
  { id: "painting", icon: "🎨", ru: "Малярные работы", en: "Painting" },
  { id: "tiling", icon: "🧱", ru: "Плиточные работы", en: "Tiling" },
  { id: "renovation", icon: "🏠", ru: "Ремонт квартир", en: "Renovation" },
  { id: "roofing", icon: "🏗️", ru: "Кровля", en: "Roofing" },
  { id: "carpentry", icon: "🪚", ru: "Столярные работы", en: "Carpentry" },
  { id: "welding", icon: "🔥", ru: "Сварка", en: "Welding" },
  { id: "heating", icon: "🌡️", ru: "Отопление", en: "Heating" },
  { id: "ac", icon: "❄️", ru: "Кондиционирование", en: "Air Conditioning" },
  { id: "plastering", icon: "🧹", ru: "Штукатурка", en: "Plastering" },
  { id: "drywall", icon: "📐", ru: "Гипсокартон", en: "Drywall" },
  { id: "flooring", icon: "🪵", ru: "Полы", en: "Flooring" },
  { id: "facades", icon: "🏢", ru: "Фасады", en: "Facades" },
  { id: "landscaping", icon: "🌿", ru: "Ландшафт", en: "Landscaping" },
  { id: "cleaning", icon: "🧽", ru: "Клининг", en: "Cleaning" },
  { id: "moving", icon: "📦", ru: "Переезды", en: "Moving" },
  { id: "windows", icon: "🪟", ru: "Окна и двери", en: "Windows & Doors" },
  { id: "furniture", icon: "🛋️", ru: "Мебель", en: "Furniture" },
  { id: "design", icon: "✏️", ru: "Дизайн интерьера", en: "Interior Design" },
];

// --- Countries ---
const COUNTRIES = [
  { code: "DE", ru: "Германия", en: "Germany" },
  { code: "FR", ru: "Франция", en: "France" },
  { code: "IT", ru: "Италия", en: "Italy" },
  { code: "ES", ru: "Испания", en: "Spain" },
  { code: "PT", ru: "Португалия", en: "Portugal" },
  { code: "NL", ru: "Нидерланды", en: "Netherlands" },
  { code: "BE", ru: "Бельгия", en: "Belgium" },
  { code: "AT", ru: "Австрия", en: "Austria" },
  { code: "CH", ru: "Швейцария", en: "Switzerland" },
  { code: "PL", ru: "Польша", en: "Poland" },
  { code: "CZ", ru: "Чехия", en: "Czech Republic" },
  { code: "SK", ru: "Словакия", en: "Slovakia" },
  { code: "HU", ru: "Венгрия", en: "Hungary" },
  { code: "RO", ru: "Румыния", en: "Romania" },
  { code: "BG", ru: "Болгария", en: "Bulgaria" },
  { code: "HR", ru: "Хорватия", en: "Croatia" },
  { code: "SI", ru: "Словения", en: "Slovenia" },
  { code: "GR", ru: "Греция", en: "Greece" },
  { code: "GB", ru: "Великобритания", en: "United Kingdom" },
  { code: "IE", ru: "Ирландия", en: "Ireland" },
  { code: "DK", ru: "Дания", en: "Denmark" },
  { code: "SE", ru: "Швеция", en: "Sweden" },
  { code: "FI", ru: "Финляндия", en: "Finland" },
  { code: "NO", ru: "Норвегия", en: "Norway" },
  { code: "RS", ru: "Сербия", en: "Serbia" },
  { code: "ME", ru: "Черногория", en: "Montenegro" },
  { code: "BA", ru: "Босния и Герцеговина", en: "Bosnia & Herzegovina" },
  { code: "MK", ru: "Северная Македония", en: "North Macedonia" },
  { code: "AL", ru: "Албания", en: "Albania" },
  { code: "MD", ru: "Молдова", en: "Moldova" },
  { code: "LU", ru: "Люксембург", en: "Luxembourg" },
  { code: "CY", ru: "Кипр", en: "Cyprus" },
  { code: "MT", ru: "Мальта", en: "Malta" },
];

// --- Mock Data ---
const MOCK_ORDERS = [
  { id: 1, title: "Ремонт ванной комнаты", titleEn: "Bathroom renovation", category: "tiling", budget: 2500, currency: "€", deadline: "2025-04-15", location: "Berlin, DE", description: "Полный ремонт ванной 8м², замена плитки, сантехники", descriptionEn: "Full bathroom renovation 8m², tile and plumbing replacement", clientName: "Максим К.", status: "open", premium: true, createdAt: "2025-03-08", responses: 3 },
  { id: 2, title: "Электропроводка в квартире", titleEn: "Apartment electrical wiring", category: "electrical", budget: 1800, currency: "€", deadline: "2025-04-01", location: "Prague, CZ", description: "Замена электропроводки в 3-комнатной квартире, 75м²", descriptionEn: "Rewiring 3-room apartment, 75m²", clientName: "Елена В.", status: "open", premium: false, createdAt: "2025-03-09", responses: 1 },
  { id: 3, title: "Покраска фасада дома", titleEn: "House facade painting", category: "painting", budget: 3200, currency: "€", deadline: "2025-05-01", location: "Warsaw, PL", description: "Покраска фасада частного дома, площадь 200м²", descriptionEn: "Painting private house facade, 200m² area", clientName: "Анна С.", status: "open", premium: false, createdAt: "2025-03-10", responses: 5 },
  { id: 4, title: "Установка кухни IKEA", titleEn: "IKEA kitchen installation", category: "furniture", budget: 800, currency: "€", deadline: "2025-03-25", location: "Vienna, AT", description: "Сборка и установка кухни IKEA, 12 модулей", descriptionEn: "Assembly and installation of IKEA kitchen, 12 modules", clientName: "Дмитрий Л.", status: "open", premium: true, createdAt: "2025-03-07", responses: 7 },
  { id: 5, title: "Укладка ламината", titleEn: "Laminate flooring", category: "flooring", budget: 1200, currency: "€", deadline: "2025-04-10", location: "Munich, DE", description: "Укладка ламината в 2 комнаты, общая площадь 45м²", descriptionEn: "Laminate flooring in 2 rooms, 45m² total", clientName: "Ольга М.", status: "open", premium: false, createdAt: "2025-03-10", responses: 2 },
  { id: 6, title: "Ремонт кровли", titleEn: "Roof repair", category: "roofing", budget: 5000, currency: "€", deadline: "2025-04-20", location: "Budapest, HU", description: "Частичная замена черепицы, ремонт водостоков", descriptionEn: "Partial tile replacement, gutter repair", clientName: "Иван Р.", status: "open", premium: false, createdAt: "2025-03-06", responses: 0 },
];

const MOCK_MASTERS = [
  { id: 1, name: "Андрей Петров", nameEn: "Andrey Petrov", categories: ["plumbing", "heating"], country: "DE", city: "Berlin", rating: 4.9, reviews: 47, premium: true, experience: "12 лет", experienceEn: "12 years" },
  { id: 2, name: "Михаил Ковальчук", nameEn: "Mikhail Kovalchuk", categories: ["electrical", "ac"], country: "CZ", city: "Prague", rating: 4.8, reviews: 32, premium: false, experience: "8 лет", experienceEn: "8 years" },
  { id: 3, name: "Сергей Новак", nameEn: "Sergei Novak", categories: ["painting", "plastering", "drywall"], country: "PL", city: "Warsaw", rating: 4.7, reviews: 28, premium: true, experience: "15 лет", experienceEn: "15 years" },
  { id: 4, name: "Виктор Шевченко", nameEn: "Viktor Shevchenko", categories: ["renovation", "tiling", "flooring"], country: "AT", city: "Vienna", rating: 5.0, reviews: 19, premium: false, experience: "10 лет", experienceEn: "10 years" },
];

const MOCK_USERS = [
  { id: 1, name: "Андрей Петров", email: "andrey@mail.com", role: "master", country: "DE", status: "active", registeredAt: "2025-01-15" },
  { id: 2, name: "Елена Волкова", email: "elena@mail.com", role: "client", country: "CZ", status: "active", registeredAt: "2025-02-20" },
  { id: 3, name: "Максим Козлов", email: "max@mail.com", role: "client", country: "DE", status: "active", registeredAt: "2025-03-01" },
  { id: 4, name: "Михаил Ковальчук", email: "mikhail@mail.com", role: "master", country: "CZ", status: "blocked", registeredAt: "2025-01-20" },
  { id: 5, name: "Сергей Новак", email: "sergei@mail.com", role: "master", country: "PL", status: "active", registeredAt: "2024-12-10" },
  { id: 6, name: "Анна Сидорова", email: "anna@mail.com", role: "client", country: "PL", status: "active", registeredAt: "2025-02-28" },
];

// --- Context ---
const AppContext = createContext();

// --- SVG Icons ---
const Icons = {
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  close: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  briefcase: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  message: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  star: <svg width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>,
  crown: <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1"><path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z"/><rect x="5" y="18" width="14" height="2" rx="1"/></svg>,
  chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  send: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  alert: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  list: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  location: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

// ============================================================
// STYLES
// ============================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap');

:root {
  --bg: #060A0E;
  --bg2: #0C1117;
  --bg3: #131A22;
  --bg4: #1A2332;
  --border: #1E2A38;
  --border-glow: #10b98133;
  --green: #10b981;
  --green-dark: #059669;
  --green-glow: #10b98122;
  --green-bright: #34d399;
  --yellow: #facc15;
  --red: #ef4444;
  --text: #E8ECF0;
  --text2: #94A3B8;
  --text3: #64748B;
  --font-display: 'Unbounded', sans-serif;
  --font-body: 'Manrope', sans-serif;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
}

* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 15px; }
body { font-family: var(--font-body); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
input, select, textarea, button { font-family: var(--font-body); }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

.app { max-width: 480px; margin: 0 auto; min-height: 100vh; position: relative; }

/* --- Header --- */
.header {
  position: sticky; top: 0; z-index: 100;
  background: var(--bg); border-bottom: 1px solid var(--border);
  padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
}
.header-logo {
  font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; color: var(--green);
  display: flex; align-items: center; gap: 6px; cursor: pointer;
}
.header-logo img { height: 28px; }
.header-right { display: flex; align-items: center; gap: 8px; }
.lang-toggle {
  display: flex; background: var(--bg3); border-radius: 20px; overflow: hidden; border: 1px solid var(--border);
}
.lang-btn {
  padding: 4px 10px; font-size: 0.7rem; font-weight: 600; border: none; cursor: pointer;
  background: transparent; color: var(--text3); transition: all 0.2s;
}
.lang-btn.active { background: var(--green); color: #fff; }
.header-btn {
  padding: 6px 14px; font-size: 0.75rem; font-weight: 600; border-radius: 20px;
  border: 1px solid var(--green); color: var(--green); background: transparent; cursor: pointer;
  transition: all 0.2s;
}
.header-btn:hover { background: var(--green); color: #fff; }
.header-btn.filled { background: var(--green); color: #fff; border-color: var(--green); }
.menu-btn { background: none; border: none; color: var(--text); cursor: pointer; padding: 4px; }

/* --- Hero --- */
.hero {
  padding: 40px 20px; text-align: center;
  background: radial-gradient(ellipse at 50% 0%, var(--green-glow) 0%, transparent 70%);
}
.hero h1 {
  font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; line-height: 1.3;
  white-space: pre-line; margin-bottom: 12px;
}
.hero p { color: var(--text2); font-size: 0.85rem; margin-bottom: 24px; line-height: 1.5; }
.hero-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.btn {
  padding: 10px 24px; border-radius: 24px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; border: none; display: inline-flex; align-items: center; gap: 6px;
}
.btn-primary { background: var(--green); color: #fff; }
.btn-primary:hover { background: var(--green-dark); transform: translateY(-1px); }
.btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
.btn-outline:hover { border-color: var(--green); color: var(--green); }
.btn-sm { padding: 6px 16px; font-size: 0.75rem; }
.btn-full { width: 100%; justify-content: center; }
.btn-danger { background: var(--red); color: #fff; }
.btn-yellow { background: var(--yellow); color: #000; }

/* --- Stats --- */
.stats-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 0 16px; margin: -10px 0 30px;
}
.stat-card {
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 14px 8px; text-align: center;
}
.stat-value { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--green); }
.stat-label { font-size: 0.6rem; color: var(--text3); margin-top: 4px; }

/* --- Section --- */
.section { padding: 30px 16px; }
.section-title {
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; text-align: center; margin-bottom: 20px;
}

/* --- Categories Grid --- */
.cat-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px; }
.cat-chip {
  display: flex; align-items: center; gap: 5px; padding: 8px 14px;
  background: var(--bg2); border: 1px solid var(--border); border-radius: 24px;
  font-size: 0.75rem; color: var(--text2); cursor: pointer; transition: all 0.2s;
}
.cat-chip:hover, .cat-chip.active { border-color: var(--green); color: var(--green); background: var(--green-glow); }
.cat-chip .emoji { font-size: 0.9rem; }

/* --- Why Cards --- */
.why-section {
  background: var(--bg2); border: 1px solid var(--border-glow); border-radius: var(--radius-lg);
  padding: 24px 16px; margin: 0 16px;
}
.why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.why-card { padding: 12px; }
.why-card h4 { font-size: 0.8rem; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.why-card p { font-size: 0.7rem; color: var(--text3); line-height: 1.4; }
.why-icon { color: var(--green); }

/* --- Testimonials --- */
.test-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; }
.test-card {
  min-width: 260px; scroll-snap-align: start;
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 16px;
}
.test-text { font-size: 0.8rem; color: var(--text2); line-height: 1.5; margin-bottom: 12px; font-style: italic; }
.test-author { font-size: 0.75rem; font-weight: 600; }
.test-stars { display: flex; gap: 2px; margin-top: 4px; }

/* --- CTA --- */
.cta-section {
  margin: 20px 16px 30px; padding: 30px 20px; text-align: center;
  background: linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
  border: 1px solid var(--border-glow); border-radius: var(--radius-lg);
}
.cta-section h2 { font-family: var(--font-display); font-size: 1.2rem; color: var(--green); margin-bottom: 10px; }
.cta-section p { font-size: 0.8rem; color: var(--text3); margin-bottom: 20px; }

/* --- Footer --- */
.footer { padding: 20px 16px; text-align: center; border-top: 1px solid var(--border); }
.footer p { font-size: 0.65rem; color: var(--text3); }
.footer a { color: var(--green); text-decoration: none; }

/* --- Forms --- */
.page { padding: 20px 16px; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.page-title {
  font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; text-align: center; margin-bottom: 24px;
}
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
.form-input {
  width: 100%; padding: 10px 14px; background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text); font-size: 0.85rem; outline: none; transition: border 0.2s;
}
.form-input:focus { border-color: var(--green); }
.form-input::placeholder { color: var(--text3); }
select.form-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
textarea.form-input { resize: vertical; min-height: 80px; }

.role-toggle { display: flex; gap: 10px; margin-bottom: 20px; }
.role-option {
  flex: 1; padding: 14px; text-align: center; border-radius: var(--radius);
  border: 2px solid var(--border); background: var(--bg2); cursor: pointer; transition: all 0.2s;
}
.role-option.active { border-color: var(--green); background: var(--green-glow); }
.role-option .role-icon { font-size: 1.5rem; margin-bottom: 4px; }
.role-option .role-label { font-size: 0.8rem; font-weight: 600; }

.cat-select-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.cat-select-chip {
  padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; cursor: pointer;
  border: 1px solid var(--border); background: var(--bg2); color: var(--text2); transition: all 0.2s;
}
.cat-select-chip.selected { border-color: var(--green); background: var(--green-glow); color: var(--green); }

.form-link { color: var(--green); cursor: pointer; font-weight: 600; font-size: 0.8rem; }
.form-link:hover { text-decoration: underline; }
.form-bottom { text-align: center; margin-top: 16px; font-size: 0.8rem; color: var(--text3); }

/* --- Dashboard --- */
.dash { display: flex; flex-direction: column; min-height: calc(100vh - 52px); }
.dash-content { flex: 1; padding: 16px; animation: fadeIn 0.3s ease; }
.dash-nav {
  position: sticky; bottom: 0; background: var(--bg2); border-top: 1px solid var(--border);
  display: flex; justify-content: space-around; padding: 8px 0; z-index: 50;
}
.dash-nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  background: none; border: none; color: var(--text3); cursor: pointer; padding: 4px 8px;
  font-size: 0.6rem; transition: color 0.2s;
}
.dash-nav-item.active { color: var(--green); }
.dash-nav-item svg { width: 20px; height: 20px; }

/* --- Order Cards --- */
.order-card {
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px;
  margin-bottom: 10px; cursor: pointer; transition: all 0.2s; position: relative;
}
.order-card:hover { border-color: var(--green); }
.order-card.premium { border-color: var(--yellow); box-shadow: 0 0 20px #facc1510; }
.order-badge {
  position: absolute; top: 10px; right: 10px; padding: 2px 8px; border-radius: 10px;
  font-size: 0.6rem; font-weight: 700;
}
.badge-premium { background: var(--yellow); color: #000; }
.badge-top { background: var(--green); color: #fff; }
.order-title { font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; padding-right: 60px; }
.order-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 0.7rem; color: var(--text3); margin-bottom: 8px; }
.order-meta span { display: flex; align-items: center; gap: 3px; }
.order-budget { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--green); }
.order-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.order-responses { font-size: 0.7rem; color: var(--text3); }

/* --- Master Cards --- */
.master-card {
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px;
  margin-bottom: 10px; display: flex; gap: 12px; align-items: center; cursor: pointer; transition: all 0.2s;
}
.master-card:hover { border-color: var(--green); }
.master-avatar {
  width: 48px; height: 48px; border-radius: 50%; background: var(--bg3);
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;
  border: 2px solid var(--border);
}
.master-card.premium .master-avatar { border-color: var(--yellow); }
.master-info { flex: 1; }
.master-name { font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; }
.master-cats { font-size: 0.7rem; color: var(--text3); margin-top: 2px; }
.master-stats { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.master-rating { display: flex; align-items: center; gap: 3px; font-size: 0.75rem; font-weight: 600; }
.master-reviews { font-size: 0.7rem; color: var(--text3); }

/* --- Profile --- */
.profile-header { text-align: center; padding: 20px 0; }
.profile-avatar {
  width: 80px; height: 80px; border-radius: 50%; background: var(--bg3); border: 3px solid var(--green);
  margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem;
}
.profile-name { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
.profile-role { font-size: 0.75rem; color: var(--green); margin-top: 2px; }
.profile-section { margin-bottom: 20px; }
.profile-section-title { font-size: 0.8rem; font-weight: 700; color: var(--text2); margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }
.profile-field { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.8rem; }
.profile-field-label { color: var(--text3); }
.profile-field-value { font-weight: 500; }

/* --- Calendar --- */
.cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.cal-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; }
.cal-nav { display: flex; gap: 8px; }
.cal-nav button { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
.cal-day-label { font-size: 0.6rem; color: var(--text3); font-weight: 600; padding: 4px; }
.cal-day {
  padding: 8px 4px; border-radius: var(--radius-sm); font-size: 0.75rem; cursor: pointer; transition: all 0.15s;
  border: 1px solid transparent;
}
.cal-day:hover { background: var(--bg3); }
.cal-day.today { border-color: var(--green); color: var(--green); font-weight: 700; }
.cal-day.has-event { background: var(--green-glow); }
.cal-day.empty { cursor: default; }

/* --- Admin --- */
.admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.admin-stat {
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px;
}
.admin-stat-value { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--green); }
.admin-stat-label { font-size: 0.7rem; color: var(--text3); margin-top: 2px; }

.admin-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
.admin-table th {
  text-align: left; padding: 8px; color: var(--text3); font-weight: 600;
  border-bottom: 1px solid var(--border); font-size: 0.65rem; text-transform: uppercase;
}
.admin-table td { padding: 8px; border-bottom: 1px solid var(--border); }
.admin-table tr:hover td { background: var(--bg3); }

.status-badge {
  padding: 2px 8px; border-radius: 10px; font-size: 0.6rem; font-weight: 600;
}
.status-active { background: #10b98120; color: var(--green); }
.status-blocked { background: #ef444420; color: var(--red); }
.status-open { background: #3b82f620; color: #3b82f6; }
.status-closed { background: #64748b20; color: var(--text3); }

/* --- Broadcast --- */
.broadcast-form { margin-top: 16px; }
.broadcast-target { display: flex; gap: 8px; margin-bottom: 16px; }
.target-btn {
  flex: 1; padding: 10px; text-align: center; border-radius: var(--radius-sm);
  border: 1px solid var(--border); background: var(--bg2); color: var(--text2);
  cursor: pointer; font-size: 0.75rem; font-weight: 600; transition: all 0.2s;
}
.target-btn.active { border-color: var(--green); background: var(--green-glow); color: var(--green); }

/* --- Search Bar --- */
.search-bar {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 14px;
}
.search-bar input {
  flex: 1; background: none; border: none; color: var(--text); font-size: 0.85rem; outline: none;
}
.search-bar input::placeholder { color: var(--text3); }
.filter-btn {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text2); padding: 5px 10px;
  border-radius: 16px; font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; gap: 4px;
}

/* --- Tabs --- */
.tabs { display: flex; gap: 4px; margin-bottom: 16px; overflow-x: auto; }
.tab {
  padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  white-space: nowrap; cursor: pointer; border: 1px solid var(--border);
  background: var(--bg2); color: var(--text3); transition: all 0.2s;
}
.tab.active { border-color: var(--green); background: var(--green-glow); color: var(--green); }

/* --- Sidebar / Mobile Menu --- */
.sidebar-overlay {
  position: fixed; inset: 0; background: #000a; z-index: 200; animation: fadeIn 0.2s ease;
}
.sidebar {
  position: fixed; top: 0; right: 0; bottom: 0; width: 280px; background: var(--bg2);
  border-left: 1px solid var(--border); padding: 20px; z-index: 201;
  animation: slideIn 0.3s ease;
}
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
.sidebar-close { background: none; border: none; color: var(--text); cursor: pointer; float: right; }
.sidebar-menu { margin-top: 40px; }
.sidebar-item {
  display: flex; align-items: center; gap: 10px; padding: 12px 0;
  border-bottom: 1px solid var(--border); color: var(--text); cursor: pointer;
  font-size: 0.9rem; transition: color 0.2s;
}
.sidebar-item:hover { color: var(--green); }

/* --- Toast --- */
.toast {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  background: var(--green); color: #fff; padding: 10px 20px; border-radius: 24px;
  font-size: 0.8rem; font-weight: 600; z-index: 300; animation: toastIn 0.3s ease;
  box-shadow: 0 4px 20px #10b98144;
}
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

/* --- Modal --- */
.modal-overlay {
  position: fixed; inset: 0; background: #000c; z-index: 300; display: flex; align-items: flex-end; justify-content: center;
}
.modal {
  background: var(--bg2); border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  width: 100%; max-width: 480px; max-height: 80vh; overflow-y: auto; padding: 20px;
  animation: modalUp 0.3s ease;
}
@keyframes modalUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.modal-handle { width: 40px; height: 4px; background: var(--border); border-radius: 2px; margin: 0 auto 16px; }

/* --- Empty State --- */
.empty-state { text-align: center; padding: 40px 20px; }
.empty-state .emoji { font-size: 2.5rem; margin-bottom: 12px; }
.empty-state p { color: var(--text3); font-size: 0.85rem; }

/* --- Misc --- */
.divider { height: 1px; background: var(--border); margin: 16px 0; }
.chip { display: inline-flex; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; font-weight: 600; }
.text-green { color: var(--green); }
.text-yellow { color: var(--yellow); }
.text-red { color: var(--red); }
.text-muted { color: var(--text3); }
.text-center { text-align: center; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
`;

// ============================================================
// COMPONENTS
// ============================================================

// --- Toast ---
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">{message}</div>;
}

// --- Header ---
function Header() {
  const { lang, setLang, page, setPage, user, setUser, setMenuOpen } = useContext(AppContext);
  const t = translations[lang].nav;
  return (
    <header className="header">
      <div className="header-logo" onClick={() => setPage("home")}>
        <img src={user?.role === "master" ? LOGO_OPEN_SM : LOGO_CLOSED_SM} alt="SlavicShkaf" style={{ height: 32, borderRadius: 4 }} />
      </div>
      <div className="header-right">
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === "ru" ? "active" : ""}`} onClick={() => setLang("ru")}>RU</button>
          <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
        </div>
        {user ? (
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>{Icons.menu}</button>
        ) : (
          <>
            <button className="header-btn" onClick={() => setPage("login")}>{t.login}</button>
            <button className="header-btn filled" onClick={() => setPage("register")}>{t.register}</button>
          </>
        )}
      </div>
    </header>
  );
}

// --- Sidebar ---
function Sidebar() {
  const { lang, user, setUser, setPage, menuOpen, setMenuOpen } = useContext(AppContext);
  const t = translations[lang].nav;
  if (!menuOpen) return null;
  const items = [
    { icon: Icons.user, label: t.profile, action: () => { setPage(user.role === "master" ? "master" : user.role === "admin" ? "admin" : "client"); setMenuOpen(false); } },
    ...(user?.role === "admin" ? [{ icon: Icons.settings, label: t.admin, action: () => { setPage("admin"); setMenuOpen(false); } }] : []),
    { icon: "—", label: t.logout, action: () => { setUser(null); setPage("home"); setMenuOpen(false); } },
  ];
  return (
    <>
      <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      <div className="sidebar">
        <button className="sidebar-close" onClick={() => setMenuOpen(false)}>{Icons.close}</button>
        <div className="sidebar-menu">
          <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{user?.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--green)", marginTop: 2 }}>
              {user?.role === "master" ? (lang === "ru" ? "Мастер" : "Tradesperson") : user?.role === "admin" ? "Admin" : (lang === "ru" ? "Заказчик" : "Client")}
            </div>
          </div>
          {items.map((item, i) => (
            <div key={i} className="sidebar-item" onClick={item.action}>
              {typeof item.icon === "string" ? item.icon : item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage() {
  const { lang, setPage } = useContext(AppContext);
  const t = translations[lang];
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>{t.hero.title}</h1>
        <p>{t.hero.subtitle}</p>
        <div className="hero-btns">
          <button className="btn btn-primary" onClick={() => setPage("register")}>{t.hero.cta}</button>
          <button className="btn btn-outline" onClick={() => setPage("register")}>{t.hero.ctaAlt}</button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">342+</div><div className="stat-label">{t.stats.masters}</div></div>
        <div className="stat-card"><div className="stat-value">22</div><div className="stat-label">{t.stats.countries}</div></div>
        <div className="stat-card"><div className="stat-value">4.8⭐</div><div className="stat-label">{t.stats.rating}</div></div>
        <div className="stat-card"><div className="stat-value">1.5K+</div><div className="stat-label">{t.stats.orders}</div></div>
      </div>

      {/* How It Works */}
      <section className="section">
        <h2 className="section-title">{t.howItWorks.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {t.howItWorks.steps.map((step, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, marginBottom: 8 }}>{i + 1}</div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: 4 }}>{step.t}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text3)", lineHeight: 1.4 }}>{step.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2 className="section-title">{t.categories.title}</h2>
        <div className="cat-grid">
          {CATEGORIES.slice(0, 8).map(c => (
            <div key={c.id} className="cat-chip">
              <span className="emoji">{c.icon}</span> {c[lang]}
            </div>
          ))}
          <div className="cat-chip" style={{ color: "var(--green)", borderColor: "var(--green)" }}>
            + {lang === "ru" ? "ещё " + (CATEGORIES.length - 8) : (CATEGORIES.length - 8) + " more"}
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-outline btn-sm">{t.categories.viewAll}</button>
        </div>
      </section>

      {/* Why */}
      <div className="why-section">
        <h2 className="section-title" style={{ color: "var(--green)" }}>{t.why.title}</h2>
        <div className="why-grid">
          {t.why.items.map((item, i) => (
            <div key={i} className="why-card">
              <h4><span className="why-icon">{[Icons.shield, Icons.star, Icons.globe, Icons.send][i]}</span> {item.t}</h4>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <section className="section">
        <h2 className="section-title">{t.testimonials.title}</h2>
        <div className="test-scroll">
          {t.testimonials.items.map((item, i) => (
            <div key={i} className="test-card">
              <div className="test-text">"{item.text}"</div>
              <div className="test-author">{item.name}</div>
              <div className="test-stars">{Array(item.rating).fill(0).map((_, j) => <span key={j}>{Icons.star}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <h2>{t.ready.title}</h2>
        <p>{t.ready.subtitle}</p>
        <div className="hero-btns">
          <button className="btn btn-primary" onClick={() => setPage("register")}>{t.ready.cta}</button>
          <button className="btn btn-outline" onClick={() => setPage("register")}>{t.ready.ctaAlt}</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>{t.footer.copy} | <a href="#">{t.footer.privacy}</a> · <a href="#">{t.footer.contact}</a></p>
      </footer>
    </>
  );
}

// ============================================================
// REGISTER PAGE
// ============================================================
function RegisterPage() {
  const { lang, setPage, setUser, showToast } = useContext(AppContext);
  const t = translations[lang].register;
  const [role, setRole] = useState("master");
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", password: "", confirmPassword: "", postalCode: "", city: "" });
  const [selectedCats, setSelectedCats] = useState([]);

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleCat = (id) => setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : prev.length < 5 ? [...prev, id] : prev);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      showToast(lang === "ru" ? "Заполните обязательные поля" : "Fill in required fields");
      return;
    }
    setUser({ id: 99, name: form.name, email: form.email, role, country: form.country, city: form.city, categories: selectedCats });
    setPage(role === "master" ? "master" : "client");
    showToast(lang === "ru" ? "Регистрация успешна!" : "Registration successful!");
  };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}>{Icons.back}</button>
        <h1 className="page-title" style={{ margin: 0 }}>{t.title}</h1>
      </div>

      <label className="form-label">{t.role}</label>
      <div className="role-toggle">
        <div className={`role-option ${role === "master" ? "active" : ""}`} onClick={() => setRole("master")}>
          <div className="role-icon">🔧</div>
          <div className="role-label">{t.master}</div>
        </div>
        <div className={`role-option ${role === "client" ? "active" : ""}`} onClick={() => setRole("client")}>
          <div className="role-icon">📋</div>
          <div className="role-label">{t.client}</div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t.name} *</label>
        <input className="form-input" placeholder={t.name} value={form.name} onChange={e => updateForm("name", e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.email} *</label>
        <input className="form-input" type="email" placeholder={t.email} value={form.email} onChange={e => updateForm("email", e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.phone}</label>
        <input className="form-input" type="tel" placeholder="+49 xxx xxx xxxx" value={form.phone} onChange={e => updateForm("phone", e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.country}</label>
        <select className="form-input" value={form.country} onChange={e => updateForm("country", e.target.value)}>
          <option value="">{t.selectCountry}</option>
          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c[lang]}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">{t.city}</label>
          <input className="form-input" placeholder={t.city} value={form.city} onChange={e => updateForm("city", e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">{t.postalCode}</label>
          <input className="form-input" placeholder="10115" value={form.postalCode} onChange={e => updateForm("postalCode", e.target.value)} />
        </div>
      </div>

      {role === "master" && (
        <div className="form-group">
          <label className="form-label">{t.categories} ({lang === "ru" ? "до 5" : "up to 5"})</label>
          <div className="cat-select-grid">
            {CATEGORIES.map(c => (
              <div key={c.id} className={`cat-select-chip ${selectedCats.includes(c.id) ? "selected" : ""}`} onClick={() => toggleCat(c.id)}>
                {c.icon} {c[lang]}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">{t.password} *</label>
        <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => updateForm("password", e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.confirmPassword}</label>
        <input className="form-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => updateForm("confirmPassword", e.target.value)} />
      </div>

      <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={handleSubmit}>{t.submit}</button>
      <div className="form-bottom">{t.hasAccount} <span className="form-link" onClick={() => setPage("login")}>{t.login}</span></div>
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage() {
  const { lang, setPage, setUser, showToast } = useContext(AppContext);
  const t = translations[lang].login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "admin@slavicshkaf.com") {
      setUser({ id: 0, name: "Admin", email, role: "admin" });
      setPage("admin");
    } else if (email.includes("master")) {
      setUser({ id: 1, name: "Андрей Петров", email, role: "master", country: "DE", city: "Berlin", categories: ["plumbing", "heating"] });
      setPage("master");
    } else {
      setUser({ id: 2, name: "Елена Волкова", email, role: "client", country: "CZ", city: "Prague" });
      setPage("client");
    }
    showToast(lang === "ru" ? "Добро пожаловать!" : "Welcome!");
  };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}>{Icons.back}</button>
        <h1 className="page-title" style={{ margin: 0 }}>{t.title}</h1>
      </div>
      <div style={{ textAlign: "center", margin: "20px 0" }}><img src={LOGO_CLOSED_LG} alt="SlavicShkaf" style={{ height: 80, borderRadius: 8 }} /></div>
      <div className="form-group">
        <label className="form-label">{t.email}</label>
        <input className="form-input" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.password}</label>
        <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <span className="form-link">{t.forgot}</span>
      </div>
      <button className="btn btn-primary btn-full" onClick={handleLogin}>{t.submit}</button>
      <div className="form-bottom">{t.noAccount} <span className="form-link" onClick={() => setPage("register")}>{t.register}</span></div>
      <div className="divider" />
      <div style={{ fontSize: "0.7rem", color: "var(--text3)", textAlign: "center" }}>
        {lang === "ru" ? "Тестовые входы:" : "Test logins:"}<br/>
        <span className="form-link" onClick={() => { setEmail("master@test.com"); }}>master@test.com</span> · <span className="form-link" onClick={() => { setEmail("client@test.com"); }}>client@test.com</span> · <span className="form-link" onClick={() => { setEmail("admin@slavicshkaf.com"); }}>admin@slavicshkaf.com</span>
      </div>
    </div>
  );
}

// ============================================================
// MASTER DASHBOARD
// ============================================================
function MasterDashboard() {
  const { lang } = useContext(AppContext);
  const t = translations[lang].masterDash;
  const tc = translations[lang].common;
  const [tab, setTab] = useState("exchange");

  const navItems = [
    { id: "exchange", icon: Icons.briefcase, label: t.exchange },
    { id: "responses", icon: Icons.list, label: t.myResponses },
    { id: "calendar", icon: Icons.calendar, label: t.calendar },
    { id: "messages", icon: Icons.message, label: t.messages },
    { id: "profile", icon: Icons.user, label: t.profile },
  ];

  return (
    <div className="dash">
      <div className="dash-content">
        {tab === "exchange" && <ExchangeTab />}
        {tab === "responses" && <ResponsesTab />}
        {tab === "calendar" && <CalendarTab />}
        {tab === "messages" && <MessagesTab />}
        {tab === "profile" && <ProfileTab />}
      </div>
      <nav className="dash-nav">
        {navItems.map(item => (
          <button key={item.id} className={`dash-nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// --- Exchange Tab (Job Board for Masters) ---
function ExchangeTab() {
  const { lang } = useContext(AppContext);
  const tc = translations[lang].common;
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = MOCK_ORDERS.filter(o => {
    const matchSearch = search === "" || o.title.toLowerCase().includes(search.toLowerCase()) || o.titleEn.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || o.category === filterCat;
    return matchSearch && matchCat;
  }).sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0));

  return (
    <>
      <div className="search-bar">
        {Icons.search}
        <input placeholder={tc.search} value={search} onChange={e => setSearch(e.target.value)} />
        <button className="filter-btn">{Icons.filter} {tc.filter}</button>
      </div>
      <div className="tabs">
        <div className={`tab ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>{tc.all}</div>
        {CATEGORIES.slice(0, 6).map(c => (
          <div key={c.id} className={`tab ${filterCat === c.id ? "active" : ""}`} onClick={() => setFilterCat(c.id)}>
            {c.icon} {c[lang]}
          </div>
        ))}
      </div>
      {filtered.map(order => (
        <div key={order.id} className={`order-card ${order.premium ? "premium" : ""}`} onClick={() => setSelectedOrder(order)}>
          {order.premium && <span className="order-badge badge-premium">{Icons.crown} {tc.premium}</span>}
          <div className="order-title">{lang === "ru" ? order.title : order.titleEn}</div>
          <div className="order-meta">
            <span>{Icons.location} {order.location}</span>
            <span>{Icons.calendar} {order.deadline}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginBottom: 8, lineHeight: 1.4 }}>
            {(lang === "ru" ? order.description : order.descriptionEn).slice(0, 80)}...
          </div>
          <div className="order-footer">
            <div className="order-budget">{order.budget}{order.currency}</div>
            <div className="order-responses">{order.responses} {lang === "ru" ? "откликов" : "responses"}</div>
          </div>
        </div>
      ))}
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  );
}

// --- Order Detail Modal ---
function OrderModal({ order, onClose }) {
  const { lang, showToast } = useContext(AppContext);
  const tc = translations[lang].common;
  const cat = CATEGORIES.find(c => c.id === order.category);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        {order.premium && <div style={{ marginBottom: 10 }}><span className="order-badge badge-premium" style={{ position: "static" }}>{Icons.crown} {tc.premium}</span></div>}
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 10 }}>{lang === "ru" ? order.title : order.titleEn}</h2>
        <div className="order-meta" style={{ marginBottom: 12 }}>
          <span>{cat?.icon} {cat?.[lang]}</span>
          <span>{Icons.location} {order.location}</span>
          <span>{Icons.calendar} {order.deadline}</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.6, marginBottom: 16 }}>
          {lang === "ru" ? order.description : order.descriptionEn}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div><span style={{ color: "var(--text3)", fontSize: "0.75rem" }}>{lang === "ru" ? "Бюджет" : "Budget"}</span><div className="order-budget" style={{ fontSize: "1.3rem" }}>{order.budget}{order.currency}</div></div>
          <div style={{ textAlign: "right" }}><span style={{ color: "var(--text3)", fontSize: "0.75rem" }}>{lang === "ru" ? "Заказчик" : "Client"}</span><div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{order.clientName}</div></div>
        </div>
        <button className="btn btn-primary btn-full" onClick={() => { showToast(lang === "ru" ? "Отклик отправлен!" : "Response sent!"); onClose(); }}>
          {tc.respond}
        </button>
        <button className="btn btn-outline btn-full" style={{ marginTop: 8 }} onClick={onClose}>{tc.cancel}</button>
      </div>
    </div>
  );
}

// --- Responses Tab ---
function ResponsesTab() {
  const { lang } = useContext(AppContext);
  return (
    <div className="empty-state">
      <div className="emoji">📬</div>
      <p>{lang === "ru" ? "У вас пока нет откликов.\nОткликнитесь на заказ из биржи!" : "You have no responses yet.\nRespond to an order from the board!"}</p>
    </div>
  );
}

// --- Calendar Tab ---
function CalendarTab() {
  const { lang } = useContext(AppContext);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;
  const today = new Date();
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const monthNames = lang === "ru"
    ? ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayLabels = lang === "ru" ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <>
      <div className="cal-header">
        <div className="cal-title">{monthNames[month]} {year}</div>
        <div className="cal-nav">
          <button onClick={prevMonth}>←</button>
          <button onClick={nextMonth}>→</button>
        </div>
      </div>
      <div className="cal-grid">
        {dayLabels.map(d => <div key={d} className="cal-day-label">{d}</div>)}
        {Array(startDay).fill(0).map((_, i) => <div key={`e${i}`} className="cal-day empty" />)}
        {Array(daysInMonth).fill(0).map((_, i) => {
          const day = i + 1;
          const hasEvent = [5, 12, 18, 25].includes(day);
          return (
            <div key={day} className={`cal-day ${isToday(day) ? "today" : ""} ${hasEvent ? "has-event" : ""}`}>
              {day}
            </div>
          );
        })}
      </div>
      <div className="divider" />
      <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: 8 }}>{lang === "ru" ? "Ближайшие события" : "Upcoming Events"}</div>
      <div className="empty-state" style={{ padding: "20px 0" }}>
        <p>{lang === "ru" ? "Нет запланированных событий" : "No upcoming events"}</p>
      </div>
    </>
  );
}

// --- Messages Tab ---
function MessagesTab() {
  const { lang } = useContext(AppContext);
  return (
    <div className="empty-state">
      <div className="emoji">💬</div>
      <p>{lang === "ru" ? "Нет новых сообщений" : "No new messages"}</p>
    </div>
  );
}

// --- Profile Tab ---
function ProfileTab() {
  const { lang, user } = useContext(AppContext);
  if (!user) return null;
  const isMaster = user.role === "master";
  const country = COUNTRIES.find(c => c.code === user.country);
  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar">{isMaster ? "🔧" : "📋"}</div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-role">{isMaster ? (lang === "ru" ? "Мастер" : "Tradesperson") : (lang === "ru" ? "Заказчик" : "Client")}</div>
      </div>
      <div className="profile-section">
        <div className="profile-section-title">{lang === "ru" ? "Личные данные" : "Personal Info"}</div>
        <div className="profile-field"><span className="profile-field-label">Email</span><span className="profile-field-value">{user.email}</span></div>
        <div className="profile-field"><span className="profile-field-label">{lang === "ru" ? "Страна" : "Country"}</span><span className="profile-field-value">{country?.[lang] || "—"}</span></div>
        <div className="profile-field"><span className="profile-field-label">{lang === "ru" ? "Город" : "City"}</span><span className="profile-field-value">{user.city || "—"}</span></div>
      </div>
      {isMaster && (
        <div className="profile-section">
          <div className="profile-section-title">{lang === "ru" ? "Специализация" : "Specialization"}</div>
          <div className="cat-select-grid">
            {(user.categories || []).map(catId => {
              const c = CATEGORIES.find(cat => cat.id === catId);
              return c ? <span key={c.id} className="cat-select-chip selected">{c.icon} {c[lang]}</span> : null;
            })}
          </div>
        </div>
      )}
      {isMaster && (
        <div className="profile-section">
          <div className="profile-section-title">{lang === "ru" ? "Документы / Лицензии" : "Documents / Licenses"}</div>
          <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius)", padding: 20, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>📄</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{lang === "ru" ? "Нажмите для загрузки документов" : "Tap to upload documents"}</div>
          </div>
        </div>
      )}
      <button className="btn btn-outline btn-full">{lang === "ru" ? "Редактировать профиль" : "Edit Profile"}</button>
    </>
  );
}

// ============================================================
// CLIENT DASHBOARD
// ============================================================
function ClientDashboard() {
  const { lang } = useContext(AppContext);
  const t = translations[lang].clientDash;
  const [tab, setTab] = useState("myOrders");

  const navItems = [
    { id: "newOrder", icon: Icons.plus, label: t.newOrder },
    { id: "myOrders", icon: Icons.list, label: t.myOrders },
    { id: "masters", icon: Icons.users, label: t.masters },
    { id: "messages", icon: Icons.message, label: t.messages },
    { id: "profile", icon: Icons.user, label: t.profile },
  ];

  return (
    <div className="dash">
      <div className="dash-content">
        {tab === "newOrder" && <NewOrderTab />}
        {tab === "myOrders" && <MyOrdersTab />}
        {tab === "masters" && <MastersCatalogTab />}
        {tab === "messages" && <MessagesTab />}
        {tab === "profile" && <ProfileTab />}
      </div>
      <nav className="dash-nav">
        {navItems.map(item => (
          <button key={item.id} className={`dash-nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// --- New Order Tab ---
function NewOrderTab() {
  const { lang, showToast } = useContext(AppContext);
  const t = translations[lang].orderForm;
  const [form, setForm] = useState({ category: "", description: "", budget: "", deadline: "", location: "" });
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <>
      <h2 className="page-title">{t.title}</h2>
      <div className="form-group">
        <label className="form-label">{t.category}</label>
        <select className="form-input" value={form.category} onChange={e => update("category", e.target.value)}>
          <option value="">{t.selectCategory}</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c[lang]}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">{t.description}</label>
        <textarea className="form-input" placeholder={lang === "ru" ? "Опишите подробно что нужно сделать..." : "Describe in detail what needs to be done..."} value={form.description} onChange={e => update("description", e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">{t.budget}</label>
          <input className="form-input" type="number" placeholder="1500" value={form.budget} onChange={e => update("budget", e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">{t.deadline}</label>
          <input className="form-input" type="date" value={form.deadline} onChange={e => update("deadline", e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">{t.location}</label>
        <input className="form-input" placeholder={lang === "ru" ? "Город, район..." : "City, area..."} value={form.location} onChange={e => update("location", e.target.value)} />
      </div>
      <button className="btn btn-primary btn-full" onClick={() => showToast(lang === "ru" ? "Заказ опубликован!" : "Order published!")}>
        {t.submit}
      </button>
    </>
  );
}

// --- My Orders Tab ---
function MyOrdersTab() {
  const { lang } = useContext(AppContext);
  return (
    <>
      <h2 className="page-title" style={{ fontSize: "1rem" }}>{lang === "ru" ? "Мои заказы" : "My Orders"}</h2>
      {MOCK_ORDERS.slice(0, 3).map(order => (
        <div key={order.id} className="order-card">
          <div className="order-title">{lang === "ru" ? order.title : order.titleEn}</div>
          <div className="order-meta">
            <span>{Icons.location} {order.location}</span>
            <span><span className={`status-badge status-${order.status}`}>{order.status}</span></span>
          </div>
          <div className="order-footer">
            <div className="order-budget">{order.budget}{order.currency}</div>
            <div className="order-responses">{order.responses} {lang === "ru" ? "откликов" : "responses"}</div>
          </div>
        </div>
      ))}
    </>
  );
}

// --- Masters Catalog Tab ---
function MastersCatalogTab() {
  const { lang } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const tc = translations[lang].common;

  const filtered = MOCK_MASTERS.filter(m => {
    const name = (lang === "ru" ? m.name : m.nameEn).toLowerCase();
    const matchSearch = search === "" || name.includes(search.toLowerCase());
    const matchCat = filterCat === "all" || m.categories.includes(filterCat);
    return matchSearch && matchCat;
  });

  return (
    <>
      <div className="search-bar">
        {Icons.search}
        <input placeholder={tc.search} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="tabs">
        <div className={`tab ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>{tc.all}</div>
        {CATEGORIES.map(c => (
          <div key={c.id} className={`tab ${filterCat === c.id ? "active" : ""}`} onClick={() => setFilterCat(c.id)}>
            {c.icon} {c[lang]}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="emoji">🔍</div>
          <p>{lang === "ru" ? "Мастера не найдены. Попробуйте другую категорию." : "No masters found. Try another category."}</p>
        </div>
      )}
      {filtered.map(m => {
        const cats = m.categories.map(cid => CATEGORIES.find(c => c.id === cid)).filter(Boolean);
        return (
          <div key={m.id} className={`master-card ${m.premium ? "premium" : ""}`}>
            <div className="master-avatar">🔧</div>
            <div className="master-info">
              <div className="master-name">
                {lang === "ru" ? m.name : m.nameEn}
                {m.premium && <span>{Icons.crown}</span>}
              </div>
              <div className="master-cats">{cats.map(c => c[lang]).join(" · ")}</div>
              <div className="master-stats">
                <div className="master-rating">{Icons.star} {m.rating}</div>
                <div className="master-reviews">({m.reviews})</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text3)" }}>{Icons.location} {m.city}, {m.country}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel() {
  const { lang } = useContext(AppContext);
  const t = translations[lang].admin;
  const [tab, setTab] = useState("stats");

  const navItems = [
    { id: "stats", icon: Icons.chart, label: t.stats },
    { id: "users", icon: Icons.users, label: t.users },
    { id: "orders", icon: Icons.list, label: t.orders },
    { id: "tops", icon: Icons.crown, label: t.tops },
    { id: "broadcast", icon: Icons.send, label: t.broadcast },
  ];

  return (
    <div className="dash">
      <div className="dash-content">
        {tab === "stats" && <AdminStatsTab />}
        {tab === "users" && <AdminUsersTab />}
        {tab === "orders" && <AdminOrdersTab />}
        {tab === "tops" && <AdminTopsTab />}
        {tab === "broadcast" && <AdminBroadcastTab />}
      </div>
      <nav className="dash-nav">
        {navItems.map(item => (
          <button key={item.id} className={`dash-nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// --- Admin Stats ---
function AdminStatsTab() {
  const { lang } = useContext(AppContext);
  const stats = [
    { value: "342", label: lang === "ru" ? "Мастеров" : "Masters" },
    { value: "1,247", label: lang === "ru" ? "Заказчиков" : "Clients" },
    { value: "856", label: lang === "ru" ? "Заказов" : "Orders" },
    { value: "€47.2K", label: lang === "ru" ? "Оборот" : "Revenue" },
  ];
  const weeklyData = [
    { label: lang === "ru" ? "Пн" : "Mo", val: 12 },
    { label: lang === "ru" ? "Вт" : "Tu", val: 19 },
    { label: lang === "ru" ? "Ср" : "We", val: 8 },
    { label: lang === "ru" ? "Чт" : "Th", val: 25 },
    { label: lang === "ru" ? "Пт" : "Fr", val: 15 },
    { label: lang === "ru" ? "Сб" : "Sa", val: 22 },
    { label: lang === "ru" ? "Вс" : "Su", val: 11 },
  ];
  const maxVal = Math.max(...weeklyData.map(d => d.val));

  return (
    <>
      <h2 className="page-title" style={{ fontSize: "1rem" }}>{lang === "ru" ? "Статистика" : "Statistics"}</h2>
      <div className="admin-grid">
        {stats.map((s, i) => (
          <div key={i} className="admin-stat">
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 16 }}>{lang === "ru" ? "Новые регистрации за неделю" : "New registrations this week"}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {weeklyData.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: `${(d.val / maxVal) * 70}px`, background: "var(--green)", borderRadius: "4px 4px 0 0", marginBottom: 4, transition: "height 0.3s" }} />
              <div style={{ fontSize: "0.6rem", color: "var(--text3)" }}>{d.label}</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--green)" }}>{d.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 12 }}>{lang === "ru" ? "Популярные категории" : "Popular Categories"}</div>
        {[{ cat: "renovation", pct: 85 }, { cat: "plumbing", pct: 72 }, { cat: "electrical", pct: 65 }, { cat: "painting", pct: 48 }, { cat: "tiling", pct: 41 }].map(({ cat, pct }) => {
          const c = CATEGORIES.find(ca => ca.id === cat);
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 3 }}>
                <span>{c?.icon} {c?.[lang]}</span><span className="text-green">{pct}%</span>
              </div>
              <div style={{ height: 6, background: "var(--bg3)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--green)", borderRadius: 3, transition: "width 0.5s" }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// --- Admin Users ---
function AdminUsersTab() {
  const { lang, showToast } = useContext(AppContext);
  const [filter, setFilter] = useState("all");
  const filtered = MOCK_USERS.filter(u => filter === "all" || u.role === filter);
  return (
    <>
      <h2 className="page-title" style={{ fontSize: "1rem" }}>{lang === "ru" ? "Пользователи" : "Users"}</h2>
      <div className="tabs">
        {[{ id: "all", label: lang === "ru" ? "Все" : "All" }, { id: "master", label: lang === "ru" ? "Мастера" : "Masters" }, { id: "client", label: lang === "ru" ? "Заказчики" : "Clients" }].map(t => (
          <div key={t.id} className={`tab ${filter === t.id ? "active" : ""}`} onClick={() => setFilter(t.id)}>{t.label}</div>
        ))}
      </div>
      {filtered.map(u => (
        <div key={u.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{u.name}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text3)" }}>{u.email} · {u.role === "master" ? "🔧" : "📋"} {u.country}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span className={`status-badge ${u.status === "active" ? "status-active" : "status-blocked"}`}>{u.status}</span>
            <button className="btn btn-sm btn-outline" style={{ padding: "4px 8px", fontSize: "0.65rem" }}
              onClick={() => showToast(u.status === "active" ? (lang === "ru" ? "Заблокирован" : "Blocked") : (lang === "ru" ? "Разблокирован" : "Unblocked"))}>
              {u.status === "active" ? "🚫" : "✅"}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

// --- Admin Orders ---
function AdminOrdersTab() {
  const { lang, showToast } = useContext(AppContext);
  return (
    <>
      <h2 className="page-title" style={{ fontSize: "1rem" }}>{lang === "ru" ? "Управление заказами" : "Order Management"}</h2>
      {MOCK_ORDERS.map(o => (
        <div key={o.id} className={`order-card ${o.premium ? "premium" : ""}`}>
          {o.premium && <span className="order-badge badge-premium">{Icons.crown}</span>}
          <div className="order-title">{lang === "ru" ? o.title : o.titleEn}</div>
          <div className="order-meta">
            <span>{Icons.location} {o.location}</span>
            <span>{o.clientName}</span>
            <span>{o.budget}€</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <button className="btn btn-sm btn-primary" style={{ padding: "4px 10px", fontSize: "0.65rem" }} onClick={() => showToast(lang === "ru" ? "Добавлено в ТОП" : "Added to TOP")}>⭐ TOP</button>
            <button className="btn btn-sm btn-outline" style={{ padding: "4px 10px", fontSize: "0.65rem" }} onClick={() => showToast(lang === "ru" ? "Удалено" : "Deleted")}>🗑️</button>
          </div>
        </div>
      ))}
    </>
  );
}

// --- Admin Tops ---
function AdminTopsTab() {
  const { lang, showToast } = useContext(AppContext);
  return (
    <>
      <h2 className="page-title" style={{ fontSize: "1rem" }}>TOP / Premium</h2>
      <p style={{ fontSize: "0.8rem", color: "var(--text3)", marginBottom: 16 }}>
        {lang === "ru" ? "Управляйте премиальными размещениями. ТОП-объявления отображаются первыми в ленте." : "Manage premium placements. TOP ads are shown first in the feed."}
      </p>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 10 }}>{lang === "ru" ? "Активные ТОП-объявления" : "Active TOP Listings"}</div>
      {MOCK_ORDERS.filter(o => o.premium).map(o => (
        <div key={o.id} className="order-card premium">
          <span className="order-badge badge-premium">{Icons.crown} PREMIUM</span>
          <div className="order-title">{lang === "ru" ? o.title : o.titleEn}</div>
          <div className="order-meta"><span>{o.clientName}</span><span>{o.budget}€</span></div>
          <button className="btn btn-sm btn-outline" style={{ marginTop: 8, fontSize: "0.65rem" }} onClick={() => showToast(lang === "ru" ? "Снято с ТОП" : "Removed from TOP")}>
            {lang === "ru" ? "Снять ТОП" : "Remove TOP"}
          </button>
        </div>
      ))}
      <div className="divider" />
      <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 10 }}>{lang === "ru" ? "Добавить в ТОП" : "Add to TOP"}</div>
      {MOCK_ORDERS.filter(o => !o.premium).slice(0, 3).map(o => (
        <div key={o.id} className="order-card">
          <div className="order-title">{lang === "ru" ? o.title : o.titleEn}</div>
          <div className="order-meta"><span>{o.clientName}</span><span>{o.budget}€</span></div>
          <button className="btn btn-sm btn-yellow" style={{ marginTop: 8, fontSize: "0.65rem" }} onClick={() => showToast(lang === "ru" ? "Добавлено в ТОП!" : "Added to TOP!")}>
            ⭐ {lang === "ru" ? "Сделать ТОП" : "Make TOP"}
          </button>
        </div>
      ))}
    </>
  );
}

// --- Admin Broadcast ---
function AdminBroadcastTab() {
  const { lang, showToast } = useContext(AppContext);
  const [target, setTarget] = useState("all");
  const [message, setMessage] = useState("");

  return (
    <>
      <h2 className="page-title" style={{ fontSize: "1rem" }}>{lang === "ru" ? "Рассылка через бота" : "Bot Broadcast"}</h2>
      <p style={{ fontSize: "0.75rem", color: "var(--text3)", marginBottom: 12 }}>
        {lang === "ru" ? "Отправьте сообщение пользователям через Telegram бота" : "Send a message to users via Telegram bot"}
      </p>
      <div className="form-label">{lang === "ru" ? "Получатели" : "Recipients"}</div>
      <div className="broadcast-target">
        {[
          { id: "all", label: lang === "ru" ? "Всем" : "All" },
          { id: "masters", label: lang === "ru" ? "Мастера" : "Masters" },
          { id: "clients", label: lang === "ru" ? "Заказчики" : "Clients" },
        ].map(t => (
          <button key={t.id} className={`target-btn ${target === t.id ? "active" : ""}`} onClick={() => setTarget(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="form-group">
        <label className="form-label">{lang === "ru" ? "Текст сообщения" : "Message text"}</label>
        <textarea className="form-input" rows={5} placeholder={lang === "ru" ? "Введите текст рассылки..." : "Enter broadcast message..."} value={message} onChange={e => setMessage(e.target.value)} style={{ minHeight: 120 }} />
      </div>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 12, marginBottom: 16 }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: 6 }}>{lang === "ru" ? "Предпросмотр" : "Preview"}</div>
        <div style={{ background: "var(--bg3)", borderRadius: "var(--radius-sm)", padding: 10, fontSize: "0.8rem", color: "var(--text2)", lineHeight: 1.5, minHeight: 40 }}>
          {message || (lang === "ru" ? "Текст сообщения появится здесь..." : "Message preview will appear here...")}
        </div>
      </div>
      <div style={{ fontSize: "0.7rem", color: "var(--text3)", marginBottom: 12 }}>
        📊 {lang === "ru" ? "Получателей:" : "Recipients:"} {target === "all" ? "1,589" : target === "masters" ? "342" : "1,247"}
      </div>
      <button className="btn btn-primary btn-full" onClick={() => {
        if (!message.trim()) { showToast(lang === "ru" ? "Введите текст" : "Enter message text"); return; }
        showToast(lang === "ru" ? `Рассылка отправлена: ${target === "all" ? "всем" : target === "masters" ? "мастерам" : "заказчикам"}!` : `Broadcast sent to ${target}!`);
        setMessage("");
      }}>
        {Icons.send} {lang === "ru" ? "Отправить рассылку" : "Send Broadcast"}
      </button>
    </>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [lang, setLang] = useState("ru");
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => { setToast(msg); }, []);

  const ctx = useMemo(() => ({
    lang, setLang, page, setPage, user, setUser, menuOpen, setMenuOpen, showToast,
  }), [lang, page, user, menuOpen, showToast]);

  return (
    <AppContext.Provider value={ctx}>
      <style>{CSS}</style>
      <div className="app">
        <Header />
        <Sidebar />
        {page === "home" && <LandingPage />}
        {page === "register" && <RegisterPage />}
        {page === "login" && <LoginPage />}
        {page === "master" && <MasterDashboard />}
        {page === "client" && <ClientDashboard />}
        {page === "admin" && <AdminPanel />}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </AppContext.Provider>
  );
}
