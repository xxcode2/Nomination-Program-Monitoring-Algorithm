export const DEFAULT_CONTEXT = {
  maxOfflineSec: 24 * 3600, // 1 day
  maxFaults: 10,
  maxTenureDays: 180,
  maxUnclaimedEras: 3,
  bondedRange: { min: "0", max: "1000000000000000" }, // placeholder
  recentNomWindow: 10,
  poolSize: 1000,
  cohortRegions: [] as string[],
  cohortASNs: [] as number[]
};
