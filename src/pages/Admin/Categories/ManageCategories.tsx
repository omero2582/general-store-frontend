import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetCategoriesQuery, useDeleteCategoryMutation, useGetCategoriesAdminQuery } from "@/store/api/apiSlice"
import { Spinner } from "@/components/Spinner";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import CategoryModalNew from "./CategoryModal/CategoryModalNew";
import CategoryModalEdit from "./CategoryModal/CategoryModalEdit";

export default function ManageCategories() {
  
  
  
  const {data, isLoading, error} = useGetCategoriesAdminQuery(undefined);
  const [deleteCategory] = useDeleteCategoryMutation();

  
  if(isLoading){
    return (
      <Spinner className='mt-[10px] text-neutral-700 w-[60px] h-auto'/>
    )
  }
  
  if(error){
    const {user, ...rest} = error?.data || {}
    return (
      <pre>{JSON.stringify({...rest}, null, 2)}</pre>
    )
  }

  return (
    <>
      <div className="grid grid-flow-col justify-start gap-4 items-center">
        <h2 className="text-[22px] font-[500] py-[6px] ml-2">My Categories</h2>
        <Dialog>
          <DialogTrigger className="text-white text-[1rem] font-[500] bg-blue-600 px-4 py-[6px] rounded">
            New +
          </DialogTrigger>
          <CategoryModalNew />
        </Dialog>
      </div>
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
                <Dialog>
                  <DialogTrigger className="text-[0.95rem] px-[12px] py-[4px] bg-gray-800 rounded-md text-gray-50">
                    Edit
                  </DialogTrigger>
                  <CategoryModalEdit category={c} key={c}/>
                </Dialog>
                <button
                  className="text-[0.95rem] px-[12px] py-[4px] bg-red-500 rounded-md text-gray-50"
                  onClick={() => deleteCategory({id: c.id})}
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
