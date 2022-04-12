import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { CALCULATION_ACTIONS, CALCULATION_TYPES } from "./CalculationDefs";
import { CalculationsContext } from "./context/CalculationsContext";
import { SecretNetworkClient, Wallet } from "secretjs";

type Result = {
  status: string;
  history: string[];
};

var secretjs: any;
const ACCOUNT_NAME = "eladScrt";
const ACCOUNT_ADDRESS = "secret12ry9nf03e3dj54s7rukh08jwk25nuv0p2npfxj";
const CONTRACT_ADDRESS = "secret19lqqp5vsaqj99vn5n7y4zntllqqj97evz4je9y";
const CONTRACT_CODE_HASH = "";
const VIEWING_KEY = "api_key_hVt0Na21/vWoHRIklr6t0TxRq1YFLSZpvb2IZqpf7aI=";
const MNEMONIC =
  "leave mask dinner title adult satisfy track crumble test concert damp bracket eager turtle laptop actual lesson divert hub behave risk write daughter tuition";

const initializeSecretClient = async () => {
  debugger;
  const wallet = new Wallet(MNEMONIC);
  const myAddress = wallet.address;

  secretjs = await SecretNetworkClient.create({
    grpcWebUrl: "http://20.127.18.96:26657",
    chainId: "pulsar-2",
    wallet: wallet,
    walletAddress: myAddress,
  });
};

interface CalculationExecProps {}
export const CalculationExec: React.FC<CalculationExecProps> = ({}) => {
  useEffect(() => {
    initializeSecretClient();
  }, []);
  const { dispatch } = useContext(CalculationsContext);
  const [selectedOperation, setValue] = useState<string>(CALCULATION_TYPES.ADD);
  const [n1, setN1] = useState<string | undefined>(undefined);
  const [n2, setN2] = useState<string | undefined>(undefined);

  const operationPicker = () => {
    return (
      <div>
        <label>
          Choose an arithmetic operation
          <select
            value={selectedOperation}
            onChange={(e) => setValue(e.target.value)}
            style={{ marginLeft: "20px" }}
          >
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

  const calculationInput = () => {
    return (
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
    );
  };

  const calculateResult = async (
    selectedOperation: string,
    n1: string,
    n2: string | undefined
  ) => {
    const inputParams =
      selectedOperation !== CALCULATION_TYPES.SQRT ? [n1, n2] : n1;

    debugger;
    await secretjs.tx.compute.executeContract(
      {
        sender: ACCOUNT_ADDRESS,
        contractAddress: CONTRACT_ADDRESS,
        codeHash: CONTRACT_CODE_HASH, // optional but way faster
        msg: { [selectedOperation]: inputParams },
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
    debugger;
    const result = (await secretjs.query.compute.queryContract({
      address: CONTRACT_ADDRESS,
      codeHash: CONTRACT_CODE_HASH,
      query: {
        get_history: {
          address: ACCOUNT_ADDRESS,
          key: VIEWING_KEY,
          page_size: 1,
        },
      },
    })) as Result;

    return result.history[0];
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
      {calculationInput()}
      <input type="submit" value="Calculate!" />
    </form>
  );
};
