// Minimal migration runner for this project (no sequelize-cli installed).
//
// Applies every `server/src/migrations/*.ts` file (except this one) in
// filename order, tracking applied migrations by name in a
// `SequelizeMigrationsMeta` table so re-runs are no-ops. Wired into
// `npm run setup` (server/src/scripts/runScripts.ts, runs before
// `db.sequelize.sync()` since sync() only creates missing tables and never
// ALTERs existing ones) and available standalone via `npm run migrate`.
import fs from 'fs';
import path from 'path';
import db from '../models';

const META_TABLE = 'SequelizeMigrationsMeta';

async function ensureMetaTable(): Promise<void> {
  const qi = db.sequelize.getQueryInterface();
  const tables: string[] = await qi.showAllTables();
  const normalized = tables.map((t: any) => (typeof t === 'string' ? t : t.tableName));
  if (!normalized.includes(META_TABLE)) {
    await qi.createTable(META_TABLE, {
      name: { type: db.Sequelize.DataTypes.STRING, primaryKey: true, allowNull: false },
      appliedAt: { type: db.Sequelize.DataTypes.DATE, allowNull: false, defaultValue: db.Sequelize.DataTypes.NOW },
    });
  }
}

async function getAppliedNames(): Promise<Set<string>> {
  const rows: any[] = await db.sequelize.query(`SELECT name FROM "${META_TABLE}"`, {
    type: db.Sequelize.QueryTypes.SELECT,
  });
  return new Set(rows.map((r) => r.name));
}

export async function runMigrations(): Promise<void> {
  await ensureMetaTable();
  const applied = await getAppliedNames();

  const dir = __dirname;
  const files = fs
    .readdirSync(dir)
    .filter((f) => (f.endsWith('.ts') || f.endsWith('.js')) && f !== 'run.ts' && f !== 'run.js')
    .sort();

  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const migration = require(path.join(dir, file));
    const migrationName: string = migration.name || file;

    if (applied.has(migrationName)) {
      console.log(`⏭  Migration already applied, skipping: ${migrationName}`);
      continue;
    }

    console.log(`▶️  Running migration: ${migrationName}`);
    await migration.up(db.sequelize.getQueryInterface(), db.Sequelize);
    await db.sequelize.query(`INSERT INTO "${META_TABLE}" (name, "appliedAt") VALUES (:name, NOW())`, {
      replacements: { name: migrationName },
    });
    console.log(`✅ Migration applied: ${migrationName}`);
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('All migrations complete.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration run failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
