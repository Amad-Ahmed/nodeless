import { Handler } from "@netlify/functions";
import { BigNumber, utils, Wallet, providers } from "ethers";
import fetch from "node-fetch";
import { OracleABI__factory } from "../contracts";
const handler: Handler = async (event, context) => {
  // your server-side functionality
  //console.log("environment variables", process.env);
  const parsed =
    event.body &&
    (JSON.parse(event.body) as {
      requester: string;
      requestId: string;
      payment: string; //Convert to bignumber
      callbackAddr: string;
      callbackFunctionId: string;
      cancelExpiration: string; //Convert ot bigNumber
      dataVersion: string;
      decodedData: Record<string, any>;
      rawData: string;
      oracleAddress: string;
      chainId: string;
    });
  if (!parsed) return { statusCode: 400, body: "Bad Request" };
  console.log("Webhook object is ", parsed);
  //Run the code to manage the shape

  //Do things based on the webhook object.
  //Like, make a request to get the current price of the symbol
  const symbol: string = parsed.decodedData.string_1;
  const polygonKey = "kTQbYuAtj_P5xdAuDhzRtAfirmuRm8br";
  const url = `https://api.polygon.io/v2/last/nbbo/${symbol}?apiKey=${polygonKey}`;
  //const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?apiKey=${polygonKey}`;
  const response = await fetch(url, {
    headers: { Authentication: `Bearer ${polygonKey}` },
  });
  const json = (await response.json()) as { results: { p: number } };
  console.log("My json is ", json, url);
  const lastPrice = Math.floor((json.results?.p || 0) * 100);
  console.log("My last price is ", lastPrice);
  console.log("I must tell the oracle at address", parsed.oracleAddress);
  console.log("On chain", parsed.chainId);
  //Return the data to chain
  //Set up provider on that chain
  const chains: Record<string, { uri: string; privateKey: string }> = {
    "0x13881": {
      uri: "https://polygon-mumbai.g.alchemy.com/v2/GtbvioX6lQQWHnSyvX3Lnj1y4uyxXNDt",
      privateKey:
        "f77ab59a543e322fc29c604aeb51f74bf7f3bb483dd53d3e274ac8521ac4f22e",
    },
  };
  const { uri, privateKey } = chains[parsed.chainId];
  const provider = new providers.JsonRpcProvider(uri);
  const signer = new Wallet(privateKey, provider);
  //Connect to a oracle contract
  const oracle = OracleABI__factory.connect(parsed.oracleAddress, signer);
  console.log("My payment is", parsed.payment);
  const hexlified = utils.hexlify(lastPrice);
  console.log("hexlified", hexlified);
  const hexPrice = utils.hexZeroPad(hexlified, 32);
  console.log("hexprice", hexPrice);
  const rcpt = await oracle.fulfillOracleRequest(
    parsed.requestId,
    BigNumber.from(parsed.payment),
    parsed.callbackAddr,
    parsed.callbackFunctionId,
    BigNumber.from(parsed.cancelExpiration),
    hexPrice,
    { gasLimit: 1000000 }
  );
  await rcpt.wait();

  return {
    statusCode: 200,
    body: "Booyah",
  };
};
export { handler };
