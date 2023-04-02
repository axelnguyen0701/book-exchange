const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const BookMarketplace = await hre.ethers.getContractFactory(
        "BookMarketplace"
    );
    const bookMarketplace = await BookMarketplace.deploy();
    await bookMarketplace.deployed();
    console.log("bookMarketplace deployed to:", bookMarketplace.address);

    const deployTx = await bookMarketplace.deployTransaction.wait();

    fs.writeFileSync(
        "./config.js",
        `
  export const marketplaceAddress = "${bookMarketplace.address}"
  `
    );

    return { contractName: "BookMarketplace" , address: bookMarketplace.address, blockNumber: deployTx.blockNumber}

}

main()
    .then((result) => hre.run('graph', result))
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
