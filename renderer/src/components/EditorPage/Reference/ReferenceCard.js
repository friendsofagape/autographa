/* eslint-disable react/prop-types */
import React from 'react';
import {
    CardContent,
  } from 'translation-helps-rcl';

const ReferenceCard = ({
    items,
    item,
    filters,
    markdownView,
    markdown,
    languageId,
    selectedQuote,
    setQuote,
    viewMode,
    isLoading,
}) => (
  <>
    <CardContent
      item={item}
      items={items}
      filters={filters}
      markdown={markdown}
      languageId={languageId}
      markdownView={markdownView}
      isLoading={isLoading}
      selectedQuote={selectedQuote}
      setQuote={setQuote}
      viewMode={viewMode}
    />
  </>
);

export default ReferenceCard;
