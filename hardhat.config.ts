import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";

dotenvConfig({path: ".env"});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.3", settings: {} }]
  },
  networks: {
    hardhat: {},
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.ROPSTEN_PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
