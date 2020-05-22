import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import * as mobx from "mobx";
import Tabs from "@material-ui/core/Tabs";
import BookIcon from "@material-ui/icons/Book";
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
} from "@material-ui/core";
import AutographaStore from "../AutographaStore";
import { useState } from "react";
import { Observer } from "mobx-react";
const session = require("electron").remote.session;
const Constant = require("../../core/constants");
const bibleJson = require(`${__dirname}/../../lib/bible_Silhouette.json`);
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
  const [open, setOpen] = React.useState(false);
  const [bookdata, setBookdata] = useState(AutographaStore.bookData);
  const [chapterList, setChapterList] = useState([]);
  const [selectedbook, setSelectedBook] = useState("");
  const [selectedchapter, setSelectedChapter] = useState("");

  useEffect(() => {
    let verses, chapter;
    refDb
      .get("ref_history")
      .then(function (doc) {
        var book = doc.visit_history[0].bookId;
        chapter = doc.visit_history[0].chapter;
        if (selectedbook === "") {
          setSelectedBook(
            Constant.booksList[parseInt(book.toString(), 10) - 1]
          );
          AutographaStore.bookId = book.toString();
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
    setOpen(true);
    openpopupBooks(2);
    handleChange(event, 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getbookCategory = (e, booksstart, booksend) => {
    var booksCategory = [];
    for (var i = 0; i <= 65; i++) {
      booksCategory.push(Constant.booksList[i]);
    }
    setBookdata(booksCategory);
  };

  const goToTab = () => {
    let _chapterList = [];
    for (var i = 0; i < AutographaStore.bookChapter["chapterLength"]; i++) {
      _chapterList.push(i + 1);
    }
    setChapterList(_chapterList);
  };

  const onItemClick = (requiredIndex, bookName) => {
    if (AutographaStore.openBookNameEditor === true) {
      AutographaStore.bookNameEditorPopup = true;
      AutographaStore.RequiredIndex = requiredIndex;
    }
    AutographaStore.bookName = bookName;
    AutographaStore.chapterActive = 0;
    // getting chapter list
    let bookIndex = AutographaStore.editBookNamesMode
      ? AutographaStore.bookindex
      : Constant.booksList.findIndex(
          (book) => book.toLowerCase() === bookName.toLowerCase()
        );
    const bookSkel = bibleJson[bookIndex + 1];
    AutographaStore.bookActive = bookIndex + 1;
    AutographaStore.bookChapter["chapterLength"] = bookSkel.chapters.length;
    AutographaStore.bookChapter["bookId"] = bookIndex + 1;
    goToTab();
  };

  const saveLastVisit = (book, chapter) => {
    refDb.get("ref_history").then(function (doc) {
      doc.visit_history = [
        { book: AutographaStore.bookName, chapter: chapter, bookId: book },
      ];
      refDb
        .put(doc)
        .then(function (response) {})
        .catch(function (err) {
          console.log(err);
        });
    });
  };

  const getValue = (e, chapter, bookId) => {
    AutographaStore.translationContent = "";
    AutographaStore.chapterId = chapter;
    AutographaStore.chapterActive = chapter;
    AutographaStore.bookId = bookId;
    setSelectedBook(
      Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1]
    );
    saveLastVisit(bookId, chapter);
    const cookiechapter = {
      url: "http://chapter.autographa.com",
      name: "chapter",
      value: chapter.toString(),
    };
    session.defaultSession.cookies.set(cookiechapter, (error) => {
      if (error) console.log(error);
    });

    const cookieRef = {
      url: "http://book.autographa.com",
      name: "book",
      value: bookId.toString(),
    };
    session.defaultSession.cookies.set(cookieRef, (error) => {
      if (error) console.log(error);
    });
    session.defaultSession.cookies.get(
      { url: "http://refs.autographa.com" },
      (error, refCookie) => {
        if (refCookie.length > 0) {
          var chapter;
          var bkId = AutographaStore.bookId.toString();
          db.get(bkId).then(function (doc) {
            refDb.get("refChunks").then(function (chunkDoc) {
              AutographaStore.verses =
                doc.chapters[
                  parseInt(AutographaStore.chapterId, 10) - 1
                ].verses;
              AutographaStore.chunks =
                chunkDoc.chunks[parseInt(AutographaStore.bookId, 10) - 1];
              chapter = AutographaStore.chapterId;
              getRefContents(
                AutographaStore.refId +
                  "_" +
                  Constant.bookCodeList[
                    parseInt(AutographaStore.bookId, 10) - 1
                  ],
                chapter.toString()
              );
            });
          });
        } else {
          AutographaStore.bookName =
            Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
          db.get(AutographaStore.bookId.toString()).then((doc) => {
            refDb.get("refChunks").then((chunkDoc) => {
              AutographaStore.verses =
                doc.chapters[
                  parseInt(AutographaStore.chapterId, 10) - 1
                ].verses;
              AutographaStore.chunks =
                chunkDoc.chunks[parseInt(AutographaStore.bookId, 10) - 1];
              getRefContents(
                `eng_ult_${
                  Constant.bookCodeList[
                    parseInt(AutographaStore.bookId, 10) - 1
                  ]
                }`,
                AutographaStore.chapterId.toString()
              );
            });
          });
        }
      }
    );
    setOpen(false);
  };

  const openpopupBooks = (tab) => {
    // event.persist();
    AutographaStore.bookActive = AutographaStore.bookId;
    AutographaStore.bookName =
      Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
    AutographaStore.chapterActive = AutographaStore.chapterId;
    console.log(AutographaStore.bookActive);
    getData();
  };

  const getData = () => {
    refDb
      .get(
        AutographaStore.currentRef +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1]
      )
      .then(function (doc) {
        AutographaStore.bookChapter["chapterLength"] = doc.chapters.length;
        AutographaStore.bookChapter["bookId"] = AutographaStore.bookId;
        goToTab();
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const getContent = (id, chapter) => {
    return refDb.get(id.toString()).then(
      (doc) => {
        for (var i = 0; i < doc.chapters.length; i++) {
          if (doc.chapters[i].chapter === parseInt(chapter, 10)) {
            break;
          }
        }
        let refString =
          doc.chapters[i] &&
          doc.chapters[i].verses
            .map((verse, verseNum) => {
              return `<div type="ref" class="col-12 col-ref ref-contents 
              ${doc.scriptDirection.toLowerCase()}" 
              dir=${doc.scriptDirection}><div data-verse=r${verseNum + 1}>
              <span class="verse-num"> 
              ${doc.scriptDirection === "LTR" ? verseNum + 1 : verseNum + 1}
              </span>
              <span> ${verse.verse}</span></div></div`;
            })
            .join("");
        return refString;
      },
      (err) => {
        return "";
      }
    );
  };

  const getRefContents = (id, chapter) => {
    refDb.get("targetReferenceLayout").then((doc) => {
      AutographaStore.layout = doc.layout;
      AutographaStore.layoutContent = doc.layout;
      let chapter = AutographaStore.chapterId.toString();
      getContent(
        AutographaStore.activeRefs[0] +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
        chapter
      ).then((content) => {
        AutographaStore.content = content
          ? content
          : AutographaStore.currentTrans["label-data-not-found"];
      });
    });
    //  AutographaStore.aId  = "";
    var i;
    var chunkIndex = 0;
    var chunkVerseStart;
    var chunkVerseEnd;
    var chunkGroup = [];
    var chunks = AutographaStore.chunks;
    var verses = AutographaStore.verses;

    for (i = 0; i < chunks.length; i++) {
      if (parseInt(chunks[i].chp, 10) === parseInt(chapter, 10)) {
        chunkIndex = i + 1;
        chunkVerseStart = parseInt(chunks[i].firstvs, 10);
        chunkVerseEnd = parseInt(chunks[i + 1].firstvs, 10) - 1;
        break;
      }
    }

    for (i = 1; i <= verses.length; i++) {
      if (i > chunkVerseEnd) {
        chunkVerseStart = parseInt(chunks[chunkIndex].firstvs, 10);
        if (
          chunkIndex === chunks.length - 1 ||
          parseInt(chunks[chunkIndex + 1].chp, 10) !== chapter
        ) {
          chunkVerseEnd = verses.length;
        } else {
          chunkIndex++;
          chunkVerseEnd = parseInt(chunks[chunkIndex].firstvs, 10) - 1;
        }
      }
      var chunk = chunkVerseStart + "-" + chunkVerseEnd;
      var spanVerse = chunk;
      chunkGroup.push(spanVerse);
    }
    AutographaStore.chunkGroup = chunkGroup;
    updateTransContent();
  };

  const updateTransContent = () => {
    let translationContent = [];
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      let verses =
        doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
      AutographaStore.verses = verses;
      verses.forEach((verse, index) => {
        translationContent.push(verse.verse);
      });
      AutographaStore.translationContent = translationContent;
    });
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
          <Dialog
            fullWidth={true}
            maxWidth="lg"
            className={classes.dialog}
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Book And Chapter
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
                  <LinkTab label="Chapter" href="/Chapter" {...TabNumber(1)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                <Container style={{ columnCount: "4" }} fixed>
                  <List className={classes.list}>
                    {bookdata.map((value, index) => {
                      return (
                        <ListItem
                          key={index}
                          selected={
                            index === mobx.toJS(AutographaStore.bookId) - 1
                          }
                          onClick={(event) =>
                            handleListItemClick(event, index + 1, value)
                          }
                        >
                          <ListItemText primary={value} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Container>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Container style={{ columnCount: "4" }} fixed>
                  <List className={classes.list}>
                    {chapterList.map((value, selected) => {
                      return (
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
                      );
                    })}
                  </List>
                </Container>
              </TabPanel>
            </div>
          </Dialog>
        )}
      </Observer>
    </React.Fragment>
  );
}
