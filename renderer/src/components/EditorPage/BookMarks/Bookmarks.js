import { ReferenceContext } from '@/components/context/ReferenceContext';
import { useContext } from 'react';

export default function Bookmarks() {
  const {
    state: {
      bookmarksVerses,
    },
  } = useContext(ReferenceContext);
  return (
    <>
      <div className="bg-gray-800 uppercase text-white text-xs p-2 tracking-wider">
        Bookmarks
      </div>
      <div className="overflow-y-auto h-full no-scrollbars">
        {bookmarksVerses.map((bookmark) => (
          <div className="flex justify-between items-center bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider border-b border-gray-300 shadow-sm">
            {bookmark.bookname}
            {' '}
            {bookmark.chapter}
          </div>
        ))}
      </div>
    </>
  );
}
