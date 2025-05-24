export function roundTo(value: number, precision: number = 2) {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}
