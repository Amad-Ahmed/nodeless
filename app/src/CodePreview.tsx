import {
  ChevronRightIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  CSSProperties,
  FC,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { toast } from "react-toastify";
import { useBase } from "./Base";
import { useOracle } from "./useOracles";
import { docco, dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import copy from "clipboard-copy";
import mustache from "mustache";
import { chainSvgs } from "./ChainLogo";
import solidityTemplateCode from "./templateContractCode";
import templateJsAsync from "./templateJsAsync";
import templateTsAsync from "./templateTsAsync";
import templateJs from "./templateJs";
import templateTs from "./templateTs";
import { Disclosure } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
const CodePreview: FC = () => {
  const { id } = useParams();
  const { oracle } = useOracle(id ? parseInt(id) : 0);
  const [codeStyle, setCodeStyle] = useState(docco);
  const solidityCode = useMemo(() => {
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
    return mustache.render(solidityTemplateCode, {
      oracleId: oracle.contractAddress,
      jobId: oracle.jobId,
      linkAddress: chainSvgs[oracle.chainId].tokenAddress,
      requests,
      args,
      returnType,
    });
  }, [oracle]);
  const jsCode = useMemo(() => {
    const template = oracle?.async ? templateJsAsync : templateJs;
    return mustache.render(template, {});
  }, [oracle]);
  const tsCode = useMemo(() => {
    const template = oracle?.async ? templateTsAsync : templateTs;
    return mustache.render(template, {});
  }, [oracle]);
  const { setTitle } = useBase();
  useEffect(() => {
    if (oracle) setTitle("Code Preview for " + oracle?.name);
    else setTitle("Loading...");
  }, [setTitle, oracle]);
  return (
    <Fragment>
      <button
        disabled={codeStyle === docco}
        className={
          "animated transition duration-250 mr-2 " +
          (codeStyle === docco
            ? "text-gray-600"
            : "text-blue-600 hover:text-blue-800")
        }
        onClick={() => setCodeStyle(docco)}
      >
        {codeStyle === docco && <CheckIcon className="h-4 w-4 inline" />}
        Light Theme
      </button>
      <button
        disabled={codeStyle === dracula}
        className={
          "animated transition duration-250 mr-2 " +
          (codeStyle === dracula
            ? "text-gray-600"
            : "text-blue-600 hover:text-blue-800")
        }
        onClick={() => setCodeStyle(dracula)}
      >
        {codeStyle === dracula && <CheckIcon className="h-4 w-4 inline" />}
        Dark Theme
      </button>
      <CodeSection
        title="Solidity Template"
        code={solidityCode}
        codeStyle={codeStyle}
        language="solidity"
      />
      <CodeSection
        language="javascript"
        title="Javascript (Netlify) Example"
        code={jsCode}
        codeStyle={codeStyle}
      />
      <CodeSection
        language="typescript"
        title="Typescript (Netlify) Example"
        code={tsCode}
        codeStyle={codeStyle}
      />
    </Fragment>
  );
};
export default CodePreview;

const CodeSection: FC<{
  title: string;
  language: string;
  code: string;
  codeStyle: Record<string, CSSProperties>;
}> = ({ title, language, code, codeStyle }) => {
  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <div className="my-4">
          <Disclosure.Button>
            <div>
              <h2 className="text-2xl font-bold flex flex-row">
                <ChevronRightIcon
                  className={
                    "h-6 w-6 transform animated transition duration-250 " +
                    (open ? "rotate-90" : "")
                  }
                />
                {title}
                {/* <div className="gap-4 inline "> */}
                <button
                  className="ml-2 text-sm font-medium hover:text-gray-800 text-gray-400 inline flex pt-1"
                  title="Copy to Clipboard"
                  onClick={(e) => {
                    copy(code);
                    toast.success(
                      `Copied ${language} code snippet to Clipboard`
                    );
                    e.preventDefault();
                  }}
                >
                  <DocumentDuplicateIcon className="h-6 w-6 pt-0.5-" />
                  Copy
                </button>
                {/* </div> */}
              </h2>
            </div>
            <div className="ml-6 text-left text-sm font-medium text-gray-700">
              Click to {open ? "close" : "show the code"}
            </div>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="h-full overflow-scroll relative flex-1 rounded-md">
              <SyntaxHighlighter
                language={language}
                style={codeStyle}
                showLineNumbers
                lineNumberContainerStyle={{ backgroundColor: "#999" }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
