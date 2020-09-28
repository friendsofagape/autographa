
import { FormControl, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CreateProjectStyles } from "./useStyles/CreateProjectStyles";

export const AutoComplete = ({ version }) => {
    const classes = CreateProjectStyles();
    const [selregion, setRegion] = React.useState("");

    return (
                  <Autocomplete
                    freeSolo
                    disableClearable
                    className={classes.autocomplete}
                    options={version}
                    getOptionLabel={(option) => option.value}
                    inputValue={selregion}
                    onInputChange={(id, version) => {
                      setRegion(version);
                    }}
                    renderInput={(params) => (
                    <TextField
                    {...params}
                    margin="normal"
                    variant="outlined"
                    placeholder="Select the version"
                    style={{ marginTop: "5px"}}
                    InputProps={{ ...params.InputProps, type: "search" }}
                    />
                    )}
                  />
    );
};