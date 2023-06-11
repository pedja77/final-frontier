import { TextField } from "@mui/material";

const ValidatedTextField = ({id, state, value, dispatch, generateOnChanged}) => {        
    return <TextField 
                    helperText={state.errors[id].cause} 
                    error={!state.errors[id].valid} 
                    id={id} 
                    value={value} 
                    onChange={generateOnChanged} 
                    onBlur={e => {
                        //StateIndex[id][1](ValidatorIndex[id](currentBook[id]));
                        dispatch({
                            type: 'validate',
                            key: id
                        });
                    }}
            />
}

export default ValidatedTextField;