import { Button, FormGroup } from "@mui/material";

const AddNewButtons = ({onResetClick, onSaveClick}) => {

    return <FormGroup sx={{ display: "flex", flexDirection: "row-reverse" }}>
    <Button
      variant="outlined"
      onClick={onSaveClick}
    >
      Sačuvaj
    </Button>
    <Button
      variant="contained"
      sx={{ marginRight: 1 }}
      onClick={onResetClick}
    >
      Otkaži
    </Button>
  </FormGroup> 
}

export default AddNewButtons;