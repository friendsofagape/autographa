import React from 'react';
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
import { useRouter } from 'next/router';
import * as logger from '../../logger';
import useApi from './useApi';
import configData from '../../config.json';

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
  const router = useRouter();
  const { state: { config }, action: { getFlow } } = useApi();
  React.useEffect(() => {
 if (router?.query?.flow) {
    getFlow(router.query.flow);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [router?.query]);

  // const bgImage = ["img1", "img2", "img3"];
  // const [index, setIndex] = React.useState(0);
  // const bgImg = bgImage[index % bgImage.length];
  const [token, setToken] = React.useState();
  const [values, setValues] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    work: 'Individual',
    organization: '',
    selectedregion: '',
    password: '',
    confirmpassword: '',
  });
  const [valid, setValid] = React.useState({
    validfirstname: false,
    validlastname: false,
    validemail: false,
    validpassword: false,
    validconfirmpassword: false,
    validorganization: false,
    validselectedregion: false,
  });
  const [error, setError] = React.useState({ });
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
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleOrganization = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handlePassword = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleValidation = () => {
    logger.debug('Singup.js', 'Into handleValidation');
    let validation;
    if (!values.firstname) {
      setValid({ ...valid, validfirstname: true });
      validation = false;
    } else if (!values.lastname) {
      setValid({ ...valid, validlastname: true });
      validation = false;
    } else if (!values.email) {
      setValid({ ...valid, validemail: true });
      validation = false;
    // } else if (!values.organization && values.work === 'Organization') {
    //   setValid({ ...valid, validorganization: true });
    //   validation = false;
    // } else if (!values.selectedregion) {
    //   setValid({ ...valid, validselectedregion: true });
    //   validation = false;
    } else if (!values.password) {
      setValid({ ...valid, validpassword: true });
      validation = false;
    } else if (!values.confirmpassword) {
      setValid({ ...valid, validconfirmpassword: true });
      validation = false;
    } else {
      setValid(false);
      validation = true;
    }
    logger.debug('Singup.js', 'End handleValidation');
    return validation;
  };
  React.useEffect(() => {
    if (config) {
      // eslint-disable-next-line prefer-const
      let err = {};
      err.msg = config?.messages?.[0]?.text;
      (config.fields).forEach((field) => {
        if (field.name === 'csrf_token') {
          setToken(field.value);
        } else {
          err[field.name] = field.messages?.[0].text;
        }
      });
      setError(err);
    }
  }, [config]);
  const handleSubmit = () => {
    setError({});
    logger.debug('Singup.js', 'Into handleSubmit');
    if (handleValidation()) {
      if (values.password === values.confirmpassword) {
        // Values in object can be used to store the data in DB
        // const obj = ({
        //   first_name: values.firstname,
        //   last_name: values.lastname,
        //   email: values.email,
        //   work: values.work,
        //   organization: values.organization,
        //   region: values.selectedregion,
        // });
        document.agsignup.action = config.action;
        document.agsignup.method = config.method;
        // eslint-disable-next-line prefer-const
        let input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', 'csrf_token');
          input.setAttribute('value', token);
        document.agsignup.appendChild(input);
        document.agsignup.submit();
      } else {
        logger.debug('Singup.js, Passwords do not match');
        setValid({ ...valid, validconfirmpassword: true });
        setError({ msg: 'Passwords do not match' });
      }
    } else {
      Object.keys(valid).forEach((key) => {
        if (valid[key] === true) {
          logger.error(`Singup.js, Validation Failed for ${key}`);
        }
      });
    }
  };

  // useEffect(() => {
  //   const timer = setInterval(() => setIndex((i) => i + 1), 5000);
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <div>
      <Grid container className={classes.root} justify="center">
        <Grid item xs={5}>
          <form name="agsignup">
            <Paper className={classes.paper}>
              <FormControl>
                <Typography variant="h5" gutterBottom>
                  Sign Up
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Be part of a great community & have fun with us
                </Typography>
                <Typography color="error">{error?.msg}</Typography>
                <Typography component="span">
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                      <PersonOutlineIcon />
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.margin}
                        inputProps={{
                        'data-testid': 'firstnamefield',
                      }}
                        name="traits.name.first"
                        type="text"
                        label="First Name"
                        onChange={handleFirstname('firstname')}
                        error={valid.validfirstname}
                      />
                      <Typography color="error">{error?.['traits.name.first']}</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.margin}
                        inputProps={{
                        'data-testid': 'lastnamefield',
                      }}
                        name="traits.name.last"
                        label="Last Name"
                        onChange={handleLastname('lastname')}
                        error={valid.validlastname}
                      />
                      <Typography color="error">{error?.['traits.name.last']}</Typography>
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
                      inputProps={{
                      'data-testid': 'emailfield',
                    }}
                      name="traits.email"
                      type="email"
                      label="Enter Your Email"
                      onChange={handleEmail('email')}
                      error={valid.validemail}
                    />
                  </Grid>
                  <Typography color="error">{error?.['traits.email']}</Typography>
                </Grid>
                <RadioGroup
                  row
                  data-testid="radioButton"
                  style={{ justifyContent: 'center' }}
                  value={values.work}
                  onChange={handleRadio('work')}
                >
                  <FormControlLabel
                    value="Individual"
                    control={<Radio color="primary" />}
                    label="Individual"
                  />
                  <FormControlLabel
                    value="Organization"
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
                      inputProps={{
                      'data-testid': 'orgfield',
                    }}
                      label="Name of the Organization"
                      error={valid.validorganization}
                      onChange={handleOrganization('organization')}
                      disabled={values.work === 'Individual'}
                    />
                  </Grid>
                </Grid>
                <Typography component="span">
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                      <LanguageOutlinedIcon />
                    </Grid>
                    <Grid item>
                      <Autocomplete
                        id="region"
                        options={region}
                        getOptionLabel={(option) => option.place}
                        getOptionSelected={(option, value) => option.place === value.place}
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
                <Typography component="span">
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                      <LockOpenIcon />
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.margin}
                        inputProps={{
                        'data-testid': 'passwordfield',
                      }}
                        name="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        error={valid.validpassword}
                        onChange={handlePassword('password')}
                      />
                      <Typography color="error">{error?.password}</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.margin}
                        inputProps={{
                        'data-testid': 'confirmpassfield',
                      }}
                        label="Confirm Password"
                        type="password"
                        value={values.confirmpassword}
                        error={valid.validconfirmpassword}
                        onChange={handlePassword('confirmpassword')}
                      />
                    </Grid>
                  </Grid>
                </Typography>
                <Button
                  data-testid="submitButton"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Sign Up
                </Button>
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
          </form>
        </Grid>
        <Grid
          container
          alignItems="flex-start"
          justify="flex-end"
          direction="row"
        >
          <a href={configData.login_url}>Go Back</a>
        </Grid>
      </Grid>
    </div>
  );
}
