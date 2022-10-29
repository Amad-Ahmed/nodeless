import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// require("@nomiclabs/hardhat-waffle");
// require("dotenv").config();
import {config} from "dotenv";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
config();

const hh_config: HardhatUserConfig = {
  solidity: {compilers: [{version:"0.6.6"}, {version:"0.8.7"}]},
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygonMumbai: {
      url: process.env.ALCHEMY_MUMBAI || "",
      accounts: [process.env.PK || ""],
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGON_API || "",
    },
  }
};

export default hh_config;
