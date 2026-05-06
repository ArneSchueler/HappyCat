import express from "express";

// Router für Countries definieren

const countrieRouter = express.Router();

// Endpoints definieren

// gets all countries
countrieRouter.get("/");

// get country history
countrieRouter.get("/:id/history");

// get countries to compare
countrieRouter.get("/compare?ids=finland,denmark");

export { countrieRouter };
