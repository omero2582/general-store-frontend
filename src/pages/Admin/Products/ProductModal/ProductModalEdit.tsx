import React, { useState } from 'react'
import { ProductModal } from './ProductModal'
import { productSchemaNoImage, TProductSchemaNoImage } from '@shared/dist/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { DialogContent } from '@/components/ui/dialog';
import { Description, DialogTitle } from '@radix-ui/react-dialog';
import { useAddProductPresignedUrlMutation, useAddProductSaveToDBMutation, useAddProductUploadImageMutation } from '@/store/api/apiSlice';

export default function ProductModalEdit({product}) {
  const formHookReturn = useForm<TProductSchemaNoImage>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      console.log('Values', out);
      return out;
    }, productSchemaNoImage)),
    defaultValues: {
      ...product,
      categories: product?.categories?.map(c => c.id) || [], 
    }
  });

  
  //TODO TODO - maybe everythingbelow  should be redux state instead
  // Files State  
  type FileData = {
    file: File;
    preview: string | ArrayBuffer | null;
    order: number;
  }
  const [fileData, setFileData] = useState<FileData[]>(() => {
    if(product){
      console.log('Loading product images')
      return product.images.map(i => {
       const {url, publicId, order} = i;
       return {file: undefined, preview: i.url, order} 
      })
    }
    // TODO above is for EDIT MODAL
    
    return [];
  });
  
  
  const {reset} = formHookReturn;
   // Submit Form
   const [addProductPresignedUrl, resAddProductPresignedUrl] = useAddProductPresignedUrlMutation();
   const [addProductUploadImage, resAddProductUploadImage] = useAddProductUploadImageMutation();
   const [addProductSaveToDB, resAddProductSaveToDB] = useAddProductSaveToDBMutation();
 

   const onSubmit = async (body: TProductSchemaNoImage) => {
     console.log('SUBMIT', body);
 
     if (!fileData[0]?.file) { 
       alert("Please add an image file");
       return;
     }
 
     // Note, in RTK Query calls, using uwrap() makes them throw err on failure.
     // Otherwise they dont throw and instead return a .data and .error properties
     try {
       // 1- presignedUrl
       const resultPresignedUrl = await addProductPresignedUrl(body).unwrap();
 
       // 2- Add file to 2nd request direct image upload
       const {cloudname, options} = resultPresignedUrl;
       const formData = new FormData();
       formData.append('file', fileData[0].file);
       // Add to this req, the same options we used in the backend to presign the url
       Object.entries(options).forEach(([key, value]) => {
         formData.append(key, value);
       });
 
       const resultUploadFile = await addProductUploadImage(formData).unwrap();
       
       // 3- save document to DB including the files we uploaded in step 2
       const {public_id} = resultUploadFile;
       await addProductSaveToDB({
         ...body, images: [{order: 1, imageId: public_id}]
       }).unwrap();
       
       reset(); // clear inputs
       setFileData([])
       // refetch(); // dont need this, we simply invalidate the products call on that enpoint def
     }catch(err){
       console.log('err catch in new product submit', err);
     }
   }


  return (
    <DialogContent className="max-w-[780px]">
      <DialogTitle className="sr-only">Edit Product</DialogTitle>
      <Description className="sr-only">{`Edit Product`}</Description>
      <ProductModal
        formHookReturn={formHookReturn}
        onSubmit={onSubmit}
        name={'Edit Product'}
        fileData={fileData}
        setFileData={setFileData}
        
      />
    </DialogContent>
  )
}
