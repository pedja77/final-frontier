import {
  Stack,
  Container,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { NavLink, useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { getToken, getUserRole } from "../../utils/token.js";
import { useImmerReducer } from "use-immer";
import { AddCard } from "@mui/icons-material";
import TeacherCard from "./TeacherCard";

const teachersReducer = (draft, action) => {
  switch (action.type) {
    case "search_changed": {
      draft.nameQuery = action.text;
      break;
    }
    case "teachers_changed": {
      draft.teachers = action.t;
      break;
    }
    default: {
      throwError("No such action: ", action.type);
    }
  }
};

const Teachers = () => {
  const t = useLoaderData();
  const [state, dispatch] = useImmerReducer(teachersReducer, {
    teachers: structuredClone(t),
    nameQuery: "",
  });
  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/teachers/search?q=${encodeURIComponent(state.nameQuery)}`,
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
          type: "teachers_changed",
          t: s,
        });
      }
    };
    getData();
    return () => (ignore = true);
  }, [state.nameQuery]);

  const handleSearchChange = (e) => {
    dispatch({
      type: "search_changed",
      text: e.target.value,
    });
  };

  // const handleGradeChange = (e) => {
  //   dispatch({
  //     type: "grade_changed",
  //     value: e.target.value,
  //   });
  // };

  return (
    <>
      <Stack direction="column">
        <Stack
          direction="row"
          sx={{ padding: "24px", justifyContent: "space-around" }}
        >
          <TextField
            placeholder="Pretraga po imenu nastavnika..."
            value={state.nameQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 8 }}
            name="subjectSearchTextField"
          />
          {getUserRole() === "ROLE_ADMIN" && ( // prikazi dodavanje novog predmeta samo ako je korisnik admin
            <Tooltip title="Dodaj novi predmet">
              <span>
                <IconButton size="larger" component={NavLink} to="/teachers/new">
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
          {state.teachers.map((el) => (
            <TeacherCard key={el.id} teacher={el} />
          ))}
        </Container>
      </Stack>
    </>
  );
};

export default Teachers;
