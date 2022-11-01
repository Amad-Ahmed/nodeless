import { Handler } from "@netlify/functions";
import { BigNumber, utils, Wallet, providers } from "ethers";
import { OracleABI__factory } from "../contracts";
import { parseWebhook } from "../functions";
const handler: Handler = async (event, context) => {
  // your server-side functionality
  //console.log("environment variables", process.env);
  const parsed = parseWebhook(event.body);
  if (!parsed) return { statusCode: 400, body: "Bad Request" };
  console.log("Webhook object is ", parsed);
  //Run the code to manage the shape

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
  const hexlified = utils.hexlify(parsed.data);
  console.log("hexlified", hexlified);
  const hexData = utils.hexZeroPad(hexlified, 32);
  console.log("hexprice", hexData);
  const rcpt = await oracle.fulfillOracleRequest(
    parsed.requestId,
    BigNumber.from(parsed.payment),
    parsed.callbackAddr,
    parsed.callbackFunctionId,
    BigNumber.from(parsed.cancelExpiration),
    hexData,
    { gasLimit: 1000000 }
  );
  await rcpt.wait();

  return {
    statusCode: 200,
    body: "Booyah",
  };
};
export { handler };
