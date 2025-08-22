import mongoose from 'mongoose';

const ScoreBreakdown = new mongoose.Schema({
  performance: Number,
  bonded: Number,
  other: Number,
  faults: Number,
  offline: Number,
  unclaimed: Number,
  activeSet: Number,
  tenure: Number,
  bondedAmount: Number,
  recentNominations: Number,
  poolRank: Number,
  geoDiversity: Number,
  ispDiversity: Number
}, {_id: false});

const ValidatorSchema = new mongoose.Schema({
  address: { type: String, index: true, unique: true },
  lastSeenEra: Number,
  identity: { name: String, operator: String },
  network: { geoRegion: String, ispASN: Number },
  current: {
    era: Number,
    faults: Number,
    offlineSeconds: Number,
    unclaimedEras: Number,
    inActiveSet: Boolean,
    discoveryTenureDays: Number,
    bondedAmount: String,
    recentNominations: Number,
    rankInPool: Number
  },
  score: {
    total: Number,
    breakdown: { type: ScoreBreakdown }
  },
  updatedAt: { type: Date, default: Date.now }
});

export const ValidatorModel = mongoose.model('Validator', ValidatorSchema);
