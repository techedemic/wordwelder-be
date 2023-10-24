import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/words/:wordType?", async (req: Request, res: Response) => {
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

  const words = await prisma.word.findMany({
    where: wordType ? { word_type: wordType } : undefined,
  });

  res.json(words);
});

export default router;
