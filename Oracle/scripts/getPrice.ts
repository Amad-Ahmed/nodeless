import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");
// import {request}

async function main() {

    const Request = await ethers.getContractFactory("Request");
    const request = await Request.attach("0x757822fBc77401E8D16bdC18E0D59327935De38f");

    const result = await request.getPriceandBlock("AMZN");
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
