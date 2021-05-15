import { PropTypes } from 'prop-types';
import ProjectLayout from '../../layouts/ProjectsLayout';
import CustomAutocomplete from './CustomAutocomplete';

const regions = [
  { title: 'New Delhi, India' },
  { title: 'Pretoria, South Africa' },
  { title: 'Dakar, Senegal' },
];

const languages = [
  { title: 'Hindu' },
  { title: 'Zulu' },
  { title: 'Wolof' },
];

function InputBar({ title }) {
    function clearText() {
      document.getElementById(title).value = '';
  }

    return (
      <div>
        <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">{title}</h4>
        <div className=" flex justify-between h-10 w-96 border-2 bg-white  border-gray-300  rounded">
          <input
            type="text"
            className="border-1 border-white  bg-white rounded-full m-1 focus:ring-white focus:border-none font-light"
            id={title}
          />
          <button
            onClick={clearText}
            type="button"
          >
            <img
              className=" w-5 h-5 m-2 "
              src="/illustrations/clear-button.svg"
              alt="xbutton"
            />
          </button>
        </div>
      </div>
    );
  }

  export default function UserProfile() {
      return (
        <ProjectLayout title="personal information">
          <div className=" bg-gray-100 flex">
            <div className="w-60 h-screen bg-gray-900 ">
              <div className="grid grid-rows-5 p-8 gap-16 pb-20 mr-20">
                <div className="grid grid-cols-2">
                  <img
                    className=""
                    src="/illustrations/green-check.svg"
                    alt="Workflow"
                  />
                  <div className="text-white tracking-wider pl-3"> Name</div>
                </div>

                <div className="grid grid-cols-2">
                  <img
                    src="/illustrations/step-two.svg"
                    alt="Workflow1"
                  />
                  <div className="text-white tracking-wider  pl-3"> Email</div>
                </div>

                <div className="grid grid-cols-2">
                  <img
                    src="/illustrations/step-three.svg"
                    alt="Workflow2"
                  />
                  <span className="text-white tracking-wider pl-3 "> Password</span>
                </div>

                <div className="grid grid-cols-2">
                  <img
                    src="/illustrations/step-four.svg"
                    alt="Workflow3"
                  />
                  <span className="text-white tracking-wider  pl-3"> Organisation</span>
                </div>

                <div className="grid grid-cols-2">
                  <img
                    src="/illustrations/step-five.svg"
                    alt="Workflow4"
                  />
                  <span className="text-white tracking-wider pl-3  "> Region</span>
                </div>
              </div>
            </div>
            <div className="w-full h-auto bg-white ml-5 mt-3 mr-3 mb-3 rounded-lg shadow border-2">

              <form className="grid gap-12 grid-rows-8 pt-5 pl-5">
                <div className="flex gap-8">
                  <input
                    type="text"
                    name="given-name"
                    id="name"
                    autoComplete="given-name"
                    className="bg-gray-100 w-44 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                  />
                  <input
                    type="text"
                    name="family-name"
                    id="name"
                    autoComplete="given-name"
                    className="bg-gray-100 w-44 h-10  block rounded  sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 font-light "
                  />
                </div>

                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="bg-gray-100 w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                />

                <div className="flex gap-3">
                  <input
                    className="bg-gray-100 w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                    type="password"
                  />
                  <button type="button" onClick="">

                    <img
                      className=""
                      src="/illustrations/edit-password.svg"
                      alt="edit password"
                    />
                  </button>

                </div>
                <InputBar title=" Organisation" />
                <div>
                  <CustomAutocomplete list={regions} label="Region" />
                </div>
                <div>
                  <CustomAutocomplete list={languages} label="App Language" />
                </div>

                <button
                  type="submit"
                  className=" w-20 h-9 bg-success  shadow-md font-light text-white border-none text-xs leading-5 rounded uppercase"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </ProjectLayout>

      );
    }

    InputBar.propTypes = {
      title: PropTypes.string,
  };
