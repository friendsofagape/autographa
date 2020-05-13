import React from "react";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "./useStyles";

const ReferencePanel = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        dangerouslySetInnerHTML={{
          __html: props.refContent,
        }}
      />
    </div>
  );
};

export default ReferencePanel;
