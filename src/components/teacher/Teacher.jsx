import {
  Avatar,
  Box,
  Container,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import TableTemplate from "../lib/TableTemplate";
import AddItem from "../lib/AddItem";
import { getUserRole } from "../../utils/token";
import EditButtons from "../lib/EditButtons";
import {
  isFormValid,
  validateFirstName,
  validateLastName,
  validateWeeklyClasses,
} from "../../utils/validation";
import ValidatedTextField from "../lib/ValidatedTextField";

const ValidationIndex = {
  firstName: validateFirstName,
  lastName: validateLastName,
  weeklyClasses: validateWeeklyClasses,
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
      for (const k in ValidationIndex) {
        state.errors[k] = ValidationIndex[k](state.teacher[k]);
      }
      break;
    }
    case "validate": {
      draft.errors[action.key] = ValidationIndex[action.key](
        draft.teacher[action.key]
      );
      draft.isFormValid = isFormValid(draft.errors, [
        "firstName",
        "lastName",
        "weeklyClasses",
      ]);
      break;
    }
    default: {
      throw ("Invalid action: ", action.type);
    }
  }
};

const Teacher = () => {
  const [teacher, subjectsByTeacher, subjects] = useLoaderData();
  const fetcher = useFetcher();
  const nav = useNavigate();
  const [state, dispatch] = useImmerReducer(teacherReducer, {
    teacher: {
      ...teacher,
      subjects: subjectsByTeacher,
    },
    errors: {
      firstName: validateFirstName(teacher.firstName),
      lastName: validateLastName(teacher.lastName),
      weeklyClasses: validateWeeklyClasses(teacher.weeklyClasses),
    },
    newSubject: null,
    newStudent: null,
    isFormValid: true,
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

  const onResetClick = () =>
    dispatch({
      type: "reset_form",
      teacher: {
        ...teacher,
        subjects: subjectsByTeacher,
      },
    });

  const onDeleteClick = () => {
    fetcher.submit(
      {},
      {
        method: "delete",
        action: `/teachers/${state.teacher.id}`,
      }
    );
    nav("/teachers");
  };

  const onSaveClick = async () => {
    console.log(JSON.stringify(state.teacher, null, 4));
    let s = structuredClone(state.teacher);
    s.subjects = JSON.stringify(state.teacher.subjects);
    fetcher.submit(s, {
      method: "put",
      action: `/teachers/${state.teacher.id}`,
    });
    nav("/teachers");
  };

  const subjectsTableProps = {
    tableLabel: "Predmeti",
    tableHeaders: ["Id", "Naziv predmeta", "Razred"],
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
      <Typography variant="h3">{`${state.teacher.firstName} ${state.teacher.lastName}`}</Typography>
      <Avatar
        src={`../teacher_${state.teacher.id}.jpg`}
        sx={{ width: "8rem", height: "6rem" }}
      >
        <img src="../avatar.png" style={{ width: "8rem", height: "6rem" }} />
      </Avatar>
      <form>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <FormLabel>id: {state.teacher.id}</FormLabel>
          {getUserRole() === "ROLE_ADMIN" ? (
            <>
              <ValidatedTextField
                label={"Ime"}
                type={"text"}
                id={"firstName"}
                value={state.teacher.firstName}
                {...validationContext}
              />
              {/* <TextField
                label="Ime"
                name="firstName"
                value={state.teacher.firstName}
                sx={{ marginBottom: 2 }}
                onChange={handleInputChanged}
              /> */}
              <ValidatedTextField
                label="Prezime"
                type={"text"}
                id={"lastName"}
                value={state.teacher.lastName}
                {...validationContext}
              />
              {/* <TextField
                label="Prezime"
                name="lastName"
                value={state.teacher.lastName}
                sx={{ marginBottom: 2 }}
                onChange={handleInputChanged}
              /> */}
              {/* <ValidatedTextField
                label={"Nedeljni fond časova"}
                type="number"
                id={"firstName"}
                value={state.teacher.weeklyClasses}
                {...validationContext}
                inputProps={{ min: 0 }}
              /> */}
              <TextField
                label="Nedeljni fond časova"
                name="weeklyClasses"
                type="number"
                value={state.teacher.weeklyClasses}
                inputProps={{ min: 0, max: 40 }}
                sx={{ marginBottom: 2 }}
                onChange={handleInputChanged}
              />
            </>
          ) : (
            <>
              <Typography>Ime: {state.teacher.firstName}</Typography>
              <Typography>Prezime: {state.teacher.lastName}</Typography>
              <Typography>
                Nedeljni fond časova: {state.teacher.weeklyClasses}
              </Typography>
            </>
          )}

          <Box sx={{ marginY: 2 }}>
            <TableTemplate props={subjectsTableProps} />
            {getUserRole() === "ROLE_ADMIN" && (
              <AddItem props={subjectsAddItemProps} />
            )}
          </Box>
          <EditButtons
            onSaveClick={onSaveClick}
            onResetClick={onResetClick}
            onDeleteClick={onDeleteClick}
            isFormValid={state.isFormValid}
          />
        </FormControl>
      </form>
    </Container>
  );
};

export default Teacher;
