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

  const words = await prisma.word.findMany({
    where: wordType ? { word_type: wordType } : undefined,
  });

  res.json(words);
});

app.post("/sentence", express.json(), async (req: Request, res: Response) => {
  const sentence = req.body;
  const sentenceSchema = z.array(z.number());

  // Validate the input with Zod
  const validationResult = sentenceSchema.safeParse(sentence);
  if (!validationResult.success) {
    res.status(400).send("Invalid input");
    return;
  }

  // If validation is successful, ensure that all the word id's exist in the database
  const validSentence = validationResult.data;
  const allWords = await prisma.word.findMany({
    where: {
      id: {
        in: validSentence,
      },
    },
  });

  if (validSentence.length !== allWords.length) {
    res.status(400).send("Some word IDs do not exist");
    return;
  }

  const createdSentence = await prisma.sentence.create({
    data: {}, //Simply an empty record with an id only. We use a linking table.
  });

  // Link the words to the sentence
  const words = [];
  for (const wordId of validSentence) {
    await prisma.sentenceWord.create({
      data: {
        sentenceId: createdSentence.id,
        wordId: wordId,
      },
    });
    const word = await prisma.word.findUnique({ where: { id: wordId } });
    words.push(word?.word);
  }

  res.status(201).json({
    id: createdSentence.id,
    createdAt: createdSentence.createdAt,
    updatedAt: createdSentence.updatedAt,
    words: words,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
