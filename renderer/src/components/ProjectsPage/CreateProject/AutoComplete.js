import * as React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CreateProjectStyles } from './useStyles/CreateProjectStyles';

export const AutoComplete = ({ version, selectedOption, setSetselectedOption }) => {
  const classes = CreateProjectStyles();

  return (
    <Autocomplete
      freeSolo
      disableClearable
      className={classes.autocomplete}
      options={version}
      getOptionLabel={(option) => option.value}
      inputValue={selectedOption}
      // eslint-disable-next-line no-shadow
      onInputChange={(id, version) => {
        setSetselectedOption(version);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="normal"
          variant="outlined"
          placeholder="Select the version"
          style={{ marginTop: '5px' }}
          InputProps={{ ...params.InputProps, type: 'search' }}
        />
      )}
    />
  );
};

AutoComplete.propTypes = {
  version: PropTypes.instanceOf(Array),
};
AutoComplete.defaultProps = {
  version: PropTypes.instanceOf(Array),
};
