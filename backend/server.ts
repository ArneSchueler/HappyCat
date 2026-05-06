import express from "express";
import { countrieRouter } from "./routes/countries.routes.ts";

const PORT = 3001;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello Happy Cat!");
});

app.use("/countries", countrieRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
