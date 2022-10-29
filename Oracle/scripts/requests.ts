import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");
// import {request}

async function main() {

    const Request = await ethers.getContractFactory("Request");
    const request = await Request.attach("0xba318bC26d86E8f67f98eBC632aC88BB05275A73");
    const request_txn = await request.requestPrice("BTC/USD",11 , -1600000000, 10100001010101000n, ["this is a test", "array of strings"]);
    const request_txn_receipt = await request_txn.wait();
    console.log(`Request txn receipt: ${request_txn_receipt}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
