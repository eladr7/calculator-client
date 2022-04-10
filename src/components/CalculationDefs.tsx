export const CALCULATION_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};

export const CALCULATION_TYPES = {
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  SQRT: "√",
};

export interface Calculation {
  id?: number;
  calculation: string;
}
