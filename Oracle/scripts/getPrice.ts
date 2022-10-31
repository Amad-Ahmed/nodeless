import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");
// import {request}

async function main() {

    const Request = await ethers.getContractFactory("Request");
    const request = await Request.attach("0x9bb18d9347cB7525787E0488F630dE93376D6e37");

    const result = await request.getPriceandBlock("TSLA");
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
