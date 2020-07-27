import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import ProjectListRow from "./Paratext/ProjectListRow";
import paratext from "./Paratext/core/ParatextAdapter";
import swal from "sweetalert";
import AutographaStore from "../AutographaStore";
import Loader from "../Loader/Loader";
const refDb = require(`${__dirname}/../../core/data-provider`).referenceDb();
const GetProjects = (props) => {
  const [showLoader, setShowLoader] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [projectList, setProjectList] = React.useState([]);
  const [adapter, setAdapter] = React.useState(null);

  const getData = async () => {
    setShowLoader(true);
    AutographaStore.paraUsername = props.username;
    AutographaStore.paraPassword = props.password;

    const syncAdapter = await newSyncAdapter(
      props.syncProvider,
      props.username,
      props.password,
      null
    );
    if (syncAdapter.accessToken) {
      try {
        let projects = await syncAdapter.getProjects(3);

        refDb
          .get("sync_credential")
          .then((doc) => {
            // this.props.showLoader(false);
            // AutographaStore.syncProvider = syncProvider;
            // AutographaStore.endpoint = endpoint;
            AutographaStore.paraUsername = props.username;
            AutographaStore.paraPassword = props.password;

            setProjectList(projects);
            setAdapter(syncAdapter);
            let newdoc = {
              _id: "sync_credential",
              _rev: doc._rev,
              syncProvider: props.syncProvider,
              endpoint: null,
              username: props.username,
              password: props.password,
            };
            refDb.put(newdoc);
          })
          .catch((err) => {
            let doc = {
              _id: "sync_credential",
              syncProvider: props.syncProvider,
              endpoint: null,
              username: props.username,
              password: props.password,
            };
            refDb
              .put(doc)
              .then((res) => {
                setProjectList(projects);
                setAdapter(syncAdapter);
              })
              .catch((err) => {
                setShowLoader(false);
                swal("Error", "Something went wrong90", "error");
              });
          });
      } catch (err) {
        swal("Error", "Something went wrong94", "error");
      } finally {
        setOpen(true);
        setShowLoader(false);
      }
    } else {
      setShowLoader(false);
      swal("Error", "Something went wrong102", "error");
    }
  };
  const newSyncAdapter = (
    syncProviderName,
    username,
    password,
    endpoint = null
  ) => {
    // const onFailure = (err) => {
    //   swal("Error", "Something went wrong14", "error");
    // };

    switch (syncProviderName) {
      case "paratext":
        return new paratext(username, password);
      // case "door43":
      //   return new gitea(
      //     username,
      //     password,
      //     ENDPOINTS[syncProviderName],
      //     onFailure
      //   );
      // case "other":
      //   return new gitea(username, password, endpoint, onFailure);
      default:
        return;
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        onEnter={getData}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {props.syncProvider}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            {projectList.length > 0 ? (
              projectList.map((project, i) => {
                return (
                  <ProjectListRow
                    key={i}
                    index={i}
                    project={project}
                    syncAdapter={adapter}
                  />
                );
              })
            ) : (
              <p>No projects</p>
            )}
          </Typography>
        </DialogContent>
      </Dialog>
      {showLoader === true ? <Loader /> : ""}
    </div>
  );
};

export default GetProjects;
