/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// const yaml = require('js-yaml');

const ResourceOption = ({
  imageUrl,
  text,
  id,
  selectResource,
  setSelectResource,
  setTitle,
  setShowInput,
}) => {
  const handleSelectResource = (e, id, text) => {
    if (id) {
      setSelectResource(id);
      setTitle(text);
      setShowInput(false);
        // const jsonParsed = yaml.load(val[0]);
        // console.log(jsonParsed);
        // if (translationData.includes({
        //   name: jsonParsed.dublin_core.title + jsonParsed.dublin_core.source[0].version,
        //   language: jsonParsed.dublin_core.language.identifier,
        // }) === false) {
        //   console.log({ name: `${jsonParsed.dublin_core.title} v${jsonParsed.dublin_core.source[0].version}` });
        // }
        // console.log(val);
    }
  };

  useEffect(() => {
    if (!selectResource) {
        setSelectResource('bible');
        setTitle('Bible');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={(e) => handleSelectResource(e, id, text)}
      type="button"
      className={`flex items-center text-xs uppercase 
      font-semibold tracking-wider py-2 px-4 
      ${id === selectResource ? 'bg-primary outline-none rounded shadow  text-white' : ''}`}
    >
      <img
        className="text-white mr-2"
        src={imageUrl}
        alt=""
      />
      {text}
    </button>
  );
};
export default ResourceOption;
ResourceOption.propTypes = {
  imageUrl: PropTypes.string,
  text: PropTypes.string,
  selectResource: PropTypes.string,
  id: PropTypes.string,
  setSelectResource: PropTypes.func,
  setTitle: PropTypes.func,
  setShowInput: PropTypes.func,
};
