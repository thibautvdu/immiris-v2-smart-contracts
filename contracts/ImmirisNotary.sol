// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImmirisNotary is Ownable {
  event CreatedCertificate(string cPId, bytes32 hash);

  struct Certificate {
    uint timestamp;
    uint blockNumber;
    address writerAddress;
  }

  mapping (bytes32 => Certificate) private certificates;
  mapping (string => bytes32[]) private constuctionPermitToCertificates;

  function createCertificate(string calldata cPId, bytes32 hash) public onlyOwner {
      require(certificates[hash].writerAddress == address(0), "IMMIRIS: certificate already exists for this hash");

      Certificate memory newCertificate = Certificate(block.timestamp, block.number, msg.sender);
      certificates[hash] = newCertificate;
      constuctionPermitToCertificates[cPId].push(hash);

      emit CreatedCertificate(cPId, hash);
  }

  function getCertificate(bytes32 hash) public view returns (Certificate memory) {
    require(certificates[hash].writerAddress != address(0), "IMMIRIS: no certificate exists for this hash");
    return certificates[hash];
  }

  function getHashesByConstructionPermit(string calldata cPId) public view returns (bytes32[] memory) {
    return constuctionPermitToCertificates[cPId];
  }
}
