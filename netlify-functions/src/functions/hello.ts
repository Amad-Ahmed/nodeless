import { Handler } from "@netlify/functions";
import { decode } from "cbor";
const handler: Handler = async (event, context) => {
  // your server-side functionality
  const parsed = event.body && JSON.parse(event.body);
  const output = {
    event,
    body: event.body,
    parsed,
  };
  console.log("I got a first request, how about that!!!!");
  const { data } = parsed[0];
  console.log("My data is ", data);
  const parsedData = decode(data);
  console.log("My parsed data is ", parsedData);
  //  console.log(JSON.stringify(output, null, 2));
  return {
    statusCode: 200,
    body: "Booyah",
  };
};
export { handler };
