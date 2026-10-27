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
   */
  evaluate(expr) {
    if (!expr || expr.trim() === '') return '';

    // Sanitize and replace math symbols
    let parsed = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');

    // Handle Square Root
    parsed = parsed.replace(/sqrt\(/g, 'Math.sqrt(');
    parsed = parsed.replace(/√\(/g, 'Math.sqrt(');

    // Handle Logarithms
    parsed = parsed.replace(/log\(/g, 'Math.log10(');
    parsed = parsed.replace(/ln\(/g, 'Math.log(');

    // Handle Exponents (e.g. 2^3 -> Math.pow(2, 3))
    parsed = parsed.replace(/([0-9.]+|\b[a-zA-Z0-9_.]+\b)\^([0-9.]+|\b[a-zA-Z0-9_.]+\b)/g, 'Math.pow($1, $2)');

    // Handle Trigonometry according to Degree / Radian mode
    const toRad = this.angleMode === 'DEG' ? ' * (Math.PI / 180)' : '';
    const fromRad = this.angleMode === 'DEG' ? ' * (180 / Math.PI)' : '';

    // Handle Inverse Trigonometry with word boundaries
    parsed = parsed.replace(/\basin\(([^)]+)\)/g, `(Math.asin($1)${fromRad})`);
    parsed = parsed.replace(/\bacos\(([^)]+)\)/g, `(Math.acos($1)${fromRad})`);
    parsed = parsed.replace(/\batan\(([^)]+)\)/g, `(Math.atan($1)${fromRad})`);

    // Handle Regular Trigonometry with word boundaries
    parsed = parsed.replace(/\bsin\(([^)]+)\)/g, `Math.sin(($1)${toRad})`);
    parsed = parsed.replace(/\bcos\(([^)]+)\)/g, `Math.cos(($1)${toRad})`);
    parsed = parsed.replace(/\btan\(([^)]+)\)/g, `Math.tan(($1)${toRad})`);

    // Handle Percent (e.g. 50% -> 50 * 0.01)
    parsed = parsed.replace(/([0-9.]+)%/g, '($1 * 0.01)');

    // Whitelist check: only numbers, operators, parens, and standard math identifiers
    if (!/^[0-9+\-*/().,MathPIEsqrlogasincoctanpow\s]+$/i.test(parsed)) {
      return null;
    }

    try {
      // Safe mathematical evaluation using controlled Function
      const res = Function(`"use strict"; return (${parsed})`)();
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        // Clean up floating point anomalies (e.g. 0.1 + 0.2 = 0.30000000000000004)
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
