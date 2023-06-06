import { Box, Container, Icon, Stack, Typography } from "@mui/material";
import { Navigate, useRouteError } from "react-router-dom";

const Error = ({ entity }) => {
  const error = useRouteError();
  console.log('error ' + error)
  switch (error.cause) {
    case "login": {
      return <Navigate to="/" />;
    }
    default: {
      return (
        <Container>
          <Stack direction={"column"} spacing={1}>
            <Typography variant="h4">
              Desila se greška u učitavanju {/*{entity} */}
            </Typography>
            <Typography>
              Jako nam je žao. Da li ste pokrenuli back-end server, možda?
            </Typography>
            <Typography variant="h6">Interna greška je: </Typography>
            <Box>
              <pre>{error.message}</pre>
            </Box>
          </Stack>
        </Container>
      );
    }
  }


  // if(error.cause === 'login'){
  //   return <Navigate to="/"/>;
  // }else if(error.cause === 'security'){
  //   return <Container><Stack direction={'row'}>
  //     <Icon><Error/></Icon>
  //     <Typography variant='h4'>ACCESS DENIED</Typography>
  //     <Icon><Error/></Icon>
  //   </Stack></Container>
  // }
  // return <Container>
  //   <Stack direction={'column'} spacing={1}>
  //     <Typography variant='h4'>Desila se greška u učitavanju {entity}</Typography>
  //     <Typography>
  //     Jako nam je žao. Da li ste pokrenuli back-end server, možda?
  //     </Typography>
  //     <Typography variant='h6'>Interna greška je: </Typography>
  //     <Box>
  //       <pre>
  //         {error.message}
  //       </pre>
  //     </Box>
  //   </Stack>
  // </Container>
};

export default Error;
