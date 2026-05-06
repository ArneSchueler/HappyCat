import {
  getCountryHistory,
  getRankingsByYear,
} from "../repositories/countries.repo.ts";

export async function getYearlyRankings(year: number) {
  if (year < 2005 || year > 2025) {
    throw new Error("Ungültiges Jahr angegeben.");
  }

  const rankings = await getRankingsByYear(year);
  return rankings;
}

export async function getCountryTrend(name: string) {
  if (!name) throw new Error("Ländername fehlt.");
  const history = await getCountryHistory(name);
  return history;
}
