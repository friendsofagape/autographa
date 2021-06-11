/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { readRefBurrito } from '@/core/reference/readRefBurrito';
import * as localforage from 'localforage';
import { readRefMeta } from '@/core/reference/readRefMeta';

const useStyles = makeStyles({
  table: {
    minWidth: 600,
    top: 0,
  },
});
const RefBibleSelector = ({ handleClose }) => {
  const classes = useStyles();
  const {
    actions: {
        setLanguageId,
        SetSelectedResource,
        setRefName,
        setCurrentScope,
    },
  } = useContext(ReferenceContext);
  const regExp = /\(([^)]+)\)/;
  const [refList, setRefList] = useState([]);

  const handleRowSelect = (e, row, name) => {
    SetSelectedResource('bible');
    setLanguageId(row);
    setRefName(name);
    handleClose();
  };
  const handleInputChange = (data) => {
    setRefList(data);
  };

  useEffect(() => {
    const parseData = [];
    readRefMeta({
      projectname: 'newprodir',
    }).then((refs) => {
      refs.forEach((ref) => {
        readRefBurrito({
          projectname: 'newprodir',
          filename: ref,
        }).then((data) => {
            if (data) {
                parseData.push(JSON.parse(data));
                  localforage.setItem('refBibleBurrito', parseData).then(
                    () => localforage.getItem('refBibleBurrito'),
                    ).then((res) => {
                      handleInputChange(res);
                    }).catch((err) => {
                      // we got an error
                      throw err;
                    });
            }
        });
      });
    });
  }, []);

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Language</TableCell>
            <TableCell align="right">Abbreviation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {refList && (
            refList.map((ref) => (
              <TableRow
                hover
                onClick={(e) => handleRowSelect(
                  e,
                  ref.languages[0].tag,
                  ref.identification.abbreviation.en,
                )}
              >
                <TableCell component="th" scope="row">
                  {ref.identification.name.en}
                </TableCell>
                <TableCell align="right">{ref.languages[0].name.en}</TableCell>
                <TableCell align="right">{ref.identification.abbreviation.en}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RefBibleSelector;
