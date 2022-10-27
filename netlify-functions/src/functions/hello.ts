import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
  // your server-side functionality
  return { statusCode: 200, body: "Hello World" };
};
