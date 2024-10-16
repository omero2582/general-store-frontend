import { getPrice } from "@/lib/utils";
import { useGetCartQuery } from "@/store/api/apiSlice"
import { Link } from "react-router-dom";
import CartItem from "./CartItem";


export default function Cart() {
  const {data, isLoading, isError} = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: 20,
    // similar to Tansatck Query staleTime
  });


  if(isLoading){
    return (<>Loading...</>)
  }

  if(isError){
    return (<>Error</>)
  }

  return (
    <div className="bg-stone-100">
      <h1 className="text-center font-medium text-[1.8rem] pt-[10px]">Your Cart</h1>
      {data?.cart?.items?.length <= 0 ? 
      <p className="text-center pt-[6px]">Your Cart is empty. Check out <Link to={'/store'} className="text-blue-500">the shop</Link> and add some items</p>
      :
      <>
      <div className={`bg-purple-400 justify-center grid grid-cols-[minmax(0px,_630px),_minmax(0px,_100px)] `}>
        <div></div>
        <p className="text-[1.15rem] font-medium">Item Total</p>
      </div>
      <div className="bg-red-400 space-y-2 grid justify-center ">
      {data?.cart?.items?.map(item => (<CartItem item={item}/>))}
        </div>
        <div className={`max-w-[730px] mx-auto bg-yellow-400`}>
          <p className="text-end font-medium text-[1.15rem]">Subtotal: {getPrice(data.cart.total)}</p>
        </div>
        </>
      }
    </div>
  )
}
