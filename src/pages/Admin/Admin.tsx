import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Products from "./Products";
import { NewProductModal } from "./NewProductModal";
import { useGetProductsQuery } from "@/api/productsApiSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchemaNoImage, TProductSchemaNoImage } from "@shared/schemas/schemas";
import { z } from "zod";

export default function Admin() {
  const formHook = useForm<TProductSchemaNoImage>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (emppty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      console.log('Values', out);
      return out;
    }, productSchemaNoImage))
  });
  return (
    <div>
      <h1 className="text-[30px] font-[500] text-center">Admin Panel</h1>
      <div className="grid grid-flow-col justify-start gap-4 items-end">
        <h2 className="text-[22px] font-[500]">My Products</h2>
        <Dialog>
          <DialogTrigger className="text-white text-[1rem] font-[500] bg-blue-600 px-4 py-[6px] rounded">
            New +
          </DialogTrigger>
          <DialogContent className="max-w-[780px]">
            <NewProductModal formHook={formHook}/>
          </DialogContent>
        </Dialog>
      </div>
      <Products showAdmin={true}/>
    </div>
  )
}



