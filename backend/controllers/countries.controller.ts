import type { Request, Response, NextFunction } from "express";

import {
  getCountryTrend,
  getYearlyRankings,
} from "../services/countries.services.js";

export async function getRankings(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const year = Number(req.query.year);
    if (!year) {
      return res
        .status(400)
        .json({ error: "Bitte gib ein Jahr an (z.B. ?year=2019)" });
    }
    const rankings = await getYearlyRankings(year);
    res.json(rankings);
  } catch (err) {
    next(err);
  }
}
export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const name = String(req.params.name);

    if (!name) {
      return res.status(400).json({ error: "Ländername fehlt" });
    }
    const history = await getCountryTrend(name);

    if (history.length === 0) {
      return res
        .status(404)
        .json({ message: "Keine Daten für dieses Land gefunden" });
    }

    res.json(history);
  } catch (err) {
    next(err);
  }
}
