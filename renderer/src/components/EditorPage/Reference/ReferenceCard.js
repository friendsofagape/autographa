/* eslint-disable react/prop-types */
import React from 'react';
import {
    CardContent,
  } from 'translation-helps-rcl';

const ReferenceCard = ({
    title,
    items,
    item,
    filters,
    markdownView,
    markdown,
    languageId,
    selectedQuote,
    setQuote,
    viewMode,
}) => (
  <>
    {(title === 'Translation Notes') && (
    <CardContent
      item={item}
      items={items}
      filters={filters}
      markdown={markdown}
      languageId={languageId}
      markdownView={markdownView}
      selectedQuote={selectedQuote}
      setQuote={setQuote}
      viewMode={viewMode}
    />
    )}
  </>
    );

export default ReferenceCard;
