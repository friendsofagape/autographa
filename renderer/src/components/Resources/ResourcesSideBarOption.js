/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@/util/classNames';

const ResourcesSideBarOption = ({
  imageUrl,
  text,
  id,
  selectedMenu,
  setSelectedMenu,
  handleClick,
  resource,
  Icon,
  setTitle,
  setShowInput,
}) => {
  const handleSelectResource = (id) => {
    if (id) {
      // setSelectedResource(id);
      handleClick(id);
      setSelectedMenu(id); // setTitle(text);
      setShowInput(false);
    }
  };
  useEffect(() => {
    if (!selectedMenu) {
      setSelectedMenu('bible');
      // setTitle('Bible');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      onClick={() => handleSelectResource(resource.id)}
      className={classNames(
        selectedMenu === resource.id ? 'bg-primary text-white' : '',
        'flex w-full items-center gap-1 px-3 py-2 rounded-md cursor-pointer ',
      )}
    >
      <Icon className="mx-3 h-5 w-5" />
      <span className="font-semibold text-sm text-left">{resource.title}</span>
    </button>
  );
};
export default ResourcesSideBarOption;
ResourcesSideBarOption.propTypes = {
  imageUrl: PropTypes.string,
  text: PropTypes.string,
  selectResource: PropTypes.string,
  id: PropTypes.string,
  setSelectResource: PropTypes.func,
  setTitle: PropTypes.func,
  setShowInput: PropTypes.func,
};
