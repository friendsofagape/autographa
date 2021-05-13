import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    ButtonGroup, Tabs,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import dynamic from 'next/dynamic';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import UsfmEditor from '../UsfmEditor/UsfmEditor';
import CustomDialog from '../../ApplicationBar/CustomDialog';
import CustomBooksTab from './CustomBooksTab';

const TranslationHelpsWithNoSSR = dynamic(
  () => import('../Reference/TranslationHelps'),
  { ssr: false },
);

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
const BookNavigation = () => {
  const {
    state: {
      chapter,
      verse,
      bookList,
      chapterList,
      verseList,
      bookName,
      bookId,
    },
    actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
    },
  } = useContext(ReferenceContext);

  const [value, setValue] = React.useState(0);
  const [dialog, setDialog] = React.useState(false);
  const [OTSelectionSort, setOTSelectionSort] = React.useState(true);
  const [NTSelectionSort, setNTSelectionSort] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setDialog(false);
  };

  const openDialog = (e) => {
    e.preventDefault();
    setDialog(true);
    setValue(0);
    setOTSelectionSort(true);
    setNTSelectionSort(true);
  };

  // eslint-disable-next-line no-unused-vars
  const BookReferenceTabsTitle = (
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
  );

  const BookReferenceTabsOT = (
    <div>
      <CustomBooksTab
        onChangeBook={onChangeBook}
        onChangeChapter={onChangeChapter}
        onChangeVerse={onChangeVerse}
        setDialog={setDialog}
        value={value}
        bookList={bookList}
        chapterList={chapterList}
        verseList={verseList}
        setValue={setValue}
        OT
        setOTSelectionSort={setOTSelectionSort}
        setNTSelectionSort={setNTSelectionSort}
      />
    </div>
  );

  const BookReferenceTabsNT = (
    <div>
      <CustomBooksTab
        onChangeBook={onChangeBook}
        onChangeChapter={onChangeChapter}
        onChangeVerse={onChangeVerse}
        setDialog={setDialog}
        value={value}
        bookList={bookList}
        chapterList={chapterList}
        verseList={verseList}
        setValue={setValue}
        OT={false}
        setOTSelectionSort={setOTSelectionSort}
        setNTSelectionSort={setNTSelectionSort}
      />
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
            subtitle1={OTSelectionSort ? 'Old Testment' : ''}
            subtitle2={NTSelectionSort ? 'New Testment' : ''}
            subcontent1={OTSelectionSort ? BookReferenceTabsOT : ''}
            subcontent2={NTSelectionSort ? BookReferenceTabsNT : ''}
            width="md"
          />
        </div>
        <TranslationHelpsWithNoSSR
          bookID={bookId}
          currentChapterID={chapter}
          currentVerse={verse}
        />
        <UsfmEditor />
      </div>
     );
};

export default BookNavigation;
BookNavigation.propTypes = {
  initial: PropTypes.object,
};
