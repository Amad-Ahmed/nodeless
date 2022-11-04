import { ethers } from "hardhat";
// require("@nomiclabs/hardhat-waffle");
// const hre = require("hardhat");

async function main() {
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy("0x326C977E6efc84E512bB9C30f76E30c160eD06FB");

  await oracle.deployed();

  console.log(`Oracle deployed to ${oracle.address}`);

  // const LinkToken = await 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
