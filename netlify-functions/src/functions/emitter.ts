import { Handler } from "@netlify/functions";
import { decodeAllSync } from "cbor";
import { utils, BigNumber } from "ethers";
import { OracleABI__factory } from "../contracts";
import fetch from "node-fetch";
const handler: Handler = async (event, context) => {
  const parsed = event.body && JSON.parse(event.body);
  const { chainId } = parsed as { chainId: string };
  if (parsed.logs && parsed.logs?.length > 0) {
    const { data, address: oracleAddress } = parsed.logs[0] as {
      data: string;
      address: string;
    };
    if (data) {
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
        dataVersion: logData.dataVersion,
        decodedData: decodedObj,
        rawData: dataData,
        oracleAddress,
        chainId,
      };
      const targetUrl =
        "https://xw8v-tcfi-85ay.n7.xano.io/api:58vCnoV0/newrequest";
      const body = JSON.stringify(webHookObj);
      console.log("Body is ", body);
      fetch(targetUrl, {
        body,
        method: "POST",
      });
      await new Promise<void>((r) => {
        setTimeout(() => {
          r();
        }, 1000);
      });
    }
  }
  return {
    statusCode: 200,
    body: "Booyah",
  };
};
export { handler };
