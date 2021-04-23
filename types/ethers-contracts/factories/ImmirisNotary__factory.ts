/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { ImmirisNotary } from "../ImmirisNotary";

export class ImmirisNotary__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ImmirisNotary> {
    return super.deploy(overrides || {}) as Promise<ImmirisNotary>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ImmirisNotary {
    return super.attach(address) as ImmirisNotary;
  }
  connect(signer: Signer): ImmirisNotary__factory {
    return super.connect(signer) as ImmirisNotary__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ImmirisNotary {
    return new Contract(address, _abi, signerOrProvider) as ImmirisNotary;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "constructionPermitId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "statementFileHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "issuer",
        type: "address",
      },
    ],
    name: "CreatedCertificate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "constructionPermitId",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "createCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "getCertificate",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "constructionPermitId",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct ImmirisNotary.Certificate",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "statementFileHashes",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060006100216100c460201b60201c565b9050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3506100cc565b600033905090565b610e37806100db6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063227a812814610067578063715018a6146100975780638da5cb5b146100a1578063eb537e91146100bf578063f2fde38b146100db578063f333fe08146100f7575b600080fd5b610081600480360381019061007c9190610906565b610127565b60405161008e9190610ab7565b60405180910390f35b61009f61014b565b005b6100a9610285565b6040516100b69190610a9c565b60405180910390f35b6100d960048036038101906100d491906108ae565b6102ae565b005b6100f560048036038101906100f0919061085c565b610442565b005b610111600480360381019061010c9190610885565b6105eb565b60405161011e9190610b52565b60405180910390f35b6002818154811061013757600080fd5b906000526020600020016000915090505481565b61015361070e565b73ffffffffffffffffffffffffffffffffffffffff16610171610285565b73ffffffffffffffffffffffffffffffffffffffff16146101c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101be90610b12565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6102b661070e565b73ffffffffffffffffffffffffffffffffffffffff166102d4610285565b73ffffffffffffffffffffffffffffffffffffffff161461032a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161032190610b12565b60405180910390fd5b6000600160008381526020019081526020016000206001015414610383576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161037a90610af2565b60405180910390fd5b82826001600084815260200190815260200160002060000191906103a8929190610716565b5042600160008381526020019081526020016000206001018190555060028190806001815401808255809150506001900390600052602060002001600090919091909150558083836040516103fe929190610a83565b60405180910390207ff88cd5b4454324728a36e6ed96a7adb9d0b59f111bba900f76531e5c34d2e58c336040516104359190610a9c565b60405180910390a3505050565b61044a61070e565b73ffffffffffffffffffffffffffffffffffffffff16610468610285565b73ffffffffffffffffffffffffffffffffffffffff16146104be576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b590610b12565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561052e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161052590610ad2565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6105f361079c565b60006001600084815260200190815260200160002060010154141561064d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064490610b32565b60405180910390fd5b6001600083815260200190815260200160002060405180604001604052908160008201805461067b90610c34565b80601f01602080910402602001604051908101604052809291908181526020018280546106a790610c34565b80156106f45780601f106106c9576101008083540402835291602001916106f4565b820191906000526020600020905b8154815290600101906020018083116106d757829003601f168201915b505050505081526020016001820154815250509050919050565b600033905090565b82805461072290610c34565b90600052602060002090601f016020900481019282610744576000855561078b565b82601f1061075d57803560ff191683800117855561078b565b8280016001018555821561078b579182015b8281111561078a57823582559160200191906001019061076f565b5b50905061079891906107b6565b5090565b604051806040016040528060608152602001600081525090565b5b808211156107cf5760008160009055506001016107b7565b5090565b6000813590506107e281610dbc565b92915050565b6000813590506107f781610dd3565b92915050565b60008083601f84011261080f57600080fd5b8235905067ffffffffffffffff81111561082857600080fd5b60208301915083600182028301111561084057600080fd5b9250929050565b60008135905061085681610dea565b92915050565b60006020828403121561086e57600080fd5b600061087c848285016107d3565b91505092915050565b60006020828403121561089757600080fd5b60006108a5848285016107e8565b91505092915050565b6000806000604084860312156108c357600080fd5b600084013567ffffffffffffffff8111156108dd57600080fd5b6108e9868287016107fd565b935093505060206108fc868287016107e8565b9150509250925092565b60006020828403121561091857600080fd5b600061092684828501610847565b91505092915050565b61093881610bac565b82525050565b61094781610bbe565b82525050565b60006109598385610ba1565b9350610966838584610bf2565b82840190509392505050565b600061097d82610b74565b6109878185610b7f565b9350610997818560208601610c01565b6109a081610c95565b840191505092915050565b60006109b8602683610b90565b91506109c382610ca6565b604082019050919050565b60006109db603183610b90565b91506109e682610cf5565b604082019050919050565b60006109fe602083610b90565b9150610a0982610d44565b602082019050919050565b6000610a21602c83610b90565b9150610a2c82610d6d565b604082019050919050565b60006040830160008301518482036000860152610a548282610972565b9150506020830151610a696020860182610a74565b508091505092915050565b610a7d81610be8565b82525050565b6000610a9082848661094d565b91508190509392505050565b6000602082019050610ab1600083018461092f565b92915050565b6000602082019050610acc600083018461093e565b92915050565b60006020820190508181036000830152610aeb816109ab565b9050919050565b60006020820190508181036000830152610b0b816109ce565b9050919050565b60006020820190508181036000830152610b2b816109f1565b9050919050565b60006020820190508181036000830152610b4b81610a14565b9050919050565b60006020820190508181036000830152610b6c8184610a37565b905092915050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000610bb782610bc8565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015610c1f578082015181840152602081019050610c04565b83811115610c2e576000848401525b50505050565b60006002820490506001821680610c4c57607f821691505b60208210811415610c6057610c5f610c66565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f494d4d495249533a20636572746966696361746520616c72656164792065786960008201527f73747320666f7220746869732068617368000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f494d4d495249533a206e6f20636572746966696361746520657869737473206660008201527f6f72207468697320686173680000000000000000000000000000000000000000602082015250565b610dc581610bac565b8114610dd057600080fd5b50565b610ddc81610bbe565b8114610de757600080fd5b50565b610df381610be8565b8114610dfe57600080fd5b5056fea2646970667358221220c231418b61145c6583e2bcd7a75da610b5cbe446174fcf2bb684dfba5c95dd7264736f6c63430008030033";