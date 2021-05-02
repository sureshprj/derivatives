const address = "0x4A8Ecd73515c7D475f67977c9bC8f0afc6cEB1E1";
const ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_number",
        type: "uint256"
      }
    ],
    name: "bet",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "houseEdge",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        name: "_houseEdge",
        type: "uint256"
      }
    ],
    payable: true,
    stateMutability: "payable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "_status",
        type: "bool"
      },
      {
        indexed: false,
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "Won",
    type: "event"
  }
];

export { address, ABI };
