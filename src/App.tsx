import React from "react";
import { CalculationExec } from "./components/CalculationExec";
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
          <CalculationExec />
          <CalculationsHistory />
        </CalculationsContextProvider>
      </header>
    </div>
  );
};

export default App;
