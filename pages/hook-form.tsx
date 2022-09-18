import React, { FC, useRef } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

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

const Schema = z.object({
  tokenAddress: z
    .string()
    .refine((val) => ethers.utils.isAddress(val), {
      message: "Not a valid address",
    })
    .transform((val) => ethers.utils.getAddress(val)),
  tokenAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Not a number",
    })
    .refine((val) => !isUndeflow(val), {
      message: "Too many decimals",
    }),
  // .transform((val, ctx) => {
  //   try {
  //     return ethers.utils.parseUnits(val, decimals);
  //   } catch (error) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: "Too many decimals",
  //     });

  //     return z.NEVER;
  //   }
  // }), //.refine((val) => !isNaN(Number(val))),
});
type FormType = z.infer<typeof Schema>;

const HookForm = () => {
  const renderCount = ++useRef(0).current;

  const form = useForm<FormType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      tokenAddress: "",
      tokenAmount: "",
    },
  });
  const {
    register,
    handleSubmit,
    // formState: { errors },
    watch,
  } = form;
  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log("🚀 ~ file: hook-form.tsx ~ line 19 ~ HookForm ~ data", data);
  };

  return (
    <div className="h-screen w-full flex justify-between items-center px-4">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">Render count: {renderCount}</div>
          <input
            {...register("tokenAddress")}
            className="border border-black mb-2"
          />
          {/* <p className="text-red-600">{errors.tokenAddress?.message}</p> */}
          <ErrorMessage name="tokenAddress" />

          <input
            // type="number"
            {...register("tokenAmount", {})}
            className="border border-black"
          />
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
      </FormProvider>
      {/* <Logger label="react-hook-form" /> */}
    </div>
  );
};

const Preview: FC = () => {
  const previerRenderCount = ++useRef(0).current;
  const [tokenAddress, tokenAmount] = useWatch<FormType>({
    name: ["tokenAddress", "tokenAmount"],
  });

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
  const { errors } = useFormState<FormType>({ name });

  if (!errors[name]) return <p></p>;

  return <p className="text-red-600">{errors[name]?.message}</p>;
};

export default HookForm;
