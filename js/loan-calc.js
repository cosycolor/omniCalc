/**
 * Project OmniCalc - Loan & Mortgage Interest Calculator Module
 * Supports Equal Principal & Interest (Amortization), Equal Principal, and Bullet Repayment
 */

class LoanCalculator {
  constructor() {
    this.init();
  }

  formatCurrency(val) {
    const isEn = (document.documentElement.lang || '').startsWith('en');
    const rounded = Math.round(val);
    if (isEn) {
      return rounded.toLocaleString('en-US');
    }
    return rounded.toLocaleString('ko-KR') + ' 원';
  }

  calculate() {
    const principal = parseFloat(document.getElementById('loan_principal')?.value);
    const annualRate = parseFloat(document.getElementById('loan_rate')?.value);
    const months = parseInt(document.getElementById('loan_months')?.value, 10);
    const method = document.getElementById('loan_method')?.value || 'equal_pi';

    const resMonthlyEl = document.getElementById('loan_res_monthly');
    const resInterestEl = document.getElementById('loan_res_interest');
    const resTotalEl = document.getElementById('loan_res_total');
    const resRatioEl = document.getElementById('loan_res_ratio');

    if (isNaN(principal) || principal <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(months) || months <= 0) {
      if (resMonthlyEl) resMonthlyEl.textContent = '0';
      if (resInterestEl) resInterestEl.textContent = '0';
      if (resTotalEl) resTotalEl.textContent = '0';
      if (resRatioEl) resRatioEl.textContent = '0%';
      return;
    }

    const r = (annualRate / 100) / 12;
    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalPayment = 0;

    if (r === 0) {
      monthlyPayment = principal / months;
      totalInterest = 0;
      totalPayment = principal;
    } else if (method === 'equal_pi') {
      // 원리금균등상환: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const factor = Math.pow(1 + r, months);
      monthlyPayment = principal * (r * factor) / (factor - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - principal;
    } else if (method === 'equal_p') {
      // 원금균등상환: 총 이자 = P * r * (n + 1) / 2, 첫 달 상환액 표시 및 평균 안내
      totalInterest = principal * r * (months + 1) / 2;
      totalPayment = principal + totalInterest;
      monthlyPayment = totalPayment / months; // 월 평균 상환액
    } else if (method === 'bullet') {
      // 만기일시상환: 매월 이자만 납부, 만기에 원금 일시 상환
      monthlyPayment = principal * r;
      totalInterest = monthlyPayment * months;
      totalPayment = principal + totalInterest;
    }

    const ratio = (totalInterest / principal) * 100;

    if (resMonthlyEl) resMonthlyEl.textContent = this.formatCurrency(monthlyPayment);
    if (resInterestEl) resInterestEl.textContent = this.formatCurrency(totalInterest);
    if (resTotalEl) resTotalEl.textContent = this.formatCurrency(totalPayment);
    if (resRatioEl) resRatioEl.textContent = `${ratio.toFixed(2)}%`;

    if (window.omniTracker) {
      window.omniTracker.trackCalculation('대출이자', `${principal} / ${annualRate}% / ${months}개월 (${method})`);
    }
  }

  init() {
    ['loan_principal', 'loan_rate', 'loan_months'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calculate());
    });
    document.getElementById('loan_method')?.addEventListener('change', () => this.calculate());
    window.addEventListener('languageChanged', () => this.calculate());
    this.calculate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loan_principal')) {
    new LoanCalculator();
  }
});
