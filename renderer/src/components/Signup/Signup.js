import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));
export default function Signup() {
  const classes = useStyles();
  const bgImage = ['img1', 'img2', 'img3'];
  const [index, setIndex] = useState(0);
  const bgImg = bgImage[index % bgImage.length];
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    organization: '',
    selectedregion: '',
  });
  const [individual, setIndividual] = useState('true');
  const [valid, setValid] = useState({
    validfirstname: false,
    validlastname: false,
    validemail: false,
    validpassword: false,
    validconfirmpassword: false,
    validorganization: false,
    validselectedregion: false,
  });
  const region = [
    { id: 1, place: 'Delhi, India' },
    { id: 2, place: 'Helsinki, Finland' },
    { id: 3, place: 'New York, United States' },
    { id: 4, place: 'Morocco, North Africa' },
  ];
  const handleFirstname = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleLastname = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleEmail = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleRadio = (prop) => (event) => {
    setIndividual(event.target.value);
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleOrganization = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handlePassword = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    setValid(false);
    console.log('click');
    handleValidation();
    console.log(values);
  };
  const handleValidation = () => {
    if (!values.firstname) {
      setValid({ ...valid, validfirstname: true });
    } else if (!values.lastname) {
      setValid({ ...valid, validlastname: true });
    } else if (!values.email) {
      setValid({ ...valid, validemail: true });
    } else if (!values.organization && values.individual === 'false') {
      setValid({ ...valid, validorganization: true });
    } else if (!values.selectedregion) {
      setValid({ ...valid, validselectedregion: true });
    } else if (!values.password) {
      setValid({ ...valid, validpassword: true });
    } else if (!values.confirmpassword) {
      setValid({ ...valid, validconfirmpassword: true });
    } else {
      setValid(false);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => i + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <Grid container className={classes.root} justify="center">
        <Grid item xs={5}>
          <Paper className={classes.paper}>
            <FormControl>
              <Typography variant="h5" gutterBottom>
                Sign Up
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Be part of a great community & have fun with us
              </Typography>
              <Typography>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <PersonOutlineIcon />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.margin}
                      id="input-with-icon-textfield"
                      label="First Name"
                      onChange={handleFirstname('firstname')}
                      error={valid.validfirstname}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.margin}
                      id="input-with-icon-textfield"
                      label="Last Name"
                      onChange={handleLastname('lastname')}
                      error={valid.validlastname}
                    />
                  </Grid>
                </Grid>
              </Typography>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <MailOutlineIcon />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    label="Enter Your Email"
                    onChange={handleEmail('email')}
                    error={valid.validemail}
                  />
                </Grid>
              </Grid>
              <RadioGroup
                row
                style={{ justifyContent: 'center' }}
                value={individual}
                onChange={handleRadio('individual')}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color="primary" />}
                  label="Individual"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color="primary" />}
                  label="Organization"
                />
              </RadioGroup>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <AccountBalanceOutlinedIcon />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    label="Name of the Organization"
                    error={valid.validorganization}
                    onChange={handleOrganization('organization')}
                    disabled={individual === 'true'}
                  />
                </Grid>
              </Grid>
              <Typography>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <LanguageOutlinedIcon />
                  </Grid>
                  <Grid item>
                    <Autocomplete
                      id="region"
                      options={region}
                      getOptionLabel={(option) => option.place}
                      onInputChange={(event, newInputValue) => {
                        setValues({ ...values, selectedregion: newInputValue });
                      }}
                      renderInput={(params) => (
                        <TextField
                          className={classes.margin}
                          {...params}
                          error={valid.validselectedregion}
                          label="Select Region"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Typography>
              <Typography>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <LockOpenIcon />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.margin}
                      id="standard-adornment-password"
                      label="Password"
                      type="password"
                      value={values.password}
                      error={valid.validpassword}
                      onChange={handlePassword('password')}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.margin}
                      id="standard-adornment-password"
                      label="Confirm Password"
                      type="password"
                      value={values.confirmpassword}
                      error={valid.validconfirmpassword}
                      onChange={handlePassword('confirmpassword')}
                    />
                  </Grid>
                </Grid>
              </Typography>
              <Link href="/login">
                <Button variant="contained" onClick={handleSubmit}>
                  Sign Up
                </Button>
              </Link>
              <Typography variant="caption" gutterBottom>
                By signing up, you agree to our Terms and Conditions and
                <Typography
                  color="primary"
                  variant="caption"
                  component="a"
                  target="_blank"
                >
                  Private Policy
                </Typography>
              </Typography>
            </FormControl>
          </Paper>
        </Grid>
        <Grid
          container
          alignItems="flex-start"
          justify="flex-end"
          direction="row"
        >
          <Link href="/login">
            Go Back
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}
