import { AspectRatio } from "@/components/AspectRatio";
import NumberInput from "@/components/NumberInput/NumberInput";
import { Spinner } from "@/components/Spinner";
import { getPrice } from "@/lib/utils";
import { useAddCartProductMutation, useAddOrEditProductRatingMutation, useDeleteProductRatingMutation, useGetProductQuery } from "@/store/api/apiSlice"
import { useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from 'react-star-ratings';


export default function ProductDetail() {

  const [quantityBuy, setQuantityBuy] = useState(1);

  const { id } = useParams();
  const {data, isLoading, error} = useGetProductQuery({id});

  const [addCartProduct, resAddCartProduct] = useAddCartProductMutation();
  const [addOrEditProductRating] = useAddOrEditProductRatingMutation();
  const [deleteProductRating] = useDeleteProductRatingMutation();

  // dec 12 multi images
  
  const [selectedImageId, setSelectedImageId] = useState(1);
  
  //

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


  console.log(data)
  const {name, description, price, averageRating, numRatings, images} = data?.product || {}
  // const averageRating = 4.7
  // dec 12
  const selectedImage = images.find(i => i.order === selectedImageId) || images[0];
  //


  const handleChangeRating = (newRating: number) => {
    addOrEditProductRating({id, body: {rating: newRating}});
  }



  return (
    <div className=" mt-8 grid sm:grid-flow-col gap-x-[24px] justify-center justify-items-center">
      <div>
        <div className="w-[250px] h-[250px] bg-stone-100 mb-[10px]">
          <AspectRatio ratio={1} className="flex place-content-center">
            <img src={selectedImage.url} className="object-contain"/>
          </AspectRatio >
        </div>
        <div className="py-1 grid grid-cols-[repeat(3,_auto)] justify-center gap-[10px]">
        {[...images].sort((a, b) => a?.order - b?.order).map(f => (
          <div
            className={`${selectedImageId === f.order ? 'ring-[#007185] ring-[3px]' : ''} bg-stone-100 grid w-[70px] h-[70px] rounded-md overflow-hidden`}
            // onClick={() => setSelectedImageId(f.order)}
            onMouseEnter={() => setSelectedImageId(f.order)}
          >
            {f?.url &&
            <AspectRatio ratio={1} className="cursor-pointer flex place-content-center">
              <img src={f?.url as string} alt={`image ${f.order} preview`} className="object-cover"/>
            </AspectRatio >
            }
          </div> 
        ))}
        </div>
      </div>
      <div className="content-start grid gap-y-[5px] max-w-[400px]">
        <h1 className="text-[1.4rem] leading-snug">{name}</h1>
        <p className="text-[1.8rem] font-[500]">{getPrice(price)}</p>
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
                changeRating={handleChangeRating}
            />
          </div>
          <span>{new Intl.NumberFormat('en').format(numRatings)} ratings</span>
        </div>
        <NumberInput value={quantityBuy} setValue={setQuantityBuy}/>
        <button
          disabled={resAddCartProduct.isLoading}
          onClick={() => addCartProduct({ body: {productId: id, quantity: quantityBuy}})}
          className="w-[117px] h-[36px] bg-yellow-400 rounded  disabled:bg-yellow-200"
        >
          {resAddCartProduct.isLoading ?
            <Spinner className='w-auto h-auto'/> 
            : 'Add to Cart'
          }
        </button>
        <div className="mt-[10px]">
            <p className="font-[700] text-[1.1rem]">Product Description</p>
           <p>{description}</p>
          </div>
      </div>
    </div>
  )
}
