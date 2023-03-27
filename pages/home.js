
import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import SavedListing from "./listing_cards/savedlisting";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./context/MetaContext";
import Web3Modal from "web3modal";


import { marketplaceAddress } from "../config"

import BookMarketplace from "../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json"
import { Typography } from "@mui/material"
import { ethers } from "ethers"
import axios from "axios"

// home page that displays users saved books
export default function Home() {

    // Load global user context
    const { loaded, profile } = useContext(AppContext);
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");
    const signerAddress = getSignerAddress();
    useEffect(() => {
        loadNFTs();
    }, []);

    async function getSignerAddress() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return address;
    }

    async function loadNFTs() {
        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = new ethers.Contract(
            marketplaceAddress,
            BookMarketplace.abi,
            provider
        );
        // fetch items from subgraph
        const data = await axios({
            url: 'http://127.0.0.1:8000/subgraphs/name/book-marketplace',
            method: 'post',
            data: {
                query: `
                    query {
                        listings(where: {sold: false, seller_not: "${(await signerAddress).toLowerCase()}"}) {
                            id
                            tokenId
                            allowBid
                            seller
                            owner
                            startingPrice
                            sold
                            instantPrice
                          }
                        }
                    `
                }
                        
        }).then((result) => {
            console.log(
                "data returned:\n",
                result.data)
                return result.data.data.listings
            }).catch((err) => {
                console.log(err)
                return contract.fetchListings();
                });
                //TODO: add error handling for when the subgraph is down or returning bad data
        /*
         *  map over items returned from smart contract and format
         *  them as well as fetch their token metadata
         */
        const items = await Promise.all(
            data.map(async (i) => {
                const tokenUri = await contract.tokenURI(i.tokenId);
                const meta = await axios.get(tokenUri);
                const courseMeta = await Promise.all(
                    meta.data.courses.map(async (i) => {
                        const courseName = await axios.get(i);

                        return { name: courseName.data.name, URL: i };
                    })
                );
                let item = {
                    id: i.id || 1,
                    price: ethers.utils.formatUnits(
						i.instantPrice.toString(),
						"ether"
					),
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    allowBid: i.allowBid,
                    startingPrice: ethers.utils.formatEther(i.startingPrice),
                    image: meta.data.image,
                    title: meta.data.title,
                    author: meta.data.author,
                    ISBN: meta.data.ISBN,
                    course: courseMeta,
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
			<div className="col-md-4" key={i}>
				<SavedListing
					tokenId={e.tokenId}
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
			</div>
		)
	})

	const renderListings = () => {
		if (loadingState === "loaded" && !nfts.length)
			return <Typography>Nothing to show yet</Typography>

		return renderedListings
	}

	return (
		<Container>
			<ResponsiveAppBar />
			<div className="titleHeader">
				<h1 className="title">Your Saved Listings</h1>
				<div className="row"> {renderListings()}</div>
			</div>
		</Container>
	)
}
