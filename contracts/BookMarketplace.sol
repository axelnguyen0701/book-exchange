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
    address payable owner;

    mapping(uint256 => Listing) private idToMarketItem;

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

    constructor() ERC721("BookExchange Tokens", "BOOK") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
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
        return newTokenId;
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

        Bid[] memory bidList;

        idToMarketItem[tokenId] = Listing(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            instantPrice,
            startingPrice,
            allowBid,
            bidList,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit ListingCreated(
            tokenId,
            msg.sender,
            address(this),
            instantPrice,
            startingPrice,
            allowBid,
            bidList,
            false
        );
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (Listing[] memory) {
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