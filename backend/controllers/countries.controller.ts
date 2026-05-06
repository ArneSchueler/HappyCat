import type { Request, Response, NextFunction } from "express";

import {
  getCountryTrend,
  getYearlyRankings,
} from "../services/countries.services.ts";

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
export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("!!! History Controller erreicht !!!"); // Erscheint das im Terminal?
  try {
    const name = String(req.params.name);

    console.log("Anfrage für Land:", name); // Hilft beim Debuggen im Terminal

    console.log("Router geladen");
    if (!name) {
      return res.status(400).json({ error: "BLändername fehlt" });
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
