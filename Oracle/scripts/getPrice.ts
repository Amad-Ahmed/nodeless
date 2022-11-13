import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");
// import {request}

async function main() {

    const Request = await ethers.getContractFactory("Request");
    const request = await Request.attach("0xCa9f888D7d4C54833aB5D430D1fa6eAdFF017840");

    const result = await request.getPriceandBlock("TSLA");
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
