import { XCircleIcon } from '@heroicons/react/solid';

export default function SearchTags() {
  return (
    <>
      <input
        type="text"
        name="search_box"
        id="search_box"
        autoComplete="given-name"
        className="bg-gray-100 mx-5 w-2/12 block rounded-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-300"
      />
      <button
        type="button"
        className="rounded-full border border-transparent py-2 pl-5 pr-3 mx-2
              bg-gray-200 text-xs uppercase flex flex-wrap content-center justify-items-center
              hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <div className="leading-tight">Arabic</div>
        <XCircleIcon className="h-4 w-4 ml-2 fill-current text-gray-800" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="rounded-full border border-transparent py-2 pl-5 pr-3 mx-2
              bg-gray-200 text-xs uppercase flex flex-wrap content-center justify-items-center
              hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <div className="leading-tight">Malayalam</div>
        <XCircleIcon className="h-4 w-4 ml-2 fill-current text-gray-800" aria-hidden="true" />
      </button>
    </>

  );
}
