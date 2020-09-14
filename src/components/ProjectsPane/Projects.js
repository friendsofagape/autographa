import React, { useEffect } from "react";
import PropTypes from "prop-types";
// import clsx from 'clsx';
import { lighten, makeStyles, fade } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
// import Paper from "@material-ui/core/Paper";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import { IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
// import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';

function createData(name, language, date, view) {
  return { name, language, date, view };
}

const starrted = [
  createData("Project Arabic", "arb", "22 Apr 2020", 51),
  createData("Hindi New Testment", "hin", "21 may 2020", 24),
  createData("English NIV", "eng", "2 May 2020", 24),
  createData("Kannada Revised", "knd", "31 Jun 2021", 37),
  createData("new Malayalam", "mal", "04 Jul 2020", 67),
  createData("New Testment Oriya", "or", "23 Feb 2010", 24),
  createData("English Old", "eng", "17 Dec 2029", 24),
];

const unstarrted = [
  createData("Project Malayalam", "mal", "21 Mar 2021", 67),
  createData("Spanish Project", "spa", "1 Sep 2019", 49),
  createData("Arabic", "arb", "2 Aug 2020", 5),
  createData("Tamil IRV", "tml", "15 Aug 2018", 87),
];

function descendingComparator(a, b, orderBy) {
  if (orderBy !== "date") {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}

function getComparator(order, orderBy) {
  console.log(order, orderBy);
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator, orderBy, dateorder) {
  if (orderBy !== "date") {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  } else {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort(function compare(a, b) {
      const date_a = new Date(a[0].date);
      const date_b = new Date(b[0].date);
      if (dateorder === "desc") return date_b - date_a;
      else return date_a - date_b;
    });
    return stabilizedThis.map((el) => el[0]);
  }
}

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Project Name" },
  { id: "language", numeric: false, disablePadding: true, label: "Language" },
  { id: "date", numeric: true, disablePadding: false, label: "Date" },
  { id: "view", numeric: true, disablePadding: false, label: "Last Viewed(H)" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  //   rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = ({ title }) => {
  const classes = useToolbarStyles();

  return (
    <Typography
      className={classes.title}
      variant="h6"
      id="tableTitle"
      component="div"
    >
      {title}
    </Typography>
  );
};

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    height: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  search: {
    position: 'relative',
    float: "right",
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
  container: {
    maxHeight: 400
  }
}));

export default function Projects() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderUnstarred, setOrderUnstarred] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [orderByUnstarred, setOrderByUnstarred] = React.useState("name");
    const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [pageUnstarred, setPageUnstarred] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(1000);
  const [rowsPerPageUnstarred, setRowsPerPageUnstarred] = React.useState(5);
  const [query, setQuery] = React.useState("");
  const [starredrow, setStarredrow] = React.useState(starrted);
  const [unstarredrow, setUnStarredrow] = React.useState(unstarrted);
  const [defaultrownum, setdefaultrownum] = React.useState(5);
  const [temparray, settemparray] = React.useState(null)
  const [ active, setactive ] = React.useState("")
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRequestSortUnstarred = (event, property) => {
    const isAsc = orderByUnstarred === property && orderUnstarred === "asc";
    setOrderUnstarred(isAsc ? "desc" : "asc");
    setOrderByUnstarred(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = starrted.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClickStarred = (event, name, property) => {
    property === "starred" ? setactive("starred") : setactive("unstarred")
    let selectedIndex = property==="starred" ? starredrow.findIndex(x => x.name === name) : unstarredrow.findIndex(x => x.name === name)
    const copy = property==="starred" ? starredrow.splice(selectedIndex, 1) : unstarredrow.splice(selectedIndex, 1)
    settemparray(copy[0])
  };

  useEffect(() => {
    console.log(temparray)
    if(temparray)
    active=== "starred" ? unstarredrow.push(temparray) : starredrow.push(temparray)
    handleRequestSortUnstarred("asc", "view")
  },[temparray, active])

  return (
    <div className={classes.root}>
      <Toolbar>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </Toolbar>
        <div>
        <EnhancedTableToolbar title={"Starred Projects"} />
          <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              // numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={starredrow.length}
            />
            {starredrow.length!==0 ? (
            <TableBody>
              {stableSort(
                  query ? starredrow.filter(x =>
                    (x.name).toLowerCase()
                      .includes(query)
                  ) : starredrow, getComparator(order, orderBy), orderBy, order)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell padding="checkbox">
                      <IconButton onClick={(event) => handleClickStarred(event, row.name, "starred")} >
                      <StarIcon />
                      </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell >{row.language}</TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                      <TableCell align="right">{row.view}</TableCell>
                      <TableCell align="right">
                      <IconButton>
                      <EditIcon />
                      </IconButton>
                      <IconButton>
                      <DeleteIcon />
                      </IconButton>
                      <IconButton>
                      <InfoIcon />
                      </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            ) : 
        (<div>No data to display</div> ) }
          </Table>
        </TableContainer>
        
        
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={(starredrow.length)}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
        </div>
        <div>
        <EnhancedTableToolbar title={"Everythings else"} />
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
            stickyHeader
          >
            <EnhancedTableHead
              classes={classes}
              // numSelected={selected.length}
              order={orderUnstarred}
              orderBy={orderByUnstarred}
              onRequestSort={handleRequestSortUnstarred}
              rowCount={unstarredrow.length}
            />
            <TableBody>
              {stableSort(
                  query ? unstarredrow.filter(x =>
                    (x.name).toLowerCase()
                      .includes(query)
                  ) : unstarredrow, getComparator(orderUnstarred, orderByUnstarred), orderByUnstarred, orderUnstarred )
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.name)}
                      // role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell padding="checkbox">
                      <IconButton onClick={(event) => handleClickStarred(event, row.name, "unstarred")} >
                      <StarBorderIcon />
                      </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell >{row.language}</TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                      <TableCell align="right">{row.view}</TableCell>
                      <TableCell align="right">
                      <IconButton>
                      <EditIcon />
                      </IconButton>
                      <IconButton>
                      <DeleteIcon />
                      </IconButton>
                      <IconButton>
                      <InfoIcon />
                      </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={unstarredrow.length}
          rowsPerPage={rowsPerPageUnstarred}
          page={pageUnstarred}
          onChangePage={handleChangePageUnstarred}
          onChangeRowsPerPage={handleChangeRowsPerPageUnstarred}
        /> */}
        </div>
      {/* </Paper> */}
    </div>
  );
}
