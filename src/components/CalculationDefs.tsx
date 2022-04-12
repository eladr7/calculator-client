export const CALCULATION_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};

export const CALCULATION_TYPES = {
  ADD: "add",
  SUBTRACT: "sub",
  MULTIPLY: "mul",
  DIVIDE: "div",
  SQRT: "sqrt",
};

export interface Calculation {
  id?: number;
  calculation: string;
}
