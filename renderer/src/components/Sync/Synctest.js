// import React from 'react';
// import { render, fireEvent,screen } from '@testing-library/react';
// // import { act } from 'react-dom/test-utils';
// import ProjectFileBrowser from './ProjectFileBrowser';
// import SyncContextProvider from './SyncContextProvider'
// // import intl from "./helper";

// describe('Sync component tests', () => {
//   const agProjects = ['Project Malayalam','Project Arabic']
//   //   {
//   //     project: 'Project Malayalam',
//   //     files: ['Gen.usfm', 'Exo.usfm', 'Readme.md'],
//   //   },
//   //   {
//   //     project: 'Project Arabic',
//   //     files: [
//   //       'Lev.usfm',
//   //       'Psa.usfm',
//   //       'Isa.usfm',
//   //       'Mat.usfm',
//   //       'Luk.usfm',
//   //       'Tit.usfm',
//   //     ],
//   //   },
//   //   {
//   //     project: 'Project English',
//   //     files: ['Mat.usfm', 'Luk.usfm', 'Tit.usfm'],
//   //   },
//   //   {
//   //     project: 'Project Urdu',
//   //     files: [],
//   //   },
//   // ];

//   describe('Autographa projects file browser.', () => {
//     test('ProjectFileBrowser component renders without error', () => {
//       render(
//         <SyncContextProvider>
//           <ProjectFileBrowser />
//         </SyncContextProvider>
//       );
//     });
//     test('Should have stepper', async () => {
//       render(
//         <SyncContextProvider>
//           <ProjectFileBrowser />
//         </SyncContextProvider>
//         );
//       const stepper = screen.getByTestId('ag-step1');
//       expect(stepper).toBeVisible();
//     });
//     test('Should have table', async () => {
//       render(
//         <SyncContextProvider>
//           <ProjectFileBrowser />
//         </SyncContextProvider>
//         );
//       const table = screen.getByTestId('table');
//       expect(table).toBeVisible();
//     });
//     test('First column of table should be Name', async () => {
//       render(
//         <SyncContextProvider>
//           <ProjectFileBrowser />
//         </SyncContextProvider>
//         );
//       const thName = screen.getByTestId('th-name');
//       expect(thName).toBeVisible();
//     });
//   });
//   //   test('Project Arabic should have 6 files', async () => {
//   //     render(<Sync projects={projects} />);
//   //     const agFiles = document.querySelector('#project-id');
//   //     await act(async () => {
//   //       fireEvent.change(agFiles, { target: { index: 1 } });
//   //     });
//   //     expect(projects[agFiles.index].files.length).toBe(6);
//   //   });
//   // });
// });
