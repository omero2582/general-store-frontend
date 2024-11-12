import {  useEditCategoryMutation } from "../../../store/api/apiSlice";
import { categorySchema, TCategorySchema } from '@shared/dist/schemas'
import Input from "../Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

export function EditCategoryModal({category}) {

  const formHook = useForm<TCategorySchema>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      return out;
    }, categorySchema)),
    defaultValues: category
  });

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
    setError,
    watch,
  } = formHook;


  const [editCategory, resEditCategory] = useEditCategoryMutation()

  const onSubmit = async (body: TCategorySchema) => {
    // Note, in RTK Query calls, using uwrap() makes them throw err on failure.
    // Otherwise they dont throw and instead return a .data and .error properties
    try {
      await editCategory({body, id: category.id}).unwrap();
      reset(); // clear inputs
      // refetch(); // dont need this, we simply invalidate the category call on that enpoint def
    }catch(err){
      console.log('err catch in new category submit', err);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}
      className="grid justify-center"
    >
      <h2 className="text-[18px] font-[500]">Edit Category</h2>
      <div className="grid grid-flow-col gap-x-5">
        <div className="flex flex-col items-start gap-y-2">
          <Input errors={errors} id='name' label="Name" inputProps={{...register("name")}}/>
          <button disabled={isSubmitting} type="submit" className="mt-auto text-white font-[500] bg-blue-600 px-4 py-[6px] rounded ">
            Submit
          </button>
        </div>
      </div>
      
      
    </form>
  )
}