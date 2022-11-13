import { Handler } from "@netlify/functions";
import { decodeAllSync } from "cbor";
import { utils, BigNumber } from "ethers";
import { OracleABI__factory } from "../contracts";
import Moralis from "moralis";
import { IWebhook } from "@moralisweb3/streams-typings";
import fetch from "node-fetch";
const handler: Handler = async (event, context) => {
  const { "x-signature": xSignature } = event.headers;
  const { body } = event;
  //check the signatures
  const parsed = body && (JSON.parse(body) as IWebhook);
  if (xSignature) {
    const apiKey = process.env.MORALIS_API_KEY;
    Moralis.start({ apiKey });
    if (parsed && apiKey) {
      if (
        !Moralis.Streams.verifySignature({
          body: parsed,
          signature: xSignature,
        })
      ) {
        console.error("Bad Signature: ", body, apiKey, xSignature);
        return { statusCode: 400, body: "Bad Signature" };
      }
    }
  }
  if (!parsed) return { statusCode: 400, body: "Bad Request" };
  console.log("Parsed is ", JSON.stringify(parsed, null, 2));
  const { chainId, confirmed, logs } = parsed;
  if (parsed.logs && parsed.logs?.length > 0) {
    const { data, address: oracleAddress, topic1: rawJobId } = logs[0];
    if (data) {
      const jobId = Buffer.from(rawJobId.slice(2), "hex").toString("utf8");
      const iface = new utils.Interface(OracleABI__factory.abi);
      const logData = iface.decodeEventLog("OracleRequest", data);
      const { data: dataData } = logData;
      const dataBuf = Buffer.from(dataData.slice(2), "hex");
      const decoded = decodeAllSync(dataBuf);
      let key: string | undefined;
      const decodedObj: Record<string, any> = {};
      for (let x = 0; x < decoded.length; x++) {
        if (key) {
          decodedObj[key] =
            typeof decoded[x] == "bigint"
              ? "0x" + (decoded[x] as BigInt).toString(16)
              : decoded[x];
          key = undefined;
        } else {
          key = decoded[x];
        }
      }
      const webHookObj = {
        requester: logData.requester,
        requestId: logData.requestId,
        payment: (logData.payment as BigNumber).toHexString(),
        callbackAddr: logData.callbackAddr,
        callbackFunctionId: logData.callbackFunctionId,
        cancelExpiration: (logData.cancelExpiration as BigNumber).toHexString(),
        dataVersion: logData.dataVersion.toHexString(),
        decodedData: decodedObj,
        rawData: dataData,
        oracleAddress,
        chainId,
        confirmed,
        jobId,
      };
      const targetUrl =
        "https://xw8v-tcfi-85ay.n7.xano.io/api:58vCnoV0/requests";
      console.log("Sending to ", targetUrl);
      const body = JSON.stringify(webHookObj);
      console.log("Body is ", body);
      const response = await fetch(targetUrl, {
        body,
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response is ", response.status, response.statusText);
      await new Promise<void>((r) => {
        setTimeout(() => {
          r();
        }, 1000);
      });
      console.log("All Done!!!!");
    }
  }
  return {
    statusCode: 200,
    body: "Booyah",
  };
};
export { handler };
