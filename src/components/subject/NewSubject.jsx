import {
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useFetcher, useLoaderData } from "react-router-dom";
import { gradeToString } from "../../utils/textTools";
import { useImmerReducer } from "use-immer";
import TableTemplate from "../lib/TableTemplate";
import AddItem from "../lib/AddItem";
import { useEffect } from "react";
import { getToken } from "../../utils/token";
import { checkResponse } from "../../utils/responseChecker";

const subjectReducer = (draft, action) => {
  switch (action.type) {
    case "input_changed": {
      draft.subject[action.name] = action.value;
      break;
    }
    case "remove_item": {
      const index = draft.subject[action.collection].findIndex(
        (c) => c.id === action.item.id
      );
      if (index !== -1) {
        draft.subject[action.collection].splice(index, 1);
      }
      break;
    }
    case "set_new_option": {
      draft[action.optionType] = action.option;
      break;
    }
    case "add_new_item": {
      draft.subject[action.collection].push(draft[action.item]);
      draft[action.item] = null;
      break;
    }
    case "reset_form": {
      draft.subject = action.subject;
      break;
    }
    case "students_by_grade_changed": {
      draft.studentsByGrade = action.students;
      draft.subject.students = [];
      break;
    }
    default: {
      throwError("Invalid action: ", action.type);
    }
  }
};

const NewSubject = () => {
  const [grades, teachers] = useLoaderData();

  const fetcher = useFetcher();

  const [state, dispatch] = useImmerReducer(subjectReducer, {
    subject: {
      subjectName: "",
      weeklyFund: "",
      grade: "",
      teachers: [],
      students: [],
    },
    newTeacher: null,
    newStudent: null,
    studentsByGrade: [],
  });

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/students?grade=${
          state.subject.grade || 0
        }`,
        {
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
        }
      );
      checkResponse(response);
      if (!ignore) {
        const data = await response.json();
        console.log("students from effect " + JSON.stringify(data));
        dispatch({
          type: "students_by_grade_changed",
          students: data,
        });
      }
    };
    getData();
    return () => (ignore = true);
  }, [state.subject.grade]);

  const handleRemoveItem = (e, item, collection) => {
    dispatch({
      type: "remove_item",
      item,
      collection,
    });
  };

  const handleSetNewOption = (e, v, optionType) => {
    dispatch({
      type: "set_new_option",
      option: v,
      optionType,
    });
  };

  const handleAddNewItem = (item, collection) => {
    dispatch({
      type: "add_new_item",
      item,
      collection,
    });
  };

  const handleInputChanged = (e) => {
    dispatch({
      type: "input_changed",
      value: e.target.value,
      name: e.target.name,
    });
  };

  /*
   *    TODO:
   *       - kad se promeni razred, azurirati ucenike u autocompletu
   *
   */
  const teachersTableProps = {
    tableLabel: "Nastavnici",
    tableHeaders: ["Id", "Ime", "Prezime"],
    tableData: state.subject.teachers,
    tdConfig: ["id", "firstName", "lastName"],
    removeFn: handleRemoveItem,
    collectionName: "teachers",
  };

  const teachersAddItemProps = {
    itemName: "nastavnik",
    newItemName: "newTeacher",
    newItem: state.newTeacher,
    options: teachers,
    collection: "teachers",
    forFilterOptions: state.subject.teachers,
    labelOptions: ["firstName", "lastName"],
    handleSetNewOption,
    handleAddNewItem,
  };

  const studentsTableProps = {
    tableLabel: "Učenici",
    tableHeaders: ["Id", "Ime", "Prezime", "Datum rođenja"],
    tableData: state.subject.students,
    tdConfig: ["id", "firstName", "lastName", "dateOfBirth"],
    removeFn: handleRemoveItem,
    collectionName: "students",
  };

  const studentsAddItemProps = {
    itemName: "učenik",
    newItemName: "newStudent",
    newItem: state.newStudent,
    options: state.studentsByGrade,
    collection: "students",
    forFilterOptions: state.subject.students,
    labelOptions: ["firstName", "lastName"],
    handleSetNewOption,
    handleAddNewItem,
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
        {state.subject.grade != 0 && `Za ${gradeToString.get(state.subject.grade)} razred`}
      </Typography>
      <form>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
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
            <TableTemplate props={teachersTableProps} />
            <AddItem props={teachersAddItemProps} />

            <TableTemplate props={studentsTableProps} />
            <AddItem props={studentsAddItemProps} />
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
                  subject: {
                    subjectName: "",
                    weeklyFund: "",
                    grade: "",
                    teachers: [],
                    students: [],
                  },
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

export default NewSubject;
