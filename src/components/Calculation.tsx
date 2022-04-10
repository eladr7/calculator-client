import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { CALCULATION_ACTIONS, CALCULATION_TYPES } from "./CalculationDefs";
import { CalculationsContext } from "./context/CalculationsContext";

interface CalculationProps {}

export const Calculation: React.FC<CalculationProps> = ({}) => {
  const { dispatch } = useContext(CalculationsContext);
  const [selectedOperation, setValue] = useState<string>(CALCULATION_TYPES.ADD);
  const [n1, setN1] = useState<string | undefined>(undefined);
  const [n2, setN2] = useState<string | undefined>(undefined);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };
  const operationPicker = () => {
    return (
      <div>
        <label>
          Choose an arithmetic operation
          <select value={selectedOperation} onChange={handleChange}>
            <option value={CALCULATION_TYPES.ADD}>Add</option>
            <option value={CALCULATION_TYPES.SUBTRACT}>Subtract</option>
            <option value={CALCULATION_TYPES.MULTIPLY}>Multiply</option>
            <option value={CALCULATION_TYPES.DIVIDE}>Divide</option>
            <option value={CALCULATION_TYPES.SQRT}>Square root</option>
          </select>
        </label>

        <p>Ok, perform: {selectedOperation}!</p>
      </div>
    );
  };

  //   const getCalculationFromContract = async (    selectedOperation: string,
  //     n1: string,
  //     n2: string | undefined) => {
  //         const calculationMsg = ;
  //         await calculationMsg()
  //     }

  const calculateResult = async (
    selectedOperation: string,
    n1: string,
    n2: string | undefined
  ) => {
    let result = "4";
    // let result = await getCalculationFromContract(selectedOperation, n1, n2);
    let calculationResult: string;
    if (selectedOperation !== CALCULATION_TYPES.SQRT) {
      calculationResult =
        n1 + " " + selectedOperation + " " + n2 + " = " + result;
    } else {
      calculationResult = CALCULATION_TYPES.SQRT + " " + n1 + " = " + result;
    }

    return calculationResult;
  };

  const performCalculation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !selectedOperation ||
      !n1 ||
      (!n2 && selectedOperation !== CALCULATION_TYPES.SQRT)
    )
      return;

    const calculation = await calculateResult(selectedOperation, n1, n2);
    if (calculation) {
      dispatch({
        type: CALCULATION_ACTIONS.ADD,
        calculation: {
          calculation,
        },
      });

      setN1("");
      setN2("");
    }
  };
  return (
    <form action="" onSubmit={performCalculation}>
      {operationPicker()}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input type="text" value={n1} onChange={(e) => setN1(e.target.value)} />
        {selectedOperation !== CALCULATION_TYPES.SQRT && (
          <input
            type="text"
            value={n2}
            onChange={(e) => setN2(e.target.value)}
          />
        )}
      </div>
      <input type="submit" value="Calculate!" />
    </form>
  );
};
