import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TsvContent,
  useContent,
  useCardState,
} from 'translation-helps-rcl';

const TranslationHelps = ({
 bookID,
  currentChapterID,
  currentVerse,
}) => {
  const [selectedQuote, setQuote] = useState({});
  const { markdown, items } = useContent({
    verse: currentVerse,
    chapter: currentChapterID,
    projectId: bookID || 'mat',
    branch: 'master',
    languageId: 'en',
    resourceId: 'tn',
    owner: 'test_org',
    server: 'https://git.door43.org',
  });

  const {
    state: {
      item,
      headers,
      filters,
      fontSize,
      itemIndex,
      markdownView,
    },
    actions: {
      setFilters,
      setFontSize,
      setItemIndex,
      setMarkdownView,
    },
  } = useCardState({
    items,
  });

  if (item) {
    return (
      <Card
        items={items}
        headers={headers}
        filters={filters}
        fontSize={fontSize}
        itemIndex={itemIndex}
        setFilters={setFilters}
        title="Notes"
        setFontSize={setFontSize}
        setItemIndex={setItemIndex}
        markdownView={markdownView}
        setMarkdownView={setMarkdownView}
      >
        <CardContent
          item={item}
          filters={filters}
          fontSize={fontSize}
          markdownView={markdownView}
          selectedQuote={selectedQuote}
          setQuote={setQuote}
        />
      </Card>
    );
  }
    return null;
};

export default TranslationHelps;
