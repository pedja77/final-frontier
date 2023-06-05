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

const subjectReducer = (draft, action) => {
  switch (action.type) {
    case "subject_name_changed": {
      draft.subject.subjectName = action.name;
      break;
    }
    case "weekly_fund_changed": {
      draft.subject.weeklyFund = action.fund;
      break;
    }
    case "grade_changed": {
      draft.subject.grade = action.grade;
      break;
    }
    case "remove_teacher": {
      console.log("remove_teacher " + JSON.stringify(action.teacher));
      const index = draft.subject.teachers.findIndex(
        (t) => t.id === action.teacher.id
      );
      if (index !== -1) {
        draft.subject.teachers.splice(action.index, 1);
      }
      break;
    }
    case "set_new_teacher": {
      draft.newTeacher = action.teacher;
      break;
    }
    case "add_new_teacher": {
      draft.subject.teachers.push(draft.newTeacher);
      draft.newTeacher = null;
      break;
    }
    case "remove_student": {
      draft.subject.students.splice(action.index, 1);
      break;
    }
    case "set_new_student": {
      draft.newStudent = action.student;
      break;
    }
    case "add_new_student": {
      draft.subject.students.push(draft.newStudent);
      draft.newStudent = null;
      break;
    }
    case "reset_form": {
      draft = action.newState;
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

  const handleRemoveTeacher = (e, teacher) => {
    //    const index = state.teachers.findIndex(t => t.id === teacher.id);
    //    if (index !== -1) {
    //     dispatch({
    //         type: 'remove_teacher',
    //         index
    //     })
    //    }
    dispatch({
      type: "remove_teacher",
      teacher,
    });
  };

  const handleRemoveStudent = (e, student) => {
    const index = state.subject.students.findIndex((s) => s.id === student.id);
    if (index !== -1) {
      dispatch({
        type: "remove_student",
        index,
      });
    }
  };

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
            value={state.subject.subjectName}
            sx={{ marginBottom: 2 }}
            onChange={(e) =>
              dispatch({
                type: "subject_name_changed",
                name: e.target.value,
              })
            }
          />
          <TextField
            label="Nedeljni fond časova"
            type="number"
            value={state.subject.weeklyFund}
            inputProps={{ min: 0 }}
            sx={{ marginBottom: 2 }}
            onChange={(e) =>
              dispatch({
                type: "weekly_fund_changed",
                fund: e.target.value,
              })
            }
          />
          <TextField
            value={state.subject.grade}
            label="Razred"
            select
            sx={{ marginBottom: 2 }}
            onChange={(e) => {
              dispatch({
                type: "grade_changed",
                grade: e.target.value,
              });
            }}
          >
            {grades.map((g) => (
              <MenuItem key={g.id} value={g.grade}>
                {gradeToString.get(g.grade)}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ marginY: 2 }}>
            <FormLabel>Nastavnici:</FormLabel>
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
                            onClick={(e) => handleRemoveTeacher(e, t)}
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
            </TableContainer>
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
                onChange={(e, v) => {
                  dispatch({
                    type: "set_new_teacher",
                    teacher: v,
                  });
                }}
              />
              <Tooltip title="Dodaj novog nastavnika">
                <span>
                  <IconButton
                    disabled={state.newTeacher === null}
                    size="large"
                    onClick={() => {
                      dispatch({ type: "add_new_teacher" });
                    }}
                  >
                    <AddBoxSharp fontSize="large" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ marginY: 2 }}>
            <FormLabel>Učenici:</FormLabel>
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
                  {state.subject.students.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.firstName}</TableCell>
                      <TableCell>{t.lastName}</TableCell>
                      <TableCell>{t.dateOfBirth}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Obriši">
                          <IconButton
                            onClick={(e) => handleRemoveStudent(e, t)}
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
            </TableContainer>
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
                onChange={(e, v) =>
                  dispatch({
                    type: "set_new_student",
                    student: v,
                  })
                }
              />

              <Tooltip title="Dodaj novog učenika">
                <span>
                  <IconButton
                    disabled={state.newStudent === null}
                    size="large"
                    onClick={() => dispatch({ type: "add_new_student" })}
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
                console.log(JSON.stringify(subject, null, 4));
                let s = structuredClone(subject);
                s.students = JSON.stringify(subject.students);
                s.teachers = JSON.stringify(subject.teachers);
                fetcher.submit(s, {
                  method: "put",
                  action: `/subjects/${subject.id}`,
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
                  newState: sub,
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
