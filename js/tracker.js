/**
 * Project OmniCalc - Analytics & Event Tracker Module
 * Collects visitor metrics, pageviews, and calculator usage for the Admin Leaderboard
 */

class OmniTracker {
  constructor() {
    this.storageKey = 'omni_analytics_data_v1';
    this.sessionKey = 'omni_session_active';
    this.data = this.loadData();
    this.init();
  }

  loadData() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error parsing analytics data, reinitializing', e);
      }
    }

    // Default Seed Data so Admin dashboard displays realistic initial benchmarks
    return {
      totalVisitors: 1248,
      totalPageviews: 3410,
      todayVisitors: 142,
      todayPageviews: 418,
      calculatorStats: {
        scientific: 124,
        percent: 168,
        unit: 78,
        fraction: 48
      },
      countryStats: {
        KR: 65,
        US: 22,
        GB: 5,
        OTHER: 8
      },
      recentLogs: [
        { time: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString(), event: '방문 유입 (구글 검색: 퍼센트 계산기)', country: 'KR' },
        { time: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(), event: '공학용 수식 계산 완료 [sin(45) * 12]', country: 'US' },
        { time: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(), event: '단위 변환 [84㎡ → 25.4평]', country: 'KR' },
        { time: new Date(Date.now() - 1000 * 60 * 20).toLocaleTimeString(), event: '분수 덧셈 [1/3 + 2/5 = 11/15]', country: 'US' }
      ]
    };
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  detectCountry() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Seoul') || tz.includes('Korea')) return 'KR';
      if (tz.includes('America') || tz.includes('US') || tz.includes('New_York') || tz.includes('Los_Angeles')) return 'US';
      if (tz.includes('London') || tz.includes('Europe')) return 'GB';
      return 'OTHER';
    } catch (e) {
      return 'KR';
    }
  }

  trackPageView(pageName) {
    this.data.totalPageviews += 1;
    this.data.todayPageviews += 1;

    // Track specific calculator type
    if (pageName && this.data.calculatorStats[pageName] !== undefined) {
      this.data.calculatorStats[pageName] += 1;
    }

    // Check Unique Visitor (UV) via sessionStorage
    if (!sessionStorage.getItem(this.sessionKey)) {
      sessionStorage.setItem(this.sessionKey, 'true');
      this.data.totalVisitors += 1;
      this.data.todayVisitors += 1;

      const country = this.detectCountry();
      if (this.data.countryStats[country] !== undefined) {
        this.data.countryStats[country] += 1;
      } else {
        this.data.countryStats.OTHER += 1;
      }

      this.logEvent(`신규 방문자 유입 (${pageName || '홈'})`, country);
    }

    this.saveData();
  }

  trackCalculation(calcType, formulaSnippet) {
    const country = this.detectCountry();
    const eventText = `${calcType} 계산 실행: ${formulaSnippet}`;
    this.logEvent(eventText, country);
  }

  logEvent(eventText, country = 'KR') {
    const logItem = {
      time: new Date().toLocaleTimeString(),
      event: eventText,
      country: country
    };
    this.data.recentLogs.unshift(logItem);
    if (this.data.recentLogs.length > 20) {
      this.data.recentLogs.pop();
    }
    this.saveData();
  }

  getAnalyticsSummary() {
    return this.data;
  }

  init() {
    // Automatically track current page on load
    document.addEventListener('DOMContentLoaded', () => {
      const path = window.location.pathname.toLowerCase();
      let pageType = 'home';
      if (path.includes('scientific')) pageType = 'scientific';
      else if (path.includes('percent')) pageType = 'percent';
      else if (path.includes('unit')) pageType = 'unit';
      else if (path.includes('fraction')) pageType = 'fraction';
      else if (path.includes('admin')) pageType = null; // Do not count admin as tool

      if (pageType) {
        this.trackPageView(pageType);
      }
    });
  }
}

const omniTracker = new OmniTracker();
