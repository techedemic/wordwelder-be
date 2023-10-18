import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sentence = await prisma.sentence.create({
    data: {
      sentence: "Hello world",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
