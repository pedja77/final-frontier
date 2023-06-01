import { Typography, Stack, Container } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import SubjectCard from "./SubjectCard";

const Subjects = () => {
  const subjects = useLoaderData();

  return (
    <>
      <Stack direction="column">
        {/* <Stack direction="row" sx={{padding: "24px"}}>
          <TextField placeholder="Pretraga..." value={q} onChange={e => setQ(e.target.value)} sx={{flexGrow: 8}}/>
          <Select value={g} onChange={e => setG(e.target.value)} sx={{flexGrow: 2}}>
              <MenuItem value={""} key={0}>Svi</MenuItem>
              {genres.map(gg => <MenuItem keys={gg.id} value={gg.name}>{gg.name}</MenuItem>)}
          </Select>                
      </Stack> */}
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gridAutoRows: "auto",
            gridGap: "20px",
            paddingBottom: "4vh"
          }}
        >
          {subjects.map((el) => (
            <SubjectCard key={el.id} subject={el} />
          ))}
        </Container>
      </Stack>
    </>
  );
};

export default Subjects;
