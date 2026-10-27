/**
 * Comprehensive Accuracy & Performance Test Suite for OmniCalc
 */

// Replicate the evaluation logic from calculator-core.js
function evaluateExpression(expr, angleMode = 'DEG') {
  if (!expr || expr.trim() === '') return '';

  let parsed = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E');

  parsed = parsed.replace(/sqrt\(/g, 'Math.sqrt(');
  parsed = parsed.replace(/√\(/g, 'Math.sqrt(');
  parsed = parsed.replace(/log\(/g, 'Math.log10(');
  parsed = parsed.replace(/ln\(/g, 'Math.log(');

  parsed = parsed.replace(/([0-9.]+|\b[a-zA-Z0-9_.]+\b)\^([0-9.]+|\b[a-zA-Z0-9_.]+\b)/g, 'Math.pow($1, $2)');

  const toRad = angleMode === 'DEG' ? ' * (Math.PI / 180)' : '';
  const fromRad = angleMode === 'DEG' ? ' * (180 / Math.PI)' : '';

  // Handle Inverse Trigonometry with word boundaries
  parsed = parsed.replace(/\basin\(([^)]+)\)/g, `(Math.asin($1)${fromRad})`);
  parsed = parsed.replace(/\bacos\(([^)]+)\)/g, `(Math.acos($1)${fromRad})`);
  parsed = parsed.replace(/\batan\(([^)]+)\)/g, `(Math.atan($1)${fromRad})`);

  // Handle Regular Trigonometry with word boundaries
  parsed = parsed.replace(/\bsin\(([^)]+)\)/g, `Math.sin(($1)${toRad})`);
  parsed = parsed.replace(/\bcos\(([^)]+)\)/g, `Math.cos(($1)${toRad})`);
  parsed = parsed.replace(/\btan\(([^)]+)\)/g, `Math.tan(($1)${toRad})`);

  parsed = parsed.replace(/([0-9.]+)%/g, '($1 * 0.01)');

  try {
    const res = Function(`"use strict"; return (${parsed})`)();
    if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
      return parseFloat(res.toPrecision(12)).toString();
    }
    return null;
  } catch (e) {
    console.error("Eval Error on [" + expr + "]:", e.message, "parsed was:", parsed);
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

  // 6. Zero Division Defense
  { name: "0으로 나누기 방어 (5 / 0)", expr: "5 ÷ 0", mode: "DEG", expected: null }
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

// Performance Benchmark: Run 10,000 evaluations
console.log("\n=================================================");
console.log(" 성능 벤치마크 (10,000회 연속 수식 연산 속도 측정) ");
console.log("=================================================");
const start = Date.now();
for (let i = 0; i < 10000; i++) {
  evaluateExpression("sin(30) + sqrt(144) × 2^3 - log(100)", "DEG");
}
const elapsed = Date.now() - start;
console.log(`10,000회 고난도 수식 연산 소요 시간: ${elapsed}ms (1회당 약 ${(elapsed / 10000).toFixed(4)}ms)`);
console.log(`초당 연산 처리량(Throughput): ${Math.round(10000 / (elapsed / 1000))} ops/sec`);
console.log(`전체 테스트 통과율: ${passed} / ${tests.length + fractionTests.length} (${Math.round((passed / (tests.length + fractionTests.length)) * 100)}%)`);
console.log("=================================================");
