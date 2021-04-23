import * as crypto from "crypto";
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-waffle";
import {ethers, waffle} from 'hardhat';

// generate random construction permit ids
var cPIds = [] as string[];
const getRandomDigit = () => Math.floor(Math.random() * 10)
const gerRandomLetter = () => String.fromCharCode(65+Math.floor(Math.random() * 26))
for(var i = 0; i < 1000; i++) {
  cPIds.push(`${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${gerRandomLetter()}`)
}

// generate random file hashes
var fileHashes = [] as string[];
const getRandomSHA256 = () => crypto.randomBytes(32).toString('hex');
for(var i = 0; i < 1000; i++) {
  fileHashes.push("0x" + getRandomSHA256());
}

(async() => {
  const ImmirisNotary = await ethers.getContractFactory("ImmirisNotary");
  console.log("Deploying Immiris Notary contract...");
  const notary = await ImmirisNotary.deploy();
  await notary.deployed();
  console.log("Immiris Notary deployed to:", notary.address);

  console.log("Evaluating gas usage...");
  var tx = await notary.createCertificate(cPIds[0],fileHashes[0]);
  console.log("first certificate ever", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());

  tx = await notary.createCertificate(cPIds[1],fileHashes[1]);
  console.log("first cp, first cert", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());

  tx = await notary.createCertificate(cPIds[1],fileHashes[2]);
  console.log("first cp, second cert", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());

  tx = await notary.createCertificate(cPIds[1],fileHashes[3]);
  console.log("first cp, third cert", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());

  tx = await notary.createCertificate(cPIds[1],fileHashes[4]);
  console.log("first cp, fourth cert", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());

  tx = await notary.createCertificate(cPIds[2],fileHashes[5]);
  console.log("second cp, first cert", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());

  tx = await notary.createCertificate(cPIds[3],fileHashes[6]);
  console.log("third cp, first cert", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());

  tx = await notary.createCertificate(cPIds[4],fileHashes[7]);
  console.log("fourth cp, first cert", (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed.toNumber());
})();
