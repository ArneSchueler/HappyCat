import express from "express";

const PORT = 3001;
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello Happy Cat!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
