// Migration: add Order.orderNumber (unique, human-readable).
//
// This project has no sequelize-cli / .sequelizerc — schema is provisioned
// via `db.sequelize.sync()` in server/src/scripts/runScripts.ts, which only
// CREATEs missing tables and never ALTERs existing ones. That's correct for
// net-new tables but cannot add a column to an already-existing `Orders`
// table, so a real migration is required here. Run via `server/src/migrations/run.ts`
// (wired into `npm run setup` / a standalone `npm run migrate`), tracked in a
// `SequelizeMigrationsMeta` table so it only ever applies once.
//
// Expand/contract, split into three idempotent phases (each independently
// safe to re-run and to run as its own step). `up()` runs all three in
// sequence for convenience on this disposable dev DB; on a live/production
// table these three phases would ship as three separate deploys per
// postgres-safety doctrine (nullable add -> batched backfill -> enforce
// NOT NULL/unique), with the backfill batched via `WHERE id IN (batch)`
// loops instead of one statement. Not required here: this is a small,
// disposable dev table (no production traffic on this schema yet).
import { QueryInterface, DataTypes } from 'sequelize';

const TABLE = 'Orders';
const COLUMN = 'orderNumber';
const UNIQUE_INDEX = 'orders_order_number_unique';

export const name = '20260922000001-add-order-number';

// Phase 1 (expand): add the column nullable. No table rewrite risk beyond
// the metadata change since there's no volatile default.
export async function expand(queryInterface: QueryInterface): Promise<void> {
  const table = await queryInterface.describeTable(TABLE);
  if (!table[COLUMN]) {
    await queryInterface.addColumn(TABLE, COLUMN, {
      type: DataTypes.STRING(24),
      allowNull: true,
    });
  }
}

// Phase 2 (backfill): assign a sequential, human-readable order number to
// any row missing one. Idempotent -- only touches NULL rows, safe to re-run.
export async function backfill(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.sequelize.query(`
    WITH numbered AS (
      SELECT id, "createdAt",
             ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, id ASC) AS rn
      FROM "${TABLE}"
      WHERE "${COLUMN}" IS NULL
    )
    UPDATE "${TABLE}" o
    SET "${COLUMN}" = 'ORD-' || TO_CHAR(numbered."createdAt", 'YYYYMMDD') || '-' || LPAD(numbered.rn::text, 6, '0')
    FROM numbered
    WHERE o.id = numbered.id;
  `);
}

// Phase 3 (contract): enforce NOT NULL + uniqueness now every row has a value.
export async function contract(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.changeColumn(TABLE, COLUMN, {
    type: DataTypes.STRING(24),
    allowNull: false,
  });

  const indexes = (await queryInterface.showIndex(TABLE).catch(() => [])) as any[];
  const hasUniqueIndex = Array.isArray(indexes) && indexes.some((idx: any) => idx.name === UNIQUE_INDEX);
  if (!hasUniqueIndex) {
    await queryInterface.addIndex(TABLE, {
      fields: [COLUMN],
      unique: true,
      name: UNIQUE_INDEX,
    });
  }
}

export async function up(queryInterface: QueryInterface): Promise<void> {
  await expand(queryInterface);
  await backfill(queryInterface);
  await contract(queryInterface);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  const indexes = (await queryInterface.showIndex(TABLE).catch(() => [])) as any[];
  if (Array.isArray(indexes) && indexes.some((idx: any) => idx.name === UNIQUE_INDEX)) {
    await queryInterface.removeIndex(TABLE, UNIQUE_INDEX);
  }
  const table = await queryInterface.describeTable(TABLE);
  if (table[COLUMN]) {
    await queryInterface.removeColumn(TABLE, COLUMN);
  }
}
