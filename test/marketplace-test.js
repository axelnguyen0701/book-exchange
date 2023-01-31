const { assert } = require("chai");
const { getClientBuildManifest } = require("next/dist/client/route-loader");
const { abi } = require("../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json");
describe("BookMarketplace", () => {
    // global test variables
    let BookMarketplace;
    let bookMarketplace;
    let defaultListingPrice;
    let defaultInstantPrice;
    let defaultStartingPrice;
    let defaultAllowBid = false;
    let defaultTokenURI = "https://www.mytokenlocation.com";

    before(async () => {
        // Deploy market
        BookMarketplace = await ethers.getContractFactory(
            "BookMarketplace"
        );
        bookMarketplace = await BookMarketplace.deploy();
        await bookMarketplace.deployed();

        defaultListingPrice = await bookMarketplace.getListingPrice();
        defaultListingPrice = defaultListingPrice.toString();

        defaultInstantPrice = ethers.utils.parseUnits("1", "ether");
        defaultStartingPrice = ethers.utils.parseUnits("0", "ether");

    });

    it("Should create a listing", async () => {
        
        //Create a token
        
        await bookMarketplace.createToken(
            defaultTokenURI,
            defaultInstantPrice,
            defaultStartingPrice,
            defaultAllowBid,
            { value: defaultListingPrice }
        );
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
        console.log("items: ", items);
    });

    it("Should be able to fetch a listing by id", async () => {
        const txResponse = await bookMarketplace.createToken(
            defaultTokenURI,
            defaultInstantPrice,
            defaultStartingPrice,
            defaultAllowBid,
            { value: defaultListingPrice }
        );
        const sender = txResponse.from;     
        const id = await getIdFromCreateTxRespons(txResponse);
        
        const listing = await bookMarketplace.getListingByTokenId(id);

        assert.equal(listing.instantPrice.toString(), defaultInstantPrice.toString());
        assert.equal(listing.seller.toString(), sender.toString())
    }   
        );

    it("Should be able to edit listing price", async () => {
        const newPrice = ethers.utils.parseUnits("0.5", "ether");
        const oldPrice = await bookMarketplace.getListingPrice();

        await bookMarketplace.updateListingPrice(newPrice);
        const fetchedPrice = await bookMarketplace.getListingPrice();
        defaultListingPrice = fetchedPrice.toString(); // update global variable to prevent other test fails

        assert.equal(fetchedPrice.toString(), newPrice.toString()) && 
        assert.notEqual(fetchedPrice.toString(), oldPrice.toString());
    });

    it("Should be able to edit listsing instantPrice", async () => {
        const newPrice = ethers.utils.parseUnits("0.5", "ether");
        const startPrice = ethers.utils.parseUnits("0.1", "ether");
        const txResponse = await bookMarketplace.createToken(
            defaultTokenURI,
            startPrice,
            startPrice,
            defaultAllowBid,
            { value: defaultListingPrice }
        );
        const listingId = await getIdFromCreateTxRespons(txResponse);
        
        // check price in listing
        let price = await bookMarketplace.getInstantPrice(listingId);
        assert.equal(startPrice.toString(), price.toString());

        // update price and check price in listing
        await bookMarketplace.updateInstantPrice(listingId, newPrice);
        price = await bookMarketplace.getInstantPrice(listingId);
        assert.equal(newPrice.toString(), price.toString());
    });

    it("Should create a bid", async () => {
        const bidPrice = ethers.utils.parseUnits("5", "ether");
    
        const txResponse = await bookMarketplace.createToken(
            defaultTokenURI,
            defaultInstantPrice,
            defaultStartingPrice,
            true,
            { value: defaultListingPrice }
        );

        // get new signer
        const [_, buyer] = await ethers.getSigners();
        const buyerMarketConnection = await bookMarketplace.connect(buyer);

        const listingId = await getIdFromCreateTxRespons(txResponse);
        const oldBids = await bookMarketplace.getBidList(listingId);
        console.log("oldBids: ", oldBids);

        await buyerMarketConnection.addBid(listingId, bidPrice, { value: bidPrice });
        const newBids = await bookMarketplace.getBidList(listingId);
        console.log("newBids: ", newBids);

        assert.equal(newBids.length, oldBids.length + 1);
    });

    it("Should fail to accept a bid if is false", async () => {
        const bidPrice = ethers.utils.parseUnits("0", "ether");

        const txResponse = await bookMarketplace.createToken(
            defaultTokenURI,
            defaultInstantPrice,
            defaultStartingPrice,
            false,
            { value: defaultListingPrice }
        );

        const listingId = await getIdFromCreateTxRespons(txResponse);
        bookMarketplace.addBid(listingId, bidPrice, { value: bidPrice });
});

async function getIdFromCreateTxRespons(txResponse) {
    const txReceipt = await txResponse.wait();
    const events = txReceipt.events;
    const id = events.filter((e) => e.event === "ListingCreated")[0].args[0];
    return id;
}
});