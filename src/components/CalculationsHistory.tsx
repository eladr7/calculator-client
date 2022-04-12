import React, { useContext } from "react";
import { CALCULATION_ACTIONS } from "./CalculationDefs";
import { CalculationsContext } from "./context/CalculationsContext";

interface CalculationsHistoryProps {}

export const CalculationsHistory: React.FC<CalculationsHistoryProps> = ({}) => {
  const { calculations, dispatch } = useContext(CalculationsContext);
  return (
    <div>
      {calculations.map((calculation) => (
        <div
          key={calculation.id}
          style={{
            display: "flex",
          }}
        >
          <input
            style={{ marginTop: "40px", marginRight: "20px" }}
            type="checkbox"
            onChange={() =>
              dispatch({
                type: CALCULATION_ACTIONS.REMOVE,
                calculation: {
                  id: calculation.id,
                  calculation: calculation.calculation,
                },
              })
            }
          />
          <p>Your calculation is: {calculation.calculation}</p>
        </div>
      ))}
    </div>
  );
};
