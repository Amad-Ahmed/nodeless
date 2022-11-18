import fetch from "node-fetch";
/*
Note: Add @nodelesslink/core to your project via
  `yarn add @nodelesslink/core` or 
  `npm install @nodelesslink/core`
*/
import { sendResult } from "@nodelesslink/core";
const handler = async (event, context) => {
  const parsed = JSON.parse(event.body);
  if (!parsed) return { statusCode: 400, body: "Bad Request" };
  if(parsed.jobId.toLowerCase() !== "{{{jobId}}}".toLowerCase()) return { statusCode: 400, body: "Bad Request" };
 
  const { {{{decodedKeys}}} } = decodedData;
  let returnValue;    
  /**
     * This is where you put in your code to retrieve your value
     * Confirm the returnvalue got set
     * 
     * Sample: 
        const polygonKey = "MYPOLYGONKEY";
        const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${polygonKey}`;
        const response = await fetch(url, {
            headers: { Authentication: `Bearer ${polygonKey}` },
        });
        const json = (await response.json()) as { results: { c: number }[] };
        const returnValue = Math.floor((json.results.pop()?.c || 0) * 100);
    */
    await sendResult(returnValue, parsed);
    return { statusCode: 200 };
};
export { handler };
