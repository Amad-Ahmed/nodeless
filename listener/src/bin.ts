#!/usr/bin/env node
import commander from "commander";
import fetch from "node-fetch";
import cbor from "cbor";
import { BigNumber, utils } from "ethers";

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
const topic0 =
  "0xd8d7ecc4800d25fa53ce0372f13a416d98907a7ef3d8d3bdd79cf4fe75529c65";

commander.parseAsync(process.argv).then(async (commander) => {
  const data = commander.args[0];
  // const url =
  //   "https://api.moralis-streams.com/streams/evm/a43aeab2-700c-47c2-a433-ca0a9eac3e19";
  // const options = {
  //   method: "POST",
  //   headers: {
  //     accept: "application/json",
  //     "content-type": "application/json",
  //     "x-api-key":
  //       "FC1ktV5Kc8upRrGe067BysgQ0gZUIFhyJ86pxSRJ0HXEaxzkY7mCYHTOjxgsgHON",
  //   },
  //   body: JSON.stringify({ abi, topic0 }),

  //decode with abi
  const iface = new utils.Interface(abi);
  const decodedLog = iface.decodeEventLog("OracleRequest", data);

  console.log("decoded shape address is ", decodedShape.callbackAddr);
  console.log("Decoded Log", decodedLog);
  const { data: dataData } = decodedLog;
  const dataBuf = Buffer.from(dataData.slice(2), "hex");
  const decoded = cbor.decodeAllSync(dataBuf);
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
  decodedObj.uint_4 = {
    type: "BigInt",
    data: (decodedObj.uint_4 as BigNumber).toHexString(),
  };
  console.log(JSON.stringify(decodedObj));
});

export { commander };
