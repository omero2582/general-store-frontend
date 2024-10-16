import { useGetProductsQuery } from "@/store/api/apiSlice";
import Products from "../Products";

export default function Shop (){
  const productsQuery = useGetProductsQuery(null);
  return (
  <div className='pt-[24px]'>
    <h1 className="sr-only">Shop</h1>
    <Products query={productsQuery}/>
  </div>
  )
}