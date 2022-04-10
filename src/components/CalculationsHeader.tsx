import React, { useContext } from "react";
import { CalculationsContext } from "./context/CalculationsContext";

interface CalculationsHeaderProps {}

export const CalculationsHeader: React.FC<CalculationsHeaderProps> = ({}) => {
  const { calculations } = useContext(CalculationsContext);
  return (
    <div>
      <h2>You pefromed {calculations.length} calculations</h2>
    </div>
  );
};
