export default function Bookmarks() {
  return (
    <>
      <div className="bg-gray-800 uppercase text-white text-xs p-2 tracking-wider">
        Bookmarks
      </div>
      <div className="overflow-y-auto h-full no-scrollbars">
        <div className="flex justify-between items-center bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider border-b border-gray-300 shadow-sm">
          Genesis 1:1
        </div>
        <div className="flex justify-between items-center bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider border-b border-gray-300 shadow-sm">
          James 1:4
        </div>
        <div className="flex justify-between items-center bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider border-b border-gray-300 shadow-sm">
          Matthew 1:14
        </div>
      </div>
    </>
  );
}
