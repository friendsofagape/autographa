import React from "react";
import AutographaStore from "../../AutographaStore";
import { Observer } from "mobx-react";

const ReferencePanel = (props) => {
  return (
    <React.Fragment>
      <Observer>
        {() => (
          <div style={{ fontSize: `${AutographaStore.currentFontValue}px` }}>
            <div
              dangerouslySetInnerHTML={{
                __html: props.refContent,
              }}
            />
          </div>
        )}
      </Observer>
    </React.Fragment>
  );
};

export default ReferencePanel;
