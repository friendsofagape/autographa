import React from "react";
import {
  Grid,
  Box,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
} from "@material-ui/core";
import { CreateProjectStyles } from "./useStyles/CreateProjectStyles";

const AdvancedSetttings = () => {
  const classes = CreateProjectStyles();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <form noValidate autoComplete="off">
            <div>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Box fontWeight={600} m={1}>
                    Versification Scheme
                  </Box>
                </FormLabel>
                <Select
                  className={classes.biblename}
                  value="bi"
                  variant="outlined"
                >
                  <MenuItem value={"md"}>MdFile</MenuItem>
                  <MenuItem value={"bi"}>Bible</MenuItem>
                </Select>
              </FormControl>
              <span className={classes.version}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Canon Specifications
                    </Box>
                  </FormLabel>
                  <Select
                    className={classes.biblename}
                    value="bi"
                    variant="outlined"
                  >
                    <MenuItem value={"md"}>MdFile</MenuItem>
                    <MenuItem value={"bi"}>Bible</MenuItem>
                  </Select>
                </FormControl>
              </span>
              <span className={classes.version}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      Content
                    </Box>
                  </FormLabel>
                  <Select
                    className={classes.biblename}
                    value="bi"
                    variant="outlined"
                  >
                    <MenuItem value={"md"}>MdFile</MenuItem>
                    <MenuItem value={"bi"}>Bible</MenuItem>
                  </Select>
                </FormControl>
              </span>

              <div>
                <FormControl className={classes.license} component="fieldset">
                  <FormLabel component="legend">
                    <Box fontWeight={600} m={1}>
                      License
                    </Box>
                  </FormLabel>
                  <Select
                    className={classes.licenseselect}
                    value="bi"
                    variant="outlined"
                  >
                    <MenuItem value={"md"}>MdFile</MenuItem>
                    <MenuItem value={"bi"}>Bible</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </form>
        </Grid>
      </Grid>
    </>
  );
};
export default AdvancedSetttings;
