import { Formik, Form } from "formik";
import { FC } from "react";
import { Oracle, useCreateOracle } from "./useOracles";
import { isWebUri } from "valid-url";
import { toast } from "react-toastify";
import {
  CodeParameters,
  OutputType,
  Chains,
  Checkbox,
  TextField,
} from "./OracleComponents";

const CreateOracle: FC<{
  name?: string;
  chainId?: string;
  webhookUrl?: string;
  confirmed?: boolean;
  async?: boolean;
  address?: string;
  inputs?: Record<string, string>;
  outputType?: string;
  onCreated?: (oracle?: Oracle) => void;
  createContract?: boolean;
}> = ({
  name = "My oracle",
  chainId = "0x13381",
  webhookUrl = "",
  confirmed = false,
  async = false,
  address = "",
  inputs = { symbol: "string" },
  outputType = "uint256",
  onCreated,
  createContract = false,
}) => {
  const create = useCreateOracle();
  console.log("address", address);

  return (
    <Formik
      initialValues={{
        name,
        chainId,
        webhookUrl,
        confirmed,
        async,
        address,
        inputs: Object.entries(inputs).map(([name, type]) => ({
          name,
          type: type,
        })),
        outputType,
        createContract,
      }}
      onSubmit={async (values, form) => {
        console.log("submitting the form with ", values);
        const id = toast.info("Requesting the oracle (can take up to 30s)...", {
          autoClose: false,
        });
        try {
          await create({
            name: values.name,
            chainId: values.chainId,
            webhookUrl: values.webhookUrl,
            address: values.address,
            confirmed: values.confirmed,
            async: values.async,
            inputs: values.inputs.reduce(
              (o, { name, type }) => ({ ...o, [name]: type }),
              {} as Record<string, string>
            ),
            outputType: values.outputType,
            createContract: values.createContract,
          });
          form.resetForm();
          onCreated && onCreated();
          toast.dismiss(id);
          toast.success("Created the oracle!");
        } catch (e) {
          toast.dismiss(id);
          toast.error(
            "Could not create the oracle: " + (e as Error).toString()
          );
        }
      }}
      enableReinitialize
      validate={(values) => {
        console.log("Validating me");
        const errors: any = {};
        if (!values.name) {
          errors.name = "Required";
        }
        if (!values.chainId) {
          errors.chainId = "Required";
        }
        if (!values.webhookUrl) {
          errors.webhookUrl = "Required";
        } else if (!isWebUri(values.webhookUrl)) {
          console.log("Bad url");
          errors.webhookUrl = "Invalid URL";
        } else {
          console.log("a ok");
        }
        // if (!values.address) {
        //   errors.address = "Required";
        // }
        if (values.inputs.find(({ name }) => !name)) {
          errors.inputs = "All input parameters must have a name";
        }
        console.log("errors be", errors);
        if (Object.keys(errors).length) return errors;
      }}
    >
      {({ submitForm, isSubmitting, isValid, dirty, isValidating }) => (
        <Form id="create-oracle-form">
          <div className="p-4">
            <div>
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-xl font-medium leading-6 text-gray-900">
                      Create an Oracle
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Make a new oracle job
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-3 gap-6">
                        <TextField title="Name/label" name="name" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Webhook - where does the request go?
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      The URL and arguments for the request
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-3 gap-6">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Oracle Contract
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Use the Nodeless Oracle for your chain, or deploy your own
                  </p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <TextField
                        title="Oracle Address"
                        name="address"
                        subTitle="Optional - we will create the oracle contract for you if not specified. Note: An oracle needs to be valid for our signing identities"
                      />{" "}
                      {/* </div> */}
                      <Chains />
                      <Checkbox
                        name="createContract"
                        title="Create an oracle contract"
                        subTitle="Create an oracle contract for this job. This is for paid accounts only"
                        disabled={!!address}
                      />
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          if (onCreated) {
                            onCreated();
                          }
                        }}
                        className={
                          isSubmitting
                            ? "mr-4 inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            : "mr-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        }
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={() => {
                          console.log("submitting from button");
                          submitForm();
                        }}
                        disabled={!isValid || !dirty || isSubmitting}
                        className={
                          !isValid || !dirty || isSubmitting
                            ? " inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

export default CreateOracle;
