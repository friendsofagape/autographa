import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles, fade } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import { IconButton, Box } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import moment from "moment";

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: function (number) {
      if (number < 7) {
        return number + " days"; // Moment uses "d" when it's just 1 day.
      } else {
        var weeks = Math.round(number / 7);
        return weeks + " " + (weeks > 1 ? "weeks" : "week");
      }
    },
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

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
  { id: "view", numeric: true, disablePadding: false, label: "Last Viewed" },
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
              id="sorthead"
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <Box fontWeight={600} m={1}>
                {headCell.label}
              </Box>
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
      <Box fontWeight={600} m={1}>
        {title}
      </Box>
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
    position: "relative",
    float: "right",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  container: {
    maxHeight: 400,
  },
  iconbutton: {
    padding: 0,
  },
}));

export default function Projects(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderUnstarred, setOrderUnstarred] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [orderByUnstarred, setOrderByUnstarred] = React.useState("name");
  const [query, setQuery] = React.useState("");
  const [starredrow] = React.useState(props.starrted);
  const [unstarredrow] = React.useState(props.unstarrted);
  const [temparray, settemparray] = React.useState(null);
  const [active, setactive] = React.useState("");
  const [actionsStarred, setActionsStarred] = React.useState(false);
  const [hoverIndexStarred, sethoverIndexStarred] = React.useState("");
  const [actionsUnStarred, setActionsUnStarred] = React.useState(false);
  const [hoverIndexUnStarred, sethoverIndexUnStarred] = React.useState("");

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

  const handleClickStarred = (event, name, property) => {
    property === "starred" ? setactive("starred") : setactive("unstarred");
    let selectedIndex =
      property === "starred"
        ? starredrow.findIndex((x) => x.name === name)
        : unstarredrow.findIndex((x) => x.name === name);
    const copy =
      property === "starred"
        ? starredrow.splice(selectedIndex, 1)
        : unstarredrow.splice(selectedIndex, 1);
    settemparray(copy[0]);
  };

  const handleDelete = (event, name, property) => {
    let selectedIndex =
      property === "starred"
        ? starredrow.findIndex((x) => x.name === name)
        : unstarredrow.findIndex((x) => x.name === name);

    property === "starred"
      ? starredrow.splice(selectedIndex, 1)
      : unstarredrow.splice(selectedIndex, 1);
  };

  // eslint-disable-next-line
  useEffect(() => {
    if (temparray)
      active === "starred"
        ? unstarredrow.push(temparray)
        : starredrow.push(temparray);
    handleRequestSortUnstarred("asc", "view");
    // eslint-disable-next-line
  }, [temparray, active]);

  const mouseEnterStarred = (index) => {
    setActionsStarred(true);
    sethoverIndexStarred(index);
  };
  const mouseLeaveStarred = (event) => {
    setActionsStarred(false);
  };
  const mouseEnterUnStarred = (index) => {
    setActionsUnStarred(true);
    sethoverIndexUnStarred(index);
  };
  const mouseLeaveUnStarred = (event) => {
    setActionsUnStarred(false);
  };
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
            inputProps={{
              "aria-label": "search",
              "data-testid": "searchfield",
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Toolbar>
      {props.starrted && (
        <div>
          <EnhancedTableToolbar title={"Starred"} />
          <TableContainer className={classes.container}>
            <Table
              stickyHeader
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={starredrow.length}
              />
              {starredrow.length !== 0 ? (
                <TableBody id="starredrow">
                  {stableSort(
                    query
                      ? starredrow.filter((x) =>
                          x.name.toLowerCase().includes(query.toLowerCase())
                        )
                      : starredrow,
                    getComparator(order, orderBy),
                    orderBy,
                    order
                  ).map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        onMouseEnter={(event) => mouseEnterStarred(index)}
                        onMouseLeave={mouseLeaveStarred}
                      >
                        <TableCell padding="checkbox">
                          <IconButton
                            color="inherit"
                            id="starredicon"
                            onClick={(event) =>
                              handleClickStarred(event, row.name, "starred")
                            }
                          >
                            <StarIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          id="starredrow-name"
                          component="th"
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell
                          id="starredrow-language"
                          component="th"
                          scope="row"
                          padding="none"
                        >
                          {row.language}
                        </TableCell>
                        <TableCell id="starredrow-date" align="right">
                          {row.date}
                        </TableCell>
                        <TableCell id="starredrow-time" align="right">
                          {moment(row.view, "YYYY-MM-DD h:mm:ss").fromNow()}
                        </TableCell>
                        {actionsStarred && hoverIndexStarred === index ? (
                          <TableCell align="left">
                            <IconButton className={classes.iconbutton}>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              className={classes.iconbutton}
                              onClick={(event) =>
                                handleDelete(event, row.name, "starred")
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton className={classes.iconbutton}>
                              <InfoIcon />
                            </IconButton>
                          </TableCell>
                        ) : (
                          <TableCell align="left">
                            <IconButton></IconButton>
                            <IconButton></IconButton>
                            <IconButton></IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <div>No data to display</div>
              )}
            </Table>
          </TableContainer>
        </div>
      )}
      {props.starrted && (
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
                order={orderUnstarred}
                orderBy={orderByUnstarred}
                onRequestSort={handleRequestSortUnstarred}
                rowCount={unstarredrow.length}
              />
              <TableBody id="unstarredrow">
                {stableSort(
                  query
                    ? unstarredrow.filter((x) =>
                        x.name.toLowerCase().includes(query.toLowerCase())
                      )
                    : unstarredrow,
                  getComparator(orderUnstarred, orderByUnstarred),
                  orderByUnstarred,
                  orderUnstarred
                ).map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onMouseEnter={(event) => mouseEnterUnStarred(index)}
                      onMouseLeave={mouseLeaveUnStarred}
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell padding="checkbox">
                        <IconButton
                          color="inherit"
                          id="unstarredicon"
                          onClick={(event) =>
                            handleClickStarred(event, row.name, "unstarred")
                          }
                        >
                          <StarBorderIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        id="unstarredrow-name"
                        component="th"
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        id="unstarredrow-language"
                        component="th"
                        scope="row"
                        padding="none"
                      >
                        {row.language}
                      </TableCell>
                      <TableCell id="unstarredrow-date" align="right">
                        {row.date}
                      </TableCell>
                      <TableCell id="unstarredrow-time" align="right">
                        {moment(row.view, "YYYY-MM-DD h:mm:ss").fromNow()}
                      </TableCell>
                      {actionsUnStarred && hoverIndexUnStarred === index ? (
                        <TableCell align="left">
                          <IconButton className={classes.iconbutton}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className={classes.iconbutton}
                            onClick={(event) =>
                              handleDelete(event, row.name, "unstarred")
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton className={classes.iconbutton}>
                            <InfoIcon />
                          </IconButton>
                        </TableCell>
                      ) : (
                        <TableCell align="left">
                          <IconButton></IconButton>
                          <IconButton></IconButton>
                          <IconButton></IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}
