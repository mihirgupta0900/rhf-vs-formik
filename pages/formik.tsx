import { ethers } from "ethers";
import { Field, FormikProvider, useFormik, useFormikContext } from "formik";
import { FC, useRef } from "react";
import * as yup from "yup";

const decimals = 18;
const isUndeflow = (value: string): boolean => {
  try {
    ethers.utils.parseUnits(value, decimals);
    return false;
  } catch (error) {
    return true;
  }
};

/**
 * Things to look into:
 * - [ ] Partial validation -- required for multistep forms
 */

const Schema = yup.object({
  tokenAddress: yup
    .string()
    .test("address-validation", "Not a valid address", (val) =>
      val ? ethers.utils.isAddress(val) : false
    ),
  tokenAmount: yup.string(),
});
type FormType = yup.InferType<typeof Schema>;

const Formik = () => {
  const renderCount = ++useRef(0).current;

  const form = useFormik({
    initialValues: {
      tokenAddress: "",
      tokenAmount: "",
    },
    validationSchema: Schema,
    onSubmit: (data) => {
      console.log("🚀 ~ file: hook-form.tsx ~ line 19 ~ HookForm ~ data", data);
    },
  });

  const { handleSubmit, handleChange } = form;

  return (
    <div className="h-screen w-full flex justify-between items-center px-4">
      <FormikProvider value={form}>
        <form onSubmit={handleSubmit}>
          <div className="">Render count: {renderCount}</div>
          <Field name="tokenAddress" className="border border-black mb-2" />
          {/* <p className="text-red-600">{errors.tokenAddress?.message}</p> */}
          <ErrorMessage name="tokenAddress" />

          <Field name="tokenAmount" className="border border-black" />
          <ErrorMessage name="tokenAmount" />
          {/* <p className="text-red-600">{errors.tokenAmount?.message}</p> */}

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md mt-2"
          >
            Submit
          </button>
        </form>
        <Preview />
      </FormikProvider>
      {/* <Logger label="react-hook-form" /> */}
    </div>
  );
};

const Preview: FC = () => {
  const previerRenderCount = ++useRef(0).current;
  const {
    values: { tokenAddress, tokenAmount },
  } = useFormikContext<FormType>();

  return (
    <div className="border border-black ">
      <h2 className="text-3xl">Preview</h2>
      <p className="text-blue-600">
        Previer Render Count: {previerRenderCount}
      </p>
      <p>Token Address: {tokenAddress}</p>
      <p>Token Amount: {tokenAmount}</p>
    </div>
  );
};

const ErrorMessage: FC<{
  name: keyof FormType;
}> = ({ name }) => {
  const { errors } = useFormikContext<FormType>();

  if (!errors[name]) return <p></p>;

  return <p className="text-red-600">{errors[name]}</p>;
};

export default Formik;
