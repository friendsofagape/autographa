import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  TextField,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: '100%',
  },
  listItemIcon: { marginRight: '8px' },
  form: { width: '100%' },
  input: {
    width: '40%',
    display: 'inline-block',
    marginRight: '1em',
  },
}));

function SearchForm({
  defaultQuery,
}) {
  const classes = useStyles();
  const [query, setQuery] = useState(defaultQuery);
  //   const [initialSearch, setInitialSearch] = useState(false);

  const contentSearchDebounced = AwesomeDebouncePromise(
    async (_props) => await contentSearch(_props),
    250,
  );

  const onQuery = useCallback((_query) => {
    setQuery(_query);
    updateSearchContent(_query);
  }, [updateSearchContent]);

  return (
    <ListItem
      ContainerComponent="div"
      className={classes.root}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <IconButton
          onClick={() => updateSearchContent(query)}
        >
          <Search />
        </IconButton>
      </ListItemIcon>
      <form className={classes.form}>
        <div className={classes.input}>
          <TextField
            id="search"
            label="Search"
            type="text"
            variant="outlined"
            margin="normal"
            fullWidth
            defaultValue={query}
            autoComplete={undefined}
            onChange={(event) => {
              onQuery(event.target.value);
            }}
          />
        </div>
      </form>
    </ListItem>
  );
}

SearchForm.propTypes = {
  /** Prefill the query search field. */
  defaultQuery: PropTypes.string,
  /** Function to propogate the returned repositories data array. */
  updateSearchContent: PropTypes.func.isRequired,
  /** Configuration required if paths are provided as URL. */
  config: PropTypes.shape({ server: PropTypes.string.isRequired }).isRequired,
};

export default SearchForm;
