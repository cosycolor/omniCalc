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
    const isEn = (document.documentElement.lang || '').startsWith('en');
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
    let firstMonthPayment = 0;
    let totalInterest = 0;
    let totalPayment = 0;

    if (r === 0) {
      monthlyPayment = principal / months;
      firstMonthPayment = monthlyPayment;
      totalInterest = 0;
      totalPayment = principal;
    } else if (method === 'equal_pi') {
      const factor = Math.pow(1 + r, months);
      monthlyPayment = principal * (r * factor) / (factor - 1);
      firstMonthPayment = monthlyPayment;
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - principal;
    } else if (method === 'equal_p') {
      // 원금균등상환: 매월 납부 원금 = P / n, 첫 달 이자 = P * r, 총 이자 = P * r * (n + 1) / 2
      firstMonthPayment = (principal / months) + (principal * r);
      totalInterest = principal * r * (months + 1) / 2;
      totalPayment = principal + totalInterest;
      monthlyPayment = totalPayment / months;
    } else if (method === 'bullet') {
      monthlyPayment = principal * r;
      firstMonthPayment = monthlyPayment;
      totalInterest = monthlyPayment * months;
      totalPayment = principal + totalInterest;
    }

    const ratio = (totalInterest / principal) * 100;

    if (resMonthlyEl) {
      if (method === 'equal_p' && r > 0) {
        resMonthlyEl.innerHTML = isEn
          ? `1st Mo: ${this.formatCurrency(firstMonthPayment)} <div style="font-size:0.8rem; font-weight:500; color:var(--text-secondary); margin-top:4px;">Avg: ${this.formatCurrency(monthlyPayment)}/mo</div>`
          : `첫 달 ${this.formatCurrency(firstMonthPayment)} <div style="font-size:0.8rem; font-weight:500; color:var(--text-secondary); margin-top:4px;">월평균: ${this.formatCurrency(monthlyPayment)}</div>`;
      } else {
        resMonthlyEl.textContent = this.formatCurrency(monthlyPayment);
      }
    }
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
