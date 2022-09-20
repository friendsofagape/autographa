import * as React from 'react';
import PropTypes from 'prop-types';
import {
 Box, CircularProgress, Typography,
} from '@material-ui/core';

function CircularProgressWithLabel({ value }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        color="secondary"
        size="2.2rem"
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {`${Math.round(
          value,
        )}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function CircularWithValueLabel({ currentValue, totalValue }) {
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
    <Box sx={{ width: '11%' }}>
      <CircularProgressWithLabel value={progress} />
    </Box>
  );
}

CircularWithValueLabel.propTypes = {
  currentValue: PropTypes.number.isRequired,
  totalValue: PropTypes.number.isRequired,
};
