import pg from 'pg';
import './env.ts'; // 👈 ensures env is loaded even if imported alone

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({
  connectionString,
});

export default pool;