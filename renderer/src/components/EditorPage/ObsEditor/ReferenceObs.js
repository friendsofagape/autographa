/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { useContext, useEffect, useState } from 'react';
import LoadingScreen from '../../Loading/LoadingScreen';

const style = {
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
};
const ReferenceObs = ({ stories }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { state: { selectedStory } } = useContext(ReferenceContext);
  useEffect(() => {
    if (stories === undefined) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [stories]);
  return (
    <div>
      { isLoading === false ? (
        <>
          {
            stories.map((story) => (
              <div key={story.id} className={`flex gap-5 mb-5 items-center justify-center ${story.id === selectedStory && 'bg-light'}`}>
                {
                  Object.prototype.hasOwnProperty.call(story, 'title') && (
                  <p className="text-sm text-gray-600" style={style.bold}>
                    {story.title}
                  </p>
                  )
                }
                {Object.prototype.hasOwnProperty.call(story, 'text') && (
                <>
                  <img className="w-1/4 rounded-lg" src={story.img} alt="" />
                  <p className="text-sm text-gray-600">
                    {story.text}
                  </p>
                </>
                )}
                {
                  Object.prototype.hasOwnProperty.call(story, 'end') && (
                  <p className="text-sm text-gray-600" style={style.italic}>
                    {story.end}
                  </p>
                  )
                }
              </div>
            ))
          }
        </>
        ) : (
          <LoadingScreen />
        )}
    </div>
);
};
export default ReferenceObs;
