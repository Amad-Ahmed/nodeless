import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import { parseRequestBody } from "@nodelesslink/core";
const handler: Handler = async (event, context) => {
  const parsed = parseRequestBody(event.body);
  if (!parsed) return { statusCode: 400, body: "Bad Request" };
  console.log("Webhook object is ", parsed);
  const symbol: string = parsed.decodedData.string_1;
  const polygonKey = process.env.POLYGON_KEY;
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${polygonKey}`;
  const response = await fetch(url, {
    headers: { Authentication: `Bearer ${polygonKey}` },
  });
  const json = (await response.json()) as { results: { c: number }[] };
  const lastPrice = Math.floor((json.results.pop()?.c || 0) * 100);
  return { statusCode: 200, body: lastPrice.toString() };
};
export { handler };
