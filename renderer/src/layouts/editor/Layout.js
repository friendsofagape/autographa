import PropTypes from 'prop-types';
import MenuBar from './MenuBar';
import SubMenuBar from './SubMenuBar';

export default function EditorLayout(props) {
  const {
    children,
  } = props;

  return (
    <div className="flex">

      <div className="w-full">

        <MenuBar />
        <SubMenuBar />

        <main>
          {children}
        </main>

      </div>

    </div>

  );
}

EditorLayout.propTypes = {
  children: PropTypes.any,
};
