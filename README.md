<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="">
    <img src="https://github.com/friendsofagape/autographa/blob/main/resources/agicon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Autographa</h3>

  <p align="center">
    A Bible translation editor for everyone.
    <br />
    ·
    <a href="https://github.com/friendsofagape/autographa/issues">Report Bug</a>
    ·
    <a href="https://github.com/friendsofagape/autographa/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

-   [About the Project](#about-the-project)
    -   [Built With](#built-with)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
-   [Roadmap](#roadmap)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)
-   [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->

## About The Project

This is a standalone desktop application which hopes to aid and be a friendly companion of the Bible Translator. In essence it is a basic USFM editor which is capable of import and export of USFM files. It has handy features like color-coded diffs across imported texts for comparison between revisions, search and replace and export to formatted HTML and autographa will include capabilities for syncing data with online repositories and that this application is licensed differently.

### Built With

-   [ReactJS](https://reactjs.org/)
-   [Electron](https://www.electronjs.org/)
-   [MaterialUI](https://material-ui.com/)

<!-- GETTING STARTED -->

## Getting Started

It is relatively easy to setup the application locally for development.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

-   [Node.js ^16.15.1](https://nodejs.org/en/)
-   [NPM ^8.11.0](https://www.npmjs.com/get-npm)

### Installation

1. Fork and clone this repository
2. Install dependencies with `npm install`
3. Start the application with `npm start`
4. Checkout the web version with `npm run dev`
   Runs the app in the development mode.<br>
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

<!-- ROADMAP -->

## Roadmap

See the [autogrpaha projects](https://github.com/friendsofagape/autographa/projects/1) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

We really value our contributors whether they helped fix a bug, built a feature, tested out the app or contributed in some other way.

The process for submitting pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Create [logs](https://github.com/winstonjs/winston#readme) as you start making changes

```
Logger level:
Production => warn
Development => debug
```

```
Usage: logger.[level]("<filename>, <message>")
```

4. Add nessesary propTypes for all the properties passed to react component (`https://github.com/facebook/prop-types`)
5. After adding features make sure you write test for that using:

-   [Jest](https://testing-library.com/docs/react-testing-library/intro)
-   [React Testing Library](https://jestjs.io/docs/en/getting-started)

6. Run `npm run lint:fix` for code to adapt our linting rules
7. Run `npm run build` for build checks
8. Commit your Changes (`git commit -m 'Add some NewFeatures'`)
9. Push to the Branch (`git push origin feature/NewFeature`)
10. Open a Pull Request and make sure all checks have passed

<!-- LICENSE -->

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/friendsofagape/autographa/blob/main/LICENSE) for more details.

<!-- CONTACT -->

## Contact

Let us know if you face any bugs/problems by opening an [issue](https://github.com/friendsofagape/autographa/issues) on GitHub. We'll do our best to be prompt in our response.

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

-   [Friends of Agape](http://friendsofagape.org/), for their support and contributions.
-   Developed by [Bridgeconn](https://bridgeconn.com/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/friendsofagape/autographa.svg?style=flat-square
[contributors-url]: https://github.com/friendsofagape/autographa/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/friendsofagape/autographa.svg?style=flat-square
[issues-url]: https://github.com/friendsofagape/autographa/issues
[license-shield]: https://img.shields.io/github/license/friendsofagape/autographa.svg?style=flat-square
[license-url]: https://github.com/friendsofagape/autographa/blob/main/LICENSE
