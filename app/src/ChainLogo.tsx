import { FC, Fragment } from "react";
import polygon from "./assets/polygon-matic.svg";
import avalanche from "./assets/avalanche-avax-logo.svg";
import bnb from "./assets/bnb-bnb-logo.svg";
import eth from "./assets/ethereum-eth-logo.svg";
import fantom from "./assets/fantom-ftm-logo.svg";
import harmony from "./assets/harmony-one-logo.svg";
import optimism from "./assets/optimism-ethereum-op-logo.svg";
import rsk from "./assets/rsk-infrastructure-framework-rif-logo.svg";
import klaytn from "./assets/klaytn-klay-logo.svg";
import gnosis from "./assets/gnosis-gno-gno-logo.svg";
import arbitrum from "./assets/arbitrum-logo.png";
// import rsk from "./assets/rsk-infrastructure-framework-rif-logo.svg";
export const chainSvgs: Record<
  string,
  {
    name: string;
    svg: string;
    testnet: boolean;
    blockExplorer?: string;
    transactionExplorer?: string;
    tokenAddress?: string;
  }
> = {
  "0x13881": {
    name: "Polygon Mumbai Testnet",
    svg: polygon,
    testnet: true,
    blockExplorer: "https://mumbai.polygonscan.com/address/",
    transactionExplorer: "https://mumbai.polygonscan.com/tx/",
    tokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  },
  "0xa869": {
    name: "Avalanche Fuji Testnet",
    svg: avalanche,
    testnet: true,
    blockExplorer: "https://testnet.snowtrace.io/address/",
    transactionExplorer: "https://testnet.snowtrace.io/tx/",
    tokenAddress: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  },
  "0x38": {
    name: "Binance Smart Chain",
    svg: bnb,
    testnet: false,
    blockExplorer: "https://bscscan.com/address/",
    transactionExplorer: "https://bscscan.com/tx/",
    tokenAddress: "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
  },
  "0x1": {
    name: "Ethereum Mainnet",
    svg: eth,
    testnet: false,
    blockExplorer: "https://etherscan.io/address/",
    transactionExplorer: "https://etherscan.io/tx/",
    tokenAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  },
  "0xfa": {
    name: "Fantom Mainnet",
    svg: fantom,
    testnet: false,
    blockExplorer: "https://ftmscan.com/address/",
    transactionExplorer: "https://ftmscan.com/tx/",
    tokenAddress: "0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
  },
  "0x63564c40": {
    name: "Harmony Mainnet",
    svg: harmony,
    testnet: false,
    blockExplorer: "https://explorer.harmony.one/address/",
    transactionExplorer: "https://explorer.harmony.one/tx/",
    tokenAddress: "0x218532a12a389a4a92fC0C5Fb22901D1c19198aA",
  },
  "0xa86a": {
    name: "Avalanche Mainnet",
    svg: avalanche,
    testnet: false,
    blockExplorer: "https://snowtrace.io/address/",
    transactionExplorer: "https://snowtrace.io/tx/",
    tokenAddress: "0x5947BB275c521040051D82396192181b413227A3",
  },
  "0x89": {
    name: "Polygon Mainnet",
    svg: polygon,
    testnet: false,
    blockExplorer: "https://polygonscan.com/address/",
    transactionExplorer: "https://polygonscan.com/tx/",
    tokenAddress: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
  },
  "0x5": {
    name: "Ethereum Goerli Testnet",
    svg: eth,
    testnet: true,
    blockExplorer: "https://goerli.etherscan.io/address/",
    transactionExplorer: "https://goerli.etherscan.io/tx/",
    tokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  },
  "0x61": {
    name: "Binance Smart Chain Testnet",
    svg: bnb,
    testnet: true,
    blockExplorer: "https://testnet.bscscan.com/address/",
    transactionExplorer: "https://testnet.bscscan.com/tx/",
    tokenAddress: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
  },
  "0x1e": {
    name: "RSK mainnet",
    svg: rsk,
    testnet: false,
    blockExplorer: "https://explorer.rsk.co/address/",
    transactionExplorer: "https://explorer.rsk.co/tx/",
    tokenAddress: "0x14ADAE34beF7Ca957ce2DDe5AdD97EA050123827",
  },
  "0x64": {
    name: "Gnosis chain mainnet",
    svg: gnosis,
    testnet: false,
    blockExplorer: "https://gnosisscan.io/address/",
    transactionExplorer: "https://gnosisscan.io/tx/",
    tokenAddress: "0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2",
  },
  "0xfa2": {
    name: "Fantom testnet",
    svg: fantom,
    testnet: true,
    blockExplorer: "https://testnet.ftmscan.com/address/",
    transactionExplorer: "https://testnet.ftmscan.com/tx/",
    tokenAddress: "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
  },
  "0xa4b1": {
    name: "Arbitrum Mainnet",
    svg: arbitrum,
    testnet: false,
    blockExplorer: "https://arbiscan.io/address/",
    transactionExplorer: "https://arbiscan.io/tx/",
    tokenAddress: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
  },
  "0x66eed": {
    name: "Arbitrum Goerli Testnet",
    svg: arbitrum,
    testnet: true,
    blockExplorer: "https://goerli.arbiscan.io/address/",
    transactionExplorer: "https://goerli.arbiscan.io/tx/",
    tokenAddress: "0xd14838a68e8afbade5efb411d5871ea0011afd28",
  },
  "0x80": {
    name: "Heco Mainnet",
    svg: bnb,
    testnet: false,
    blockExplorer: "https://www.hecoinfo.com/en-us/address/",
    transactionExplorer: "https://www.hecoinfo.com/en-us/tx/",
    tokenAddress: "0x9e004545c59D359F6B7BFB06a26390b087717b42",
  },
  "0xa": {
    name: "Optimism Mainnet",
    svg: optimism,
    testnet: false,
    blockExplorer: "https://optimistic.etherscan.io/address/",
    transactionExplorer: "https://optimistic.etherscan.io/tx/",
    tokenAddress: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
  },
  "0x1a4": {
    name: "Optimism Goerli Testnet",
    svg: optimism,
    testnet: true,
    blockExplorer: "https://goerli-optimism.etherscan.io/address/",
    transactionExplorer: "https://goerli-optimism.etherscan.io/tx/",
    tokenAddress: "0xdc2CC710e42857672E7907CF474a69B63B93089f",
  },
  "0x505": {
    name: "Moonriver Mainnet",
    svg: bnb,
    testnet: false,
    blockExplorer: "https://moonriver.moonscan.io/address/",
    transactionExplorer: "https://moonriver.moonscan.io/tx/",
    tokenAddress: "0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e",
  },
  "0x504": {
    name: "Moonbeam Mainnet",
    svg: bnb,
    testnet: false,
    blockExplorer: "https://moonscan.io/address/",
    transactionExplorer: "https://moonscan.io/tx/",
    tokenAddress: "0x012414A392F9FA442a3109f1320c439C45518aC3",
  },
  "0x3e9": {
    name: "Klatyn Baobab Testnet",
    svg: klaytn,
    testnet: true,
    blockExplorer: "https://baobab.scope.klaytn.com/account/",
    transactionExplorer: "https://baobab.scope.klaytn.com/tx/",
    tokenAddress: "0x04c5046A1f4E3fFf094c26dFCAA75eF293932f18",
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
  // console.log("Got from chainid", chainId, source);
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
