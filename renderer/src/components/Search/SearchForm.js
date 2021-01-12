import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  InputBase,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
// import AwesomeDebouncePromise from 'awesome-debounce-promise';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    float: 'right',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function SearchForm({
  defaultQuery,
  contentList,
  filterList,
  // onFilterContents,
}) {
  const classes = useStyles();
  const [query, setQuery] = useState(defaultQuery);
  const [setData] = useState(contentList);

  // exclude column list from filter

  const excludeColumns = filterList.splice(filterList.indexOf('name'), 1);

  // const contentSearchDebounced = AwesomeDebouncePromise(
  //   async (_props) => await contentSearch(_props),
  //   250,
  // );

  const onQuery = useCallback((_query) => {
    setQuery(_query);
    const lowercasedValue = _query.toLowerCase().trim();
    if (lowercasedValue === '') setData(contentList);
    else {
      const filteredData = contentList.filter(
        (item) => Object.keys(item).some((key) => (excludeColumns.includes(key)
          ? false
          : item[key].toString().toLowerCase().includes(lowercasedValue))),
      );
      setData(filteredData);
      // onFilterContents(filteredData);
    }
  }, [contentList, excludeColumns, setData]);

  // handle change event of search input
  const handleChange = (value) => {
    setQuery(value);
    onQuery(value);
  };

  return (
    <div className={classes.root}>
      <Toolbar>
        <Typography
          className={classes.title}
          variant="h6"
          noWrap
          data-testid="search-title"
        >
          Search
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Search />
          </div>
          <InputBase
            placeholder="Search…"
            id="search"
            label="Search"
            type="text"
            variant="outlined"
            fullWidth
            autoComplete={undefined}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{
              'aria-label': 'search',
              'data-testid': 'searchfield',
            }}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      </Toolbar>
    </div>
  );
}

SearchForm.propTypes = {
  /** Prefill the query search field. */
  defaultQuery: PropTypes.string,
  /** Array list of items  */
  contentList: PropTypes.array,
  /** Array list to be filtered  */
  filterList: PropTypes.array,
  /** Function to propogate the returned repositories data array. */
  // onFilterContents: PropTypes.func.isRequired,
  /** Configuration required if paths are provided as URL. */
};

export default SearchForm;
