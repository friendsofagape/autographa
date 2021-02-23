import React, { useState } from 'react';
import {
    Card,
    CardContent,
    useContent,
    useCardState,
  } from 'translation-helps-rcl';

const TranslationWordList = ({
 bookID,
    currentChapterID,
    currentVerse,
}) => {
  const {
 markdown, items, isLoading, props: { languageId },
} = useContent({
    verse: currentVerse,
    chapter: currentChapterID,
    projectId: bookID || 'mat',
    branch: 'master',
    languageId: 'en',
    resourceId: 'twl',
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

  return (
    <Card
      items={items}
      headers={headers}
      filters={filters}
      fontSize={fontSize}
      itemIndex={itemIndex}
      setFilters={setFilters}
      title="Words"
      setFontSize={setFontSize}
      setItemIndex={setItemIndex}
      markdownView={markdownView}
      setMarkdownView={setMarkdownView}
    >
      <CardContent
        item={item}
        filters={filters}
        fontSize={fontSize}
        markdown={markdown}
        viewMode="markdown"
        isLoading={isLoading}
        languageId={languageId}
        markdownView={markdownView}
      />
    </Card>
  );
};
export default TranslationWordList;
