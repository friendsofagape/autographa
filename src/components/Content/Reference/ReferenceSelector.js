import React from "react";
import { useStyles } from "./useStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AutographaStore from "../../AutographaStore";
import { Observer } from "mobx-react";
const refDb = require(`../../../core/data-provider`).referenceDb();

const ReferenceSelector = (props) => {
  const classes = useStyles();
  let existRef = [];
  let refLists = refDb.get("refs").then((doc) => {
    doc.ref_ids.forEach((ref_doc) => {
      existRef.push({ value: ref_doc.ref_id, option: ref_doc.ref_name });
    });
    return existRef;
  });
  refLists.then((refsArray) => {
    AutographaStore.refList = refsArray;
  });

  return (
    <div>
      <Observer>
        {() => (
          <Select
            className={classes.ref_drop_down}
            onChange={props.onClick}
            value={props.refIds}
            id={String(props.id)}
          >
            {AutographaStore.refList.map(function (refDoc, index) {
              return (
                <MenuItem value={refDoc.value} key={index}>
                  {refDoc.option}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </Observer>
    </div>
  );
};

export default ReferenceSelector;
