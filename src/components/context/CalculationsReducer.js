import { v4 as uuidv4 } from "uuid";
import { CALCULATION_ACTIONS } from "../CalculationDefs";

export const CalculationsReducer = (state, action) => {
  switch (action.type) {
    case CALCULATION_ACTIONS.ADD:
      return [
        ...state,
        {
          calculation: action.calculation.calculation,
          id: uuidv4(),
        },
      ];
    case CALCULATION_ACTIONS.REMOVE:
      return state.filter(
        (calculation) => calculation.id !== action.calculation.id
      );
    default:
      return state;
  }
};
