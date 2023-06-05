import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { gradeToString } from "../../utils/textTools";
import { Add, AddBox, AddBoxSharp, Delete, Edit } from "@mui/icons-material";
import { produce } from "immer";
import { useImmerReducer } from "use-immer";
import TableTemplate from "../lib/TableTemplate";

const subjectReducer = (draft, action) => {
  switch (action.type) {
    case 'input_changed': {
        draft.subject[action.name] = action.value;
        break;
    }
    case 'remove_item': {
        const index = draft.subject[action.collection].findIndex(
            c => c.id === action.item.id
        );
        if (index !== -1) {
            draft.subject[action.collection].splice(index, 1);
        }
        break;
    }
    case 'set_new_option': {
        draft[action.optionType] = action.option;
        break;
    }
    case 'add_new_item': {
        draft.subject[action.collection].push(draft[action.item]);
        draft[action.item] = null;
        break;
    }
    case "reset_form": {
      draft.subject = action.subject;
      break;
    }
    default: {
      throwError("Invalid action: ", action.type);
    }
  }
};

const Subject = () => {
  const [sub, grades, teachers, studentsByGrade] = useLoaderData();
  //   const [subject, setSubject] = useState(sub);
  //   const [newTeacher, setNewTeacher] = useState(null);
  //   const [newStudent, setNewStudent] = useState(null);
  const fetcher = useFetcher();

  const [state, dispatch] = useImmerReducer(subjectReducer, {
    subject: structuredClone(sub),
    newTeacher: null,
    newStudent: null,
  });

  const handleRemoveItem = (e, item, collection) => {
    dispatch({
        type: 'remove_item',
        item,
        collection
    })
  }

  const handleSetNewOption = (e, v, optionType) => {
    dispatch({
        type: 'set_new_option',
        option: v,
        optionType
    });
  }

  const handleAddNewItem = (item, collection) => {
    dispatch({
        type: 'add_new_item',
        item,
        collection
    })
  }

  const handleInputChanged = (e) => {
    dispatch({
        type: 'input_changed',
        value: e.target.value,
        name: e.target.name

    })
  }

  /*
*    TODO:
*       - kad se promeni razred, azurirati ucenike u autocompletu
*
*/
const teachersTableConfig = {
    tableLabel: "Nastavnici",
    tableHeaders: ["Id", "Ime", "Prezime"],
    tableData: state.subject.teachers,
    tdConfig: ["id", "firstName", "lastName"],
    removeFn: handleRemoveItem,
    collectionName: "teachers"
}

const studentsTableConfig = {
    tableLabel: "Učenici",
    tableHeaders: ["Id", "Ime", "Prezime", "Datum rođenja"],
    tableData: state.subject.students,
    tdConfig: ["id", "firstName", "lastName", "dateOfBirth"],
    removeFn: handleRemoveItem,
    collectionName: "students"
}

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "90%",
      }}
    >
      <Typography variant="h3">
        Podaci o predmetu {state.subject.subjectName}
      </Typography>
      <Typography variant="h5">
        Za {gradeToString.get(state.subject.grade)} razred
      </Typography>
      <form>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <FormLabel>id: {state.subject.id}</FormLabel>
          <TextField
            label="Naziv"
            name="subjectName"
            value={state.subject.subjectName}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
          />
          <TextField
            label="Nedeljni fond časova"
            name="weeklyFund"
            type="number"
            value={state.subject.weeklyFund}
            inputProps={{ min: 0 }}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
          />
          <TextField
            value={state.subject.grade}
            label="Razred"
            name="grade"
            select
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
          >
            {grades.map((g) => (
              <MenuItem key={g.id} value={g.grade}>
                {gradeToString.get(g.grade)}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ marginY: 2 }}>
            <TableTemplate props={teachersTableConfig} />
            {/* <FormLabel>Nastavnici:</FormLabel>
            <TableContainer>
              <Table
                sx={{ minWidth: "80%" }}
                size="small"
                aria-label="Nastavnici"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>id</TableCell>
                    <TableCell>Ime</TableCell>
                    <TableCell>Prezime</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.subject.teachers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.firstName}</TableCell>
                      <TableCell>{t.lastName}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Obriši">
                          <IconButton
                            onClick={(e) => handleRemoveItem(e, t, 'teachers')}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Izmeni">
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Autocomplete
                sx={{ width: "90%" }}
                options={teachers.filter((t) =>
                  state.subject.teachers.every((st) => st.id !== t.id)
                )}
                getOptionLabel={(a) => `${a.firstName} ${a.lastName}`}
                renderInput={(params) => (
                  <TextField {...params} label="Dodeli predmet nastavniku" />
                )}
                value={state.newTeacher}
                onChange={(e, v) => handleSetNewOption(e, v, 'newTeacher')}
              />
              <Tooltip title="Dodaj novog nastavnika">
                <span>
                  <IconButton
                    disabled={state.newTeacher === null}
                    size="large"
                    onClick={() => handleAddNewItem('newTeacher', 'teachers')}
                    // onClick={() => {
                    //   dispatch({ type: "add_new_teacher" });
                    // }}
                  >
                    <AddBoxSharp fontSize="large" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <TableTemplate props={studentsTableConfig} />
            {/* <FormLabel>Učenici:</FormLabel>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="Učenici">
                <TableHead>
                  <TableRow>
                    <TableCell>id</TableCell>
                    <TableCell>Ime</TableCell>
                    <TableCell>Prezime</TableCell>
                    <TableCell>Datum rođenja</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {console.log(state.subject.students)}
                  {state.subject.students.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.firstName}</TableCell>
                      <TableCell>{t.lastName}</TableCell>
                      <TableCell>{t.dateOfBirth}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Obriši">
                          <IconButton
                            onClick={(e) => handleRemoveItem(e, t, 'students')}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Izmeni">
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Autocomplete
                sx={{ width: "90%" }}
                options={studentsByGrade.filter((t) =>
                  state.subject.students.every((st) => st.id !== t.id)
                )}
                getOptionLabel={(a) => `${a.firstName} ${a.lastName}`}
                renderInput={(params) => (
                  <TextField {...params} label="Dodeli predmet učeniku" />
                )}
                value={state.newStudent}
                onChange={(e, v) => handleSetNewOption(e, v, 'newStudent')}
              />

              <Tooltip title="Dodaj novog učenika">
                <span>
                  <IconButton
                    disabled={state.newStudent === null}
                    size="large"
                    onClick={() => handleAddNewItem('newStudent', 'students')}
                  >
                    <AddBoxSharp fontSize="large" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <FormGroup sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              variant="outlined"
              onClick={() => {
                console.log(JSON.stringify(state.subject, null, 4));
                let s = structuredClone(state.subject);
                s.students = JSON.stringify(state.subject.students);
                s.teachers = JSON.stringify(state.subject.teachers);
                fetcher.submit(s, {
                  method: "put",
                  action: `/subjects/${state.subject.id}`,
                });
              }}
            >
              Sačuvaj
            </Button>
            <Button
              variant="contained"
              sx={{ marginRight: 1 }}
              onClick={() =>
                dispatch({
                  type: "reset_form",
                  subject: sub,
                })
              }
            >
              Otkaži
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Container>
  );
};

export default Subject;
