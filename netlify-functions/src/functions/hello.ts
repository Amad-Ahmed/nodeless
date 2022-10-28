import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
  // your server-side functionality

  const output = {
    event,
    body: event.body,
    parsed: event.body && JSON.parse(event.body),
  };
  console.log("I got a first request, how about that!!!!");
  return {
    statusCode: 200,
    body:
      "<html><body><pre>" +
      JSON.stringify(output, null, 2) +
      "</pre></body></html>",
  };
};
export { handler };
