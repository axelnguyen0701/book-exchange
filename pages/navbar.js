import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import { useRouter } from "next/router"
import { useContext } from "react"
import { AppContext } from "./context/MetaContext"

const pages = [
	{ name: "search", route: "search" },
	{ name: "messages", route: "messages" },
	{ name: "listings", route: "listings" },
	{ name: "My Books", route: "mybooks" },
]
const settings = ["Create Listing", "Account"]

// Nav bar present across entire site
function ResponsiveAppBar(props) {
	const [anchorElNav, setAnchorElNav] = React.useState(null)
	const [anchorElUser, setAnchorElUser] = React.useState(null)
	const router = useRouter()
	const { connect, loaded, test, readProfile, profile } =
		useContext(AppContext)

	readProfile()

	// opening and closing the two menus
	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget)
	}
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	return (
		<Container>
			<AppBar className="navBar">
				<Container maxWidth="xl">
					<Toolbar className="toolBar">
						<Typography
							variant="h6"
							noWrap
							component="a"
							onClick={() => router.push("/home")}
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "sans-serif",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							OpenMarket
						</Typography>
						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "flex", md: "none" },
							}}
						>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => {
									return (
										<MenuItem
											key={page.name}
											onClick={() =>
												router.push("/" + page.route)
											}
										>
											<Typography textAlign="center">
												{page.name}
											</Typography>
										</MenuItem>
									)
								})}
							</Menu>
						</Box>

						<Typography
							variant="h5"
							noWrap
							component="a"
							onClick={() => router.push("/home")}
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "sans-serif",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							OpenMarket
						</Typography>
						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
							}}
						>
							{pages.map((page) => (
								<Button
									key={page.name}
									onClick={() =>
										router.push("/" + page.route)
									}
									sx={{
										my: 2,
										color: "white",
										display: "block",
									}}
								>
									{page.name}
								</Button>
							))}
						</Box>
						<Box sx={{ flexGrow: 0 }}>
							Welcome {profile.name + "    "}
							<Tooltip title="Account Actions">
								<IconButton
									onClick={handleOpenUserMenu}
									sx={{ p: 0 }}
								>
									<Avatar
										alt="Remy Sharp"
										src={profile.pic}
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{settings.map((setting) => (
									<MenuItem
										key={setting}
										onClick={() =>
											router.push(
												"/" +
													setting
														.toLowerCase()
														.replaceAll(" ", "")
											)
										}
									>
										<Typography textAlign="center">
											{setting}
										</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Toolbar></Toolbar>
		</Container>
	)
}
export default ResponsiveAppBar
