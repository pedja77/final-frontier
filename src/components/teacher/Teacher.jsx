import {
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormGroup,
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
import { useState } from "react";
import { getUserRole } from "../../utils/token";
import { produce } from "immer";
import EditButtons from "../lib/EditButtons";

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
      //   draft.teacher.students = action.students;
      //   draft.teacher.subjects = action.subjects;
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

  console.log(
    `subjects by teacher ${teacher.id} ${JSON.stringify(
      subjectsByTeacher,
      null,
      4
    )}`
  );

  const fetcher = useFetcher();

  // const nav = useNavigate();
  // const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [state, dispatch] = useImmerReducer(subjectReducer, {
    teacher: {
      ...teacher,
      subjects: subjectsByTeacher,
      students: studentsByTeacher,
    },
    // teachersSubjects: structuredClone(subjectsByTeacher),
    //   teachersStudents: structuredClone(studentsByTeacher),
    newSubject: null,
    newStudent: null,
  });
  console.log("state.teacher " + JSON.stringify(state, null, 4));

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

  const studentsTableProps = {
    tableLabel: "Učenici",
    tableHeaders: ["Id", "Ime", "Prezime", "Razred"],
    tableData: state.teacher.students,
    tdConfig: ["id", "firstName", "lastName", "grade"],
    removeFn: handleRemoveItem,
    collectionName: "students",
  };

  const studentsAddItemProps = {
    itemName: "učenika",
    newItemName: "newStudent",
    newItem: state.newStudent,
    options: students,
    collection: "students",
    forFilterOptions: state.teacher.students,
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
      <Typography variant="h3">{`${state.teacher.firstName} ${state.teacher.lastName}`}</Typography>
      <Avatar
        // alt={`${state.teacher.firstName} ${state.teacher.lastName}`}
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
            <TableTemplate props={subjectsTableProps} />
            {getUserRole() === "ROLE_ADMIN" && (
              <AddItem props={subjectsAddItemProps} />
            )}

            {/* <TableTemplate props={studentsTableProps} />
              {getUserRole() === "ROLE_ADMIN" && (
                <AddItem props={studentsAddItemProps} />
              )} */}
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
