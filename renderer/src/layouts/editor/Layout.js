import PropTypes from 'prop-types';
import MenuBar from './MenuBar';
import SubMenuBar from './SubMenuBar';

export default function EditorLayout(props) {
  const {
    children,
  } = props;

  return (
    <>

      <MenuBar />
      <SubMenuBar />

      <main className="bg-gray-50-x">
        {children}
      </main>

    </>

  );
}

EditorLayout.propTypes = {
  children: PropTypes.any,
};
