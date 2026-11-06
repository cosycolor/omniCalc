/**
 * Project OmniCalc - Fraction Arithmetic & Simplifier Module
 * Adds, subtracts, multiplies, divides fractions with GCD auto-simplification
 */

class FractionCalculator {
  constructor() {
    this.init();
  }

  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  calculate() {
    const isEn = (document.documentElement.lang || '').startsWith('en');
    const num1 = parseInt(document.getElementById('f_num1')?.value, 10);
    const den1 = parseInt(document.getElementById('f_den1')?.value, 10);
    const op = document.getElementById('f_op')?.value;
    const num2 = parseInt(document.getElementById('f_num2')?.value, 10);
    const den2 = parseInt(document.getElementById('f_den2')?.value, 10);

    const resFractionEl = document.getElementById('f_res_fraction');
    const resMixedEl = document.getElementById('f_res_mixed');
    const resDecimalEl = document.getElementById('f_res_decimal');

    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2) || den1 === 0 || den2 === 0) {
      if (resFractionEl) resFractionEl.textContent = den1 === 0 || den2 === 0 ? (isEn ? 'Denominator cannot be 0' : '분모는 0이 될 수 없음') : '0';
      if (resMixedEl) resMixedEl.textContent = '-';
      if (resDecimalEl) resDecimalEl.textContent = '0';
      return;
    }

    let finalNum = 0;
    let finalDen = 1;

    if (op === '+') {
      finalNum = num1 * den2 + num2 * den1;
      finalDen = den1 * den2;
    } else if (op === '-') {
      finalNum = num1 * den2 - num2 * den1;
      finalDen = den1 * den2;
    } else if (op === '*') {
      finalNum = num1 * num2;
      finalDen = den1 * den2;
    } else if (op === '/') {
      finalNum = num1 * den2;
      finalDen = den1 * num2;
      if (finalDen === 0) {
        if (resFractionEl) resFractionEl.textContent = isEn ? 'Cannot divide by 0' : '0으로 나눌 수 없음';
        if (resMixedEl) resMixedEl.textContent = '-';
        if (resDecimalEl) resDecimalEl.textContent = '-';
        return;
      }
    }

    if (finalDen < 0) {
      finalNum = -finalNum;
      finalDen = -finalDen;
    }

    const divisor = this.gcd(finalNum, finalDen);
    const simpNum = finalNum / divisor;
    const simpDen = finalDen / divisor;

    if (simpDen === 1) {
      resFractionEl.textContent = simpNum.toString();
    } else {
      resFractionEl.innerHTML = `<sup>${simpNum}</sup>&frasl;<sub>${simpDen}</sub> (${simpNum}/${simpDen})`;
    }

    if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
      const whole = Math.trunc(simpNum / simpDen);
      const rem = Math.abs(simpNum % simpDen);
      if (rem === 0) {
        resMixedEl.textContent = whole.toString();
      } else {
        resMixedEl.innerHTML = `${whole} <sup>${rem}</sup>&frasl;<sub>${simpDen}</sub>`;
      }
    } else {
      resMixedEl.textContent = isEn ? 'Proper fraction (No mixed form)' : '진분수 (대분수 없음)';
    }

    const decimalVal = simpNum / simpDen;
    resDecimalEl.textContent = parseFloat(decimalVal.toFixed(6)).toString();

    if (window.omniTracker) {
      window.omniTracker.trackCalculation('분수', `${num1}/${den1} ${op} ${num2}/${den2}`);
    }
  }

  init() {
    ['f_num1', 'f_den1', 'f_num2', 'f_den2'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calculate());
    });

    document.getElementById('f_op')?.addEventListener('change', () => this.calculate());
    window.addEventListener('languageChanged', () => this.calculate());
    this.calculate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('f_num1')) {
    new FractionCalculator();
  }
});
