/**
 * Project OmniCalc - Admin Traffic & Revenue Leaderboard Dashboard Controller
 * Secret portal for site owner to track analytics, ranking, and AdSense revenue
 */

class AdminPortal {
  constructor() {
    this.authKey = 'omni_admin_authorized';
    this.masterPass = localStorage.getItem('omni_admin_password') || 'admin1234';
    this.init();
  }

  isAuthorized() {
    return sessionStorage.getItem(this.authKey) === 'true';
  }

  authorize(pass) {
    if (pass === this.masterPass) {
      sessionStorage.setItem(this.authKey, 'true');
      this.renderView();
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(this.authKey);
    this.renderView();
  }

  renderView() {
    const authCard = document.getElementById('adminAuthSection');
    const dashSection = document.getElementById('adminDashboardSection');

    if (!authCard || !dashSection) return;

    if (this.isAuthorized()) {
      authCard.style.display = 'none';
      dashSection.style.display = 'block';
      this.updateDashboardData();
    } else {
      authCard.style.display = 'block';
      dashSection.style.display = 'none';
    }
  }

  updateDashboardData() {
    if (!window.omniTracker) return;
    const data = window.omniTracker.getAnalyticsSummary();

    // 1. KPI Cards
    const elTodayUV = document.getElementById('kpiTodayUV');
    const elTotalUV = document.getElementById('kpiTotalUV');
    const elTodayPV = document.getElementById('kpiTodayPV');
    const elTotalPV = document.getElementById('kpiTotalPV');
    const elTodayRev = document.getElementById('kpiTodayRev');
    const elMonthRev = document.getElementById('kpiMonthRev');

    if (elTodayUV) elTodayUV.textContent = data.todayVisitors.toLocaleString();
    if (elTotalUV) elTotalUV.textContent = data.totalVisitors.toLocaleString();
    if (elTodayPV) elTodayPV.textContent = data.todayPageviews.toLocaleString();
    if (elTotalPV) elTotalPV.textContent = data.totalPageviews.toLocaleString();

    // AdSense Estimated Earnings (Average Blended RPM = $2.40 USD)
    const todayEstUSD = (data.todayPageviews / 1000) * 2.40;
    const monthEstUSD = todayEstUSD * 30;
    const exchangeRate = 1350; // KRW per USD

    if (elTodayRev) {
      elTodayRev.textContent = `$${todayEstUSD.toFixed(2)}`;
      elTodayRev.title = `약 ${(todayEstUSD * exchangeRate).toLocaleString()}원`;
    }
    if (elMonthRev) {
      elMonthRev.textContent = `$${monthEstUSD.toFixed(2)}`;
      elMonthRev.title = `약 ${(monthEstUSD * exchangeRate).toLocaleString()}원`;
    }

    // 2. Leaderboard: Rank Calculators by PV
    const calcNames = {
      percent: { name: '퍼센트 및 할인율 계산기' },
      scientific: { name: '스마트 공학용 계산기' },
      unit: { name: '스마트 단위 변환기' },
      fraction: { name: '분수 사칙연산 계산기' }
    };

    const calcEntries = Object.entries(data.calculatorStats).map(([key, count]) => ({
      key,
      name: calcNames[key]?.name || key,
      count
    }));

    calcEntries.sort((a, b) => b.count - a.count);

    const totalToolPV = calcEntries.reduce((sum, item) => sum + item.count, 0) || 1;
    const lbContainer = document.getElementById('leaderboardList');

    if (lbContainer) {
      lbContainer.innerHTML = calcEntries.map((item, index) => {
        const pct = ((item.count / totalToolPV) * 100).toFixed(1);
        const rank = index + 1;
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

        return `
          <div class="leaderboard-item">
            <div class="lb-meta">
              <span class="lb-rank-name">
                <span class="lb-badge ${rankClass}">${rank}</span>
                <span>${item.name}</span>
              </span>
              <span class="lb-stats">${item.count.toLocaleString()} PV (${pct}%)</span>
            </div>
            <div class="lb-progress-bar-bg">
              <div class="lb-progress-bar-fill" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 3. Country Distribution
    const countryContainer = document.getElementById('countryList');
    if (countryContainer) {
      const countryNames = {
        KR: { name: '대한민국', code: 'KR' },
        US: { name: '미국 (고단가 RPM)', code: 'US' },
        GB: { name: '영국', code: 'GB' },
        OTHER: { name: '기타 국가', code: 'ETC' }
      };

      countryContainer.innerHTML = Object.entries(data.countryStats).map(([code, count]) => {
        const info = countryNames[code] || { name: code, code };
        return `
          <div class="country-item">
            <div class="country-info">
              <span style="display:inline-block; padding: 2px 6px; font-size:0.75rem; font-weight:700; background:var(--bg-tertiary); border-radius:4px; font-family:var(--font-mono);">${info.code}</span>
              <span>${info.name}</span>
            </div>
            <span style="font-family: var(--font-mono); font-weight: 700;">${count}%</span>
          </div>
        `;
      }).join('');
    }

    // 4. Live Activity Logs
    const logContainer = document.getElementById('recentLogsList');
    if (logContainer) {
      logContainer.innerHTML = data.recentLogs.slice(0, 8).map(log => `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.85rem;">
          <span style="color: var(--text-primary);">${log.event}</span>
          <span style="color: var(--text-muted); font-family: var(--font-mono);">${log.time}</span>
        </div>
      `).join('');
    }
  }

  setupRevenueSimulator() {
    const sliderPV = document.getElementById('simSliderPV');
    const sliderRPM = document.getElementById('simSliderRPM');
    const dispPV = document.getElementById('simDispPV');
    const dispRPM = document.getElementById('simDispRPM');
    const resDaily = document.getElementById('simResDaily');
    const resMonthly = document.getElementById('simResMonthly');

    if (!sliderPV || !sliderRPM) return;

    const updateSim = () => {
      const pv = parseInt(sliderPV.value);
      const rpm = parseFloat(sliderRPM.value);

      if (dispPV) dispPV.textContent = `${pv.toLocaleString()} PV/일`;
      if (dispRPM) dispRPM.textContent = `$${rpm.toFixed(2)}`;

      const dailyUSD = (pv / 1000) * rpm;
      const monthlyUSD = dailyUSD * 30;
      const rate = 1350;

      if (resDaily) {
        resDaily.textContent = `$${dailyUSD.toFixed(1)} (~${Math.round(dailyUSD * rate).toLocaleString()}원)`;
      }
      if (resMonthly) {
        resMonthly.textContent = `$${monthlyUSD.toFixed(0)} (~${Math.round(monthlyUSD * rate).toLocaleString()}원)`;
      }
    };

    sliderPV.addEventListener('input', updateSim);
    sliderRPM.addEventListener('input', updateSim);
    updateSim();
  }

  simulateTrafficBurst() {
    if (!window.omniTracker) return;
    window.omniTracker.data.todayPageviews += 100;
    window.omniTracker.data.totalPageviews += 100;
    window.omniTracker.data.calculatorStats.percent += 45;
    window.omniTracker.data.calculatorStats.scientific += 30;
    window.omniTracker.data.calculatorStats.unit += 15;
    window.omniTracker.data.calculatorStats.fraction += 10;
    window.omniTracker.logEvent('모의 검색 트래픽 유입 (+100 PV)', 'KR');
    this.updateDashboardData();

    if (window.showToast) {
      window.showToast('트래픽 시뮬레이션 반영 완료 (+100 PV)');
    }
  }

  init() {
    const authBtn = document.getElementById('btnAdminLogin');
    const passInput = document.getElementById('adminPasswordInput');

    if (authBtn && passInput) {
      const doLogin = () => {
        const ok = this.authorize(passInput.value.trim());
        if (!ok) {
          passInput.style.borderColor = 'var(--accent-rose)';
          passInput.value = '';
          alert('비밀번호가 올바르지 않습니다. (기본 비밀번호: admin1234)');
        }
      };

      authBtn.addEventListener('click', doLogin);
      passInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doLogin();
      });
    }

    document.getElementById('btnAdminLogout')?.addEventListener('click', () => this.logout());
    document.getElementById('btnSimulateTraffic')?.addEventListener('click', () => this.simulateTrafficBurst());

    this.renderView();
    this.setupRevenueSimulator();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('adminAuthSection')) {
    new AdminPortal();
  }
});
