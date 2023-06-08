import { useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import App from "../App";
import { getUsername } from "../utils/token";

export const LoginControl = ({ safePath, defaultPath, isInToolbar }) => {
  const { user, login, logout } = useContext(UserContext);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  console.log("paths def/safe before handle " + defaultPath + ";" + safePath)
  
  const handleLogin = async () => {
    // e.preventDefault();
    const u = await login(username, password);
    console.log("paths def/safe in handle " + defaultPath + ";" + safePath)
    if (u === null) {
        console.log('handleLogin u=null ' + u)
      setError(true);
    } else {
      console.log('defaultPath ' + defaultPath)
      setError(false);
      setOpen(false);
      nav("/subjects"); // hardcoded za probu bea ovoga fn primi defaultPath ali ga nekako resetuje na "/"
      
    }
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => {
          if (user === null) {
            setOpen(true);
          } else {
            logout();
            nav(safePath);
          }
        }}
        color={isInToolbar ? "secondary" : "primary"}
      >
        {user ? `Logout ${getUsername()}` : "Login"}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Molimo unesite korisničko ime i lozinku.
          </DialogContentText>
          <TextField
            autoFocus={true}
            focused={true}
            id="username"
            label="Korisničko ime"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="dense"
          />
          <TextField
            id="password"
            label="Lozinka"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="dense"
          />
          {error && (
            <Typography sx={{ color: "red" }}>
              Pogrešno korisničko ime ili lozinka.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginControl;
