import {
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
    default: {
      throwError("Invalid action: ", action.type);
    }
  }
};

const Subject = () => {
  const [sub, grades, teachers, studentsByGrade] = useLoaderData();

  const fetcher = useFetcher();

  const nav = useNavigate();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [state, dispatch] = useImmerReducer(subjectReducer, {
    subject: structuredClone(sub),
    newTeacher: null,
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
    options: studentsByGrade,
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
        Za {gradeToString.get(state.subject.grade)} razred
      </Typography>
      <form>
        {/* <fieldset disabled={getUserRole() !== "ROLE_ADMIN"} style={{border: '0'}}> */}
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
          <Collapse in={isAlertOpen}></Collapse>
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
            }}
          >
            {getUserRole() === "ROLE_ADMIN" && (
              <>
                <Box>
                  <Button
                    variant="contained"
                    sx={{ marginRight: 1 }}
                    onClick={() =>
                      dispatch({
                        type: "reset_form",
                        subject: structuredClone(sub),
                      })
                    }
                  >
                    Otkaži
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={async () => {
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
                </Box>
                <Button
                  variant="outlined"
                  onClick={async (e) => {
                    e.preventDefault();
                    // e.cancelBubble();
                    setIsAlertOpen(true);
                    // fetcher.submit(
                    //   {},
                    //   {
                    //     method: "delete",
                    //     action: `/subjects/${state.subject.id}`,
                    //   }
                    // );
                  }}
                >
                  Obriši
                </Button>
              </>
            )}
          </FormGroup>
        </FormControl>
        {/* </fieldset> */}
      </form>
      <Dialog
        // selectedValue={}
        open={isAlertOpen}
      >
        <DialogContent>
          Da li zaista želite da obrišete predmet {state.subject.subjectName} iz
          baze?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              fetcher.submit(
                {},
                {
                  method: "delete",
                  action: `/subjects/${state.subject.id}`,
                }
              );
              nav("/subjects");
            }}
          >
            Da
          </Button>
          <Button autoFocus onClick={() => setIsAlertOpen(false)}>
            Ne
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Subject;
