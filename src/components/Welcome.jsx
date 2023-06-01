import { Container, Typography } from "@mui/material";
import LoginControl from "./LoginControl";

const Welcome = () => {
  return (
    <Container
      sx={{
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: 'center',
        
      }}
    >
      <Typography variant="h3">Dobrodošli</Typography>
      <Typography>
        Da bi ste mogli da koristite elektronski dnevnik, ulogujte se.
      </Typography>
      <LoginControl safePath={"/"} defaultPath={"/"} isInToolbar={false} />
    </Container>
  );
};

export default Welcome;
