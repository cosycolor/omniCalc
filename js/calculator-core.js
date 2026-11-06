/**
 * Project OmniCalc - Desmos-Grade Scientific Calculator Engine
 * Handles expression parsing, trigonometry, exponents, roots, history & keyboard events
 */

class ScientificCalculator {
  constructor() {
    this.expression = '';
    this.lastResult = '';
    this.angleMode = 'DEG'; // 'DEG' or 'RAD'
    this.history = this.loadHistory();
    this.historyOpen = false;

    // DOM Elements
    this.elExpression = document.getElementById('calcExpression');
    this.elResult = document.getElementById('calcResult');
    this.elEqualsSign = document.getElementById('calcEqualsSign');
    this.elHistoryDrawer = document.getElementById('calcHistoryDrawer');
    this.elHistoryList = document.getElementById('calcHistoryList');
    this.elDegBtn = document.getElementById('btnModeDeg');
    this.elRadBtn = document.getElementById('btnModeRad');

    this.init();
  }

  loadHistory() {
    try {
      const raw = localStorage.getItem('omni_calc_history');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  saveHistory() {
    localStorage.setItem('omni_calc_history', JSON.stringify(this.history));
  }

  setAngleMode(mode) {
    this.angleMode = mode;
    if (this.elDegBtn && this.elRadBtn) {
      if (mode === 'DEG') {
        this.elDegBtn.classList.add('active');
        this.elRadBtn.classList.remove('active');
      } else {
        this.elRadBtn.classList.add('active');
        this.elDegBtn.classList.remove('active');
      }
    }
    this.updateLivePreview();
  }

  inputKey(key) {
    if (key === 'clear') {
      this.expression = '';
      this.lastResult = '';
      this.updateDisplay();
      return;
    }

    if (key === 'backspace') {
      this.expression = this.expression.slice(0, -1);
      this.updateDisplay();
      this.updateLivePreview();
      return;
    }

    if (key === 'equal') {
      this.calculateFinal();
      return;
    }

    if (key === 'ans') {
      if (this.lastResult !== '') {
        this.expression += this.lastResult;
      }
      this.updateDisplay();
      this.updateLivePreview();
      return;
    }

    // Special functions formatting
    if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt'].includes(key)) {
      this.expression += key + '(';
    } else if (key === 'pi') {
      this.expression += 'π';
    } else if (key === 'e') {
      this.expression += 'e';
    } else if (key === 'square') {
      this.expression += '^2';
    } else if (key === 'pow') {
      this.expression += '^';
    } else {
      this.expression += key;
    }

    this.updateDisplay();
    this.updateLivePreview();
  }

  updateDisplay() {
    if (this.elExpression) {
      this.elExpression.textContent = this.expression || '0';
      this.elExpression.scrollLeft = this.elExpression.scrollWidth;
    }
  }

  /**
   * Evaluates the expression with high mathematical precision
   * Supports nested parentheses, exponents on expressions, implicit multiplication, and exact trig values
   */
  evaluate(expr) {
    if (!expr || expr.trim() === '') return '';

    let parsed = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Implicit multiplication: e.g. 2π -> 2*π, 2(3) -> 2*(3), (2)(3) -> (2)*(3), 2sin(30) -> 2*sin(30)
    parsed = parsed
      .replace(/(\d|\))(?=\(|π|\be\b|sin|cos|tan|asin|acos|atan|log|ln|sqrt|√)/g, '$1*')
      .replace(/(π|\be\b)(?=\d|\(|π|\be\b|sin|cos|tan|asin|acos|atan|log|ln|sqrt|√)/g, '$1*');

    // Constants
    parsed = parsed
      .replace(/π/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');

    // Percent: 50% -> (50 * 0.01)
    parsed = parsed.replace(/(\d+(?:\.\d+)?)%/g, '($1*0.01)');

    // Map functions to precision-safe helpers
    parsed = parsed
      .replace(/\basin\(/g, '__asin(')
      .replace(/\bacos\(/g, '__acos(')
      .replace(/\batan\(/g, '__atan(')
      .replace(/\bsin\(/g, '__sin(')
      .replace(/\bcos\(/g, '__cos(')
      .replace(/\btan\(/g, '__tan(')
      .replace(/\blog\(/g, '__log(')
      .replace(/\bln\(/g, '__ln(')
      .replace(/\bsqrt\(/g, '__sqrt(')
      .replace(/√\(/g, '__sqrt(');

    // Exponents: convert ^ to JS ** operator
    parsed = parsed.replace(/\^/g, '**');

    // Whitelist check
    if (!/^[0-9+\-*/().,_a-zA-Z\s]+$/.test(parsed)) {
      return null;
    }

    const isDeg = this.angleMode === 'DEG';
    const __sin = (x) => {
      if (isDeg) {
        const mod = ((x % 360) + 360) % 360;
        if (mod === 0 || mod === 180) return 0;
        if (mod === 30 || mod === 150) return 0.5;
        if (mod === 210 || mod === 330) return -0.5;
        if (mod === 90) return 1;
        if (mod === 270) return -1;
        return Math.sin(x * Math.PI / 180);
      }
      return Math.sin(x);
    };
    const __cos = (x) => {
      if (isDeg) {
        const mod = ((x % 360) + 360) % 360;
        if (mod === 90 || mod === 270) return 0;
        if (mod === 60 || mod === 300) return 0.5;
        if (mod === 120 || mod === 240) return -0.5;
        if (mod === 0) return 1;
        if (mod === 180) return -1;
        return Math.cos(x * Math.PI / 180);
      }
      return Math.cos(x);
    };
    const __tan = (x) => {
      if (isDeg) {
        const mod = ((x % 180) + 180) % 180;
        if (mod === 90) return NaN; // Undefined asymptote
        if (mod === 0) return 0;
        if (mod === 45) return 1;
        if (mod === 135) return -1;
        return Math.tan(x * Math.PI / 180);
      }
      return Math.tan(x);
    };
    const __asin = (x) => isDeg ? (Math.asin(x) * 180 / Math.PI) : Math.asin(x);
    const __acos = (x) => isDeg ? (Math.acos(x) * 180 / Math.PI) : Math.acos(x);
    const __atan = (x) => isDeg ? (Math.atan(x) * 180 / Math.PI) : Math.atan(x);
    const __log = (x) => (x <= 0 ? NaN : Math.log10(x));
    const __ln = (x) => (x <= 0 ? NaN : Math.log(x));
    const __sqrt = (x) => (x < 0 ? NaN : Math.sqrt(x));

    try {
      const fn = new Function(
        '__sin', '__cos', '__tan', '__asin', '__acos', '__atan', '__log', '__ln', '__sqrt',
        `"use strict"; return (${parsed});`
      );
      const res = fn(__sin, __cos, __tan, __asin, __acos, __atan, __log, __ln, __sqrt);
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        if (Math.abs(res) < 1e-14) return '0';
        return parseFloat(res.toPrecision(12)).toString();
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  updateLivePreview() {
    if (!this.elResult) return;
    const preview = this.evaluate(this.expression);
    if (preview !== null && preview !== '') {
      this.elResult.textContent = preview;
      if (this.elEqualsSign) this.elEqualsSign.style.opacity = '0.5';
    } else {
      if (this.expression === '') {
        this.elResult.textContent = '0';
        if (this.elEqualsSign) this.elEqualsSign.style.opacity = '0';
      }
    }
  }

  calculateFinal() {
    if (!this.expression) return;
    const finalRes = this.evaluate(this.expression);
    if (finalRes !== null) {
      // Record history
      this.history.unshift({
        expression: this.expression,
        result: finalRes,
        timestamp: new Date().toLocaleTimeString()
      });
      if (this.history.length > 30) this.history.pop();
      this.saveHistory();
      this.renderHistory();

      // Track analytics calculation event
      if (window.omniTracker) {
        window.omniTracker.trackCalculation('공학용', `${this.expression} = ${finalRes}`);
      }

      this.lastResult = finalRes;
      this.expression = finalRes;
      this.updateDisplay();
      if (this.elResult) this.elResult.textContent = finalRes;
      if (this.elEqualsSign) this.elEqualsSign.style.opacity = '1';
    } else {
      if (this.elResult) this.elResult.textContent = '수식 오류';
    }
  }

  copyResult() {
    const textToCopy = this.elResult ? this.elResult.textContent : this.expression;
    if (textToCopy && textToCopy !== '0' && textToCopy !== '수식 오류') {
      navigator.clipboard.writeText(textToCopy).then(() => {
        if (window.showToast) {
          const msg = window.i18n ? window.i18n.getText('copySuccess') : '복사되었습니다!';
          window.showToast(msg);
        }
      });
    }
  }

  toggleHistory() {
    this.historyOpen = !this.historyOpen;
    if (this.elHistoryDrawer) {
      this.elHistoryDrawer.classList.toggle('open', this.historyOpen);
    }
  }

  renderHistory() {
    if (!this.elHistoryList) return;
    if (this.history.length === 0) {
      this.elHistoryList.innerHTML = `<div class="history-empty" data-i18n="historyEmpty">최근 계산 기록이 없습니다.</div>`;
      return;
    }

    this.elHistoryList.innerHTML = this.history.map(item => `
      <div class="history-item" onclick="sciCalc.insertFromHistory('${item.result}')">
        <div class="history-exp">${item.expression} =</div>
        <div class="history-res">${item.result}</div>
      </div>
    `).join('');
  }

  insertFromHistory(val) {
    this.expression += val;
    this.updateDisplay();
    this.updateLivePreview();
    this.toggleHistory();
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.renderHistory();
  }

  bindKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in standard text inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key;

      if ((key >= '0' && key <= '9') || key === '.') {
        this.inputKey(key);
      } else if (key === '+' || key === '-') {
        this.inputKey(key);
      } else if (key === '*') {
        this.inputKey('×');
      } else if (key === '/') {
        e.preventDefault();
        this.inputKey('÷');
      } else if (key === '(' || key === ')') {
        this.inputKey(key);
      } else if (key === '^') {
        this.inputKey('pow');
      } else if (key === '%') {
        this.inputKey('%');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        this.inputKey('equal');
      } else if (key === 'Backspace') {
        this.inputKey('backspace');
      } else if (key === 'Escape') {
        this.inputKey('clear');
      }
    });
  }

  init() {
    this.renderHistory();
    this.bindKeyboardEvents();

    if (this.elDegBtn) this.elDegBtn.addEventListener('click', () => this.setAngleMode('DEG'));
    if (this.elRadBtn) this.elRadBtn.addEventListener('click', () => this.setAngleMode('RAD'));

    const btnHistory = document.getElementById('btnToggleHistory');
    if (btnHistory) btnHistory.addEventListener('click', () => this.toggleHistory());

    const btnCloseHist = document.getElementById('btnCloseHistory');
    if (btnCloseHist) btnCloseHist.addEventListener('click', () => this.toggleHistory());

    const btnClearHist = document.getElementById('btnClearHistory');
    if (btnClearHist) btnClearHist.addEventListener('click', () => this.clearHistory());

    const btnCopy = document.getElementById('btnCopyDisplay');
    if (btnCopy) btnCopy.addEventListener('click', () => this.copyResult());

    // Bind on-screen keypad clicks
    document.querySelectorAll('[data-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-key');
        this.inputKey(k);
      });
    });
  }
}

let sciCalc = null;
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('calcExpression')) {
    sciCalc = new ScientificCalculator();
  }
});
