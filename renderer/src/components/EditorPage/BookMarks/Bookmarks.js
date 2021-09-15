import { ReferenceContext } from '@/components/context/ReferenceContext';
import { useContext } from 'react';

export default function Bookmarks() {
  const {
    state: {
      bookmarksVerses,
      bookList,
    },
    actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
    },
  } = useContext(ReferenceContext);

  const gotoChapter = (bookname,
    chapter) => {
        bookList.forEach((book) => {
            if (bookname === book.name) {
                onChangeBook(book.key);
                onChangeChapter(chapter);
                onChangeVerse('1');
            }
        });
  };
  return (
    <>
      <div className="bg-gray-800 uppercase text-white text-xs p-2 tracking-wider">
        Bookmarks
      </div>
      <div className="overflow-y-auto h-full no-scrollbars">
        {bookmarksVerses.map((bookmark) => (
          <div
            role="button"
            tabIndex="0"
            onClick={() => { gotoChapter(bookmark.bookname, bookmark.chapter); }}
            key={bookmark.bookname + bookmark.chapter}
            className="flex justify-between items-center hover:bg-gray-400 bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider border-b border-gray-300 shadow-sm"
          >
            {bookmark.bookname}
            {' '}
            {bookmark.chapter}
          </div>
        ))}
      </div>
    </>
  );
}
