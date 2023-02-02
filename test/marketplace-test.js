describe("BookMarketplace", () => {
    it("Should create a listing", async () => {
        // Deploy market
        const BookMarketplace = await ethers.getContractFactory(
            "BookMarketplace"
        );
        const bookMarketplace = await BookMarketplace.deploy();
        await bookMarketplace.deployed();

        let listingPrice = await bookMarketplace.getListingPrice();
        listingPrice = listingPrice.toString();

        const auctionPrice = ethers.utils.parseUnits("1", "ether");

        //Create a token
        const instantPrice = ethers.utils.parseUnits("1", "ether");
        const startingPrice = ethers.utils.parseUnits("0", "ether");
        const allowBid = false;
        await bookMarketplace.createToken(
            "https://www.mytokenlocation.com",
            instantPrice,
            startingPrice,
            allowBid,
            { value: listingPrice }
        );

        const [_, buyerAddress] = await ethers.getSigners();

        await bookMarketplace
            .connect(buyerAddress)
            .createMarketSale(1, { value: auctionPrice });

        items = await bookMarketplace.fetchListings();
        items = await Promise.all(
            items.map(async (i) => {
                const tokenUri = await bookMarketplace.tokenURI(i.tokenId);
                let item = {
                    instantPrice: i.instantPrice.toString(),
                    startingPrice: i.startingPrice.toString(),
                    seller: i.seller,
                    owner: i.owner,
                    allowBid: i.allowBid,
                    bidList: i.bidList,
                    tokenUri,
                };
                return item;
            })
        );

        myNFTs = await bookMarketplace.connect(buyerAddress).fetchMyNFTs();
        myNFTs = await Promise.all(
            myNFTs.map(async (i) => {
                const tokenUri = await bookMarketplace.tokenURI(i.tokenId);
                let item = {
                    instantPrice: i.instantPrice.toString(),
                    startingPrice: i.startingPrice.toString(),
                    seller: i.seller,
                    owner: i.owner,
                    allowBid: i.allowBid,
                    bidList: i.bidList,
                    tokenUri,
                };
                return item;
            })
        );
        console.log("items: ", items);
        console.log("my NFTS: ", myNFTs);
    });
});
