/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import { PropTypes } from 'prop-types';
import React, { useCallback } from 'react';
import * as localForage from 'localforage';
// eslint-disable-next-line import/no-unresolved

import { XIcon } from '@heroicons/react/solid';
import { PencilIcon, CheckIcon } from '@heroicons/react/outline';
import router from 'next/router';
import { FormattedMessage } from 'react-intl';
import { classNames } from '@/util/classNames';
import ProjectsLayout from '@/layouts/projects/Layout';

import { SnackBar } from '@/components/SnackBar';
import { isElectron } from '../../core/handleElectron';
import { saveProfile } from '../../core/projects/handleProfile';
// import CustomList from './CustomList';
import * as logger from '../../logger';
import CustomList from './CustomList';

const languages = [
  { title: 'English', id: 'en' },
  { title: 'Hindi', id: 'hi' },
];

function ProgressCircle({ isFilled, count, text }) {
  return (

    <>
      <div
        className={classNames(isFilled ? 'bg-success' : 'bg-gray-700', 'w-7 h-7  text-white text-sm rounded-full flex justify-center items-center')}
        aria-hidden="true"
      >
        {isFilled
          ? <CheckIcon className="w-4" />
          : count}
      </div>
      <div className="text-white tracking-wider pl-3">{text}</div>
    </>
  );
}

