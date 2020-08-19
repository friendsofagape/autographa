import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import BookList from "./BookList";
import Divider from "@material-ui/core/Divider";
import Import from "./Import";
import Upload from "./Upload";
import Loader from "../../Loader/Loader";

const booksCodes = require(`${__dirname}/../../../core/constants.js`)
  .bookCodeList;

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);
const ProjectListRow = (props) => {
  const [expanded, setExpanded] = React.useState("");
  const [bookList, setBookList] = React.useState([]);
  const [selectedBooks, setSelectedbooks] = React.useState({});
  const [showLoader, setShowLoader] = React.useState(false);

  const handleSelect = (event) => {
    setSelectedbooks({
      ...selectedBooks,
      [event.target.value]: event.target.checked,
    });
  };
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    getBooks(props);
  };

  const getBooks = async (props) => {
    setShowLoader(true);
    try {
      let booksList = await props.syncAdapter.getBooksList(
        props.project.projid[0]
      );
      booksList = booksList
        .forEach((book) => {
          if (booksCodes.includes(book.id)) {
            return book.id;
          }
        })
        .filter((book) => book);
      setBookList(booksList);
      //fetching book data done  and hiding the loader
      setShowLoader(false);
    } catch (err) {
    } finally {
      setShowLoader(false);
    }
  };
  return (
    <div>
      <ExpansionPanel
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <Typography>{props.project.proj}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            <BookList booksList={bookList} handleChange={handleSelect} />
            <Divider />
            {bookList.length > 0 ? (
              <div style={{ float: "right" }}>
                <Typography>
                  <Import
                    books={selectedBooks}
                    projectId={props.project.projid[0]}
                    syncAdapter={props.syncAdapter}
                  />
                  <Upload
                    books={selectedBooks}
                    projectId={props.project.projid[0]}
                    projectName={props.project.proj[0]}
                    syncAdapter={props.syncAdapter}
                  />
                </Typography>
              </div>
            ) : null}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {showLoader === true ? <Loader /> : ""}
    </div>
  );
};

export default ProjectListRow;
