// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract BookMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;
    uint256 biddingPrice = 0.001 ether;

    address payable marketOwner;

    mapping(uint256 => Listing) private idToMarketItem;

    /* structs */

    struct Bid {
        address bidder;
        uint256 bidAmount;
    }

    struct Listing {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 instantPrice;
        uint256 startingPrice;
        bool allowBid;
        Bid[] bidList;
        bool sold;
    }

    /* events */

    event ListingCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 instantPrice,
        uint256 startingPrice,
        bool allowBid,
        Bid[] bidList,
        bool sold
    );

    event ListingUpdated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 instantPrice,
        uint256 startingPrice,
        bool allowBid,
        Bid[] bidList,
        bool sold
    );

    /* modifiers */
    
    
    // Modifier prevents function from being called by anyone other than the market owner
    modifier onlyMarketOwner() {
        require(
            marketOwner == msg.sender,
            "Only the marketplace owner can call this function."
        );
        _;
    }

    /* constructor */

    constructor() ERC721("BookExchange Tokens", "BOOK") {
        marketOwner = payable(msg.sender);
    }

    /* functions */

    function getMarketOwnerAddress() public view returns(address) {
        return marketOwner;
    }

    // change the price of a listing
    function updateInstantPrice(uint256 tokenId, uint256 newPrice) public onlyMarketOwner {
        Listing storage listing = idToMarketItem[tokenId];
        listing.instantPrice = newPrice;
        idToMarketItem[tokenId] = listing;
    }

    // get the price of a listing
    function getInstantPrice(uint256 tokenId) public view returns (uint256) {
        Listing storage listing = idToMarketItem[tokenId];
        return listing.instantPrice;
    }

    // Adds bids to a bid list by tokenId
    function addBid(uint256 tokenId, uint256 bidAmount) public payable {
        Listing storage listing = idToMarketItem[tokenId];
        require(
            listing.allowBid == true,
            "This item does not allow bids."
        );
        require(
            listing.sold == false,
            "This item has been sold."
        );
        require(
            bidAmount >= listing.instantPrice,
            "Bid must be greater than or equal to the current price."
        );
        if(hasUserBid(tokenId, msg.sender) == false) {
            require(
                msg.value == biddingPrice,
                "Bid price must be paid on first bid: 0.001 ether."
            );
        }
        else {
            require(
                msg.value == 0,
                "Bid price must be 0 ether after first bid."
            );
        }
        require(
            bidAmount > getHighestBid(tokenId).bidAmount,
            "Bid must be greater than the current highest bid."
        );
        require(
            msg.sender != listing.seller,
            "Seller cannot bid on their own listing."
        );
        require(
            msg.sender != getHighestBidder(tokenId),
            "Highest bidder cannot bid again."
        );

        //if user has not bid, transfer bidding price to market owner
        if(hasUserBid(tokenId, msg.sender) == false) {
            payable(marketOwner).transfer(biddingPrice);
        }
        
        Bid memory newBid;
        newBid.bidder = msg.sender;
        newBid.bidAmount = bidAmount;
        listing.bidList.push(newBid);
    }

    // Returns the bid list for a given tokenId
    function getBidList(uint256 tokenId) public view returns (Bid[] memory) {
        Listing storage listing = idToMarketItem[tokenId];
        return listing.bidList;
    }

    // checks is a user has bid
    function hasUserBid(uint256 tokenId, address user) public view returns (bool) {
        Listing storage listing = idToMarketItem[tokenId];
        for (uint i = 0; i < listing.bidList.length; i++) {
            if (listing.bidList[i].bidder == user) {
                return true;
            }
        }
        return false;
    }

    // Returns the highest bid for a given tokenId
    function getHighestBid(uint256 tokenId) public view returns (Bid memory) {
        Listing storage listing = idToMarketItem[tokenId];
        Bid memory highestBid;
        for (uint i = 0; i < listing.bidList.length; i++) {
            if (listing.bidList[i].bidAmount > highestBid.bidAmount) {
                highestBid = listing.bidList[i];
            }
        }
        return highestBid;
    }

    // Returns the user who placed the highest bid for a given tokenId
    // Note: Maybe combine this functionality with the getHighestBid function to save gas
    function getHighestBidder(uint256 tokenId) public view returns (address) {
        Listing storage listing = idToMarketItem[tokenId];
        Bid memory highestBid;
        for (uint i = 0; i < listing.bidList.length; i++) {
            if (listing.bidList[i].bidAmount > highestBid.bidAmount) {
                highestBid = listing.bidList[i];
            }
        }
        return highestBid.bidder;
    }

    // marks a listing as sold
    function markListingAsSold(uint256 tokenId) public onlyMarketOwner {
        Listing storage listing = idToMarketItem[tokenId];
        listing.sold = true;
        idToMarketItem[tokenId] = listing;
    }
    
    /* Updating the allowed bid is required in bid closing sequence */
    function updateAllowBid(uint256 tokenId, bool allow) public onlyMarketOwner {
        Listing storage listing = idToMarketItem[tokenId];
        listing.allowBid = allow;
        idToMarketItem[tokenId] = listing;
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) public onlyMarketOwner {
        require(
            _listingPrice >= 0,
            "Listing price must be greater than 0."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Updates the bid price of the contract */
    function updateBiddingPrice(uint256 _biddingPrice) public onlyMarketOwner {
        require(
            _biddingPrice >= 0,
            "Bid price must be greater than or equal to 0."
        );
        biddingPrice = _biddingPrice;
    }

    /* Returns the bid price of the contract */
    function getBiddingPrice() public view returns (uint256) {
        return biddingPrice;
    }


    
    /* Mints a token and lists it in the marketplace */
    function createToken(
        string memory tokenURI,
        uint256 instantPrice,
        uint256 startingPrice,
        bool allowBid
    ) public payable returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, instantPrice, startingPrice, allowBid);
        return _tokenIds.current();
    }

    function createMarketItem(
        uint256 tokenId,
        uint256 instantPrice,
        uint256 startingPrice,
        bool allowBid
    ) private {
        require(instantPrice > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        Listing storage listing = idToMarketItem[tokenId];
        Bid memory emptyBid;
        listing.tokenId = tokenId;
        listing.seller = payable(msg.sender);
        listing.owner = payable(address(this));
        listing.instantPrice = instantPrice;
        listing.startingPrice = startingPrice;
        listing.allowBid = allowBid;
        listing.bidList.push(emptyBid);

        idToMarketItem[tokenId] = listing;
        
        _transfer(msg.sender, address(this), tokenId);
        emit ListingCreated(
            tokenId,
            msg.sender,
            address(this),
            instantPrice,
            startingPrice,
            allowBid,
            listing.bidList,
            false
        );
    }

    /* get the listing for a given token id */
    function getListingByTokenId(uint256 tokenId) public view returns (Listing memory) {
        return idToMarketItem[tokenId];
    }

    /* Returns all unsold market items */
    function fetchListings() public view returns (Listing[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        Listing[] memory items = new Listing[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                Listing storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (Listing[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        Listing[] memory items = new Listing[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                Listing storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (Listing[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        Listing[] memory items = new Listing[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                Listing storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
