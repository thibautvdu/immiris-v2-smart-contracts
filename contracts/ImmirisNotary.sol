// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImmirisNotary is Ownable {
  //event CreatedCertificate(string constructionPermitId, bytes32 hash);

  struct Certificate {
    string constructionPermitId;
    uint timestamp;
    uint blockNumber;
    address writerAddress;
  }

  mapping (bytes32 => Certificate) private certificates;
  bytes32[] public certificateHashes;

  mapping (string => bytes32[]) private constructionPermits;

  function createCertificate(string calldata constructionPermitId, bytes32 hash) public onlyOwner {
      require(certificates[hash].writerAddress == address(0), "IMMIRIS: certificate already exists for this hash");

      certificates[hash].blockNumber = block.number;
      certificates[hash].timestamp = block.timestamp;
      certificates[hash].writerAddress = msg.sender;
      certificates[hash].constructionPermitId = constructionPermitId;

      certificateHashes.push(hash);
      constructionPermits[constructionPermitId].push(hash);
  }

  function getCertificate(bytes32 hash) public view returns (Certificate memory) {
    require(certificates[hash].writerAddress != address(0), "IMMIRIS: no certificate exists for this hash");

    return certificates[hash];
  }


  function getHashesByConstructionPermit(string calldata constructionPermitId) public view returns (bytes32[] memory) {
    return constructionPermits[constructionPermitId];
  }
}
