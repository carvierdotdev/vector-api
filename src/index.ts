import { Index } from "@upstash/vector";
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

    const index = new Index({
      url: VECTOR_URL,
      token: VECTOR_TOKEN,
      cache: false, // <- This is just for Cloudflare Workers, it doesn't work with Cache header
    });

    const body = await c.req.json();
    let { message } = body as { message: string };

    if (!message) {
      return c.json(
        {
          error: "Message argument is required",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 1000) {
      return c.json(
        {
          error: "Message can only be at most 1000 characters.",
        },
        {
          status: 413,
        }
      );
    }
  } catch (error) {
    console.error(error);

    c.json(
      {
        errorMessage: "Oh oh there is an error",
        error: error,
      },
      {
        status: 500,
        statusText: "There is an error from our part",
      }
    );
  }
});

export default app;
