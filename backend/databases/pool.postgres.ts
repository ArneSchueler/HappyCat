// pool.postgres.ts
import "dotenv/config";
import { Pool } from "pg";

let pool: Pool | null = null; // Singelton

export function getPostgresPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.HAPPYCAT_DB_HOST,
      port: Number(process.env.HAPPYCAT_DB_PORT),
      user: process.env.HAPPYCAT_DB_USER,
      password: process.env.HAPPYCAT_DB_PASSWORD,
      database: process.env.HAPPYCAT_DB_NAME,

      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected PG pool error", err);
      process.exit(1);
    });
  }

  return pool;
}
