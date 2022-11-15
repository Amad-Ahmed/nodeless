import {
  DocumentDuplicateIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { FC, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { toast } from "react-toastify";
import { useBase } from "./Base";
import { useOracle } from "./useOracles";
import { docco as codeStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";
import copy from "clipboard-copy";
import mustache from "mustache";
import { chainSvgs } from "./ChainLogo";
import templateCode from "./templateCode";
const CodePreview: FC = () => {
  const { id } = useParams();
  const { oracle } = useOracle(id ? parseInt(id) : 0);
  const code = useMemo(() => {
    if (!oracle) return "";
    const requests = Object.entries(oracle.inputs)
      .map(([name, type]) => {
        switch (type) {
          case "string":
            return `request.add("${name}", _${name});`;
          case "uint256":
            return `request.addUint("${name}", _${name});`;
        }
        return "";
      })
      .join("\n        ");
    const args = Object.entries(oracle.inputs)
      .map(([name, type]) => {
        switch (type) {
          case "string":
            return `string memory _${name}`;
          case "uint256":
            return `uint256 _${name}`;
        }
        return "";
      })
      .join(", ");
    const returnType = (() => {
      switch (oracle.outputType) {
        case "uint256":
          return "uint256";
        case "string":
          return "string memory";
      }
    })();
    return mustache.render(templateCode, {
      oracleId: oracle.contractAddress,
      jobId: oracle.jobId,
      linkAddress: chainSvgs[oracle.chainId].tokenAddress,
      requests,
      args,
      returnType,
    });
  }, [oracle]);
  const { setTitle } = useBase();
  useEffect(() => {
    if (oracle) setTitle("Code Preview for " + oracle?.name);
    else setTitle("Loading...");
  }, [setTitle, oracle]);
  return (
    <div>
      <h2 className="text-2xl font-bold flex flex-row">
        Solidity Preview
        {/* <div className="gap-4 inline "> */}
        <button
          className="ml-2 text-sm font-medium hover:text-gray-800 text-gray-400 inline flex pt-1"
          title="Copy to Clipboard"
          onClick={() => {
            copy(code);
            toast.success("Copied code to Clipboard");
          }}
        >
          <DocumentDuplicateIcon className="h-6 w-6 pt-0.5-" />
          Copy
        </button>
        {/* </div> */}
      </h2>

      <div className="h-full overflow-scroll relative flex-1 rounded-md">
        <SyntaxHighlighter
          language="solidity"
          style={codeStyle}
          showLineNumbers
          lineNumberContainerStyle={{ backgroundColor: "#999" }}
        >
          {code}
        </SyntaxHighlighter>
        {/* <CopyBlock
  text={code}
  language={"solidity"}
  theme={dracula}
  showLineNumbers
  //   wrapLines
/> */}
      </div>
    </div>
  );
};
export default CodePreview;
