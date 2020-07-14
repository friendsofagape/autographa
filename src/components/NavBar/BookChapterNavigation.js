import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import * as mobx from "mobx";
import Tabs from "@material-ui/core/Tabs";
import BookIcon from "@material-ui/icons/Book";
import EditIcon from "@material-ui/icons/Edit";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  DialogTitle,
  Dialog,
  Fab,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Tooltip,
  Zoom,
} from "@material-ui/core";
import AutographaStore from "../AutographaStore";
import { Observer } from "mobx-react";
import BookNameEditor from "./BookNameEditor";
import { FormattedMessage } from "react-intl";
import { NavigationContext } from "../../contexts/NavigationContext";
const Constant = require("../../core/constants");
const refDb = require(`${__dirname}/../../core/data-provider`).referenceDb();
const db = require(`${__dirname}/../../core/data-provider`).targetDb();
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabNumber(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  list: {
    width: "max-content",
    margin: theme.spacing(1),
    cursor: "pointer",
  },
  dialog: {
    height: "inherit",
  },
  fab: {
    borderRadius: 4,
  },
}));

export default function BookChapterNavigation(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const {
    open,
    setOpen,
    bookdata,
    chapterList,
    selectedbook,
    selectedchapter,
    onItemClick,
    openpopupBooks,
    getValue,
    setSelectedBook,
    setSelectedChapter,
    getRefContents,
    setBookdata,
  } = useContext(NavigationContext);

  useEffect(() => {
    let verses, chapter;
    refDb
      .get("ref_history")
      .then(function (doc) {
        var book = doc.visit_history[0].bookId;
        chapter = doc.visit_history[0].chapter;
        let mode = mobx.toJS(AutographaStore.editBookNamesMode);
        AutographaStore.bookId = book.toString();
        if (selectedbook === "") {
          if (
            mobx.toJS(AutographaStore.editBookNamesMode).toString() ===
            true.toString()
          ) {
            setSelectedBook(
              AutographaStore.translatedBookNames[
                parseInt(AutographaStore.bookId, 10) - 1
              ]
            );
          } else {
            setSelectedBook(
              Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1]
            );
          }
        }
        if (selectedchapter === "") {
          setSelectedChapter(chapter);
        } else setSelectedChapter(AutographaStore.chapterId);
        AutographaStore.verses = verses;
        db.get(AutographaStore.bookId.toString()).then(function (doc) {
          refDb.get("refChunks").then(function (chunkDoc) {
            AutographaStore.verses =
              doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
            AutographaStore.chunks =
              chunkDoc.chunks[parseInt(AutographaStore.bookId, 10) - 1];
            chapter = AutographaStore.chapterId;
            getRefContents(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter.toString()
            );
          });
        });
      })
      .catch(function (err) {
        AutographaStore.bookId = "1";
        AutographaStore.chapterId = "1";
        console.log(err);
      });
  });

  useEffect(() => {
    db.get("translatedBookNames")
      .then((doc) => {
        console.log(doc);
        AutographaStore.translatedBookNames = doc.books;
        setBookdata(doc.books);
      })
      .catch((err) => {
        console.log(err);
        localStorage.setItem("editBookNamesMode", false);
        AutographaStore.editBookNamesMode = localStorage.getItem(
          "editBookNamesMode"
        );
        let doc = {
          _id: "translatedBookNames",
          books: Constant.booksEditList,
        };
        AutographaStore.translatedBookNames = doc.books;
        setBookdata(doc.books);
        db.put(doc);
      });
    AutographaStore.editBookNamesMode = localStorage.getItem(
      "editBookNamesMode"
    );
  }, [setBookdata]);

  const handleListItemClick = (event, index, value) => {
    onItemClick(index, value);
    handleChange(event, 1);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = (event) => {
    setOpen(true);
    handleChange(event, 0);
  };

  const handleClickOpenChapters = (event) => {
    event.preventDefault();
    setOpen(true);
    openpopupBooks(2);
    handleChange(event, 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editbooks = (event, index, bookName) => {
    AutographaStore.RequiredIndex = index;
    AutographaStore.bookName = bookName;
    AutographaStore.editBookNamesMode = true;
    AutographaStore.bookNameEditorPopup = true;
    localStorage.setItem(
      "editBookNamesMode",
      AutographaStore.editBookNamesMode
    );
    AutographaStore.openBookNameEditor = !AutographaStore.openBookNameEditor;
  };

  const handlepopper = (event, index) => {
    event.preventDefault();
    AutographaStore.bookIndex = index;
  };

  const loadData = () => {
    getValue(AutographaStore.chapterId, AutographaStore.bookId);
  };

  return (
    <React.Fragment>
      <Fab
        style={{ borderRadius: "4px", margin: "2px" }}
        onClick={handleClickOpen}
        variant="extended"
      >
        <BookIcon className={classes.extendedIcon} />
        {selectedbook}
      </Fab>
      <Fab
        style={{ borderRadius: "4px", margin: "2px" }}
        onClick={handleClickOpenChapters}
        variant="extended"
      >
        {selectedchapter}
      </Fab>
      <Observer>
        {() => (
          <div>
            <Dialog
              fullWidth={true}
              maxWidth="lg"
              className={classes.dialog}
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                <FormattedMessage id="label-book-chapter" />
              </DialogTitle>
              <div className={classes.root}>
                <AppBar position="static">
                  <Tabs
                    variant="fullWidth"
                    width={1000}
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                  >
                    <LinkTab label="Books" href="/Book" {...TabNumber(0)} />
                    <LinkTab
                      label="Chapter"
                      href="/Chapter"
                      onClick={handleClickOpenChapters}
                      {...TabNumber(1)}
                    />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                  <Container style={{ columnCount: "4" }} fixed>
                    {bookdata.map((value, index) => {
                      return (
                        <List className={classes.list}>
                          <ListItem
                            onMouseEnter={(event) => handlepopper(event, index)}
                            key={index}
                            selected={
                              index === mobx.toJS(AutographaStore.bookId) - 1
                            }
                          >
                            <ListItemText
                              onClick={(event) =>
                                handleListItemClick(event, index, value)
                              }
                              primary={value}
                            />
                            {AutographaStore.bookIndex === index && (
                              <ListItemIcon onClick={() => console.log("edit")}>
                                <Tooltip
                                  TransitionComponent={Zoom}
                                  placement="top"
                                  title="edit"
                                >
                                  <EditIcon
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                    hidden={AutographaStore.bookIndex !== index}
                                    onClick={(event) =>
                                      editbooks(event, index, value)
                                    }
                                  />
                                </Tooltip>
                              </ListItemIcon>
                            )}
                          </ListItem>
                        </List>
                      );
                    })}
                  </Container>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Container style={{ columnCount: "5" }} fixed>
                    {chapterList.map((value, selected) => {
                      return (
                        <List className={classes.list}>
                          <ListItem
                            key={selected}
                            selected={
                              selected ===
                              mobx.toJS(AutographaStore.chapterId) - 1
                            }
                            onClick={(event) =>
                              getValue(
                                event,
                                selected + 1,
                                AutographaStore.bookChapter["bookId"]
                              )
                            }
                          >
                            <ListItemText primary={value} />
                          </ListItem>
                        </List>
                      );
                    })}
                  </Container>
                </TabPanel>
              </div>
            </Dialog>
            <BookNameEditor
              show={AutographaStore.bookNameEditorPopup}
              translatedBookNames={AutographaStore.translatedBookNames}
            />
          </div>
        )}
      </Observer>
    </React.Fragment>
  );
}
