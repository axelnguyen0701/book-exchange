import * as React from "react"
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

// Component used for purchasing an instant sale listing
export default function PurchaseDialog(props) {
	const [open, setOpen] = React.useState(false)

	// handle opening and closing menu
	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
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
		console.log(props.pricing, props.tokenId)
		/* user will be prompted to pay the asking proces to complete the transaction */
		const price = ethers.utils.parseUnits(props.pricing.toString())
		console.log(price)
		const transaction = await contract.createMarketSale(props.tokenId, {
			value: price,
		})
		await transaction.wait()
	}

	return (
		<>
			<Button className="option" size="small" onClick={handleClickOpen}>
				Buy
			</Button>
			<Dialog
				className="dialog-container"
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle className="dialog-title" id="alert-dialog-title">
					Confirm Purchase of {props.title}?
				</DialogTitle>
				<DialogContent>
					<DialogContentText
						className="dialog-content"
						id="alert-dialog-description"
					>
						{props.pricing}$ will be charged to your account.
					</DialogContentText>
				</DialogContent>
				<DialogActions className="button-box">
					<Button className="confirm-option" onClick={handlePurchase}>
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
