import { FC, Fragment, useCallback, useEffect, useState } from "react";
import {
  GlobeAmericasIcon,
  LinkIcon,
  DocumentDuplicateIcon as SmallDocumentDuplicateIcon,
} from "@heroicons/react/20/solid";
import {
  CodeBracketIcon,
  DocumentDuplicateIcon,
  HashtagIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Oracle, useOracles } from "./useOracles";
import { Link } from "react-router-dom";
import { useBase, useUpdatePath } from "./Base";
import { ChainLogo, chainSvgs } from "./ChainLogo";
import CreateOracle from "./CreateOracle";
import copy from "clipboard-copy";
import { toast } from "react-toastify";
import CodeModal from "./CodeModal";
import templateCode from "./templateCode";
import mustache from "mustache";
const Oracles: FC = () => {
  useUpdatePath();
  const { oracles, refresh, loading } = useOracles();
  const [createName, setCreateName] = useState("My First Oracle");
  const [createChainId, setCreateChainId] = useState("0x13881");
  const [createWebhookUrl, setCreateWebhookUrl] = useState("");
  const [createConfirmed, setCreateConfirmed] = useState(false);
  const [createAsync, setCreateAsync] = useState(false);
  const [createAddress, setCreateAddress] = useState("");
  const [showOracle, setShowOracle] = useState(false);
  const { setTitle } = useBase();
  const [code, setCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const makeCode = useCallback((oracle: Oracle) => {
    return mustache.render(templateCode, {
      oracleId: oracle.contractAddress,
      jobId: oracle.jobId,
    });
  }, []);
  useEffect(() => {
    if (loading) {
      setTitle("Loading...");
    } else {
      setTitle("Oracles (" + oracles.length + ")");
    }
  }, [loading, oracles.length, setTitle]);
  return (
    <Fragment>
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {oracles.map((oracle) => (
            <li key={oracle.id}>
              <div className="flex items-center">
                <div className="flex min-w-0 flex-1 items-center  px-4 py-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <ChainLogo chainId={oracle.chainId} />
                  </div>
                  <div className="min-w-0 flex-1 px-4 ">
                    <div>
                      <h2 className="text-medium font-bold text-gray-800 my-2">
                        {oracle.name || "No label"}{" "}
                        <a
                          href={
                            chainSvgs[oracle.chainId].blockExplorer +
                            oracle.contractAddress
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline cursor-pointer hover:text-black text-blue-600 text-xs font-medium p-1 "
                        >
                          Open In Block Explorer
                        </a>
                      </h2>
                      {oracle.jobId ? (
                        <p
                          className="truncate flex text-sm font-medium text-blue-600 cursor-pointer group"
                          onClick={() => {
                            copy(oracle.jobId);
                            toast.success("Copied job ID to clipboard");
                          }}
                        >
                          <HashtagIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {oracle.jobId || "[All Jobids]"}
                          </span>
                          <SmallDocumentDuplicateIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-800"
                            aria-hidden="true"
                          />
                        </p>
                      ) : (
                        <p className="truncate flex text-sm font-medium text-gray-400 cursor-pointer group">
                          <HashtagIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="truncate ">[All Jobids]</span>
                        </p>
                      )}
                      <p
                        className="truncate flex text-sm font-medium text-blue-600 cursor-pointer group"
                        onClick={() => {
                          console.log("Hello");
                          copy(oracle.contractAddress);
                          toast.success("Copied address to clipboard");
                        }}
                      >
                        <LinkIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          {oracle.contractAddress}
                        </span>
                        <SmallDocumentDuplicateIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-800"
                          aria-hidden="true"
                        />
                      </p>
                      <p
                        className="mt-2 flex items-center text-sm text-gray-500 cursor-pointer group"
                        onClick={() => {
                          console.log("Hello");
                          copy(oracle.webhookUrl);
                          toast.success("Copied URL to clipboard");
                        }}
                      >
                        <GlobeAmericasIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 "
                          aria-hidden="true"
                        />
                        <span className="truncate">{oracle.webhookUrl}</span>
                        <SmallDocumentDuplicateIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-800"
                          aria-hidden="true"
                        />
                      </p>
                    </div>
                    {/* <div className="hidden md:block">
                      <div>
                        <p className="text-sm text-gray-900">
                          Applied on{" "}
                          <time dateTime={application.date}>
                            {application.dateFull}
                          </time>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <CheckCircleIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                            aria-hidden="true"
                          />
                          {application.stage}
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>
                <button
                  title="Show Code"
                  className="mx-4 p-2 hover:text-black text-gray-400 flex"
                  onClick={() => {
                    setCode(makeCode(oracle));
                    setModalOpen(true);
                  }}
                >
                  <CodeBracketIcon className="h-5 w-5" />
                  <span className="hidden md:inline ml-2">Code</span>
                </button>
                <button
                  title="Duplicate contract"
                  className="mx-4 p-2 hover:text-black text-gray-400 flex"
                  onClick={() => {
                    console.log(oracle.contractAddress);
                    setCreateAddress(oracle.contractAddress);
                    setCreateName(oracle.name + " copy");
                    setCreateConfirmed(oracle.confirmed);
                    setCreateAsync(oracle.async);
                    setCreateChainId(oracle.chainId);
                    setCreateWebhookUrl(oracle.webhookUrl);
                    setShowOracle(true);
                    setTimeout(() => {
                      window.location.href = "#create-oracle-form";
                    }, 100);
                  }}
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                  <span className="hidden md:inline ml-2">Copy</span>
                </button>
                <Link
                  to={`/oracle/${oracle.id}`}
                  className="mx-4 p-2 hover:text-black text-gray-400 flex"

                  // className="block hover:bg-blue-800 h-20 w-20 p-8 animated hover:fadeIn  text-gray-400 group-hover hover:text-white"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span className="hidden md:inline ml-2">Edit</span>

                  {/* <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {!showOracle && (
        <button
          onClick={() => {
            setShowOracle(true);
            setTimeout(() => {
              window.location.href = "#create-oracle-form";
            }, 100);
          }}
          className="block bg-blue-600 rounded-md hover:bg-blue-800 my-3 w-full p-2 animated hover:fadeIn text-gray-200 hover:text-white"
        >
          Create an Oracle
        </button>
      )}
      {showOracle && (
        <Fragment>
          <hr className="mt-8" />
          <CreateOracle
            name={createName}
            chainId={createChainId}
            webhookUrl={createWebhookUrl}
            confirmed={createConfirmed}
            async={createAsync}
            address={createAddress}
            onCreated={() => {
              setShowOracle(false);
              refresh();
            }}
          />
        </Fragment>
      )}
      <CodeModal show={modalOpen} setShow={setModalOpen} code={code} />
    </Fragment>
  );
};

export default Oracles;
