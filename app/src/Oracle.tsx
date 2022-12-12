import { Formik, Form } from "formik";
import { FC, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isWebUri } from "valid-url";
import { useOracle } from "./useOracles";
import { useBase } from "./Base";
import { chainSvgs } from "./ChainLogo";
import { useAlert } from "./Alert";
import {
  TextField,
  Checkbox,
  CodeParameters,
  OutputType,
} from "./OracleComponents";
import { ClockIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
const Oracle: FC = () => {
  const { confirm: alert } = useAlert();
  const { id } = useParams();
  const navigate = useNavigate();
  const { oracle, loading, refresh, remove, update } = useOracle(
    parseInt(id || "0")
  );
  useEffect(() => {
    if (!oracle && !loading) navigate("/");
  }, [oracle, loading, navigate]);
  const { setTitle } = useBase();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (oracle)
      setTitle(chainSvgs[oracle.chainId].name + ": " + oracle.contractAddress);
  }, [setTitle, oracle]);
  if (!oracle) return <div>loading...</div>;
  return (
    <Formik
      initialValues={{
        name: oracle.name,
        // chainId: oracle?.chainId,
        webhookUrl: oracle?.webhookUrl,
        confirmed: oracle?.confirmed,
        async: oracle.async,
        // address: oracle?.contractAddress,
        inputs: Object.entries(oracle.inputs).map(([name, type]) => ({
          name,
          type: type,
        })),
        outputType: oracle.outputType,
      }}
      onSubmit={async (values, form) => {
        const id = toast.info("Updating the oracle...", { autoClose: false });
        try {
          await update({
            name: values.name,
            // chainId: values.chainId,
            webhookUrl: values.webhookUrl,
            // address: values.address,
            confirmed: values.confirmed,
            async: values.async,
            inputs: values.inputs.reduce(
              (o, { name, type }) => ({ ...o, [name]: type }),
              {} as Record<string, string>
            ),
            outputType: values.outputType,
          });
          //   form.resetForm();

          toast.dismiss(id);
          toast.success("Updated the oracle!");
          await refresh();
          form.resetForm();
        } catch (e) {
          toast.dismiss(id);
          toast.error("Could not edit the oracle: " + (e as Error).toString());
        }
      }}
      enableReinitialize
      validate={(values) => {
        const errors: any = {};
        if (!values.name) {
          errors.name = "Required";
        }
        // if (!values.chainId) {
        //   errors.chainId = "Required";
        // }
        if (!values.webhookUrl) {
          errors.webhookUrl = "Required";
        } else if (!isWebUri(values.webhookUrl)) {
          errors.webhookUrl = "Invalid URL";
        } else {
        }
        if (Object.keys(errors).length) return errors;
      }}
    >
      {({ submitForm, isSubmitting, isValid, dirty, isValidating }) => (
        <Form id="edit-oracle-form">
          <div className="p-4">
            <div>
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Edit this Oracle
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Alter any property of this oracle. Note that this
                      functionality will not create a new oracle contract for
                      you.
                    </p>
                    <div className="block clear-both my-4">
                      <div className="my-6">
                        <Link
                          className=" p-2  bg-blue-500 hover:bg-blue-800 text-gray-200 rounded-md"
                          to={`/code/${id}`}
                        >
                          <CodeBracketIcon className="h-6 w-6 inline mr-2" />
                          See Code Templates
                        </Link>
                      </div>
                      <div className="my-6">
                        <Link
                          className=" p-2  bg-blue-500 hover:bg-blue-800 text-gray-200 rounded-md"
                          to={`/requests/${id}`}
                        >
                          <ClockIcon className="h-6 w-6 inline mr-2" />
                          See Requests
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-3 gap-6">
                        <TextField title="Name/label" name="name" />
                        <TextField title="Webhook url" name="webhookUrl" />

                        <Checkbox
                          name="async"
                          title="Asynchronous"
                          subTitle="The webhook uses the callback pattern. Required for Zapier integration."
                        />
                        <Checkbox
                          name="confirmed"
                          title="Run on Confirmation"
                          subTitle="Run the webhook after the transaction has 30-100 blocks of confirmation. Slower but more reliable."
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium leading-6 text-gray-900">
                          Input Parameters
                        </h4>
                        <p className="text-sm text-gray-700 ">
                          The arguments you expect to send (example: symbol as a
                          string for an equity price feed)
                        </p>
                        <div className="grid grid-cols-3 gap-6">
                          <CodeParameters name="inputs" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium  text-gray-900 ">
                          Output Type
                        </h4>
                        <p className="text-sm text-gray-700 ">
                          What type the function is expected to return (usually
                          a string or a number)
                        </p>
                        <div className="grid grid-cols-3 gap-6">
                          <OutputType name="outputType" />
                        </div>
                      </div>
                      {/*                       
                      <TextField
                        title="Oracle Address"
                        name="address"
                        subTitle="Optional - we will create the oracle contract for you if not specified. Note: An oracle needs to be valid for our signing identities"
                      />
                      <fieldset>
                        <legend className="contents text-sm font-medium text-gray-900">
                          Chain
                        </legend>
                        <p className="text-sm text-gray-500">
                          The blockchain network on which the oracle exists/will
                          be created
                        </p>
                        <div className="mt-4 space-y-4">
                          {chains.map(({ name, value }) => (
                            <div className="flex items-center" key={value}>
                              <Field
                                id={name}
                                name="chainId"
                                type="radio"
                                value={value}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor="{chain.value}"
                                className="ml-3 block text-sm font-medium text-gray-700 flex flex-start"
                              >
                                <TinyChainLogo
                                  chainId={value}
                                  chainName={name}
                                />
                                {name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset> */}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          alert(
                            "Delete this Oracle?",
                            "Are you sure you want to delete the oracle? This action cannot be undone."
                          ).then(async (action) => {
                            if (action === "accept") {
                              await remove();
                              toast.success("Removed oracle");
                              navigate("/");
                            } else {
                              toast.info("Cancelled remove");
                            }
                          });
                        }}
                        className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          navigate("/");
                        }}
                        className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Go Back
                      </button>

                      <button
                        type="submit"
                        onClick={() => {
                          submitForm();
                        }}
                        disabled={!isValid || !dirty || isSubmitting}
                        className={
                          !isValid || !dirty || isSubmitting
                            ? "inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            : "inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Oracle;
