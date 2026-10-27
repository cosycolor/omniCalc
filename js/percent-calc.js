/**
 * Project OmniCalc - Percent & Discount Calculator Module
 * Calculates 4 key percentage variations in real-time
 */

class PercentCalculator {
  constructor() {
    this.init();
  }

  calcType1() {
    // What is B% of A?
    const a = parseFloat(document.getElementById('p1_a')?.value);
    const b = parseFloat(document.getElementById('p1_b')?.value);
    const resEl = document.getElementById('p1_res');
    if (!isNaN(a) && !isNaN(b)) {
      const res = (a * (b / 100));
      resEl.textContent = this.formatNumber(res);
      this.track('퍼센트 1: 비율 계산');
    } else {
      resEl.textContent = '0';
    }
  }

  calcType2() {
    // A is what % of B?
    const a = parseFloat(document.getElementById('p2_a')?.value);
    const b = parseFloat(document.getElementById('p2_b')?.value);
    const resEl = document.getElementById('p2_res');
    if (!isNaN(a) && !isNaN(b) && b !== 0) {
      const res = (a / b) * 100;
      resEl.textContent = this.formatNumber(res) + '%';
      this.track('퍼센트 2: 비율 역산');
    } else {
      resEl.textContent = '0%';
    }
  }

  calcType3() {
    // Percentage Change from A to B
    const a = parseFloat(document.getElementById('p3_a')?.value);
    const b = parseFloat(document.getElementById('p3_b')?.value);
    const resEl = document.getElementById('p3_res');
    if (!isNaN(a) && !isNaN(b) && a !== 0) {
      const diff = b - a;
      const rate = (diff / a) * 100;
      const sign = rate > 0 ? '+' : '';
      resEl.textContent = `${sign}${this.formatNumber(rate)}%`;
      resEl.style.color = rate > 0 ? 'var(--accent-rose)' : rate < 0 ? 'var(--accent-blue)' : 'var(--text-primary)';
      this.track('퍼센트 3: 증감률');
    } else {
      resEl.textContent = '0%';
      resEl.style.color = 'var(--accent-primary)';
    }
  }

  calcType4() {
    // Value after A is increased/decreased by B%
    const a = parseFloat(document.getElementById('p4_a')?.value);
    const b = parseFloat(document.getElementById('p4_b')?.value);
    const type = document.getElementById('p4_type')?.value; // 'inc' or 'dec'
    const resEl = document.getElementById('p4_res');
    if (!isNaN(a) && !isNaN(b)) {
      const multiplier = type === 'inc' ? (1 + b / 100) : (1 - b / 100);
      const res = a * multiplier;
      resEl.textContent = this.formatNumber(res);
      this.track('퍼센트 4: 증감 후 최종값');
    } else {
      resEl.textContent = '0';
    }
  }

  formatNumber(val) {
    if (Number.isInteger(val)) return val.toLocaleString();
    return parseFloat(val.toFixed(4)).toLocaleString();
  }

  track(desc) {
    if (window.omniTracker) {
      window.omniTracker.trackCalculation('퍼센트', desc);
    }
  }

  init() {
    // Bind input change listeners for instant reactivity
    ['p1_a', 'p1_b'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calcType1());
    });

    ['p2_a', 'p2_b'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calcType2());
    });

    ['p3_a', 'p3_b'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calcType3());
    });

    ['p4_a', 'p4_b'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calcType4());
    });

    document.getElementById('p4_type')?.addEventListener('change', () => this.calcType4());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('p1_a')) {
    new PercentCalculator();
  }
});
