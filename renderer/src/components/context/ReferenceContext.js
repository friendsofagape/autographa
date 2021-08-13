/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { useBibleReference } from 'bible-reference-rcl';
import React, { useState, createContext, useRef } from 'react';
import * as localforage from 'localforage';

export const ReferenceContext = createContext({});

export default function ReferenceContextProvider({ children }) {
    const initialBook = '1TI';
    const initialChapter = '1';
    const initialVerse = '1';
    const [owner, setOwner] = useState('Door43-Catalog');
    const [languageId, setLanguageId] = useState('en');
    const [selectedResource, SetSelectedResource] = useState('tn');
    const [server, setServer] = useState('https://git.door43.org');
    const [branch, setBranch] = useState('master');
    const [markdown, setMarkdown] = useState('markdown');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [refName, setRefName] = React.useState('null');
    const [currentScope, setCurrentScope] = React.useState([]);
    const [openResource1, setOpenResource1] = React.useState(true);
    const [openResource2, setOpenResource2] = React.useState(true);
    const [openResource3, setOpenResource3] = React.useState(true);
    const [openResource4, setOpenResource4] = React.useState(true);
    // const [openResourcePopUp, setOpenResourcePopUp] = React.useState(false);
    const [selectedFont, setSelectedFont] = React.useState('sans-serif');
    const [fontSize, setFontsize] = React.useState(1);
    const [fonts, setFonts] = useState([]);
    const [layout, setLayout] = useState(0);
    const [row, setRow] = useState(0);
    const [refernceLoading, setRefernceLoading] = useState({
      status: false,
      text: '',
    });
    const [counter, setCounter] = useState(7);
    const [bookmarksVerses, setBookmarksVerses] = useState([]);
    const myEditorRef = useRef();

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

  async function getFonts() {
    const _fonts = await localforage.getItem('font-family');
    fonts.push(_fonts);
    setFonts(fonts);
  }

    const {
   state: {
      chapter,
      verse,
      bookList,
      chapterList,
      verseList,
      bookName,
      bookId,
   }, actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
      applyBooksFilter,
    },
  } = useBibleReference({
      initialBook,
      initialChapter,
      initialVerse,
    });

    const value = {
      state: {
        chapter,
        verse,
        bookList,
        chapterList,
        verseList,
        bookName,
        bookId,
        languageId,
        server,
        branch,
        owner,
        markdown,
        selectedResource,
        anchorEl,
        refName,
        currentScope,
        openResource1,
        openResource2,
        openResource3,
        openResource4,
        // openResourcePopUp,
        selectedFont,
        fontSize,
        fonts,
        layout,
        row,
        refernceLoading,
        counter,
        bookmarksVerses,
        myEditorRef,
      },
      actions: {
        setLanguageId,
        setBranch,
        setServer,
        setOwner,
        setMarkdown,
        SetSelectedResource,
        onChangeBook,
        onChangeChapter,
        onChangeVerse,
        applyBooksFilter,
        setAnchorEl,
        handleClick,
        setRefName,
        setCurrentScope,
        setOpenResource1,
        setOpenResource2,
        setOpenResource3,
        setOpenResource4,
        // setOpenResourcePopUp,
        setSelectedFont,
        setFontsize,
        setFonts,
        getFonts,
        setLayout,
        setRow,
        setRefernceLoading,
        setCounter,
        setBookmarksVerses,
      },
    };

    return (
      <ReferenceContext.Provider value={value}>
        {children}
      </ReferenceContext.Provider>
    );
  }
