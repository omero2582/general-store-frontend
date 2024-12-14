import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useGetProductsAdminQuery } from '@/store/api/apiSlice';
import { NewProductModal } from './NewProductModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchemaNoImage, TProductSchemaNoImage } from '@shared/dist/schemas';
import { z } from "zod";
import Products from "../../Products";
import { Spinner } from '@/components/Spinner';
import ProductModalNew from './ProductModal/ProductModalNew';
import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

export default function ManageProducts() {

  const formHook = useForm<TProductSchemaNoImage>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      console.log('Values', out);
      return out;
    }, productSchemaNoImage))
  });
  
  // TODO, maybe move the query inside of Produycts, then toggle between
  // the adminProductQUery or the non-admin one based on 'showAdmin'
  // The only problem with that, is that I still want the hook here so that I can
  // conditionally render the entire component differently depending on error like I do below
  const location = useLocation();
  const productsAdminQuery = useGetProductsAdminQuery({query: location.search});
  
  const {error, data, isLoading} = productsAdminQuery;
  
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
    <>
      <div className="grid grid-flow-col justify-start gap-4 items-end">
        <h2 className="text-[22px] font-[500]">My Products</h2>
          <ProductModalNew>
            <DialogTrigger className="text-white text-[1rem] font-[500] bg-blue-600 px-4 py-[6px] rounded">
              New +
            </DialogTrigger>
          </ProductModalNew>
      </div>
      <Products showAdmin={true} query={productsAdminQuery}/>  
    </>
  )
}
