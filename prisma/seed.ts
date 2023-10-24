import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type WordType = {
  [K in
    | "noun"
    | "verb"
    | "adjective"
    | "adverb"
    | "pronoun"
    | "preposition"
    | "conjunction"
    | "determiner"
    | "exclamation"]: string[];
};

const wordTypes: WordType = {
  noun: ["dog", "cat", "tree", "car", "book" /*...*/],
  verb: ["run", "jump", "swim", "read", "write" /*...*/],
  adjective: ["happy", "sad", "big", "small", "fast" /*...*/],
  adverb: ["quickly", "slowly", "happily", "sadly", "loudly" /*...*/],
  pronoun: ["he", "she", "it", "we", "they" /*...*/],
  preposition: ["in", "on", "at", "from", "with" /*...*/],
  conjunction: ["and", "or", "but", "so", "yet" /*...*/],
  determiner: ["the", "a", "an", "this", "that" /*...*/],
  exclamation: ["ouch!", "wow!", "oops!", "ah!", "oh no!" /*...*/],
};

async function main() {
  for (const key of Object.keys(wordTypes)) {
    const wordTypeKey = key as keyof typeof wordTypes;
    console.log(`Adding ${wordTypes[wordTypeKey].length} ${wordTypeKey}'s`);
    for (let i = 0; i < wordTypes[wordTypeKey].length; i++) {
      await prisma.word.create({
        data: {
          word: wordTypes[wordTypeKey][i],
          word_type: wordTypeKey,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
