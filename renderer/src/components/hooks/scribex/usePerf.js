import { useState, useTransition} from 'react';
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';
import isEqual from 'lodash.isequal';
import EpiteletePerfHtml from 'epitelete-perf-html';
import { saveToFile } from './saveToFile';

export default function usePerf({
  proskomma,
  ready,
  docSetId,
  bookCode,
  verbose,
  htmlMap,
}) {
  const [isSaving, startSaving] = useTransition();
  const [htmlPerf, setHtmlPerf] = useState();
  const [usfmText, setUsfmText] = useState();

  const epiteletePerfHtml = useDeepCompareMemo(
    () => ready
      && new EpiteletePerfHtml({
        proskomma,
        docSetId,
        htmlMap,
        options: { historySize: 100 },
      }),
    [proskomma, ready, docSetId],
  );

  useDeepCompareEffect(() => {
    if (epiteletePerfHtml) {
      epiteletePerfHtml.readHtml(bookCode, htmlMap).then((_htmlPerf) => {
        // remove htmlMap for default classes
        setHtmlPerf(_htmlPerf);
      });
    }
  }, [epiteletePerfHtml, bookCode]);

  // exports perf to usfm and writes to file.
  const exportUsfm = async (bookCode) => {
    const usfmString = await epiteletePerfHtml?.readUsfm(bookCode);
    setUsfmText(usfmString);
    saveToFile(usfmString, bookCode);
  };

  const saveHtmlPerf = useDeepCompareCallback(
    (_htmlPerf, { sequenceId }) => {
      // (_htmlPerf, { sequenceId, sequenceHtml }) => {
      // _perfHtml.sequencesHtml[sequenceId] = sequenceHtml;

      if (!isEqual(htmlPerf, _htmlPerf)) { setHtmlPerf(_htmlPerf); }

      startSaving(async () => {
      // const startSaving = async () => {
        const newHtmlPerf = await epiteletePerfHtml?.writeHtml(
          bookCode,
          sequenceId,
          _htmlPerf,
        );
        if (verbose) { console.log({ info: 'Saved sequenceId', bookCode, sequenceId }); }

        if (!isEqual(htmlPerf, newHtmlPerf)) { setHtmlPerf(newHtmlPerf); }
        exportUsfm(bookCode);
      });
      // startSaving();
    },
    [htmlPerf, bookCode],
  );

  const undo = async () => {
    const newPerfHtml = await epiteletePerfHtml?.undoHtml(bookCode);
    setHtmlPerf(newPerfHtml);
  };

  const redo = async () => {
    const newPerfHtml = await epiteletePerfHtml?.redoHtml(bookCode);
    setHtmlPerf(newPerfHtml);
  };

  const canUndo = (epiteletePerfHtml?.canUndo && epiteletePerfHtml?.canUndo(bookCode)) || false;
  const canRedo = (epiteletePerfHtml?.canRedo && epiteletePerfHtml?.canRedo(bookCode)) || false;

  const state = {
    bookCode,
    htmlPerf,
    canUndo,
    canRedo,
    isSaving,
    usfmText,
  };

  const actions = {
    saveHtmlPerf,
    exportUsfm,
    undo,
    redo,
  };

  return { state, actions };
}
