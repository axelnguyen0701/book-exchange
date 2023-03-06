import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import Listing from "./listing_cards/listing";
import SavedListing from "./listing_cards/savedlisting";
import MyListing from "./listing_cards/mylisting";
import SavedBidListing from "./listing_cards/savedbidlisting";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./context/MetaContext";

import { marketplaceAddress } from "../config";

import BookMarketplace from "../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json";
import { Typography } from "@mui/material";
import { ethers } from "ethers";
import axios from "axios";

// home page that displays users saved books
export default function Home() {
    // Load gloable user context
    const { loaded, profile } = useContext(AppContext);
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");
    useEffect(() => {
        loadNFTs();
    }, []);
    async function loadNFTs() {
        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = new ethers.Contract(
            marketplaceAddress,
            BookMarketplace.abi,
            provider
        );
        const data = await contract.fetchListings();
        /*
         *  map over items returned from smart contract and format
         *  them as well as fetch their token metadata
         */
        const items = await Promise.all(
            data.map(async (i) => {
                const tokenUri = await contract.tokenURI(i.tokenId);
                const meta = await axios.get(tokenUri);

                let item = {
                    price: ethers.utils.formatEther(i.instantPrice),
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    allowBid: i.allowBid,
                    startingPrice: ethers.utils.formatEther(i.startingPrice),
                    image: meta.data.image,
                    title: meta.data.title,
                    author: meta.data.author,
                    ISBN: meta.data.ISBN,
                    course: meta.data.course,
                };

                return item;
            })
        );
        setNfts(items);
        setLoadingState("loaded");
    }

    //retrieve users saved books and map

    const renderedListings = nfts.map((e, i) => {
        return (
            <SavedListing
                key={i}
                imgurl={e.image}
                title={e.title}
                author={e.author}
                isbn={`ISBN: ${e.ISBN}`}
                courses={e.course}
                allowBid={e.allowBid}
                pricing={e.price}
                startingPrice={e.startingPrice}
                retails="90"
            />
        );
    });

    const renderListings = () => {
        if (loadingState === "loaded" && !nfts.length)
            return <Typography>Nothing to show yet</Typography>;

        return (
            <div className="book-shelf">
                {renderedListings}
                {/* <SavedListing
                    imgurl="https://pixl.varagesale.com/http://s3.amazonaws.com/hopshop-image-store-production/154469570/33ed6211efe20c9c3dfd0c93d5585893.jpg?_ver=large_uploader_thumbnail&w=640&h=640&fit=crop&s=8dfdbb9f3c83ca87534438bb1c5230b1"
                    title="Campbell Biology"
                    author="Jon Campbell"
                    isbn="ISBN: 33902712"
                    courses="BIOL 108"
                    pricing="32"
                    retails="90"
                />
                <SavedListing
                    imgurl="https://media.karousell.com/media/photos/products/2019/09/24/james_stewart_calculus_early_transcendentals_8th_edition_1569294789_0dce0298_progressive.jpg"
                    title="Calculus (Metric Version)"
                    author="James Stewart"
                    isbn="ISBN: 11421825"
                    courses="MATH 114, MATH 115"
                    pricing="60"
                    retails="110"
                />
                <SavedBidListing
                    imgurl="https://qph.cf2.quoracdn.net/main-qimg-b8151b8c985ba283e4613cf2696306f8-lq"
                    title="C Programming Language"
                    author="Brian Kernighan, Dennnis Ritchie"
                    isbn="ISBN: 7384983"
                    courses="CMPT 201, CMPT 360"
                    pricing="32"
                    retails="90"
                /> */}
            </div>
        );
    };

    return (
        <Container>
            <ResponsiveAppBar />
            <div className="titleHeader">
                <h1 className="title">Your Saved Listings</h1>
                {renderListings()}
            </div>
        </Container>
    );
}
