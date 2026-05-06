import { getPostgresPool } from "../databases/pool.postgres.ts";

export async function getYearlyRankings(year: number) {
  const pool = getPostgresPool();
  const result = await pool.query(
    "SELECT * FROM world_happiness WHERE year = $1 ORDER BY rank_in_year ASC",
    [year],
  );
  return result.rows;
}

export async function getCountryTrend(name: string) {
  const pool = getPostgresPool();
  const result = await pool.query(
    "SELECT * FROM world_happiness WHERE country ILIKE $1 ORDER BY year ASC",
    [name],
  );
  return result.rows;
}
