import React, { useEffect } from 'react';
// import 'tailwindcss/tailwind.css';
import { ChevronRightIcon, UserIcon } from '@heroicons/react/solid';

import * as localForage from 'localforage';
import { useRouter } from 'next/router';
import LogoIcon from '@/icons/logo.svg';
import * as logger from '../../logger';
import { isElectron } from '../../core/handleElectron';
import CustomLogin from './CustomLogin';
import { AuthenticationContext } from './AuthenticationContextProvider';

import { createUser, handleLogin } from '../../core/Login/handleLogin';

export default function Login() {
  const router = useRouter();
  const online = {
    textfield: {
      count: [
        { label: 'Username', type: 'text', name: 'identifier' },
        { label: 'Password', type: 'password', name: 'password' },
      ],
    },
    viewForgot: true,
  };
  const offline = {
    autocomplete: { count: [{ label: 'Username' }] },
    viewForgot: false,
  };
  // eslint-disable-next-line no-unused-vars
  const tab = React.useState(!isElectron());
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = React.useState([]);
  const {
    states: { config },
    action: { generateToken },
    // action: { generateToken, getConfig },
  } = React.useContext(AuthenticationContext);
  // eslint-disable-next-line no-unused-vars
  const [tabvalue, setTabValue] = React.useState(0);
  const [ui, setUi] = React.useState(isElectron() ? offline : online);
  const [valid, setValid] = React.useState({
    username: false,
    password: false,
  });
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = React.useState();
  const [error, setError] = React.useState({
    identifier: '',
    password: '',
    msg: '',
  });
  // eslint-disable-next-line no-unused-vars
  const handleChange = (newValue) => {
    setTabValue(newValue);
    setUi(newValue === 0 ? offline : online);
  };
  // The below code is commented for UI dev purpose.
  useEffect(() => {
    if (users.length === 0) {
      localForage.getItem('users').then((user) => {
        if (user) {
          setUsers(user);
        }
      });
    }
  }, [users]);
  // useEffect(() => {
  //   if (!isElectron()) {
  //     // window is accessible here.
  //     const url = window.location.href;
  //     const regex = /(.*)login\?flow=/gm;
  //     getConfig(url.replace(regex, ''));
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    if (config) {
      // eslint-disable-next-line prefer-const
      let err = {};
      err.msg = config?.messages?.[0]?.text;
      config.fields.forEach((field) => {
        if (field.name === 'csrf_token') {
          setToken(field.value);
        } else {
          err[field.name] = field.messages?.[0].text;
        }
      });
      setError(err);
    }
  }, [config]);
  // eslint-disable-next-line no-unused-vars
  const handleValidation = (values) => {
    let user;
    if (values.username) {
      user = true;
    } else {
      user = false;
    }
    setValid({ ...valid, username: !user });
    return user;
  };
  // eslint-disable-next-line no-unused-vars
  const handleSubmit = async (values) => {
    localForage.setItem('appMode', 'online');
    logger.debug('Login.js', 'In handleSubmit');
    if (isElectron()) {
      // router.push('/main');
      // The below code is commented for UI dev purpose.
      if (handleValidation(values)) {
        const fs = window.require('fs');
        logger.debug('Login.js',
          'Triggers handleLogin to check whether the user is existing or not');
        const user = handleLogin(users, values);
        if (user) {
          logger.debug('Login.js',
            'Triggers generateToken to generate a Token for the user');
          generateToken(user);
        } else {
          logger.debug('Login.js', 'Triggers createUser for creating a new user');
          createUser(values, fs)
            .then((val) => {
              logger.debug('Login.js',
                'Triggers generateToken to generate a Token for the user');
              generateToken(val);
            });
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isElectron()) {
        router.push('/projects');
        // const requestOptions = {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: document.aglogin,
        // };
        // fetch(config?.action, requestOptions)
        //   .then((response) => response.json())
        //   .then((data) => console.log(data));
      } else {
        router.push('/projects');
        // } else {
        // router.push('/newproject');
        // The below code is commented for UI dev purpose.
        // document.aglogin.action = config.action;
        // document.aglogin.method = config.method;
        // // eslint-disable-next-line prefer-const
        // let input = document.createElement('input');
        //   input.setAttribute('type', 'hidden');
        //   input.setAttribute('name', 'csrf_token');
        //   input.setAttribute('value', token);
        // document.aglogin.appendChild(input);
        // document.aglogin.submit();
        // }
        // router.push('/login');
      }
    }
  };
  return (
    <>
      <div className="grid grid-cols-7 h-screen">

        <div className="col-span-3 flex justify-center items-center h-full relative">

          <div className="w-3/4">
            {tab[0] === false ? null
              : (
                <div className="text-success pb-12">
                  Don’t have an account?
                  <a
                    data-testid="signup"
                    href="/signup"
                    className="text-primary ml-2"
                  >
                    Sign Up!
                  </a>
                </div>
              )}
            <div className="text-3xl font-medium text-secondary">Sign In</div>
            {users.map((user, index) => {
              if (index < 5) {
                return (
                  <div className="w-4/5 mx-auto grid grid-cols-4 py-3 m-2 justify-center items-center justify-items-center gap-2
                  bg-gray-100 text-dark rounded-lg cursor-pointer
                  border-2 border-transparent
                  hover:bg-primary hover:text-white hover:border-primary group"
                  >
                    <div className="h-10 w-10 flex justify-center items-center bg-gray-200 rounded-full group-hover:bg-secondary">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="col-span-2">
                      {user.username}
                    </div>
                    <div className="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full group-hover:bg-secondary">
                      <ChevronRightIcon className="h-5 w-5" onClick={() => { handleSubmit({ username: user.username }); }} />
                    </div>
                  </div>
                );
              }
              return '';
            })}
            <CustomLogin
              ui={ui}
              error={valid}
              login={handleSubmit}
              userlist={users}
              validation={error}
              buttonname="SIGN IN"
            />
            <div />
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-5 bg-white text-black font-bold">
            <a href="/">EN(US)</a>
            <a href="/">ABOUT</a>
            <a href="/">PRIVACY</a>
            <a href="/">TERMS</a>
          </div>
        </div>

        <div className="col-span-4 bg-secondary relative flex flex-col justify-between">

          <div className="my-5 mt-10 flex gap-3 justify-center items-center">
            <LogoIcon
              className="h-5 w-5 text-white group-hover:text-white"
              aria-hidden="true"
            />
            <div className="text-white uppercase font-bold tracking-wider text-2xl">AUTOGRAPHA</div>
            <div className="text-primary font-bold text-3xl">2.0</div>
          </div>

          <div className="flex flex-col justify-center items-center relative">

            <div className="">
              <img width="61" height="56" src="/illustrations/group.svg" alt="" />
            </div>

            <div className="mx-10 md:mx-20 lg:mx-32 text-xl text-white leading-9 relative">
              <div className="absolute top-0 left-0">
                <img height="26" src="/illustrations/quote.svg" alt="" />
              </div>

              <div className="py-10">
                Autographa 2.0 is a completely new way for editing scripture
                and related resources with powerful yet elegant features to
                help you focus on the important things!
              </div>

              {/* <div className="flex pt-5">
                <div className="pr-4">FEATURE</div>
                <img className="" src="/illustrations/green-check.svg" alt="logo" />
              </div> */}
            </div>

            <div className="flex ">
              <div className="">
                <img
                  srcSet="/illustrations/sitting.svg 1200w"
                  src="/illustrations/sitting.svg"
                  alt=""
                />
              </div>
              <div>
                <img
                  width="34"
                  height="33"
                  src="/illustrations/vector-one.svg"
                  alt=""
                />
              </div>
            </div>

          </div>

          <div className="">
            <img
              srcSet="/illustrations/half-moon.svg 1200w"
              src="/illustrations/half-moon.svg"
              alt=""
            />
          </div>

        </div>

      </div>

    </>
  );
}
