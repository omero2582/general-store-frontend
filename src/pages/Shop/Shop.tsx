import { useGetProductsQuery } from "@/store/api/apiSlice";
import Products from "../Products";

export default function Shop (){
  const productsQuery = useGetProductsQuery(null);
  return (
  <div className=''>
    <h1>Shop</h1>
    <Products query={productsQuery}/>
  </div>
  )
}