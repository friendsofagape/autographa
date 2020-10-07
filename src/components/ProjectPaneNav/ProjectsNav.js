import * as React from "react";
import { logger } from "../../logger";
import CreateProjectAccordions from "../CreateProject/CreateProjectAccordions";
import Profile from "../ProjectsPane/Profile";
import TableData from "../ProjectsPane/TableData";
import List from "../Sync/List";

export const ProjectsNav = ({ title }) => {
  return (
    <>
      {(() => {
        switch (title) {
          case "Profile":
            logger.debug("ProjectNav.js, Profile component selected");
            return <Profile />;
          case "Sync":
            logger.debug("ProjectNav.js, Sync component selected");
            return <List />;
          case "Projects":
            logger.debug("ProjectNav.js, Projects component selected");
            return <TableData />;
          case "Create New Project":
            logger.debug(
              "ProjectNav.js, Create New Project component selected on mount"
            );
            return <CreateProjectAccordions />;
          default:
            return null;
        }
      })()}
    </>
  );
};
