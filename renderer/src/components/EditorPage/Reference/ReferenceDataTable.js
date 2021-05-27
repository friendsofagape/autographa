/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ReferenceContext } from '@/components/context/ReferenceContext';

const useStyles = makeStyles({
  table: {
    minWidth: 600,
    top: 0,
  },
});

export default function ReferenceDataTable({ handleClose, listItemsVal, tn }) {
  const classes = useStyles();
  const {
    actions: {
        setLanguageId,
        SetSelectedResource,
    },
  } = useContext(ReferenceContext);

  const handleRowSelect = (e, row) => {
    SetSelectedResource(listItemsVal);
    setLanguageId(row.language);
    handleClose();
  };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Language</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tn.map((row) => (
            <TableRow hover onClick={(e) => handleRowSelect(e, row)} key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.language}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
