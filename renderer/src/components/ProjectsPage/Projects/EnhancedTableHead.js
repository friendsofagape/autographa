import React from 'react';
import PropTypes from 'prop-types';
import {
  TableSortLabel,
  TableCell,
} from '@material-ui/core';
import { StarIcon } from '@heroicons/react/outline';

const headCells = [
  {
    id: 'name', numeric: false, disablePadding: true, label: 'Project Name',
  },
  {
    id: 'language', numeric: false, disablePadding: true, label: 'Language',
  },
  {
    id: 'status', numeric: false, disablePadding: true, label: 'Status',
  },
  {
    id: 'date', numeric: true, disablePadding: false, label: 'Date',
  },
  {
    id: 'view', numeric: true, disablePadding: false, label: 'Last Viewed',
  },
  {
    id: 'editors', numeric: false, disablePadding: false, label: 'Editors',
  },
  {
    id: 'more', numeric: false, disablePadding: false, label: '',
  },
];

function EnhancedTableHead(props) {
  const {
    order, orderBy, onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <>
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-400"
          >
            <StarIcon className="h-5 w-5" aria-hidden="true" />
          </th>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              className="bg-gray-50"
              sortDirection={orderBy === headCell.id ? order : false}
            >

              <TableSortLabel
                scope="col"
                id="sorthead"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontWeight: 'bold', color: 'grey' }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span hidden>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
              ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </tr>
      </thead>
    </>
  );
}

export default EnhancedTableHead;

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};
