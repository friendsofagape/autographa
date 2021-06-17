import React from 'react';
import PropTypes from 'prop-types';

const ResourceOption = ({
    imageUrl, text, id, setSelectResource,
}) => {
    const handleSelectResource = (e, id) => {
        if (id) {
            setSelectResource(id);
            }
        };

  return (
    <button
      onClick={(e) => handleSelectResource(e, id)}
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
};
