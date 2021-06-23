/* eslint-disable react/prop-types */
import React from 'react';
import {
    CardContent,
  } from 'translation-helps-rcl';
import RefBible from './RefBible/RefBible';
import EditorSectionSmall from '../../../modules/projects/SmallEditorSection';

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
    <div>
      {(title === 'Translation Notes') && (
      <EditorSectionSmall title={title}>
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
      </EditorSectionSmall>

    )}
      {(title === 'Bible') && (
      <EditorSectionSmall title="Bible">
        <RefBible />
      </EditorSectionSmall>

    )}
    </div>
  </>
    );

export default ReferenceCard;
