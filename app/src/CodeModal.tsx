import { FC, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
// import ReactMarkdown from "react-markdown";
import {
  DocumentDuplicateIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { CopyBlock, dracula } from "react-code-blocks";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import copy from "clipboard-copy";
import { toast } from "react-toastify";
export const ModalMD: FC<{
  code: string;
  show: boolean;
  setShow: (show: boolean) => void;
}> = ({ show, setShow, code }) => {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        onClose={() => {
          console.log("I iz closing");
          // setIsOpen(false);
        }}
        className="absolute z-50"
      >
        {
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => {
              console.log("Hello");
              setShow(false);
            }}
          >
            {/* <div className="absolute w-full flex justify-end p-4">
            <XCircleIcon className="h-12 w-12 text-gray-600 hover:text-gray-200 transition" />
          </div> */}
          </div>
        }

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100 "
          leave="ease-in duration-250"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            onClick={() => {
              console.log("I iz closing 2");
              setShow(false);
            }}
            className={"fixed inset-0 flex items-center justify-center p-4"}
          >
            <Dialog.Panel className="flex-row justify-around flex h-screen ">
              {/* <article className="prose dark:prose-invert p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-black bg-opacity-40 m-4 rounded-lg max-h-full  overflow-scroll border-gray-300 shadow-md dark:border-gray-600 border-opacity-40 border-2">
                {markdown}
                <ReactMarkdown linkTarget={"_blank"}>{markdown}</ReactMarkdown>
              </article> */}
              <div className="my-auto h-3/4 overflow-scroll relative flex-1 rounded-md">
                <SyntaxHighlighter
                  language="solidity"
                  style={docco}
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
                <button
                  className="h-8 w-8 absolute top-5 right-20 hover:text-gray-800 text-gray-400"
                  title="Copy to Clipboard"
                  onClick={() => {
                    copy(code);
                    toast.success("Copied code to Clipboard");
                  }}
                >
                  <DocumentDuplicateIcon />
                </button>
                <button
                  className="h-8 w-8 absolute top-5 right-5 hover:text-gray-800 text-gray-400"
                  title="Closed"
                  onClick={() => {
                    setShow(false);
                  }}
                >
                  <XCircleIcon />
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
export default ModalMD;
