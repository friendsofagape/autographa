import {
 makeStyles,
 Grid, ListItem, ListItemText, Typography, Box, useTheme,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
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

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 500,
    },
  }));

export default function CustomBooksTab({
    onChangeBook,
    onChangeChapter,
    onChangeVerse,
    setDialog,
    value,
    bookList,
    chapterList,
    verseList,
    setValue,
    OT,
    setOTSelectionSort,
    setNTSelectionSort,
}) {
    const classes = useStyles();
    const theme = useTheme();
    const customClasses = CreateProjectStyles();
    const onBookSelect = (e, bookid, index) => {
        e.preventDefault();
        onChangeBook(bookid);
        if (index <= 38) {
            setOTSelectionSort(true);
            setNTSelectionSort(false);
        } else {
            setNTSelectionSort(true);
            setOTSelectionSort(false);
        }
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
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container>
            <Grid container item xs={12} spacing={1}>
              {bookList.map((bookname, index) => (
                <>
                  {(OT ? index <= 38 : index > 38) && (
                    <Grid key={bookname.key} item xs={4}>
                      <ListItem
                        button
                        className={customClasses.paper}
                        classes={{ selected: classes.selected }}
                        style={{ backgroundColor: 'white' }}
                        onClick={(e) => onBookSelect(e, bookname.key, index)}
                      >
                        <ListItemText>
                          <span className={customClasses.listtext}>{bookname.name}</span>
                        </ListItemText>
                      </ListItem>
                    </Grid>

                  )}
                </>

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
                    className={customClasses.paper}
                    classes={{ selected: classes.selected }}
                    style={{ backgroundColor: 'white' }}
                    onClick={(e) => onChapterSelect(e, chapternum.key)}
                  >
                    <ListItemText>
                      <span className={customClasses.listtext}>{chapternum.name}</span>
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
                    className={customClasses.paper}
                    classes={{ selected: classes.selected }}
                    style={{ backgroundColor: 'white' }}
                    onClick={(e) => onVerseSelect(e, versenum.key)}
                  >
                    <ListItemText>
                      <span className={customClasses.listtext}>{versenum.name}</span>
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
    <>
      {BookReferenceTabs}
    </>
  );
}
CustomBooksTab.propTypes = {
    onChangeBook: PropTypes.func,
    onChangeChapter: PropTypes.func,
    onChangeVerse: PropTypes.func,
    setDialog: PropTypes.func,
    value: PropTypes.number,
    bookList: PropTypes.object,
    chapterList: PropTypes.object,
    verseList: PropTypes.object,
    setValue: PropTypes.func,
    OT: PropTypes.bool,
    setOTSelectionSort: PropTypes.func,
    setNTSelectionSort: PropTypes.func,
};
