import * as React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const AutoCompleteSearch = ({
  listarray, customPlaceholder, selectedValue, setSelectedValue,
}) => (
  <Autocomplete
    options={listarray}
    getOptionLabel={(option) => option}
    inputValue={selectedValue}
        // eslint-disable-next-line no-shadow
    onInputChange={(id, region) => {
      setSelectedValue(region);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label={customPlaceholder}
        variant="outlined"
      />
    )}
    ListboxProps={{ 'data-testid': 'list-box' }}
  />
);
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
