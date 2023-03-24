import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"

// This card is used for showing a user their own active listing
export default function MyListing(props) {
	console.log(props.courses)
	return (
		<Card className="book-card" sx={{ maxWidth: 345 }}>
			<CardMedia sx={{ height: 290 }} image={props.imgurl} title="Book" />
			<CardContent className="info-box">
				<Typography
					className="title-text"
					gutterBottom
					variant="h5"
					component="div"
					fontWeight="bold"
				>
					{props.title}
				</Typography>
				<Typography
					className="info-text"
					variant="body2"
					color="text.secondary"
				>
					{props.author}
				</Typography>
				<Typography
					className="info-text"
					variant="body2"
					color="text.secondary"
				>
					{props.isbn}
				</Typography>
				{!!props.courses &&
					props.courses.map((e) => (
						<Typography
							key={e.URL}
							className="info-text"
							variant="body2"
							color="text.secondary"
						>
							{e.name}
						</Typography>
					))}

				<Typography
					className="price-text"
					variant="body2"
					color="text.secondary"
					fontWeight="bold"
				>
					Listed: {props.pricing}ETH Retails: {props.retails}$
				</Typography>
			</CardContent>
		</Card>
	)
}
