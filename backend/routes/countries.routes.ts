import express from "express";
import { getRankings } from "../controllers/countries.controller.js";

// Router für Countries definieren

const countrieRouter = express.Router();

// Endpoints definieren

// Endpoint: GET /api/countries/rankings?year=2019
countrieRouter.get("/rankings", getRankings);

export default countrieRouter;
