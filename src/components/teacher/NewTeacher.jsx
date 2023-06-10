import {
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  MenuItem,
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
import AddNewButtons from "../lib/AddNewButtons";

const subjectReducer = (draft, action) => {
  switch (action.type) {
    case "input_changed": {
      draft.teacher[action.name] = action.value;
      break;
    }
    case "remove_item": {
      const index = draft.teacher[action.collection].findIndex(
        (c) => c.id === action.item.id
      );
      if (index !== -1) {
        draft.teacher[action.collection].splice(index, 1);
      }
      break;
    }
    case "set_new_option": {
      draft[action.optionType] = action.option;
      break;
    }
    case "add_new_item": {
      draft.teacher[action.collection].push(draft[action.item]);
      draft[action.item] = null;
      break;
    }
    case "reset_form": {
      draft.teacher = action.teacher;
      break;
    }
    default: {
      throwError("Invalid action: ", action.type);
    }
  }
};

const NewTeacher = () => {
  const subjects = useLoaderData();

  const fetcher = useFetcher();
  const nav = useNavigate();
  const [state, dispatch] = useImmerReducer(subjectReducer, {
    teacher: {
      firstName: "",
      lastName: "",
      weeklyClasses: "",
      username: "",
      password: "",
      confirmedPassword: "",
      role: "ROLE_TEACHER",
      subjects: [],
    },
    newSubject: null,
  });

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

  const onSaveClick = () => {
    let s = structuredClone(state.teacher);
    s.subjects = JSON.stringify(state.teacher.subjects);
    fetcher.submit(s, {
      method: "post",
      action: `/teachers/new`,
    });
    nav("/teachers");
  };

  const onResetClick = () =>
    dispatch({
      type: "reset_form",
      teacher: {
        firstName: "",
        lastName: "",
        weeklyClasses: "",
        username: "",
        password: "",
        confirmedPassword: "",
        role: "ROLE_TEACHER",
        subjects: [],
      },
    });

  const subjectsTableProps = {
    tableLabel: "Predmeti",
    tableHeaders: ["Id", "Naziv", "Razred"],
    tableData: state.teacher.subjects,
    tdConfig: ["id", "subjectName", "grade"],
    removeFn: handleRemoveItem,
    collectionName: "subjects",
  };

  const subjectsAddItemProps = {
    itemName: "predmet",
    newItemName: "newSubject",
    newItem: state.newSubject,
    options: subjects,
    collection: "subjects",
    forFilterOptions: state.teacher.subjects,
    labelOptions: ["subjectName", "grade"],
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
      <Typography variant="h3">Unos podataka o novom nastavniku</Typography>
      <form>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Ime"
            name="firstName"
            value={state.teacher.firstName}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
          />
          <TextField
            label="Prezime"
            name="lastName"
            value={state.teacher.lastName}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
          />
          <TextField
            label="Nedeljni fond časova"
            name="weeklyClasses"
            type="number"
            value={state.teacher.weeklyClasses}
            inputProps={{ min: 0 }}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
          />
          <TextField
            value={state.teacher.username}
            label="Novo korisničko ime"
            name="username"
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
          />
          <TextField
            value={state.teacher.password}
            label="Lozinka"
            name="password"
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
            type="password"
          />
          <TextField
            value={state.teacher.confirmedPassword}
            label="Potvrdi lozinku"
            name="confirmedPassword"
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
            type="password"
          />

          <Box sx={{ marginY: 2 }}>
            <TableTemplate props={subjectsTableProps} />
            <AddItem props={subjectsAddItemProps} />
          </Box>
          <AddNewButtons
            onResetClick={onResetClick}
            onSaveClick={onSaveClick}
          />
        </FormControl>
      </form>
    </Container>
  );
};

export default NewTeacher;
