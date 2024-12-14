import { useGetProductsQuery } from "@/store/api/apiSlice";
import Products from "../Products";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { Spinner } from "@/components/Spinner";
import { useLocation, useSearchParams } from "react-router-dom";

export default function Shop (){
  
  const location = useLocation();

  const productsQuery = useGetProductsQuery({query: location.search});

  const {error, data, isLoading} = productsQuery;
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
  <div className='py-10'>
    <h1 className="sr-only">Shop</h1>
    {/*<button className="grid justify-start">
      <div className="grid grid-flow-col bg-amber-400 px-2 py-1 border-[3px] border-blue-600">
        <HiOutlineAdjustmentsHorizontal size={'1.5rem'}/>
        <p className="text-[1rem]">Sort & Filter</p>
      </div>
      <div className="py-5"/> 
    </button> */}
    <Products query={productsQuery}/>
  </div>
  )
}