import React from 'react';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {
  IconButton,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';
import { ProjectStyles } from '../useStyles/ProjectStyles';
import { getComparator, stableSort } from './SortingHelper';
import { AutographaContext } from '../../context/AutographaContext';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';

const UnstarredProjects = () => {
  const classes = ProjectStyles();
  const [actionsUnStarred, setActionsUnStarred] = React.useState(false);
  const [hoverIndexUnStarred, sethoverIndexUnStarred] = React.useState('');
  const {
    states: {
      unstarredrow,
      orderUnstarred,
      orderByUnstarred,
    }, action: {
      handleClickStarred,
      handleDelete,
      handleRequestSortUnstarred,
    },
  } = React.useContext(AutographaContext) || {};

  const mouseEnterUnStarred = (index) => {
    setActionsUnStarred(true);
    sethoverIndexUnStarred(index);
  };

  const mouseLeaveUnStarred = () => {
    setActionsUnStarred(false);
  };

  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <div className={classes.root} data-test="component-profile">
            <Grid item xs={10} />
            {unstarredrow && (
            <div>
              <EnhancedTableToolbar title="Everythings else" />
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
                    {stableSort(unstarredrow,
                      getComparator(orderUnstarred, orderByUnstarred),
                      orderByUnstarred,
                      orderUnstarred).map((row, index) => (
                        <TableRow
                          hover
                          onMouseEnter={() => mouseEnterUnStarred(index)}
                          onMouseLeave={mouseLeaveUnStarred}
                          tabIndex={-1}
                          key={row.name}
                        >
                          <TableCell padding="checkbox">
                            <IconButton
                              color="inherit"
                              id="unstarredicon"
                              onClick={(event) => handleClickStarred(event, row.name, 'unstarred')}
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
                            {moment(row.view, 'YYYY-MM-DD h:mm:ss').fromNow()}
                          </TableCell>
                          {actionsUnStarred && hoverIndexUnStarred === index ? (
                            <TableCell align="left">
                              <IconButton className={classes.iconbutton}>
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                className={classes.iconbutton}
                                onClick={(event) => handleDelete(event, row.name, 'unstarred')}
                              >
                                <DeleteIcon />
                              </IconButton>
                              <IconButton className={classes.iconbutton}>
                                <InfoIcon />
                              </IconButton>
                            </TableCell>
                          ) : (
                            <TableCell align="left">
                              <IconButton />
                              <IconButton />
                              <IconButton />
                            </TableCell>
                          )}
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            )}
          </div>
        </Grid>
      </Paper>
    </>
  );
};

export default UnstarredProjects;
