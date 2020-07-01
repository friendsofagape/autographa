import React from "react";
import Main from "./components/main";
import SetupContextProvider from "./contexts/SetupContext";

function App() {
  return (
    <SetupContextProvider>
      <Main />
    </SetupContextProvider>
  );
}

export default App;
