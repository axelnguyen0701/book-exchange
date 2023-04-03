import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { ethers } from "ethers"
import { Container, Typography } from "@mui/material"

export default function BidTable({ bidList }) {
	console.log(bidList)
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
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
