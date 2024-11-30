import { useAddCategoryMutation } from "@/store/api/apiSlice";
import { categorySchema, TCategorySchema } from "@shared/dist/schemas";
import { CategoryModal } from "./CategoryModal";
import { useForm, UseFormReturn } from "react-hook-form";
import { DialogContent } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Description, DialogTitle } from "@radix-ui/react-dialog";

export default function CategoryModalNew() {
  const [addCategory] = useAddCategoryMutation()

  const formHookReturn = useForm<TCategorySchema>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      return out;
    }, categorySchema))
  });

  const { reset } = formHookReturn;
  
  const onSubmit = async (body: TCategorySchema) => {
    // Note, in RTK Query calls, using uwrap() makes them throw err on failure.
    // Otherwise they dont throw and instead return a .data and .error properties
    try {
      await addCategory({body}).unwrap();
      reset(); // clear inputs
      // refetch(); // dont need this, we simply invalidate the category call on that enpoint def
    }catch(err){
      console.log('err catch in edit category submit', err);
    }
  }

  return (
    <DialogContent className="max-w-[400px]">
      <DialogTitle className="sr-only">New Category</DialogTitle>
      <Description className="sr-only">{`Create New Category`}</Description>
      <CategoryModal
        formHookReturn={formHookReturn}
        onSubmit={onSubmit}
        name={'New Category'}
      />
    </DialogContent>

  )
}
