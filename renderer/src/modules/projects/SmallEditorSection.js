import PropTypes from 'prop-types';
import { StarIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';

const people = [
  {
    name: 'Mathew Henry',
    date: '2021-02-05',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Bridaway',
    date: '20-02-11',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Aramic',
    date: '2021-02-25',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Spanish',
    date: '2021-02-25',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Zulu',
    date: '2021-02-25',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
];

function ResourcesPopUP() {
  function Option(props) {
    const { imageUrl, text } = props;
    return (
      <button type="button" onClick="/" className=" focus:bg-primary focus:outline-none  focus:rounded focus:shadow py-2 px-4 focus:text-white">
        <div className="flex gap-2">
          <img
            className="  text-white"
            src={imageUrl}
            alt=""
          />
          {text}
        </div>
      </button>
    );
  }

  Option.propTypes = {
    imageUrl: PropTypes.string,
    text: PropTypes.string,
  };

  const [remove, setRemove] = useState(false);
  const removeSection = () => {
    setRemove(!remove);
  };

  return (
    <div className="absolute">
      <div className={` ${remove && 'hidden'} flex relative rounded shadow overflow-hidden bg-white`}>
        <button onClick={removeSection} type="button" className="absolute z-10 -right-0">
          <img
            src="/illustrations/close-button-black.svg"
            alt="/"
          />
        </button>
        <div>
          <div className="uppercase bg-secondary  text-white py-2 px-2 text-xs tracking-widest leading-snug rounded-tl text-center">Resources</div>
          <div className="bg-gray-100 px-3 py-3 h-full">
            <input className="rounded h-8 bg-gray-200 border-none uppercase pr-6 text-xs tracking-widest leading-snug font-bold text-secondary" placeholder="Search" type="search" id="gsearch" name="gsearch" />
            <div className=" grid grid-rows-5 px-5 py-5 gap-6">
              <Option imageUrl="/illustrations/dictionary-icon.svg" text="Dictionary" />
              <Option imageUrl="/illustrations/image-icon.svg" text="Image" />
              <Option imageUrl="/illustrations/location-icon.svg" text="Map" />
              <Option imageUrl="/illustrations/dialogue-icon.svg" text="Commentary" />
              <Option imageUrl="/illustrations/bible-icon.svg" text="Bible" />
            </div>
          </div>
        </div>
        <div className="w-full relative overflow-hidden">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-white">
              <tr className="">
                <th
                  className=" py-3 text-left text-xs font-medium text-gray-300 pl-10"
                >
                  <StarIcon className="h-5 w-5" aria-hidden="true" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {people.map((person) => (
                <tr key={person.name}>
                  <td className="pl-10">
                    {' '}
                    <StarIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                  </td>
                  <td className="px-5 py-6 text-left text-gray-600">{person.name}</td>
                  <td className="text-gray-600  text-left">{person.date}</td>
                </tr>
          ))}
            </tbody>
          </table>
          <div className="flex gap-6 mt-32 mb-5 ml-52 mr-10  justify-end">
            <button type="button" className="py-2 px-6 bg-primary rounded shadow text-white uppercase text-xs tracking-widest font-semibold">Upload</button>
            <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold">Cancel</button>
            <button type="button" className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold">Open</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorSectionSmall(props) {
const { title, children } = props;
const [content, setContent] = useState(false);
const [remove, setRemove] = useState(false);
const [resourcePanel, setResourcePanel] = useState(false);

const removeSection = () => {
  setRemove(!remove);
};

const sectionContent = () => {
  setContent(!content);
};

const showResourcesPanel = () => {
  setResourcePanel(!resourcePanel);
};

  return (
    <div className={`${remove && 'hidden'}`}>

      <div className="border shadow  border-gray-50 rounded relative group">
        {
        content
      && (
      <img
        className="absolute bottom-0 -right-px invisible  group-hover:visible"
        src="/illustrations/add-section.svg"
        alt=""
      />
)
    }
        <div className="bg-gray-200 rounded-t border text-center text-gray-600 relative">
          { resourcePanel

&& (
<div className=" absolute z-50 ">

  <ResourcesPopUP />

</div>
)}
          <div className="flex bg-gray-300  absolute h-full -right-px rounded-tr invisible  group-hover:visible ">
            <button onClick={showResourcesPanel} type="button">

              <img
                src="/illustrations/settings-small.svg"
                alt="/"
                className="py-2 px-2"
              />
            </button>
            <button
              onClick={sectionContent}
              type="button"
            >

              <img
                className="px-2 py-2"
                src="/illustrations/minimize.svg"
                alt=""
              />
            </button>
            <button type="button" onClick={removeSection}>
              <img
                src="/illustrations/small-close-button.svg"
                alt=""
              />
            </button>
          </div>
          <div className="uppercase text-xs tracking-widest font-medium py-2">
            { title }
          </div>
        </div>
        { content

        && (
        <div className="overflow-scroll p-3">
          { children }
        </div>
)}
      </div>
    </div>
  );
}

EditorSectionSmall.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
};
