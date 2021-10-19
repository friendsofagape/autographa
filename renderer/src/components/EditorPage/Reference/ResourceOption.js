import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ResourceOption = ({
  imageUrl, text, id, selectResource, setSelectResource, setTitle,
}) => {
  const handleSelectResource = (e, id, text) => {
    if (id) {
      setSelectResource(id);
      setTitle(text);
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
};
