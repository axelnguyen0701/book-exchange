import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import { useRouter } from "next/router"

import { marketplaceAddress } from "../config"

import BookMarketplace from "../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json"
import { Container } from "@mui/material"
import ResponsiveAppBar from "./navbar"
import MyListing from "./listing_cards/mylisting"

export default function MyAssets() {
	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState("not-loaded")
	const router = useRouter()
	useEffect(() => {
		loadNFTs()
	}, [])
	async function loadNFTs() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()

		const marketplaceContract = new ethers.Contract(
			marketplaceAddress,
			BookMarketplace.abi,
			signer
		)
		const data = await marketplaceContract.fetchMyNFTs()

		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await marketplaceContract.tokenURI(i.tokenId)
				const meta = await axios.get(tokenUri)
				const courseMeta = await Promise.all(
					meta.data.courses.map(async (i) => {
						const courseName = await axios.get(i)

						return { name: courseName.data.name, URL: i }
					})
				)
				console.log(courseMeta)
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
					courses: courseMeta,
				}
				return item
			})
		)
		setNfts(items)
		setLoadingState("loaded")
	}

	return (
		<Container>
			<ResponsiveAppBar />
			{loadingState === "loaded" && !nfts.length && (
				<div className="titleHeader">
					<h1 className="title">No NFTs owned</h1>
				</div>
			)}

			<div className="titleHeader">
				<div className="row">
					<div className="col-md-4">
						{nfts.map((nft, i) => (
							<MyListing
								key={nft.tokenId}
								author={nft.author}
								title={nft.title}
								isbn={nft.isbn}
								courses={nft.courses}
								pricing={nft.price}
								imgurl={nft.image}
								retails="90"
							/>
						))}
					</div>
				</div>
			</div>
		</Container>
	)
}
