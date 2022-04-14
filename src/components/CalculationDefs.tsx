export const CALCULATION_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};

export type CalculationType = {
  operationName: string;
  operationExecutionName: string;
  annotation: string;
};

export const CALCULATION_TYPES: CalculationType[] = [
  {
    operationName: "Add",
    operationExecutionName: "add",
    annotation: "+",
  },
  {
    operationName: "Subtract",
    operationExecutionName: "sub",
    annotation: "-",
  },
  {
    operationName: "Multiply",
    operationExecutionName: "mul",
    annotation: "*",
  },
  {
    operationName: "Divide",
    operationExecutionName: "div",
    annotation: "/",
  },
  {
    operationName: "Square Root",
    operationExecutionName: "sqrt",
    annotation: "√",
  },
];
export interface Calculation {
  id?: number;
  calculation: string;
}

export const SUCCESS_STATUS: string = "Calculation performed and recorded!";
