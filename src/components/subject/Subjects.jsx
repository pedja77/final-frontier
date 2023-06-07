import {
  Typography,
  Stack,
  Container,
  TextField,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useLoaderData } from "react-router-dom";
import SubjectCard from "./SubjectCard";
import { useEffect } from "react";
import { getToken, getUserRole } from "../../utils/token.js";
import { gradeToString } from "../../utils/textTools";
import { useImmerReducer } from "use-immer";
import { AddCard } from "@mui/icons-material";

const subjectsReducer = (draft, action) => {
  switch (action.type) {
    case "search_changed": {
      draft.nameQuery = action.text;
      break;
    }
    case "grade_changed": {
      draft.gradeQuery = action.value;
      break;
    }
    case "subjects_changed": {
      draft.subjects = action.sub;
      break;
    }
    default: {
      throwError("No such action: ", action.type);
    }
  }
};

const Subjects = () => {
  const [subs, grades] = useLoaderData();

  const [state, dispatch] = useImmerReducer(subjectsReducer, {
    subjects: structuredClone(subs),
    nameQuery: "",
    gradeQuery: 0,
  });

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/subjects/search?query=${encodeURIComponent(
          state.nameQuery
        )}&grade=${encodeURIComponent(state.gradeQuery)}`,
        {
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
        }
      );
      if (!ignore) {
        const s = await response.json();
        dispatch({
          type: "subjects_changed",
          sub: s,
        });
      }
    };
    getData();
    return () => (ignore = true);
  }, [state.nameQuery, state.gradeQuery]);

  const handleSearchChange = (e) => {
    dispatch({
      type: "search_changed",
      text: e.target.value,
    });
  };

  const handleGradeChange = (e) => {
    dispatch({
      type: "grade_changed",
      value: e.target.value,
    });
  };

  return (
    <>
      <Stack direction="column">
        <Stack
          direction="row"
          sx={{ padding: "24px", justifyContent: "space-around" }}
        >
          <TextField
            placeholder="Pretraga po nazivu predmeta..."
            value={state.nameQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 8 }}
            name="subjectSearchTextField"
          />
          <Select
            value={state.gradeQuery}
            onChange={handleGradeChange}
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
          {getUserRole() === "ROLE_ADMIN" && ( // prikazi dodavanje novog predmeta samo ako je korisnik admin
            <Tooltip title="Dodaj novi predmet">
              <span>
                <IconButton size="larger" href="/subjects/new">
                  <AddCard fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
          )}
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
          {state.subjects.map((el) => (
            <SubjectCard key={el.id} subject={el} />
          ))}
        </Container>
      </Stack>
    </>
  );
};

export default Subjects;
