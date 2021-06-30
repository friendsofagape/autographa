import PropTypes from 'prop-types';
import {
  useContent,
  useCardState,
} from 'translation-helps-rcl';
import ReferenceCard from './ReferenceCard';

export default function TranslationHelpsCard({
  title,
  verse,
  server,
  owner,
  branch,
  chapter,
  filePath,
  setQuote,
  projectId,
  languageId,
  resourceId,
  selectedQuote,
  viewMode,
}) {
  const { items, markdown, isLoading } = useContent({
    verse,
    chapter,
    projectId,
    branch,
    languageId,
    resourceId,
    filePath,
    owner,
    server,
  });

  const {
    state: {
      item, headers, filters, fontSize, itemIndex, markdownView,
    },
    actions: {
      setFilters, setFontSize, setItemIndex, setMarkdownView,
    },
  } = useCardState({ items });
  return (
    <>
      <ReferenceCard
        items={items}
        headers={headers}
        filters={filters}
        fontSize={fontSize}
        itemIndex={itemIndex}
        setFilters={setFilters}
        setFontSize={setFontSize}
        setItemIndex={setItemIndex}
        markdownView={markdownView}
        setMarkdownView={setMarkdownView}
        item={item}
        markdown={markdown}
        isLoading={isLoading}
        languageId={languageId}
        title={title}
        viewMode={viewMode}
        selectedQuote={selectedQuote}
        setQuote={setQuote}
      />
    </>
  );
}

TranslationHelpsCard.propTypes = {
  viewMode: PropTypes.string,
  title: PropTypes.string.isRequired,
  chapter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  verse: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  server: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  setQuote: PropTypes.func,
  selectedQuote: PropTypes.string,
  filePath: PropTypes.string,
};
