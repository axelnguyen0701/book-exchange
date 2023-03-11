require("@nomicfoundation/hardhat-toolbox");
require("@graphprotocol/hardhat-graph")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            url: "http://0.0.0.0:8545"
          },
        hardhat: {
            chainId: 1337,
            allowUnlimitedContractSize: true, // defaults to false and 24KB contract size limit
        },
    },
    solidity: "0.8.17",
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
    },
    subgraph: {
        product: 'hosted-service',
        allowSimpleName: true,
        name: 'BookMarketplace',
        indexEvents: true,
      }
};
