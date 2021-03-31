import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BibleReference, { useBibleReference } from 'bible-reference-rcl';
import {
    Button,
    ButtonGroup,
 Grid, ListItem, ListItemText, Paper, Tabs, Typography,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CustomDialog from '../../ApplicationBar/CustomDialog';
import { CreateProjectStyles } from '../../ProjectsPage/CreateProject/useStyles/CreateProjectStyles';

function TabPanel(props) {
    const {
 children, value, index, ...other
} = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
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
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 500,
    },
  }));

const BookNavigation = ({ initial }) => {
  const {
    initialBook,
    initialChapter,
    initialVerse,
    supportedBooks,
    onChange,
    style,
  } = initial || {};

  const {
 state: {
    bookId,
    chapter,
    verse,
    bookList,
    chapterList,
    verseList,
    bookName,
 }, actions: {
    goToPrevChapter,
    goToNextChapter,
    goToPrevVerse,
    goToNextVerse,
    onChangeBook,
    onChangeChapter,
    onChangeVerse,
    applyBooksFilter,
  },
} = useBibleReference({
    initialBook,
    initialChapter,
    initialVerse,
    onChange,
  });

  const classes = useStyles();
  const classes1 = CreateProjectStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [dialog, setDialog] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    applyBooksFilter(supportedBooks);
  }, [applyBooksFilter, supportedBooks]);

  const handleClose = () => {
    setDialog(false);
  };

  const openDialog = (e) => {
    e.preventDefault();
    setDialog(true);
    setValue(0);
  };

  const onBookSelect = (e, bookid) => {
      e.preventDefault();
      onChangeBook(bookid);
      setValue(1);
  };

  const onChapterSelect = (e, chapternum) => {
    e.preventDefault();
    onChangeChapter(chapternum);
    setValue(2);
  };

  const onVerseSelect = (e, versenum) => {
    e.preventDefault();
    onChangeVerse(versenum);
    setDialog(false);
  };

  const BookReferenceTabs = (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={`${bookName}`} {...a11yProps(0)} />
          <Tab label={`Chapter: ${chapter}`} {...a11yProps(1)} />
          <Tab label={`Verse: ${verse}`} {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <Grid container>
          <Grid container item xs={12} spacing={1}>
            {bookList.map((bookname) => (
              <Grid key={bookname.key} item xs={4}>
                <ListItem
                  button
                  className={classes1.paper}
                  classes={{ selected: classes.selected }}
                  style={{ backgroundColor: 'white' }}
                  onClick={(e) => onBookSelect(e, bookname.key)}
                >
                  <ListItemText>
                    <span className={classes1.listtext}>{bookname.name}</span>
                  </ListItemText>
                </ListItem>
              </Grid>
        ))}
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Grid container>
          <Grid container item xs={12} spacing={1}>
            {chapterList.map((chapternum) => (
              <Grid key={chapternum.key} item xs={4}>
                <ListItem
                  button
                  className={classes1.paper}
                  classes={{ selected: classes.selected }}
                  style={{ backgroundColor: 'white' }}
                  onClick={(e) => onChapterSelect(e, chapternum.key)}
                >
                  <ListItemText>
                    <span className={classes1.listtext}>{chapternum.name}</span>
                  </ListItemText>
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <Grid container>
          <Grid container item xs={12} spacing={1}>
            {verseList.map((versenum) => (
              <Grid key={versenum.key} item xs={4}>
                <ListItem
                  button
                  className={classes1.paper}
                  classes={{ selected: classes.selected }}
                  style={{ backgroundColor: 'white' }}
                  onClick={(e) => onVerseSelect(e, versenum.key)}
                >
                  <ListItemText>
                    <span className={classes1.listtext}>{versenum.name}</span>
                  </ListItemText>
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
    return (
      <div>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button onClick={(e) => openDialog(e)}>{`${bookName}`}</Button>
          <Button>{`Chapter: ${chapter}`}</Button>
          <Button>{`Verse: ${verse}`}</Button>
        </ButtonGroup>
        <div
          style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <CustomDialog
            open={dialog}
            handleClose={handleClose}
            title="Bible Reference"
            content={BookReferenceTabs}
            width="md"
          />
        </div>
      </div>
     );
};

export default BookNavigation;
BookNavigation.propTypes = {
  initial: PropTypes.object,
};
