import express from "express";
import cors from "cors";
import countrieRouter from "./routes/countries.routes.js";

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Standard-Ports für Vite
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.get("/", (req, res) => {
  res.status(200).send("Hello Happy Cat!");
});

app.use("/countries", countrieRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
