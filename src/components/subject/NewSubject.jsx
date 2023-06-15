import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormGroup,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { gradeToString } from "../../utils/textTools";
import { useImmerReducer } from "use-immer";
import TableTemplate from "../lib/TableTemplate";
import AddItem from "../lib/AddItem";
import { useEffect } from "react";
import { getToken } from "../../utils/token";
import { checkResponse } from "../../utils/responseChecker";
import {
  isFormValid,
  validateGrade,
  validateSubjectName,
  validateWeeklyFund,
} from "../../utils/validation";
import ValidatedTextField from "../lib/ValidatedTextField";
import AddNewButtons from "../lib/AddNewButtons";

const ValidationIndex = {
  subjectName: validateSubjectName,
  weeklyFund: validateWeeklyFund,
  grade: validateGrade,
};

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
    case "validate": {
      draft.errors[action.key] = ValidationIndex[action.key](
        draft.subject[action.key]
      );
      draft.isFormValid = isFormValid(draft.errors, [
        "subjectName",
        "weeklyFund",
        "grade"
      ]);
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
  const nav = useNavigate();

  const [state, dispatch] = useImmerReducer(subjectReducer, {
    subject: {
      subjectName: "",
      weeklyFund: "",
      grade: 0,
      teachers: [],
      students: [],
    },
    errors: {},
    newTeacher: null,
    newStudent: null,
    studentsByGrade: [], 
    isFormValid: false,
  });

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      console.log("fromEffect", state.subject.grade);
      const response = await fetch(
        `http://localhost:8080/api/v1/students/grade/${state.subject.grade}`,
        {
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
        }
      );
      // checkResponse(response);
      if (!ignore) {
        const data = await response.json();
        console.log("students from effect ", data.length);
        dispatch({
          type: "students_by_grade_changed",
          students: data,
        });
      }
    };
    getData();
    return () => (ignore = true);
  }, [state.subject.grade]);

  useEffect(() => {
    if(fetcher.data) {
      console.log('new subject fetcher.data', JSON.stringify(fetcher.data, null, 4));
      nav('/subjects');
    }
  },[fetcher.data]);

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

  const onResetClick = () =>
    dispatch({
      type: "reset_form",
      subject: {
        subjectName: "",
        weeklyFund: "",
        grade: 0,
        teachers: [],
        students: [],
      },
    });

  const onSaveClick = () => {
    // console.log(JSON.stringify(state.subject, null, 4));
    let s = structuredClone(state.subject);
    s.students = JSON.stringify(state.subject.students);
    s.teachers = JSON.stringify(state.subject.teachers);
    fetcher.submit(s, {
      method: "post",
      action: `/subjects/new`,
    });
  };

  const teachersTableProps = {
    tableLabel: "Nastavnici",
    tableHeaders: ["Id", "Ime", "Prezime"],
    tableData: state.subject.teachers,
    tdConfig: ["id", "firstName", "lastName"],
    removeFn: handleRemoveItem,
    collectionName: "teachers",
    editUrl: '/teachers'
  };

  const teachersAddItemProps = {
    itemName: "nastavnika",
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
    itemName: "učenika",
    newItemName: "newStudent",
    newItem: state.newStudent,
    options: state.studentsByGrade,
    collection: "students",
    forFilterOptions: state.subject.students,
    labelOptions: ["firstName", "lastName"],
    handleSetNewOption,
    handleAddNewItem,
  };

  const validationContext = {
    dispatch,
    generateOnChanged: handleInputChanged,
    state,
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
      <Typography variant="h3">Dodavanje novog predmeta</Typography>
      <Typography variant="h5">
        {state.subject.grade != 0 &&
          `Za ${gradeToString.get(state.subject.grade)} razred`}
      </Typography>
      <form>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ValidatedTextField
            id={"subjectName"}
            label={"Naziv"}
            type={"text"}
            required
            value={state.subject.subjectName}
            {...validationContext}
          />
         
          <ValidatedTextField
            label={"Nedeljni fond časova"}
            type={"number"}
            id={"weeklyFund"}
            value={state.subject.weeklyFund}
            inputProps={{ min: 0, max: 5 }}
            {...validationContext}
            required
          />
         
          <Select
            required
            value={state.subject.grade}
            onChange={handleInputChanged}
            sx={{ flexGrow: 2 }}
            placeholder="Razred"
            name={"grade"}
            id="grade"
            onBlur={(e) => {
              dispatch({
                type: "validate",
                key: "grade",
              });
            }}
          >
            <MenuItem value={0} key={0}>
              Odaberite razred*
            </MenuItem>
            <Divider />

            {grades.map((g) => (
              <MenuItem key={g.id} value={g.grade}>
                {gradeToString.get(g.grade)}
              </MenuItem>
            ))}
          </Select>
          
          <Box sx={{ marginY: 2 }}>
            <TableTemplate props={teachersTableProps} />
            <AddItem props={teachersAddItemProps} />

            <TableTemplate props={studentsTableProps} />
            <AddItem props={studentsAddItemProps} disabled={state.subject.grade === 0}/>
          </Box>
          <AddNewButtons
            onResetClick={onResetClick}
            onSaveClick={onSaveClick}
            isFormValid={state.isFormValid}
          />
        </FormControl>
      </form>
    </Container>
  );
};

export default NewSubject;
