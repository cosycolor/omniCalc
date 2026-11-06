/**
 * Project OmniCalc - Date, D-Day & Exact Age Calculator Module
 * 1) Days between two dates (with optional start-day inclusion)
 * 2) Add / Subtract N days from a base date
 * 3) Exact International Age (만 나이) & Days Lived
 */

class DateCalculator {
  constructor() {
    this.initDefaults();
    this.init();
  }

  formatDateYMD(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getDayOfWeekName(dateObj) {
    const isEn = (document.documentElement.lang || '').startsWith('en');
    const koDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return isEn ? enDays[dateObj.getDay()] : koDays[dateObj.getDay()];
  }

  initDefaults() {
    const today = new Date();
    const future = new Date(today.getTime() + 100 * 86400000);
    const startEl = document.getElementById('d_start');
    const endEl = document.getElementById('d_end');
    const baseEl = document.getElementById('d_base');
    const birthEl = document.getElementById('d_birth');

    if (startEl && !startEl.value) startEl.value = this.formatDateYMD(today);
    if (endEl && !endEl.value) endEl.value = this.formatDateYMD(future);
    if (baseEl && !baseEl.value) baseEl.value = this.formatDateYMD(today);
    if (birthEl && !birthEl.value) birthEl.value = '1995-05-15';
  }

  parseUTC(ymd) {
    if (!ymd) return null;
    const parts = ymd.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  }

  calcDiff() {
    const isEn = (document.documentElement.lang || '').startsWith('en');
    const startUTC = this.parseUTC(document.getElementById('d_start')?.value);
    const endUTC = this.parseUTC(document.getElementById('d_end')?.value);
    const includeStart = document.getElementById('d_include_start')?.checked;

    const resDaysEl = document.getElementById('d_res_days');
    const resWeeksEl = document.getElementById('d_res_weeks');

    if (!startUTC || !endUTC) {
      if (resDaysEl) resDaysEl.textContent = '-';
      if (resWeeksEl) resWeeksEl.textContent = '-';
      return;
    }

    let diffDays = Math.round((endUTC.getTime() - startUTC.getTime()) / 86400000);
    const absDays = Math.abs(diffDays) + (includeStart ? 1 : 0);
    const weeks = Math.floor(absDays / 7);
    const remDays = absDays % 7;

    if (resDaysEl) {
      resDaysEl.textContent = isEn
        ? `${absDays.toLocaleString()} days`
        : `${absDays.toLocaleString()}일`;
    }
    if (resWeeksEl) {
      resWeeksEl.textContent = isEn
        ? `${weeks} wks ${remDays} days`
        : `${weeks}주 ${remDays}일`;
    }
  }

  calcAddSub() {
    const baseStr = document.getElementById('d_base')?.value;
    const offset = parseInt(document.getElementById('d_offset')?.value, 10);
    const op = document.getElementById('d_op')?.value || '+';
    const resTargetEl = document.getElementById('d_res_target');

    const baseUTC = this.parseUTC(baseStr);
    if (!baseUTC || isNaN(offset)) {
      if (resTargetEl) resTargetEl.textContent = '-';
      return;
    }

    const delta = (op === '-') ? -offset : offset;
    const targetUTC = new Date(baseUTC.getTime() + delta * 86400000);
    const localTarget = new Date(targetUTC.getUTCFullYear(), targetUTC.getUTCMonth(), targetUTC.getUTCDate());
    const ymd = this.formatDateYMD(localTarget);
    const dow = this.getDayOfWeekName(localTarget);

    if (resTargetEl) {
      resTargetEl.textContent = `${ymd} (${dow})`;
    }
  }

  calcAge() {
    const isEn = (document.documentElement.lang || '').startsWith('en');
    const birthStr = document.getElementById('d_birth')?.value;
    const resAgeEl = document.getElementById('d_res_age');
    const resLivedEl = document.getElementById('d_res_lived');

    if (!birthStr) {
      if (resAgeEl) resAgeEl.textContent = '-';
      if (resLivedEl) resLivedEl.textContent = '-';
      return;
    }

    const parts = birthStr.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return;

    const today = new Date();
    const bYear = parts[0], bMonth = parts[1], bDay = parts[2];
    const tYear = today.getFullYear(), tMonth = today.getMonth() + 1, tDay = today.getDate();

    let age = tYear - bYear;
    if (tMonth < bMonth || (tMonth === bMonth && tDay < bDay)) {
      age -= 1;
    }

    const birthUTC = Date.UTC(bYear, bMonth - 1, bDay);
    const todayUTC = Date.UTC(tYear, tMonth - 1, tDay);
    const livedDays = Math.max(0, Math.round((todayUTC - birthUTC) / 86400000));

    // Next Birthday D-Day
    let nextBdayYear = tYear;
    if (tMonth > bMonth || (tMonth === bMonth && tDay > bDay)) {
      nextBdayYear += 1;
    }
    const nextBdayUTC = Date.UTC(nextBdayYear, bMonth - 1, bDay);
    const daysToBday = Math.max(0, Math.round((nextBdayUTC - todayUTC) / 86400000));

    if (resAgeEl) {
      resAgeEl.textContent = isEn ? `${Math.max(0, age)} yrs old` : `만 ${Math.max(0, age)}세`;
    }
    if (resLivedEl) {
      const bdayBadge = daysToBday === 0
        ? (isEn ? '🎉 Today is your birthday!' : '🎉 오늘이 생일입니다!')
        : (isEn ? `Next birthday: D-${daysToBday}` : `다음 생일: D-${daysToBday}일`);
      resLivedEl.innerHTML = isEn
        ? `${livedDays.toLocaleString()} days lived <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">${bdayBadge}</div>`
        : `태어난 지 ${livedDays.toLocaleString()}일째 <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">${bdayBadge}</div>`;
    }
  }

  calculateAll() {
    this.calcDiff();
    this.calcAddSub();
    this.calcAge();
  }

  init() {
    ['d_start', 'd_end', 'd_include_start', 'd_base', 'd_offset', 'd_op', 'd_birth'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.calculateAll());
        el.addEventListener('change', () => this.calculateAll());
      }
    });
    window.addEventListener('languageChanged', () => this.calculateAll());
    this.calculateAll();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('d_start')) {
    new DateCalculator();
  }
});

