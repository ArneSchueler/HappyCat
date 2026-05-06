import express from "express";
import {
  getRankings,
  getHistory,
} from "../controllers/countries.controller.js";

const countrieRouter = express.Router();

// Test-Route direkt hier (um den Router selbst zu prüfen)
countrieRouter.get("/ping", (req, res) => res.send("pong"));

// Haupt-Routen
countrieRouter.get("/rankings", getRankings);
countrieRouter.get("/:name/history", getHistory);

export default countrieRouter;
