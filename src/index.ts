import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
const app = new Hono();

type Environment = {
  VECTOR_URL: string;
  VECTOR_TOKEN: string;
};

app.use(cors());

app.post("/", async (c) => {
  if (c.req.header("Content-Type") !== "application/json") {
    return c.json(
      {
        error: "JSON body expected",
      },
      {
        status: 406,
      }
    );
  }

  try {
    const { VECTOR_TOKEN, VECTOR_URL } = env<Environment>(c);
  } catch (error) {
    console.error(error);

    c.json(
      {
        errorMessage: "Oh oh there is an error",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
});

export default app;
