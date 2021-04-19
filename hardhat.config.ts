import { HardhatUserConfig } from "hardhat/types";
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-waffle";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.3", settings: {} }]
  },
};

export default config;
