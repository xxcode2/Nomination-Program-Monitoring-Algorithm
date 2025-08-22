export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function freq<T>(arr: T[], val: T | undefined): number {
  if (!val || !arr.length) return 0;
  const n = arr.filter(v => v === val).length;
  return n / arr.length;
}

export const utils = { clamp01, freq };
