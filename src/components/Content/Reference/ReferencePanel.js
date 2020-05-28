import React from "react";
import { useStyles } from "./useStyles";

const ReferencePanel = (props) => {
  const classes = useStyles();
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: props.refContent,
        }}
      />
    </div>
  );
};

export default ReferencePanel;
