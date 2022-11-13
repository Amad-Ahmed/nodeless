import { FC, Fragment } from "react";
import polygon from "./assets/polygon-matic.svg";
import avalanche from "./assets/avalanche-avax-logo.svg";
import bnb from "./assets/bnb-bnb-logo.svg";
import eth from "./assets/ethereum-eth-logo.svg";
import fantom from "./assets/fantom-ftm-logo.svg";
import harmony from "./assets/harmony-one-logo.svg";
import klaytn from "./assets/klaytn-klay-logo.svg";
import rsk from "./assets/rsk-infrastructure-framework-rif-logo.svg";
export const chainSvgs: Record<
  string,
  { name: string; svg: string; testnet: boolean; blockExplorer: string }
> = {
  "0x13881": {
    name: "Polygon Mumbai Testnet",
    svg: polygon,
    testnet: true,
    blockExplorer: "https://mumbai.polygonscan.com/address/",
  },
  "0xA869": {
    name: "Avalanche Fuji Testnet",
    svg: avalanche,
    testnet: true,
    blockExplorer: "https://testnet.snowtrace.io/address/",
  },
  "0x38": {
    name: "Binance Smart Chain",
    svg: bnb,
    testnet: false,
    blockExplorer: "https://bscscan.com/address/",
  },
  "0x01": {
    name: "Ethereum Mainnet",
    svg: eth,
    testnet: false,
    blockExplorer: "https://etherscan.io/address/",
  },
  "0xFA": {
    name: "Fantom",
    svg: fantom,
    testnet: false,
    blockExplorer: "https://ftmscan.com/address/",
  },
  "0x63564C40": {
    name: "Harmony",
    svg: harmony,
    testnet: false,
    blockExplorer: "https://explorer.harmony.one/address/",
  },
  "0xA86A": {
    name: "Avalanche",
    svg: avalanche,
    testnet: false,
    blockExplorer: "https://snowtrace.io/address/",
  },
  "0x89": {
    name: "Polygon",
    svg: polygon,
    testnet: false,
    blockExplorer: "https://polygonscan.com/address/",
  },
  "0x05": {
    name: "Ethereum Goerli Testnet",
    svg: eth,
    testnet: true,
    blockExplorer: "https://goerli.etherscan.io/address/",
  },
};

export const ChainLogo: FC<{
  chainId: string;
  chainName?: string;
}> = ({ chainId, chainName }) => {
  const source = chainSvgs[chainId];
  return (
    <Fragment>
      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
        {source ? (
          <img
            className="m-2 h-6 w-6 rounded-full"
            src={source.svg}
            title={source.name}
            alt={source.name}
          />
        ) : (
          chainId
        )}
        {source.testnet && (
          <div className="absolute flex items-center p-1 pt-1.5 ml-5 mt-5 h-4 w-4 text-sm font-bold text-red-500 bg-blue-800  rounded-full">
            <div>T</div>
          </div>
        )}
      </div>
      {/* */}
    </Fragment>
  );
};
export const TinyChainLogo: FC<{
  chainId: string;
  chainName?: string;
}> = ({ chainId, chainName }) => {
  const source = chainSvgs[chainId];
  console.log("Got from chainid", chainId, source);
  return (
    <Fragment>
      <div className="h-5-w-5 rounded-full bg-gray-100 flex items-center justify-center">
        {source ? (
          <img
            className="m-1 h-3 w-3 rounded-full"
            src={source.svg}
            title={source.name}
            alt={source.name}
          />
        ) : (
          chainId
        )}
      </div>
      {/* */}
    </Fragment>
  );
};
