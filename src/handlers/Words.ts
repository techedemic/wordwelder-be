import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

export const wordSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
    },
    word: {
      type: "string",
    },
    wordType: {
      type: "string",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
  },
};

/**
 * @openapi
 * /words/{wordType}:
 *   get:
 *     summary: Fetches words of a specific type
 *     parameters:
 *       - in: path
 *         name: wordType
 *         schema:
 *           type: string
 *           enum: [noun, verb, adjective, adverb, pronoun, preposition, conjunction, determiner, exclamation]
 *         required: false
 *         description: The type of the word
 *     responses:
 *       200:
 *         description: A list of words
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Word'
 */

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
