import { FC, Fragment, useEffect, useState } from "react";

import {
  CheckCircleIcon,
  ChevronRightIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import { Oracle, useCreateOracle, useOracles } from "./useOracles";
import { Link } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik, validateYupSchema } from "formik";
import { createReadStream } from "fs";
import { useBase } from "./Base";
const chains = [
  { name: "Ethereum", value: "0x01" },
  { name: "Goerli (Ethereum Testnet)", value: "0x02" },
  { name: "Binance Smart Chain", value: "0x38" },
  { name: "Binance Testnet", value: "0x61" },
  { name: "Polygon", value: "0x89" },
  { name: "Polygon Testnet", value: "0x13881" },
  { name: "Fantom", value: "0x46" },
  { name: "Fantom Testnet", value: "0xfa2" },
  { name: "Avalanche", value: "0xa8" },
  { name: "Avalanche Testnet", value: "0xa86a" },
  { name: "Arbitrum", value: "0xa4" },
];

const Oracles: FC = () => {
  const { oracles, refresh, loading } = useOracles();
  const [createName, setCreateName] = useState("My First Oracle");
  const [createChainId, setCreateChainId] = useState("0x13881");
  const [createWebhookUrl, setCreateWebhookUrl] = useState("");
  const [createConfirmed, setCreateConfirmed] = useState(false);
  const [createAsync, setCreateAsync] = useState(false);
  const [createAddress, setCreateAddress] = useState("");

  const createOracle = useCreateOracle();
  const { setTitle } = useBase();
  useEffect(() => {
    if (loading) {
      setTitle("Loading...");
    } else {
      setTitle("Oracles (" + oracles.length + ")");
    }
  }, [loading]);
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {oracles.map((oracle) => (
          <li key={oracle.id}>
            <div className="flex items-center">
              <div className="flex min-w-0 flex-1 items-center  px-4 py-4 sm:px-6">
                <div className="flex-shrink-0">
                  <ChainLogo chainId={oracle.chainId} />
                </div>
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="truncate text-sm font-medium text-indigo-600">
                      {oracle.contractAddress}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      <EnvelopeIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="truncate">{oracle.webhookUrl}</span>
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
                onClick={() => {
                  console.log(oracle.contractAddress);
                  setCreateAddress(oracle.contractAddress);
                }}
              >
                Button
              </button>
              <Link
                to={`oracle/${oracle.id}`}
                className="block hover:bg-blue-800 h-20 w-20 p-8 animated hover:fadeIn  text-gray-400 group-hover hover:text-white"
              >
                <div>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {!loading && (
        <CreateOracle
          name={createName}
          chainId={createChainId}
          webhookUrl={createWebhookUrl}
          confirmed={createConfirmed}
          async={createAsync}
          address={createAddress}
          onCreated={refresh}
        />
      )}
    </div>
  );
};

export default Oracles;

const CreateOracle: FC<{
  name?: string;
  chainId?: string;
  webhookUrl?: string;
  confirmed?: boolean;
  async?: boolean;
  address?: string;
  onCreated?: (oracle: Oracle) => void;
}> = ({
  name = "My oracle",
  chainId = "0x13381",
  webhookUrl = "",
  confirmed = false,
  async = false,
  address = "",
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
        // create({
        //   name: values.name,
        //   chainId: values.chainId,
        //   webhookUrl: values.webhookUrl,
        //   address: values.address,
        //   confirmed: values.confirmed,
        //   async: values.async,
        // });
        // form.resetForm();
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
        }
        // if (!values.address) {
        //   errors.address = "Required";
        // }
        console.log("errors be", errors);
        if (Object.keys(errors).length) return errors;
      }}
    >
      {({ submitForm, isSubmitting, isValid, dirty, isValidating }) => (
        <Form>
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
                          subTitle="The webhook uses the callback pattern"
                        />
                        <Checkbox
                          name="confirmed"
                          title="Run on Confirmation"
                          subTitle="Run the webhook after the transaction has 30-100 blocks of confirmation"
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
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                {name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <button
                        type="submit"
                        onClick={() => {
                          console.log("submitting from button");
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
const ChainLogo: FC<{ chainId: string }> = ({ chainId }) => {
  return (
    <Fragment>
      <div className="h-8-w-8 rounded-full bg-gray-100 flex items-center justify-center">
        {chainId}
      </div>
      {/* <img
                            className="h-12 w-12 rounded-full"
                            src={application.applicant.imageUrl}
                            alt=""
                          /> */}
    </Fragment>
  );
};
