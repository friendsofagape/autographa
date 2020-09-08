import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  IconButton,
  Grid,
  TextField,
  Box,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  Select,
  MenuItem,
  Input,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { FormattedMessage } from "react-intl";
import * as localForage from "localforage";
import AutographaStore from "../AutographaStore";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  textfieldsmall: {
    textAlign: "center",
    marginLeft: theme.spacing(1),
    margin: theme.spacing(3),
    width: 300,
  },
  textfieldlong: {
    textAlign: "center",
    marginLeft: theme.spacing(1),
    margin: theme.spacing(3),
    width: 635,
  },
  personalinfo: {
    margin: theme.spacing(3),
    float: "center",
  },
  avatarlarge: {
    width: theme.spacing(30),
    height: theme.spacing(30),
    marginLeft: theme.spacing(5),
    marginTop: theme.spacing(20),
  },
  avataredits: {
    marginLeft: theme.spacing(14),
  },
}));

const region = [
  { id: 1, place: "Delhi, India" },
  { id: 2, place: "Helsinki, Finland" },
  { id: 3, place: "New York, United States" },
  { id: 4, place: "Morocco, North Africa" },
];

const Profile = () => {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });
  const [appLang, setAppLang] = React.useState(AutographaStore.appLang);
  const [avatarPathImport, setavatarPathImport] = React.useState("");

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changeLangauge = (event, index, value) => {
    setAppLang(event.target.value);
    localForage.setItem("applang", event.target.value, function (err) {
      console.log("App Language Changed");
    });
  };

  const openFileDialogAvatarData = ({ target }) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(target.files[0]);
    fileReader.onload = async (e) => {
      localForage.setItem("avatarPath", e.target.result, function (err) {
        localForage.getItem("avatarPath", function (err, value) {
          console.log(value);
          setavatarPathImport(value);
        });
      });
    };
  };

  const removeAvatar = () => {
    localForage.setItem("avatarPath", "", function (err) {
      localForage.getItem("avatarPath", function (err, value) {
        setavatarPathImport(value);
      });
    });
  };

  useEffect(() => {
    localForage.getItem("avatarPath", function (err, value) {
      setavatarPathImport(value);
    });
  }, []);

  return (
    <>
      <Paper>
        <Grid container spacing={3}>
          <Grid item xs={2}></Grid>
          <Grid item xs>
            <Avatar
              src={avatarPathImport}
              alt="Remy Sharp"
              className={classes.avatarlarge}
            ></Avatar>
            <div className={classes.avataredits}>
              <IconButton variant="contained" component="label">
                <EditIcon />
                <Input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={openFileDialogAvatarData}
                />
              </IconButton>
              <IconButton aria-label="delete" onClick={removeAvatar}>
                <DeleteForeverIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={7}>
            <form
              className={classes.personalinfo}
              noValidate
              autoComplete="off"
            >
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
              >
                <Box fontWeight={600} m={1}>
                  <FormattedMessage id="label-personal-information" />
                </Box>
              </Typography>
              <FormattedMessage id="label-first-name">
                {(message) => (
                  <TextField
                    className={classes.textfieldsmall}
                    label={message}
                    variant="outlined"
                  />
                )}
              </FormattedMessage>
              <FormattedMessage id="label-last-name">
                {(message) => (
                  <TextField
                    className={classes.textfieldsmall}
                    label={message}
                    variant="outlined"
                  />
                )}
              </FormattedMessage>
              <div>
                <FormattedMessage id="label-email">
                  {(message) => (
                    <TextField
                      className={classes.textfieldlong}
                      label={message}
                      variant="outlined"
                    />
                  )}
                </FormattedMessage>
              </div>
              <div>
                <FormControl
                  variant="outlined"
                  className={classes.textfieldlong}
                >
                  <Autocomplete
                    id="region"
                    options={region}
                    getOptionLabel={(option) => option.place}
                    renderInput={(params) => (
                      <FormattedMessage id="label-region">
                        {(message) => (
                          <TextField
                            {...params}
                            label={message}
                            variant="outlined"
                          />
                        )}
                      </FormattedMessage>
                    )}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl
                  className={
                    (clsx(classes.margin, classes.textField),
                    classes.textfieldlong)
                  }
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    <FormattedMessage id="label-password" />
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                </FormControl>
              </div>
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
              >
                <Box fontWeight={600} m={2}>
                  <FormattedMessage id="label-language" />
                </Box>
              </Typography>
              <div>
                <FormControl
                  variant="outlined"
                  className={classes.textfieldlong}
                >
                  <Select
                    className={classes.formControl}
                    id="localeList"
                    value={appLang}
                    onChange={changeLangauge}
                  >
                    {/* <MenuItem value={"ar"}>Arabic</MenuItem> */}
                    <MenuItem value={"en"}>English</MenuItem>
                    <MenuItem value={"hi"}>Hindi</MenuItem>
                    {/* <MenuItem value={"pt"}>Portuguese</MenuItem>
                    <MenuItem value={"es"}>Spanish</MenuItem> */}
                  </Select>
                </FormControl>
              </div>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default Profile;
