import React, { FormEvent, useContext, useEffect, useState } from "react";
import {
  CalculationType,
  CALCULATION_ACTIONS,
  CALCULATION_TYPES,
  SUCCESS_STATUS,
} from "./CalculationDefs";
import { CalculationsContext } from "./context/CalculationsContext";
import { fromUtf8, SecretNetworkClient } from "secretjs";

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

const CONTRACT_ADDRESS = "secret13ut7y0jzgjsh6qn3hrn6t2lspezxpr3tjptdn8";
const CODE_ID = 460;

// This endpoint is a reverse proxy for a main-net scrt node
const NODE_URL = "https://elad.uksouth.cloudapp.azure.com";
const CHAIN_ID = "secret-4";

var secretjs: any;
interface CalculationExecProps {}
export const CalculationExec: React.FC<CalculationExecProps> = ({}) => {
  const { dispatch } = useContext(CalculationsContext);
  const [keplrReady, setKeplrReady] = useState<boolean>(false);

  const [n1, setN1] = useState<string | undefined>(undefined);
  const [n2, setN2] = useState<string | undefined>(undefined);

  const [selectedOperationIndex, setSelectedOperationIndex] =
    useState<number>(0);
  const isSqrt = () => {
    return selectedOperationIndex === 4;
  };

  useEffect(() => {
    setupSecretClient();
  }, []);

  const setupSecretClient = async () => {
    await setupKeplr();
  };

  const setupKeplr = async () => {
    const sleep = (ms: number) =>
      new Promise((accept) => setTimeout(accept, ms));

    // Wait for Keplr to be injected to the page
    while (
      !window.keplr ||
      !window.getOfflineSignerOnlyAmino ||
      !window.getEnigmaUtils
    ) {
      await sleep(10);
    }

    // Enable Keplr.
    // This pops-up a window for the user to allow keplr access to the webpage.
    await window.keplr.enable(CHAIN_ID);

    const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
    const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

    secretjs = await SecretNetworkClient.create({
      grpcWebUrl: NODE_URL,
      chainId: CHAIN_ID,
      wallet: keplrOfflineSigner,
      walletAddress: myAddress,
      encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
    });

    setKeplrReady(true);
  };

  const operationPicker = () => {
    return (
      <div style={{ marginBottom: "30px" }}>
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

    const contractHash = await secretjs.query.compute.codeHash(CODE_ID);
    const result: any = (await secretjs.tx.compute.executeContract(
      {
        sender: secretjs.address,
        contractAddress: CONTRACT_ADDRESS,
        codeHash: contractHash, // optional but way faster
        msg: {
          [CALCULATION_TYPES[selectedOperationIndex].operationExecutionName]:
            inputParams,
        },
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    )) as CalculationResult;

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

  if (!keplrReady) {
    return (
      <>
        <h1>Waiting for Keplr wallet integration...</h1>
      </>
    );
  }

  return (
    <form action="" onSubmit={performCalculation}>
      {operationPicker()}
      {calculationInput()}
      <input
        type="submit"
        value={`Calculate: ${CALCULATION_TYPES[selectedOperationIndex].operationName}`}
      />
    </form>
  );
};
