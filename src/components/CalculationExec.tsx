import React, { FormEvent, useContext, useEffect, useState } from "react";
import {
  CalculationType,
  CALCULATION_ACTIONS,
  CALCULATION_TYPES,
  SUCCESS_STATUS,
} from "./CalculationDefs";
import { CalculationsContext } from "./context/CalculationsContext";
import { fromUtf8, SecretNetworkClient, Wallet } from "secretjs";

declare global {
  interface Window {
    keplr: any;
    getOfflineSignerOnlyAmino: any;
    getEnigmaUtils: any;
  }
}

type CalculationResult = {
  calculation_result: {
    n: string;
    status: string;
  };
};

var secretjs: any;
const ACCOUNT_ADDRESS = "secret12ry9nf03e3dj54s7rukh08jwk25nuv0p2npfxj";
const CONTRACT_ADDRESS = "secret19lqqp5vsaqj99vn5n7y4zntllqqj97evz4je9y";
const MNEMONIC =
  "leave mask dinner title adult satisfy track crumble test concert damp bracket eager turtle laptop actual lesson divert hub behave risk write daughter tuition";
const CHAIN_ID = "pulsar-2";
const NODE_URL = "http://rpc.pulsar.griptapejs.com:9091/";

interface CalculationExecProps {}
export const CalculationExec: React.FC<CalculationExecProps> = ({}) => {
  const { dispatch } = useContext(CalculationsContext);
  const [selectedOperationIndex, setSelectedOperationIndex] =
    useState<number>(0);
  const [n1, setN1] = useState<string | undefined>(undefined);
  const [n2, setN2] = useState<string | undefined>(undefined);

  function isSqrt() {
    return selectedOperationIndex === 4;
  }

  useEffect(() => {
    setupSecretClient();
  }, []);

  const setupSecretClient = async () => {
    initializeSecretClient();
  };

  const initializeSecretClient = async () => {
    const wallet = new Wallet(MNEMONIC);
    const myAddress = wallet.address;

    secretjs = await SecretNetworkClient.create({
      grpcWebUrl: NODE_URL,
      chainId: CHAIN_ID,
      wallet: wallet,
      walletAddress: myAddress,
    });
  };

  const operationPicker = () => {
    return (
      <div>
        <label>
          Choose an arithmetic operation
          <select
            value={selectedOperationIndex}
            onChange={(e) =>
              setSelectedOperationIndex(parseInt(e.target.value))
            }
            style={{ marginLeft: "20px" }}
          >
            {CALCULATION_TYPES.map(
              (calculationType: CalculationType, idx: number) => (
                <option value={idx}>{calculationType.operationName}</option>
              )
            )}
          </select>
        </label>

        <p>
          Perform: {CALCULATION_TYPES[selectedOperationIndex].operationName}!
        </p>
      </div>
    );
  };

  const calculationInput = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input type="text" value={n1} onChange={(e) => setN1(e.target.value)} />
        {!isSqrt() && (
          <input
            type="text"
            value={n2}
            onChange={(e) => setN2(e.target.value)}
          />
        )}
      </div>
    );
  };

  const calculateResult = async (
    selectedOperationIndex: number,
    n1: string,
    n2: string | undefined
  ) => {
    const inputParams = !isSqrt() ? [n1, n2] : n1;

    const result: any = await secretjs.tx.compute.executeContract(
      {
        sender: ACCOUNT_ADDRESS,
        contractAddress: CONTRACT_ADDRESS,
        // codeHash: CONTRACT_CODE_HASH, // optional but way faster
        msg: {
          [CALCULATION_TYPES[selectedOperationIndex].operationExecutionName]:
            inputParams,
        },
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
    const {
      calculation_result: { n, status },
    } = JSON.parse(fromUtf8(result.data[0])) as CalculationResult;

    if (status !== SUCCESS_STATUS) {
      alert(status);
      return "";
    }

    const calculation = isSqrt()
      ? CALCULATION_TYPES[selectedOperationIndex].annotation + n1 + " = " + n
      : n1 +
        " " +
        CALCULATION_TYPES[selectedOperationIndex].annotation +
        " " +
        n2 +
        " = " +
        n;
    return calculation;
  };

  const performCalculation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!n1 || (!n2 && !isSqrt())) return;

    const calculation = await await calculateResult(
      selectedOperationIndex,
      n1,
      n2
    );
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
      {calculationInput()}
      <input type="submit" value="Calculate!" />
    </form>
  );
};
