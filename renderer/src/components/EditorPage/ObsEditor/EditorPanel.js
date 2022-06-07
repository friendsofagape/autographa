import { ProjectContext } from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import PropTypes from 'prop-types';
import { useContext } from 'react';

const EditorPanel = ({ obsStory, storyUpdate }) => {
  const { actions: { setSelectedStory } } = useContext(ReferenceContext);
  const { states: { scrollLock } } = useContext(ProjectContext);
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
          {Object.prototype.hasOwnProperty.call(story, 'title')
          && (
          <div
            className="flex m-4 p-1 rounded-md min-h-0"
            key={story.id}
          >
            <textarea
              name={story.title}
              onChange={handleChange}
              onClick={() => setSelectedStory(scrollLock === true ? 0 : story.id)}
              value={story.title}
              data-id={story.id}
              className="flex-grow text-justify ml-2 p-2 text-sm"
            />
          </div>
          )}
          {Object.prototype.hasOwnProperty.call(story, 'text')
          && (
          <div
            className="flex m-4 p-1 rounded-md"
            key={story.id}
          >
            <textarea
              name={story.text}
              onChange={handleChange}
              onClick={() => setSelectedStory(scrollLock === true ? 0 : story.id)}
              value={story.text}
              data-id={story.id}
              className="flex-grow text-justify ml-2 p-2 text-sm"
            />
          </div>
          )}
          {Object.prototype.hasOwnProperty.call(story, 'end')
          && (
          <div
            className="flex m-4 p-1 rounded-md min-h-0"
            key={story.id}
          >
            <textarea
              name={story.end}
              onChange={handleChange}
              onClick={() => setSelectedStory(scrollLock === true ? 0 : story.id)}
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
