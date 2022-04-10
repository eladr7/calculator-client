import React from "react";
import { Calculation } from "./components/Calculation";
import { CalculationsHeader } from "./components/CalculationsHeader";
import { CalculationsContextProvider } from "./components/context/CalculationsContext";
import { CalculationsHistory } from "./components/CalculationsHistory";

interface AppProps {}
const App: React.FC<AppProps> = ({}) => {
  return (
    <div className="App">
      <header className="App-header">
        <CalculationsContextProvider>
          <CalculationsHeader />
          <Calculation />
          <CalculationsHistory />
        </CalculationsContextProvider>
      </header>
    </div>
  );
};

export default App;
