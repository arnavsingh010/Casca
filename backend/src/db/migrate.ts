import fs from 'node:fs';
import path from 'node:path';
import { pool } from './pool';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function migrate(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       name text PRIMARY KEY,
       applied_at timestamptz NOT NULL DEFAULT now()
     )`
  );
  const result = await pool.query('SELECT name FROM schema_migrations');
  const applied = new Set<string>(result.rows.map(r => r.name as string));

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    // Only the "up" part is run; anything after "-- Down Migration" is ignored.
    const sql = fs
      .readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8')
      .split('-- Down Migration')[0];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.info(`Applied ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
  console.info('Migrations up to date');
}

migrate()
  .then(() => pool.end())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
