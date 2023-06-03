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
  Paper,
  Select,
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
import { useLoaderData, useNavigate } from "react-router-dom";
import { gradeToString } from "../../utils/textTools";
import { Add, AddBox, AddBoxSharp, Delete, Edit } from "@mui/icons-material";
import { produce } from "immer";

const Subject = () => {
  const [sub, grades, teachers, studentsByGrade] = useLoaderData();
  const [subject, setSubject] = useState(sub);
  const [newTeacher, setNewTeacher] = useState(null);
  const [newStudent, setMewStudent] = useState(null);

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
        Podaci o predmetu {subject.subjectName}
      </Typography>
      <Typography variant="h5">
        Za {gradeToString.get(subject.grade)} razred
      </Typography>
      <form>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <FormLabel>id: {subject.id}</FormLabel>
          <TextField
            label="Naziv"
            value={subject.subjectName}
            sx={{ marginBottom: 2 }}
            onChange={(e) =>
              setSubject(
                produce((draft) => {
                  draft.subjectName = e.target.value;
                })
              )
            }
          />
          <TextField
            label="Nedeljni fond časova"
            type="number"
            value={subject.weeklyFund}
            inputProps={{ min: 0 }}
            sx={{ marginBottom: 2 }}
            onChange={(e) =>
              setSubject(
                produce((draft) => {
                  draft.weeklyFund = e.target.value;
                })
              )
            }
          />
          <TextField
            value={subject.grade}
            // onChange={(e) => setGradeQuery(e.target.value)}
            // sx={{ flexGrow: 2 }}
            // placeholder="Razred"
            label="Razred"
            select
            sx={{ marginBottom: 2 }}
            onChange={(e) => setSubject({ ...subject, grade: e.target.value })}
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
                  {subject.teachers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.firstName}</TableCell>
                      <TableCell>{t.lastName}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Obriši">
                          <IconButton
                            onClick={(e) =>
                              setSubject(
                                produce(subject, (draft) => {
                                  const index = draft.teachers.findIndex(
                                    (v) => v.id === t.id
                                  );
                                  if (index !== -1) draft.teachers.splice(index, 1);
                                })
                              )
                            }
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
                options={teachers} //.filter(t => subject.teachers.every(st => st.id !== t.id))}
                getOptionLabel={(a) => `${a.firstName} ${a.lastName}`}
                renderInput={(params) => (
                  <TextField {...params} label="Dodeli predmet nastavniku" />
                )}
                value={newTeacher}
                onChange={(e, v) => {
                  setNewTeacher(v); // teachers ne mutiramo, ok da je referenca?????!!!???
                }}
              />
              <Tooltip title="Dodaj novog nastavnika">
                <IconButton
                  size="large"
                  onClick={() =>
                    setSubject(
                      produce((draft) => {
                        draft.teachers.push(newTeacher);
                      })
                    )
                  }
                >
                  <AddBoxSharp fontSize="large" />
                </IconButton>
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
                  {subject.students.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.firstName}</TableCell>
                      <TableCell>{t.lastName}</TableCell>
                      <TableCell>{t.dateOfBirth}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Obriši">
                          <IconButton>
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
              <TextField
                select
                label="Dodeli predmet učeniku"
                sx={{ width: "90%" }}
              >
                {studentsByGrade.map((s) => (
                  <MenuItem
                    key={s.id}
                  >{`${s.firstName} ${s.lastName}`}</MenuItem>
                ))}
              </TextField>
              <Tooltip title="Dodaj novog učenika">
                <IconButton size="large">
                  <AddBoxSharp fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <FormGroup sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button variant="outlined">Sačuvaj</Button>
            <Button variant="contained" sx={{ marginRight: 1 }}>
              Otkaži
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Container>
  );
};

export default Subject;
