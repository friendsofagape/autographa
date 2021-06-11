/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ReferenceDataTable from './ReferenceDataTable';
import RefBibleSelector from './RefBible/RefBibleSelection';

function TabPanel(props) {
  const {
 children, value, index, ...other
} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 430,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function createData(name, language, date) {
  return {
 name, language, date,
};
}

const tn = [
  createData('English Notes', 'en', '2021-02-05'),
  createData('Hindi Translation Notes', 'hi', '2021-02-11'),
  createData('Bengali', 'bn', '2021-02-25'),
  createData('Malayalam', 'ml', '2020-12-31'),
  createData('Gujrati Notes', 'gu', '2020-12-29'),
];

const tw = [
  createData('English TW', 'en', '2021-02-05'),
];

const ResourceFileManager = ({
  listItems,
  selectedIndex,
  setSelectedIndex,
  handleClose,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(selectedIndex);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedIndex(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label={listItems[0].val} {...a11yProps(0)} />
        <Tab label={listItems[1].val} {...a11yProps(1)} />
        <Tab label={listItems[2].val} {...a11yProps(2)} />
        <Tab label={listItems[3].val} {...a11yProps(2)} />
        <Tab label={listItems[4].val} {...a11yProps(2)} />
        <Tab label={listItems[5].val} {...a11yProps(2)} />
        <Tab label={listItems[6].val} {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {listItems[0].val}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {listItems[1].val}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RefBibleSelector
          handleClose={handleClose}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ReferenceDataTable
          handleClose={handleClose}
          listItemsVal={listItems[3].id}
          tn={tw}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        {listItems[4].val}
      </TabPanel>
      <TabPanel value={value} index={5}>
        <ReferenceDataTable
          handleClose={handleClose}
          listItemsVal={listItems[5].id}
          tn={tn}
        />
      </TabPanel>
      <TabPanel value={value} index={6}>
        {listItems[6].val}
      </TabPanel>
    </div>
  );
};

export default ResourceFileManager;
