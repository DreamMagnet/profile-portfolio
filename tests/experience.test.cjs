const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const context = { document: { addEventListener() {} } };
runInNewContext(readFileSync(resolve(__dirname, '../js/index.js'), 'utf8'), context);
const duration = (start, current) => context.getCompletedExperience(start, new Date(current));

test('separates full-time experience from the career total', () => {
  const today = '2026-10-01T12:00:00Z';
  assert.equal(duration('2023-01-02', today).label, '3 years 8 months');
  assert.equal(duration('2022-09-02', today).label, '4 years');
});

test('does not round up before a monthly or yearly anniversary', () => {
  assert.equal(duration('2023-01-02', '2026-10-01T12:00:00Z').shortLabel, '3y 8m');
  assert.equal(duration('2023-01-02', '2026-10-02T12:00:00Z').shortLabel, '3y 9m');
  assert.equal(duration('2022-09-02', '2026-09-01T12:00:00Z').label, '3 years 11 months');
  assert.equal(duration('2022-09-02', '2026-09-02T12:00:00Z').label, '4 years');
});

test('uses the India calendar consistently at midnight', () => {
  assert.equal(duration('2023-01-02', '2024-01-01T18:29:59Z').label, '11 months');
  assert.equal(duration('2023-01-02', '2024-01-01T18:30:00Z').label, '1 year');
});

test('handles the joining date, future start dates, and singular months', () => {
  assert.equal(duration('2023-01-02', '2023-01-02T00:00:00Z').label, '0 months');
  assert.equal(duration('2023-01-02', '2022-12-01T00:00:00Z').totalMonths, 0);
  assert.equal(duration('2023-01-02', '2023-02-02T00:00:00Z').label, '1 month');
  assert.equal(duration('2023-01-02', '2024-02-02T00:00:00Z').label, '1 year 1 month');
});

test('rejects invalid start dates instead of displaying NaN', () => {
  assert.throws(() => duration('not-a-date', '2026-09-30T00:00:00Z'), /valid YYYY-MM-DD/);
  assert.throws(() => duration('2024-02-30', '2026-09-30T00:00:00Z'), /valid YYYY-MM-DD/);
});