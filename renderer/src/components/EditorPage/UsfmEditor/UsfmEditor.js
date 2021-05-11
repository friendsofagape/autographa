import { ReferenceContext } from '@/components/context/ReferenceContext';
import React, { useContext, useState } from 'react';

import { BasicUsfmEditor } from 'usfm-editor';

const usfm = String.raw`
\id MRK
\ide UTF-8
\h Mark
\toc1 The Gospel of Mark
\toc2 Mark
\toc3 Mrk
\mt Mark
\s5
\c 1
\p
\v 1 This is the beginning of the gospel of Jesus Christ, the Son of God.
\p
\v 2 As it is written in Isaiah the prophet,
\q "Look, I am sending my messenger before your face,
\q the one who will prepare your way.
\q
\v 3 The voice of one calling out in the wilderness,
\q 'Make ready the way of the Lord;
\q make his paths straight.'"
\m
\s5
\p
\v 4 John came, baptizing in the wilderness and preaching a baptism of repentance for the forgiveness of sins.
\v 5 The whole country of Judea and all the people of Jerusalem went out to him. They were baptized by him in the Jordan River, confessing their sins.
\v 6 John wore a coat of camel's hair and a leather belt around his waist, and he ate locusts and wild honey.
\c 3
\p
\v 1 This is the beginning of the gospel of Jesus Christ, the Son of God.
\p
\v 2 As it is written in Isaiah the prophet,
\q "Look, I am sending my messenger before your face,
\q the one who will prepare your way.
\q
\v 3 The voice of one calling out in the wilderness,
\q 'Make ready the way of the Lord;
\q make his paths straight.'"
`.trimLeft();

const UsfmEditor = () => {
  const [usfmInput, setUsfmInput] = useState(usfm);
  const [readOnly, setReadOnly] = useState(false);
  // const [usfmOutput, setUsfmOutput] = useState(transformToOutput(usfm));
  const [identification, setIdentification] = useState({});
  const {
    actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
    },
  } = useContext(ReferenceContext);

  const handleEditorChange = (usfm) => {
    // setUsfmOutput(usfm);
    // console.log(usfm);
  };
  const handleVersChange = (val) => {
    console.log((identification.id).toLowerCase());
    if (val) {
        onChangeBook((identification.id).toLowerCase());
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
    </header>
    <BasicUsfmEditor
      usfmString={usfmInput}
      key={usfmInput}
      onChange={handleEditorChange}
      onVerseChange={handleVersChange}
      readOnly={readOnly}
      identification={identification}
      onIdentificationChange={onIdentificationChange}
    />
  </>
);
};

export default UsfmEditor;
