/**
 * Project OmniCalc - BMI (Body Mass Index) & BMR Calculator Module
 * Computes BMI, Obesity Category (Asia-Pacific & WHO), Ideal Weight Range, and Basal Metabolic Rate (Mifflin-St Jeor)
 */

class BmiCalculator {
  constructor() {
    this.init();
  }

  getCategoryLabel(bmi) {
    const isEn = (document.documentElement.lang || '').startsWith('en');
    if (isEn) {
      // WHO / Asia-Pacific dual guidance
      if (bmi < 18.5) return 'Underweight (< 18.5)';
      if (bmi < 23.0) return 'Normal Weight (18.5–22.9)';
      if (bmi < 25.0) return 'Overweight / Pre-obese (23.0–24.9)';
      if (bmi < 30.0) return 'Class I Obesity (25.0–29.9)';
      return 'Class II+ Obesity (≥ 30.0)';
    } else {
      // 대한비만학회(아시아-태평양) 기준
      if (bmi < 18.5) return '저체중 (< 18.5)';
      if (bmi < 23.0) return '정상 체중 (18.5 ~ 22.9)';
      if (bmi < 25.0) return '과체중 / 비만 전단계 (23.0 ~ 24.9)';
      if (bmi < 30.0) return '1단계 비만 (25.0 ~ 29.9)';
      if (bmi < 35.0) return '2단계 비만 (30.0 ~ 34.9)';
      return '고도 비만 (≥ 35.0)';
    }
  }

  calculate() {
    const gender = document.getElementById('bmi_gender')?.value || 'male';
    const age = parseFloat(document.getElementById('bmi_age')?.value);
    const heightCm = parseFloat(document.getElementById('bmi_height')?.value);
    const weightKg = parseFloat(document.getElementById('bmi_weight')?.value);

    const resBmiEl = document.getElementById('bmi_res_value');
    const resCatEl = document.getElementById('bmi_res_category');
    const resIdealEl = document.getElementById('bmi_res_ideal');
    const resBmrEl = document.getElementById('bmi_res_bmr');

    if (isNaN(heightCm) || heightCm <= 30 || isNaN(weightKg) || weightKg <= 5) {
      if (resBmiEl) resBmiEl.textContent = '0.0';
      if (resCatEl) resCatEl.textContent = '-';
      if (resIdealEl) resIdealEl.textContent = '-';
      if (resBmrEl) resBmrEl.textContent = '0 kcal';
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Ideal Weight Range (BMI 18.5 ~ 22.9)
    const minIdeal = 18.5 * heightM * heightM;
    const maxIdeal = 22.9 * heightM * heightM;

    // Mifflin-St Jeor Equation for BMR
    const validAge = (!isNaN(age) && age > 0) ? age : 30;
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * validAge);
    bmr += (gender === 'male') ? 5 : -161;

    if (resBmiEl) resBmiEl.textContent = bmi.toFixed(2);
    if (resCatEl) resCatEl.textContent = this.getCategoryLabel(bmi);
    if (resIdealEl) resIdealEl.textContent = `${minIdeal.toFixed(1)} ~ ${maxIdeal.toFixed(1)} kg`;
    if (resBmrEl) resBmrEl.textContent = `${Math.round(bmr).toLocaleString()} kcal`;

    if (window.omniTracker) {
      window.omniTracker.trackCalculation('BMI', `${heightCm}cm / ${weightKg}kg -> BMI ${bmi.toFixed(1)}`);
    }
  }

  init() {
    ['bmi_age', 'bmi_height', 'bmi_weight'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.calculate());
    });
    document.getElementById('bmi_gender')?.addEventListener('change', () => this.calculate());
    window.addEventListener('languageChanged', () => this.calculate());
    this.calculate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bmi_height')) {
    new BmiCalculator();
  }
});
