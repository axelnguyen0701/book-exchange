import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { ethers } from "ethers"
import { Button, Container, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Web3Modal from "web3modal"
import { marketplaceAddress } from "@/config"
import BookMarketplace from "../../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json"
import { useRouter } from "next/router"

export default function BidTable({ bidList, seller, tokenId }) {
	const [isSeller, setIsSeller] = useState(false)
	const [isAcceptedBidder, setIsAcceptedBidder] = useState(false)
	const router = useRouter()

	useEffect(() => {
		async function checkIsSeller() {
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner()
			const signerAddress = await signer.getAddress()

			setIsSeller(seller === signerAddress)
		}
		checkIsSeller()
	}, [seller])

	useEffect(() => {
		async function checkIsAcceptedBidder() {
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner()
			const signerAddress = await signer.getAddress()

			setIsAcceptedBidder(
				bidList[bidList.length - 1].bidder === signerAddress
			)
		}
		checkIsAcceptedBidder()
	}, [bidList])

	async function acceptBidHandler() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(
			marketplaceAddress,
			BookMarketplace.abi,
			signer
		)

		try {
			const transaction = await contract.createBiddingSale(tokenId)
			await transaction.wait()
			router.push("/home")
		} catch (e) {
			alert(e)
		}
	}

	async function confirmBidHandler() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(
			marketplaceAddress,
			BookMarketplace.abi,
			signer
		)

		try {
			const transaction = await contract.acceptBiddingSale(
				tokenId,
				bidList.length - 1,
				{
					value: bidList[bidList.length - 1].bidAmount.toString(),
				}
			)
			await transaction.wait()
			router.push("/mybooks")
		} catch (e) {
			alert(e)
		}
	}

	if (bidList.length === 1) {
		return (
			<Container>
				<Typography>No bid has been made</Typography>
			</Container>
		)
	}

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Rank</TableCell>
						<TableCell align="right">Bidder</TableCell>
						<TableCell align="right">Amount</TableCell>
						<TableCell align="right">Accepted</TableCell>
						{isSeller && (
							<TableCell align="right">Accept</TableCell>
						)}
						{isAcceptedBidder && (
							<TableCell align="right">Confirm</TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{bidList
						.slice(1)
						.sort((a, b) => b.bidAmount - a.bidAmount)
						.map((bid, index) => (
							<TableRow
								key={bid.bidder}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
								}}
							>
								<TableCell component="th" scope="row">
									{index + 1}
								</TableCell>
								<TableCell align="right">
									{bid.bidder}
								</TableCell>
								<TableCell align="right">
									{ethers.utils.formatUnits(
										bid.bidAmount.toString()
									)}{" "}
									ETH
								</TableCell>
								<TableCell align="right">
									{bid.chosen ? "Yes" : "No"}
								</TableCell>
								{isSeller && index === 0 && (
									<TableCell align="right">
										<Button
											onClick={acceptBidHandler}
											disabled={bid.chosen}
										>
											Accept
										</Button>
									</TableCell>
								)}
								{isAcceptedBidder && bid.chosen && (
									<TableCell align="right">
										<Button onClick={confirmBidHandler}>
											Confirm
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
