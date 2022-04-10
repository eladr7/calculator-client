import React, { createContext, useEffect, useReducer } from "react";
import { Calculation } from "../CalculationDefs";
import { CalculationsReducer } from "./CalculationsReducer";

interface IContextProps {
  calculations: Calculation[];
  dispatch: ({
    type,
    calculation,
  }: {
    type: string;
    calculation: Calculation;
  }) => void;
}

export const CalculationsContext = createContext({} as IContextProps);

interface CalculationsContextProps {}
export const CalculationsContextProvider: React.FC<CalculationsContextProps> = (
  props
) => {
  const [calculations, dispatch] = useReducer(CalculationsReducer, [], () => {
    const fromStore = localStorage.getItem("calculations");
    return fromStore ? JSON.parse(fromStore) : [];
  });

  useEffect(() => {
    // localStorage.setItem('calculations', '');
    localStorage.setItem("calculations", JSON.stringify(calculations));
  }, [calculations]);

  return (
    <CalculationsContext.Provider value={{ calculations, dispatch }}>
      {props.children}
    </CalculationsContext.Provider>
  );
};
