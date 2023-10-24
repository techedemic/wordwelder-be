import express, { Request, Response } from "express";
import Sentence from "./handlers/Sentence";
import Words from "./handlers/Words";
import { z } from "zod";

const app = express();
const port = process.env.PORT || 3100;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.use(Words);
app.use(Sentence);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
