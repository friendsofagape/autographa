import PropTypes from 'prop-types';

const EditorPanel = ({ obsStory, storyUpdate }) => {
  const handleChange = (e) => {
    const index = e.target.getAttribute('data-id');
    const value = e.target.value;
    const story = obsStory[index - 1];
    const newStory = {
      id: story.id,
      img: story.img,
      text: value,
    };
    const newStories = obsStory.map((story) => (story.id !== newStory.id ? story : newStory));
    let newData = { ...obsStory };
    newData = newStories;
    storyUpdate(newData);
  };
  return (
    <>
      {obsStory.map((story) => (
        <>
          {story.text
          && (
          <div
            className="flex m-4 p-4 border-solid border-2 border-gray-200 rounded-md h-40"
            key={story.id}
          >
            <textarea
              name={story.text}
              onChange={handleChange}
              value={story.text}
              data-id={story.id}
              className="flex-grow text-justify ml-2 p-2 text-sm"
            />
          </div>
          )}
        </>
      ))}
    </>
  );
};
export default EditorPanel;
EditorPanel.propTypes = {
  obsStory: PropTypes.array,
  storyUpdate: PropTypes.func,
};
