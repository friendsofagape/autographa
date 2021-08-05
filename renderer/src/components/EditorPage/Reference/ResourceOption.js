import React from 'react';
import PropTypes from 'prop-types';

const ResourceOption = ({
  imageUrl, text, id, setSelectResource, setTitle,
}) => {
  const handleSelectResource = (e, id, text) => {
    if (id) {
      setSelectResource(id);
      setTitle(text);
    }
  };

  return (
    <button
      onClick={(e) => handleSelectResource(e, id, text)}
      type="button"
      className="flex items-center text-xs uppercase font-semibold tracking-wider focus:bg-primary focus:outline-none focus:rounded focus:shadow py-2 px-4 focus:text-white"
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
  id: PropTypes.string,
  setSelectResource: PropTypes.func,
  setTitle: PropTypes.func,
};
