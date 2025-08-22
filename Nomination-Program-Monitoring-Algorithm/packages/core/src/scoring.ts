import { ValidatorMetrics, ScoringContext, ScoreResult } from './types';
import { clamp01, utils } from './utils';

export function score(metrics: ValidatorMetrics, context: ScoringContext): ScoreResult {
  // PERFORMANCE (40)
  const faultsNorm = 1 - clamp01(metrics.faults / (context.maxFaults || 1));
  const faults = faultsNorm * 15;

  const offlineNorm = 1 - clamp01(metrics.offlineSeconds / (context.maxOfflineSec || 1));
  const offline = offlineNorm * 10;

  const unclaimedNorm = 1 - clamp01(metrics.unclaimedEras / (context.maxUnclaimedEras || 1));
  const unclaimed = unclaimedNorm * 3;

  const activeSet = (metrics.inActiveSet ? 1 : 0) * 7;

  const tenureNorm = clamp01(metrics.discoveryTenureDays / (context.maxTenureDays || 1));
  const tenure = tenureNorm * 5;

  const performance = faults + offline + unclaimed + activeSet + tenure;

  // BONDED (40) — min-max scaling
  const min = BigInt(context.bondedRange.min);
  const max = BigInt(context.bondedRange.max);
  const val = BigInt(metrics.bondedAmount);
  const denom = Number(max - min) || 1;
  const bondedNorm = clamp01(Number(val - min) / denom);
  const bonded = bondedNorm * 40;

  // OTHER (20)
  const recentNomNorm = clamp01(metrics.recentNominations / (context.recentNomWindow || 1));
  const recentNoms = recentNomNorm * 5;

  const poolDen = (context.poolSize - 1) || 1;
  const rankNorm = clamp01((context.poolSize - metrics.rankInPool) / poolDen);
  const poolRank = rankNorm * 5;

  const regionFreq = utils.freq(context.cohortRegions, metrics.geoRegion);
  const geo = clamp01(1 - regionFreq) * 5;

  const asnFreq = utils.freq(context.cohortASNs, metrics.ispASN);
  const isp = clamp01(1 - asnFreq) * 5;

  const other = recentNoms + poolRank + geo + isp;

  return {
    total: +(performance + bonded + other).toFixed(2),
    breakdown: {
      performance, bonded, other,
      faults, offline, unclaimed, activeSet, tenure,
      bondedAmount: bonded, recentNominations: recentNoms,
      poolRank, geoDiversity: geo, ispDiversity: isp
    }
  };
}

export default { score };
