import { getPrice } from "@/lib/utils";
import { useGetCartQuery } from "@/store/api/apiSlice"
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { Spinner } from "@/components/Spinner";


export default function Cart() {
  const {data, isFetching, isError} = useGetCartQuery();
    
  return (
    <div className="bg-stone-100 min-h-full">
      <h1 className="text-center font-medium text-[1.8rem] pt-[13px] leading-tight">Your Cart</h1>
      {isFetching ?
      <Spinner className='mt-[10px] text-neutral-700 w-[60px] h-auto'/>
      : isError ?
      <>Error</>
      : data?.cart?.items?.length > 0 ?
      <>
          <div className={`justify-center grid grid-cols-[minmax(0px,_580px),_minmax(0px,_100px)] `}>
            <div></div>
            <p className="text-[1.15rem] font-medium text-center">Item Total</p>
          </div>
          <div className="space-y-2 grid justify-center ">
          {data?.cart?.items?.map(item => (<CartItem item={item}/>))}
          </div>
          {/* <div className={`max-w-[680px] mx-auto bg-yellow-400`}> */}
          <div className={`mt-2 bg-amber-300 text-[1.15rem] justify-center grid grid-cols-[minmax(0px,_580px),_minmax(0px,_100px)] `}>
            <p className="text-end">Subtotal: </p>
            <p className="font-medium text-center">{getPrice(data.cart.total)}</p>
          </div>
        </>
      : <p className="text-center pt-[6px]">Your Cart is empty. Check out <Link to={'/store'} className="text-blue-500">the shop</Link> and add some items</p>
    }
    </div>
  )
}
