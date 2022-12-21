import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';

export default function SearchSideBar() {
  return (
    <>
      <div className="bg-gray-800 uppercase text-white text-xs p-2 tracking-wider">
        Search &amp; Replace
      </div>

      <div className="py-5 px-4 flex rounded-b-md shadow-sm bg-white">
        <input
          type="text"
          name="search"
          id="search"
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md text-sm border border-gray-300 border-r-0"
          placeholder="Joseph"
        />
        <span className="inline-flex items-center text-xs px-3 border border-gray-300 border-r-0 border-l-0 text-gray-400">
          3 of 4
        </span>
        <span className="inline-flex items-center bg-gray-200 rounded-r-md">
          <span className="inline-flex items-center px-2 text-black text-sm">
            <ChevronUpIcon className="w-5 h-5" />
          </span>
          <span className="inline-flex items-center px-2 text-black text-sm">
            <ChevronDownIcon className="w-5 h-5" />
          </span>
        </span>
      </div>
      <div className="mx-5">
        <span className="inline-block bg-black px-3 py-1 mt-3 uppercase text-xxs tracking-wider rounded-full text-white">replace</span>
        <input
          type="text"
          name="replace"
          id="replace"
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full mt-3 rounded-md text-sm border border-gray-300"
          placeholder="Replace Terms"
        />
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xxs uppercase tracking-wider font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Replace
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xxs uppercase tracking-wider font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Replace All
          </button>
        </div>
      </div>
      <div className="flex items-start px-5 pt-3">
        <div className="flex items-center h-5">
          <input
            id="comments"
            name="comments"
            type="checkbox"
            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="font-medium text-gray-700">
            Ignore Punctuation Marks
          </label>
        </div>
      </div>
      <div className="flex items-start px-5 pt-3">
        <div className="flex items-center h-5">
          <input
            id="comments"
            name="comments"
            type="checkbox"
            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="font-medium text-gray-700">
            Find whole words only
          </label>
        </div>
      </div>
      <div className="flex justify-between items-center mt-5 bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider">
        <div className="flex items-center">
          <span className="inline-flex items-center pr-2 text-gray-400 text-sm">
            <ChevronDownIcon className="w-5 h-5" />
          </span>
          <span>Mathew Henry Commentary</span>
        </div>
        <span className="inline-block px-2 bg-gray-400 rounded-full text-xxs">2</span>
      </div>
      <div className="mx-5 mt-3 tracking-wider text-xs prose-sm">
        <p>
          The lord was with
          <span className="text-primary font-semibold"> Jospeh </span>
          and ...
        </p>
        <p>
          And
          <span className="text-primary font-semibold"> Jospeh </span>
          said to his brother ...
        </p>
      </div>
      <div className="flex justify-between items-center mt-5 bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider">
        <div className="flex items-center">
          <span className="inline-flex items-center pr-2 text-gray-400 text-sm">
            <ChevronDownIcon className="w-5 h-5" />
          </span>
          <span>Mathew Henry Commentary</span>
        </div>
        <span className="inline-block px-2 bg-gray-400 rounded-full text-xxs">2</span>
      </div>
      <div className="mx-5 mt-3 tracking-wider text-xs prose-sm">
        <p>
          The lord was with
          <span className="text-primary font-semibold"> Jospeh </span>
          and ...
        </p>
        <p>
          And
          <span className="text-primary font-semibold"> Jospeh </span>
          said to his brother ...
        </p>
      </div>
      <div className="flex justify-between items-center mt-5 bg-gray-200 p-2 pr-5 text-sm font-semibold tracking-wider">
        <div className="flex items-center">
          <span className="inline-flex items-center pr-2 text-gray-400 text-sm">
            <ChevronDownIcon className="w-5 h-5" />
          </span>
          <span>Mathew Henry Commentary</span>
        </div>
        <span className="inline-block px-2 bg-gray-400 rounded-full text-xxs">2</span>
      </div>
      <div className="mx-5 mt-3 tracking-wider text-xs prose-sm">
        <p>
          The lord was with
          <span className="text-primary font-semibold"> Jospeh </span>
          and ...
        </p>
        <p>
          And
          <span className="text-primary font-semibold"> Jospeh </span>
          said to his brother ...
        </p>
      </div>
    </>
  );
}
