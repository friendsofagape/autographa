// import React, { useContext } from "react";
// import {
//   AuthenticationContext,
//   AuthenticationContextProvider,
//   RepositoryContext,
//   RepositoryContextProvider,
//   FileContext,
//   FileContextProvider,
// } from "gitea-react-toolkit";

// function Component() {
//   const { state: auth, component: authComponent } = useContext(
//     AuthenticationContext
//   );
//   const { state: repo, component: repoComponent } = useContext(
//     RepositoryContext
//   );
//   const {
//     state: file,
//     actions: fileActions,
//     component: fileComponent,
//   } = useContext(FileContext);
//   // the following are all the actions available for the file context.
//   const { read } = fileActions;
//   //   const { update, read, load, save, close, dangerouslyDelete } = fileActions;
//   console.log("repo", repo, read());
//   console.log("file", file);
//   return (
//     (!auth && authComponent) ||
//     (!repo && repoComponent) ||
//     (!file && fileComponent) || <pre>{JSON.stringify(file, null, 2)}</pre>
//   );
// }
// const Gitea = () => {
//   const [authentication, setAuthentication] = React.useState();
//   const [repository, setRepository] = React.useState();
//   const [filepath, setFilepath] = React.useState();

//   return (
//     <AuthenticationContextProvider
//       config={{
//         server: "https://git.door43.org",
//         tokenid: "Gitea AG Testing",
//       }}
//       authentication={authentication}
//       onAuthentication={setAuthentication}
//     >
//       <RepositoryContextProvider
//         repository={repository}
//         onRepository={setRepository}
//         defaultOwner={authentication && authentication.user.name}
//         defaultQuery=""
//         // branch='master'
//       >
//         <FileContextProvider
//           filepath={filepath}
//           onFilepath={setFilepath}
//           create={false}
//         >
//           <Component />
//         </FileContextProvider>
//       </RepositoryContextProvider>
//     </AuthenticationContextProvider>
//   );
// };
// export default Gitea;
