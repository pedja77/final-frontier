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
import { useEffect, useState } from "react";
import { getToken } from "../../utils/token";
import { checkResponse } from "../../utils/responseChecker";
import AddNewButtons from "../lib/AddNewButtons";
import {
  isFormValid,
  validateConfirmedPassword,
  validateFirstName,
  validateLastName,
  validatePassword,
  validateUsername,
  validateWeeklyClasses,
} from "../../utils/validation";
import ValidatedTextField from "../lib/ValidatedTextField";

const ValidationIndex = {
  firstName: validateFirstName,
  lastName: validateLastName,
  weeklyClasses: validateWeeklyClasses,
  username: validateUsername,
  password: validatePassword,
  confirmedPassword: validateConfirmedPassword,
};

const teacherReducer = (draft, action) => {
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
      draft.errors = errorsInit;
      break;
    }
    case "validate": {
      if (action.key === "confirmedPassword") {
        draft.errors[action.key] = ValidationIndex[action.key](
          draft.teacher[action.key],
          draft.teacher.password
        );
      } else if (action.key === "username") {
        console.log(draft.usernames);
        draft.errors[action.key] = ValidationIndex[action.key](
          draft.teacher[action.key],
          draft.usernames
        );
      } else {
        draft.errors[action.key] = ValidationIndex[action.key](
          draft.teacher[action.key]
        );
      }
      draft.isFormValid = isFormValid(draft.errors, [
        "firstName",
        "lastName",
        "weeklyClasses",
        "username",
        "password",
        "confirmedPassword",
      ]);
      console.log(
        "isFormValid from reducer ",
        draft.isFormValid,
        JSON.stringify(draft.errors, null, 4)
      );
      break;
    }
    default: {
      throwError("Invalid action: ", action.type);
    }
  }
};

// const errorsInit = {
//   firstName: { valid: true, cause: "Ime" },
//   lastName: { valid: true, cause: "Prezime" },
//   weeklyClasses: { valid: true, cause: "Nedeljni fond" },
//   username: { valid: true, cause: "Korisničko ime" },
//   password: { valid: true, cause: "Lozinka" },
//   confirmedPassword: { valid: true, cause: "Potvrdjena lozinka" },
// };

const NewTeacher = () => {
  const [subjects, users] = useLoaderData();

  const fetcher = useFetcher();
  const nav = useNavigate();
  const [newTeacher, setNewTeacher] = useState({
    firstName: "",
    lastName: "",
    weeklyClasses: "",
    username: "",
    password: "",
    confirmedPassword: "",
    role: "ROLE_TEACHER",
    subjects: [],
  });
  const [state, dispatch] = useImmerReducer(teacherReducer, {
    teacher: structuredClone(newTeacher),
    errors: {},
    newSubject: null,
    isFormValid: false,
    usernames: users.map((u) => u.username),
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
      teacher: structuredClone(newTeacher),
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
      <Typography variant="h3">Unos podataka o novom nastavniku</Typography>
      <form>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ValidatedTextField
            label={"Ime"}
            type={"text"}
            id={"firstName"}
            value={state.teacher.firstName}
            {...validationContext}
            required
          />
          {/* <TextField
            label="Ime"
            name="firstName"
            value={state.teacher.firstName}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
          /> */}
          <ValidatedTextField
            label={"Prezime"}
            type={"text"}
            id={"lastName"}
            value={state.teacher.lastName}
            {...validationContext}
            required
          />
          {/* <TextField
            label="Prezime"
            name="lastName"
            value={state.teacher.lastName}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
          /> */}
          <ValidatedTextField
            label={"Nedeljni fond časova"}
            type={"number"}
            id={"weeklyClasses"}
            value={state.teacher.weeklyClasses}
            inputProps={{ min: 0, max: 40 }}
            {...validationContext}
            required
          />
          {/* <TextField
            label="Nedeljni fond časova"
            name="weeklyClasses"
            id="weeklyClasses"
            type="number"
            value={state.teacher.weeklyClasses}
            inputProps={{ min: 0, max: 40 }}
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
            onBlur={() => dispatch({type: 'validate', key: id})}
          /> */}
          <ValidatedTextField
            label={"Korisničko ime"}
            type={"text"}
            id={"username"}
            value={state.teacher.username}
            {...validationContext}
            required
          />
          {/* <TextField
            value={state.teacher.username}
            label="Novo korisničko ime"
            name="username"
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
          /> */}
          <ValidatedTextField
            label={"Lozinka"}
            type={"password"}
            id={"password"}
            value={state.teacher.password}
            {...validationContext}
            required
          />
          {/* <TextField
            value={state.teacher.password}
            label="Lozinka"
            name="password"
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
            type="password"
          /> */}
          <ValidatedTextField
            label={"Potvrdi lozinku"}
            type={"password"}
            id={"confirmedPassword"}
            value={state.teacher.confirmedPassword}
            {...validationContext}
            required
          />
          {/* <TextField
            value={state.teacher.confirmedPassword}
            label="Potvrdi lozinku"
            name="confirmedPassword"
            sx={{ marginBottom: 2 }}
            onChange={handleInputChanged}
            required
            type="password"
          /> */}

          <Box sx={{ marginY: 2 }}>
            <TableTemplate props={subjectsTableProps} />
            <AddItem props={subjectsAddItemProps} />
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

export default NewTeacher;
