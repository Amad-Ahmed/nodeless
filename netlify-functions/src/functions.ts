import fetch from "node-fetch";

export function parseWebhook(body: string | null | undefined) {
  const parsed =
    body &&
    (JSON.parse(body) as {
      confirmed: boolean;
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
      data: any;
      private_key: string;
      providerUri: string;
    });
  if (!parsed) return undefined;
  return parsed;
}

const remitterUri =
  "https://rainbow-syrniki-b0e87c.netlify.app/.netlify/functions/remitter";

export async function remitToChain(
  data: any,
  originalBody: string | null | undefined
) {
  const parsed = parseWebhook(originalBody);
  if (!parsed) throw new Error("Body was not parsable");
  fetch(remitterUri, {
    body: JSON.stringify({ ...parsed, data }),
    method: "POST",
  });
  await new Promise<void>((r) => {
    setTimeout(() => {
      r();
    }, 1000);
  });
}
