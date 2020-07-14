import React from "react";
import Main from "./components/main";
import SetupContextProvider from "./contexts/SetupContext";
import SettingContextProvider from "./contexts/SettingContext";
import NavigationContextProvider from "./contexts/NavigationContext";

function App() {
  return (
    <SetupContextProvider>
      <SettingContextProvider>
        <NavigationContextProvider>
          <Main />
        </NavigationContextProvider>
      </SettingContextProvider>
    </SetupContextProvider>
  );
}

export default App;
