import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/Navigation";
import Badge from "@material-ui/core/Badge";
import TranslationSettings from "../Content/Translation/TranslationSettings";
import BookChapterNavigation from "./BookChapterNavigation";
import SetUp from "../Content/Reference/core/setup";
import Statistics from "../Content/Translation/Statistics";
import TranslationSetUp from "../Content/Translation/core/TranslationSetUp";
import About from "../About";
import Search from "../Search";
import ReferenceSettings from "../Content/Reference/ReferenceSettings";
import DiffChecker from "./DiffChecker";
import TranslationHelp from "../TranslationHelp/TranslationHelp";
import Download from "../Download/Download";
import Footer from "../Footer/Footer";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  nav: {
    marginLeft: theme.spacing(50),
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <TranslationHelp />
            <Typography className={classes.title} variant="h6" noWrap>
              Autographa
            </Typography>
            <div className={classes.nav}>
              <BookChapterNavigation />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit">
                <About />
              </IconButton>
              <IconButton color="inherit">
                <DiffChecker />
              </IconButton>
              <IconButton color="inherit">
                <Search />
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <Statistics />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Download />
              </IconButton>
              <IconButton color="inherit">
                <TranslationSettings />
              </IconButton>
              <IconButton color="inherit">
                <ReferenceSettings />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <SetUp />
      {/* <TranslationSetUp /> */}
      {/* <Footer /> */}
    </React.Fragment>
  );
}
