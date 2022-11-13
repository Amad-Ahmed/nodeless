import { Formik, Field, ErrorMessage, Form } from "formik";
import { FC } from "react";
import { Oracle, useCreateOracle } from "./useOracles";
import { isWebUri } from "valid-url";
import { TinyChainLogo } from "./ChainLogo";
import { toast } from "react-toastify";
import { chains } from "./chains";

const CreateOracle: FC<{
  name?: string;
  chainId?: string;
  webhookUrl?: string;
  confirmed?: boolean;
  async?: boolean;
  address?: string;
  onCreated?: (oracle?: Oracle) => void;
}> = ({
  name = "My oracle",
  chainId = "0x13381",
  webhookUrl = "",
  confirmed = false,
  async = false,
  address = "",
  onCreated,
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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Create an Oracle
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Make a new oracle
                    </p>
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
                      </fieldset>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <button
                        disabled={isSubmitting}
                        onClick={() => {
                          if (onCreated) {
                            onCreated();
                          }
                        }}
                        className={
                          isSubmitting
                            ? "inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            : "inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                            ? "mr-4 inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            : "mr-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
const Checkbox: FC<{ name: string; title: string; subTitle?: string }> = ({
  name,
  title,
  subTitle,
}) => {
  return (
    <div className="flex items-start col-span-6">
      <div className="flex h-5 items-center">
        <Field
          id={name}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="comments" className="font-medium text-gray-700">
          {title}
        </label>
        {subTitle && <p className="text-gray-500 ">{subTitle}</p>}
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};

const TextField: FC<{ name: string; title: string; subTitle?: string }> = ({
  name,
  title,
  subTitle,
}) => {
  return (
    <div className="col-span-6 text-sm">
      <label
        htmlFor="street-address"
        className="block text-sm font-medium text-gray-700"
      >
        {title}
      </label>
      {subTitle && <p className="text-gray-500 ">{subTitle}</p>}

      <Field
        type="text"
        name={name}
        id={name}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      <ErrorMessage name={name}>
        {(message) => (
          <div className="pl-2 pt-2 text-red-600 font-medium text-sm">
            {message}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};
export default CreateOracle;
