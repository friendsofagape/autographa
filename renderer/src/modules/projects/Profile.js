import { PropTypes } from 'prop-types';
import React from 'react';
import * as localForage from 'localforage';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/util/classNames';
import ProjectsLayout from '@/layouts/projects/Layout';
import { SnackBar } from '@/components/SnackBar';
import useValidator from '@/components/hooks/useValidator';
import CheckIcon from '@/icons/Common/Check.svg';
import PencilIcon from '@/icons/Common/Pencil.svg';
import i18n from '../../translations/i18n';
import { isElectron } from '../../core/handleElectron';
import { getorPutAppLangage, saveProfile } from '../../core/projects/handleProfile';
import CustomList from './CustomList';
import * as logger from '../../logger';

const languages = [
  { title: 'English', code: 'en' },
  { title: 'Hindi', code: 'hi' },
  { title: 'Russian', code: 'ru' },
  { title: 'Farsi', code: 'fa' },
  { title: 'French', code: 'fr' },
  { title: 'Nepali', code: 'ne' },
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
  const [errors, setErrors] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    selectedregion: '',
    organization: '',
  });

  const [appLang, setAppLang] = React.useState();
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const { t } = useTranslation();
  // const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!username && isElectron()) {
      localForage.getItem('userProfile')
        .then(async (value) => {
          setUsername(value.username);
          const keys = Object.keys(values);
          keys.forEach((key) => {
            values[key] = value[key];
          });
          setValues(values);
          // get saved app language
          const savedLangCode = await getorPutAppLangage('get', value.username);
          if (savedLangCode) {
            const filetredLang = languages.filter((lang) => lang.code.toLowerCase() === savedLangCode.toLowerCase());
            setAppLang(filetredLang[0]);
          } else {
            setAppLang(languages[0]);
          }
        });
      localForage.getItem('appMode')
        .then((value) => {
          setAppMode(value);
        });
    }
  }, [username, values, appMode]);

  React.useEffect(() => {
    const currentLang = languages.filter(
      (lang) => lang.code === i18n.language,
    );
    setAppLang(currentLang[0]);
  }, []);

  const { action: { validateField, isLengthValidated, isTextValidated } } = useValidator();

  const handleSave = async (e) => {
    logger.debug('Profile.js', 'In handleSave for Saving profile');
    e.preventDefault();
    // const resultObj = await validate();
    const haveError = Object.values(errors).some((val) => val && val.length > 0);
    if (haveError === false) {
      if (i18n.language !== appLang.code) {
        i18n.changeLanguage(appLang.code);
      }
      const status = await saveProfile(values, appLang);
      setNotify(status[0].type);
      setSnackText(status[0].value);
      setOpenSnackBar(true);
    }
  };

  const validationFileds = ['username', 'firstname', 'lastname', 'email', 'organization', 'region'];

  async function checkValidationResp(response, field, errors) {
    const resultObj = errors;
    if (response && response.length > 0) {
      for (let x = 0; x < response.length; x++) {
          resultObj[field] = response[x].message;
          if (response[x].message !== '') { return; }
      }
    } else {
      resultObj[field] = '';
    }
    setErrors(resultObj);
  }

  return (
    <>
      <ProjectsLayout title={t('profile-page')}>
        <div className=" bg-gray-100 flex">
          <div className="w-60  bg-secondary ">
            <div className="grid grid-rows-5 p-8 gap-16 pb-20 mr-20 capitalize">

              {validationFileds.map((field, indx) => {
                const inpField = field === 'region' ? 'selectedregion' : field;
                return (
                  <div className="grid grid-cols-2" key={inpField}>
                    <ProgressCircle
                      isFilled={inpField === 'username' || (values[inpField]?.length > 0 && errors[inpField]?.length <= 0)}
                      count={indx + 1}
                      text={t(`label-${field}`)}
                    />
                  </div>
                );
              })}

            </div>
          </div>
          <div className="w-full h-auto bg-white m-2 rounded-lg border">

            <form className="grid gap-8 grid-rows-8 pt-5 pl-5" onSubmit={(e) => handleSave(e)}>
              {(appMode === 'offline')
                && (
                  <div>
                    <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">{t('label-username')}</h4>
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
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">{t('label-name')}</h4>
                <div className="flex gap-8">
                  <input
                    type="text"
                    name="given-name"
                    id="firstname"
                    autoComplete="given-name"
                    defaultValue={values?.firstname}
                    onChange={(e) => {
                        setValues({ ...values, firstname: e.target.value });
                        checkValidationResp(e.target.value.length > 0 && validateField([isLengthValidated(e.target.value, { minLen: 2, maxLen: 15 }), isTextValidated(e.target.value, 'onlyString')]), 'firstname', errors);
                    }}
                    className="w-44 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                  />
                  <input
                    type="text"
                    name="family-name"
                    id="lastname"
                    autoComplete="given-name"
                    defaultValue={values?.lastname}
                    onChange={(e) => {
                      setValues({ ...values, lastname: e.target.value });
                      checkValidationResp(e.target.value.length > 0 && validateField([isLengthValidated(e.target.value, { minLen: 2, maxLen: 15 }), isTextValidated(e.target.value, 'onlyString')]), 'lastname', errors);
                    }}
                    className="w-44 h-10  block rounded  sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 font-light "
                  />
                </div>
                <span className="text-red-500 ml-2 text-sm">
                  {(values?.firstname?.length > 0 && errors?.firstname) || (values?.lastname?.length > 0 && errors?.lastname)}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">{t('label-email')}</h4>
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="email"
                  defaultValue={values?.email}
                  onChange={(e) => {
                    setValues({ ...values, email: e.target.value });
                    checkValidationResp(e.target.value.length > 0 && validateField([isTextValidated(e.target.value, 'email')]), 'email', errors);
                  }}
                  className="w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                />
                <span className="text-red-500 ml-2 text-sm">{errors?.email}</span>
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
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">{t('label-organization')}</h4>
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  autoComplete="organization"
                  defaultValue={values?.organization}
                  onChange={(e) => {
                    setValues({ ...values, organization: e.target.value });
                    checkValidationResp(e.target.value.length > 0 && validateField([isLengthValidated(e.target.value, { minLen: 2, maxLen: 30 }), isTextValidated(e.target.value, 'nonSpecChar')]), 'organization', errors);
                  }}
                  className="w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                />
                <span className="text-red-500 ml-2 text-sm">{errors?.organization}</span>
              </div>
              <div>
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">{t('label-region')}</h4>
                <input
                  type="text"
                  name="selectedregion"
                  id="selectedregion"
                  autoComplete="selectedregion"
                  defaultValue={values?.selectedregion}
                  onChange={(e) => {
                    setValues({ ...values, selectedregion: e.target.value });
                    checkValidationResp(e.target.value.length > 0 && validateField([isLengthValidated(e.target.value, { minLen: 2, maxLen: 30 }), isTextValidated(e.target.value, 'nonSpecChar')]), 'selectedregion', errors);
                  }}
                  className="w-96 block rounded shadow-sm sm:text-sm focus:ring-gray-500 focus:border-primary border-gray-200 h-10 font-light"
                />
                <span className="text-red-500 ml-2 text-sm">{errors?.selectedregion}</span>
              </div>

              <div className="relative">
                <h4 className="text-xs font-base mb-2 ml-2 text-primary  tracking-wide leading-4  font-light">
                  {t('label-app-language')}
                  <span className="text-error">*</span>
                </h4>
                <CustomList selected={appLang} setSelected={setAppLang} options={languages} show />
                {/* <input type="text" value="English" disabled className="bg-gray-100 w-96 block rounded shadow-sm sm:text-sm border-gray-200 h-10 font-light" /> */}
              </div>

              <button
                type="submit"
                className=" w-20 h-9 bg-success  shadow-md font-light text-white border-none text-xs leading-5 rounded uppercase mb-5"
              >
                {t('btn-save')}
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

ProgressCircle.propTypes = {
  isFilled: PropTypes.bool,
  count: PropTypes.string,
  text: PropTypes.string,
};
