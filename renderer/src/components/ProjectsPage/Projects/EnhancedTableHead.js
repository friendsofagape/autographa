import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TableHead,
  TableSortLabel,
  TableRow,
  TableCell,
} from '@material-ui/core';

const headCells = [
  {
    id: 'name', numeric: false, disablePadding: true, label: 'Project Name',
  },
  {
    id: 'language', numeric: false, disablePadding: true, label: 'Language',
  },
  {
    id: 'date', numeric: true, disablePadding: false, label: 'Date',
  },
  {
    id: 'view', numeric: true, disablePadding: false, label: 'Last Viewed',
  },
];

function EnhancedTableHead(props) {
  const {
    classes, order, orderBy, onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              id="sorthead"
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Box fontWeight={600} m={1}>
                {headCell.label}
              </Box>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};
