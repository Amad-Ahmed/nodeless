import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");

async function main() {
  const Request = await ethers.getContractFactory("Request");
  const request = await Request.deploy();

  await request.deployed();

  console.log(`Request deployed to ${request.address}`);

  // const LinkToken = await 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
