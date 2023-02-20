const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("BookMarketplace", () => {
    // global test variables
    let BookMarketplace;
    let bookMarketplace;
    let defaultListingPrice;
    let defaultInstantPrice;
    let defaultStartingPrice;
    let defaultAllowBid = true;
    let defaultTokenURI = "https://www.mytokenlocation.com";
    let defaultBiddingPrice = ethers.utils.parseUnits("0.001", "ether");

    before(async () => {
        // Deploy market
        BookMarketplace = await ethers.getContractFactory("BookMarketplace");
        bookMarketplace = await BookMarketplace.deploy();
        await bookMarketplace.deployed();

        defaultListingPrice = await bookMarketplace.getListingPrice();
        defaultListingPrice = defaultListingPrice.toString();

        defaultInstantPrice = ethers.utils.parseUnits("1", "ether");
        defaultStartingPrice = ethers.utils.parseUnits("0", "ether");
    });
    describe("Marketplace properties", async () => {
        it("Should be able to edit listing price", async () => {
            const newPrice = ethers.utils.parseUnits("0.5", "ether");
            const oldPrice = await bookMarketplace.getListingPrice();

            await bookMarketplace.updateListingPrice(newPrice);
            const fetchedPrice = await bookMarketplace.getListingPrice();
            defaultListingPrice = fetchedPrice.toString(); // update global variable to prevent other test fails

            assert.equal(fetchedPrice.toString(), newPrice.toString()) &&
                assert.notEqual(fetchedPrice.toString(), oldPrice.toString());
        });

        it("If not owner, fail to update listing price", async () => {
            const oldPrice = await bookMarketplace.getListingPrice();
            const newPrice = ethers.utils.parseUnits(
                (oldPrice + 1).toString(),
                "ether"
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();

            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            let error;

            try {
                await buyerMarketConnection.updateListingPrice(newPrice);
            } catch (e) {
                error = e.message;
            }
            const fetchedPrice = await bookMarketplace.getListingPrice();

            assert.equal(oldPrice.toString(), fetchedPrice.toString());
            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Only the marketplace owner can call this function.'"
            );
        });
        it("Should be able to edit bidding price", async () => {
            const newPrice = ethers.utils.parseUnits("0.5", "ether");
            const oldPrice = await bookMarketplace.getBiddingPrice();

            await bookMarketplace.updateBiddingPrice(newPrice);
            const fetchedPrice = await bookMarketplace.getBiddingPrice();
            defaultBiddingPrice = fetchedPrice.toString(); // update global variable to prevent other test fails

            assert.equal(fetchedPrice.toString(), newPrice.toString()) &&
                assert.notEqual(fetchedPrice.toString(), oldPrice.toString());
        });

        it("If not owner, fail to update bidding price", async () => {
            const oldPrice = await bookMarketplace.getBiddingPrice();
            const newPrice = ethers.utils.parseUnits(
                (oldPrice + 1).toString(),
                "ether"
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();

            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            let error;

            try {
                await buyerMarketConnection.updateBiddingPrice(newPrice);
            } catch (e) {
                error = e.message;
            }
            const fetchedPrice = await bookMarketplace.getBiddingPrice();

            assert.equal(oldPrice.toString(), fetchedPrice.toString());
            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Only the marketplace owner can call this function.'"
            );
        });
    });
    describe("Listing C.R.U.D", async () => {
        it("Should create a listing", async () => {
            const auctionPrice = ethers.utils.parseUnits("1", "ether");

            //Create a token

            await getDefaultListing();

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
        });

        it("Close an instant listing", async () => {
            const auctionPrice = ethers.utils.parseUnits("1", "ether");
            //Connect buyer address
            const [_, buyer] = await ethers.getSigners();
            const provider = ethers.provider;

            //Close sale
            await bookMarketplace
                .connect(buyer)
                .createMarketSale(1, { value: auctionPrice });

            //Fetch sale
            myNFTs = await bookMarketplace.connect(buyer).fetchMyNFTs();
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

            //Test
            let buyerAddress = await buyer.getAddress();
            assert.equal(
                myNFTs[0].owner,
                buyerAddress,
                "Buyer address does not match owner after closing"
            );
        });

        it("Should be able to fetch a listing by id", async () => {
            const txResponse = await getDefaultListing();
            const sender = txResponse.from;
            const id = await getIdFromCreateTxResponse(txResponse);

            const listing = await bookMarketplace.getListingByTokenId(id);

            assert.equal(
                listing.instantPrice.toString(),
                defaultInstantPrice.toString()
            );
            assert.equal(listing.seller.toString(), sender.toString());
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
            const listingId = await getIdFromCreateTxResponse(txResponse);

            // check price in listing
            let price = await bookMarketplace.getInstantPrice(listingId);
            assert.equal(startPrice.toString(), price.toString());

            // update price and check price in listing
            await bookMarketplace.updateInstantPrice(listingId, newPrice);
            price = await bookMarketplace.getInstantPrice(listingId);
            assert.equal(newPrice.toString(), price.toString());
        });

        it("Only market owner should update 'sold'", async () => {
            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            const listingId = getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            let error;

            try {
                await buyerMarketConnection.markListingAsSold(listingId);
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Only the marketplace owner can call this function.'"
            );
        });
    });

    describe("Bidding", async () => {
        it("Should create a bid", async () => {
            const bidPrice = ethers.utils.parseUnits("5", "ether");

            const txResponse = await bookMarketplace.createToken(
                defaultTokenURI,
                defaultInstantPrice,
                defaultStartingPrice,
                Boolean(true),
                { value: defaultListingPrice }
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            const listingId = await getIdFromCreateTxResponse(txResponse);

            const oldBids = await bookMarketplace.getBidList(listingId);
            // console.log("oldBids: ", oldBids);

            await buyerMarketConnection.addBid(listingId, bidPrice, {
                value: defaultBiddingPrice,
            });
            const newBids = await bookMarketplace.getBidList(listingId);
            // console.log("newBids: ", newBids);

            assert.equal(newBids.length, oldBids.length + 1);
        });

        it("Should not be able to accept a bid if is false", async () => {
            const bidPrice = ethers.utils.parseUnits("0", "ether");

            const txResponse = await bookMarketplace.createToken(
                defaultTokenURI,
                defaultInstantPrice,
                defaultStartingPrice,
                Boolean(false),
                { value: defaultListingPrice }
            );

            const listingId = await getIdFromCreateTxResponse(txResponse);

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            let error;

            try {
                await buyerMarketConnection.addBid(listingId, bidPrice, {
                    value: defaultBiddingPrice,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'This item does not allow bids.'"
            );
        });
        it("Should not be able to bid for free on first bid", async () => {
            const bidAmount = ethers.utils.parseUnits("1", "ether");

            const listingId = await getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            let error;

            try {
                await buyerMarketConnection.addBid(listingId, bidAmount, {
                    value: 0,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Bid price must be paid on first bid: 0.001 ether.'"
            );
        });

        it("Should be able to bid for free on second bid", async () => {
            const firstBid = ethers.utils.parseUnits("1", "ether");
            const secondBid = ethers.utils.parseUnits("2", "ether");
            const secondBuyerBid = ethers.utils.parseUnits("1.5", "ether");

            const listingId = await getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            // get new signer
            const [_, buyer, secondBuyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            const secondBuyerMarketConnection = await bookMarketplace.connect(
                secondBuyer
            );

            await buyerMarketConnection.addBid(listingId, firstBid, {
                value: defaultBiddingPrice,
            });
            await secondBuyerMarketConnection.addBid(
                listingId,
                secondBuyerBid,
                { value: defaultBiddingPrice }
            );
            await buyerMarketConnection.addBid(listingId, secondBid, {
                value: 0,
            });
        });

        it("Should not be able to bid if already highest bidder", async () => {
            const bidPrice = ethers.utils.parseUnits("1", "ether");
            const secondBidPrice = ethers.utils.parseUnits("2", "ether");

            const listingId = await getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            await buyerMarketConnection.addBid(listingId, bidPrice, {
                value: defaultBiddingPrice,
            });

            let error;

            try {
                await buyerMarketConnection.addBid(listingId, secondBidPrice, {
                    value: 0,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Highest bidder cannot bid again.'"
            );
        });

        it("Bidding price should be 0 on second bid", async () => {
            const firstBid = ethers.utils.parseUnits("1", "ether");
            const secondBid = ethers.utils.parseUnits("2", "ether");

            const listingId = await getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            await buyerMarketConnection.addBid(listingId, firstBid, {
                value: defaultBiddingPrice,
            });

            let error;
            try {
                await buyerMarketConnection.addBid(listingId, secondBid, {
                    value: defaultBiddingPrice,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Bid price must be 0 ether after first bid.'"
            );
        });

        it("Should not be able to add more bids after item is sold", async () => {
            const bidPrice = ethers.utils.parseUnits("1", "ether");
            const listingId = getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            await buyerMarketConnection.addBid(listingId, bidPrice, {
                value: defaultBiddingPrice,
            });

            await bookMarketplace.markListingAsSold(listingId);

            const newBidPrice = ethers.utils.parseUnits("2", "ether");

            let error;

            try {
                await buyerMarketConnection.addBid(listingId, newBidPrice, {
                    value: defaultBiddingPrice,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'This item has been sold.'"
            );
        });
        it("Should be able to disallow bids", async () => {
            const listingId = getIdFromCreateTxResponse(
                await getDefaultListing()
            );
            const bidPrice = ethers.utils.parseUnits("1", "ether");

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            await buyerMarketConnection.addBid(listingId, bidPrice, {
                value: defaultBiddingPrice,
            });

            bookMarketplace.updateAllowBid(listingId, Boolean(false));

            let error;

            try {
                await buyerMarketConnection.addBid(listingId, bidPrice, {
                    value: bidPrice,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'This item does not allow bids.'"
            );
        });

        it("If bid amount is less than current bid, should not be able to bid", async () => {
            const firstBid = ethers.utils.parseUnits("10", "ether");
            const secondBid = ethers.utils.parseUnits("5", "ether");

            const listingId = await getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            // get new signer
            const [_, buyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);

            await buyerMarketConnection.addBid(listingId, firstBid, {
                value: defaultBiddingPrice,
            });

            let error;

            try {
                await buyerMarketConnection.addBid(listingId, secondBid, {
                    value: 0,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Bid must be greater than the current highest bid.'"
            );
        });
        it("Seller cannot bid on own listing", async () => {
            const bidPrice = ethers.utils.parseUnits("1", "ether");
            const listingId = getIdFromCreateTxResponse(
                await getDefaultListing()
            );

            let error;

            try {
                await bookMarketplace.addBid(listingId, bidPrice, {
                    value: defaultBiddingPrice,
                });
            } catch (e) {
                error = e.message;
            }

            assert.equal(
                error,
                "VM Exception while processing transaction: reverted with reason string 'Seller cannot bid on their own listing.'"
            );
        });
        it("Can close the highest bid", async () => {
            const bidPrice = ethers.utils.parseUnits("5", "ether");
            const secondBidPrice = ethers.utils.parseUnits("6", "ether");

            const txResponse = await bookMarketplace.createToken(
                defaultTokenURI + "1",
                defaultInstantPrice,
                defaultStartingPrice,
                Boolean(true),
                { value: defaultListingPrice }
            );

            // get new signer
            const [_, buyer, secondBuyer] = await ethers.getSigners();
            const buyerMarketConnection = await bookMarketplace.connect(buyer);
            const secondBuyerMarketConnection = await bookMarketplace.connect(
                secondBuyer
            );

            // get initial balance
            const provider = ethers.provider;
            const balance = await provider.getBalance(secondBuyer.address);

            // Add a new bid
            const listingId = await getIdFromCreateTxResponse(txResponse);
            await buyerMarketConnection.addBid(listingId, bidPrice, {
                value: defaultBiddingPrice,
            });

            // Add a second bid from second buyer
            await secondBuyerMarketConnection.addBid(
                listingId,
                secondBidPrice,
                {
                    value: defaultBiddingPrice,
                }
            );

            // Close the bidding
            await bookMarketplace.createBiddingSale(listingId);
            const oldBids = await bookMarketplace.getBidList(listingId);
            await secondBuyerMarketConnection.acceptBiddingSale(listingId, 2, {
                value: secondBidPrice,
            });

            //Get final balance of second buyer
            const finalBalance = await provider.getBalance(secondBuyer.address);

            let secondBuyerNFTs = await bookMarketplace
                .connect(secondBuyer)
                .fetchMyNFTs();
            secondBuyerNFTs = await Promise.all(
                secondBuyerNFTs.map(async (i) => {
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

            //Test if amount is transferred
            assert(
                balance - finalBalance - defaultBiddingPrice >=
                    secondBidPrice.toString(),
                `Expect >= ${secondBidPrice.toString()}, got ${
                    finalBalance - balance
                }`
            );
            //Test if right token
            assert.equal(secondBuyerNFTs[0].tokenUri, defaultTokenURI + "1");
            //Test if right address
            assert.equal(secondBuyerNFTs[0].owner, secondBuyer.address);
            //Test if bidList reset
            assert.equal(secondBuyerNFTs[0].bidList.length, oldBids.length - 2);
        });
    });

    async function getDefaultListing() {
        const txResponse = await bookMarketplace.createToken(
            defaultTokenURI,
            defaultInstantPrice,
            defaultStartingPrice,
            defaultAllowBid,
            { value: defaultListingPrice }
        );

        return txResponse;
    }
});

async function getIdFromCreateTxResponse(txResponse) {
    const txReceipt = await txResponse.wait();
    const events = txReceipt.events;
    const id = events.filter((e) => e.event === "ListingCreated")[0].args[0];
    return id;
}
