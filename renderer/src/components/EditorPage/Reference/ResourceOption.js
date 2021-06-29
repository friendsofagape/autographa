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
      className=" focus:bg-primary focus:outline-none  focus:rounded focus:shadow py-2 px-4 focus:text-white"
    >
      <div className="flex gap-2">
        <img
          className="text-white"
          src={imageUrl}
          alt=""
        />
        {text}
      </div>
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
