import React from "react";
import Main from "./components/main";
import SetupContextProvider from "./contexts/SetupContext";
import SettingContextProvider from "./contexts/SettingContext";

function App() {
  return (
    <SetupContextProvider>
      <SettingContextProvider>
        <Main />
      </SettingContextProvider>
    </SetupContextProvider>
  );
}

export default App;
