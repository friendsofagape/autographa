import React from 'react';
import PropTypes from 'prop-types';

const InputSelector = ({ onChange }) => {
    const handleReadFile = async (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onloadend = async (e) => {
            const text = await (e.target.result);
            onChange(text);
        };
        reader.readAsText(e.target.files[0]);
      };

    return (
      <div>
        <input accept=".usfm,.txt" type="file" onChange={(e) => handleReadFile(e)} />
      </div>
    );
};

export default InputSelector;

InputSelector.propTypes = {
  onChange: PropTypes.func,
};
