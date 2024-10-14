import { useDeleteCartProductMutation, useGetCartQuery } from "@/store/api/apiSlice"


export default function Cart() {
  const {data, isLoading, isError} = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: 20,
    // similar to Tansatck Query staleTime
  });
  const [deleteCartProduct, resDeleteCartProduct] = useDeleteCartProductMutation();

  if(isLoading){
    return (<>Loading...</>)
  }

  if(isError){
    return (<>Error</>)
  }

  return (
    <div className="bg-stone-100">
      <h1>Cart</h1>
      <div className="bg-purple-400 justify-center grid grid-cols-[minmax(0px,_500px),_minmax(0px,_100px)] ">
        <div></div>
        <p className="text-[1.15rem] font-medium">Item Total</p>
      </div>
      <div className="bg-red-400 space-y-2 grid justify-center ">
      {data.cart.items.map(({product, quantity, itemTotal}) => {
        const {name, description, price, images, id} = product || {};
        const mainImage = images.find(i => i?.order === 1)
        return(
          <div className="overflow-hidden rounded bg-blue-200 justify-center grid grid-cols-[minmax(0px,_500px),_minmax(0px,_100px)]">
            <div className=" bg-neutral-50 px-4 py-2">
              <p className="font-medium text-[1.2rem]">{name}</p>
              <p>{description}</p>
              <p>${price}</p>
              <p>quantity: {quantity}</p>
              {/* <img>{mainImage}</img> */}
              <button onClick={() => deleteCartProduct(id) } className="text-blue-600 font-medium">Remove</button>
            </div>
            <p className="bg-green-300 self-center text-[1.1rem] font-medium">${itemTotal}</p>
          </div>
          )})}
        </div>
        <div className="max-w-[600px] mx-auto bg-yellow-400">
          <p className="text-end font-medium text-[1.15rem]">Subtotal: ${data.cart.total}</p>
        </div>
    </div>
  )
}
