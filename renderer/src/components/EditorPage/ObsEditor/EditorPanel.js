import PropTypes from 'prop-types';

const EditorPanel = ({ obsStory, storyUpdate }) => {
  const handleChange = (e) => {
    const index = e.target.getAttribute('data-id');
    const value = e.target.value;
    const story = obsStory[index - 1];
    let newStory = {};
    if (Object.prototype.hasOwnProperty.call(story, 'title')) {
      newStory = {
        id: story.id,
        title: value,
      };
    } else if (Object.prototype.hasOwnProperty.call(story, 'text')) {
      newStory = {
        id: story.id,
        img: story.img,
        text: value,
      };
    } else if (Object.prototype.hasOwnProperty.call(story, 'end')) {
      newStory = {
        id: story.id,
        end: value,
      };
    }

    const newStories = obsStory.map((story) => (story.id !== newStory.id ? story : newStory));
    let newData = { ...obsStory };
    newData = newStories;
    storyUpdate(newData);
  };
  return (
    <>
      {obsStory.map((story) => (
        <>
          {story.title
          && (
          <div
            className="flex m-4 p-4 rounded-md min-h-0"
            key={story.id}
          >
            <textarea
              name={story.title}
              onChange={handleChange}
              value={story.title}
              data-id={story.id}
              className="flex-grow text-justify ml-2 p-2 text-sm"
            />
          </div>
          )}
          {story.text
          && (
          <div
            className="flex m-4 p-4 rounded-md"
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
          {story.end
          && (
          <div
            className="flex m-4 p-4 rounded-md min-h-0"
            key={story.id}
          >
            <textarea
              name={story.end}
              onChange={handleChange}
              value={story.end}
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
