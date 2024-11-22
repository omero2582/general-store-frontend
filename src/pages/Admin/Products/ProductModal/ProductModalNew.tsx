import React, { useState } from 'react'
import { ProductModal } from './ProductModal'
import { productSchemaNoImage, TProductSchemaNoImage } from '@shared/dist/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { DialogContent } from '@/components/ui/dialog';
import { Description, DialogTitle } from '@radix-ui/react-dialog';
import { useAddProductPresignedUrlMutation, useAddProductSaveToDBMutation, useAddProductUploadImageMutation } from '@/store/api/apiSlice';

export default function ProductModalNew() {
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
      categories:  [], 
    }
  });

  
  //TODO TODO - maybe everythingbelow  should be redux state instead
  // Files State  
  type FileData = {
    file: File;
    preview: string | ArrayBuffer | null;
    order: number;
    publicId?: string;
  }
  const [fileData, setFileData] = useState<FileData[]>([]);
  
  
  const {reset} = formHookReturn;
   // Submit Form
   const [addProductPresignedUrl, resAddProductPresignedUrl] = useAddProductPresignedUrlMutation();
   const [addProductUploadImage, resAddProductUploadImage] = useAddProductUploadImageMutation();
   const [addProductSaveToDB, resAddProductSaveToDB] = useAddProductSaveToDBMutation();
 

   const onSubmit = async (body: TProductSchemaNoImage) => {
     console.log('SUBMIT', body);
 
    //  const fileLimit = 1;
    //  const filesToSubmit = fileData.slice(0, fileLimit);
     if (!fileData[0]?.file) { 
    // if (!filesToSubmit[0]?.file) { 
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

       //
       const filesToUploadToCloudinary : FileData[] = [];
       const filesAlreadyUploadedBefore : FileData[] = [];
       fileData.forEach(f => {
        if('url' in f){
          filesAlreadyUploadedBefore.push(f)
        }else{
          filesToUploadToCloudinary.push(f)
        }
      })

      console.log('FILES TO UPOAD TO CLOUDINARY', filesToUploadToCloudinary);
       

      const filesUploaded = await Promise.all(filesToUploadToCloudinary.map(async (f) => {
        const formData = new FormData();
        formData.append('file', f.file);
        // Add to this req, the same options we used in the backend to presign the url
        Object.entries(options).forEach(([key, value]) => {
          formData.append(key, value);
        });
  
        const resultUploadFile = await addProductUploadImage(formData).unwrap();
        // 3- save document to DB including the files we uploaded in step 2
        const {public_id} = resultUploadFile;
        return {
          // ...f, dont need this (file and preview)
          order: f.order,
          publicId: public_id,
        }
      }))
       
       const combinedImages = [...filesUploaded, ...filesAlreadyUploadedBefore ]
       console.log('COMBINED IMAGES', combinedImages);

       await addProductSaveToDB({
        //  ...body, images: [{order: 1, publicId: public_id}]
        ...body, images: combinedImages
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
      <DialogTitle className="sr-only">New Product</DialogTitle>
      <Description className="sr-only">{`Create New Product`}</Description>
      <ProductModal
        formHookReturn={formHookReturn}
        onSubmit={onSubmit}
        name={'New Product'}
        fileData={fileData}
        setFileData={setFileData}
        
      />
    </DialogContent>
  )
}
