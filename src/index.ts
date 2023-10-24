import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3100;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("/words", async (req: Request, res: Response) => {
  const words = await prisma.word.findMany();
  res.json(words);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
