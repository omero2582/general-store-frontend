import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Products from "./Products";
import { NewProductModal } from "./NewProductModal";
import { useGetProductsQuery } from "@/api/productsApiSlice";

export default function Admin() {
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
            <NewProductModal/>
          </DialogContent>
        </Dialog>
      </div>
      <Products showAdmin={true}/>
    </div>
  )
}



