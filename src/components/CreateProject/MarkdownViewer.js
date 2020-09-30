// @flow
import * as React from "react";
// import ReactMarkdown from "react-markdown";
import termsFrPath from "./test.md";
import { BlockEditable } from "markdown-translatable/dist/components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Zoom,
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Zoom
      style={{ transitionDelay: "50ms" }}
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

export const MarkdownViewer = ({ openmdviewer, setopenmdviewer }) => {
  const [preview, setpreview] = React.useState(true);
  const [translation, settranslation] = React.useState();
  React.useEffect(() => {
    fetch(termsFrPath)
      .then((response) => response.text())
      .then((text) => {
        settranslation(text);
      });
  }, []);

  const handleClose = () => {
    setopenmdviewer(false);
  };
  const callback = (markdown) => {
    // do something when the user exits editing element (onBlur).
    settranslation(markdown);
  };
  return (
    <div>
      <div>
        <Dialog
          maxWidth="xl"
          fullWidth={true}
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openmdviewer}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setpreview(!preview)}
          >
            {!preview ? "Markdown" : "Preview (HTML EDIT)"}
          </Button>
          {/* <ReactMarkdown source={translation} /> */}
          <DialogContent dividers>
            <BlockEditable
              markdown={translation}
              preview={preview}
              onEdit={callback}
              inputFilters={[
                [/<br>/gi, "\n"],
                [/(<u>|<\/u>)/gi, "__"],
              ]}
              outputFilters={[[/\n/gi, "<br>"]]}
            />
            {/* <BlockTranslatable
          
            translation={translation}
            preview={preview}
            onTranslation={(translation) => settranslation(translation)}
          /> */}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} variant="contained">
              Cancel
            </Button>
            <Button
              autoFocus
              onClick={handleClose}
              variant="contained"
              color="primary"
            >
              save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
