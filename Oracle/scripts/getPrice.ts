import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");
// import {request}

async function main() {

    const Request = await ethers.getContractFactory("Request");
    const request = await Request.attach("0x01a108E114D58Ecf7C086ab2D382884946cd35d0");

    const result = await request.getPriceandBlock("BBBY");
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
