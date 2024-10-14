import { AspectRatio } from "@/components/AspectRatio";
import NumberInput from "@/components/NumberInput/NumberInput";
import { useAddCartProductMutation, useGetProductQuery } from "@/store/api/apiSlice"
import { useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from 'react-star-ratings';


export default function ProductDetail() {

  const [quantityBuy, setQuantityBuy] = useState(1);

  // const addToCart = async () => {
  //   setIsSucessAdded(false);
  //   await handleAdd(item, value);
  //   setIsSucessAdded(true);
  // }

  const { id } = useParams();
  const {data, isLoading, isError} = useGetProductQuery(id);

  const [addCartProduct, resAddCartProduct] = useAddCartProductMutation();

  if(isLoading){
    return (
      <>Loading...</>
    )
  }

  if(isError){
    return (
      <>Error</>
    )
  }

  console.log(data)
  const {name, description, price, averageRating, numRatings, images} = data?.product || {}
// const averageRating = 4.7
  return (
    <div className=" mt-8 grid sm:grid-flow-col gap-x-[24px] justify-center justify-items-center">
      <div className="w-[250px] h-[250px] bg-stone-100 mb-[10px]">
        <AspectRatio ratio={1} className="flex place-content-center">
          <img src={images[0].url} className="object-contain"/>
        </AspectRatio >
      </div>
      <div className="grid gap-y-[5px] max-w-[400px]">
        <h1 className="text-[1.4rem] leading-snug">{name}</h1>
        <p className="text-[1.8rem] font-[500]">${price}</p>
        <div className=" grid grid-flow-col justify-start content-center">
              <span>{averageRating}</span>
              <div className="mt-[-2px] ml-[5px] mr-[8px]">
                <StarRatings
                    rating={averageRating}
                    numberOfStars={5}
                    name='rating'
                    starDimension='20px'
                    starSpacing='0px'
                    starRatedColor='#E78A2E'
                    // starEmptyColor='#acb9d2'
                    starHoverColor='blue'
                    changeRating={(newRating: number) => console.log('CHANGE', newRating)}
                />
              </div>
              <span>{new Intl.NumberFormat('en').format(numRatings)} ratings</span>
            </div>
        <NumberInput value={quantityBuy} setValue={setQuantityBuy}/>
        <button
          onClick={() => addCartProduct({productId: id, quantity: quantityBuy})}
          className="w-[117px] h-[36px] bg-yellow-400"
        >
          Add to Cart
        </button>
        <div className="mt-[10px]">
            <p className="font-[700] text-[1.1rem]">Product Description</p>
           <p>{description}</p>
          </div>
      </div>
    </div>
  )
}
