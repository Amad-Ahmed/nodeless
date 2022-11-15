import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  useField,
  Field,
  FieldArray,
  ErrorMessage,
  useFormikContext,
} from "formik";
import { FC } from "react";
import { TinyChainLogo } from "./ChainLogo";
import { chains } from "./chains";

export const Chains: FC<{ name?: string }> = ({
  name: fieldName = "chainId",
}) => {
  const [{ value }, , { setValue }] = useField(fieldName);
  return (
    <div className="col-span-6">
      <fieldset>
        <legend className="contents text-sm font-medium text-gray-900">
          Chain ({value})
        </legend>
        <p className="text-sm text-gray-500">
          The blockchain network on which the oracle exists/will be created
        </p>
        <div className="mt-4 space-y-4">
          {chains.map(({ name, value }) => (
            <div className="flex items-center" key={value}>
              <Field
                id={name}
                name={fieldName}
                type="radio"
                value={value}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="{chain.value}"
                className="ml-3 block text-sm font-medium text-gray-700 flex flex-start pointer-cursor hover:text-gray-900"
                onClick={() => {
                  console.log("setting value", value);
                  setValue(value, true);
                }}
              >
                <TinyChainLogo chainId={value} chainName={name} />
                {name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
export type OracleInput = {
  name: string;
  type: string;
};
export const inputTypes = [
  { name: "string", label: "Text" },
  { name: "uint256", label: "Number (uint256)" },
];
export const CodeParameters: FC<{ name: string }> = ({ name: baseName }) => {
  const { setFieldValue } = useFormikContext();
  //   const [, , { setValue }] = useField(baseName);
  return (
    <FieldArray name={baseName}>
      {({
        push,
        remove,
        form: {
          values: { [baseName]: inputs },
        },
      }) => (
        <div className="col-span-6">
          {(inputs as OracleInput[]).map(({ name, type }, index) => (
            <div key={index} className="flex  w-full space-between">
              <div className=" items-center">
                <Field
                  id={`${baseName}-${index}-name`}
                  name={`${baseName}.${index}.name`}
                  type="text"
                  className="mr-4 mt-1 w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {inputTypes.map(({ name, label }) => (
                <div className="flex mt-3">
                  <Field
                    type="radio"
                    name={`${baseName}.${index}.type`}
                    value={name}
                    className="inline mr-1"
                  />
                  <span
                    className="inline mr-2 text-sm font-medium cursor-pointer"
                    onClick={() => {
                      setFieldValue(`${baseName}.${index}.type`, name, true);
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  remove(index);
                }}
                className="ml-2 text-red-600 hover:text-red-800 text-sm"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          <ErrorMessage
            name={baseName}
            component="div"
            className="text-red-600 text-sm font-medium"
          />
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                console.log("I am pushing");
                push({ name: "", type: "string" });
              }}
              className="text-gray-200 hover:text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-md px-4 py-1"
            >
              <PlusIcon className="h-4 w-4 mr-1 inline" />
              Add
            </button>
          </div>
        </div>
      )}
    </FieldArray>
  );
};
export const OutputType: FC<{ name: string }> = ({ name: baseName }) => {
  const [, , { setValue }] = useField(baseName);
  return (
    <fieldset>
      <div className="mt-4 space-y-4">
        {inputTypes.map(({ name, label }) => (
          <div className="flex items-center" key={`${baseName}-${name}`}>
            <Field
              id={name}
              name={baseName}
              type="radio"
              value={name}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="{chain.value}"
              className="ml-3 block text-sm font-medium text-gray-700 flex flex-start pointer-cursor hover:text-gray-900"
              onClick={() => {
                setValue(name, true);
              }}
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
export const Checkbox: FC<{
  name: string;
  title: string;
  subTitle?: string;
  disabled?: boolean;
}> = ({ name, title, subTitle, disabled = false }) => {
  const [{ value }, , { setValue }] = useField(name);
  return (
    <div className="flex items-start col-span-6">
      <div className="flex h-5 items-center">
        <Field
          id={name}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          disabled={disabled}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor="comments"
          className="font-medium text-gray-700"
          onClick={() => {
            setValue(!value);
          }}
        >
          {title}
        </label>
        {subTitle && <p className="text-gray-500 ">{subTitle}</p>}
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};

export const TextField: FC<{
  name: string;
  title: string;
  subTitle?: string;
}> = ({ name, title, subTitle }) => {
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
