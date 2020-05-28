import React, { useState, useEffect } from "react";
import Viewer from "@bit/unfoldingword.resources.viewer";
import Constant from "../../core/constants";
import { Offline, Online } from "react-detect-offline";
import TranslateIcon from "@material-ui/icons/Translate";
import AutographaStore from "../AutographaStore";
import { IconButton, SwipeableDrawer } from "@material-ui/core";

const TranslationHelp = (props) => {
  let defaultContext = {
    // username: 'STR',
    // username: 'unfoldingword',
    username: "Door43-Catalog",
    languageId: "en", //AutographaStore.translationHelplanguageId,
    resourceId: "ust", //AutographaStore.translationHelpresourceId,
    reference: {
      bookId: `${
        props.book
          ? Constant.bookCodeList[parseInt(props.book, 10) - 1].toLowerCase()
          : "gen"
      }`,
      chapter: props.chapter ? props.chapter : "1",
    },
  };
  const [context, setContext] = useState(defaultContext);
  const [viewerComponent, setViewerComponent] = useState(<></>);
  const [state, setState] = useState({
    left: false,
  });

  // useEffect(() => {
  //   let _bookID = Constant.bookCodeList.indexOf(
  //     defaultContext.reference.bookId.toUpperCase()
  //   );
  //   props.onChangeBook(_bookID + 1);
  //   setContext(defaultContext);
  // }, [defaultContext, props, props.book]);

  // useEffect(() => {
  //   props.onChangeChapter(defaultContext.reference.chapter);
  //   setContext(defaultContext);
  // }, [defaultContext, props, props.chapter]);

  // useEffect(() => {
  // 	setContext(defaultContext)
  // }, [props.onLanguagechange])
  // useEffect(() => {
  // 	setContext(defaultContext)
  // }, [props.onResourceChange])
  useEffect(() => {
    const viewer = (
      <Viewer
        {...props}
        context={context}
        history={[]}
        setContext={setContext}
      />
    );
    setViewerComponent(viewer);
  }, [context, props]);

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      <React.Fragment key={"left"}>
        <IconButton color="inherit" onClick={toggleDrawer("left", true)}>
          <TranslateIcon />
        </IconButton>
        <SwipeableDrawer
          anchor={"left"}
          open={state["left"]}
          onOpen={toggleDrawer("left", true)}
          onClose={toggleDrawer("left", false)}
        >
          <Online>{viewerComponent}</Online>
          <Offline>
            <p
              className="offline"
              dangerouslySetInnerHTML={{ __html: "message" }}
            ></p>
          </Offline>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
};

export default TranslationHelp;
