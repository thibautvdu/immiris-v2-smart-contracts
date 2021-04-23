import * as crypto from "crypto";
import {expect} from 'chai';
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-waffle";
import {ethers, waffle} from 'hardhat';
import type {ImmirisNotary} from '../types/ethers-contracts';
import {ImmirisNotary__factory} from '../types/ethers-contracts';

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
  let factory: ImmirisNotary__factory;
  let notary: ImmirisNotary;

  before(async () => {
    const [owner] = await ethers.getSigners();
    factory = new ImmirisNotary__factory(owner);
  });

  beforeEach(async () => {
    notary = await factory.deploy();
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

    it('Creating a new certificate should emit an event with the cp id and hash', async () => {
      const [owner, other] = await ethers.getSigners();

      await expect(notary.createCertificate(cPIds[0],fileHashes[0])).to.emit(notary, "CreatedCertificate").withArgs(cPIds[0], fileHashes[0], owner.address);
    });

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

    it('Certificate gas creation should be roughly constant', async () => {
      var tx = await notary.createCertificate(cPIds[0],fileHashes[0]);
      tx = await notary.createCertificate(cPIds[1],fileHashes[1]);
      const gas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed;

      for(var i = 2; i < 50; i++) {
        tx = await notary.createCertificate(cPIds[i%10],fileHashes[i]);
        let txGas = (await waffle.provider.getTransactionReceipt(tx.hash)).gasUsed
        expect(txGas.toNumber()).to.be.closeTo(gas.toNumber(),20000);
      }
    });
  });

  describe('Reading certificates', () => {
    it('Others can read a certificate data given a file hash', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.createCertificate(cPIds[0],fileHashes[0]);

      await expect(notary.connect(other).getCertificate(fileHashes[0])).to.not.be.reverted;
    });

    it('Certificate\'s timestamp matches tranasaction\'s block\'s timestamp', async () => {
      const [owner, other] = await ethers.getSigners();

      for(var i = 0; i < 10; i++) {
        var creationTx = await notary.createCertificate(cPIds[i],fileHashes[i]);
        var certificate = await notary.connect(other).getCertificate(fileHashes[i]);

        expect((await waffle.provider.getBlock(creationTx.blockNumber)).timestamp).to.equal(certificate.timestamp);
      }
    });

    it('Certificate\'s cp id matches previous input', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.createCertificate(cPIds[0],fileHashes[0]);
      var certificate = await notary.connect(other).getCertificate(fileHashes[0]);

      expect(certificate.constructionPermitId).to.equal(cPIds[0]);
    });

    it('Event\'s block number matches tranasaction\'s block number', async () => {
      const [owner, other] = await ethers.getSigners();

      for(var i = 0; i < 10; i++) {
        var creationTx = await notary.createCertificate(cPIds[i],fileHashes[i]);
        var certificate = await notary.connect(other).getCertificate(fileHashes[i]);

        const filter = notary.filters.CreatedCertificate(null,fileHashes[i],null);
        const event = (await notary.queryFilter(filter))[0];

        expect(event.blockNumber).to.equal(creationTx.blockNumber);
      }
    });

    it('Event\'s issuer address matches contract owner address', async () => {
      const [owner, other] = await ethers.getSigners();

      await notary.createCertificate(cPIds[0],fileHashes[0]);
      var certificate = await notary.connect(other).getCertificate(fileHashes[0]);

      const filter = notary.filters.CreatedCertificate(null,fileHashes[0],null);
      const event = (await notary.queryFilter(filter))[0];

      expect(event.args.issuer).to.equal(owner.address);

      await notary.transferOwnership(other.address);

      await notary.connect(other).createCertificate(cPIds[1],fileHashes[1]);
      var certificate2 = await notary.getCertificate(fileHashes[1]);

      const filter2 = notary.filters.CreatedCertificate(null,fileHashes[1],null);
      const event2 = (await notary.queryFilter(filter2))[0];

      expect(event2.args.issuer).to.equal(other.address);
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

      const filter = notary.filters.CreatedCertificate(cPIds[100],null,null);
      const events = await notary.queryFilter(filter);

      var hashes = events.map(e => e.args.statementFileHash);
      expect(hashesTofind.every(h => hashes.includes(h))).to.be.true;
      expect(hashes.every(h => hashesTofind.includes(h))).to.be.true;
    });

    it('Requesting a certificate with a non-recorded hash should fail', async () => {
        await notary.createCertificate(cPIds[0],fileHashes[0]);
        await expect(notary.getCertificate(fileHashes[1])).to.be.revertedWith("IMMIRIS: no certificate exists for this hash");
    });
  });
});
