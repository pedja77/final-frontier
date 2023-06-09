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
      break;
    }
    default: {
      throwError("Invalid action: ", action.type);
    }
  }
};

const Teacher = () => {
  const [teacher, subjectsByTeacher, studentsByTeacher, subjects, students] =
    useLoaderData();
  const fetcher = useFetcher();
  const nav = useNavigate();
  const [state, dispatch] = useImmerReducer(teacherReducer, {
    teacher: {
      ...teacher,
      subjects: subjectsByTeacher,
      students: studentsByTeacher,
    },
    newSubject: null,
    newStudent: null,
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
        students: studentsByTeacher,
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
    nav("/subjects");
  };

  const onSaveClick = async () => {
    console.log(JSON.stringify(state.teacher, null, 4));
    let s = structuredClone(state.teacher);
    s.students = JSON.stringify(state.teacher.students);
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
      />
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
              <TextField
                label="Ime"
                name="firstName"
                value={state.teacher.firstName}
                sx={{ marginBottom: 2 }}
                onChange={handleInputChanged}
              />
              <TextField
                label="Prezime"
                name="lastName"
                value={state.teacher.lastName}
                sx={{ marginBottom: 2 }}
                onChange={handleInputChanged}
              />
              <TextField
                label="Nedeljni fond časova"
                name="weeklyClasses"
                type="number"
                value={state.teacher.weeklyClasses}
                inputProps={{ min: 0 }}
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
          />
        </FormControl>
      </form>
    </Container>
  );
};

export default Teacher;
