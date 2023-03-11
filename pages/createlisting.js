import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;

const auth = `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}`;

const client = ipfsHttpClient({
    host: "ipfs.infura.io",
    protocol: "https",
    port: 5001,
    headers: {
        authorization: auth,
    },
});

const DEDICATED_URL = "https://book-exchanged.infura-ipfs.io/ipfs/";
import { marketplaceAddress } from "../config";
import BookMarketplace from "../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json";
import { useRouter } from "next/router";
import { ethers } from "ethers";

// Themeing for MUI elements
const theme = createTheme({
    palette: {
        primary: {
            main: "#301934",
        },
        secondary: {
            main: "#11cb5f",
        },
    },
});

// Used to accept a file and display it to the user
const FileInput = ({ setFileURL }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

    async function fileHandler(e) {
        /*Upload image to IPFS */
        const file = e.target.files[0];
        setSelectedImage(file);
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = DEDICATED_URL + added.path;
            client.pin.add(added.path).then((res) => {
                setFileURL(url);
            });
        } catch (error) {
            console.error("Error uploading file", error);
        }
    }
    return (
        <>
            <input
                accept="image/*"
                type="file"
                id="select-image"
                style={{ display: "none" }}
                onChange={fileHandler}
            />
            <label htmlFor="select-image">
                <div className="search-button-box">
                    <ThemeProvider theme={theme}>
                        <Button
                            className="create-button"
                            variant="contained"
                            color="primary"
                            component="span"
                        >
                            Upload Image
                        </Button>
                    </ThemeProvider>
                </div>
            </label>
            {imageUrl && selectedImage && (
                <div className="search-button-box" mt={2} textAlign="center">
                    <img
                        src={imageUrl}
                        alt={selectedImage.name}
                        height="300px"
                    />
                </div>
            )}
        </>
    );
};

// Used to create a listing
export default function CreateListing() {
    const [alignment, setAlignment] = useState("active");
    const [header, setHeader] = useState("Create an Instant Sale Listing");
    const [formInput, updateFormInput] = useState({
        title: "",
        author: "",
        ISBN: "",
        courses: "",
        instantPrice: "",
        startingPrice: "",
    });
    const [fileURL, setFileURL] = useState(null);
    const router = useRouter();

    async function uploadToIPFS() {
        const { title, author, ISBN, instantPrice, startingPrice } = formInput;

        /*A list of courses' URL */
        const coursesURL = await uploadCourse();

        if (!title || !author || !ISBN || (!instantPrice && !startingPrice)) {
            return;
        }

        /* first, upload metadata to IPFS */

        const data = JSON.stringify({
            title,
            author,
            image: fileURL,
            ISBN,
            courses: coursesURL,
        });

        try {
            const added = await client.add(data);
            const url = DEDICATED_URL + added.path;
            /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
            return url;
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    async function uploadCourse() {
        const { courses } = formInput;

        if (!courses) return;

        /*Split using white-space */
        const courseList = courses.split(" ");

        /*Filter out courses that are not available first */

        /*For each course that is not available yet on IPFS, create a link */
        const URLs = await Promise.all(
            courseList.map(async (e) => {
                const data = JSON.stringify({ name: e });

                try {
                    const added = await client.add(data);
                    const url = DEDICATED_URL + added.path;
                    return url;
                    /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
                } catch (error) {
                    console.log("Error uploading course: ", courses);
                }
            })
        );

        return URLs;
    }

    async function listNFTForSale() {
        const url = await uploadToIPFS();
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        /* create the NFT */
        const price = ethers.utils.parseUnits(
            alignment === "active" ? formInput.instantPrice : "10000000",
            "ether"
        );

        const bidPrice =
            alignment === "past"
                ? ethers.utils.parseUnits(formInput.startingPrice, "ether")
                : 0;
        const allowBid = alignment === "past";

        /**Fetch contract */
        const contract = new ethers.Contract(
            marketplaceAddress,
            BookMarketplace.abi,
            signer
        );

        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
        try {
            let transaction = await contract.createToken(
                url,
                price,
                bidPrice,
                allowBid,
                {
                    value: listingPrice,
                }
            );
            await transaction.wait();
            router.push("/home");
        } catch (error) {
            console.log(error);
        }
    }

    // define toggle button style
    const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
        "&.Mui-selected, &.Mui-selected:hover": {
            color: "white",
            backgroundColor: selectedColor,
        },
    }));

    // swap between creating an auction or instant sale listing
    const handleChange = () => {
        if (alignment === "active") {
            setAlignment("past");
            setHeader("Create an Auction Listing");
        }

        if (alignment === "past") {
            setAlignment("active");
            setHeader("Create an Instant Sale Listing");
        }
    };

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
                        Instant
                    </ToggleButton>
                    <ToggleButton value="past" selectedColor=" #301934">
                        Auction
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <FileInput setFileURL={setFileURL}></FileInput>

            <div className="input-container">
                <Typography
                    className="search-header"
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                    marginTop={"5%"}
                >
                    Book Title
                </Typography>
                <TextField
                    className="create-input"
                    id="outlined-basic"
                    label="Ex. The C Programming Langauge"
                    variant="outlined"
                    value={formInput.title}
                    onChange={(e) =>
                        updateFormInput({ ...formInput, title: e.target.value })
                    }
                />
                <Typography
                    className="search-header"
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                >
                    Author
                </Typography>
                <TextField
                    className="create-input"
                    id="outlined-basic"
                    label="Ex. James Stewart"
                    variant="outlined"
                    value={formInput.author}
                    onChange={(e) =>
                        updateFormInput({
                            ...formInput,
                            author: e.target.value,
                        })
                    }
                />
                <Typography
                    className="search-header"
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                >
                    ISBN
                </Typography>
                <TextField
                    className="create-input"
                    id="outlined-basic"
                    label="Ex. 978-3-16-148410-0"
                    variant="outlined"
                    value={formInput.ISBN}
                    onChange={(e) =>
                        updateFormInput({
                            ...formInput,
                            ISBN: e.target.value,
                        })
                    }
                />
                <Typography
                    className="search-header"
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                >
                    Courses
                </Typography>
                <TextField
                    className="create-input"
                    id="outlined-basic"
                    label="Ex. 'CMPT-315 CMPT-101' (Seperate by whitespace) "
                    variant="outlined"
                    value={formInput.courses}
                    onChange={(e) =>
                        updateFormInput({
                            ...formInput,
                            courses: e.target.value,
                        })
                    }
                />
                <Typography
                    className="search-header"
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                >
                    {alignment === "active"
                        ? "Instant Price"
                        : "Starting Price"}
                </Typography>
                <TextField
                    className="create-input"
                    id="outlined-basic"
                    label="Ex. 35$"
                    variant="outlined"
                    value={
                        alignment === "active"
                            ? formInput.instantPrice
                            : formInput.startingPrice
                    }
                    onChange={(e) => {
                        if (alignment === "active") {
                            updateFormInput({
                                ...formInput,
                                instantPrice: e.target.value,
                            });
                            return;
                        }
                        updateFormInput({
                            ...formInput,
                            startingPrice: e.target.value,
                        });
                    }}
                />
                <ThemeProvider theme={theme}>
                    <div className="search-button-box">
                        <Button
                            className="create-button"
                            variant="contained"
                            color="primary"
                            onClick={listNFTForSale}
                        >
                            Create Listing
                        </Button>
                    </div>
                </ThemeProvider>
            </div>
        </Container>
    );
}
