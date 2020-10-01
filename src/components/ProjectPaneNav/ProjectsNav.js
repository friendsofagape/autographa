import * as React from "react";
import CreateProjectAccordions from "../CreateProject/CreateProjectAccordions";
import Profile from "../ProjectsPane/Profile";
import TableData from "../ProjectsPane/TableData";
import Sync from "../Sync/Sync";

export const ProjectsNav = ({ title }) => {
  return (
    <>
      {(() => {
        switch (title) {
          case "Profile":
            return <Profile />;
          case "Sync":
            return <Sync />;
          case "Projects":
            return <TableData />;
          case "Create New Project":
            return <CreateProjectAccordions />;
          default:
            return null;
        }
      })()}
    </>
  );
};
