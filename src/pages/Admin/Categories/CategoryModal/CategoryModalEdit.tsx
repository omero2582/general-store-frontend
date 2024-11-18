import { useEditCategoryMutation } from "@/store/api/apiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, TCategorySchema } from "@shared/dist/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategoryModal } from "./CategoryModal";
import { DialogContent } from "@/components/ui/dialog";
import { Description, DialogTitle } from "@radix-ui/react-dialog";

export default function CategoryModalEdit({category}) {
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

  const [editCategory] = useEditCategoryMutation()

  const onSubmit = async (body: TCategorySchema, reset: () => void) => {
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
    <DialogContent className="max-w-[400px]">
      <DialogTitle className="sr-only">Edit Category</DialogTitle>
      <Description className="sr-only">{`Edit the Category: ${category.name}`}</Description>
      <CategoryModal
        formHookReturn={formHook}
        onSubmit={onSubmit}
        name={'Edit Category'}
        resetOnClose
      />
    </DialogContent>
  )
}
