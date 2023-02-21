import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";

// Page for messaging
export default function Messages() {
  return (
    <Container>
      <ResponsiveAppBar />
      <div className="titleHeader">
        <h1 className="title">Messages</h1>
      </div>
    </Container>
  );
}
