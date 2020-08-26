// const PouchDB = require("pouchdb").default;
import PouchDB from "pouchdb";
const path = require("path");
const remote = window.remote;
const app = remote.app;
let basepath = app.getAppPath();
let _targetDb, _referenceDb, _lookupsDb;

export const lookupsDb = () => {
  _lookupsDb =
    _lookupsDb || new PouchDB(path.join(basepath, "db", "lookupsDB"));
  return _lookupsDb;
};

export const targetDb = () => {
  _targetDb = _targetDb || new PouchDB(path.join(basepath, "db", "targetDB"));
  return _targetDb;
};

export const referenceDb = () => {
  _referenceDb =
    _referenceDb ||
    new PouchDB.plugin(require("pouchdb-quick-search"))(
      path.join(basepath, "db", "referenceDB")
    );
  return _referenceDb;
};
