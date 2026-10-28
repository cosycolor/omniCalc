/**
 * Project OmniCalc - Comprehensive Multi-language (i18n) Engine
 * Seamlessly toggles between Korean (ko) and English (en)
 * Covers UI labels, input prompts, tool options, and guide sections
 */

const GLOBE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;

const I18N_DICTIONARY = {
  ko: {
    // Brand & Navigation
    brandName: "모두의 계산기",
    brandTagline: "초고속 무료 스마트 온라인 계산기",
    navHome: "홈",
    navScientific: "공학용",
    navPercent: "퍼센트",
    navUnit: "단위변환",
    navFraction: "분수",
    navAdmin: "관리자",

    // Hero Texts
    heroTitleHome: "정확하고 빠른 무료 스마트 계산기",
    heroDescHome: "사칙연산부터 공학 수식, 퍼센트, 단위 변환까지 브라우저에서 즉시 해결하세요.",
    heroTitleSci: "스마트 공학용 계산기",
    heroDescSci: "삼각함수, 지수, 로그, 제곱근 등 복잡한 수식을 직관적인 키패드로 계산하세요.",
    heroTitlePercent: "실생활 퍼센트 및 할인율 계산기",
    heroDescPercent: "쇼핑 할인율, 주식 수익률, 증가/감소 비율을 실시간으로 확인하세요.",
    heroTitleUnit: "만능 스마트 단위 변환기",
    heroDescUnit: "아파트 평수(평 ↔ ㎡), 길이, 무게, 온도를 한눈에 빠르고 정확하게 변환합니다.",
    heroTitleFraction: "분수 사칙연산 및 약분 계산기",
    heroDescFraction: "분수 더하기, 빼기, 곱하기, 나누기와 기약분수 자동 약분을 즉시 확인하세요.",

    // Calculator Common
    copySuccess: "결과가 클립보드에 복사되었습니다.",
    historyTitle: "계산 기록",
    historyEmpty: "최근 계산 기록이 없습니다.",
    clearHistory: "기록 지우기",
    modeDeg: "DEG",
    modeRad: "RAD",
    btnCopy: "복사",
    inputPrompt: "0",

    // Quick Tools Grid
    toolSciTitle: "공학용 계산기",
    toolSciDesc: "삼각함수, 로그, 제곱근, 거듭제곱",
    toolPercentTitle: "퍼센트 계산기",
    toolPercentDesc: "할인율, 증감률, 백분율 4대 연산",
    toolUnitTitle: "단위 변환기",
    toolUnitDesc: "아파트 평수, 길이, 무게, 면적",
    toolFractionTitle: "분수 계산기",
    toolFractionDesc: "분수 사칙연산, 기약분수 자동 약분",

    // Percent Calculator Specifics
    p1Title: "전체값의 일정 비율 계산",
    p1LabelOf: "의",
    p1LabelIs: "% 는?",
    p1Result: "계산 결과",
    p1PlaceholderA: "전체값 A",
    p1PlaceholderB: "비율 B",

    p2Title: "부분값의 백분율 비율 역산",
    p2LabelOf: "은/는",
    p2LabelIs: "의 몇 %?",
    p2Result: "비율 결과",
    p2PlaceholderA: "부분값 A",
    p2PlaceholderB: "기준값 B",

    p3Title: "가격 및 수익률 증감률 계산",
    p3LabelFrom: "에서",
    p3LabelTo: "(으)로 변동 시",
    p3Result: "증감률 결과",
    p3PlaceholderA: "이전값 A",
    p3PlaceholderB: "이후값 B",

    p4Title: "쇼핑 세일 할인 및 증감 최종값",
    p4LabelFrom: "에서",
    p4LabelPct: "%",
    p4Result: "최종 결제 금액",
    p4OptDec: "할인 / 감소",
    p4OptInc: "인상 / 증가",
    p4PlaceholderA: "원래 가격 A",
    p4PlaceholderB: "할인율 B",

    // Unit Converter Specifics
    unitAreaTab: "면적 / 평수",
    unitLengthTab: "길이 / 거리",
    unitWeightTab: "무게 / 질량",
    unitInputPlaceholder: "수치 입력",
    unitResultLabel: "변환된 수치",

    // Fraction Calculator Specifics
    fSimplifiedLabel: "기약분수 결과",
    fMixedLabel: "대분수 표기",
    fDecimalLabel: "소수점 (Decimal) 환산",
    fPlaceholderNum1: "분자 1",
    fPlaceholderDen1: "분모 1",
    fPlaceholderNum2: "분자 2",
    fPlaceholderDen2: "분모 2",

    // Footer
    // Contact Page Specifics
    contactTitle: "문의하기 (Contact Us)",
    contactDesc: "서비스 건의사항, 제휴 및 버그 제보는 언제든 환영합니다.",
    contactName: "이름 또는 닉네임",
    contactEmail: "이메일 주소",
    contactSubject: "문의 유형",
    contactSubjectGeneral: "일반 문의 및 피드백",
    contactSubjectBug: "수학 연산 오류 / 버그 제보",
    contactSubjectPartnership: "광고 및 제휴 제안",
    contactSubjectEtc: "기타",
    contactMessage: "문의 내용",
    contactSubmit: "문의 발송하기",
    contactSuccess: "문의가 접수되었습니다. 빠른 시일 내에 검토하겠습니다.",

    // Unit Converter Options & Buttons
    btnSwapUnits: "단위 맞바꾸기",
    unitPyung: "평 (Pyung)",
    unitM2: "제곱미터 (㎡)",
    unitSqft: "제곱피트 (sq ft)",
    unitAcres: "에이커 (ac)",
    unitCm: "센티미터 (cm)",
    unitM: "미터 (m)",
    unitInch: "인치 (in)",
    unitFt: "피트 (ft)",
    unitKg: "킬로그램 (kg)",
    unitG: "그램 (g)",
    unitLb: "파운드 (lb)",
    unitDon: "금 1돈 (3.75g)",

    // Footer & Common Labels
    logoTitle: "모두의 계산기 홈",
    themeToggleLabel: "테마 전환",
    mobileNavLabel: "메뉴 열기",
    footerDesc: "모두의 계산기(OmniCalc)는 학생, 엔지니어, 직장인 누구나 무료로 쉽고 빠르게 사용할 수 있는 웹 기반 다기능 계산기 플랫폼입니다.",
    footerTools: "계산기 도구",
    footerLegal: "신뢰 및 정책",
    footerAbout: "서비스 소개",
    footerPrivacy: "개인정보처리방침",
    footerTerms: "이용약관",
    footerContact: "문의하기",
    footerRights: "모든 권리 보유.",
    footerAdmin: "사이트 관리",
    footerAdminLink: "운영자 통계 리더보드",

    // FAQ & Section Headers
    faqTitle: "자주 묻는 질문 (FAQ)",
    guideTitle: "원리 및 실생활 활용 가이드",
    formulaTitle: "핵심 공식"
  },

  en: {
    // Brand & Navigation
    brandName: "OmniCalc",
    brandTagline: "Fast & Free Smart Online Calculator",
    navHome: "Home",
    navScientific: "Scientific",
    navPercent: "Percent",
    navUnit: "Unit Converter",
    navFraction: "Fraction",
    navAdmin: "Admin",

    // Hero Texts
    heroTitleHome: "Smart, Fast & Free Online Calculator",
    heroDescHome: "From basic math to scientific formulas, percentages, and unit conversions right in your browser.",
    heroTitleSci: "Smart Scientific Calculator",
    heroDescSci: "Compute trigonometry, powers, logarithms, and roots with a sleek, responsive keypad.",
    heroTitlePercent: "Percent & Discount Calculator",
    heroDescPercent: "Calculate shopping discounts, profit rates, and percentage changes in real-time.",
    heroTitleUnit: "Smart Universal Unit Converter",
    heroDescUnit: "Convert area (sq ft ↔ m²), length, weight, and temperature accurately.",
    heroTitleFraction: "Fraction Calculator & Simplifier",
    heroDescFraction: "Add, subtract, multiply, divide fractions with automatic greatest common divisor reduction.",

    // Calculator Common
    copySuccess: "Result copied to clipboard.",
    historyTitle: "Calculation History",
    historyEmpty: "No recent calculations.",
    clearHistory: "Clear History",
    modeDeg: "DEG",
    modeRad: "RAD",
    btnCopy: "Copy",
    inputPrompt: "0",

    // Quick Tools Grid
    toolSciTitle: "Scientific Calculator",
    toolSciDesc: "Trigonometry, Logarithms, Roots, Exponents",
    toolPercentTitle: "Percentage Calculator",
    toolPercentDesc: "Discounts, Change Rate, Proportions",
    toolUnitTitle: "Unit Converter",
    toolUnitDesc: "Area (Sq Ft/m²), Length, Weight, Temp",
    toolFractionTitle: "Fraction Calculator",
    toolFractionDesc: "Arithmetic & Auto Simplification",

    // Percent Calculator Specifics
    p1Title: "Calculate Percentage of Value",
    p1LabelOf: "of",
    p1LabelIs: "% is?",
    p1Result: "Result",
    p1PlaceholderA: "Total Value A",
    p1PlaceholderB: "Percentage B",

    p2Title: "What % is Value A of Value B?",
    p2LabelOf: "is what % of",
    p2LabelIs: "?",
    p2Result: "Rate Result",
    p2PlaceholderA: "Part Value A",
    p2PlaceholderB: "Base Value B",

    p3Title: "Percentage Increase / Decrease Rate",
    p3LabelFrom: "from",
    p3LabelTo: "to",
    p3Result: "Rate Change",
    p3PlaceholderA: "Initial A",
    p3PlaceholderB: "Final B",

    p4Title: "Discount & Final Value Calculation",
    p4LabelFrom: "with",
    p4LabelPct: "%",
    p4Result: "Final Amount",
    p4OptDec: "Discount / Decrease",
    p4OptInc: "Markup / Increase",
    p4PlaceholderA: "Original Price A",
    p4PlaceholderB: "Rate B",

    // Unit Converter Specifics
    unitAreaTab: "Area",
    unitLengthTab: "Length",
    unitWeightTab: "Weight",
    unitInputPlaceholder: "Enter Value",
    unitResultLabel: "Converted Value",

    // Fraction Calculator Specifics
    fSimplifiedLabel: "Simplified Fraction",
    fMixedLabel: "Mixed Fraction",
    fDecimalLabel: "Decimal Value",
    fPlaceholderNum1: "Num 1",
    fPlaceholderDen1: "Den 1",
    fPlaceholderNum2: "Num 2",
    fPlaceholderDen2: "Den 2",

    // Contact Page Specifics
    contactTitle: "Contact Us",
    contactDesc: "Feel free to reach out with feedback, bug reports, or partnership proposals.",
    contactName: "Name or Nickname",
    contactEmail: "Email Address",
    contactSubject: "Topic",
    contactSubjectGeneral: "General Inquiry & Feedback",
    contactSubjectBug: "Calculation Error / Bug Report",
    contactSubjectPartnership: "Advertising & Partnership",
    contactSubjectEtc: "Other",
    contactMessage: "Your Message",
    contactSubmit: "Send Message",
    contactSuccess: "Thank you! Your message has been sent successfully.",

    // Unit Converter Options & Buttons
    btnSwapUnits: "Swap Units",
    unitPyung: "Pyung (坪)",
    unitM2: "Square Meter (㎡)",
    unitSqft: "Square Feet (sq ft)",
    unitAcres: "Acres (ac)",
    unitCm: "Centimeter (cm)",
    unitM: "Meter (m)",
    unitInch: "Inch (in)",
    unitFt: "Foot (ft)",
    unitKg: "Kilogram (kg)",
    unitG: "Gram (g)",
    unitLb: "Pound (lb)",
    unitDon: "Korean Don (3.75g)",

    // Footer & Common Labels
    logoTitle: "OmniCalc Home",
    themeToggleLabel: "Toggle Theme",
    mobileNavLabel: "Open Menu",
    footerDesc: "OmniCalc is a modern, high-speed multi-utility calculator built for students, professionals, and everyday users worldwide.",
    footerTools: "Calculators",
    footerLegal: "Trust & Legal",
    footerAbout: "About Us",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerContact: "Contact Us",
    footerRights: "All rights reserved.",
    footerAdmin: "Site Admin",
    footerAdminLink: "Admin Dashboard",

    // FAQ & Section Headers
    faqTitle: "Frequently Asked Questions (FAQ)",
    guideTitle: "Practical Guide & Formulas",
    formulaTitle: "Key Formula"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = this.getInitialLanguage();
    document.documentElement.lang = this.currentLang;
    this.init();
  }

  getInitialLanguage() {
    const path = window.location.pathname || '';
    if (path.includes('/en/') || path.endsWith('/en')) {
      return 'en';
    }
    const saved = localStorage.getItem('omni_lang');
    if (saved && (saved === 'ko' || saved === 'en')) {
      return saved;
    }
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return browserLang.startsWith('ko') ? 'ko' : 'en';
  }

  setLanguage(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    this.currentLang = lang;
    localStorage.setItem('omni_lang', lang);
    document.documentElement.lang = lang;
    this.applyTranslations();

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  getText(key) {
    const dict = I18N_DICTIONARY[this.currentLang] || I18N_DICTIONARY.ko;
    return dict[key] || key;
  }

  applyTranslations() {
    document.documentElement.lang = this.currentLang;

    // Apply all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.getText(key);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else if (el.tagName === 'OPTION') {
          el.textContent = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Apply titles & aria-labels with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const text = this.getText(key);
      if (text) el.setAttribute('title', text);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const text = this.getText(key);
      if (text) el.setAttribute('aria-label', text);
    });

    // Update Language Toggle Button UI with Clean Globe SVG
    const langSelect = document.getElementById('langToggleBtn');
    if (langSelect) {
      const label = this.currentLang === 'ko' ? '한국어' : 'English';
      langSelect.innerHTML = `${GLOBE_SVG} <span>${label}</span>`;
    }
  }

  toggle() {
    const nextLang = this.currentLang === 'ko' ? 'en' : 'ko';
    localStorage.setItem('omni_lang', nextLang);

    // If served over HTTP/HTTPS, route between /en/ and root
    if (window.location.protocol.startsWith('http')) {
      const path = window.location.pathname;
      let filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
      if (filename === '' || filename === 'en') filename = 'index.html';

      if (nextLang === 'en' && !path.includes('/en/')) {
        window.location.href = (filename === 'index.html') ? '/en/' : `/en/${filename}`;
        return;
      } else if (nextLang === 'ko' && path.includes('/en/')) {
        window.location.href = (filename === 'index.html') ? '/' : `/${filename}`;
        return;
      }
    }

    this.setLanguage(nextLang);
  }

  init() {
    document.documentElement.lang = this.currentLang;
    
    const run = () => {
      this.applyTranslations();
      const toggleBtn = document.getElementById('langToggleBtn');
      if (toggleBtn && !toggleBtn._hasI18nBound) {
        toggleBtn._hasI18nBound = true;
        toggleBtn.addEventListener('click', () => this.toggle());
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }
}

const i18n = new I18nManager();
