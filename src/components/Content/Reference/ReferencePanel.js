import React from "react";
import AutographaStore from "../../AutographaStore";
import { Observer } from "mobx-react";
import PropTypes from "prop-types";

const ReferencePanel = ({ refContent }) => {
  return (
    <React.Fragment>
      <Observer>
        {() => (
          <div
            style={{ fontSize: `${AutographaStore.currentFontValue}px` }}
            data-test="reference-panel"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: refContent,
              }}
            />
          </div>
        )}
      </Observer>
    </React.Fragment>
  );
};

ReferencePanel.propTypes = {
  refContent: PropTypes.string.isRequired,
};

export default ReferencePanel;
