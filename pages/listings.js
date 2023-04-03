import ResponsiveAppBar from "./navbar"
import { Container } from "@mui/system"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { useState } from "react"
import MuiToggleButton from "@mui/material/ToggleButton"
import { styled } from "@mui/material/styles"
import MyListing from "./listing_cards/mylisting"
import ClosedListing from "./listing_cards/closedlisting"
import { AppContext } from "./context/MetaContext"
import { useContext, useEffect } from "react"
import { Typography } from "@mui/material"
import Web3Modal from "web3modal";
import { ethers } from "ethers"
import axios from "axios"
import { marketplaceAddress } from "../config"
import BookMarketplace from "../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json"


// Used to show users active and past listings
export default function Listings() {
	const { loaded, profile } = useContext(AppContext)
	const [alignment, setAlignment] = useState("active")
	const [header, setHeader] = useState("Your Active Listings")
	const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");
    const signerAddress = getSignerAddress();
    useEffect(() => {
        loadNFTs();
    }, []);

    async function getSignerAddress() {
        const connection = await new Web3Modal().connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return address;
    }

	// themeing for button
	const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
		"&.Mui-selected, &.Mui-selected:hover": {
			color: "white",
			backgroundColor: selectedColor,
		},
	}))

	// used to swap between active and sold listings
	const handleChange = () => {
		if (alignment === "active") {
			setAlignment("past")
			setHeader("Your Past Listings")
		}

		if (alignment === "past") {
			setAlignment("active")
			setHeader("Your Active Listings")
		}
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
                        listings(where: {seller: "${(await signerAddress).toLowerCase()}"}) {
                            id
                            tokenId
                            allowBid
                            seller
                            owner
                            startingPrice
                            sold
                            instantPrice
							did
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
                    tokenId: i.tokenId,
                    seller: i.seller,
                    owner: i.owner,
                    allowBid: i.allowBid,
                    startingPrice: ethers.utils.formatEther(i.startingPrice),
                    image: meta.data.image,
                    title: meta.data.title,
                    author: meta.data.author,
                    ISBN: meta.data.ISBN,
                    course: courseMeta,
					sold: i.sold
                };
                return item;
            })
        );
        setNfts(items);
        setLoadingState("loaded");
    }

	const renderedListings = nfts.map((e, i) => {
		if(!e.sold) {
			return (
				<div className="col-md-4" key={i}>
					<MyListing 
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
			}
		}
		)

	const renderedOldListings = nfts.map((e, i) => {
		if(e.sold) {
			return (
						<div className="col-md-4" key={i}>
							{/* <ClosedListing
								imgurl={e.image}
								title={e.title}
								author={e.author}
								isbn={`ISBN: ${e.ISBN}`}
								courses={e.course}
								outcome = {e.price}
						/> */}
						<MyListing 
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
				}
			}
		)
	
	const renderOldListings = () => {
		if (loadingState === "loaded" && !nfts.length)
			return <Typography>Nothing to show yet</Typography>

		return renderedOldListings
	}
	

	const renderListings = () => {
		if (loadingState === "loaded" && !nfts.length)
			return <Typography>Nothing to show yet</Typography>

		return renderedListings
	}

	// viewing active listings
	if (alignment === "active") {
		return (
			<Container>
				<ResponsiveAppBar />
				<div className="titleHeader">
					<h1 className="title">{header}</h1>
				</div>
				<div className="search-button-box">
					<ToggleButtonGroup
						color="primary"
						value={alignment}
						exclusive
						onChange={handleChange}
						aria-label="Platform"
					>
						<ToggleButton value="active" selectedColor=" #301934">
							Active
						</ToggleButton>
						<ToggleButton value="past" selectedColor=" #301934">
							Sold
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
				<div className="book-shelf">
					{/* <MyListing
						imgurl="https://i.ebayimg.com/images/g/pwYAAOSwbDdji-Dn/s-l500.jpg"
						title="Sociology in Action"
						author="Myles Richer"
						isbn="ISBN: 18371921"
						courses={[
							{ name: "SOCI-100", URL: "mycourseURL1.com" },
						]}
						pricing="40"
						retails="75"
					></MyListing>
					<MyListing
						imgurl="https://thomaspark.co/wp/wp-content/uploads/2012/12/interactiondesign-book.jpg"
						title="Interaction Design (3rd Ed)"
						author="Thomas Park"
						isbn="ISBN: 83917334"
						courses={[
							{ name: "CMPT-250", URL: "mycourseURL2.com" },
							{ name: "CMPT-351", URL: "mycourseURL3.com" },
						]}
						pricing="80"
						retails="105"
					></MyListing> */}
				</div>
				<div className="row"> {renderListings()}</div>
			</Container>
		)
	}
	
	// viewing old listings
	if (alignment === "past") {
		return (
			<Container>
				<ResponsiveAppBar />
				<div className="titleHeader">
					<h1 className="title">{header}</h1>
				</div>
				<div className="search-button-box">
					<ToggleButtonGroup
						color="primary"
						value={alignment}
						exclusive
						onChange={handleChange}
						aria-label="Platform"
					>
						<ToggleButton value="active" selectedColor=" #301934">
							Active
						</ToggleButton>
						<ToggleButton value="past" selectedColor=" #301934">
							Sold
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
				{/* <div className="book-shelf">
					<ClosedListing
						imgurl="https://media.karousell.com/media/photos/products/2020/9/1/oxford_complete_chemistry_text_1598935446_e60666e6_progressive.jpg"
						title="Complete Chemistry"
						author="Thomas Park"
						isbn="ISBN: 83917334"
						courses="CMPT 250, DESN 223"
						outcome="Sold: 36$"
					></ClosedListing>
				</div> */}
				<div className="row2"> {renderOldListings()}</div>
			</Container>
		)
	}
}
