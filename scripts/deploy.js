const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const BookMarketplace = await hre.ethers.getContractFactory(
        "BookMarketplace"
    );
    const bookMarketplace = await BookMarketplace.deploy();
    await bookMarketplace.deployed();
    console.log("bookMarketplace deployed to:", bookMarketplace.address);

    fs.writeFileSync(
        "./config.js",
        `
  export const marketplaceAddress = "${bookMarketplace.address}"
  `
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
