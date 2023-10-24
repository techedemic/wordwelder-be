import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3100;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("/words/:wordType?", async (req: Request, res: Response) => {
  const wordType = req.params.wordType;
  const wordTypeSchema = z.enum([
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "determiner",
    "exclamation",
  ]);

  // Validate the wordType parameter with Zod
  if (wordType && !wordTypeSchema.safeParse(wordType).success) {
    res.status(400).send(`Invalid word type: '${wordType}'`);
    return;
  }

  const words = wordType
    ? await prisma.word.findMany({ where: { word_type: wordType } })
    : await prisma.word.findMany();

  res.json(words);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
