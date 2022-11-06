import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");
// import {request}

async function main() {

    const Request = await ethers.getContractFactory("Request");
    const request = await Request.attach("0x29c568c4256422B775b37D29651f1C65287E3962");

    const result = await request.getPriceandBlock("QQQ");
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
