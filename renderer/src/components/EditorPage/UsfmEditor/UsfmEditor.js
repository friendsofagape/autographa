import { ProjectContext } from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import React, { useContext, useState } from 'react';
import { BasicUsfmEditor } from 'usfm-editor';
import { isElectron } from '../../../core/handleElectron';
import writeToFile from '../../../core/editor/writeToFile';
import InputSelector from './InputSelector';

const UsfmEditor = () => {
  const [usfmInput, setUsfmInput] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [readOnly, setReadOnly] = useState(false);
  // const [usfmOutput, setUsfmOutput] = useState(transformToOutput(usfm));
  const [identification, setIdentification] = useState({});
  const {
    state: {
      bookId,
    },
    actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      selectedProject,
    },
   } = useContext(ProjectContext);

  const handleEditorChange = (usfm) => {
    // setUsfmOutput(usfm);
    if (isElectron()) {
      writeToFile({
        projectname: selectedProject,
        filename: bookId,
        data: usfm,
      });
    }
  };

  const handleInputChange = (usfm) => {
    setUsfmInput(usfm);
    setIdentification({});
  };

  const handleVersChange = (val) => {
    if (val) {
       onChangeChapter(val.chapter.toString());
       onChangeVerse(val.verseStart.toString());
    }
  };

  const onIdentificationChange = (id) => {
    const identification = typeof id === 'string' ? JSON.parse(id) : id;
    setIdentification(identification);
    onChangeBook((identification.id).toLowerCase());
  };
return (
  <>
    <header className="App-header">
      <p>
        USFM Editor
      </p>
      <div>
        <InputSelector onChange={handleInputChange} />
      </div>
    </header>
    {usfmInput && (
      <BasicUsfmEditor
        usfmString={usfmInput}
        key={usfmInput}
        onChange={handleEditorChange}
        onVerseChange={handleVersChange}
        readOnly={readOnly}
        identification={identification}
        onIdentificationChange={onIdentificationChange}
      />
    )}
  </>
);
};

export default UsfmEditor;
