import type { Request, Response, NextFunction } from "express";

import { getYearlyRankings } from "../services/countries.services.ts";

export async function getRankings(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const year = Number(req.query.year);
    console.log("Router geladen");
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
