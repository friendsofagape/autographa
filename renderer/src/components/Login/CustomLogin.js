import React from 'react';
import PropTypes from 'prop-types';
import {
 TextField, Button, Grid, Link,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({

}));
const CustomLogin = ({
 ui, error, login, userlist,
}) => {
  const classes = useStyles();
  const [values, setValue] = React.useState({ });
  const handleChange = (prop) => (event) => {
    setValue({ ...values, [prop]: event.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(values);
    setValue({});
  };
  return (
    <>
      <Grid container direction="column" spacing={2}>
        <form onSubmit={(e) => handleSubmit(e)}>
          {(ui?.autocomplete?.count)?.map((v) => (
            <Grid container spacing={1} alignItems="flex-end">
              <PersonOutlineIcon />
              <Autocomplete
                freeSolo
                data-testid="autocomplete"
                className={classes.input}
                options={userlist}
                getOptionLabel={(option) => option.email}
                getOptionSelected={(option, value) => option.email === value.email}
                onInputChange={(event, newInputValue) => {
                  setValue({ ...values, username: newInputValue });
                    }}
                renderInput={
                  (params) => <TextField {...params} label={v.label} error={error.username} />
                  }
              />
            </Grid>
        ))}
          {(ui?.textfield?.count)?.map((c) => (
            <Grid key={c.label} container spacing={1} alignItems="flex-end">
              {c.type === 'text' && <PersonOutlineIcon />}
              {c.type === 'password' && <LockOpenIcon />}
              <TextField
                label={c.label}
                type={c.type}
                onChange={handleChange(c.label)}
              />
            </Grid>
        ))}
          {ui?.viewForgot && (
          <Link
            href="/signup"
            variant="body2"
            align="right"
          >
            Forgot Password?
          </Link>
        )}
          <Button data-testid="login-button" type="submit">LOGIN</Button>
        </form>
      </Grid>
    </>
  );
};
export default CustomLogin;
CustomLogin.propTypes = {
  /** State which triggers login. */
  ui: PropTypes.object,
  error: PropTypes.object,
  login: PropTypes.func,
  userlist: PropTypes.array,
};
