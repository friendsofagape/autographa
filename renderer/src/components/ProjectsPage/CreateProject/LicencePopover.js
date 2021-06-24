import React from 'react';
import { Popover } from '@headlessui/react';
import { ProjectContext } from '../../context/ProjectContext';

export default function LicencePopover() {
  const [name, setName] = React.useState();
  const [content, setContent] = React.useState();
  const {
    states: {
      copyright,
    }, actions: { setCopyRight },
  } = React.useContext(ProjectContext);
  const openlicenceNav = (nav) => {
    if (nav === 'edit') {
      setName(copyright.title);
      setContent(copyright.licence);
    }
  };
  const addLicence = () => {
    setCopyRight({ id: 'custom', title: name, licence: content });
  };
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="min-w-full">
            <button
              className="mt-5 flex-shrink-0"
              type="button"
              label="na"
              onClick={() => openlicenceNav('add')}
            >
              <img
                className="min-w-10"
                src="illustrations/add-button.svg"
                alt="add button"
              />
            </button>
            {/* <button
              className="mt-5 flex-shrink-0"
              type="button"
              label="na"
              onClick={() => openlicenceNav('edit')}
            >
              <img
                className=" w-10 h-10"
                src="illustrations/edit.svg"
                alt="add button"
              />
            </button> */}
          </Popover.Button>
          <Popover.Overlay
            className={`${
              open ? 'opacity-30 fixed inset-0' : 'opacity-0'
            } bg-black`}
          />
          <Popover.Panel className="absolute z-20 bg-white rounded-md right-5 -bottom-24">
            <div className="m-5">
              <div className="">
                <h2 className="uppercase font-bold leading-5 tracking-widest ">new license</h2>
              </div>
              <div className="mt-8 mb-10">
                <input
                  className="bg-gray-200 w-96 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300 h-10"
                  value={name}
                  onChange={(e) => { setName(e.target.value); }}
                />
              </div>
              <div>
                <textarea
                  className="h-60 border rounded border-gray-300 bg-gray-200 w-96"
                  value={content}
                  onChange={(e) => { setContent(e.target.value); }}
                />
              </div>
              <div className="mt-3 content-start">
                <Popover.Button className="mr-5 bg-error w-28 h-8 border-color-error rounded uppercase shadow text-white text-xs tracking-wide leading-4 font-light"> cancel</Popover.Button>
                <button
                  type="button"
                  className=" bg-success w-28 h-8 border-color-success rounded uppercase text-white text-xs shadow"
                  onClick={() => { addLicence(); }}
                >
                  create
                </button>
              </div>

            </div>
          </Popover.Panel>
        </>
        )}
    </Popover>
  );
}
