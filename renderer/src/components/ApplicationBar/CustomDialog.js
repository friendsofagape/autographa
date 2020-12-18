import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useStyles, DialogContent, DialogActions } from './useStyles';

const DialogTitle = ((props) => {
    const classes = useStyles() 
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
    setOpen,
    title,
    buttons,
    children,
}) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </DialogTitle>
        <DialogContent dividers>
           {children}
        </DialogContent>
        <DialogActions>
          {buttons}
        </DialogActions> 
      </Dialog>
    </div>
  );
}

CustomDialog.propTypes = {
    /** The title string or jsx to be displayed. */
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    /** State which triggers dialog. */
    open: PropTypes.bool,
    /** State setting function to trigger dialog */
    setOpen: PropTypes.func,
    /** Additional buttons to be displayed. */
    buttons: PropTypes.element,
    /** Component to render inside of the custom dialog. */
    children: PropTypes.element,
  };
  