import * as crypto from "crypto";
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-waffle";
import {ethers, waffle} from 'hardhat';
import {expect} from 'chai';
import { Contract, ContractFactory } from '@ethersproject/contracts';

// Start test block
describe('ImmirisNotary', () => {
  let ImmirisNotary: ContractFactory;
  let notary: Contract;

  // generate random pc ids
  var pcIds = [] as string[];
  const getRandomDigit = () => Math.floor(Math.random() * 10)
  const gerRandomLetter = () => String.fromCharCode(65+Math.floor(Math.random() * 26))
  for(var i = 0; i < 1000; i++) {
    pcIds.push(`PC${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${gerRandomLetter()}`)
  }

  // generate random file hashes
  var fileHashes = [] as string[];
  const getRandomSHA256 = () => crypto.randomBytes(32).toString('hex');
  for(var i = 0; i < 1000; i++) {
    fileHashes.push("0x" + getRandomSHA256());
  }

  before(async () => {
    ImmirisNotary = await ethers.getContractFactory("ImmirisNotary");
  });

  beforeEach(async () => {
    notary = await ImmirisNotary.deploy();
    await notary.deployed();
  });

  describe('Ownership', () => {
    it('deployer is owner', async () => {
      const [owner, other] = await ethers.getSigners();

      expect(await notary.owner()).to.equal(owner.address);
    });

    it('owner can transfer ownership', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.transferOwnership(other.address);

      expect(await notary.owner()).to.equal(other.address);
    });

    it('non-owner can\'t transfer ownership', async () => {
      const [owner, other] = await ethers.getSigners();

      await expect(
        notary.connect(other).transferOwnership(other.address)
      ).to.be.reverted;

      expect(await notary.owner()).to.equal(owner.address);
    });

    it('anyone can see who is the owner', async () => {
      const [owner, other] = await ethers.getSigners();

      expect(await notary.connect(other).owner()).to.equal(owner.address);
    });

    it('ownership transfer emits an event', async () => {
      const [owner, other] = await ethers.getSigners();

      await expect(
        notary.transferOwnership(other.address)
      ).to.emit(notary, "OwnershipTransferred").withArgs(owner.address, other.address);

      expect(await notary.owner()).to.equal(other.address);
    });
  });

  describe('Writing certificates', () => {
    it('owner can create new certificates', async () => {
      for(var i = 0; i < 10; i++) {
        await expect(notary.createCertificate(pcIds[i],fileHashes[i])).to.not.be.reverted;
      }
    });

    it('emit event on new certificate', async () => {
      await expect(notary.createCertificate(pcIds[0],fileHashes[0])).to.emit(notary, "CreatedCertificate").withArgs(pcIds[0], fileHashes[0]);
    });

    it('owner can create new certificates after ownership transfer', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.transferOwnership(other.address);

      await expect(notary.connect(other).createCertificate(pcIds[0],fileHashes[0])).to.not.be.reverted;
    });

    it('non-owner can\'t create a new certificate', async () => {
      const [owner, other] = await ethers.getSigners();

      await expect(notary.connect(other).createCertificate(pcIds[0],fileHashes[0])).to.be.reverted;
    });

    it('creating a new certificate with a prev. recorded file hash must revert', async () => {
      await notary.createCertificate(pcIds[0],fileHashes[0]);

      await expect(notary.createCertificate(pcIds[0],fileHashes[0])).to.be.revertedWith("IMMIRIS: certificate already exists for this hash");
      await expect(notary.createCertificate(pcIds[1],fileHashes[0])).to.be.revertedWith("IMMIRIS: certificate already exists for this hash");
    });

    it('owner can create new certificate with the same prev. recorded PC ID but new hashes', async () => {
      for(var i = 0; i < 10; i++) {
        await expect(notary.createCertificate(pcIds[0],fileHashes[i])).to.not.be.reverted;
      }
    });
  });

  describe('Reading certificates', () => {
    it('anyone can read a certificate data given a file hash', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.createCertificate(pcIds[0],fileHashes[0]);

      await expect(notary.connect(other).getCertificate(fileHashes[0])).to.not.be.reverted;
    });

    it('return the previously stored certificate data given a file hash', async () => {
      const [owner, other] = await ethers.getSigners();

      for(var i = 0; i < 10; i++) {
        var creationTx = await notary.createCertificate(pcIds[i],fileHashes[i]);
        var certificate = await notary.connect(other).getCertificate(fileHashes[i]);

        expect(certificate.blockNumber).to.equal(creationTx.blockNumber);
        expect((await waffle.provider.getBlock(certificate.blockNumber.toHexString())).timestamp).to.equal(certificate.timestamp);
        expect(certificate.writerAddress).to.equal(owner.address);
      }
    });

    it('return the files hashes associated with the input PC ID', async () => {
      var hashesTofind = [];

      for(var i = 0; i < 50; i++) {
        await notary.createCertificate(pcIds[i],fileHashes[i]);
      }
      for(var i = 500; i < 510; i++) {
        await notary.createCertificate(pcIds[500],fileHashes[i]);
        hashesTofind.push(fileHashes[i]);
      }
      for(var i = 510; i < 550; i++) {
        await notary.createCertificate(pcIds[i],fileHashes[i]);
      }

      var hashes = await notary.getHashesByConstructionPermit(pcIds[500]);
      expect(hashesTofind.every(h => hashes.includes(h)) && hashes.every(h => hashesTofind.includes(h)));
    });

    it('requesting a certificate with a non-recorded hash should revert', async () => {
        await notary.createCertificate(pcIds[0],fileHashes[0]);
        await expect(notary.getCertificate(fileHashes[1])).to.be.revertedWith("IMMIRIS: no certificate exists for this hash");
    });
  });
});
