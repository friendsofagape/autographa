/* eslint-disable react/prop-types */
import React, {
    useEffect,
   useState,
} from 'react';
import { getObsTn } from './getObsTn';
import ObsResourceCard from './ObsResourceCard';

function ObsTnCard({
  resource,
  chapter,
  frame,
  languageId,
  classes,
  setQuote,
  selectedQuote,
  owner,
  resourceId,
  ...props
}) {
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    if (items.length !== 0) {
      setMarkdown(items[index].OccurrenceNote);
    }
  }, [items, index]);
  useEffect(() => {
    setItems([]);
    setIndex(0);
    async function fetchData() {
      await getObsTn(owner, `${languageId}_${resourceId}`, `content/${chapter.toString().padStart(2, 0)}`)
      .then((data) => {
        setItems(data);
      });
    }
    fetchData();
  }, [chapter, languageId, owner, resourceId]);
  return (
    <>
      <ObsResourceCard
        {...props}
        chapter={chapter}
        verse={frame}
        items={items}
        selectedQuote={selectedQuote}
        setQuote={setQuote}
        markdown={markdown}
        languageId={languageId}
        classes={classes}
        shouldSetQuoteOnClick
        index={index}
        setIndex={(v) => setIndex(v)}
      />
    </>
  );
}

export default ObsTnCard;
