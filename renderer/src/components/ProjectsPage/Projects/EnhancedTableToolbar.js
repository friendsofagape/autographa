import {
  Box, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useToolbarStyles } from '../useStyles/ProjectStyles';

const EnhancedTableToolbar = ({ title }) => {
  const classes = useToolbarStyles();

  return (
    <Typography
      className={classes.title}
      variant="h6"
      id="tableTitle"
      component="div"
    >
      <Box fontWeight={600} m={1}>
        {title}
      </Box>
    </Typography>
  );
};

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
