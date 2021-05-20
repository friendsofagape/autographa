import { XCircleIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

export default function SearchTags({
  defaultQuery,
  contentList1,
  contentList2,
  filterList,
  onfilerRequest1,
  onfilerRequest2,
}) {
  const [query, setQuery] = React.useState(defaultQuery);
  const excludeColumns = filterList.splice(filterList.indexOf(), 1);
  const onQuery = useCallback((_query, content) => {
    setQuery(_query);
    const lowercasedValue = _query.toLowerCase().trim();
    if (lowercasedValue === '') {
      return content;
    }
      const filteredData = content.filter(
        (item) => Object.keys(item).some((key) => (excludeColumns.includes(key)
          ? false
          : item[key].toString().toLowerCase().includes(lowercasedValue))),
      );
      return filteredData;
  }, [excludeColumns]);

  // handle change event of search input
  const handleChange = (value) => {
    setQuery(value);
  };

  React.useEffect(() => {
    if (query) {
      onfilerRequest1(onQuery(query, contentList1));
      onfilerRequest2(onQuery(query, contentList2));
    }
    if (!query) {
      onfilerRequest1(contentList1);
      onfilerRequest2(contentList2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <input
        type="text"
        name="search_box"
        id="search_box"
        autoComplete="given-name"
        onChange={(e) => handleChange(e.target.value)}
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
SearchTags.propTypes = {
  /** Prefill the query search field. */
  defaultQuery: PropTypes.string,
  /** Array list of items  */
  contentList1: PropTypes.array,
  contentList2: PropTypes.array,
  /** Array list to be filtered  */
  filterList: PropTypes.array,
  /** Function to propogate the returned repositories data array. */
  onfilerRequest1: PropTypes.func,
  onfilerRequest2: PropTypes.func,
  /** Configuration required if paths are provided as URL. */
};
