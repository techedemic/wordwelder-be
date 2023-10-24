import express, { Request, Response } from "express";
import Sentence, { sentenceSchema } from "./handlers/Sentence";
import Words, { wordSchema } from "./handlers/Words";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WordWelder API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Sentence: sentenceSchema,
        Word: wordSchema,
      },
    },
  },
  apis: ["./src/handlers/*.ts"],
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();
const port = process.env.PORT || 3100;

// Swagger doc route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(Words);
app.use(Sentence);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
