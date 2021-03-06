import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
 Box, Divider, Grid, Paper,
} from '@material-ui/core';
import GeneralSettting from './GeneralSettting';
import AdvancedSetttings from './AdavancedSettings';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 600,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function CreateProjectAccordions() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={1} />
          <div className={classes.root} data-test="component-profile">
            <Accordion
              style={{ boxShadow: '0 10px 20px rgba(0,0,0,0)', margin: '0px' }}
              expanded
            >
              <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header" />
              <AccordionDetails>
                <GeneralSettting />
              </AccordionDetails>
              <Accordion
                className={classes.rootcolor}
                style={{ boxShadow: '0 10px 20px rgba(0,0,0,0)' }}
                expanded={expanded === 'panel3'}
                onChange={handleChange('panel3')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                  style={{ width: 'fit-content' }}
                >
                  <Box fontWeight={600} m={1}>
                    <Typography className={classes.heading}>
                      Advanced Settings
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <AdvancedSetttings />
                </AccordionDetails>
              </Accordion>
            </Accordion>
            <Divider orientation="vertical" flexItem />
          </div>
        </Grid>
      </Paper>
    </>
  );
}
