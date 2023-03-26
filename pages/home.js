
import ResponsiveAppBar from "./navbar"
import { Container } from "@mui/system"
import SavedListing from "./listing_cards/savedlisting"
import React, { useEffect, useState, useContext } from "react"
import { AppContext } from "./context/MetaContext"

import { marketplaceAddress } from "../config"

import BookMarketplace from "../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json"
import { Typography } from "@mui/material"
import { ethers } from "ethers"
import axios from "axios"

// home page that displays users saved books
export default function Home() {
	// Load gloable user context
	const { loaded, profile, ethID } = useContext(AppContext)
	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState("not-loaded")
	useEffect(() => {
		loadNFTs()
	}, [])
	async function loadNFTs() {
		/* create a generic provider and query for unsold market items */
		const provider = new ethers.providers.JsonRpcProvider()
		const contract = new ethers.Contract(
			marketplaceAddress,
			BookMarketplace.abi,
			provider
		)
		const data = await contract.fetchListings()
		/*
		 *  map over items returned from smart contract and format
		 *  them as well as fetch their token metadata
		 */
		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await contract.tokenURI(i.tokenId)
				const meta = await axios.get(tokenUri)
				const courseMeta = await Promise.all(
					meta.data.courses.map(async (i) => {
						const courseName = await axios.get(i)

						return { name: courseName.data.name, URL: i }
					})
				)

				let item = {
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
				}
				return item
			})
		)
		setNfts(items)
		setLoadingState("loaded")
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
				<h1 className="title">Your Saved Listings  {ethID}</h1>
				<div className="row"> {renderListings()}</div>
			</div>
		</Container>
	)

}
