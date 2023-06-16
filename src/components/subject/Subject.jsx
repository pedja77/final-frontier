import {
  Box,
  Container,
  FormControl,
  FormLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { gradeToString } from "../../utils/textTools";
import { useImmerReducer } from "use-immer";
import TableTemplate from "../lib/TableTemplate";
import AddItem from "../lib/AddItem";
import { getUserRole } from "../../utils/token";
import EditButtons from "../lib/EditButtons";
import ValidatedTextField from "../lib/ValidatedTextField";
import { isFormValid, validateSubjectName, validateWeeklyFund } from "../../utils/validation";
import { useEffect } from "react";

const ValidationIndex = {
  subjectName: validateSubjectName,
  weeklyFund: validateWeeklyFund
}

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
      for (const k in ValidationIndex) {
        draft.errors[k] = ValidationIndex[k](draft.subject[k]);
      }
      draft.isFormValid = true;
      break;
    }
    case "validate": {
      draft.errors[action.key] = ValidationIndex[action.key](
        draft.subject[action.key]
      );
      draft.isFormValid = isFormValid(draft.errors, [
        "subjectName",
        "weeklyFund"
      ]);
      break;
    }
    default: {
      throw ("Invalid action: ", action.type);
    }
  }
};

const Subject = () => {
  const [sub, grades, teachers, studentsByGrade] = useLoaderData();

  const fetcher = useFetcher();

  const nav = useNavigate();

  const [state, dispatch] = useImmerReducer(subjectReducer, {
    subject: structuredClone(sub),
    newTeacher: null,
    newStudent: null,
    isFormValid: true,
    errors: {}
  });

  useEffect(() => {
    if(fetcher.data) {
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
      subject: structuredClone(sub),
    });

  const onSaveClick = async () => {
    let s = structuredClone(state.subject);
    s.students = JSON.stringify(state.subject.students);
    s.teachers = JSON.stringify(state.subject.teachers);
    fetcher.submit(s, {
      method: "put",
      action: `/subjects/${state.subject.id}`,
    });
    // nav("/subjects");
  };

  const onDeleteClick = () => {
    fetcher.submit(
      {},
      {
        method: "delete",
        action: `/subjects/${state.subject.id}`,
      }
    );
    nav("/subjects");
  }

  const teachersTableProps = {
    tableLabel: "Nastavnici",
    tableHeaders: ["Id", "Ime", "Prezime"],
    tableData: state.subject.teachers,
    tdConfig: ["id", "firstName", "lastName"],
    removeFn: handleRemoveItem,
    collectionName: "teachers",
    editUrl: "/teachers"
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
    options: studentsByGrade,
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
          {getUserRole() === "ROLE_ADMIN" ? (
            <>
            <ValidatedTextField
                label={"Naziv"}
                type={"text"}
                id={"subjectName"}
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
            </>
          ) : (
            <>
              <Typography>
                Naziv predmeta: {state.subject.subjectName}
              </Typography>
              <Typography>
                Razred: {gradeToString.get(state.subject.grade)}
              </Typography>
              <Typography>
                Nedeljni fond časova: {state.subject.weeklyFund}
              </Typography>
            </>
          )}

          <Box sx={{ marginY: 2 }}>
            <TableTemplate props={teachersTableProps} />
            {getUserRole() === "ROLE_ADMIN" && (
              <AddItem props={teachersAddItemProps} />
            )}

            <TableTemplate props={studentsTableProps} />
            {getUserRole() === "ROLE_ADMIN" && (
              <AddItem props={studentsAddItemProps} />
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

export default Subject;
