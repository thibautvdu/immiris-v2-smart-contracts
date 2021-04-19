import '@nomiclabs/hardhat-ethers';
import {ethers} from 'hardhat';

(async() => {
  const ImmirisNotary = await ethers.getContractFactory("ImmirisNotary");
  console.log("Deploying Immiris Notary contract...");
  const notary = await ImmirisNotary.deploy();
  await notary.deployed();
  console.log("Immiris Notary deployed to:", notary.address);
})();
