import { IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useContext } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';

export default function EditorSection(props) {
    const {
        children,
        header,
        editor,
      } = props;
      const {
        actions: {
          handleClick,
        },
      } = useContext(ReferenceContext);
    return (
      <>
        {editor ? (
          <div
            className="shadow relative hover:border-primary w-96 h-250 rounded-md border-2 border-black top-13"
            style={{ top: '13px' }}
          >
            <div className="relative text-center bg-gray-800 h-6 rounded-t text-gray-100  text-xs uppercase tracking-widest font-bold leading-3">
              <div className="text-center pt-1">
                {header}
              </div>
            </div>
            <div className=" p-5 border-white rounded-b h-250 max-h-100 overflow-scroll text-xs">
              {children}
            </div>
          </div>
        )
        : (
          <div style={{ display: 'inline-block', top: '13px' }} className="shadow relative hover:border-primary w-96 h-100 rounded-md border-2">
            <div className="relative text-center bg-gray-200 h-6 rounded-t text-gray-600  text-xs uppercase tracking-widest font-bold leading-3">
              <div className="text-center pt-1 display: inline-flex">
                <span>
                  {header}
                </span>
                <span className="display: inline-flex">
                  <IconButton aria-controls="simple-menu" style={{ left: '114px', top: '-15px' }} aria-haspopup="true" onClick={handleClick}>
                    <AddBoxIcon fontSize="small" />
                  </IconButton>
                </span>
              </div>
            </div>
            <div className=" p-5 border-white rounded-b max-h-80 overflow-scroll text-xs">
              {children}
            </div>
          </div>
        )}
      </>
    );
}

EditorSection.propTypes = {
    children: PropTypes.any,
    header: PropTypes.string,
    editor: PropTypes.bool,
};
