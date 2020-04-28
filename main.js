/*
 * TRICKY: this root main.js is used by electron to attach to the development
 * server. e.g. with `yarn start`.
 * The main.js inside the `public/` folder is used by electron after building.
 */
require('./public/electron');
