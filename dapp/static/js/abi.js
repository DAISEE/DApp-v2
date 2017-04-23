var abiArray = [
  {
    "constant": false,
    "inputs": [],
    "name": "getEnergyConsumption",
    "outputs": [
      {
        "name": "energyBal",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinContractAddress",
        "type": "address"
      },
      {
        "name": "seller",
        "type": "address"
      },
      {
        "name": "energy",
        "type": "uint256"
      }
    ],
    "name": "buyEnergy",
    "outputs": [
      {
        "name": "transactionOK",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "energy",
        "type": "uint256"
      }
    ],
    "name": "consumeEnergy",
    "outputs": [
      {
        "name": "EnergyBal",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "coinContractAddress",
        "type": "address"
      },
      {
        "name": "energyBuyer",
        "type": "address"
      },
      {
        "name": "energySeller",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "sendCoin",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "energy",
        "type": "uint256"
      }
    ],
    "name": "setProduction",
    "outputs": [
      {
        "name": "EnergyBal",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getRate",
    "outputs": [
      {
        "name": "energyRate",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getEnergyBalance",
    "outputs": [
      {
        "name": "energyBal",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getEnergyProduction",
    "outputs": [
      {
        "name": "energyBal",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "energy",
        "type": "uint256"
      }
    ],
    "name": "Produce",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "energy",
        "type": "uint256"
      }
    ],
    "name": "Consume",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "energy",
        "type": "uint256"
      }
    ],
    "name": "Buy",
    "type": "event"
  }
]