function InputBar({ title }) {
  function clearText() {
    document.getElementById(title).value = '';
  }

  return (
    <div>
      <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">{title}</h4>
      <div className="flex justify-center items-center h-10 w-96 border-2 bg-white  border-gray-300  rounded">
        <input
          type="text"
          className="flex-1 h-8 border-0 m-1 focus:ring-white focus:border-none font-light"
          id={title}
        />
        <button
          onClick={clearText}
          type="button"
          className="m-1 w-6 h-6 flex justify-center items-center bg-primary text-white rounded-full"
        >
          <XIcon
            className="w-3 h-3"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const [username, setUsername] = React.useState();
  const [appMode, setAppMode] = React.useState('online');
  const [values, setValues] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    selectedregion: '',
    organization: '',
  });
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [appLanguage, setAppLanguage] = React.useState({ title: 'English', id: 'en' });

  const language = useCallback((use, user) => {
    const newpath = localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = window.require('path');
    const file = path.join(newpath, 'autographa', 'users', user, 'ag-user-settings.json');
    if (fs.existsSync(file)) {
      fs.readFile(file, (err, data) => {
        const json = JSON.parse(data);
        if (use === 'get') {
          const language = languages.find((obj) => obj.id === (json.appLanguage));
          setAppLanguage(language);
        } else {
          json.appLanguage = appLanguage.id;
          fs.writeFileSync(file, JSON.stringify(json));
        }
      });
    }
  }, [appLanguage]);
  React.useEffect(() => {
    if (!username && isElectron()) {
      localForage.getItem('userProfile')
        .then(async (value) => {
          language('get', value?.username);
          setUsername(value.username);
          const keys = Object.keys(values);
          keys.forEach((key) => {
            // eslint-disable-next-line no-param-reassign
            values[key] = value[key];
          });
          setValues(values);
        });
      localForage.getItem('appMode')
        .then((value) => {
          setAppMode(value);
        });
    }
  }, [username, values, appMode, language]);
  const handleSave = async (e) => {
    logger.debug('Profile.js', 'In handleSave for Saving profile');
    e.preventDefault();
    language('set', username);
    const status = await saveProfile(values);
    setNotify(status[0].type);
    setSnackText(status[0].value);
    setOpenSnackBar(true);
    router.push('./profile');
  };
  return (
    <>
      <ProjectsLayout title={<FormattedMessage id="profile-page" />}>
        <div className=" bg-gray-100 flex">
          <div className="w-60  bg-secondary ">
            <div className="grid grid-rows-5 p-8 gap-16 pb-20 mr-20">
              <div className="grid grid-cols-2">
                <ProgressCircle isFilled count="1" text={<FormattedMessage id="name-label" />} />
              </div>

              <div className="grid grid-cols-2">
                <ProgressCircle isFilled={false} count="2" text={<FormattedMessage id="email-label" />} />
              </div>

              <div className="grid grid-cols-2">
                <ProgressCircle isFilled={false} count="3" text={<FormattedMessage id="password-label" />} />
              </div>

              <div className="grid grid-cols-2">
                <ProgressCircle isFilled={false} count="4" text={<FormattedMessage id="organisation-label" />} />
              </div>

              <div className="grid grid-cols-2">
                <ProgressCircle isFilled={false} count="5" text={<FormattedMessage id="region-label" />} />
              </div>
            </div>
          </div>
          <div className="w-full h-auto bg-white m-2 rounded-lg border">

            <form className="grid gap-12 grid-rows-8 pt-5 pl-5" onSubmit={(e) => handleSave(e)}>
              {(appMode === 'offline')
                && (
                  <div>
                    <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light"><FormattedMessage id="username-label" /></h4>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      defaultValue={username}
                      disabled
                      className="bg-gray-100 w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                    />
                  </div>
                )}
              <div>
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light"><FormattedMessage id="name-label" /></h4>
                <div className="flex gap-8">
                  <input
                    type="text"
                    name="given-name"
                    id="name"
                    autoComplete="given-name"
                    defaultValue={values?.firstname}
                    onChange={(e) => {
                      setValues({ ...values, firstname: e.target.value });
                    }}
                    className="w-44 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                  />
                  <input
                    type="text"
                    name="family-name"
                    id="name"
                    autoComplete="given-name"
                    defaultValue={values?.lastname}
                    onChange={(e) => {
                      setValues({ ...values, lastname: e.target.value });
                    }}
                    className="w-44 h-10  block rounded  sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 font-light "
                  />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light"><FormattedMessage id="email-label" /></h4>
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="email"
                  defaultValue={values?.email}
                  onChange={(e) => {
                    setValues({ ...values, email: e.target.value });
                  }}
                  className="w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                />
              </div>
              {(appMode === 'online')
                && (
                  <div className="flex gap-3">
                    <input
                      className="bg-gray-100 w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                      type="password"
                    />
                    {/* <button type="button" className="pt-1">
                      <EditpasswordIcon
                        className="w-7 h-7"
                        aria-hidden="true"
                      />
                    </button> */}

                    <button
                      type="button"
                      className="mt-1 focus:outline-none bg-primary h-8 w-8 flex items-center justify-center rounded-full"
                    >
                      <PencilIcon
                        className="h-4 w-4 text-white"
                        aria-hidden="true"
                      />
                    </button>

                  </div>
                )}
              <div>
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light"><FormattedMessage id="organisation-label" /></h4>
                <input
                  type="text"
                  name="organisation"
                  id="organisation"
                  autoComplete="organisation"
                  defaultValue={values?.organization}
                  onChange={(e) => {
                    setValues({ ...values, organization: e.target.value });
                  }}
                  className="w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                />
              </div>
              <div>
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light"><FormattedMessage id="region-label" /></h4>
                <input
                  type="text"
                  name="selectedregion"
                  id="selectedregion"
                  autoComplete="selectedregion"
                  defaultValue={values?.selectedregion}
                  onChange={(e) => {
                    setValues({ ...values, selectedregion: e.target.value });
                  }}
                  className="w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                />
              </div>
              <div className="relative">
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">
                  <FormattedMessage id="app-language-label" />
                  <span className="text-error">*</span>
                </h4>
                <CustomList selected={appLanguage} setSelected={setAppLanguage} options={languages} show />
                {/* <input type="text" value="English" disabled className="bg-gray-100 w-96 block rounded shadow-sm sm:text-sm border-gray-200 h-10 font-light" /> */}
              </div>

              <button
                type="submit"
                className=" w-20 h-9 bg-success  shadow-md font-light text-white border-none text-xs leading-5 rounded uppercase mb-5"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </ProjectsLayout>
      <SnackBar
        openSnackBar={snackBar}
        snackText={snackText}
        setOpenSnackBar={setOpenSnackBar}
        setSnackText={setSnackText}
        error={notify}
      />
    </>
  );
}

InputBar.propTypes = {
  title: PropTypes.string,
};
