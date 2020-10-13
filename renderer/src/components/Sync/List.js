import React from "react";
import Sync from "./Sync";
const List = () => {
  const projects = [
    {
      project: "Project Malayalam",
      files: ["Gen.usfm", "Exo.usfm", "Readme.md"],
    },
    {
      project: "Project Arabic",
      files: [
        "Lev.usfm",
        "Psa.usfm",
        "Isa.usfm",
        "Mat.usfm",
        "Luk.usfm",
        "Tit.usfm",
      ],
    },
    {
      project: "Project English",
      files: ["Mat.usfm", "Luk.usfm", "Tit.usfm"],
    },
    {
      project: "Project Urdu",
      files: [],
    },
  ];
  return (
    <div>
      <Sync projects={projects} />
    </div>
  );
};

export default List;
