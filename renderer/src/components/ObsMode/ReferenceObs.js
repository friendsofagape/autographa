/* eslint-disable react/prop-types */

const style = {
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
};
const ReferenceObs = ({ stories }) => (
  <>
    {
      stories.map((story) => (
        <div key={story.id} className="flex gap-5 mb-5 items-center justify-center">
          {
            story.title && (
            <p className="text-sm text-gray-600" style={style.bold}>
              {story.title}
            </p>
            )
          }
          {
            story.end && (
            <p className="text-sm text-gray-600" style={style.italic}>
              {story.end}
            </p>
            )
          }
          {story.text && (
          <>
            <img className="w-1/4 rounded-lg" src={story.img} alt="" />
            <p className="text-sm text-gray-600">
              {story.text}
            </p>
          </>
          )}
        </div>
      ))
    }
  </>
);
export default ReferenceObs;
