/**
 * Comprehensive Accuracy & Performance Test Suite for OmniCalc
 */

// Replicate the evaluation logic from calculator-core.js
function evaluateExpression(expr, angleMode = 'DEG') {
  if (!expr || expr.trim() === '') return '';

  let parsed = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

  parsed = parsed
    .replace(/(\d|\))(?=\(|π|\be\b|sin|cos|tan|asin|acos|atan|log|ln|sqrt|√)/g, '$1*')
    .replace(/(π|\be\b)(?=\d|\(|π|\be\b|sin|cos|tan|asin|acos|atan|log|ln|sqrt|√)/g, '$1*');

  parsed = parsed
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E');

  parsed = parsed.replace(/(\d+(?:\.\d+)?)%/g, '($1*0.01)');

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

  parsed = parsed.replace(/\^/g, '**');

  if (!/^[0-9+\-*/().,_a-zA-Z\s]+$/.test(parsed)) {
    return null;
  }

  const isDeg = angleMode === 'DEG';
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
      if (mod === 90) return NaN;
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

// Greatest Common Divisor for Fractions
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function calculateFraction(n1, d1, op, n2, d2) {
  let fn = 0, fd = 1;
  if (op === '+') { fn = n1 * d2 + n2 * d1; fd = d1 * d2; }
  else if (op === '-') { fn = n1 * d2 - n2 * d1; fd = d1 * d2; }
  else if (op === '*') { fn = n1 * n2; fd = d1 * d2; }
  else if (op === '/') { fn = n1 * d2; fd = d1 * n2; if (fd === 0) return 'DIV_ZERO'; }

  if (fd < 0) { fn = -fn; fd = -fd; }
  const div = gcd(fn, fd);
  return `${fn / div}/${fd / div}`;
}

const tests = [
  // 1. Basic Arithmetic & Precedence
  { name: "사칙연산 우선순위 (2 + 3 * 4)", expr: "2 + 3 × 4", mode: "DEG", expected: "14" },
  { name: "괄호 우선 연산 ((2 + 3) * 4)", expr: "(2 + 3) × 4", mode: "DEG", expected: "20" },
  { name: "부동소수점 오차 정밀 보정 (0.1 + 0.2)", expr: "0.1 + 0.2", mode: "DEG", expected: "0.3" },
  { name: "음수와 나눗셈 (10 - -5)", expr: "10 - (-5)", mode: "DEG", expected: "15" },
  { name: "대형 곱셈 (123456 * 654321)", expr: "123456 × 654321", mode: "DEG", expected: "80779853376" },

  // 2. Exponents & Roots
  { name: "거듭제곱 (2^10)", expr: "2^10", mode: "DEG", expected: "1024" },
  { name: "제곱근 (sqrt(144))", expr: "sqrt(144)", mode: "DEG", expected: "12" },
  { name: "소수 거듭제곱 (4^0.5)", expr: "4^0.5", mode: "DEG", expected: "2" },

  // 3. Trigonometry (DEG & RAD)
  { name: "삼각함수 sin(30) in DEG", expr: "sin(30)", mode: "DEG", expected: "0.5" },
  { name: "삼각함수 cos(60) in DEG", expr: "cos(60)", mode: "DEG", expected: "0.5" },
  { name: "삼각함수 tan(45) in DEG", expr: "tan(45)", mode: "DEG", expected: "1" },
  { name: "삼각함수 sin(π/2) in RAD", expr: "sin(π / 2)", mode: "RAD", expected: "1" },
  { name: "역삼각함수 asin(0.5) in DEG", expr: "asin(0.5)", mode: "DEG", expected: "30" },

  // 4. Logarithms & Constants
  { name: "상용로그 log(1000)", expr: "log(1000)", mode: "DEG", expected: "3" },
  { name: "자연로그 ln(e)", expr: "ln(e)", mode: "DEG", expected: "1" },
  { name: "파이 상수 (π)", expr: "π", mode: "DEG", expected: "3.14159265359" },

  // 5. Percent Operations
  { name: "퍼센트 연산 (50 * 20%)", expr: "50 × 20%", mode: "DEG", expected: "10" },

  // 6. Zero Division & Edge Cases Defense
  { name: "0으로 나누기 방어 (5 / 0)", expr: "5 ÷ 0", mode: "DEG", expected: null },
  { name: "괄호 수식 거듭제곱 ((2 + 3)^2)", expr: "(2 + 3)^2", mode: "DEG", expected: "25" },
  { name: "중첩 함수 및 거듭제곱 (sqrt(3^2 + 4^2))", expr: "sqrt(3^2 + 4^2)", mode: "DEG", expected: "5" },
  { name: "삼각함수 정밀도 cos(90) = 0", expr: "cos(90)", mode: "DEG", expected: "0" },
  { name: "삼각함수 정밀도 sin(180) = 0", expr: "sin(180)", mode: "DEG", expected: "0" },
  { name: "삼각함수 점근선 방어 tan(90) = null", expr: "tan(90)", mode: "DEG", expected: null },
  { name: "암시적 곱셈 (2(3 + 4))", expr: "2(3 + 4)", mode: "DEG", expected: "14" }
];

console.log("=================================================");
console.log(" OmniCalc 수학 연산 정밀도 검증 (Accuracy Suite) ");
console.log("=================================================");

let passed = 0;
tests.forEach((t, i) => {
  const result = evaluateExpression(t.expr, t.mode);
  const isMatch = result === t.expected;
  if (isMatch) passed++;
  const status = isMatch ? " PASS " : " FAIL ";
  console.log(`[${status}] #${i + 1} ${t.name}: 수식[${t.expr}] -> 결과: ${result} (기대값: ${t.expected})`);
});

// Test Fractions
console.log("\n=================================================");
console.log(" 분수 기약분수 약분 및 사칙연산 검증 ");
console.log("=================================================");
const fractionTests = [
  { n1: 2, d1: 3, op: '+', n2: 3, d2: 4, expected: '17/12', name: '분수 덧셈 2/3 + 3/4' },
  { n1: 5, d1: 6, op: '-', n2: 1, d2: 6, expected: '2/3', name: '분수 뺄셈 및 약분 5/6 - 1/6 = 4/6 -> 2/3' },
  { n1: 3, d1: 5, op: '*', n2: 10, d2: 9, expected: '2/3', name: '분수 곱셈 및 약분 3/5 * 10/9 = 30/45 -> 2/3' },
  { n1: 7, d1: 8, op: '/', n2: 14, d2: 16, expected: '1/1', name: '분수 나눗셈 7/8 / 14/16 = 1' }
];

fractionTests.forEach((t, i) => {
  const res = calculateFraction(t.n1, t.d1, t.op, t.n2, t.d2);
  const isMatch = res === t.expected;
  if (isMatch) passed++;
  const status = isMatch ? " PASS " : " FAIL ";
  console.log(`[${status}] #${i + 1} ${t.name}: 결과[${res}] (기대값: ${t.expected})`);
});

// Test New Calculators (Loan, BMI & BMR, Date & Age)
console.log("\n=================================================");
console.log(" 신규 계산기 3종 (대출이자 / BMI·BMR / 날짜·만나이) 검증 ");
console.log("=================================================");

function calcLoan(principal, annualRate, months, method) {
  const r = (annualRate / 100) / 12;
  if (method === 'equal_pi') {
    const f = Math.pow(1 + r, months);
    const m = principal * (r * f) / (f - 1);
    return { monthly: Math.round(m), totalInterest: Math.round(m * months - principal) };
  } else if (method === 'equal_p') {
    const ti = principal * r * (months + 1) / 2;
    return { monthly: Math.round((principal + ti) / months), totalInterest: Math.round(ti) };
  } else {
    const m = principal * r;
    return { monthly: Math.round(m), totalInterest: Math.round(m * months) };
  }
}

function calcBmiBmr(heightCm, weightKg, age, gender) {
  const hm = heightCm / 100;
  const bmi = (weightKg / (hm * hm)).toFixed(2);
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + (gender === 'male' ? 5 : -161);
  return { bmi, bmr: Math.round(bmr) };
}

function calcDateDiff(startYMD, endYMD, includeStart) {
  const s = startYMD.split('-').map(Number);
  const e = endYMD.split('-').map(Number);
  const sUTC = Date.UTC(s[0], s[1] - 1, s[2]);
  const eUTC = Date.UTC(e[0], e[1] - 1, e[2]);
  return Math.abs(Math.round((eUTC - sUTC) / 86400000)) + (includeStart ? 1 : 0);
}

const newCalcTests = [
  {
    name: "대출 원리금균등 (1억, 4.5%, 36개월)",
    actual: JSON.stringify(calcLoan(100000000, 4.5, 36, 'equal_pi')),
    expected: JSON.stringify({ monthly: 2974692, totalInterest: 7088928 })
  },
  {
    name: "대출 원금균등 총이자 (1억, 4.5%, 36개월)",
    actual: calcLoan(100000000, 4.5, 36, 'equal_p').totalInterest.toString(),
    expected: "6937500"
  },
  {
    name: "대출 만기일시 총이자 (1억, 4.5%, 36개월)",
    actual: calcLoan(100000000, 4.5, 36, 'bullet').totalInterest.toString(),
    expected: "13500000"
  },
  {
    name: "BMI 및 남성 기초대사량 (172cm, 68kg, 30세)",
    actual: JSON.stringify(calcBmiBmr(172, 68, 30, 'male')),
    expected: JSON.stringify({ bmi: "22.99", bmr: 1610 })
  },
  {
    name: "날짜 계산 윤년 포함 (2024-02-01 ~ 2024-03-01, 초일불산입)",
    actual: calcDateDiff("2024-02-01", "2024-03-01", false).toString(),
    expected: "29"
  },
  {
    name: "날짜 계산 커플 기념일 (2026-01-01 ~ 2026-04-10, 초일산입 100일)",
    actual: calcDateDiff("2026-01-01", "2026-04-10", true).toString(),
    expected: "100"
  }
];

newCalcTests.forEach((t, i) => {
  const isMatch = t.actual === t.expected;
  if (isMatch) passed++;
  const status = isMatch ? " PASS " : " FAIL ";
  console.log(`[${status}] #${i + 1} ${t.name}: 결과[${t.actual}] (기대값: ${t.expected})`);
});

// Performance Benchmark: Run 10,000 evaluations
console.log("\n=================================================");
console.log(" 성능 벤치마크 (10,000회 연속 수식 연산 속도 측정) ");
console.log("=================================================");
const start = Date.now();
for (let i = 0; i < 10000; i++) {
  evaluateExpression("sin(30) + sqrt(144) × 2^3 - log(100)", "DEG");
}
const elapsed = Date.now() - start;
const totalTests = tests.length + fractionTests.length + newCalcTests.length;
console.log(`10,000회 고난도 수식 연산 소요 시간: ${elapsed}ms (1회당 약 ${(elapsed / 10000).toFixed(4)}ms)`);
console.log(`초당 연산 처리량(Throughput): ${Math.round(10000 / (elapsed / 1000))} ops/sec`);
console.log(`전체 테스트 통과율: ${passed} / ${totalTests} (${Math.round((passed / totalTests) * 100)}%)`);
console.log("=================================================");
