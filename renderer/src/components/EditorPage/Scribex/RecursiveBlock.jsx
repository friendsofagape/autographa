/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { HtmlPerfEditor } from '@xelah/type-perf-html';
// import { EditableContextMenu } from '@xelah/core';
import { getCurrentCursorPosition, setCurrentCursorPosition, pasteHtmlAtCaret } from '@/util/cursorUtils';
import { getCurrentVerse, getCurrentChapter } from './getReferences';

const getTarget = ({ content }) => {
  const div = document.createElement('div');
  div.innerHTML = content;

  const { target } = div.firstChild?.dataset || {};

  return target;
};

export default function RecursiveBlock({
  htmlPerf,
  onHtmlPerf,
  sequenceIds,
  addSequenceId,
  options,
  content,
  style,
  contentEditable,
  index,
  verbose,
  setFootNote,
  bookId,
  onReferenceSelected,
  setCaretPosition,
  ...props
}) {
  const [currentVerse, setCurrentVerse] = useState(null);
  useEffect(() => {
    if (verbose) { console.log('Block: Mount/First Render', index); }
    return () => {
      if (verbose) { console.log('Block: UnMount/Destroyed', index); }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCursorPosition = () => {
    const cursorPosition = getCurrentCursorPosition('editor');
    setCaretPosition(cursorPosition);
  };

  const checkReturnKeyPress = (event) => {
    const activeTextArea = document.activeElement;
    if (event.key === 'Enter') {
      if (activeTextArea.children.length > 1) {
        const lineBreak = activeTextArea.children[1]?.outerHTML;
        activeTextArea.children[1].outerHTML = lineBreak.replace(/<br\s*\/?>/gi, '&nbsp');
      }
    }
    // BACKSPACE DISABLE
    if (event.keyCode === 8) {
      // console.log({ activeTextArea })
      const range = document.getSelection().getRangeAt(0);
      // console.log({ range })
      const selectedNode = range.startContainer;
      console.log({ selectedNode });
      const prevNode = selectedNode.previousSibling;
      console.log({ prevNode });
      if (prevNode && prevNode.dataset.attsNumber !== currentVerse) {
        console.log('crossing a verse');
        // setCurrentVerse(0)
        event.preventDefault();
      }
      prevNode ? setCurrentVerse(prevNode.dataset.attsNumber) : {};
      console.log({ currentVerse });
      const verse = getCurrentVerse(selectedNode);
      const chapter = getCurrentChapter(selectedNode);
    }
    updateCursorPosition();
  };

  const checkCurrentVerse = () => {
    if (document.getSelection().rangeCount >= 1 && onReferenceSelected) {
      const range = document.getSelection().getRangeAt(0);
      console.log({ range });
      const selectedNode = range.startContainer;
      console.log({ selectedNode });
      const verse = getCurrentVerse(selectedNode);
      const chapter = getCurrentChapter(selectedNode);
      // if (onReferenceSelected) {
      onReferenceSelected({ bookId, chapter, verse });
      // }
    }
  };

  // const updateVerseNumber = () => {
  //   const selectedNode = document.getSelection().getRangeAt(0).startContainer
  //   console.log({ selectedNode })
  //   selectedNode.previousElementSibling ? setCurrentVerse(document.getSelection().getRangeAt(0).startContainer?.previousElementSibling?.dataset.attsNumber) : setCurrentVerse(null)
  //   if (selectedNode.previousElementSibling) {
  //     console.log("no prev sibling")
  //   }
  //   console.log("mouse click", { currentVerse })
  // }
  // const diableBackspace = (event) => {
  //   if (event.keyCode == 8) {
  //     console.log("BACKSPACE")
  //     event.preventDefault()
  //   }
  // }
  let component;

  const editable = !!content.match(/data-type="paragraph"/);

  if (editable) {
    component = (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className="editor-paragraph"
        contentEditable={contentEditable}
        onKeyDown={checkReturnKeyPress}
        onMouseUp={checkCurrentVerse}
        onMouseDown={updateCursorPosition}
        {...props}
      />
    );
  }

  if (!editable) {
    const sequenceId = getTarget({ content });

    if (sequenceId && !options.preview) {
      const _props = {
        sequenceIds: [...sequenceIds, sequenceId],
        addSequenceId,
        htmlPerf,
        onHtmlPerf,
      };
      component = <HtmlPerfEditor {..._props} />;
    }
    component ||= <div {...props} contentEditable={false} />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{component}</>;
}
