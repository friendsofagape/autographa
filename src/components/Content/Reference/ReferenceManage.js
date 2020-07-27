import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ClearIcon from "@material-ui/icons/Clear";
import Paper from "@material-ui/core/Paper";
import DoneIcon from "@material-ui/icons/Done";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AutographaStore from "../../AutographaStore";
import swal from "sweetalert";
import { SetupContext } from "../../../contexts/SetupContext";
import { Observer } from "mobx-react";
const refDb = require(`${__dirname}/../../../core/data-provider`).referenceDb();

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "LanguageCode",
    numeric: true,
    disablePadding: false,
    label: "LanguageCode",
  },
  { id: "Version", numeric: true, disablePadding: false, label: "Version" },
];

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
        <TableCell padding="checkbox" />
        <TableCell padding="checkbox" />
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "102%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 500,
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
}));

export default function ReferenceManage(props) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const { refListEdit, loadReference } = useContext(SetupContext);
  const [bibleReference, setBibleReference] = React.useState(true);
  const [refName, setRefName] = React.useState("");

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = refListEdit.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    loadReference();
  }, [loadReference]);

  //Rename
  const onReferenceRename = (name, index, e) => {
    setSelected(index);
    setBibleReference(!bibleReference);
  };

  //Remove
  const onReferenceRemove = (element) => {
    var ref_ids = [];
    const currentTrans = AutographaStore.currentTrans;
    swal({
      title: currentTrans["label-heading-confirmation"],
      text: currentTrans["dynamic-msg-del-ref-text"],
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        refDb
          .get("refs")
          .then(
            (doc) => {
              doc.ref_ids.forEach((ref_doc) => {
                if (ref_doc.ref_id != element) {
                  ref_ids.push({
                    ref_id: ref_doc.ref_id,
                    ref_name: ref_doc.ref_name,
                    ref_lang_code: ref_doc.ref_lang_code,
                    isDefault: ref_doc.isDefault,
                  });
                }
              });
              doc.ref_ids = ref_ids;
              return refDb.put(doc);
            },
            (err) => {
              swal(
                currentTrans["dynamic-msg-error"],
                currentTrans["dynamic-msg-del-unable"],
                "error"
              );
            }
          )
          .then((res) => {
            window.location.reload();
          });
      }
    });
  };
  //Save
  const onReferenceSave = (docId, e) => {
    // this.setState({bibleReference: !this.state.bibleReference});
    const currentTrans = AutographaStore.currentTrans;
    let bibleNameLen = refName.length;
    if (bibleNameLen > 10) {
      swal(
        currentTrans["label-bible-name"],
        currentTrans["ref_name_max_valid"],
        "error"
      );
      return;
    } else if (bibleNameLen < 3) {
      swal(
        currentTrans["label-bible-name"],
        currentTrans["ref_name_min_valid"],
        "error"
      );
      return;
    } else if (bibleNameLen == 0) {
      swal(
        currentTrans["label-bible-name"],
        currentTrans["ref_name_blank"],
        "error"
      );
      return;
    }
    let ref_ids = [];
    let result = false;
    refDb
      .get("refs")
      .then((doc) => {
        doc.ref_ids.forEach((ref_doc) => {
          if (
            ref_doc.ref_id != docId &&
            ref_doc.ref_name.toLowerCase() === refName.toLowerCase()
          ) {
            result = true;
            return;
          }
          //Updating db on save
          if (ref_doc.ref_id != docId) {
            ref_ids.push({
              ref_id: ref_doc.ref_id,
              ref_name: ref_doc.ref_name,
              ref_lang_code: ref_doc.ref_lang_code,
              isDefault: ref_doc.isDefault,
            });
          } else {
            ref_ids.push({
              ref_id: ref_doc.ref_id,
              ref_name: refName,
              ref_lang_code: ref_doc.ref_lang_code,
              isDefault: ref_doc.isDefault,
            });
          }
        });
        if (result == true) {
          return true;
        } else {
          doc.ref_ids = ref_ids;
          return refDb.put(doc);
        }
      })
      .then(
        (res) => {
          if (res == true) {
            swal(
              currentTrans["label-bible-name"],
              currentTrans["dynamic-msg-name-taken"],
              "warning"
            );
          } else {
            swal(
              currentTrans["label-bible-name"],
              "Bible name changed",
              "success"
            );
            loadReference();
            setBibleReference(!bibleReference);
          }
        },
        (err) => {
          swal(
            currentTrans["label-bible-name"],
            currentTrans["dynamic-msg-ren-unable"],
            "error"
          );
        }
      );
  };

  //Cancel
  const onReferenceCancel = (e) => {
    setBibleReference(!bibleReference);
  };

  //onChange Bible
  const onChangeBible = (e) => {
    setRefName(e.target.value);
  };

  return (
    <div className={classes.root}>
      <Observer>
        {() => (
          <Paper className={classes.paper}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={AutographaStore.refListExist.length}
                />
                <TableBody>
                  {AutographaStore.refListExist.map((ref, index) => {
                    let ref_first = ref.ref_id.substr(
                      0,
                      ref.ref_id.indexOf("_")
                    );
                    let ref_except_first = ref.ref_id.substr(
                      ref.ref_id.indexOf("_") + 1
                    );
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover tabIndex={-1} key={ref.ref_name}>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {ref.ref_name}
                        </TableCell>
                        <TableCell align="right">{ref.ref_lang_code}</TableCell>
                        <TableCell align="right">{ref_except_first}</TableCell>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell padding="checkbox"></TableCell>
                      </TableRow>
                    );
                  })}
                  {AutographaStore.refListEdit.map((ref, index) => {
                    let ref_first = ref.ref_id.substr(
                      0,
                      ref.ref_id.indexOf("_")
                    );
                    let ref_except_first = ref.ref_id.substr(
                      ref.ref_id.indexOf("_") + 1
                    );
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={selected}
                        tabIndex={-1}
                        key={ref.ref_name}
                      >
                        {!bibleReference && selected === index ? (
                          <React.Fragment>
                            <TableCell padding="checkbox">
                              <Tooltip title="save">
                                <IconButton
                                  aria-label="save"
                                  onClick={() => onReferenceSave(ref.ref_id)}
                                >
                                  <DoneIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell padding="checkbox">
                              <Tooltip title="cancel">
                                <IconButton
                                  aria-label="cancel"
                                  onClick={() =>
                                    onReferenceCancel(ref.ref_name)
                                  }
                                >
                                  <ClearIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell padding="checkbox"></TableCell>
                          </React.Fragment>
                        )}
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {selected === index && !bibleReference ? (
                            <React.Fragment>
                              <input
                                type="text"
                                onChange={onChangeBible}
                                value={refName}
                                name="biblename"
                              />
                            </React.Fragment>
                          ) : (
                            <React.Fragment>{ref.ref_name}</React.Fragment>
                          )}
                        </TableCell>
                        <TableCell align="right">{ref.ref_lang_code}</TableCell>
                        <TableCell align="right">{ref_except_first}</TableCell>
                        <TableCell padding="checkbox">
                          <span>
                            <Tooltip title="Edit Reference Name ">
                              <IconButton
                                aria-label="filter list"
                                onClick={() =>
                                  onReferenceRename(ref.ref_name, index)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </span>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <span>
                            <Tooltip title="Delete">
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  onReferenceRemove(
                                    ref_first + "_" + ref_except_first
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Observer>
    </div>
  );
}
