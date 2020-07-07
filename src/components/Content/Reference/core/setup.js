import React, { useEffect, useContext } from "react";
import AutographaStore from "../../../AutographaStore";
import ReferenceSelector from "../ReferenceSelector";
import ReferencePanel from "../ReferencePanel";
import { useStyles } from "../useStyles";
import { Observer } from "mobx-react";
import { Paper } from "@material-ui/core";
import TranslationSetUp from "../../Translation/core/TranslationSetUp";
import { SetupContext } from "../../../../contexts/SetupContext";

const SetUp = () => {
  const { refdbSetup, handleRefChange } = useContext(SetupContext);

  useEffect(() => {
    refdbSetup();
  });

  return (
    <React.Fragment>
      <Observer>
        {() => (
          <div>
            {AutographaStore.layout === 0 && (
              <Paper
                className={useStyles.parentdiv}
                style={{ width: "100%", float: "left" }}
              >
                <div
                  style={{ width: "100%", float: "left" }}
                  className="layoutx"
                >
                  <TranslationSetUp />
                </div>
              </Paper>
            )}
            {AutographaStore.layout === 1 && (
              <Paper
                className={useStyles.parentdiv}
                style={{ width: "100%", float: "left" }}
              >
                <div
                  className={useStyles.layoutx}
                  style={{ width: "50%", float: "left" }}
                >
                  <ReferenceSelector
                    onClick={(event) => handleRefChange(event, 0)}
                    refIds={AutographaStore.activeRefs[0]}
                    id={1}
                    layout={1}
                  />
                  <ReferencePanel refContent={AutographaStore.content} />
                </div>
                <div
                  style={{ width: "48%", float: "left" }}
                  className="layoutx"
                >
                  <TranslationSetUp />
                </div>
              </Paper>
            )}
            {AutographaStore.layout === 2 && (
              <Paper
                className={useStyles.parentdiv}
                style={{ width: "100%", float: "left" }}
              >
                <div
                  className={useStyles.layout2x}
                  style={{ width: "31.33%", float: "left" }}
                >
                  <ReferenceSelector
                    onClick={(event) => handleRefChange(event, 0)}
                    refIds={AutographaStore.activeRefs[0]}
                    id={21}
                    layout={1}
                  />
                  <ReferencePanel
                    refContent={AutographaStore.content}
                    refIds={AutographaStore.activeRefs[0]}
                  />
                </div>

                <div
                  className={useStyles.layout2x}
                  style={{ width: "33.33%", float: "left" }}
                >
                  <ReferenceSelector
                    onClick={(event) => handleRefChange(event, 1)}
                    refIds={AutographaStore.activeRefs[1]}
                    id={22}
                    layout={2}
                  />
                  <ReferencePanel
                    refContent={AutographaStore.contentOne}
                    refIds={AutographaStore.activeRefs[1]}
                  />
                </div>
                <div
                  style={{ padding: "10px", width: "33.33%", float: "left" }}
                  className="layout2x"
                >
                  <TranslationSetUp />
                </div>
              </Paper>
            )}
            {AutographaStore.layout === 3 && (
              <Paper
                className={useStyles.parentdiv}
                style={{ width: "100%", float: "left" }}
              >
                <div
                  className={useStyles.layout3x}
                  style={{ width: "25%", float: "left" }}
                >
                  <ReferenceSelector
                    onClick={(event) => handleRefChange(event, 0)}
                    refIds={AutographaStore.activeRefs[0]}
                    id={31}
                    layout={1}
                  />
                  <ReferencePanel
                    refContent={AutographaStore.content}
                    refIds={AutographaStore.activeRefs[0]}
                  />
                </div>
                <div
                  className={useStyles.layout3x}
                  style={{ width: "25%", float: "left" }}
                >
                  <ReferenceSelector
                    onClick={(event) => handleRefChange(event, 1)}
                    refIds={AutographaStore.activeRefs[1]}
                    id={32}
                    layout={2}
                  />
                  <ReferencePanel
                    refContent={AutographaStore.contentOne}
                    refIds={AutographaStore.activeRefs[1]}
                    tIns={AutographaStore.tIns[1]}
                    tDel={AutographaStore.tDel[1]}
                  />
                </div>
                <div
                  className={useStyles.layout3x}
                  style={{ width: "25%", float: "left" }}
                >
                  <ReferenceSelector
                    onClick={(event) => handleRefChange(event, 2)}
                    refIds={AutographaStore.activeRefs[2]}
                    id={33}
                    layout={3}
                  />
                  <ReferencePanel
                    refContent={AutographaStore.contentTwo}
                    refIds={AutographaStore.activeRefs[2]}
                    tIns={AutographaStore.tIns[2]}
                    tDel={AutographaStore.tDel[2]}
                  />
                </div>
                <div
                  style={{ padding: "10px", width: "23%", float: "right" }}
                  className="layout3x"
                >
                  <TranslationSetUp />
                </div>
              </Paper>
            )}
          </div>
        )}
      </Observer>
    </React.Fragment>
  );
};

export default SetUp;
