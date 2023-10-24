import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

export const sentenceSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    words: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};

/**
 * @openapi
 * /sentences:
 *   get:
 *     summary: Fetches all sentences
 *     responses:
 *       200:
 *         description: A list of sentences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sentence'
 */

router.get("/sentences", async (req: Request, res: Response) => {
  try {
    // Fetch all sentences
    const sentences = await prisma.sentence.findMany();

    // Fetch the words for each sentence
    const sentencesWithWords = await Promise.all(
      sentences.map(async (sentence) => {
        const sentenceWords = await prisma.sentenceWord.findMany({
          where: { sentenceId: sentence.id },
          include: { word: true },
        });

        return {
          id: sentence.id,
          createdAt: sentence.createdAt,
          updatedAt: sentence.updatedAt,
          words: sentenceWords.map((sw) => sw.word.word),
        };
      })
    );

    res.status(200).json(sentencesWithWords);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request");
  }
});

/**
 * @openapi
 * /sentence:
 *   post:
 *     summary: Creates a new sentence with the provided word IDs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: number
 *               description: The IDs of the words to include in the sentence
 *     responses:
 *       201:
 *         description: The created sentence
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Sentence'
 */

router.post(
  "/sentence",
  express.json(),
  async (req: Request, res: Response) => {
    try {
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
      const words: string[] = [];
      for (const wordId of validSentence) {
        await prisma.sentenceWord.create({
          data: {
            sentenceId: createdSentence.id,
            wordId: wordId,
          },
        });
        const word = await prisma.word.findUnique({ where: { id: wordId } });
        if (word) words.push(word.word);
      }

      res.status(201).json({
        id: createdSentence.id,
        createdAt: createdSentence.createdAt,
        updatedAt: createdSentence.updatedAt,
        words: words,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request");
    }
  }
);

export default router;
