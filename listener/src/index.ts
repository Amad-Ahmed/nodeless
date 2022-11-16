import fetch from "node-fetch";

const baseUrl = "https://xw8v-tcfi-85ay.n7.xano.io/api:58vCnoV0";

export function parseRequestBody(body: string | null | undefined) {
  const parsed =
    body &&
    (JSON.parse(body) as {
      id: number;
      key: string;
      decodedData: Record<string, any>;
      jobId: string;
    });

  if (!parsed) return undefined;
  return parsed;
}

export async function sendResult(
  data: any,
  { id, key }: { id: number; key: string }
) {
  fetch(`${baseUrl}/requests/${id}`, {
    method: "POST",
    body: JSON.stringify({
      key,
      data,
    }),
    headers: { "Content-Type": "application/json" },
  });
  await new Promise<void>((r) => {
    setTimeout(() => {
      r();
    }, 1000);
  });
}

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
      jobId: string;
    });
  if (!parsed) return undefined;
  return parsed;
}
