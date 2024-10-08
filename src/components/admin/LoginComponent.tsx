import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as A } from 'react-router-dom';
import {useAxios, axios} from '../../services/http';
import { AppContext } from '../../contexts/AppContext';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert, {AlertProps} from '@mui/material/Alert';

function LoginComponent( {}: any ) {
  const navigate = useNavigate();
  const AppContextState: any = useContext(AppContext);
  const http = useAxios();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<string>("info"); // info, warning, error, success

  const login = () => {
    http.post('/auth/login', {
      email: email,
      password: password
    }).then((res) => {

      console.log(res.data);

      AppContextState.setAccessToken(res.data.access_token);
      AppContextState.setUser(res.data.user);
      AppContextState.setTenant(res.data?.tenant);
      // AppContextState.setConfig(res.data?.config);

      localStorage.setItem("access_token", JSON.stringify(res.data.access_token));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("tenant", JSON.stringify(res.data?.tenant));
      // localStorage.setItem("config", JSON.stringify(res.data?.config));

      setEmail("");
      setPassword("");

      setSnackbarType("success");
      setSnackbarMessage(res.data.message);
      setSnackbarOpen(true);

      navigate('/admin');
    }).catch((error) => {
      setSnackbarType("error");
      setSnackbarMessage(error.response?.data?.message);
      setSnackbarOpen(true);

      setEmail("");
      setPassword("");
    });
  }

  return (
    <>
      <Card variant="outlined">
        {/* <CardHeader
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016" 
        /> */}
        <CardContent>
          <Grid
            container
            gap={2}
          >
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5" component="h5">
                Admin Login
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" type="email" value={email} onChange={(e) => {
                setEmail(e.target.value);
              }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="outlined-basic" label="Password" variant="outlined" type="password" value={password} onChange={(e) => {
                setPassword(e.target.value);
              }} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button fullWidth variant="contained" onClick={() => {
            login();
          }}>Login</Button>
        </CardActions>
        <CardActions>
          <A to={`/admin/auth`}>Forgot password / change email?</A>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}

export {LoginComponent};
