import { useGetProductsQuery } from "@/store/api/apiSlice";
import Products from "../Products";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

export default function Shop (){
  const productsQuery = useGetProductsQuery(null);
  return (
  // <div className='pt-[24px]'>
  <div className=''>
    <h1 className="sr-only">Shop</h1>
    <button className="grid justify-start">
      <div className="grid grid-flow-col bg-amber-400 px-2 py-1 border-[3px] border-blue-600">
        <HiOutlineAdjustmentsHorizontal size={'1.5rem'}/>
        <p className="text-[1rem]">Sort & Filter</p>
      </div>
    </button>
    <Products query={productsQuery}/>
  </div>
  )
}