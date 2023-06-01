import { Container, Typography } from "@mui/material"
import LoginControl from "./LoginControl"

const Welcome = ({user}) => {
    console.log('welcome ' + JSON.stringify(user))
    return (<Container>
        {
            user.user !== null
            ? (<Typography variant="h3">Dobrodošli {user.user.user}</Typography>)
            : (<><Typography variant="h3">Dobrodošli</Typography>
            <Typography>Da bi mogli da koristite elektronski dnevnik, ulogujte se.</Typography>
            <LoginControl safePath={"/"} defaultPath={"/"} isInToolbar={false} /></>)
        }
        
    </Container>)
}

export default Welcome;