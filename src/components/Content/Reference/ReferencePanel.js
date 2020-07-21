import React from "react";
import AutographaStore from "../../AutographaStore";
import { Observer } from "mobx-react";
import PropTypes from "prop-types";

const ReferencePanel = ({ refContent, tIns, tDel }) => {
  return (
    <React.Fragment>
      <Observer>
        {() => (
          <div
            style={{ fontSize: `${AutographaStore.currentFontValue}px` }}
            data-test="reference-panel"
          >
            {AutographaStore.toggle && (tIns || tDel) ? (
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#27b97e", fontWeight: "bold" }}>
                  (+) {tIns}
                </span>{" "}
                |{" "}
                <span style={{ color: "#f50808", fontWeight: "bold" }}>
                  (-) {tDel}
                </span>
              </div>
            ) : (
              ""
            )}
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
