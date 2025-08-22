import 'dotenv/config';
import cron from 'node-cron';
import { connectMongo, ValidatorModel } from '@avail-np/db';
import { score, DEFAULT_CONTEXT, ValidatorMetrics } from '@avail-np/core';
import { collectBatch } from './pipelines/collect';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/avail_np';
const CRON = process.env.CRON || '*/10 * * * *';

async function runOnce() {
  const batch = await collectBatch(); // returns ValidatorMetrics[]
  // TODO: Build true cohort context values from batch distribution
  const ctx = { ...DEFAULT_CONTEXT };

  for (const m of batch) {
    const result = score(m, ctx);
    await ValidatorModel.updateOne(
      { address: m.address },
      {
        $set: {
          address: m.address,
          lastSeenEra: m.era,
          current: {
            era: m.era,
            faults: m.faults,
            offlineSeconds: m.offlineSeconds,
            unclaimedEras: m.unclaimedEras,
            inActiveSet: m.inActiveSet,
            discoveryTenureDays: m.discoveryTenureDays,
            bondedAmount: m.bondedAmount,
            recentNominations: m.recentNominations,
            rankInPool: m.rankInPool
          },
          score: result,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  }
  console.log(`[worker] processed ${batch.length} validators`);
}

async function main() {
  await connectMongo(MONGO_URI);
  await runOnce();
  cron.schedule(CRON, runOnce);
  console.log(`[worker] scheduled with ${CRON}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
