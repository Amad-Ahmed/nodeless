import { Formik, Form } from "formik";
import { FC, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useBase } from "./Base";
import { useAlert } from "./Alert";
import {
  TextField,
  Checkbox,
  CodeParameters,
  OutputType,
  PasswordField,
} from "./OracleComponents";
import { ClockIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { useMe } from "./Authenticator";
const Oracle: FC = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const { data, loading, refresh, update } = useMe();
  const { setTitle } = useBase();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (data) setTitle("About Me");
  }, [setTitle, data]);
  if (!data) return <div>loading...</div>;
  return (
    <Formik
      initialValues={{
        name: data.name,
        // chainId: oracle?.chainId,
        // email: data.email,
        password1: "",
        password2: "",
      }}
      onSubmit={async (values, form) => {
        console.log("submitting the form with ", values);
        const id = toast.info("Updating the oracle...", { autoClose: false });
        try {
          await update({
            name: values.name,
            password: values.password2,
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
        if (
          values.password2 &&
          (values.password1.length < 8 || values.password2 !== values.password1)
        ) {
          errors.password2 = "Password must be at least 8 characters and match";
        }
        // if (!values.address) {
        //   errors.address = "Required";
        // }
        console.log("errors be", errors);
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
                      Edit Me
                    </h3>
                    <p>{data.email}</p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-3 gap-6">
                        <TextField title="My Name" name="name" />
                        <PasswordField title="New Password" name="password1" />
                        <PasswordField
                          title="Retype Password"
                          name="password2"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
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

export default Oracle;
