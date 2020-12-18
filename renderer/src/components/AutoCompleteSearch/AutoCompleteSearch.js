import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(30),
  },
}));

export const AutoCompleteSearch = ({
  listarray, customPlaceholder, selectedValue, setSelectedValue,
}) => {
  const classes = useStyles();

  return (
    <Autocomplete
      freeSolo
      disableClearable
      className={classes.autocomplete}
      options={listarray}
      getOptionLabel={(option) => option.value}
      inputValue={selectedValue}
      // eslint-disable-next-line no-shadow
      onInputChange={(id, optionSelect) => {
        setSelectedValue(optionSelect);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="normal"
          variant="outlined"
          placeholder={customPlaceholder}
          style={{ marginTop: '5px' }}
          InputProps={{
            ...params.InputProps,
            type: 'search',
            'data-testid': 'searchfield',
          }}
        />
      )}
    />
  );
};

AutoCompleteSearch.propTypes = {
  // list of array props that needs to be searched
  listarray: PropTypes.instanceOf(Array),
  // selected state value prop
  selectedValue: PropTypes.string,
  // setting state value prop
  setSelectedValue: PropTypes.func,
  // placeholder to display
  customPlaceholder: PropTypes.string,
};
AutoCompleteSearch.defaultProps = {
  listarray: PropTypes.instanceOf(Array),
};
