import { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Web3Modal from "web3modal"
import { ethers } from "ethers"

import { marketplaceAddress } from "@/config"
import BookMarketplace from "../../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json"
import {
	FormControl,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material"
import BidTable from "../bids/bidTable"

// Component used for purchasing an instant sale listing
export default function PurchaseDialog({
	title,
	pricing,
	tokenId,
	allowBid,
	startingPrice,
	bidList,
	seller,
}) {
	const [open, setOpen] = useState(false)
	const [biddingPrice, setBiddingPrice] = useState("")

	// handle opening and closing menu
	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleBiddingPrice = (e) => {
		if (e.target.value === "" || !isNaN(parseFloat(e.target.value))) {
			setBiddingPrice(e.target.value)
		}
	}

	// add logic for purchasing a book here
	const handlePurchase = async () => {
		/* needs the user to sign the transaction, so will use Web3Provider and sign it */
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(
			marketplaceAddress,
			BookMarketplace.abi,
			signer
		)
		/* user will be prompted to pay the asking proces to complete the transaction */
		const price = ethers.utils.parseUnits(pricing.toString())
		const transaction = await contract.createMarketSale(tokenId, {
			value: price,
		})
		await transaction.wait()
	}

	const handleBid = async () => {
		/* needs the user to sign the transaction, so will use Web3Provider and sign it */
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const signerAddress = await signer.getAddress()
		const contract = new ethers.Contract(
			marketplaceAddress,
			BookMarketplace.abi,
			signer
		)
		/* user will be prompted to pay the asking proces to complete the transaction */
		const parsedBiddingPrice = ethers.utils.parseUnits(biddingPrice)

		const latestBid = bidList.find((e) => e.bidder === signerAddress)
		try {
			const transaction = await contract.addBid(
				tokenId,
				parsedBiddingPrice,
				{
					value: ethers.utils.parseUnits(
						//If there is already a bid then user dont have to pay anything but gas
						!!!latestBid ? "0.001" : "0"
					),
				}
			)
			await transaction.wait()
		} catch (e) {
			alert(e.reason)
		}
		handleClose()
	}

	const renderDialog = () => {
		if (allowBid) {
			return (
				<>
					<Button
						className="option"
						size="small"
						onClick={handleClickOpen}
					>
						Buy
					</Button>
					<Dialog
						className="dialog-container"
						open={open}
						onClose={handleClose}
						maxWidth="md"
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle
							className="dialog-title"
							id="alert-dialog-title"
						>
							Confirm Bidding for {title}?
						</DialogTitle>
						<DialogContent>
							<BidTable
								bidList={bidList}
								seller={seller}
								tokenId={tokenId}
							/>

							<DialogContentText
								className="table"
								id="alert-dialog-description"
							>
								Starting price is: {startingPrice} ETH
							</DialogContentText>
							<FormControl fullWidth sx={{ m: 1 }}>
								<InputLabel htmlFor="outlined-adornment-amount">
									Amount
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-amount"
									onChange={handleBiddingPrice}
									value={biddingPrice}
									startAdornment={
										<InputAdornment position="start">
											ETH
										</InputAdornment>
									}
									label="Amount"
								/>
							</FormControl>
						</DialogContent>
						<DialogActions className="button-box">
							<Button
								className="confirm-option"
								onClick={handleBid}
							>
								Bid
							</Button>
							<Button
								className="cancel-option"
								onClick={handleClose}
								autoFocus
							>
								Cancel
							</Button>
						</DialogActions>
					</Dialog>
				</>
			)
		}

		return (
			<>
				<Button
					className="option"
					size="small"
					onClick={handleClickOpen}
				>
					Buy
				</Button>
				<Dialog
					className="dialog-container"
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle
						className="dialog-title"
						id="alert-dialog-title"
					>
						Confirm Purchase of {title}?
					</DialogTitle>
					<DialogContent>
						<DialogContentText
							className="dialog-content"
							id="alert-dialog-description"
						>
							You will be charged {pricing} ETH
						</DialogContentText>
					</DialogContent>
					<DialogActions className="button-box">
						<Button
							className="confirm-option"
							onClick={handlePurchase}
						>
							Purchase
						</Button>
						<Button
							className="cancel-option"
							onClick={handleClose}
							autoFocus
						>
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
			</>
		)
	}

	return <>{renderDialog()}</>
}
