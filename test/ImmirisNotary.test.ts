import * as crypto from "crypto";
import {expect} from 'chai';
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-waffle";
import {ethers, waffle} from 'hardhat';
import { Contract, ContractFactory } from '@ethersproject/contracts';

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

// Start test block
describe('ImmirisNotary', () => {
  let ImmirisNotary: ContractFactory;
  let notary: Contract;

  before(async () => {
    ImmirisNotary = await ethers.getContractFactory("ImmirisNotary");
  });

  beforeEach(async () => {
    notary = await ImmirisNotary.deploy();
    await notary.deployed();
  });

  describe('Ownership', () => {
    it('Deployer should be owner', async () => {
      const [owner] = await ethers.getSigners();

      expect(await notary.owner()).to.equal(owner.address);
    });

    it('Owner can transfer ownership', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.transferOwnership(other.address);

      expect(await notary.owner()).to.equal(other.address);
    });

    it('Others can\'t transfer ownership', async () => {
      const [owner, other] = await ethers.getSigners();

      await expect(
        notary.connect(other).transferOwnership(other.address)
      ).to.be.reverted;

      expect(await notary.owner()).to.equal(owner.address);
    });

    it('Others can get the owner address', async () => {
      const [owner, other] = await ethers.getSigners();

      expect(await notary.connect(other).owner()).to.equal(owner.address);
    });

    it('Ownership transfer should emit an event', async () => {
      const [owner, other] = await ethers.getSigners();

      await expect(
        notary.transferOwnership(other.address)
      ).to.emit(notary, "OwnershipTransferred").withArgs(owner.address, other.address);

      expect(await notary.owner()).to.equal(other.address);
    });
  });

  describe('Writing certificates', () => {
    it('Owner can create new certificates', async () => {
      for(var i = 0; i < 10; i++) {
        await expect(notary.createCertificate(cPIds[i],fileHashes[i])).to.not.be.reverted;
      }
    });

    // it('Creating a new certiicate should emit an event with the cp id and hash', async () => {
    //   await expect(notary.createCertificate(cPIds[0],fileHashes[0])).to.emit(notary, "CreatedCertificate").withArgs(cPIds[0], fileHashes[0]);
    // });

    it('Owner can create new certificates after ownership transfer', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.transferOwnership(other.address);

      await expect(notary.connect(other).createCertificate(cPIds[0],fileHashes[0])).to.not.be.reverted;
    });

    it('Others can\'t create a new certificate', async () => {
      const [owner, other] = await ethers.getSigners();

      await expect(notary.connect(other).createCertificate(cPIds[0],fileHashes[0])).to.be.reverted;
    });

    it('Creating a new certificate with a previously recorded file hash should fail', async () => {
      await notary.createCertificate(cPIds[0],fileHashes[0]);

      await expect(notary.createCertificate(cPIds[0],fileHashes[0])).to.be.revertedWith("IMMIRIS: certificate already exists for this hash");
      await expect(notary.createCertificate(cPIds[1],fileHashes[0])).to.be.revertedWith("IMMIRIS: certificate already exists for this hash");
    });

    it('Owner can create new certificate with a previously recorded cp id and a new hash', async () => {
      for(var i = 0; i < 10; i++) {
        await expect(notary.createCertificate(cPIds[0],fileHashes[i])).to.not.be.reverted;
      }
    });

    // it('Certificate gas creation should be constant', async () => {
    //   var tx = await notary.createCertificate(cPIds[0],fileHashes[0]);
    //   var gas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed;
    //
    //   tx = await notary.createCertificate(cPIds[1],fileHashes[1]);
    //   gas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed;
    //   console.log("first hash gas",gas.toNumber());
    //
    //
    //   tx = await notary.createCertificate(cPIds[1],fileHashes[2]);
    //   gas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed;
    //   console.log("second hash gas",gas.toNumber());
    //
    //   tx = await notary.createCertificate(cPIds[1],fileHashes[3]);
    //   gas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed;
    //   console.log("third hash gas",gas.toNumber());
    //
    //   tx = await notary.createCertificate(cPIds[2],fileHashes[4]);
    //   gas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed;
    //   console.log("second pc gas",gas.toNumber());
    //
    //   tx = await notary.createCertificate(cPIds[3],fileHashes[5]);
    //   gas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed;
    //   console.log("third pc gas",gas.toNumber());
    //
    //   // for(var i = 2; i < 1000; i++) {
    //   //   tx = await notary.createCertificate(cPIds[i%10],fileHashes[i]);
    //   //   let txGas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed
    //   //   expect(txGas.toNumber()).to.be.closeTo(gas.toNumber(),20000);
    //   // }
    // });
  });

  describe('Reading certificates', () => {
    it('Others can read a certificate data given a file hash', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.createCertificate(cPIds[0],fileHashes[0]);

      await expect(notary.connect(other).getCertificate(fileHashes[0])).to.not.be.reverted;
    });

    it('Certificate\'s block number matches tranasaction\'s block number', async () => {
      const [owner, other] = await ethers.getSigners();

      for(var i = 0; i < 10; i++) {
        var creationTx = await notary.createCertificate(cPIds[i],fileHashes[i]);
        var certificate = await notary.connect(other).getCertificate(fileHashes[i]);

        expect(certificate.blockNumber).to.equal(creationTx.blockNumber);
      }
    });

    it('Certificate\'s timestamp matches tranasaction\'s block\'s timestamp', async () => {
      const [owner, other] = await ethers.getSigners();

      for(var i = 0; i < 10; i++) {
        var creationTx = await notary.createCertificate(cPIds[i],fileHashes[i]);
        var certificate = await notary.connect(other).getCertificate(fileHashes[i]);

        expect((await waffle.provider.getBlock(certificate.blockNumber.toHexString())).timestamp).to.equal(certificate.timestamp);
      }
    });

    it('Certificate\'s writer address matches contract owner address', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.createCertificate(cPIds[0],fileHashes[0]);
      var certificate = await notary.connect(other).getCertificate(fileHashes[0]);

      expect(certificate.writerAddress).to.equal(owner.address);

      await notary.transferOwnership(other.address);

      await notary.connect(other).createCertificate(cPIds[1],fileHashes[1]);
      var certificate2 = await notary.getCertificate(fileHashes[1]);

      expect(certificate2.writerAddress).to.equal(other.address);
    });

    it('Certificate\'s cp id matches previous input', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.createCertificate(cPIds[0],fileHashes[0]);
      var certificate = await notary.connect(other).getCertificate(fileHashes[0]);

      expect(certificate.constructionPermitId).to.equal(cPIds[0]);
    });

    it('Others can retrieve the associated certificate\'s file hashes given a cp id', async () => {
      var hashesTofind = [];

      for(var i = 0; i < 10; i++) {
        await notary.createCertificate(cPIds[i],fileHashes[i]);
      }
      for(var i = 100; i < 110; i++) {
        await notary.createCertificate(cPIds[100],fileHashes[i]);
        hashesTofind.push(fileHashes[i]);
      }
      for(var i = 510; i < 520; i++) {
        await notary.createCertificate(cPIds[i],fileHashes[i]);
      }

      var hashes = await notary.getHashesByConstructionPermit(cPIds[100]);
      expect(hashesTofind.every(h => hashes.includes(h))).to.be.true;
      expect(hashes.every(h => hashesTofind.includes(h))).to.be.true;
    });

    it('Requesting a certificate with a non-recorded hash should fail', async () => {
        await notary.createCertificate(cPIds[0],fileHashes[0]);
        await expect(notary.getCertificate(fileHashes[1])).to.be.revertedWith("IMMIRIS: no certificate exists for this hash");
    });
  });
});
