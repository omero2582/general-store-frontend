import { UseFormReturn } from "react-hook-form";
import Input from "../../Input";
import { TCategorySchema } from "@shared/dist/schemas";
import { DialogContent } from "@/components/ui/dialog";
import { useEffect } from "react";

type CategoryModalProps = {
  formHookReturn: UseFormReturn<any>,
  onSubmit: (body: TCategorySchema)  => void,
  name: string,
  resetOnClose?: boolean,
}

export function CategoryModal({formHookReturn, onSubmit, name, resetOnClose = false}: CategoryModalProps) {
  
  const {
    register, handleSubmit, formState: {errors, isSubmitting}, reset, setError, watch,
  } = formHookReturn;


  useEffect(() => {
    return () => {
      if(resetOnClose){
        console.log('RESET FORM')
        reset()
      }
    }
  }, [])

  return (
    // TODO change below so it doesn pass the reset, but instead the parent ocmponent uses the reset from the
    // same form that it already has access to
      <form noValidate onSubmit={handleSubmit(onSubmit)}
        className="grid justify-center"
      >
        <h2 className="text-[18px] font-[500]">{name}</h2>
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