import { providers, ethers, Contract } from "ethers";
import { config } from "dotenv";
import { OracleABI, OracleABI__factory } from "./contracts";
config();

const contracts: string[] = [];

const provider = new providers.JsonRpcProvider(process.env.RPC_URL);
contracts.map((address) => {
  const contract = OracleABI__factory.connect(address, provider);

  contract.on(
    "OracleRequest",
    (
      specId,
      requester,
      requestId,
      payment,
      callbackAddr,
      callbackFunctionId,
      cancelExpiration,
      dataVersion,
      data
    ) => {
      runLambda(address, {
        specId,
        requester,
        requestId,
        payment,
        callbackAddr,
        callbackFunctionId,
        cancelExpiration,
        dataVersion,
        data,
      });
    }
  );
});
