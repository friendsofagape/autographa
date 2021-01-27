import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import {
  IconButton, Paper, Grid,
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
import SearchData from './SearchData';
import { ProjectStyles } from '../useStyles/ProjectStyles';
import * as logger from '../../../logger';
import { getComparator, stableSort } from './SortingHelper';
import UnstarredProjects from './UnstarredProjects';
import { AutographaContext } from '../../AutogrpahaContext/AutographaContext';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';

export default function StarredProjects() {
  const classes = ProjectStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [actionsStarred, setActionsStarred] = React.useState(false);
  const [hoverIndexStarred, sethoverIndexStarred] = React.useState('');
  const {
    states: {
      starredrow,
    },
    action: {
      handleClickStarred,
      handleDelete,
      setStarredRow,
      setUnStarredRow,
    },
  } = React.useContext(AutographaContext) || {};

  const handleRequestSort = (event, property) => {
    logger.debug(
      'project.js',
      `calling starred stable sort with value of orderBy=${property}`,
    );
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const mouseEnterStarred = (index) => {
    setActionsStarred(true);
    sethoverIndexStarred(index);
  };

  const mouseLeaveStarred = () => {
    setActionsStarred(false);
  };

  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={2} />
          <div className={classes.root} data-test="component-profile">
            <Grid item xs={10} />
            <div style={{ float: 'right' }}>
              <SearchData onfilerRequest1={setStarredRow} onfilerRequest2={setUnStarredRow} />
            </div>
            {starredrow && (
            <div>
              <EnhancedTableToolbar title="Starred" />
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
                      {stableSort(starredrow,
                        getComparator(order, orderBy),
                        orderBy,
                        order).map((row, index) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.name}
                            onMouseEnter={() => mouseEnterStarred(index)}
                            onMouseLeave={mouseLeaveStarred}
                          >
                            <TableCell padding="checkbox">
                              <IconButton
                                color="inherit"
                                id="starredicon"
                                onClick={(event) => handleClickStarred(event, row.name, 'starred')}
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
                              {moment(row.view, 'YYYY-MM-DD h:mm:ss').fromNow()}
                            </TableCell>
                            {actionsStarred && hoverIndexStarred === index ? (
                              <TableCell align="left">
                                <IconButton className={classes.iconbutton}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  className={classes.iconbutton}
                                  onClick={(event) => handleDelete(event, row.name, 'starred')}
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
                  ) : (
                    <div>No data to display</div>
                  )}
                </Table>
              </TableContainer>
            </div>
            )}
            <UnstarredProjects />
          </div>
        </Grid>
      </Paper>
    </>
  );
}
