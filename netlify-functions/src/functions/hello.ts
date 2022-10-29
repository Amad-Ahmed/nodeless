import { Handler } from "@netlify/functions";
import { decodeAllSync } from "cbor";
import { utils } from "ethers";

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
  const parsed = event.body && JSON.parse(event.body);
  const output = {
    event,
    body: event.body,
    parsed,
  };
  console.log("I got a first request, how about that!!!!");
  console.log("Parsed is ", parsed);
  const { data } = parsed.logs[0];
  console.log("My data is ", data);
  const iface = new utils.Interface(abi);
  const logData = iface.decodeEventLog("OracleRequest", data);
  console.log("My log data is ", logData);
  const { data: dataData } = logData;
  const dataBuf = Buffer.from(dataData.slice(2), "hex");
  const decoded = decodeAllSync(dataBuf);
  console.log({ decoded });
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
  console.log({ decodedObj });
  //Compile this into a shape

  //Run the code to manage the shape

  //Return the data to chain

  return {
    statusCode: 200,
    body: "Booyah",
  };
};
export { handler };
