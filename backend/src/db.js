import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error', err);
  process.exit(-1);
});

export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('query', { text: text.substring(0, 80), duration, rows: result.rowCount });
  return result;
}

export async function getClient() {
  return pool.connect();
}

export default pool;
