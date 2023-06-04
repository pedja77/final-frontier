import {
  Typography,
  Stack,
  Container,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { useFetcher, useLoaderData } from "react-router-dom";
import SubjectCard from "./SubjectCard";
import { useEffect, useState } from "react";
import {getToken} from '../../utils/token.js';
import { gradeToString } from "../../utils/textTools";
import { useFetchData } from "../../hooks/customHooks";

const Subjects = () => {
  const [subs, grades] = useLoaderData();
  const [subjects, setSubjects] = useState(subs);
  const [nameQuery, setNameQuery] = useState("");
  const [gradeQuery, setGradeQuery] = useState(0);

  // const fetcher = useFetcher();

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/subjects/search?query=${encodeURIComponent(
          nameQuery
        )}&grade=${encodeURIComponent(gradeQuery)}`,
        {
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
        }
      );
      console.log(ignore)
      if (!ignore) {
        console.log(ignore)
        const subs = await response.json();
        setSubjects(subs);
      }
    };
    getData();
    return () => ignore = true;
  }, [nameQuery, gradeQuery]);

  return (
    <>
      <Stack direction="column">
        <Stack direction="row" sx={{ padding: "24px" }}>
          <TextField
            placeholder="Pretraga po nazivu predmeta..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            sx={{ flexGrow: 8 }}
            name="subjectSearchTextField"
          />
          <Select
            value={gradeQuery}
            onChange={(e) => setGradeQuery(e.target.value)}
            sx={{ flexGrow: 2 }}
            placeholder="Razred"
          >
            <MenuItem value={0} key={0}>
              Svi razredi
            </MenuItem>
            <Divider />
            {grades.map((g) => (
              <MenuItem key={g.id} value={g.grade}>
                {gradeToString.get(g.grade)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gridAutoRows: "auto",
            gridGap: "20px",
            paddingBottom: "4vh",
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
