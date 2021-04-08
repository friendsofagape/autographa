import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {
  useStyles, DialogContent, DialogActions, Transition,
} from './useStyles';

const DialogTitle = ((props) => {
  const classes = useStyles();
  const {
    children, onClose, ...other
  } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.dialogTitle} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function CustomDialog({
  open,
  title,
  buttons,
  content,
  width,
  handleClose,
}) {
  return (
    <div>
      <Dialog
        maxWidth={width}
        fullWidth
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          id="customized-dialog-title"
          data-testid="dialog-title"
          onClose={handleClose}
        >
          {title}
        </DialogTitle>
        <DialogContent dividers>
          {content}
        </DialogContent>
        <DialogActions>
          <span data-testid="dialog-buttons">
            {buttons}
          </span>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DialogTitle.propTypes = {
  /** State function to close dialog */
  onClose: PropTypes.func,
  /** Component to render inside of the custom dialog. */
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

CustomDialog.propTypes = {
  /** The title string or jsx to be displayed. */
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  /** State which triggers dialog. */
  open: PropTypes.bool.isRequired,
  /** State setting function to trigger dialog */
  handleClose: PropTypes.func,
  /** Additional buttons to be displayed. */
  buttons: PropTypes.element,
  /** Component to render inside of the custom dialog. */
  content: PropTypes.element,
  /** Determines window size */
  width: PropTypes.string,
};
