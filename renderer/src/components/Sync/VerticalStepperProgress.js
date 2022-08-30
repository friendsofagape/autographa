import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Box, Paper, Step, StepContent, StepLabel, Stepper, Typography,
} from '@material-ui/core';

export function VerticalLinearStepper({ stepCount, steps }) {
    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, [stepCount]);

    const handleReset = () => {
        setActiveStep(0);
      };

    React.useEffect(() => {
        handleReset();
    }, []);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption" />
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                {/* <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div> */}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Process completed - you&apos;re finished</Typography>
          {/* <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button> */}
        </Paper>
      )}
    </Box>
  );
}

VerticalLinearStepper.propTypes = {
    steps: PropTypes.array.isRequired,
    stepCount: PropTypes.number,
};

// export default function VerticalStepperProgress() {
// //   const [progress, setProgress] = React.useState(0);
// //   React.useEffect(() => {
// //     // console.log(currentValue, totalValue);
// //     const calculated = ((currentValue * 100) / totalValue);
// //     setProgress(calculated);
// //   }, [currentValue, totalValue]);

//   return (
//     <Box sx={{ width: '100%' }}>
//       <VerticalLinearStepper />
//     </Box>
//   );
// }

// VerticalStepperProgress.propTypes = {
// //   currentValue: PropTypes.number.isRequired,
// //   totalValue: PropTypes.number.isRequired,
// };
