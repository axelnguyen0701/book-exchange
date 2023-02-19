require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
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
};
