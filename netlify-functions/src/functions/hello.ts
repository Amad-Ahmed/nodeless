import { Handler } from "@netlify/functions";
import { decodeAllSync } from "cbor";
import {
  BigNumber,
  utils,
  Contract,
  ContractFactory,
  Wallet,
  providers,
} from "ethers";
import { isBytesLike } from "ethers/lib/utils";
import fetch from "node-fetch";
import { OracleABI__factory } from "../contracts";
const abi = [
  {
    inputs: [{ internalType: "address", name: "_link", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
    ],
    name: "CancelOracleRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "specId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "callbackAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "callbackFunctionId",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cancelExpiration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dataVersion",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "OracleRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "EXPIRY_TIME",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_requestId", type: "bytes32" },
      { internalType: "uint256", name: "_payment", type: "uint256" },
      { internalType: "bytes4", name: "_callbackFunc", type: "bytes4" },
      { internalType: "uint256", name: "_expiration", type: "uint256" },
    ],
    name: "cancelOracleRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_requestId", type: "bytes32" },
      { internalType: "uint256", name: "_payment", type: "uint256" },
      {
        internalType: "address",
        name: "_callbackAddress",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "_callbackFunctionId",
        type: "bytes4",
      },
      { internalType: "uint256", name: "_expiration", type: "uint256" },
      { internalType: "bytes32", name: "_data", type: "bytes32" },
    ],
    name: "fulfillOracleRequest",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_node", type: "address" }],
    name: "getAuthorizationStatus",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainlinkToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isOwner",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_sender", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "onTokenTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_sender", type: "address" },
      { internalType: "uint256", name: "_payment", type: "uint256" },
      { internalType: "bytes32", name: "_specId", type: "bytes32" },
      {
        internalType: "address",
        name: "_callbackAddress",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "_callbackFunctionId",
        type: "bytes4",
      },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
      { internalType: "uint256", name: "_dataVersion", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "oracleRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_node", type: "address" },
      { internalType: "bool", name: "_allowed", type: "bool" },
    ],
    name: "setFulfillmentPermission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawable",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const handler: Handler = async (event, context) => {
  // your server-side functionality
  //console.log("environment variables", process.env);
  const parsed = event.body && JSON.parse(event.body);
  console.log("I got a first request, how about that!!!!");
  console.log("Parsed is ", JSON.stringify(parsed));
  const { data } = parsed.logs[0];
  //console.log("My data is ", data);
  const iface = new utils.Interface(abi);
  const logData = iface.decodeEventLog("OracleRequest", data);
  //console.log("My log data is ", logData);
  const { data: dataData } = logData;
  const dataBuf = Buffer.from(dataData.slice(2), "hex");
  const decoded = decodeAllSync(dataBuf);
  //turn decoded into an object
  let key: string | undefined;
  const decodedObj: Record<string, any> = {};
  for (let x = 0; x < decoded.length; x++) {
    if (key) {
      decodedObj[key] = decoded[x];
      key = undefined;
    } else {
      key = decoded[x];
    }
  }
  //console.log({ decodedObj });
  //Compile this into a shape
  //requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, expiration, dataVersion, decodedData
  const webHookObj = {
    requester: logData.requester,
    requestId: logData.requestId,
    payment: logData.payment,
    callbackAddr: logData.callbackAddr,
    callbackFunctionId: logData.callbackFunctionId,
    cancelExpiration: logData.cancelExpiration,
    expiration: logData.expiration,
    dataVersion: logData.dataVersion,
    decodedData: decodedObj,
    rawData: dataData,
  };
  console.log("Webhook object is ", webHookObj);
  //Run the code to manage the shape

  //Do things based on the webhook object.
  //Like, make a request to get the current price of the symbol
  const symbol: string = webHookObj.decodedData.string_1;
  const polygonKey = "kTQbYuAtj_P5xdAuDhzRtAfirmuRm8br";
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2022-10-15/2022-10-29?apiKey=${polygonKey}`;
  const response = await fetch(url, {
    headers: { Authentication: `Bearer ${polygonKey}` },
  });
  const json = (await response.json()) as { results: { c: number }[] };
  console.log("My json is ", json, url);
  const lastPrice = Math.floor((json.results.pop()?.c || 0) * 100);
  console.log("My last price is ", lastPrice);

  //Return the data to chain
  //Set up provider on that chain
  /*
  const uri = "";
  const privateKey = "";
  const provider = new providers.JsonRpcProvider(uri);
  const signer = new Wallet(privateKey, provider);
  //Connect to a oracle contract
  const oracle = OracleABI__factory.connect(webHookObj.callbackAddr, signer);
  oracle.fulfillOracleRequest()
  // const Oracle = new Contract(webHookObj.callbackAddr, abi, signer);
  // //Send to fulfillOracleRequest
  // const rcpt =  await Oracle.fulfillOracleRequest(...args)
  await rcpt.wait();
/**/
  return {
    statusCode: 200,
    body: "Booyah",
  };
};
export { handler };
