import React from "react";
import AudioPlayer from "react-h5-audio-player";
import { makeStyles } from "@material-ui/core/styles";
import AutographaStore from "../../../components/AutographaStore";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginLeft: 150,
    float: "left",
    marginTop: 20,
    position: "static",
  },
}));

const Player = (props) => {
  const classes = useStyles();
  return (
    <div>
      {AutographaStore.isPlaying && (
        <div className={classes.root}>
          <AudioPlayer
            src={AutographaStore.blobURL}
            onPause={() => (AutographaStore.isPlaying = false)}
            showDownloadProgress={true}
            showVolumeControl={true}
            showJumpControls={true}
            onEnded={(e) => (AutographaStore.isPlaying = false)}
          />
        </div>
      )}
    </div>
  );
};

export default Player;
