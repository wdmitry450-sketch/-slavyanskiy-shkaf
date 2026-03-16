(() => {
  // build-entry.jsx

  var _isTMA = !!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData);
  var _isWide = function() { return !_isTMA && window.innerWidth > 768; };
  var { useState, useEffect, useCallback, useRef, useMemo, createContext, useContext } = React;
  var LOGO_CLOSED_SM = "/logo-closed.png";
  var LOGO_OPEN_SM = "/logo-open.png";
  var LOGO_CLOSED_LG = "/logo-closed.png";
  var translations = {
    ru: {
      nav: { home: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F", login: "\u0412\u0445\u043E\u0434", register: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F", profile: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", logout: "\u0412\u044B\u0445\u043E\u0434", admin: "\u0410\u0434\u043C\u0438\u043D\u043A\u0430" },
      hero: {
        title: "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0435 \u043C\u0430\u0441\u0442\u0435\u0440\u0430\n\u043F\u043E \u0432\u0441\u0435\u0439 \u0415\u0432\u0440\u043E\u043F\u0435",
        subtitle: "\u041D\u0430\u043D\u0438\u043C\u0430\u0439\u0442\u0435 \u2022 \u0421\u0442\u0440\u043E\u0439\u0442\u0435\u0441\u044C \u2022 \u0413\u0430\u0440\u0430\u043D\u0442\u0438\u044F \u2014 \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0435 \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043C\u0430\u0441\u0442\u0435\u0440\u0430 \u0437\u0430 5 \u043C\u0438\u043D\u0443\u0442",
        cta: "\u042F \u043C\u0430\u0441\u0442\u0435\u0440",
        ctaAlt: "\u0418\u0449\u0443 \u043C\u0430\u0441\u0442\u0435\u0440\u0430"
      },
      stats: { masters: "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0445 \u043C\u0430\u0441\u0442\u0435\u0440\u043E\u0432", countries: "\u0421\u0442\u0440\u0430\u043D \u0415\u0432\u0440\u043E\u043F\u044B", rating: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0439\u0442\u0438\u043D\u0433", orders: "\u0417\u0430\u043A\u0440\u044B\u0442\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432" },
      howItWorks: {
        title: "\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442",
        steps: [
          { t: "\u041C\u0430\u0441\u0442\u0435\u0440 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0435\u0442\u0441\u044F", d: "\u0417\u0430\u043F\u043E\u043B\u043D\u044F\u0435\u0442 \u043F\u0440\u043E\u0444\u0438\u043B\u044C, \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u043F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E" },
          { t: "\u041A\u043B\u0438\u0435\u043D\u0442 \u0441\u043E\u0437\u0434\u0430\u0451\u0442 \u0437\u0430\u043A\u0430\u0437", d: "\u041E\u043F\u0438\u0441\u044B\u0432\u0430\u0435\u0442 \u0437\u0430\u0434\u0430\u0447\u0443, \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0431\u044E\u0434\u0436\u0435\u0442 \u0438 \u0441\u0440\u043E\u043A\u0438" },
          { t: "\u041C\u0430\u0441\u0442\u0435\u0440\u0430 \u043E\u0442\u043A\u043B\u0438\u043A\u0430\u044E\u0442\u0441\u044F", d: "\u0412\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u043E\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0445 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u043E\u0432" },
          { t: "\u0420\u0430\u0431\u043E\u0442\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430", d: "\u041E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442\u0435 \u043E\u0442\u0437\u044B\u0432 \u0438 \u043E\u0446\u0435\u043D\u043A\u0443 \u043C\u0430\u0441\u0442\u0435\u0440\u0443" }
        ]
      },
      categories: {
        title: "\u041D\u0430\u0439\u0434\u0438\u0442\u0435 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0430",
        viewAll: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435\u0445 \u043C\u0430\u0441\u0442\u0435\u0440\u043E\u0432"
      },
      why: {
        title: "\u041F\u043E\u0447\u0435\u043C\u0443 Slavic Shkaf?",
        items: [
          { t: "\u0412\u0435\u0440\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043C\u0430\u0441\u0442\u0435\u0440\u0430", d: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D \u0438 \u0438\u043C\u0435\u0435\u0442 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0451\u043D\u043D\u044B\u0439 \u043E\u043F\u044B\u0442 \u0440\u0430\u0431\u043E\u0442\u044B" },
          { t: "\u0413\u0430\u0440\u0430\u043D\u0442\u0438\u044F \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430", d: "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u043E\u0434\u0430\u0442\u0435\u043B\u0438 \u0438 \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u043E\u0432\u0430\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0430 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430" },
          { t: "\u041F\u043E \u0432\u0441\u0435\u0439 \u0415\u0432\u0440\u043E\u043F\u0435", d: "\u041D\u0430\u0439\u0434\u0438\u0442\u0435 \u043C\u0430\u0441\u0442\u0435\u0440\u0430 \u0438\u0437 22+ \u0441\u0442\u0440\u0430\u043D \u2014 \u0432\u0441\u0435\u0433\u0434\u0430 \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438" },
          { t: "\u0411\u044B\u0441\u0442\u0440\u043E \u0438 \u043F\u0440\u043E\u0441\u0442\u043E", d: "\u0420\u0430\u0437\u043C\u0435\u0449\u0430\u0435\u0442\u0435 \u0437\u0430\u043A\u0430\u0437 \u2014 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0435 \u043E\u0442\u043A\u043B\u0438\u043A. \u0420\u0430\u0431\u043E\u0442\u0430\u0435\u043C \u0447\u0435\u0440\u0435\u0437 Telegram" }
        ]
      },
      testimonials: {
        title: "\u0427\u0442\u043E \u0433\u043E\u0432\u043E\u0440\u044F\u0442 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
        items: [
          { text: "\u041D\u0430\u0448\u0451\u043B \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0433\u043E \u0441\u0430\u043D\u0442\u0435\u0445\u043D\u0438\u043A\u0430 \u0437\u0430 20 \u043C\u0438\u043D\u0443\u0442. \u0412\u0441\u0451 \u043F\u043E\u0447\u0438\u043D\u0438\u043B \u0437\u0430 \u043F\u0430\u0440\u0443 \u0447\u0430\u0441\u043E\u0432!", name: "\u0410\u043B\u0435\u043A\u0441, \u0411\u0435\u0440\u043B\u0438\u043D", rating: 5 },
          { text: "\u041A\u0430\u043A \u043C\u0430\u0441\u0442\u0435\u0440, \u043F\u043E\u043B\u0443\u0447\u0430\u044E \u0437\u0430\u043A\u0430\u0437\u044B \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C. \u041E\u0447\u0435\u043D\u044C \u0443\u0434\u043E\u0431\u043D\u0430\u044F \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430!", name: "\u0421\u0435\u0440\u0433\u0435\u0439, \u041F\u0440\u0430\u0433\u0430", rating: 5 },
          { text: "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0435\u043C\u043E\u043D\u0442, \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u043E\u0442\u043A\u043B\u0438\u043A \u043C\u0430\u0441\u0442\u0435\u0440\u043E\u0432. \u041F\u0435\u0440\u0435\u0435\u0445\u0430\u043B\u0430 \u0438 \u043D\u0430\u0448\u043B\u0430 \u043C\u0430\u0441\u0442\u0435\u0440\u0430!", name: "\u0410\u043D\u043D\u0430, \u0412\u0430\u0440\u0448\u0430\u0432\u0430", rating: 5 }
        ]
      },
      ready: { title: "\u0413\u043E\u0442\u043E\u0432\u044B \u043D\u0430\u0447\u0430\u0442\u044C?", subtitle: "\u041F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u044F\u0439\u0442\u0435\u0441\u044C \u043A 342+ \u043C\u0430\u0441\u0442\u0435\u0440\u0430\u043C \u0438 \u043D\u0430\u0439\u0434\u0438\u0442\u0435 \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0430 \u0434\u043B\u044F \u0441\u0432\u043E\u0435\u0439 \u0437\u0430\u0434\u0430\u0447\u0438", cta: "\u042F \u043C\u0430\u0441\u0442\u0435\u0440", ctaAlt: "\u0418\u0449\u0443 \u043C\u0430\u0441\u0442\u0435\u0440\u0430" },
      footer: { copy: "\xA9 2025 Slavic Shkaf. \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B.", privacy: "\u0423\u0441\u043B\u043E\u0432\u0438\u044F", contact: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B" },
      register: {
        title: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F",
        role: "\u042F \u044F\u0432\u043B\u044F\u044E\u0441\u044C",
        master: "\u041C\u0430\u0441\u0442\u0435\u0440",
        client: "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A",
        name: "\u0424\u0418\u041E",
        email: "\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430\u044F \u043F\u043E\u0447\u0442\u0430",
        phone: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430",
        country: "\u0421\u0442\u0440\u0430\u043D\u0430",
        selectCountry: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0443",
        categories: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u0440\u0430\u0431\u043E\u0442",
        password: "\u041F\u0430\u0440\u043E\u043B\u044C",
        confirmPassword: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C",
        postalCode: "\u041F\u043E\u0447\u0442\u043E\u0432\u044B\u0439 \u0438\u043D\u0434\u0435\u043A\u0441",
        city: "\u0413\u043E\u0440\u043E\u0434",
        submit: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
        hasAccount: "\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442?",
        login: "\u0412\u043E\u0439\u0442\u0438"
      },
      login: {
        title: "\u0412\u0445\u043E\u0434",
        email: "\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430\u044F \u043F\u043E\u0447\u0442\u0430",
        password: "\u041F\u0430\u0440\u043E\u043B\u044C",
        submit: "\u0412\u043E\u0439\u0442\u0438",
        noAccount: "\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430?",
        register: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
        forgot: "\u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C?"
      },
      masterDash: {
        exchange: "\u0411\u0438\u0440\u0436\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432",
        profile: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C",
        calendar: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
        myResponses: "\u041C\u043E\u0438 \u043E\u0442\u043A\u043B\u0438\u043A\u0438",
        messages: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F"
      },
      clientDash: {
        newOrder: "\u041D\u043E\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437",
        myOrders: "\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B",
        profile: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C",
        masters: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043C\u0430\u0441\u0442\u0435\u0440\u043E\u0432",
        messages: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F"
      },
      admin: {
        users: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
        orders: "\u0417\u0430\u043A\u0430\u0437\u044B",
        tops: "\u0422\u041E\u041F / \u041F\u0440\u0435\u043C\u0438\u0443\u043C",
        stats: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430",
        broadcast: "\u0420\u0430\u0441\u0441\u044B\u043B\u043A\u0430",
        settings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
        categories: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438",
        reports: "\u0416\u0430\u043B\u043E\u0431\u044B"
      },
      orderForm: {
        title: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437",
        category: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u0440\u0430\u0431\u043E\u0442",
        selectCategory: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E",
        description: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u044B",
        budget: "\u0411\u044E\u0434\u0436\u0435\u0442 (\u20AC)",
        deadline: "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",
        location: "\u0410\u0434\u0440\u0435\u0441 / \u0420\u0430\u0439\u043E\u043D",
        submit: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437"
      },
      common: {
        search: "\u041F\u043E\u0438\u0441\u043A...",
        filter: "\u0424\u0438\u043B\u044C\u0442\u0440",
        apply: "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",
        cancel: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C",
        save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
        delete: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
        edit: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
        back: "\u041D\u0430\u0437\u0430\u0434",
        loading: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...",
        noResults: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
        respond: "\u041E\u0442\u043A\u043B\u0438\u043A\u043D\u0443\u0442\u044C\u0441\u044F",
        details: "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435",
        all: "\u0412\u0441\u0435",
        today: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
        send: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
        premium: "\u041F\u0420\u0415\u041C\u0418\u0423\u041C",
        top: "\u0422\u041E\u041F"
      }
    },
    en: {
      nav: { home: "Home", login: "Login", register: "Register", profile: "Profile", logout: "Logout", admin: "Admin" },
      hero: {
        title: "Verified Tradespeople\nAcross Europe",
        subtitle: "Hire \u2022 Build \u2022 Guarantee \u2014 find the perfect tradesperson in 5 minutes",
        cta: "I'm a tradesperson",
        ctaAlt: "I need a tradesperson"
      },
      stats: { masters: "Verified tradespeople", countries: "European countries", rating: "Average rating", orders: "Completed orders" },
      howItWorks: {
        title: "How It Works",
        steps: [
          { t: "Tradesperson registers", d: "Fill profile, add portfolio" },
          { t: "Client creates order", d: "Describe the task, set budget and deadlines" },
          { t: "Tradespeople respond", d: "Get proposals from verified specialists" },
          { t: "Job completed", d: "Leave a review and rate the tradesperson" }
        ]
      },
      categories: {
        title: "Find a Specialist",
        viewAll: "View all tradespeople"
      },
      why: {
        title: "Why Slavic Shkaf?",
        items: [
          { t: "Verified Tradespeople", d: "Each specialist is vetted with confirmed work experience" },
          { t: "Quality Guarantee", d: "Verified employers and a quality rating system" },
          { t: "All Across Europe", d: "Find a tradesperson from 22+ countries \u2014 always nearby" },
          { t: "Fast & Simple", d: "Post an order \u2014 get a response. We work through Telegram" }
        ]
      },
      testimonials: {
        title: "What Our Users Say",
        items: [
          { text: "Found an excellent plumber in 20 minutes. Fixed everything in a couple of hours!", name: "Alex, Berlin", rating: 5 },
          { text: "As a tradesperson, I get orders every day. Very convenient platform!", name: "Sergei, Prague", rating: 5 },
          { text: "Professional renovation, quick response from tradespeople. Moved and found a master!", name: "Anna, Warsaw", rating: 5 }
        ]
      },
      ready: { title: "Ready to Start?", subtitle: "Join 342+ tradespeople and find the perfect specialist for your task", cta: "I'm a tradesperson", ctaAlt: "I need a tradesperson" },
      footer: { copy: "\xA9 2025 Slavic Shkaf. All rights reserved.", privacy: "Terms", contact: "Contacts" },
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
        login: "Log in"
      },
      login: {
        title: "Login",
        email: "Email",
        password: "Password",
        submit: "Log in",
        noAccount: "Don't have an account?",
        register: "Register",
        forgot: "Forgot password?"
      },
      masterDash: {
        exchange: "Job Board",
        profile: "Profile",
        calendar: "Calendar",
        myResponses: "My Responses",
        messages: "Messages"
      },
      clientDash: {
        newOrder: "New Order",
        myOrders: "My Orders",
        profile: "Profile",
        masters: "Browse Masters",
        messages: "Messages"
      },
      admin: {
        users: "Users",
        orders: "Orders",
        tops: "TOP / Premium",
        stats: "Statistics",
        broadcast: "Broadcast",
        settings: "Settings",
        categories: "Categories",
        reports: "Reports"
      },
      orderForm: {
        title: "Create Order",
        category: "Work Category",
        selectCategory: "Select category",
        description: "Job Description",
        budget: "Budget (\u20AC)",
        deadline: "Deadline",
        location: "Address / Area",
        submit: "Publish Order"
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
        top: "TOP"
      }
    }
  };
  var CATEGORIES = [
    { id: "plumbing", icon: "\u{1F527}", ru: "\u0421\u0430\u043D\u0442\u0435\u0445\u043D\u0438\u043A\u0430", en: "Plumbing" },
    { id: "electrical", icon: "\u26A1", ru: "\u042D\u043B\u0435\u043A\u0442\u0440\u0438\u043A\u0430", en: "Electrical" },
    { id: "painting", icon: "\u{1F3A8}", ru: "\u041C\u0430\u043B\u044F\u0440\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B", en: "Painting" },
    { id: "tiling", icon: "\u{1F9F1}", ru: "\u041F\u043B\u0438\u0442\u043E\u0447\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B", en: "Tiling" },
    { id: "renovation", icon: "\u{1F3E0}", ru: "\u0420\u0435\u043C\u043E\u043D\u0442 \u043A\u0432\u0430\u0440\u0442\u0438\u0440", en: "Renovation" },
    { id: "roofing", icon: "\u{1F3D7}\uFE0F", ru: "\u041A\u0440\u043E\u0432\u043B\u044F", en: "Roofing" },
    { id: "carpentry", icon: "\u{1FA9A}", ru: "\u0421\u0442\u043E\u043B\u044F\u0440\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B", en: "Carpentry" },
    { id: "welding", icon: "\u{1F525}", ru: "\u0421\u0432\u0430\u0440\u043A\u0430", en: "Welding" },
    { id: "heating", icon: "\u{1F321}\uFE0F", ru: "\u041E\u0442\u043E\u043F\u043B\u0435\u043D\u0438\u0435", en: "Heating" },
    { id: "ac", icon: "\u2744\uFE0F", ru: "\u041A\u043E\u043D\u0434\u0438\u0446\u0438\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435", en: "Air Conditioning" },
    { id: "plastering", icon: "\u{1F9F9}", ru: "\u0428\u0442\u0443\u043A\u0430\u0442\u0443\u0440\u043A\u0430", en: "Plastering" },
    { id: "drywall", icon: "\u{1F4D0}", ru: "\u0413\u0438\u043F\u0441\u043E\u043A\u0430\u0440\u0442\u043E\u043D", en: "Drywall" },
    { id: "flooring", icon: "\u{1FAB5}", ru: "\u041F\u043E\u043B\u044B", en: "Flooring" },
    { id: "facades", icon: "\u{1F3E2}", ru: "\u0424\u0430\u0441\u0430\u0434\u044B", en: "Facades" },
    { id: "landscaping", icon: "\u{1F33F}", ru: "\u041B\u0430\u043D\u0434\u0448\u0430\u0444\u0442", en: "Landscaping" },
    { id: "cleaning", icon: "\u{1F9FD}", ru: "\u041A\u043B\u0438\u043D\u0438\u043D\u0433", en: "Cleaning" },
    { id: "moving", icon: "\u{1F4E6}", ru: "\u041F\u0435\u0440\u0435\u0435\u0437\u0434\u044B", en: "Moving" },
    { id: "windows", icon: "\u{1FA9F}", ru: "\u041E\u043A\u043D\u0430 \u0438 \u0434\u0432\u0435\u0440\u0438", en: "Windows & Doors" },
    { id: "furniture", icon: "\u{1F6CB}\uFE0F", ru: "\u041C\u0435\u0431\u0435\u043B\u044C", en: "Furniture" },
    { id: "design", icon: "\u270F\uFE0F", ru: "\u0414\u0438\u0437\u0430\u0439\u043D \u0438\u043D\u0442\u0435\u0440\u044C\u0435\u0440\u0430", en: "Interior Design" }
  ];
  var COUNTRIES = [
    { code: "DE", ru: "\u0413\u0435\u0440\u043C\u0430\u043D\u0438\u044F", en: "Germany" },
    { code: "FR", ru: "\u0424\u0440\u0430\u043D\u0446\u0438\u044F", en: "France" },
    { code: "IT", ru: "\u0418\u0442\u0430\u043B\u0438\u044F", en: "Italy" },
    { code: "ES", ru: "\u0418\u0441\u043F\u0430\u043D\u0438\u044F", en: "Spain" },
    { code: "PT", ru: "\u041F\u043E\u0440\u0442\u0443\u0433\u0430\u043B\u0438\u044F", en: "Portugal" },
    { code: "NL", ru: "\u041D\u0438\u0434\u0435\u0440\u043B\u0430\u043D\u0434\u044B", en: "Netherlands" },
    { code: "BE", ru: "\u0411\u0435\u043B\u044C\u0433\u0438\u044F", en: "Belgium" },
    { code: "AT", ru: "\u0410\u0432\u0441\u0442\u0440\u0438\u044F", en: "Austria" },
    { code: "CH", ru: "\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044F", en: "Switzerland" },
    { code: "PL", ru: "\u041F\u043E\u043B\u044C\u0448\u0430", en: "Poland" },
    { code: "CZ", ru: "\u0427\u0435\u0445\u0438\u044F", en: "Czech Republic" },
    { code: "SK", ru: "\u0421\u043B\u043E\u0432\u0430\u043A\u0438\u044F", en: "Slovakia" },
    { code: "HU", ru: "\u0412\u0435\u043D\u0433\u0440\u0438\u044F", en: "Hungary" },
    { code: "RO", ru: "\u0420\u0443\u043C\u044B\u043D\u0438\u044F", en: "Romania" },
    { code: "BG", ru: "\u0411\u043E\u043B\u0433\u0430\u0440\u0438\u044F", en: "Bulgaria" },
    { code: "HR", ru: "\u0425\u043E\u0440\u0432\u0430\u0442\u0438\u044F", en: "Croatia" },
    { code: "SI", ru: "\u0421\u043B\u043E\u0432\u0435\u043D\u0438\u044F", en: "Slovenia" },
    { code: "GR", ru: "\u0413\u0440\u0435\u0446\u0438\u044F", en: "Greece" },
    { code: "GB", ru: "\u0412\u0435\u043B\u0438\u043A\u043E\u0431\u0440\u0438\u0442\u0430\u043D\u0438\u044F", en: "United Kingdom" },
    { code: "IE", ru: "\u0418\u0440\u043B\u0430\u043D\u0434\u0438\u044F", en: "Ireland" },
    { code: "DK", ru: "\u0414\u0430\u043D\u0438\u044F", en: "Denmark" },
    { code: "SE", ru: "\u0428\u0432\u0435\u0446\u0438\u044F", en: "Sweden" },
    { code: "FI", ru: "\u0424\u0438\u043D\u043B\u044F\u043D\u0434\u0438\u044F", en: "Finland" },
    { code: "NO", ru: "\u041D\u043E\u0440\u0432\u0435\u0433\u0438\u044F", en: "Norway" },
    { code: "RS", ru: "\u0421\u0435\u0440\u0431\u0438\u044F", en: "Serbia" },
    { code: "ME", ru: "\u0427\u0435\u0440\u043D\u043E\u0433\u043E\u0440\u0438\u044F", en: "Montenegro" },
    { code: "BA", ru: "\u0411\u043E\u0441\u043D\u0438\u044F \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043E\u0432\u0438\u043D\u0430", en: "Bosnia & Herzegovina" },
    { code: "MK", ru: "\u0421\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0438\u044F", en: "North Macedonia" },
    { code: "AL", ru: "\u0410\u043B\u0431\u0430\u043D\u0438\u044F", en: "Albania" },
    { code: "MD", ru: "\u041C\u043E\u043B\u0434\u043E\u0432\u0430", en: "Moldova" },
    { code: "LU", ru: "\u041B\u044E\u043A\u0441\u0435\u043C\u0431\u0443\u0440\u0433", en: "Luxembourg" },
    { code: "CY", ru: "\u041A\u0438\u043F\u0440", en: "Cyprus" },
    { code: "MT", ru: "\u041C\u0430\u043B\u044C\u0442\u0430", en: "Malta" }
  ];
  var MOCK_ORDERS = [
    { id: 1, title: "\u0420\u0435\u043C\u043E\u043D\u0442 \u0432\u0430\u043D\u043D\u043E\u0439 \u043A\u043E\u043C\u043D\u0430\u0442\u044B", titleEn: "Bathroom renovation", category: "tiling", budget: 2500, currency: "\u20AC", deadline: "2025-04-15", location: "Berlin, DE", description: "\u041F\u043E\u043B\u043D\u044B\u0439 \u0440\u0435\u043C\u043E\u043D\u0442 \u0432\u0430\u043D\u043D\u043E\u0439 8\u043C\xB2, \u0437\u0430\u043C\u0435\u043D\u0430 \u043F\u043B\u0438\u0442\u043A\u0438, \u0441\u0430\u043D\u0442\u0435\u0445\u043D\u0438\u043A\u0438", descriptionEn: "Full bathroom renovation 8m\xB2, tile and plumbing replacement", clientName: "\u041C\u0430\u043A\u0441\u0438\u043C \u041A.", status: "open", premium: true, createdAt: "2025-03-08", responses: 3 },
    { id: 2, title: "\u042D\u043B\u0435\u043A\u0442\u0440\u043E\u043F\u0440\u043E\u0432\u043E\u0434\u043A\u0430 \u0432 \u043A\u0432\u0430\u0440\u0442\u0438\u0440\u0435", titleEn: "Apartment electrical wiring", category: "electrical", budget: 1800, currency: "\u20AC", deadline: "2025-04-01", location: "Prague, CZ", description: "\u0417\u0430\u043C\u0435\u043D\u0430 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043F\u0440\u043E\u0432\u043E\u0434\u043A\u0438 \u0432 3-\u043A\u043E\u043C\u043D\u0430\u0442\u043D\u043E\u0439 \u043A\u0432\u0430\u0440\u0442\u0438\u0440\u0435, 75\u043C\xB2", descriptionEn: "Rewiring 3-room apartment, 75m\xB2", clientName: "\u0415\u043B\u0435\u043D\u0430 \u0412.", status: "open", premium: false, createdAt: "2025-03-09", responses: 1 },
    { id: 3, title: "\u041F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0444\u0430\u0441\u0430\u0434\u0430 \u0434\u043E\u043C\u0430", titleEn: "House facade painting", category: "painting", budget: 3200, currency: "\u20AC", deadline: "2025-05-01", location: "Warsaw, PL", description: "\u041F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0444\u0430\u0441\u0430\u0434\u0430 \u0447\u0430\u0441\u0442\u043D\u043E\u0433\u043E \u0434\u043E\u043C\u0430, \u043F\u043B\u043E\u0449\u0430\u0434\u044C 200\u043C\xB2", descriptionEn: "Painting private house facade, 200m\xB2 area", clientName: "\u0410\u043D\u043D\u0430 \u0421.", status: "open", premium: false, createdAt: "2025-03-10", responses: 5 },
    { id: 4, title: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043A\u0443\u0445\u043D\u0438 IKEA", titleEn: "IKEA kitchen installation", category: "furniture", budget: 800, currency: "\u20AC", deadline: "2025-03-25", location: "Vienna, AT", description: "\u0421\u0431\u043E\u0440\u043A\u0430 \u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043A\u0443\u0445\u043D\u0438 IKEA, 12 \u043C\u043E\u0434\u0443\u043B\u0435\u0439", descriptionEn: "Assembly and installation of IKEA kitchen, 12 modules", clientName: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041B.", status: "open", premium: true, createdAt: "2025-03-07", responses: 7 },
    { id: 5, title: "\u0423\u043A\u043B\u0430\u0434\u043A\u0430 \u043B\u0430\u043C\u0438\u043D\u0430\u0442\u0430", titleEn: "Laminate flooring", category: "flooring", budget: 1200, currency: "\u20AC", deadline: "2025-04-10", location: "Munich, DE", description: "\u0423\u043A\u043B\u0430\u0434\u043A\u0430 \u043B\u0430\u043C\u0438\u043D\u0430\u0442\u0430 \u0432 2 \u043A\u043E\u043C\u043D\u0430\u0442\u044B, \u043E\u0431\u0449\u0430\u044F \u043F\u043B\u043E\u0449\u0430\u0434\u044C 45\u043C\xB2", descriptionEn: "Laminate flooring in 2 rooms, 45m\xB2 total", clientName: "\u041E\u043B\u044C\u0433\u0430 \u041C.", status: "open", premium: false, createdAt: "2025-03-10", responses: 2 },
    { id: 6, title: "\u0420\u0435\u043C\u043E\u043D\u0442 \u043A\u0440\u043E\u0432\u043B\u0438", titleEn: "Roof repair", category: "roofing", budget: 5e3, currency: "\u20AC", deadline: "2025-04-20", location: "Budapest, HU", description: "\u0427\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u0447\u0435\u0440\u0435\u043F\u0438\u0446\u044B, \u0440\u0435\u043C\u043E\u043D\u0442 \u0432\u043E\u0434\u043E\u0441\u0442\u043E\u043A\u043E\u0432", descriptionEn: "Partial tile replacement, gutter repair", clientName: "\u0418\u0432\u0430\u043D \u0420.", status: "open", premium: false, createdAt: "2025-03-06", responses: 0 }
  ];
  var MOCK_MASTERS = [
    { id: 1, name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432", nameEn: "Andrey Petrov", categories: ["plumbing", "heating"], country: "DE", city: "Berlin", rating: 4.9, reviews: 47, premium: true, experience: "12 \u043B\u0435\u0442", experienceEn: "12 years" },
    { id: 2, name: "\u041C\u0438\u0445\u0430\u0438\u043B \u041A\u043E\u0432\u0430\u043B\u044C\u0447\u0443\u043A", nameEn: "Mikhail Kovalchuk", categories: ["electrical", "ac"], country: "CZ", city: "Prague", rating: 4.8, reviews: 32, premium: false, experience: "8 \u043B\u0435\u0442", experienceEn: "8 years" },
    { id: 3, name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u041D\u043E\u0432\u0430\u043A", nameEn: "Sergei Novak", categories: ["painting", "plastering", "drywall"], country: "PL", city: "Warsaw", rating: 4.7, reviews: 28, premium: true, experience: "15 \u043B\u0435\u0442", experienceEn: "15 years" },
    { id: 4, name: "\u0412\u0438\u043A\u0442\u043E\u0440 \u0428\u0435\u0432\u0447\u0435\u043D\u043A\u043E", nameEn: "Viktor Shevchenko", categories: ["renovation", "tiling", "flooring"], country: "AT", city: "Vienna", rating: 5, reviews: 19, premium: false, experience: "10 \u043B\u0435\u0442", experienceEn: "10 years" }
  ];
  var MOCK_USERS = [
    { id: 1, name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432", email: "andrey@mail.com", role: "master", country: "DE", status: "active", registeredAt: "2025-01-15" },
    { id: 2, name: "\u0415\u043B\u0435\u043D\u0430 \u0412\u043E\u043B\u043A\u043E\u0432\u0430", email: "elena@mail.com", role: "client", country: "CZ", status: "active", registeredAt: "2025-02-20" },
    { id: 3, name: "\u041C\u0430\u043A\u0441\u0438\u043C \u041A\u043E\u0437\u043B\u043E\u0432", email: "max@mail.com", role: "client", country: "DE", status: "active", registeredAt: "2025-03-01" },
    { id: 4, name: "\u041C\u0438\u0445\u0430\u0438\u043B \u041A\u043E\u0432\u0430\u043B\u044C\u0447\u0443\u043A", email: "mikhail@mail.com", role: "master", country: "CZ", status: "blocked", registeredAt: "2025-01-20" },
    { id: 5, name: "\u0421\u0435\u0440\u0433\u0435\u0439 \u041D\u043E\u0432\u0430\u043A", email: "sergei@mail.com", role: "master", country: "PL", status: "active", registeredAt: "2024-12-10" },
    { id: 6, name: "\u0410\u043D\u043D\u0430 \u0421\u0438\u0434\u043E\u0440\u043E\u0432\u0430", email: "anna@mail.com", role: "client", country: "PL", status: "active", registeredAt: "2025-02-28" }
  ];
  
var LANGUAGES = [
  { code: "ru", ru: "Русский", en: "Russian" }, { code: "en", ru: "Английский", en: "English" },
  { code: "de", ru: "Немецкий", en: "German" }, { code: "pl", ru: "Польский", en: "Polish" },
  { code: "cs", ru: "Чешский", en: "Czech" }, { code: "fr", ru: "Французский", en: "French" },
  { code: "es", ru: "Испанский", en: "Spanish" }, { code: "it", ru: "Итальянский", en: "Italian" },
  { code: "pt", ru: "Португальский", en: "Portuguese" }, { code: "nl", ru: "Нидерландский", en: "Dutch" },
  { code: "bg", ru: "Болгарский", en: "Bulgarian" }, { code: "ro", ru: "Румынский", en: "Romanian" },
  { code: "hr", ru: "Хорватский", en: "Croatian" }, { code: "sr", ru: "Сербский", en: "Serbian" },
  { code: "sk", ru: "Словацкий", en: "Slovak" }, { code: "hu", ru: "Венгерский", en: "Hungarian" },
  { code: "el", ru: "Греческий", en: "Greek" }, { code: "sv", ru: "Шведский", en: "Swedish" },
  { code: "da", ru: "Датский", en: "Danish" }, { code: "fi", ru: "Финский", en: "Finnish" },
  { code: "no", ru: "Норвежский", en: "Norwegian" }, { code: "uk", ru: "Украинский", en: "Ukrainian" },
];

  var AppContext = createContext();
  var Icons = {
    menu: /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M3 12h18M3 6h18M3 18h18" })),
    close: /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M18 6L6 18M6 6l12 12" })),
    back: /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M19 12H5M12 19l-7-7 7-7" })),
    search: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("path", { d: "M21 21l-4.35-4.35" })),
    user: /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "7", r: "4" })),
    briefcase: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" })),
    calendar: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M16 2v4M8 2v4M3 10h18" })),
    message: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" })),
    plus: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M12 5v14M5 12h14" })),
    star: React.createElement("span", { style: { fontSize: "14px" } }, "\u{1F528}"),
    shield: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })),
    check: /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#10b981", strokeWidth: "3" }, /* @__PURE__ */ React.createElement("path", { d: "M20 6L9 17l-5-5" })),
    crown: /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "#facc15", stroke: "#facc15", strokeWidth: "1" }, /* @__PURE__ */ React.createElement("path", { d: "M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z" }), /* @__PURE__ */ React.createElement("rect", { x: "5", y: "18", width: "14", height: "2", rx: "1" })),
    chart: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M18 20V10M12 20V4M6 20v-6" })),
    send: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" })),
    settings: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" })),
    alert: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 9v4M12 17h.01" })),
    globe: /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" })),
    eye: /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" })),
    list: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" })),
    users: /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "7", r: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" })),
    filter: /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" })),
    location: /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "3" }))
  };
  var CSS = `
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





.loading-spinner { display:flex; justify-content:center; padding:30px; }
.loading-spinner::after { content:''; width:28px; height:28px; border:3px solid var(--border); border-top-color:var(--green); border-radius:50%; animation:spin 0.6s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }

.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
`;
  function Toast({ message, onClose }) {
    useEffect(() => {
      const t = setTimeout(onClose, 2500);
      return () => clearTimeout(t);
    }, [onClose]);
    return /* @__PURE__ */ React.createElement("div", { className: "toast" }, message);
  }
  function Header() {
    const { lang, setLang, page, setPage, user, setUser, setMenuOpen, showToast, notifCount, setNotifCount } = useContext(AppContext);
    const t = translations[lang].nav;
    return /* @__PURE__ */ React.createElement("header", { className: "header" }, /* @__PURE__ */ React.createElement("div", { className: "header-logo", onClick: () => setPage("home") }, /* @__PURE__ */ React.createElement("img", { src: user?.role === "master" ? LOGO_OPEN_SM : LOGO_CLOSED_SM, alt: "SlavicShkaf", style: { height: 32, borderRadius: 4 } })), /* @__PURE__ */ React.createElement("div", { className: "header-right" }, /* @__PURE__ */ React.createElement("div", { className: "lang-toggle" }, /* @__PURE__ */ React.createElement("button", { className: `lang-btn ${lang === "ru" ? "active" : ""}`, onClick: () => setLang("ru") }, "RU"), /* @__PURE__ */ React.createElement("button", { className: `lang-btn ${lang === "en" ? "active" : ""}`, onClick: () => setLang("en") }, "EN")), user ? React.createElement(React.Fragment, null,
          React.createElement("button", { className: "menu-btn", style: { position: "relative" }, onClick: () => {
            if (typeof api !== "undefined") api.getNotifications(true).then(function(r) {
              if (r && r.notifications && r.notifications.length > 0) {
                showToast(r.notifications[0].title + ": " + r.notifications[0].message);
                api.markNotificationsRead(); setNotifCount(0);
              } else { showToast(lang === "ru" ? "\u041D\u0435\u0442 \u043D\u043E\u0432\u044B\u0445 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439" : "No new notifications"); }
            });
          } }, React.createElement("div", { style: { position: "relative" } },
            React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, React.createElement("path", { d: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" })),
            notifCount > 0 && React.createElement("div", { style: { position: "absolute", top: -4, right: -4, background: "var(--red)", color: "#fff", borderRadius: "50%", minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 700 } }, notifCount > 9 ? "9+" : notifCount)
          )),
          React.createElement("button", { className: "menu-btn", onClick: () => setMenuOpen(true) }, Icons.menu)
        ) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "header-btn", onClick: () => setPage("login") }, t.login), /* @__PURE__ */ React.createElement("button", { className: "header-btn filled", onClick: () => setPage("register") }, t.register))));
  }
  function Sidebar() {
    const { lang, user, setUser, setPage, menuOpen, setMenuOpen } = useContext(AppContext);
    const t = translations[lang].nav;
    if (!menuOpen) return null;
    const items = [
      { icon: Icons.user, label: t.profile, action: () => {
        setPage(user.role === "master" ? "master" : user.role === "admin" ? "admin" : "client");
        setMenuOpen(false);
      } },
      ...user?.role === "admin" ? [{ icon: Icons.settings, label: t.admin, action: () => {
        setPage("admin");
        setMenuOpen(false);
      } }] : [],
      { icon: "\u2014", label: t.logout, action: () => {
        setUser(null);
        setPage("home");
        setMenuOpen(false);
      } }
    ];
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sidebar-overlay", onClick: () => setMenuOpen(false) }), /* @__PURE__ */ React.createElement("div", { className: "sidebar" }, /* @__PURE__ */ React.createElement("button", { className: "sidebar-close", onClick: () => setMenuOpen(false) }, Icons.close), /* @__PURE__ */ React.createElement("div", { className: "sidebar-menu" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: "0.95rem" } }, user?.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.75rem", color: "var(--green)", marginTop: 2 } }, user?.role === "master" ? lang === "ru" ? "\u041C\u0430\u0441\u0442\u0435\u0440" : "Tradesperson" : user?.role === "admin" ? "Admin" : lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A" : "Client")), items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "sidebar-item", onClick: item.action }, typeof item.icon === "string" ? item.icon : item.icon, /* @__PURE__ */ React.createElement("span", null, item.label))))));
  }
  function LandingPage() {
    const { lang, setPage } = useContext(AppContext);
    const t = translations[lang];
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "hero" }, /* @__PURE__ */ React.createElement("h1", null, t.hero.title), /* @__PURE__ */ React.createElement("p", null, t.hero.subtitle), /* @__PURE__ */ React.createElement("div", { className: "hero-btns" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => setPage("register") }, t.hero.cta), /* @__PURE__ */ React.createElement("button", { className: "btn btn-outline", onClick: () => setPage("register") }, t.hero.ctaAlt))), /* @__PURE__ */ React.createElement("div", { className: "stats-row" }, /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, "342+"), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, t.stats.masters)), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, "22"), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, t.stats.countries)), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, "4.8 \u{1F528}"), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, t.stats.rating)), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, "1.5K+"), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, t.stats.orders))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, t.howItWorks.title), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, t.howItWorks.steps.map((step, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, marginBottom: 8 } }, i + 1), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: "0.8rem", marginBottom: 4 } }, step.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", color: "var(--text3)", lineHeight: 1.4 } }, step.d))))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, t.categories.title), /* @__PURE__ */ React.createElement("div", { className: "cat-grid" }, CATEGORIES.slice(0, 8).map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, className: "cat-chip" }, /* @__PURE__ */ React.createElement("span", { className: "emoji" }, c.icon), " ", c[lang])), /* @__PURE__ */ React.createElement("div", { className: "cat-chip", style: { color: "var(--green)", borderColor: "var(--green)" } }, "+ ", lang === "ru" ? "\u0435\u0449\u0451 " + (CATEGORIES.length - 8) : CATEGORIES.length - 8 + " more")), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-outline btn-sm" }, t.categories.viewAll))), /* @__PURE__ */ React.createElement("div", { className: "why-section" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title", style: { color: "var(--green)" } }, t.why.title), /* @__PURE__ */ React.createElement("div", { className: "why-grid" }, t.why.items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "why-card" }, /* @__PURE__ */ React.createElement("h4", null, /* @__PURE__ */ React.createElement("span", { className: "why-icon" }, [Icons.shield, Icons.star, Icons.globe, Icons.send][i]), " ", item.t), /* @__PURE__ */ React.createElement("p", null, item.d))))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, t.testimonials.title), /* @__PURE__ */ React.createElement("div", { className: "test-scroll" }, t.testimonials.items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "test-card" }, /* @__PURE__ */ React.createElement("div", { className: "test-text" }, '"', item.text, '"'), /* @__PURE__ */ React.createElement("div", { className: "test-author" }, item.name), /* @__PURE__ */ React.createElement("div", { className: "test-stars" }, Array(item.rating).fill(0).map((_, j) => /* @__PURE__ */ React.createElement("span", { key: j }, Icons.star))))))), /* @__PURE__ */ React.createElement("div", { className: "cta-section" }, /* @__PURE__ */ React.createElement("h2", null, t.ready.title), /* @__PURE__ */ React.createElement("p", null, t.ready.subtitle), /* @__PURE__ */ React.createElement("div", { className: "hero-btns" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => setPage("register") }, t.ready.cta), /* @__PURE__ */ React.createElement("button", { className: "btn btn-outline", onClick: () => setPage("register") }, t.ready.ctaAlt))), /* @__PURE__ */ React.createElement("footer", { className: "footer" }, /* @__PURE__ */ React.createElement("p", null, t.footer.copy, " | ", /* @__PURE__ */ React.createElement("a", { href: "#" }, t.footer.privacy), " \xB7 ", /* @__PURE__ */ React.createElement("a", { href: "#" }, t.footer.contact))));
  }
  function RegisterPage() {
    const { lang, setPage, setUser, showToast } = useContext(AppContext);
    const t = translations[lang].register;
    const [role, setRole] = useState("master");
    const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", password: "", confirmPassword: "", postalCode: "", city: "" });
    const [selectedCats, setSelectedCats] = useState([]);
    const [nativeLang, setNativeLang] = useState("");
    const [addLangs, setAddLangs] = useState([]);
    var toggleAddLang = function(lc) { setAddLangs(function(p) { return p.includes(lc) ? p.filter(function(c) { return c !== lc; }) : p.length < 5 ? p.concat([lc]) : p; }); };
    var [workType, setWorkType] = useState("self");
    var [companyName, setCompanyName] = useState("");
    const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
    const toggleCat = (id) => setSelectedCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 5 ? [...prev, id] : prev);
    const handleSubmit = async () => {
      if (!form.name || !form.email || !form.password) {
        showToast(lang === "ru" ? "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F" : "Fill in required fields");
        return;
      }
      var regResult = typeof api !== 'undefined' ? await api.register({ role, name: form.name, email: form.email, phone: form.phone, password: form.password, country: form.country, city: form.city, postal_code: form.postalCode, categories: selectedCats, native_language: nativeLang, additional_languages: addLangs, work_type: workType, company_name: companyName }) : null;
      if (regResult && regResult.token && !regResult.error) { api.setToken(regResult.token); setUser(regResult.user); } else { setUser({ id: 99, name: form.name, email: form.email, role, country: form.country, city: form.city, categories: selectedCats }); }
      setPage(role === "master" ? "master" : "client");
      showToast(lang === "ru" ? "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0443\u0441\u043F\u0435\u0448\u043D\u0430!" : "Registration successful!");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "page" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("home"), style: { background: "none", border: "none", color: "var(--text)", cursor: "pointer" } }, Icons.back), /* @__PURE__ */ React.createElement("h1", { className: "page-title", style: { margin: 0 } }, t.title)), /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.role), /* @__PURE__ */ React.createElement("div", { className: "role-toggle" }, /* @__PURE__ */ React.createElement("div", { className: `role-option ${role === "master" ? "active" : ""}`, onClick: () => setRole("master") }, /* @__PURE__ */ React.createElement("div", { className: "role-icon" }, "\u{1F527}"), /* @__PURE__ */ React.createElement("div", { className: "role-label" }, t.master)), /* @__PURE__ */ React.createElement("div", { className: `role-option ${role === "client" ? "active" : ""}`, onClick: () => setRole("client") }, /* @__PURE__ */ React.createElement("div", { className: "role-icon" }, "\u{1F4CB}"), /* @__PURE__ */ React.createElement("div", { className: "role-label" }, t.client))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.name, " *"), /* @__PURE__ */ React.createElement("input", { className: "form-input", placeholder: t.name, value: form.name, onChange: (e) => updateForm("name", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.email, " *"), /* @__PURE__ */ React.createElement("input", { className: "form-input", type: "email", placeholder: t.email, value: form.email, onChange: (e) => updateForm("email", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.phone), /* @__PURE__ */ React.createElement("input", { className: "form-input", type: "tel", placeholder: "+49 xxx xxx xxxx", value: form.phone, onChange: (e) => updateForm("phone", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.country), /* @__PURE__ */ React.createElement("select", { className: "form-input", value: form.country, onChange: (e) => updateForm("country", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, t.selectCountry), COUNTRIES.map((c) => /* @__PURE__ */ React.createElement("option", { key: c.code, value: c.code }, c[lang])))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.city), /* @__PURE__ */ React.createElement("input", { className: "form-input", placeholder: t.city, value: form.city, onChange: (e) => updateForm("city", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.postalCode), /* @__PURE__ */ React.createElement("input", { className: "form-input", placeholder: "10115", value: form.postalCode, onChange: (e) => updateForm("postalCode", e.target.value) }))), role === "master" && /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.categories, " (", lang === "ru" ? "\u0434\u043E 5" : "up to 5", ")"), /* @__PURE__ */ React.createElement("div", { className: "cat-select-grid" }, CATEGORIES.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, className: `cat-select-chip ${selectedCats.includes(c.id) ? "selected" : ""}`, onClick: () => toggleCat(c.id) }, c.icon, " ", c[lang])))), /* @__PURE__ */ role === "master" && React.createElement(React.Fragment, null,
        React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0422\u0438\u043F \u0440\u0430\u0431\u043E\u0442\u044B" : "Work Type"),
          React.createElement("div", { className: "role-toggle" },
            React.createElement("div", { className: "role-option " + (workType === "self" ? "active" : ""), onClick: function() { setWorkType("self"); }, style: { padding: 10 } }, React.createElement("div", { className: "role-icon" }, "\u{1F464}"), React.createElement("div", { className: "role-label", style: { fontSize: "0.7rem" } }, lang === "ru" ? "\u0421\u0430\u043C" : "Self")),
            React.createElement("div", { className: "role-option " + (workType === "company" ? "active" : ""), onClick: function() { setWorkType("company"); }, style: { padding: 10 } }, React.createElement("div", { className: "role-icon" }, "\u{1F3E2}"), React.createElement("div", { className: "role-label", style: { fontSize: "0.7rem" } }, lang === "ru" ? "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" : "Company")),
            React.createElement("div", { className: "role-option " + (workType === "brigade" ? "active" : ""), onClick: function() { setWorkType("brigade"); }, style: { padding: 10 } }, React.createElement("div", { className: "role-icon" }, "\u{1F465}"), React.createElement("div", { className: "role-label", style: { fontSize: "0.7rem" } }, lang === "ru" ? "\u0411\u0440\u0438\u0433\u0430\u0434\u0430" : "Team"))
          )),
        workType === "company" && React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" : "Company Name"), React.createElement("input", { className: "form-input", value: companyName, onChange: function(e) { setCompanyName(e.target.value); } }))
      ),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0420\u043E\u0434\u043D\u043E\u0439 \u044F\u0437\u044B\u043A" : "Native Language"), React.createElement("select", { className: "form-input", value: nativeLang, onChange: function(e) { setNativeLang(e.target.value); } }, React.createElement("option", { value: "" }, lang === "ru" ? "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435" : "Select"), LANGUAGES.map(function(l) { return React.createElement("option", { key: l.code, value: l.code }, l[lang]); }))),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u044F\u0437\u044B\u043A\u0438 (\u0434\u043E 5)" : "Additional Languages (up to 5)"), React.createElement("div", { className: "cat-select-grid" }, LANGUAGES.map(function(l) { return React.createElement("div", { key: l.code, className: "cat-select-chip " + (addLangs.includes(l.code) ? "selected" : ""), onClick: function() { toggleAddLang(l.code); } }, l[lang]); }))),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, t.password, " *"), React.createElement("input", { className: "form-input", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: form.password, onChange: function(e) { updateForm("password", e.target.value); } })), React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, t.confirmPassword), React.createElement("input", { className: "form-input", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: form.confirmPassword, onChange: function(e) { updateForm("confirmPassword", e.target.value); } })), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-full", style: { marginTop: 8 }, onClick: handleSubmit }, t.submit), /* @__PURE__ */ React.createElement("div", { className: "form-bottom" }, t.hasAccount, " ", /* @__PURE__ */ React.createElement("span", { className: "form-link", onClick: () => setPage("login") }, t.login)));
  }
  function LoginPage() {
    const { lang, setPage, setUser, showToast } = useContext(AppContext);
    const t = translations[lang].login;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
      if (!email || !password) { showToast("Enter email and password"); return; }
      var result = typeof api !== 'undefined' ? await api.login(email, password) : null;
      if (result && result.token && !result.error) {
        api.setToken(result.token);
        setUser(result.user);
        setPage(result.user.role === "master" ? "master" : result.user.role === "admin" ? "admin" : "client");
        showToast(lang === "ru" ? "Добро пожаловать!" : "Welcome!");
        return;
      }
      if (result && result.error) { showToast(result.error); return; }
      if (email === "admin@slavicshkaf.com") {
        setUser({ id: 0, name: "Admin", email, role: "admin" });
        setPage("admin");
      } else if (email.includes("master")) {
        setUser({ id: 1, name: "\u0410\u043D\u0434\u0440\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432", email, role: "master", country: "DE", city: "Berlin", categories: ["plumbing", "heating"] });
        setPage("master");
      } else {
        setUser({ id: 2, name: "\u0415\u043B\u0435\u043D\u0430 \u0412\u043E\u043B\u043A\u043E\u0432\u0430", email, role: "client", country: "CZ", city: "Prague" });
        setPage("client");
      }
      showToast(lang === "ru" ? "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C!" : "Welcome!");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "page" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("home"), style: { background: "none", border: "none", color: "var(--text)", cursor: "pointer" } }, Icons.back), /* @__PURE__ */ React.createElement("h1", { className: "page-title", style: { margin: 0 } }, t.title)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", margin: "20px 0" } }, /* @__PURE__ */ React.createElement("img", { src: LOGO_CLOSED_LG, alt: "SlavicShkaf", style: { height: 80, borderRadius: 8 } })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.email), /* @__PURE__ */ React.createElement("input", { className: "form-input", type: "email", placeholder: "email@example.com", value: email, onChange: (e) => setEmail(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label" }, t.password), /* @__PURE__ */ React.createElement("input", { className: "form-input", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value) })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("span", { className: "form-link" }, t.forgot)), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-full", onClick: handleLogin }, t.submit), /* @__PURE__ */ React.createElement("div", { className: "form-bottom" }, t.noAccount, " ", /* @__PURE__ */ React.createElement("span", { className: "form-link", onClick: () => setPage("register") }, t.register)), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.7rem", color: "var(--text3)", textAlign: "center" } }, lang === "ru" ? "\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0435 \u0432\u0445\u043E\u0434\u044B:" : "Test logins:", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "form-link", onClick: () => {
      setEmail("master@test.com");
    } }, "master@test.com"), " \xB7 ", /* @__PURE__ */ React.createElement("span", { className: "form-link", onClick: () => {
      setEmail("client@test.com");
    } }, "client@test.com"), " \xB7 ", /* @__PURE__ */ React.createElement("span", { className: "form-link", onClick: () => {
      setEmail("admin@slavicshkaf.com");
    } }, "admin@slavicshkaf.com")));
  }
  function MasterDashboard() {
    const { lang, notifCount, setViewProfileId } = useContext(AppContext);
    const t = translations[lang].masterDash;
    const tc = translations[lang].common;
    const [tab, setTab] = useState("exchange");
    useEffect(function() {
      function handleOpenChat() { setTab("messages"); }
      window.addEventListener("ss_open_chat", handleOpenChat);
      return function() { window.removeEventListener("ss_open_chat", handleOpenChat); };
    }, []);
    const navItems = [
      { id: "exchange", icon: Icons.briefcase, label: t.exchange },
      { id: "responses", icon: Icons.list, label: t.myResponses },
      { id: "calendar", icon: Icons.calendar, label: t.calendar },
      { id: "messages", icon: Icons.message, label: t.messages },
      { id: "profile", icon: Icons.user, label: t.profile }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "dash" }, /* @__PURE__ */ React.createElement("div", { className: "dash-content" }, tab === "exchange" && /* @__PURE__ */ React.createElement(ExchangeTab, null), tab === "responses" && /* @__PURE__ */ React.createElement(ResponsesTab, null), tab === "calendar" && /* @__PURE__ */ React.createElement(CalendarTab, null), tab === "messages" && /* @__PURE__ */ React.createElement(MessagesTab, null), tab === "profile" && /* @__PURE__ */ React.createElement(ProfileTab, null)), /* @__PURE__ */ React.createElement("nav", { className: "dash-nav" }, navItems.map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, className: `dash-nav-item ${tab === item.id ? "active" : ""}`, onClick: () => setTab(item.id), style: { position: "relative" } }, item.icon, /* @__PURE__ */ React.createElement("span", null, item.label), item.id === "messages" && typeof notifCount !== "undefined" && notifCount > 0 && React.createElement("div", { style: { position: "absolute", top: 0, right: "50%", marginRight: -16, background: "#ef4444", color: "#fff", borderRadius: 10, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, border: "2px solid var(--bg2)", zIndex: 5 } }, notifCount > 9 ? "9+" : notifCount)))));
  }
  function ExchangeTab() {
    const { lang, showToast } = useContext(AppContext);
    const tc = translations[lang].common;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    useEffect(function() { loadOrders(); }, [filterCat]);
    function loadOrders() {
      setLoading(true);
      var params = { status: "open" };
      if (filterCat !== "all") params.category = filterCat;
      if (typeof api !== "undefined") api.getOrders(params).then(function(r) { setOrders(r && r.orders ? r.orders : MOCK_ORDERS); setLoading(false); });
      else { setOrders(MOCK_ORDERS); setLoading(false); }
    }
    var filtered = orders.filter(function(o) { return !search || (o.title||"").toLowerCase().includes(search.toLowerCase()); });
    return React.createElement(React.Fragment, null,
      React.createElement("div", { className: "search-bar" }, Icons.search, React.createElement("input", { placeholder: tc.search, value: search, onChange: function(e) { setSearch(e.target.value); } })),
      React.createElement("div", { className: "tabs" },
        React.createElement("div", { className: "tab " + (filterCat === "all" ? "active" : ""), onClick: function() { setFilterCat("all"); } }, tc.all),
        CATEGORIES.slice(0, 6).map(function(c) { return React.createElement("div", { key: c.id, className: "tab " + (filterCat === c.id ? "active" : ""), onClick: function() { setFilterCat(c.id); } }, c.icon, " ", c[lang]); })
      ),
      loading ? React.createElement("div", { className: "loading-spinner" }) : filtered.length === 0 ? React.createElement("div", { className: "empty-state" }, React.createElement("div", { className: "emoji" }, "\u{1F4CB}"), React.createElement("p", null, tc.noResults)) :
      filtered.map(function(order) {
        return React.createElement("div", { key: order.id, className: "order-card " + (order.is_premium || order.is_top || order.premium ? "premium" : ""), onClick: function() { setSelectedOrder(order); } },
          (order.is_premium || order.is_top || order.premium) && React.createElement("span", { className: "order-badge badge-premium" }, Icons.crown, " ", tc.premium),
          React.createElement("div", { className: "order-title" }, order.title || order.titleEn),
          React.createElement("div", { className: "order-meta" }, React.createElement("span", null, Icons.location, " ", order.location || ""), React.createElement("span", null, Icons.calendar, " ", order.deadline || "")),
          React.createElement("div", { style: { fontSize: "0.75rem", color: "var(--text3)", marginBottom: 8 } }, ((order.description || order.descriptionEn || "")).slice(0, 80), "...", order.attachments && React.createElement("span", { style: { color: "var(--green)", fontSize: "0.7rem", marginLeft: 6 } }, "\u{1F4CE} ", (typeof order.attachments === "string" ? JSON.parse(order.attachments) : order.attachments || []).length, " ", lang === "ru" ? "\u0432\u043B\u043E\u0436." : "files")),
          React.createElement("div", { className: "order-footer" }, React.createElement("div", { className: "order-budget" }, order.budget || "?", order.currency || "\u20AC"), React.createElement("div", { className: "order-responses" }, order.responses_count || order.responses || 0, " ", lang === "ru" ? "\u043E\u0442\u043A\u043B\u0438\u043A\u043E\u0432" : "responses"))
        );
      }),
      selectedOrder && React.createElement(OrderModal, { order: selectedOrder, onClose: function() { setSelectedOrder(null); loadOrders(); } })
    );
  }
  function OrderModal({ order, onClose }) {
    const { lang, showToast } = useContext(AppContext);
    const tc = translations[lang].common;
    const cat = CATEGORIES.find((c) => c.id === order.category);
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "modal", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "modal-handle" }), order.premium && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { className: "order-badge badge-premium", style: { position: "static" } }, Icons.crown, " ", tc.premium)), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: "1rem", fontWeight: 700, marginBottom: 10 } }, lang === "ru" ? order.title : order.titleEn), /* @__PURE__ */ React.createElement("div", { className: "order-meta", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", null, cat?.icon, " ", cat?.[lang]), /* @__PURE__ */ React.createElement("span", null, Icons.location, " ", order.location), /* @__PURE__ */ React.createElement("span", null, Icons.calendar, " ", order.deadline)), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.6, marginBottom: 16 } }, lang === "ru" ? order.description : order.descriptionEn),
        (function() {
          try {
            var atts = order.attachments ? (typeof order.attachments === "string" ? JSON.parse(order.attachments) : order.attachments) : [];
            if (!atts || !atts.length) return null;
            return React.createElement("div", { style: { marginBottom: 12, marginTop: 12 } },
              React.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--text2)", marginBottom: 8 } }, (lang === "ru" ? "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F" : "Attachments") + " (" + atts.length + ")"),
              React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
                atts.map(function(att, ai) {
                  if (att.type === "video") return React.createElement("video", { key: ai, src: att.url, controls: true, style: { width: "100%", maxHeight: 200, borderRadius: 8, background: "var(--bg3)" }, preload: "metadata" });
                  if (att.type === "pdf") return React.createElement("a", { key: ai, href: att.url, target: "_blank", style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "var(--bg3)", borderRadius: 8, color: "var(--text)", textDecoration: "none", fontSize: "0.75rem" } }, "\u{1F4C4} ", att.name || "document.pdf");
                  return React.createElement("img", { key: ai, src: att.url, alt: att.name || "", style: { width: atts.length > 2 ? "30%" : atts.length > 1 ? "48%" : "100%", borderRadius: 8, cursor: "pointer", objectFit: "cover", maxHeight: 150 }, onClick: function() { window.open(att.url, "_blank"); } });
                })
              )
            );
          } catch(e) { return null; }
        })(), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text3)", fontSize: "0.75rem" } }, lang === "ru" ? "\u0411\u044E\u0434\u0436\u0435\u0442" : "Budget"), /* @__PURE__ */ React.createElement("div", { className: "order-budget", style: { fontSize: "1.3rem" } }, order.budget, order.currency)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text3)", fontSize: "0.75rem" } }, lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A" : "Client"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: "0.85rem" } }, order.clientName))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-full", onClick: async () => {
        var respondResult = typeof api !== "undefined" ? await api.respondToOrder(order.id, { message: "", proposed_budget: order.budget }) : null;
        if (respondResult && respondResult.success) showToast(lang === "ru" ? "\u041E\u0442\u043A\u043B\u0438\u043A \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D!" : "Response sent!");
        else showToast((respondResult && respondResult.error) || "Error");
        onClose();
      } }, tc.respond), /* @__PURE__ */ React.createElement("button", { className: "btn btn-outline btn-full", style: { marginTop: 8 }, onClick: onClose }, tc.cancel)));
  }
  function ResponsesTab() {
    const { lang } = useContext(AppContext);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(function() { if (typeof api !== "undefined") api.myResponses().then(function(r) { setResponses(r && !r.error ? r : []); setLoading(false); }); else setLoading(false); }, []);
    if (loading) return React.createElement("div", { className: "loading-spinner" });
    if (!responses.length) return React.createElement("div", { className: "empty-state" }, React.createElement("div", { className: "emoji" }, "\u{1F4EC}"), React.createElement("p", null, lang === "ru" ? "\u0423 \u0432\u0430\u0441 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043E\u0442\u043A\u043B\u0438\u043A\u043E\u0432" : "No responses yet"));
    return React.createElement(React.Fragment, null, responses.map(function(r) { return React.createElement("div", { key: r.id, className: "order-card" }, React.createElement("div", { className: "order-title" }, r.order_title || "Order #" + r.order_id), React.createElement("div", { className: "order-meta" }, React.createElement("span", null, r.order_location || ""), React.createElement("span", { className: "status-badge status-" + (r.status === "pending" ? "open" : r.status === "accepted" ? "active" : "blocked") }, r.status)), React.createElement("div", { className: "order-budget" }, (r.order_budget || r.proposed_budget || "?") + "\u20AC")); }));
  }
  function CalendarTab() {
    const { lang } = useContext(AppContext);
    const [month, setMonth] = useState((/* @__PURE__ */ new Date()).getMonth());
    const [year, setYear] = useState((/* @__PURE__ */ new Date()).getFullYear());
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const today = /* @__PURE__ */ new Date();
    const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const monthNames = lang === "ru" ? ["\u042F\u043D\u0432\u0430\u0440\u044C", "\u0424\u0435\u0432\u0440\u0430\u043B\u044C", "\u041C\u0430\u0440\u0442", "\u0410\u043F\u0440\u0435\u043B\u044C", "\u041C\u0430\u0439", "\u0418\u044E\u043D\u044C", "\u0418\u044E\u043B\u044C", "\u0410\u0432\u0433\u0443\u0441\u0442", "\u0421\u0435\u043D\u0442\u044F\u0431\u0440\u044C", "\u041E\u043A\u0442\u044F\u0431\u0440\u044C", "\u041D\u043E\u044F\u0431\u0440\u044C", "\u0414\u0435\u043A\u0430\u0431\u0440\u044C"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayLabels = lang === "ru" ? ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u0412\u0441"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const prevMonth = () => {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    };
    const nextMonth = () => {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "cal-header" }, /* @__PURE__ */ React.createElement("div", { className: "cal-title" }, monthNames[month], " ", year), /* @__PURE__ */ React.createElement("div", { className: "cal-nav" }, /* @__PURE__ */ React.createElement("button", { onClick: prevMonth }, "\u2190"), /* @__PURE__ */ React.createElement("button", { onClick: nextMonth }, "\u2192"))), /* @__PURE__ */ React.createElement("div", { className: "cal-grid" }, dayLabels.map((d) => /* @__PURE__ */ React.createElement("div", { key: d, className: "cal-day-label" }, d)), Array(startDay).fill(0).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: `e${i}`, className: "cal-day empty" })), Array(daysInMonth).fill(0).map((_, i) => {
      const day = i + 1;
      const hasEvent = [5, 12, 18, 25].includes(day);
      return /* @__PURE__ */ React.createElement("div", { key: day, className: `cal-day ${isToday(day) ? "today" : ""} ${hasEvent ? "has-event" : ""}` }, day);
    })), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "0.8rem", fontWeight: 600, marginBottom: 8 } }, lang === "ru" ? "\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F" : "Upcoming Events"), /* @__PURE__ */ React.createElement("div", { className: "empty-state", style: { padding: "20px 0" } }, /* @__PURE__ */ React.createElement("p", null, lang === "ru" ? "\u041D\u0435\u0442 \u0437\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0445 \u0441\u043E\u0431\u044B\u0442\u0438\u0439" : "No upcoming events")));
  }
  function MessagesTab() {
    const { lang, user, showToast } = useContext(AppContext);
    const [convos, setConvos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatWith, setChatWith] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const chatRef = useRef(null);
    const pollRef = useRef(null);

    useEffect(function() { loadConvos(); return function() { if (pollRef.current) clearInterval(pollRef.current); }; }, []);

    // Auto-open chat if redirected
    useEffect(function() {
      try {
        var saved = localStorage.getItem("ss_chat_with");
        if (saved) { var c = JSON.parse(saved); localStorage.removeItem("ss_chat_with"); if (c && c.id) openChat(c.id, c.name || "User"); }
      } catch(e) {}
    }, []);

    function loadConvos() {
      setLoading(true);
      if (typeof api !== "undefined") api.getMessages().then(function(r) { setConvos(r && !r.error ? r : []); setLoading(false); });
      else setLoading(false);
    }

    function openChat(otherId, otherName) {
      setChatWith({ id: otherId, name: otherName });
      loadChatMessages(otherId);
      // Start polling every 3 seconds
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(function() { loadChatMessages(otherId); }, 3000);
    }

    function closeChat() {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      setChatWith(null);
      loadConvos();
    }

    function loadChatMessages(otherId) {
      if (typeof api !== "undefined") api.getMessages(otherId).then(function(r) {
        if (r && !r.error) {
          setChatMessages(function(prev) {
            if (JSON.stringify(prev.map(function(m){return m.id})) !== JSON.stringify(r.map(function(m){return m.id}))) {
              // New messages arrived - scroll to bottom
              setTimeout(function() { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100);
              return r;
            }
            return prev;
          });
        }
      });
    }

    var [pendingFiles, setPendingFiles] = useState([]);
    var fileInputRef = useRef(null);

    function handleFileSelect(e) {
      var files = Array.from(e.target.files || []);
      if (pendingFiles.length + files.length > 10) { showToast(lang === "ru" ? "\u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 10 \u0444\u0430\u0439\u043B\u043E\u0432" : "Max 10 files"); return; }
      setPendingFiles(function(prev) { return prev.concat(files); });
      e.target.value = "";
    }

    function removeFile(idx) { setPendingFiles(function(prev) { return prev.filter(function(_, i) { return i !== idx; }); }); }

    async function sendMsg() {
      if ((!newMsg.trim() && pendingFiles.length === 0) || !chatWith) return;
      var msgText = newMsg;
      var filesToSend = pendingFiles.slice();
      setNewMsg("");
      setPendingFiles([]);
      // Upload files first
      var attachments = [];
      if (filesToSend.length > 0 && typeof api !== "undefined") {
        for (var fi = 0; fi < filesToSend.length; fi++) {
          var uploadResult = await api.uploadMedia(filesToSend[fi]);
          if (uploadResult && uploadResult.url) {
            attachments.push({ type: uploadResult.type, url: uploadResult.url, name: uploadResult.name });
          }
        }
      }
      // Optimistic: add message immediately
      setChatMessages(function(prev) { return prev.concat([{ id: Date.now(), sender_id: user && user.id, content: msgText, attachments: attachments.length ? JSON.stringify(attachments) : null, created_at: new Date().toISOString() }]); });
      setTimeout(function() { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
      if (typeof api !== "undefined") api.sendMessage({ receiver_id: chatWith.id, content: msgText || (attachments.length ? "\u{1F4CE} " + attachments.length + " file(s)" : ""), attachments: attachments.length ? attachments : undefined }).then(function() {
        loadChatMessages(chatWith.id);
      });
    }

    // Chat view
    if (chatWith) return React.createElement(React.Fragment, null,
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" } },
        React.createElement("button", { onClick: closeChat, style: { background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: 4 } }, Icons.back),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("div", { style: { fontWeight: 700, fontSize: "0.9rem" } }, chatWith.name),
          React.createElement("div", { style: { fontSize: "0.65rem", color: "var(--green)" } }, lang === "ru" ? "\u043E\u043D\u043B\u0430\u0439\u043D" : "online")
        )
      ),
      React.createElement("div", { ref: chatRef, style: { flex: 1, overflowY: "auto", marginBottom: 12, maxHeight: "calc(100vh - 250px)", padding: "8px 0" } },
        chatMessages.length === 0 ? React.createElement("div", { style: { textAlign: "center", color: "var(--text3)", padding: 40, fontSize: "0.8rem" } }, lang === "ru" ? "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" : "Write the first message") :
        chatMessages.map(function(m) {
          var mine = m.sender_id === (user && user.id);
          return React.createElement("div", { key: m.id, style: { display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 6 } },
            React.createElement("div", { style: { background: mine ? "var(--green)" : "var(--bg3)", color: mine ? "#fff" : "var(--text)", padding: "10px 14px", borderRadius: mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px", maxWidth: "80%", fontSize: "0.82rem", lineHeight: 1.5 } },
              m.content && React.createElement("div", null, m.content),
              (function() {
                try {
                  var atts = m.attachments ? (typeof m.attachments === "string" ? JSON.parse(m.attachments) : m.attachments) : [];
                  if (!atts || !atts.length) return null;
                  return React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: m.content ? 6 : 0 } },
                    atts.map(function(att, ai) {
                      if (att.type === "video") return React.createElement("video", { key: ai, src: att.url, controls: true, style: { maxWidth: "100%", borderRadius: 8, marginTop: 4 }, preload: "metadata" });
                      return React.createElement("img", { key: ai, src: att.url, alt: att.name || "photo", style: { maxWidth: att.length > 1 ? "48%" : "100%", borderRadius: 8, marginTop: 4, cursor: "pointer" }, onClick: function() { window.open(att.url, "_blank"); } });
                    })
                  );
                } catch(e) { return null; }
              })(),
              React.createElement("div", { style: { fontSize: "0.6rem", opacity: 0.5, marginTop: 4, textAlign: mine ? "right" : "left" } }, (m.created_at || "").slice(11, 16))
            )
          );
        })
      ),
      pendingFiles.length > 0 && React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 0" } },
        pendingFiles.map(function(f, fi) {
          var isImg = f.type && f.type.startsWith("image/");
          return React.createElement("div", { key: fi, style: { position: "relative", display: "inline-block" } },
            isImg ? React.createElement("img", { src: URL.createObjectURL(f), style: { width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" } }) :
            React.createElement("div", { style: { width: 60, height: 60, background: "var(--bg3)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "var(--text3)" } }, "\u{1F3AC}"),
            React.createElement("button", { onClick: function() { removeFile(fi); }, style: { position: "absolute", top: -4, right: -4, background: "var(--red)", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, "\u2715")
          );
        })
      ),
      React.createElement("input", { ref: fileInputRef, type: "file", accept: "image/*,video/*", multiple: true, style: { display: "none" }, onChange: handleFileSelect }),
      React.createElement("div", { style: { display: "flex", gap: 8, padding: "8px 0", borderTop: "1px solid var(--border)" } },
        React.createElement("button", { style: { background: "none", border: "none", cursor: "pointer", padding: "0 4px", display: "flex", alignItems: "center" }, onClick: function() { if (fileInputRef.current) fileInputRef.current.click(); } }, React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "var(--text3)", strokeWidth: 2 }, React.createElement("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" }))),
        React.createElement("input", { className: "form-input", style: { flex: 1, borderRadius: 24, padding: "10px 16px" }, placeholder: lang === "ru" ? "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435..." : "Message...", value: newMsg, onChange: function(e) { setNewMsg(e.target.value); }, onKeyDown: function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } } }),
        React.createElement("button", { style: { background: newMsg.trim() ? "var(--green)" : "var(--bg3)", border: "none", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }, onClick: sendMsg }, React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: newMsg.trim() ? "#fff" : "var(--text3)", strokeWidth: 2 }, React.createElement("path", { d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" })))
      )
    );

    // Conversations list
    if (loading) return React.createElement("div", { className: "loading-spinner" });
    if (!convos.length) return React.createElement("div", { className: "empty-state" }, React.createElement("div", { className: "emoji" }, "\u{1F4AC}"), React.createElement("p", null, lang === "ru" ? "\u041D\u0435\u0442 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439.\n\u0427\u0430\u0442 \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043E\u0442\u043A\u043B\u0438\u043A\u0430." : "No messages yet."));
    return React.createElement(React.Fragment, null,
      React.createElement("h2", { style: { fontSize: "1rem", fontWeight: 700, marginBottom: 12 } }, lang === "ru" ? "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F" : "Messages"),
      convos.map(function(c) {
        return React.createElement("div", { key: c.id, style: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "border-color 0.2s" }, onClick: function() { openChat(c.other_id, c.other_name || "User"); } },
          React.createElement("div", { style: { width: 42, height: 42, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 } }, "\u{1F464}"),
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
              React.createElement("div", { style: { fontWeight: 700, fontSize: "0.85rem" } }, c.other_name || "User"),
              React.createElement("div", { style: { fontSize: "0.6rem", color: "var(--text3)" } }, (c.created_at || "").slice(0, 10))
            ),
            React.createElement("div", { style: { fontSize: "0.75rem", color: "var(--text3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, (c.content || "").slice(0, 50))
          ),
          c.unread > 0 && React.createElement("div", { style: { background: "var(--green)", color: "#fff", borderRadius: "50%", minWidth: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700 } }, c.unread)
        );
      })
    );
  }
  function ProfileTab() {
    const { lang, user, setUser, showToast } = useContext(AppContext);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [portfolioFiles, setPortfolioFiles] = useState([]);
    const avatarRef = useRef(null);
    const portfolioRef = useRef(null);
    const [nativeLang2, setNativeLang2] = useState(user?.native_language || "");
    const [addLangs2, setAddLangs2] = useState(user?.additional_languages || []);

    if (!user) return null;
    var isMaster = user.role === "master";
    var country = COUNTRIES.find(function(c) { return c.code === user.country; });
    var natLang = LANGUAGES.find(function(l) { return l.code === (user.native_language || nativeLang2); });
    var addLangNames = (user.additional_languages || addLangs2 || []).map(function(lc) { var l = LANGUAGES.find(function(x) { return x.code === lc; }); return l ? l[lang] : lc; });

    function startEdit() {
      setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", city: user.city || "", bio: user.bio || "", experience: user.experience || "" });
      setNativeLang2(user.native_language || "");
      setAddLangs2(user.additional_languages || []);
      setEditing(true);
    }

    async function saveProfile() {
      var updates = Object.assign({}, form);
      updates.native_language = nativeLang2;
      updates.additional_languages = addLangs2;
      // Upload avatar
      if (avatarFile && typeof api !== "undefined") {
        var av = await api.uploadMedia(avatarFile);
        if (av && av.url) updates.avatar_url = av.url;
      }
      if (typeof api !== "undefined") {
        var r = await api.updateProfile(updates);
        if (r && !r.error) {
          setUser(Object.assign({}, user, updates));
          showToast(lang === "ru" ? "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D" : "Profile updated");
          setEditing(false);
        } else showToast((r && r.error) || "Error");
      }
    }

    if (editing) return React.createElement(React.Fragment, null,
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
        React.createElement("h2", { style: { fontSize: "1rem", fontWeight: 700 } }, lang === "ru" ? "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435" : "Edit Profile"),
        React.createElement("button", { className: "btn btn-sm btn-outline", onClick: function() { setEditing(false); } }, lang === "ru" ? "\u041E\u0442\u043C\u0435\u043D\u0430" : "Cancel")
      ),
      React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } },
        React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: "var(--bg3)", border: "3px solid var(--green)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", overflow: "hidden", cursor: "pointer" }, onClick: function() { if (avatarRef.current) avatarRef.current.click(); } },
          (avatarFile ? React.createElement("img", { src: URL.createObjectURL(avatarFile), style: { width: "100%", height: "100%", objectFit: "cover" } }) : user.avatar_url ? React.createElement("img", { src: user.avatar_url, style: { width: "100%", height: "100%", objectFit: "cover" } }) : (isMaster ? "\u{1F527}" : "\u{1F4CB}"))
        ),
        React.createElement("input", { ref: avatarRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: function(e) { if (e.target.files[0]) setAvatarFile(e.target.files[0]); } }),
        React.createElement("div", { style: { fontSize: "0.7rem", color: "var(--green)", cursor: "pointer" }, onClick: function() { if (avatarRef.current) avatarRef.current.click(); } }, lang === "ru" ? "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u043E\u0442\u043E" : "Change photo")
      ),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0418\u043C\u044F" : "Name"), React.createElement("input", { className: "form-input", value: form.name, onChange: function(e) { setForm(Object.assign({}, form, { name: e.target.value })); } })),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, "Email"), React.createElement("input", { className: "form-input", value: form.email, onChange: function(e) { setForm(Object.assign({}, form, { email: e.target.value })); } })),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" : "Phone"), React.createElement("input", { className: "form-input", value: form.phone, onChange: function(e) { setForm(Object.assign({}, form, { phone: e.target.value })); } })),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0413\u043E\u0440\u043E\u0434" : "City"), React.createElement("input", { className: "form-input", value: form.city, onChange: function(e) { setForm(Object.assign({}, form, { city: e.target.value })); } })),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u041E \u0441\u0435\u0431\u0435" : "About"), React.createElement("textarea", { className: "form-input", rows: 3, value: form.bio, onChange: function(e) { setForm(Object.assign({}, form, { bio: e.target.value })); } })),
      isMaster && React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u041E\u043F\u044B\u0442" : "Experience"), React.createElement("input", { className: "form-input", value: form.experience, onChange: function(e) { setForm(Object.assign({}, form, { experience: e.target.value })); } })),
      role === "master" && React.createElement(React.Fragment, null,
        React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0422\u0438\u043F \u0440\u0430\u0431\u043E\u0442\u044B" : "Work Type"),
          React.createElement("div", { className: "role-toggle" },
            React.createElement("div", { className: "role-option " + (workType === "self" ? "active" : ""), onClick: function() { setWorkType("self"); }, style: { padding: 10 } }, React.createElement("div", { className: "role-icon" }, "\u{1F464}"), React.createElement("div", { className: "role-label", style: { fontSize: "0.7rem" } }, lang === "ru" ? "\u0421\u0430\u043C" : "Self")),
            React.createElement("div", { className: "role-option " + (workType === "company" ? "active" : ""), onClick: function() { setWorkType("company"); }, style: { padding: 10 } }, React.createElement("div", { className: "role-icon" }, "\u{1F3E2}"), React.createElement("div", { className: "role-label", style: { fontSize: "0.7rem" } }, lang === "ru" ? "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" : "Company")),
            React.createElement("div", { className: "role-option " + (workType === "brigade" ? "active" : ""), onClick: function() { setWorkType("brigade"); }, style: { padding: 10 } }, React.createElement("div", { className: "role-icon" }, "\u{1F465}"), React.createElement("div", { className: "role-label", style: { fontSize: "0.7rem" } }, lang === "ru" ? "\u0411\u0440\u0438\u0433\u0430\u0434\u0430" : "Team"))
          )),
        workType === "company" && React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" : "Company Name"), React.createElement("input", { className: "form-input", value: companyName, onChange: function(e) { setCompanyName(e.target.value); } }))
      ),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0420\u043E\u0434\u043D\u043E\u0439 \u044F\u0437\u044B\u043A" : "Native Language"), React.createElement("select", { className: "form-input", value: nativeLang2, onChange: function(e) { setNativeLang2(e.target.value); } }, React.createElement("option", { value: "" }, "—"), LANGUAGES.map(function(l) { return React.createElement("option", { key: l.code, value: l.code }, l[lang]); }))),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0414\u043E\u043F. \u044F\u0437\u044B\u043A\u0438" : "Other Languages"), React.createElement("div", { className: "cat-select-grid" }, LANGUAGES.map(function(l) { return React.createElement("div", { key: l.code, className: "cat-select-chip " + (addLangs2.includes(l.code) ? "selected" : ""), onClick: function() { setAddLangs2(function(p) { return p.includes(l.code) ? p.filter(function(c) { return c !== l.code; }) : p.concat([l.code]); }); } }, l[lang]); }))),
      React.createElement("button", { className: "btn btn-primary btn-full", style: { marginTop: 12 }, onClick: saveProfile }, lang === "ru" ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "Save")
    );

    return React.createElement(React.Fragment, null,
      React.createElement("div", { className: "profile-header" },
        React.createElement("div", { className: "profile-avatar", style: user.avatar_url ? { backgroundImage: "url(" + user.avatar_url + ")", backgroundSize: "cover", backgroundPosition: "center" } : {} }, !user.avatar_url && (isMaster ? "\u{1F527}" : "\u{1F4CB}")),
        React.createElement("div", { className: "profile-name" }, user.name),
        React.createElement("div", { className: "profile-role" }, isMaster ? (lang === "ru" ? "\u041C\u0430\u0441\u0442\u0435\u0440" : "Tradesperson") : (lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A" : "Client"))
      ),
      React.createElement("div", { className: "profile-section" },
        React.createElement("div", { className: "profile-section-title" }, lang === "ru" ? "\u041B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435" : "Personal Info"),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, "Email"), React.createElement("span", null, user.email)),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang === "ru" ? "\u0421\u0442\u0440\u0430\u043D\u0430" : "Country"), React.createElement("span", null, country ? country[lang] : "\u2014")),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang === "ru" ? "\u0413\u043E\u0440\u043E\u0434" : "City"), React.createElement("span", null, user.city || "\u2014")),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang === "ru" ? "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" : "Phone"), React.createElement("span", null, user.phone || "\u2014")),
        user.bio && React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang === "ru" ? "\u041E \u0441\u0435\u0431\u0435" : "About"), React.createElement("span", null, user.bio))
      ),
      React.createElement("div", { className: "profile-section" },
        React.createElement("div", { className: "profile-section-title" }, lang === "ru" ? "\u042F\u0437\u044B\u043A\u0438" : "Languages"),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang === "ru" ? "\u0420\u043E\u0434\u043D\u043E\u0439" : "Native"), React.createElement("span", null, natLang ? natLang[lang] : "\u2014")),
        addLangNames.length > 0 && React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang === "ru" ? "\u0414\u043E\u043F." : "Other"), React.createElement("span", null, addLangNames.join(", ")))
      ),
      isMaster && user.categories && user.categories.length > 0 && React.createElement("div", { className: "profile-section" },
        React.createElement("div", { className: "profile-section-title" }, lang === "ru" ? "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F" : "Specialization"),
        React.createElement("div", { className: "cat-select-grid" }, user.categories.map(function(catId) { var c = CATEGORIES.find(function(cat) { return cat.id === catId; }); return c ? React.createElement("span", { key: c.id, className: "cat-select-chip selected" }, c.icon, " ", c[lang]) : null; }))
      ),
      React.createElement("button", { className: "btn btn-primary btn-full", style: { marginTop: 16 }, onClick: startEdit }, lang === "ru" ? "\u2270\uFE0F \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" : "\u270F\uFE0F Edit Profile")
    );
  }
  function ClientDashboard() {
    const { lang, notifCount, setViewProfileId } = useContext(AppContext);
    const t = translations[lang].clientDash;
    const [tab, setTab] = useState("myOrders");
    useEffect(function() {
      function handleOpenChat() { setTab("messages"); }
      window.addEventListener("ss_open_chat", handleOpenChat);
      return function() { window.removeEventListener("ss_open_chat", handleOpenChat); };
    }, []);
    const navItems = [
      { id: "newOrder", icon: Icons.plus, label: t.newOrder },
      { id: "myOrders", icon: Icons.list, label: t.myOrders },
      { id: "masters", icon: Icons.users, label: t.masters },
      { id: "messages", icon: Icons.message, label: t.messages },
      { id: "profile", icon: Icons.user, label: t.profile }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "dash" }, /* @__PURE__ */ React.createElement("div", { className: "dash-content" }, tab === "newOrder" && /* @__PURE__ */ React.createElement(NewOrderTab, null), tab === "myOrders" && /* @__PURE__ */ React.createElement(MyOrdersTab, null), tab === "masters" && /* @__PURE__ */ React.createElement(MastersCatalogTab, null), tab === "messages" && /* @__PURE__ */ React.createElement(MessagesTab, null), tab === "profile" && /* @__PURE__ */ React.createElement(ProfileTab, null)), /* @__PURE__ */ React.createElement("nav", { className: "dash-nav" }, navItems.map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, className: `dash-nav-item ${tab === item.id ? "active" : ""}`, onClick: () => setTab(item.id), style: { position: "relative" } }, item.icon, /* @__PURE__ */ React.createElement("span", null, item.label), item.id === "messages" && typeof notifCount !== "undefined" && notifCount > 0 && React.createElement("div", { style: { position: "absolute", top: 0, right: "50%", marginRight: -16, background: "#ef4444", color: "#fff", borderRadius: 10, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, border: "2px solid var(--bg2)", zIndex: 5 } }, notifCount > 9 ? "9+" : notifCount)))));
  }
  function NewOrderTab() {
    const { lang, showToast } = useContext(AppContext);
    const t = translations[lang].orderForm;
    const [form, setForm] = useState({ category_id: "", title: "", description: "", budget: "", deadline: "", location: "" });
    var [orderFiles, setOrderFiles] = useState([]);
    var orderFileRef = useRef(null);
    function handleOrderFiles(e) { var f = Array.from(e.target.files || []); if (orderFiles.length + f.length > 10) return; setOrderFiles(function(p) { return p.concat(f); }); e.target.value = ""; }
    const [submitting, setSubmitting] = useState(false);
    var update = function(f, v) { setForm(function(p) { var n = Object.assign({}, p); n[f] = v; return n; }); };
    var handleSubmit = async function() {
      if (!form.title || !form.category_id) { showToast(lang === "ru" ? "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E" : "Fill title and category"); return; }
      setSubmitting(true);
      var fileAtts = [];
      if (orderFiles.length > 0 && typeof api !== "undefined") {
        for (var oi = 0; oi < orderFiles.length; oi++) {
          var ur = await api.uploadMedia(orderFiles[oi]);
          if (ur && ur.url) fileAtts.push({ type: ur.type, url: ur.url, name: ur.name });
        }
      }
      var body = Object.assign({}, form);
      if (body.budget) body.budget = parseFloat(body.budget);
      if (fileAtts.length) body.attachments = fileAtts;
      var result = typeof api !== "undefined" ? await api.createOrder(body) : null;
      setSubmitting(false);
      if (result && result.id) { showToast(lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D!" : "Order published!"); setForm({ category_id: "", title: "", description: "", budget: "", deadline: "", location: "" }); setOrderFiles([]); }
      else showToast((result && result.error) || "Error");
    };
    return React.createElement(React.Fragment, null,
      React.createElement("h2", { className: "page-title" }, t.title),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, t.category), React.createElement("select", { className: "form-input", value: form.category_id, onChange: function(e) { update("category_id", e.target.value); } }, React.createElement("option", { value: "" }, t.selectCategory), CATEGORIES.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.icon, " ", c[lang]); }))),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 *" : "Title *"), React.createElement("input", { className: "form-input", value: form.title, onChange: function(e) { update("title", e.target.value); } })),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, t.description), React.createElement("textarea", { className: "form-input", value: form.description, onChange: function(e) { update("description", e.target.value); } })),
      React.createElement("div", { style: { display: "flex", gap: 10 } }, React.createElement("div", { className: "form-group", style: { flex: 1 } }, React.createElement("label", { className: "form-label" }, t.budget), React.createElement("input", { className: "form-input", type: "number", value: form.budget, onChange: function(e) { update("budget", e.target.value); } })), React.createElement("div", { className: "form-group", style: { flex: 1 } }, React.createElement("label", { className: "form-label" }, t.deadline), React.createElement("input", { className: "form-input", type: "date", value: form.deadline, onChange: function(e) { update("deadline", e.target.value); } }))),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, t.location), React.createElement("input", { className: "form-input", value: form.location, onChange: function(e) { update("location", e.target.value); } })),
      React.createElement("input", { ref: orderFileRef, type: "file", accept: "image/*,video/*,application/pdf", multiple: true, style: { display: "none" }, onChange: handleOrderFiles }),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0424\u0430\u0439\u043B\u044B (\u0444\u043E\u0442\u043E, \u0432\u0438\u0434\u0435\u043E, PDF)" : "Files (photo, video, PDF)"),
        React.createElement("div", { style: { border: "2px dashed var(--border)", borderRadius: "var(--radius)", padding: 16, textAlign: "center", cursor: "pointer" }, onClick: function() { if (orderFileRef.current) orderFileRef.current.click(); } },
          React.createElement("div", { style: { fontSize: "1.5rem", marginBottom: 4 } }, "\u{1F4CE}"),
          React.createElement("div", { style: { fontSize: "0.75rem", color: "var(--text3)" } }, lang === "ru" ? "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u0434\u043B\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 (\u0434\u043E 10)" : "Click to upload (max 10)")
        ),
        orderFiles.length > 0 && React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 } }, orderFiles.map(function(f, fi) { return React.createElement("div", { key: fi, style: { position: "relative", display: "inline-flex", alignItems: "center", gap: 4, background: "var(--bg3)", borderRadius: 8, padding: "4px 8px", fontSize: "0.7rem", color: "var(--text2)" } }, f.name.slice(0, 15), React.createElement("button", { onClick: function() { setOrderFiles(function(p) { return p.filter(function(_, i) { return i !== fi; }); }); }, style: { background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "0.8rem" } }, "\u2715")); }))
      ),
      React.createElement("button", { className: "btn btn-primary btn-full", onClick: handleSubmit, disabled: submitting }, submitting ? "..." : t.submit)
    );
  }
  function MyOrdersTab() {
    const { lang, user, showToast, setViewProfileId } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [responses2, setResponses2] = useState([]);
    const [loadingResp, setLoadingResp] = useState(false);
    useEffect(function() { loadOrders(); }, []);
    function loadOrders() {
      setLoading(true);
      if (typeof api !== "undefined") api.getOrders({ status: "all" }).then(function(r) { setOrders((r && r.orders || []).filter(function(o) { return o.client_id === (user && user.id); })); setLoading(false); });
      else { setOrders(MOCK_ORDERS.slice(0,3)); setLoading(false); }
    }
    function viewResponses(order) {
      setSelectedOrder(order);
      setLoadingResp(true);
      if (typeof api !== "undefined") api.getResponses(order.id).then(function(r) { setResponses2(r && !r.error ? r : []); setLoadingResp(false); });
      else setLoadingResp(false);
    }
    function acceptMaster(respId) {
      if (typeof api !== "undefined") api.acceptResponse(respId).then(function(r) {
        if (r && r.success) { showToast(lang === "ru" ? "Мастер подтверждён!" : "Master confirmed!"); setSelectedOrder(null); loadOrders(); }
        else showToast((r && r.error) || "Error");
      });
    }
    function completeOrder(orderId) {
      var rating = prompt(lang === "ru" ? "Оценка мастера (1-5):" : "Rate master (1-5):");
      if (!rating) return;
      if (typeof api !== "undefined") api.completeOrder(orderId, { rating: parseInt(rating) }).then(function(r) {
        if (r && r.success) { showToast(lang === "ru" ? "Заказ завершён!" : "Order completed!"); loadOrders(); }
      });
    }
    if (loading) return React.createElement("div", { className: "loading-spinner" });
    if (!orders.length) return React.createElement("div", { className: "empty-state" }, React.createElement("div", { className: "emoji" }, "\u{1F4CB}"), React.createElement("p", null, lang === "ru" ? "У вас пока нет заказов" : "No orders yet"));
    if (selectedOrder) return React.createElement(React.Fragment, null,
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 } },
        React.createElement("button", { onClick: function() { setSelectedOrder(null); }, style: { background: "none", border: "none", color: "var(--text)", cursor: "pointer" } }, Icons.back),
        React.createElement("h2", { style: { fontSize: "1rem", fontWeight: 700 } }, selectedOrder.title)
      ),
      React.createElement("div", { className: "order-meta", style: { marginBottom: 16 } }, React.createElement("span", null, Icons.location, " ", selectedOrder.location || ""), React.createElement("span", { className: "status-badge status-" + (selectedOrder.status === "open" ? "open" : "active") }, selectedOrder.status)),
      selectedOrder.status === "in_progress" && React.createElement("button", { className: "btn btn-primary btn-full mb-2", onClick: function() { completeOrder(selectedOrder.id); } }, lang === "ru" ? "✅ Работа выполнена" : "✅ Mark Complete"),
      React.createElement("h3", { style: { fontSize: "0.9rem", fontWeight: 700, marginBottom: 10 } }, lang === "ru" ? "Отклики мастеров (" + (selectedOrder.responses_count || 0) + ")" : "Responses (" + (selectedOrder.responses_count || 0) + ")"),
      loadingResp ? React.createElement("div", { className: "loading-spinner" }) : responses2.length === 0 ? React.createElement("p", { style: { color: "var(--text3)", fontSize: "0.8rem" } }, lang === "ru" ? "Пока нет откликов" : "No responses yet") :
      responses2.map(function(r) {
        return React.createElement("div", { key: r.id, className: "order-card", style: { borderColor: r.status === "accepted" ? "var(--green)" : "var(--border)" } },
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
            React.createElement("div", null,
              React.createElement("div", { style: { fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", color: "var(--green)" }, onClick: function(ev) { ev.stopPropagation(); setViewProfileId(r.master_id); } }, r.master_name || "Master #" + r.master_id),
              React.createElement("div", { style: { fontSize: "0.7rem", color: "var(--text3)" } }, Icons.star, " ", r.master_rating || "—", " · ", r.master_city || "", ", ", r.master_country || "")
            ),
            r.status === "accepted" ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" } },
              React.createElement("span", { className: "status-badge status-active" }, "\u2705 " + (lang === "ru" ? "\u0412\u044B\u0431\u0440\u0430\u043D" : "Chosen")),
              React.createElement("button", { className: "btn btn-sm btn-primary", style: { padding: "5px 14px", fontSize: "0.7rem" }, onClick: function(ev) { ev.stopPropagation(); if (typeof localStorage !== "undefined") localStorage.setItem("ss_chat_with", JSON.stringify({ id: r.master_id, name: r.master_name || "Master" })); window.dispatchEvent(new CustomEvent("ss_open_chat")); } }, "\u{1F4AC} " + (lang === "ru" ? "\u0427\u0430\u0442" : "Chat"))
            ) :
            r.status === "pending" && selectedOrder.status === "open" ? React.createElement("button", { className: "btn btn-sm btn-primary", onClick: function() { acceptMaster(r.id); } }, lang === "ru" ? "Выбрать" : "Accept") : null
          ),
          r.message && React.createElement("p", { style: { fontSize: "0.8rem", color: "var(--text2)", marginTop: 8, lineHeight: 1.4 } }, r.message),
          r.proposed_budget && React.createElement("div", { className: "order-budget", style: { marginTop: 6 } }, r.proposed_budget, "€"),
          r.status === "accepted" && React.createElement("button", { className: "btn btn-primary btn-full", style: { marginTop: 12 }, onClick: function(ev) { ev.stopPropagation(); if (typeof localStorage !== "undefined") localStorage.setItem("ss_chat_with", JSON.stringify({ id: r.master_id, name: r.master_name || "Master" })); window.dispatchEvent(new CustomEvent("ss_open_chat")); } }, "\u{1F4AC} " + (lang === "ru" ? "\u041D\u0430\u0447\u0430\u0442\u044C \u0447\u0430\u0442" : "Start Chat"))
        );
      })
    );
    return React.createElement(React.Fragment, null, React.createElement("h2", { className: "page-title", style: { fontSize: "1rem" } }, lang === "ru" ? "Мои заказы" : "My Orders"), orders.map(function(o) {
      return React.createElement("div", { key: o.id, className: "order-card", onClick: function() { viewResponses(o); }, style: { cursor: "pointer" } },
        React.createElement("div", { className: "order-title" }, o.title || o.titleEn),
        React.createElement("div", { className: "order-meta" }, React.createElement("span", null, Icons.location, " ", o.location || ""), React.createElement("span", { className: "status-badge status-" + (o.status === "open" ? "open" : o.status === "completed" ? "active" : "open") }, o.status)),
        React.createElement("div", { className: "order-footer" }, React.createElement("div", { className: "order-budget" }, o.budget, o.currency || "€"), React.createElement("div", { className: "order-responses", style: { color: (o.responses_count || 0) > 0 ? "var(--green)" : "var(--text3)" } }, "💬 ", o.responses_count || 0, " ", lang === "ru" ? "откликов" : "responses"))
      );
    }));
  }
  function MastersCatalogTab() {
    const { lang, setViewProfileId } = useContext(AppContext);
    const tc = translations[lang].common;
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("all");
    useEffect(function() { loadMasters(); }, [filterCat]);
    function loadMasters() {
      setLoading(true);
      var params = {};
      if (filterCat !== "all") params.category = filterCat;
      if (search) params.search = search;
      if (typeof api !== "undefined") api.getMasters(params).then(function(r) { setMasters(r && !r.error ? r : MOCK_MASTERS); setLoading(false); });
      else { setMasters(MOCK_MASTERS.filter(function(m) { return filterCat === "all" || m.categories.includes(filterCat); })); setLoading(false); }
    }
    return React.createElement(React.Fragment, null,
      React.createElement("div", { className: "search-bar" }, Icons.search, React.createElement("input", { placeholder: tc.search, value: search, onChange: function(e) { setSearch(e.target.value); }, onKeyDown: function(e) { if (e.key === "Enter") loadMasters(); } })),
      React.createElement("div", { className: "tabs" },
        React.createElement("div", { className: "tab " + (filterCat === "all" ? "active" : ""), onClick: function() { setFilterCat("all"); } }, tc.all),
        CATEGORIES.map(function(c) { return React.createElement("div", { key: c.id, className: "tab " + (filterCat === c.id ? "active" : ""), onClick: function() { setFilterCat(c.id); } }, c.icon, " ", c[lang]); })
      ),
      loading ? React.createElement("div", { className: "loading-spinner" }) : masters.length === 0 ? React.createElement("div", { className: "empty-state" }, React.createElement("div", { className: "emoji" }, "\u{1F50D}"), React.createElement("p", null, tc.noResults)) :
      masters.map(function(m) {
        var cats = (m.categories || []).map(function(cid) { return CATEGORIES.find(function(c) { return c.id === cid; }); }).filter(Boolean);
        return React.createElement("div", { key: m.id, className: "master-card " + (m.is_premium || m.premium ? "premium" : "") },
          React.createElement("div", { className: "master-avatar" }, "\u{1F527}"),
          React.createElement("div", { className: "master-info" },
            React.createElement("div", { className: "master-name", style: { cursor: "pointer" }, onClick: function(ev) { ev.stopPropagation(); setViewProfileId(m.id); } }, m.name || m.nameEn, " ", (m.is_premium || m.premium) && Icons.crown),
            React.createElement("div", { className: "master-cats" }, cats.map(function(c) { return c[lang]; }).join(" \u00B7 ")),
            React.createElement("div", { className: "master-stats" }, React.createElement("div", { className: "master-rating" }, Icons.star, " ", m.rating || "\u2014"), React.createElement("div", { className: "master-reviews" }, "(", m.reviews_count || m.reviews || 0, ")"), React.createElement("span", { style: { fontSize: "0.7rem", color: "var(--text3)" } }, Icons.location, " ", m.city, ", ", m.country))
          )
        );
      })
    );
  }
  function AdminPanel() {
    const { lang, notifCount } = useContext(AppContext);
    const t = translations[lang].admin;
    const [tab, setTab] = useState("stats");
    const navItems = [
      { id: "stats", icon: Icons.chart, label: t.stats },
      { id: "users", icon: Icons.users, label: t.users },
      { id: "orders", icon: Icons.list, label: t.orders },
      { id: "tops", icon: Icons.crown, label: t.tops },
      { id: "broadcast", icon: Icons.send, label: t.broadcast }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "dash" }, /* @__PURE__ */ React.createElement("div", { className: "dash-content" }, tab === "stats" && /* @__PURE__ */ React.createElement(AdminStatsTab, null), tab === "users" && /* @__PURE__ */ React.createElement(AdminUsersTab, null), tab === "orders" && /* @__PURE__ */ React.createElement(AdminOrdersTab, null), tab === "tops" && /* @__PURE__ */ React.createElement(AdminTopsTab, null), tab === "broadcast" && /* @__PURE__ */ React.createElement(AdminBroadcastTab, null)), /* @__PURE__ */ React.createElement("nav", { className: "dash-nav" }, navItems.map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, className: `dash-nav-item ${tab === item.id ? "active" : ""}`, onClick: () => setTab(item.id), style: { position: "relative" } }, item.icon, /* @__PURE__ */ React.createElement("span", null, item.label), item.id === "messages" && typeof notifCount !== "undefined" && notifCount > 0 && React.createElement("div", { style: { position: "absolute", top: 0, right: "50%", marginRight: -16, background: "#ef4444", color: "#fff", borderRadius: 10, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, border: "2px solid var(--bg2)", zIndex: 5 } }, notifCount > 9 ? "9+" : notifCount)))));
  }
  function AdminStatsTab() {
    const { lang } = useContext(AppContext);
    const [stats, setStats] = useState(null);
    useEffect(function() { if (typeof api !== "undefined") api.adminStats().then(function(r) { setStats(r && !r.error ? r : { masters: 0, clients: 0, orders: 0, open_orders: 0, top_categories: [] }); }); else setStats({ masters: 342, clients: 1247, orders: 856, open_orders: 128, top_categories: [] }); }, []);
    if (!stats) return React.createElement("div", { className: "loading-spinner" });
    var cards = [{ value: stats.masters || 0, label: lang === "ru" ? "\u041C\u0430\u0441\u0442\u0435\u0440\u043E\u0432" : "Masters" }, { value: stats.clients || 0, label: lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u043E\u0432" : "Clients" }, { value: stats.orders || 0, label: lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u043E\u0432" : "Orders" }, { value: stats.open_orders || 0, label: lang === "ru" ? "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0445" : "Open" }];
    return React.createElement(React.Fragment, null,
      React.createElement("h2", { className: "page-title", style: { fontSize: "1rem" } }, lang === "ru" ? "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430" : "Statistics"),
      React.createElement("div", { className: "admin-grid" }, cards.map(function(s, i) { return React.createElement("div", { key: i, className: "admin-stat" }, React.createElement("div", { className: "admin-stat-value" }, s.value), React.createElement("div", { className: "admin-stat-label" }, s.label)); })),
      stats.top_categories && stats.top_categories.length > 0 && React.createElement("div", { style: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 } }, React.createElement("div", { style: { fontSize: "0.8rem", fontWeight: 700, marginBottom: 12 } }, lang === "ru" ? "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438" : "Popular Categories"), stats.top_categories.map(function(tc2) { var c = CATEGORIES.find(function(ca) { return ca.id === tc2.category_id; }); return React.createElement("div", { key: tc2.category_id, style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem", padding: "4px 0" } }, React.createElement("span", null, c ? c.icon + " " + c[lang] : tc2.category_id), React.createElement("span", { className: "text-green" }, tc2.count)); }))
    );
  }
  function AdminUsersTab() {
    const { lang, showToast } = useContext(AppContext);
    const [users2, setUsers2] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    useEffect(function() { loadUsers(); }, [filter]);
    function loadUsers() {
      setLoading(true);
      var params = {};
      if (filter !== "all") params.role = filter;
      if (typeof api !== "undefined") api.adminUsers(params).then(function(r) { setUsers2(r && !r.error ? r : MOCK_USERS); setLoading(false); });
      else { setUsers2(MOCK_USERS.filter(function(u) { return filter === "all" || u.role === filter; })); setLoading(false); }
    }
    function toggleBlock(u) { if (typeof api !== "undefined") { var ns = u.status === "active" ? "blocked" : "active"; api.adminUpdateUser(u.id, { status: ns }).then(function() { showToast(ns === "blocked" ? "Blocked" : "Unblocked"); loadUsers(); }); } else showToast("Demo mode"); }
    return React.createElement(React.Fragment, null,
      React.createElement("h2", { className: "page-title", style: { fontSize: "1rem" } }, lang === "ru" ? "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438" : "Users"),
      React.createElement("div", { className: "tabs" }, [{ id: "all", label: lang === "ru" ? "\u0412\u0441\u0435" : "All" }, { id: "master", label: lang === "ru" ? "\u041C\u0430\u0441\u0442\u0435\u0440\u0430" : "Masters" }, { id: "client", label: lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u0438" : "Clients" }].map(function(t) { return React.createElement("div", { key: t.id, className: "tab " + (filter === t.id ? "active" : ""), onClick: function() { setFilter(t.id); } }, t.label); })),
      loading ? React.createElement("div", { className: "loading-spinner" }) : users2.map(function(u) {
        return React.createElement("div", { key: u.id, style: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" } },
          React.createElement("div", null, React.createElement("div", { style: { fontWeight: 700, fontSize: "0.85rem" } }, u.name), React.createElement("div", { style: { fontSize: "0.7rem", color: "var(--text3)" } }, u.email, " \u00B7 ", u.role === "master" ? "\u{1F527}" : "\u{1F4CB}", " ", u.country)),
          React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, React.createElement("span", { className: "status-badge " + (u.status === "active" ? "status-active" : "status-blocked") }, u.status), React.createElement("button", { className: "btn btn-sm btn-outline", style: { padding: "4px 8px", fontSize: "0.65rem" }, onClick: function() { toggleBlock(u); } }, u.status === "active" ? "\u{1F6AB}" : "\u2705"))
        );
      })
    );
  }
  function AdminOrdersTab() {
    const { lang, showToast } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(function() { loadOrders(); }, []);
    function loadOrders() { setLoading(true); if (typeof api !== "undefined") api.getOrders({ status: "all", limit: 50 }).then(function(r) { setOrders(r && r.orders || MOCK_ORDERS); setLoading(false); }); else { setOrders(MOCK_ORDERS); setLoading(false); } }
    function toggleTop(o) { if (typeof api !== "undefined") api.adminToggleTop(o.id, { is_top: o.is_top ? 0 : 1, is_premium: o.is_premium ? 0 : 1 }).then(function() { showToast(o.is_top ? "Removed TOP" : "Added TOP!"); loadOrders(); }); else showToast("Demo"); }
    if (loading) return React.createElement("div", { className: "loading-spinner" });
    return React.createElement(React.Fragment, null, React.createElement("h2", { className: "page-title", style: { fontSize: "1rem" } }, lang === "ru" ? "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430\u043C\u0438" : "Orders"), orders.map(function(o) { return React.createElement("div", { key: o.id, className: "order-card " + (o.is_premium || o.is_top || o.premium ? "premium" : "") }, (o.is_premium || o.is_top || o.premium) && React.createElement("span", { className: "order-badge badge-premium" }, Icons.crown), React.createElement("div", { className: "order-title" }, o.title || o.titleEn), React.createElement("div", { className: "order-meta" }, React.createElement("span", null, Icons.location, " ", o.location), React.createElement("span", null, o.client_name || o.clientName || ""), React.createElement("span", null, o.budget, "\u20AC")), React.createElement("button", { className: "btn btn-sm btn-yellow", style: { marginTop: 8, fontSize: "0.65rem" }, onClick: function() { toggleTop(o); } }, "\u2B50 ", (o.is_top || o.premium) ? (lang === "ru" ? "\u0421\u043D\u044F\u0442\u044C" : "Remove") : "TOP")); }));
  }
  function AdminTopsTab() {
    return React.createElement(AdminOrdersTab);
  }
  function AdminBroadcastTab() {
    const { lang, showToast } = useContext(AppContext);
    const [target, setTarget] = useState("all");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    var handleSend = async function() {
      if (!message.trim()) { showToast(lang === "ru" ? "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442" : "Enter message"); return; }
      setSending(true);
      var result = typeof api !== "undefined" ? await api.adminBroadcast({ target: target, message: message }) : null;
      setSending(false);
      if (result && result.success) { showToast(lang === "ru" ? "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E: " + (result.sent_count || 0) : "Sent: " + (result.sent_count || 0)); setMessage(""); }
      else showToast((result && result.error) || "Sent (demo)");
    };
    return React.createElement(React.Fragment, null,
      React.createElement("h2", { className: "page-title", style: { fontSize: "1rem" } }, lang === "ru" ? "\u0420\u0430\u0441\u0441\u044B\u043B\u043A\u0430 \u0447\u0435\u0440\u0435\u0437 \u0431\u043E\u0442\u0430" : "Bot Broadcast"),
      React.createElement("div", { className: "form-label" }, lang === "ru" ? "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u0438" : "Recipients"),
      React.createElement("div", { className: "broadcast-target" }, [{ id: "all", label: lang === "ru" ? "\u0412\u0441\u0435\u043C" : "All" }, { id: "masters", label: lang === "ru" ? "\u041C\u0430\u0441\u0442\u0435\u0440\u0430" : "Masters" }, { id: "clients", label: lang === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u0438" : "Clients" }].map(function(t) { return React.createElement("button", { key: t.id, className: "target-btn " + (target === t.id ? "active" : ""), onClick: function() { setTarget(t.id); } }, t.label); })),
      React.createElement("div", { className: "form-group" }, React.createElement("label", { className: "form-label" }, lang === "ru" ? "\u0422\u0435\u043A\u0441\u0442" : "Message"), React.createElement("textarea", { className: "form-input", rows: 5, value: message, onChange: function(e) { setMessage(e.target.value); }, style: { minHeight: 120 } })),
      React.createElement("button", { className: "btn btn-primary btn-full", onClick: handleSend, disabled: sending }, Icons.send, " ", sending ? "..." : (lang === "ru" ? "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C" : "Send"))
    );
  }
  function App() {
    const [lang, setLang] = useState("ru");
    const [page, setPage] = useState("home");
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [notifCount, setNotifCount] = useState(0);
    var [viewProfileId, setViewProfileId] = useState(null);
    // Poll notifications every 15 seconds
    useEffect(function() {
      function checkNotifs() {
        if (typeof api !== "undefined" && api.token) {
          api.getNotifications(true).then(function(r) {
            if (r && !r.error && r.unread_count !== undefined) setNotifCount(r.unread_count);
            else {
              // Fallback: if notifications table doesn't exist, check messages
              api.getMessages().then(function(m) {
                if (m && !m.error && Array.isArray(m)) {
                  var unread = m.reduce(function(sum, c) { return sum + (c.unread || 0); }, 0);
                  if (unread > 0) setNotifCount(unread);
                }
              });
            }
          });
        }
      }
      checkNotifs();
      var interval = setInterval(checkNotifs, 15000);
      return function() { clearInterval(interval); };
    }, [user]);
    const [wide, setWide] = useState(_isWide());
    useEffect(function() { if (_isTMA) return; var h = function() { setWide(_isWide()); }; window.addEventListener("resize", h); return function() { window.removeEventListener("resize", h); }; }, []);
    useEffect(function() { if (typeof api !== "undefined" && api.token) { api.me().then(function(me) { if (me && me.id && !me.error) {
          setUser(me);
          setPage(me.role === "master" ? "master" : me.role === "admin" ? "admin" : "client");
          // Auto-link Telegram chat_id from Mini App
          if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            var tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            if (tgUser.id) api.linkTelegram(String(tgUser.id));
          }
        } else { api.setToken(null); } }); } }, []);
    const showToast = useCallback((msg) => {
      setToast(msg);
    }, []);
    const ctx = useMemo(() => ({
      lang,
      setLang,
      page,
      setPage,
      user,
      setUser,
      menuOpen,
      setMenuOpen,
      showToast
    }), [lang, page, user, menuOpen, showToast]);
    return /* @__PURE__ */ React.createElement(AppContext.Provider, { value: ctx }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement("div", { className: "app" + (wide ? " wide" : "") }, /* @__PURE__ */ React.createElement(Header, null), /* @__PURE__ */ React.createElement(Sidebar, null), page === "home" && /* @__PURE__ */ React.createElement(LandingPage, null), page === "register" && /* @__PURE__ */ React.createElement(RegisterPage, null), page === "login" && /* @__PURE__ */ React.createElement(LoginPage, null), page === "master" && /* @__PURE__ */ React.createElement(MasterDashboard, null), page === "client" && /* @__PURE__ */ React.createElement(ClientDashboard, null), page === "admin" && /* @__PURE__ */ React.createElement(AdminPanel, null), viewProfileId && React.createElement(PublicProfileModal, { profileId: viewProfileId, onClose: function() { setViewProfileId(null); }, lang: lang }), toast && /* @__PURE__ */ React.createElement(Toast, { message: toast, onClose: () => setToast(null) })));
  }
  if (typeof api !== "undefined") api.init();
  var root = ReactDOM.createRoot(document.getElementById("root"));
  function PublicProfileModal(props) {
    var pId = props.profileId, onClose = props.onClose, lang2 = props.lang || "ru";
    var _s = useState(null), profile = _s[0], setProfile2 = _s[1];
    var _l = useState(true), ld = _l[0], setLd = _l[1];
    useEffect(function() { if (pId && typeof api !== "undefined") api.getProfile(pId).then(function(r) { setProfile2(r && !r.error ? r : null); setLd(false); }); }, [pId]);
    if (!pId) return null;
    var p = profile; if (!p) return ld ? React.createElement("div", { className: "modal-overlay", onClick: onClose }, React.createElement("div", { className: "modal" }, React.createElement("div", { className: "loading-spinner" }))) : null;
    var im = p.role === "master", co = COUNTRIES.find(function(c) { return c.code === p.country; }), nl = LANGUAGES.find(function(l) { return l.code === p.native_language; });
    var al = (p.additional_languages || []).map(function(lc) { var l = LANGUAGES.find(function(x) { return x.code === lc; }); return l ? l[lang2] : lc; });
    var cats = (p.categories || []).map(function(ci) { return CATEGORIES.find(function(c) { return c.id === ci; }); }).filter(Boolean);
    var wl = p.work_type === "company" ? (lang2 === "ru" ? "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" : "Company") : p.work_type === "brigade" ? (lang2 === "ru" ? "\u0411\u0440\u0438\u0433\u0430\u0434\u0430" : "Team") : (lang2 === "ru" ? "\u0421\u0430\u043C\u043E\u0437\u0430\u043D\u044F\u0442\u044B\u0439" : "Self-employed");
    return React.createElement("div", { className: "modal-overlay", onClick: onClose },
      React.createElement("div", { className: "modal", onClick: function(e) { e.stopPropagation(); } },
        React.createElement("div", { className: "modal-handle" }),
        React.createElement("div", { style: { textAlign: "center", marginBottom: 16 } },
          React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: "var(--bg3)", border: "3px solid var(--green)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", overflow: "hidden" } }, p.avatar_url ? React.createElement("img", { src: p.avatar_url, style: { width: "100%", height: "100%", objectFit: "cover" } }) : (im ? "\u{1F527}" : "\u{1F4CB}")),
          React.createElement("div", { style: { fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 } }, p.name),
          React.createElement("div", { style: { color: "var(--green)", fontSize: "0.8rem" } }, im ? (lang2 === "ru" ? "\u041C\u0430\u0441\u0442\u0435\u0440" : "Master") : (lang2 === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A" : "Client")),
          React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 16, marginTop: 10 } },
            im && React.createElement("div", { style: { textAlign: "center" } }, React.createElement("div", { style: { fontWeight: 700 } }, "\u{1F528} ", p.rating || "\u2014"), React.createElement("div", { style: { fontSize: "0.6rem", color: "var(--text3)" } }, lang2 === "ru" ? "\u0420\u0435\u0439\u0442\u0438\u043D\u0433" : "Rating")),
            React.createElement("div", { style: { textAlign: "center" } }, React.createElement("div", { style: { fontWeight: 700 } }, p.completed_orders || 0), React.createElement("div", { style: { fontSize: "0.6rem", color: "var(--text3)" } }, lang2 === "ru" ? "\u0417\u0430\u043A\u0430\u0437\u043E\u0432" : "Jobs")),
            im && React.createElement("div", { style: { textAlign: "center" } }, React.createElement("div", { style: { fontWeight: 700 } }, p.reviews_count || 0), React.createElement("div", { style: { fontSize: "0.6rem", color: "var(--text3)" } }, lang2 === "ru" ? "\u041E\u0442\u0437\u044B\u0432\u043E\u0432" : "Reviews"))
          )
        ),
        React.createElement("div", { className: "divider" }),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang2 === "ru" ? "\u0421\u0442\u0440\u0430\u043D\u0430" : "Country"), React.createElement("span", null, co ? co[lang2] : "\u2014")),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang2 === "ru" ? "\u0413\u043E\u0440\u043E\u0434" : "City"), React.createElement("span", null, p.city || "\u2014")),
        React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang2 === "ru" ? "\u0418\u043D\u0434\u0435\u043A\u0441" : "Index"), React.createElement("span", null, p.postal_code || "\u2014")),
        nl && React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang2 === "ru" ? "\u042F\u0437\u044B\u043A\u0438" : "Languages"), React.createElement("span", null, nl[lang2] + (al.length ? ", " + al.join(", ") : ""))),
        im && React.createElement("div", { className: "profile-field" }, React.createElement("span", { className: "profile-field-label" }, lang2 === "ru" ? "\u0422\u0438\u043F" : "Type"), React.createElement("span", null, wl + (p.company_name ? " \u2014 " + p.company_name : ""))),
        cats.length > 0 && React.createElement("div", { style: { marginTop: 10 } }, React.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, marginBottom: 6 } }, lang2 === "ru" ? "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F" : "Specialization"), React.createElement("div", { className: "cat-select-grid" }, cats.map(function(c) { return React.createElement("span", { key: c.id, className: "cat-select-chip selected" }, c.icon, " ", c[lang2]); }))),
        p.bio && React.createElement("div", { style: { marginTop: 10 } }, React.createElement("div", { style: { fontSize: "0.75rem", fontWeight: 600, marginBottom: 6 } }, lang2 === "ru" ? "\u041E \u0441\u0435\u0431\u0435" : "About"), React.createElement("p", { style: { fontSize: "0.8rem", color: "var(--text3)", lineHeight: 1.5 } }, p.bio)),
        React.createElement("button", { className: "btn btn-outline btn-full", style: { marginTop: 16 }, onClick: onClose }, lang2 === "ru" ? "\u0417\u0430\u043A\u0440\u044B\u0442\u044C" : "Close")
      )
    );
  }

  root.render(React.createElement(App));
})();
