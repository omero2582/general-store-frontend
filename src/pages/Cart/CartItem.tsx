import { AspectRatio } from '@/components/AspectRatio';
import NumberInput from '@/components/NumberInput/NumberInput';
import { getPrice } from '@/lib/utils';
import { useDeleteCartProductMutation, useEditCartProductMutation } from '@/store/api/apiSlice';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function CartItem({item}) {
  const {product, quantity, itemTotal} = item
  const {name, description, price, images, id} = product || {};
  const mainImage = images.find(i => i?.order === 1)

  const [editCartProduct, resEditCartProduct] = useEditCartProductMutation();
  const [deleteCartProduct, resDeleteCartProduct] = useDeleteCartProductMutation();


  const [quantityState, setQuantityState] = useState(quantity);
  // const handleChangeValue = (value) => editCartProduct({productId: id, quantity:value})

  return(
    <div className={`border-slate-700 pl-1 border-[3px] leading-snug overflow-hidden rounded items-center justify-center grid grid-cols-[minmax(0px,_130px),_minmax(0px,_450px),_minmax(0px,_100px)]`}>
      <Link to={`/product/${id}`}>
        <div className="bg-stone-100">
          <AspectRatio ratio={1} className="flex place-content-center">
            <img src={mainImage.url} className="object-contain"/>
          </AspectRatio >
        </div>
      </Link>
      <div className="py-2 pl-4 pr-2">
        <Link to={`/product/${id}`}><p className="line-clamp-2 font-medium text-[1.2rem] hover:underline">{name}</p></Link>
        <p className='line-clamp-2'>{description}</p>
        <p>{getPrice(price)}</p>
        <NumberInput className={'mt-1 mb-[2px]'} value={quantityState} setValue={setQuantityState} isDisabled={resEditCartProduct.isLoading}/>
        <div className='space-x-3'>
          <button disabled={resEditCartProduct.isLoading} onClick={() => deleteCartProduct(id) }  className="disabled:no-underline disabled:text-stone-400 hover:underline text-blue-700 font-medium">
           Remove
          </button>
          {quantity !== quantityState &&
          <button disabled={resEditCartProduct.isLoading} onClick={() => editCartProduct({productId: id, quantity: quantityState})} className="disabled:no-underline disabled:text-stone-400 hover:underline text-blue-700 font-medium">
            Submit
          </button>
          }
        </div>
      </div>
      <p className="self-center text-[1.1rem] font-medium text-center">
        {quantity === quantityState ? getPrice(itemTotal) : 'Submit Quantity'}
      </p>
      </div>
    )
}
