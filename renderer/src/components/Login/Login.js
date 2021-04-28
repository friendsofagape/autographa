import React, { useEffect } from 'react';
import 'tailwindcss/tailwind.css';

// import * as localForage from 'localforage';
import { useRouter } from 'next/router';
import * as logger from '../../logger';
import { isElectron } from '../../core/handleElectron';
import CustomLogin from './CustomLogin';
import { AuthenticationContext } from './AuthenticationContextProvider';

// import { createUser, handleLogin } from '../../core/handleLogin';

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
  const tab = React.useState(!!isElectron());
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = React.useState([]);
  const {
    states: { config },
    // action: { generateToken, getConfig },
  } = React.useContext(AuthenticationContext);
  const [tabvalue, setTabValue] = React.useState(0);
  const [ui, setUi] = React.useState(isElectron() ? offline : online);
  const [valid, setValid] = React.useState({
    username: false,
    password: false,
  });
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
  // useEffect(() => {
  //   if (users.length === 0) {
  //     localForage.getItem('users').then((user) => {
  //       if (user) {
  //         setUsers(user);
  //       }
  //     });
  //   }
  // }, [users]);
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
    logger.debug('Login.js', 'In handleSubmit');
    if (isElectron() && tabvalue === 0) {
      router.push('/main');
      // The below code is commented for UI dev purpose.
      // if (handleValidation(values)) {
      //   const fs = window.require('fs');
      //   logger.debug('Login.js',
      // 'Triggers handleLogin to check whether the user is existing or not');
      //   const user = handleLogin(users, values);
      //   if (user) {
      //     logger.debug('Login.js',
      // 'Triggers generateToken to generate a Token for the user');
      //     generateToken(user);
      //   } else {
      //     logger.debug('Login.js', 'Triggers createUser for creating a new user');
      //     createUser(values, fs)
      //       .then((val) => {
      //         logger.debug('Login.js',
      // 'Triggers generateToken to generate a Token for the user');
      //         generateToken(val);
      //       });
      //   }
      // }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isElectron()) {
        router.push('/main');
        // const requestOptions = {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: document.aglogin,
        // };
        // fetch(config?.action, requestOptions)
        //   .then((response) => response.json())
        //   .then((data) => console.log(data));
      } else {
        router.push('/main');
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
      }
      // router.push('/login');
    }
  };
  return (
    <>
      <div>
        <div className="inline-block min-h-screen  bg-white w-5/12">
          <div className="ml-10 2xl:ml-40 mt-32">
            <div className="text-green-500 pb-12">
              Don’t have an account?
              <a
                data-testid="signup"
                href="/signup"
                className="text-blue-600 ml-2"
              >
                Sign Up!
              </a>
            </div>
            <div className="text-3xl font-medium text-black"> Welcome!</div>
            <div className="text-lg
            font-light
            pb-14 text-gray-400"
            >
              Welcome back! Login to access Autographa
            </div>
            <CustomLogin
              ui={ui}
              error={valid}
              login={handleSubmit}
              userlist={users}
              validation={error}
            />
            <div />
          </div>
          <div className="2xl:ml-40 pt-72 2xl:pl-5 pl-14 space-x-14 sm:space-y-2
          text-black font-bold"
          >
            <a href="/">EN(US)</a>
            <a href="/">ABOUT</a>
            <a href="/">PRIVACY</a>
            <a href="/">TERMS</a>
          </div>
        </div>
        <div className="absolute
        inline-block bg-black min-h-screen w-7/12 pt-8 pl-40 pr-40"
        >
          <div className="grid grid-rows-1 justify-items-center relative">
            <div className="justify-center">
              <div className="flex gap-3 ">
                <img src="/Logo.svg" alt="logo" />
                <div className="text-white">AUTOGRAPHA</div>
                <div className="text-blue-800 font-bold">2.0</div>
              </div>
              <div className="pt-8 pl-72">
                <img src="/Group.svg" alt="Group" />
              </div>
              <div className="w-96 pt-16 mb-10 text-xl text-white leading-9">
                <div className="pb-5">
                  <img src="/Quote.svg" alt="quote" />
                </div>

                Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Consectetur
                viverra facilisis platea malesuada faucibus justo.
                Donec sit amet diam, in. Arcu, felis sed tempor orci,
                pretium velit amet. Nullam amet, in justo a auctor sem felis.

                <div className="flex pt-5">
                  <div className="pr-4">FEATURE</div>
                  <img className="" src="/GreenCheck.svg" alt="logo" />
                </div>
              </div>
              <div className="flex pb-20">
                <div className="pl-24">
                  <img className="w-56 h-80" src="/Sitting.svg" alt="Sitting" />
                </div>
                <div>
                  <img className="pl-10" src="/VectorOne.svg" alt="VectorOne" />
                </div>
              </div>
            </div>
          </div>
          <div className=" bottom-0 pt-10 absolute left-5">
            <img src="/HalfMoon.svg" alt="logo" />
          </div>
        </div>
      </div>
    </>
  );
}
