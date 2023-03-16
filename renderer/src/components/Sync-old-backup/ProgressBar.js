import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography } from '@material-ui/core';
// import LinearProgress from '@mui/material/LinearProgress';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

function LinearProgressWithLabel({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        {/* <LinearProgress variant="determinate" {...props} /> */}
        <LinearProgress
          variant="determinate"
          value={value}
          color="secondary"
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="primary">
          {`${Math.round(
          value,
        )}%`}

        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel({ currentValue, totalValue }) {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    // console.log(currentValue, totalValue);
    const calculated = ((currentValue * 100) / totalValue);
    setProgress(calculated);
  }, [currentValue, totalValue]);

  return (
    // <div className="h-full items-center justify-center flex">
    //     <Box sx={{ width: '100%' }}>
    //     <LinearProgressWithLabel value={progress} />
    //     </Box>
    // </div>
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}

LinearWithValueLabel.propTypes = {
  currentValue: PropTypes.number.isRequired,
  totalValue: PropTypes.number.isRequired,
};
