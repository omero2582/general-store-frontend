import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Products from "../Products";
import { NewProductModal } from "./NewProductModal";
import { useGetProductsAdminQuery, useGetProductsQuery } from "@/store/api/apiSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchemaNoImage, TProductSchemaNoImage } from "@shared/schemas/schemas";
import { z } from "zod";
import { useAppSelector } from "@/store/store";
import { useSignInGoogleQuery } from "@/store/api/authSlice";
import { useEffect } from "react";

export default function Admin() {
  // const user = useAppSelector((state) => state.user.user);

  // const response = useSignInGoogleQuery(null, {skip: user}
  // useEffect(() => {
  //   const handleGoogleSignIn = () => {
  //     window.location.href = 'http://localhost:3000/api/auth/google';
  //   };
  //   if(!user){
  //     handleGoogleSignIn();
  //   }
  // }, [user])
  // TODO above

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
  const productsAdminQuery = useGetProductsAdminQuery();

  const {user, ...rest} = productsAdminQuery?.error?.data || {}

  return (
    <div>
      <h1 className="text-[30px] font-[500] text-center">Admin Panel</h1>
      {productsAdminQuery.error &&
      <pre>{JSON.stringify({...rest}, null, 2)}</pre>
      } 
      {!productsAdminQuery.error && productsAdminQuery.data &&
      <>
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
        <Products showAdmin={true} query={productsAdminQuery}/>  
      </>
    }
      
    </div>
  )
}



