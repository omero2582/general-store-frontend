import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetCategoriesQuery, useEditCategoryMutation, useDeleteCategoryMutation } from "@/store/api/apiSlice"
import { NewCategoryModal } from "./NewCategoryModal";
import { Spinner } from "@/components/Spinner";
import { categorySchema, TCategorySchema } from "@shared/dist/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { EditCategoryModal } from "./EditCategoryModal";
import { Description, DialogTitle } from "@radix-ui/react-dialog";

export default function ManageCategories() {
  const formHook = useForm<TCategorySchema>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      return out;
    }, categorySchema))
  });
  
  
  const {data, isFetching, error} = useGetCategoriesQuery();
  const [editCategory, resEditCategory] = useEditCategoryMutation();
  const [deleteCategory, resDeleteCategory] = useDeleteCategoryMutation();

  if(error){
    const {user, ...rest} = error?.data || {}
    return (
      <pre>{JSON.stringify({...rest}, null, 2)}</pre>
    )
  }

  if(isFetching){
    return (
      <Spinner className='mt-[10px] text-neutral-700 w-[60px] h-auto'/>
    )
  }


  return (
    <>
      <div className="grid grid-flow-col justify-start gap-4 items-end">
        <h2 className="text-[22px] font-[500]">My Categories</h2>
        <Dialog>
          <DialogTrigger className="text-white text-[1rem] font-[500] bg-blue-600 px-4 py-[6px] rounded">
            New +
          </DialogTrigger>
          <DialogContent className="max-w-[400px]">
            <NewCategoryModal formHook={formHook}/>
          </DialogContent>
        </Dialog>
      </div>
      {/* <div>
        {data && data.categories.map(c => (
          <div className="grid grid-flow-col">
            <p>{c.name}</p>
            <div >
              <button
                className="px-[10px] py-[2px] bg-gray-800 rounded-md text-gray-50"
              >
                Edit
              </button>
              <button
                className="px-[10px] py-[2px] bg-red-500 rounded-md text-gray-50"
                onClick={() => deleteCategory(c.id)}
                >
                Delete
              </button>
            </div>
            <p>{c.createdBy?.username}</p>
          </div>
        ))}
      </div> */}
       { data && 
       <Table>
        <TableCaption>A list of your categories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[240px]">Name</TableHead>
            <TableHead className="">Actions</TableHead>
            <TableHead>Creator</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.categories.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="space-x-[4px]"> 
                {/* <button
                  className="px-[10px] py-[2px] bg-gray-800 rounded-md text-gray-50"
                >
                  Edit
                </button> */}
                <Dialog>
                  <DialogTrigger className="text-[0.95rem] px-[12px] py-[4px] bg-gray-800 rounded-md text-gray-50">
                    Edit
                  </DialogTrigger>
                  <DialogContent className="max-w-[400px]">
                    <DialogTitle className="sr-only">Edit Category</DialogTitle>
                    <Description className="sr-only">{`Edit the Category: ${c.name}`}</Description>
                    <EditCategoryModal category={c}/>
                  </DialogContent>
                </Dialog>
                <button
                  className="text-[0.95rem] px-[12px] py-[4px] bg-red-500 rounded-md text-gray-50"
                  onClick={() => deleteCategory(c.id)}
                  >
                  Delete
                </button>
              </TableCell>
              <TableCell>{c.createdBy?.username} ({c.createdBy?.userLevel})</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}
    </>
    
  )
}


// export function CategoryRow({category, deleteCategory}) {
//   return (
//     <TableRow key={category.id}>
//       <TableCell className="font-medium">{category.name}</TableCell>
//       <TableCell> 
//         <button
//           className="px-[10px] py-[2px] bg-gray-800 rounded-md text-gray-50"
//         >
//           Edit
//         </button>
//         <button
//           className="px-[10px] py-[2px] bg-red-500 rounded-md text-gray-50"
//           onClick={() => deleteCategory(category.id)}
//           >
//           Delete
//         </button>
//       </TableCell>
//       <TableCell>{category.createdBy?.username}</TableCell>
//     </TableRow>
//   )
// }
