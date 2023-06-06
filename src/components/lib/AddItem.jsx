import { AddBoxSharp } from "@mui/icons-material";
import { Autocomplete, Box, IconButton, TextField, Tooltip } from "@mui/material";


/**props: {
 * itemName: "nastavnik",
 *  newItemName: "newTeacher",
 *  newItem: state.newTeacher
 *  options: teachers, 
 * collection: "teachers"
 * forFilterOptions: state.subject.teachers,
 * labelOptions: ["firstName", "lastName"],
 * handleSetNewOption,
 * handleAddNewItem }*/
const AddItem = ({props}) => {
    console.log(props.options)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Autocomplete
        sx={{ width: "90%" }}
        options={props.options.filter((t) =>
          props.forFilterOptions.every((st) => st.id !== t.id)
        )}
        getOptionLabel={(a) => `${a[props.labelOptions[0]]} ${a[props.labelOptions[1]]}`}
        renderInput={(params) => (
          <TextField {...params} label={`Dodeli predmet ${props.itemName}u`} />
        )}
        value={props.newItem}
        onChange={(e, v) => props.handleSetNewOption(e, v, props.newItemName)}
      />
      <Tooltip title={`Dodaj novog ${props.itemName}a`}>
        <span>
          <IconButton
            disabled={props.newItem === null}
            size="large"
            onClick={() => props.handleAddNewItem(props.newItemName, props.collection)}
          >
            <AddBoxSharp fontSize="large" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default AddItem;