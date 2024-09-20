import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Products from "./Products";
import { NewProductModal } from "./NewProductModal";
import { useGetProductsQuery } from "@/api/productsApiSlice";

export default function Admin() {
  const {data, refetch} = useGetProductsQuery();
  // TODO move this into Products, and manage/fix RTK Query tags so that
  // it automatically invalidates this query when I submit new product
  // (I think this all might already be ready/done)
  
  return (
    <div>
      <h1 className="text-[30px] font-[500] text-center">Admin Panel</h1>
      <div className="grid grid-flow-col justify-start gap-4 items-end">
        <h2 className="text-[22px] font-[500]">My Products</h2>
        <Dialog>
          <DialogTrigger className="text-white text-[1rem] font-[500] bg-blue-600 px-4 py-[6px] rounded">
            New +
          </DialogTrigger>
          <DialogContent>
            <NewProductModal refetch={refetch}/>
          </DialogContent>
        </Dialog>
      </div>
      <Products data={data}/>
    </div>
  )
}



