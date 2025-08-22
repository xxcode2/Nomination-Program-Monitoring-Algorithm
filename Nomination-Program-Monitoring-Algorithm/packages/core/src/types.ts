export type ValidatorMetrics = {
  address: string;
  era: number;
  faults: number;
  offlineSeconds: number;
  unclaimedEras: number;
  inActiveSet: boolean;
  discoveryTenureDays: number;
  bondedAmount: string; // store as decimal string
  recentNominations: number;
  rankInPool: number;
  geoRegion?: string;
  ispASN?: number;
};

export type ScoringContext = {
  maxOfflineSec: number;
  maxFaults: number;
  maxTenureDays: number;
  maxUnclaimedEras: number;
  bondedRange: { min: string; max: string };
  recentNomWindow: number;
  poolSize: number;
  cohortRegions: string[];
  cohortASNs: number[];
};

export type ScoreBreakdown = {
  performance: number;
  bonded: number;
  other: number;
  faults: number;
  offline: number;
  unclaimed: number;
  activeSet: number;
  tenure: number;
  bondedAmount: number;
  recentNominations: number;
  poolRank: number;
  geoDiversity: number;
  ispDiversity: number;
};

export type ScoreResult = {
  total: number;
  breakdown: ScoreBreakdown;
};
