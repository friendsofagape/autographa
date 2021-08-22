import React from 'react';
import PropTypes from 'prop-types';

const electron = window.require('electron');
const { remote } = electron;
const { dialog } = remote;
console.log(dialog);

const InputSelector = ({ onChange }) => {
    const handleReadDir = async (e) => {
      const options = { properties: ['openDirectory'] };
      // Synchronous
      const dir = dialog.showOpenDialog(options);
      console.log(dir);
      };

    return (
      <div>
        <button onClick={() => handleReadDir()}>
          Open Dialog to Select a file
        </button>
      </div>
    );
};

export default InputSelector;

InputSelector.propTypes = {
  onChange: PropTypes.func,
};
