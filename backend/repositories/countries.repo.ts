import { getPostgresPool } from "../databases/pool.postgres.js";

const pool = getPostgresPool();

export const getRankingsByYear = async (year: number) => {
  const res = await pool.query(
    `
    SELECT rank_in_year, country, happiness_score 
      FROM world_happiness 
      WHERE year = $1 
      ORDER BY rank_in_year ASC;
    `,
    [year],
  );
  return res.rows;
};
