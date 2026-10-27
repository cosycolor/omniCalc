/**
 * Project OmniCalc - Smart Universal Unit Converter
 * Korean special units (평, 돈, 근) & International units (m², sq ft, kg, lb, oz)
 */

class UnitConverter {
  constructor() {
    this.conversions = {
      area: {
        base: 'sqm',
        units: {
          pyeong: { nameKo: '평 (坪)', nameEn: 'Pyung (坪)', rate: 3.305785 },
          sqm: { nameKo: '제곱미터 (㎡)', nameEn: 'Square Meter (㎡)', rate: 1 },
          sqft: { nameKo: '평방피트 (sq ft)', nameEn: 'Square Feet (sq ft)', rate: 0.092903 },
          ha: { nameKo: '헥타르 (ha)', nameEn: 'Hectare (ha)', rate: 10000 },
          acre: { nameKo: '에이커 (ac)', nameEn: 'Acre (ac)', rate: 4046.86 }
        }
      },
      length: {
        base: 'm',
        units: {
          cm: { nameKo: '센티미터 (cm)', nameEn: 'Centimeter (cm)', rate: 0.01 },
          m: { nameKo: '미터 (m)', nameEn: 'Meter (m)', rate: 1 },
          km: { nameKo: '킬로미터 (km)', nameEn: 'Kilometer (km)', rate: 1000 },
          inch: { nameKo: '인치 (in)', nameEn: 'Inch (in)', rate: 0.0254 },
          ft: { nameKo: '피트 (ft)', nameEn: 'Foot (ft)', rate: 0.3048 },
          yard: { nameKo: '야드 (yd)', nameEn: 'Yard (yd)', rate: 0.9144 },
          mile: { nameKo: '마일 (mi)', nameEn: 'Mile (mi)', rate: 1609.34 }
        }
      },
      weight: {
        base: 'kg',
        units: {
          g: { nameKo: '그램 (g)', nameEn: 'Gram (g)', rate: 0.001 },
          kg: { nameKo: '킬로그램 (kg)', nameEn: 'Kilogram (kg)', rate: 1 },
          don: { nameKo: '금 돈 (3.75g)', nameEn: 'Korean Don (3.75g)', rate: 0.00375 },
          geun: { nameKo: '고기 한 근 (600g)', nameEn: 'Korean Geun (600g)', rate: 0.6 },
          oz: { nameKo: '온스 (oz)', nameEn: 'Ounce (oz)', rate: 0.0283495 },
          lb: { nameKo: '파운드 (lb)', nameEn: 'Pound (lb)', rate: 0.453592 }
        }
      }
    };

    this.currentCategory = 'area';
    this.init();
  }

  isEnglish() {
    return (document.documentElement.lang || 'ko').startsWith('en');
  }

  getUnitLabel(unit) {
    return this.isEnglish() ? (unit.nameEn || unit.nameKo) : unit.nameKo;
  }

  setCategory(cat) {
    this.currentCategory = cat;
    this.populateUnitSelects();
    this.convert();
  }

  populateUnitSelects() {
    const fromSelect = document.getElementById('unitFromSelect');
    const toSelect = document.getElementById('unitToSelect');
    if (!fromSelect || !toSelect) return;

    const prevFrom = fromSelect.value;
    const prevTo = toSelect.value;

    const units = this.conversions[this.currentCategory].units;
    const keys = Object.keys(units);

    fromSelect.innerHTML = keys.map(k => `<option value="${k}">${this.getUnitLabel(units[k])}</option>`).join('');
    toSelect.innerHTML = keys.map(k => `<option value="${k}">${this.getUnitLabel(units[k])}</option>`).join('');

    // Restore previous selection if still valid for this category
    if (prevFrom && units[prevFrom]) {
      fromSelect.value = prevFrom;
    } else {
      if (this.currentCategory === 'area') fromSelect.value = 'sqm';
      else if (this.currentCategory === 'length') fromSelect.value = 'cm';
      else if (this.currentCategory === 'weight') fromSelect.value = 'kg';
    }

    if (prevTo && units[prevTo]) {
      toSelect.value = prevTo;
    } else {
      if (this.currentCategory === 'area') toSelect.value = 'pyeong';
      else if (this.currentCategory === 'length') toSelect.value = 'inch';
      else if (this.currentCategory === 'weight') toSelect.value = 'lb';
    }
  }

  convert() {
    const inputVal = parseFloat(document.getElementById('unitInputVal')?.value);
    const fromUnit = document.getElementById('unitFromSelect')?.value;
    const toUnit = document.getElementById('unitToSelect')?.value;
    const resEl = document.getElementById('unitResultVal');

    if (isNaN(inputVal) || !fromUnit || !toUnit || !resEl) {
      if (resEl) resEl.textContent = '0';
      return;
    }

    const units = this.conversions[this.currentCategory].units;
    if (!units[fromUnit] || !units[toUnit]) return;

    // Value in base unit
    const inBase = inputVal * units[fromUnit].rate;
    // Value in target unit
    const converted = inBase / units[toUnit].rate;

    resEl.textContent = this.formatNumber(converted);

    if (window.omniTracker) {
      window.omniTracker.trackCalculation('단위변환', `${inputVal} ${fromUnit} → ${toUnit}`);
    }
  }

  swapUnits() {
    const fromSelect = document.getElementById('unitFromSelect');
    const toSelect = document.getElementById('unitToSelect');
    if (fromSelect && toSelect) {
      const temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
      this.convert();
    }
  }

  formatNumber(val) {
    if (Number.isInteger(val)) return val.toLocaleString();
    if (Math.abs(val) < 0.0001) return val.toExponential(4);
    return parseFloat(val.toFixed(6)).toLocaleString();
  }

  init() {
    this.populateUnitSelects();

    document.querySelectorAll('[data-unit-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-unit-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setCategory(btn.getAttribute('data-unit-cat'));
      });
    });

    document.getElementById('unitInputVal')?.addEventListener('input', () => this.convert());
    document.getElementById('unitFromSelect')?.addEventListener('change', () => this.convert());
    document.getElementById('unitToSelect')?.addEventListener('change', () => this.convert());
    document.getElementById('btnSwapUnits')?.addEventListener('click', () => this.swapUnits());

    // Re-render unit labels when language toggles
    window.addEventListener('languageChanged', () => {
      this.populateUnitSelects();
      this.convert();
    });

    this.convert();
  }
}

const initUnitConv = () => {
  if (document.getElementById('unitInputVal')) {
    new UnitConverter();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUnitConv);
} else {
  initUnitConv();
}
