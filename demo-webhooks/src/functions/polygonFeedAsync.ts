import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import { parseRequestBody, sendResult } from "@nodelesslink/core";
const handler: Handler = async (event, context) => {
  const parsed = parseRequestBody(event.body);
  if (!parsed) return { statusCode: 400, body: "Bad Request" };
  console.log("Webhook object is ", parsed);
  const symbol: string = parsed.decodedData.string_1;
  const polygonKey = "kTQbYuAtj_P5xdAuDhzRtAfirmuRm8br";
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${polygonKey}`;
  const response = await fetch(url);

  if (parsed.jobId == "volume") {
    const json = (await response.json()) as { results: { v: number }[] };
    console.log("My json is ", json, url);
    const volume = json.results.reduce((acc, cur) => acc + cur.v, 0);
    console.log("My volume is ", volume);
    await sendResult(volume, { id: parsed.id, key: parsed.key });
    return { statusCode: 200 };
  } else {
    // const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${polygonKey}`;
    // const response = await fetch(url, {
    //   headers: { Authentication: `Bearer ${polygonKey}` },
    // });
    const json = (await response.json()) as { results: { c: number }[] };
    const lastPrice = Math.floor((json.results.pop()?.c || 0) * 100);
    // await new Promise((r) => setTimeout(r, 20000));
    await sendResult(lastPrice, parsed);
    return { statusCode: 200 };
  }
};
export { handler };

/*
Emitter -> Xano
Xano saves the request payload to db and sends to polygonFeed, marking request as in process
Polygonfeed replies with the answer. 
Xano sends the data to the remitter, who sends it to the proper oracle using the right account. 
*/
