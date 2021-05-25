import PropTypes from 'prop-types';

export default function EditorSection(props) {
    const {
        children,
        header,
      } = props;
    return (
      <div className="shadow relative hover:border-primary w-96 h-80 rounded-md border-2">
        <div className="relative text-center bg-gray-200 h-6 rounded-t text-gray-600  text-xs uppercase tracking-widest font-bold leading-3">
          <div className="text-center pt-1">
            {header}
          </div>
        </div>
        <div className=" p-5 border-white rounded-b max-h-72 overflow-scroll text-xs">
          {children}
        </div>
      </div>

    );
}

EditorSection.propTypes = {
    children: PropTypes.any,
    header: PropTypes.string,
  };
